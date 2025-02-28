package com.marklogic.hub.flow;

import com.fasterxml.jackson.databind.JsonNode;
import com.marklogic.hub.AbstractHubCoreTest;
import com.marklogic.hub.flow.impl.FlowRunnerImpl;
import com.marklogic.hub.impl.FlowManagerImpl;
import com.marklogic.hub.flow.impl.JobStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class RunFlowWithInvalidStepDefTest extends AbstractHubCoreTest {

    @Test
    void test() {
        installProjectInFolder("test-projects/flow-with-invalid-step-def");

        // Need to use a FlowRunner as constructed by Spring, which does not use MarkLogicStepDefinitionProvider, which
        // will immediately provide a nice error message when a step definition cannot be found
        FlowRunnerImpl flowRunner = new FlowRunnerImpl(getHubConfig(), new FlowManagerImpl(getHubConfig()));
        RunFlowResponse response = flowRunner.runFlow("invalidStepDef");
        flowRunner.awaitCompletion();

        assertEquals(JobStatus.FAILED.toString(), response.getJobStatus(),
            "The job should have failed because the only step in the flow references a step definition that " +
                "does not exist");
        String message = response.getStepResponses().get("1").getStepOutput().get(0);
        assertTrue(message.contains("A step with name \\\"doesntExist\\\" and type of \\\"CUSTOM\\\" was not found"),
            "Did not find expected message in: " + message);
        assertEquals("1", response.getLastAttemptedStep());
        assertEquals("0", response.getLastCompletedStep());

        JsonNode job = getJobDoc(response.getJobId());
        assertEquals("1", job.get("job").get("lastAttemptedStep").asText());
        assertEquals("0", job.get("job").get("lastCompletedStep").asText());
    }
}
