/*
 * Copyright (c) 2021 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.marklogic.hub.step.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.marklogic.client.datamovement.*;
import com.marklogic.client.ext.helper.LoggingObject;
import com.marklogic.hub.DatabaseKind;
import com.marklogic.hub.HubClient;
import com.marklogic.hub.util.DiskQueue;
import com.marklogic.hub.dataservices.JobService;
import com.marklogic.hub.dataservices.StepRunnerService;
import com.marklogic.hub.error.DataHubConfigurationException;
import com.marklogic.hub.flow.Flow;
import com.marklogic.hub.flow.impl.JobStatus;
import com.marklogic.hub.step.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

public class QueryStepRunner extends LoggingObject implements StepRunner {

    private static final int MAX_ERROR_MESSAGES = 10;
    private Flow flow;
    private int batchSize;
    private int threadCount;
    private Map<String, Object> combinedOptions;
    private int previousPercentComplete;
    private boolean stopOnFailure = false;
    private String jobId;
    private boolean isFullOutput = false;

    private String step = "1";

    private List<StepItemCompleteListener> stepItemCompleteListeners = new ArrayList<>();
    private List<StepItemFailureListener> stepItemFailureListeners = new ArrayList<>();
    private List<StepStatusListener> stepStatusListeners = new ArrayList<>();
    private Map<String, Object> stepConfig = new HashMap<>();
    private HubClient hubClient;
    private Thread runningThread = null;
    private DataMovementManager dataMovementManager = null;
    private QueryBatcher queryBatcher = null;
    private AtomicBoolean isStopped = new AtomicBoolean(false) ;
    private StepDefinition stepDef;

    public QueryStepRunner(HubClient hubClient) {
        this.hubClient = hubClient;
    }

    public StepRunner withFlow(Flow flow) {
        this.flow = flow;
        return this;
    }

    public StepRunner withStep(String step) {
        this.step = step;
        return this;
    }

    public StepRunner withJobId(String jobId) {
        this.jobId = jobId;
        return this;
    }

    public StepRunner withStepDefinition(StepDefinition stepDefinition){
        this.stepDef = stepDefinition;
        return this;
    }

    @Override
    public StepRunner withBatchSize(int batchSize) {
        this.batchSize = batchSize;
        return this;
    }

    @Override
    public StepRunner withThreadCount(int threadCount) {
        this.threadCount = threadCount;
        return this;
    }

    @Override
    public StepRunner withStopOnFailure(boolean stopOnFailure) {
        this.stopOnFailure = stopOnFailure;
        return this;
    }

    @Override
    @SuppressWarnings("unchecked")
    public StepRunner withRuntimeOptions(Map<String, Object> runtimeOptions) {
        if(flow == null){
            throw new DataHubConfigurationException("Flow has to be set before setting options");
        }
        this.combinedOptions = StepRunnerUtil.makeCombinedOptions(this.flow, this.stepDef, this.step, runtimeOptions);
        return this;
    }

    @Override
    public StepRunner withStepConfig(Map<String, Object> stepConfig) {
        this.stepConfig = stepConfig;
        return this;
    }

    @Override
    public StepRunner onItemComplete(StepItemCompleteListener listener) {
        this.stepItemCompleteListeners.add(listener);
        return this;
    }

    @Override
    public StepRunner onItemFailed(StepItemFailureListener listener) {
        this.stepItemFailureListeners.add(listener);
        return this;
    }

    @Override
    public StepRunner onStatusChanged(StepStatusListener listener) {
        this.stepStatusListeners.add(listener);
        return this;
    }

    @Override
    public void awaitCompletion() {
        try {
            awaitCompletion(Long.MAX_VALUE, TimeUnit.DAYS);
        } catch (InterruptedException | TimeoutException e) {
        }
    }

    @Override
    public void awaitCompletion(long timeout, TimeUnit unit) throws InterruptedException,TimeoutException {
        if (runningThread != null) {
            runningThread.join(unit.convert(timeout, unit));
            if (runningThread.getState() != Thread.State.TERMINATED) {
                if ( dataMovementManager != null && queryBatcher != null ) {
                    dataMovementManager.stopJob(queryBatcher);
                }
                runningThread.interrupt();
                throw new TimeoutException("Timeout occurred after "+timeout+" "+unit.toString());
            }
        }
    }

    private boolean jobOutputIsEnabled() {
        if (combinedOptions != null && combinedOptions.containsKey("disableJobOutput")) {
            return !Boolean.parseBoolean(combinedOptions.get("disableJobOutput").toString());
        }
        return true;
    }

    @Override
    public RunStepResponse run() {
        runningThread = null;
        if(stepConfig.get("batchSize") != null){
            this.batchSize = (int) stepConfig.get("batchSize");
        }
        if(stepConfig.get("threadCount") != null) {
            this.threadCount = (int) stepConfig.get("threadCount");
        }
        if(stepConfig.get("stopOnFailure") != null){
            this.withStopOnFailure(Boolean.parseBoolean(stepConfig.get("stopOnFailure").toString()));
        }
        RunStepResponse runStepResponse = StepRunnerUtil.createStepResponse(flow, step, jobId);
        if (combinedOptions == null) {
            combinedOptions = new HashMap<>();
        } else {
            if (combinedOptions.get("fullOutput") != null) {
                isFullOutput = Boolean.parseBoolean(combinedOptions.get("fullOutput").toString());
            }
        }

        combinedOptions.put("flow", this.flow.getName());

        // Needed to support constrainSourceQueryToJob
        combinedOptions.put("jobId", jobId);

        if (jobOutputIsEnabled()) {
            JobService.on(hubClient.getJobsClient()).startStep(jobId, step, flow.getName(), new ObjectMapper().valueToTree(this.combinedOptions));
        }

        DiskQueue<String> uris;
        try {
            final String sourceDatabase = combinedOptions.get("sourceDatabase") != null ?
                StepRunnerUtil.objectToString(combinedOptions.get("sourceDatabase")) :
                hubClient.getDbName(DatabaseKind.STAGING);

            logger.info(String.format("Collecting items for step '%s' in flow '%s'", this.step, this.flow.getName()));
            uris = runCollector(sourceDatabase);
        } catch (Exception e) {
            runStepResponse.setCounts(0,0, 0, 0, 0)
                .withStatus(JobStatus.FAILED_PREFIX + step);
            StringWriter errors = new StringWriter();
            e.printStackTrace(new PrintWriter(errors));
            runStepResponse.withStepOutput(errors.toString());
            if (jobOutputIsEnabled()) {
                JsonNode jobDoc = JobService.on(hubClient.getJobsClient()).finishStep(jobId, step, JobStatus.FAILED_PREFIX + step, runStepResponse.toObjectNode());
                try {
                    return StepRunnerUtil.getResponse(jobDoc, step);
                } catch (Exception ignored) {
                }
            }
            return runStepResponse;
        }

        return this.runHarmonizer(runStepResponse, uris);
    }

    @Override
    public void stop() {
        isStopped.set(true);
        if(queryBatcher != null) {
            dataMovementManager.stopJob(queryBatcher);
        }
    }

    @Override
    public RunStepResponse run(Collection<String> uris) {
        runningThread = null;
        if (jobOutputIsEnabled()) {
            JobService.on(hubClient.getJobsClient()).startStep(jobId, step, flow.getName(), new ObjectMapper().valueToTree(this.combinedOptions));
        }
        RunStepResponse runStepResponse = StepRunnerUtil.createStepResponse(flow, step, jobId);
        return this.runHarmonizer(runStepResponse,uris);
    }

    @Override
    public int getBatchSize(){
        return this.batchSize;
    }

    private DiskQueue<String> runCollector(String sourceDatabase) {
        SourceQueryCollector collector = new SourceQueryCollector(hubClient, sourceDatabase);

        stepStatusListeners.forEach((StepStatusListener listener) -> {
            listener.onStatusChange(this.jobId, 0, JobStatus.RUNNING_PREFIX + step, 0, 0,  "running collector");
        });

        return !isStopped.get() ? collector.run(this.flow.getName(), step, combinedOptions) : null;
    }

    private RunStepResponse runHarmonizer(RunStepResponse runStepResponse, Collection<String> uris) {
        StepMetrics stepMetrics = new StepMetrics();
        final int urisCount = uris != null ? uris.size() : 0;

        stepStatusListeners.forEach((StepStatusListener listener) -> {
            listener.onStatusChange(runStepResponse.getJobId(), 0, JobStatus.RUNNING_PREFIX + step, 0,0, "starting step execution");
        });

        if (urisCount == 0) {
            logger.info("No items found to process");
            final String stepStatus = isStopped.get() ?
                JobStatus.CANCELED_PREFIX + step :
                JobStatus.COMPLETED_PREFIX + step;

            stepStatusListeners.forEach((StepStatusListener listener) -> {
                listener.onStatusChange(runStepResponse.getJobId(), 100, stepStatus, 0, 0,
                    (stepStatus.contains(JobStatus.COMPLETED_PREFIX) ? "collector returned 0 items" : "job was stopped"));
            });
            runStepResponse.setCounts(0,0,0,0,0);
            runStepResponse.withStatus(stepStatus);

            if (jobOutputIsEnabled()) {
                JsonNode jobDoc = JobService.on(hubClient.getJobsClient()).finishStep(jobId, step, stepStatus, runStepResponse.toObjectNode());
                try {
                    return StepRunnerUtil.getResponse(jobDoc, step);
                }
                catch (Exception ex) {
                    logger.warn("Unexpected error getting step response: " + ex.getMessage(), ex);
                    return runStepResponse;
                }
            } else {
                return runStepResponse;
            }
        }

        double batchCount = Math.ceil((double) urisCount / (double) batchSize);
        if (batchCount == 1) {
            logger.info(format("Count of items collected: %d; will be processed in a single batch based on batchSize of %d", urisCount, batchSize));
        } else {
            logger.info(format("Count of items collected: %d; will be processed in %d batches based on batchSize of %d", urisCount, (int)batchCount, batchSize));
        }

        Vector<String> errorMessages = new Vector<>();

        // The client used here doesn't matter, given that a QueryBatcher is going to be constructed based on an
        // Iterator. It's the step options that determine where documents are written to.
        dataMovementManager = hubClient.getStagingClient().newDataMovementManager();

        final ObjectMapper objectMapper = new ObjectMapper();

        HashMap<String, JobTicket> ticketWrapper = new HashMap<>();

        Map<String,JsonNode> fullOutputMap = new HashMap<>();
        queryBatcher = dataMovementManager.newQueryBatcher(uris.iterator())
            .withBatchSize(batchSize)
            .withThreadCount(threadCount)
            .withJobId(runStepResponse.getJobId())
            .onUrisReady((QueryBatch batch) -> {
                try {
                    // Create the inputs for the processBatch DS
                    ObjectNode inputs = objectMapper.createObjectNode();
                    inputs.put("flowName", flow.getName());
                    inputs.put("stepNumber", step);
                    inputs.put("jobId", runStepResponse.getJobId());

                    // Make a copy of the calculated options and then add the items from this batch
                    Map<String, Object> batchOptions = new HashMap<>(combinedOptions);
                    batchOptions.put("uris", batch.getItems());
                    inputs.set("options", objectMapper.valueToTree(batchOptions));
                    logger.debug(String.format("Processing %d items in batch %d of %d", batch.getItems().length, batch.getJobBatchNumber(),(int) batchCount));
                    // Invoke the DS endpoint. A StepRunnerService is created based on the DatabaseClient associated
                    // with the batch to help distribute load, per DHFPROD-1172.
                    JsonNode jsonResponse = StepRunnerService.on(batch.getClient()).processBatch(inputs);
                    ResponseHolder response = objectMapper.readerFor(ResponseHolder.class).readValue(jsonResponse);

                    stepMetrics.getFailedEvents().addAndGet(response.errorCount);
                    stepMetrics.getSuccessfulEvents().addAndGet(response.totalCount - response.errorCount);
                    if (response.errors != null) {
                        if (errorMessages.size() < MAX_ERROR_MESSAGES) {
                            errorMessages.addAll(response.errors.stream().limit(MAX_ERROR_MESSAGES - errorMessages.size()).map(jsonNode -> StepRunnerUtil.jsonToString(jsonNode)).collect(Collectors.toList()));
                        }
                    }

                    if (isFullOutput && response.documents != null) {
                        // Using a try/catch. As of DH 5.1, the "fullOutput" feature is undocumented and untested, and
                        // the work for DHFPROD-3176 is to at least not throw an error if someone does set fullOutput=true.
                        // Note that the output is also not visible in QuickStart, but it can be seen when running a flow
                        // via Gradle.
                        try {
                            for (JsonNode node : response.documents) {
                                if (node.has("uri")) {
                                    fullOutputMap.put(node.get("uri").asText(), node);
                                }
                            }
                        } catch (Exception ex) {
                            logger.warn("Unable to add written documents to fullOutput map in RunStepResponse; cause: " + ex.getMessage());
                        }
                    }

                    // Prior to DHFPROD-5997 / 5.4.0, if the count of errors and total count of events were both zero,
                    // then the batch was considered to have failed. I don't think this could have possibly happened though
                    // prior to 5997. Now that 5997 can filter out items after they've been collected, failed batches is
                    // only incremented if there are actually errors (which seems intuitive too).
                    if (response.errorCount < 1) {
                        stepMetrics.getSuccessfulBatches().addAndGet(1);
                    } else {
                        stepMetrics.getFailedBatches().addAndGet(1);
                    }

                    int percentComplete = (int) (((double) stepMetrics.getSuccessfulBatchesCount() / batchCount) * 100.0);

                    if (percentComplete != previousPercentComplete && (percentComplete % 5 == 0)) {
                        previousPercentComplete = percentComplete;
                        stepStatusListeners.forEach((StepStatusListener listener) -> {
                            listener.onStatusChange(runStepResponse.getJobId(), percentComplete, JobStatus.RUNNING_PREFIX + step, stepMetrics.getSuccessfulEventsCount(), stepMetrics.getFailedEventsCount(), "");
                        });
                    }

                    if (stepItemCompleteListeners.size() > 0) {
                        response.completedItems.forEach((String item) -> {
                            stepItemCompleteListeners.forEach((StepItemCompleteListener listener) -> {
                                listener.processCompletion(runStepResponse.getJobId(), item);
                            });
                        });
                    }

                    if (stepItemFailureListeners.size() > 0) {
                        response.failedItems.forEach((String item) -> {
                            stepItemFailureListeners.forEach((StepItemFailureListener listener) -> {
                                listener.processFailure(runStepResponse.getJobId(), item);
                            });
                        });
                    }

                    if (stopOnFailure && response.errorCount > 0) {
                        JobTicket jobTicket = ticketWrapper.get("jobTicket");
                        if (jobTicket != null) {
                            dataMovementManager.stopJob(jobTicket);
                        }
                    }
                } catch (Exception e) {
                    if (errorMessages.size() < MAX_ERROR_MESSAGES) {
                        errorMessages.add(e.toString());
                    }
                    // if exception is thrown update the failed related metrics
                    stepMetrics.getFailedBatches().addAndGet(1);
                    stepMetrics.getFailedEvents().addAndGet(batch.getItems().length);

                    if (flow != null && flow.isStopOnError()) {
                        // Stop the job, and then we need to call processFailure to force the FlowRunner to stop the flow
                        JobTicket jobTicket = ticketWrapper.get("jobTicket");
                        if (jobTicket != null) {
                            dataMovementManager.stopJob(jobTicket);
                        }
                        stepItemFailureListeners.forEach((StepItemFailureListener listener) -> {
                            listener.processFailure(runStepResponse.getJobId(), null);
                        });
                    }
                }
            })
            .onQueryFailure((QueryBatchException failure) -> {
                stepMetrics.getFailedBatches().addAndGet(1);
                // In the event of a QueryBatchException, there's no QueryBatch, and thus we don't know the exact number
                // of items that failed. Best guess then is the value of batchSize.
                stepMetrics.getFailedEvents().addAndGet(batchSize);
            });

        if(! isStopped.get()) {
            logger.info(String.format("Starting processing of items for step '%s' in flow '%s'", this.step, this.flow.getName()));
            JobTicket jobTicket = dataMovementManager.startJob(queryBatcher);
            ticketWrapper.put("jobTicket", jobTicket);
        }

        runningThread = new Thread(() -> {
            queryBatcher.awaitCompletion();
            logger.info(String.format("Finished processing of items for step '%s' in flow '%s'", this.step, this.flow.getName()));

            // now that the job has completed we can close the resource
            if (uris instanceof DiskQueue) {
                ((DiskQueue<String>)uris).close();
            }

            String stepStatus = determineStepStatus(stepMetrics);

            stepStatusListeners.forEach((StepStatusListener listener) -> {
                listener.onStatusChange(runStepResponse.getJobId(), 100, stepStatus, stepMetrics.getSuccessfulEventsCount(), stepMetrics.getFailedEventsCount(), "");
            });

            dataMovementManager.stopJob(queryBatcher);

            runStepResponse.setCounts(urisCount, stepMetrics.getSuccessfulEventsCount(), stepMetrics.getFailedEventsCount(), stepMetrics.getSuccessfulBatchesCount(), stepMetrics.getFailedBatchesCount());
            runStepResponse.withStatus(stepStatus);
            if (errorMessages.size() > 0) {
                runStepResponse.withStepOutput(errorMessages);
            }
            if(isFullOutput) {
                runStepResponse.withFullOutput(fullOutputMap);
            }

            if (jobOutputIsEnabled()) {
                JsonNode jobDoc = null;
                try {
                    jobDoc = JobService.on(hubClient.getJobsClient()).finishStep(jobId, step, stepStatus, runStepResponse.toObjectNode());
                }
                catch (Exception e) {
                    logger.error(e.getMessage());
                }
                if(jobDoc != null) {
                    try {
                        RunStepResponse tempResp =  StepRunnerUtil.getResponse(jobDoc, step);
                        runStepResponse.setStepStartTime(tempResp.getStepStartTime());
                        runStepResponse.setStepEndTime(tempResp.getStepEndTime());
                    }
                    catch (Exception ex)
                    {
                        logger.error(ex.getMessage());
                    }
                }
            }
        });

        runningThread.start();
        return runStepResponse;
    }

    private String determineStepStatus(StepMetrics stepMetrics) {
        if (stepMetrics.getFailedEventsCount() > 0 && stopOnFailure) {
            // Re: DHFPROD-6720 - it is surprising that stop-on-error is only feasible when the undocumented
            // stopOnFailure option is used (it's actually documented for DHF 4, but not for DHF 5). If the
            // documented stopOnError option is used, then 'canceled' becomes the step status.
            return JobStatus.STOP_ON_ERROR_PREFIX + step;
        } else if( isStopped.get()){
            return JobStatus.CANCELED_PREFIX + step;
        } else if (stepMetrics.getFailedEventsCount() > 0 && stepMetrics.getSuccessfulEventsCount() > 0) {
            return JobStatus.COMPLETED_WITH_ERRORS_PREFIX + step;
        } else if (stepMetrics.getFailedEventsCount() == 0)  {
            // Based on DHFPROD-5997, it is possible for a step to complete successfully but not process anything.
            // Previously, this was treated as a failure. I think one reason for that was because when the collector
            // threw an error due to e.g. an invalid source query, it was not treated as an error. In fact, the error
            // message would be sent as a single item to be processed by the step, which then resulted in the step not
            // processing anything. CollectorImpl now properly throws an exception when it gets back a non-200 response,
            // which means that a count of zero failed events should indicate successful completion.
            return JobStatus.COMPLETED_PREFIX + step;
        }
        return JobStatus.FAILED_PREFIX + step;
    }
}
