# Data Hub Examples

To try out any of the below example projects, clone this repository and follow the instructions in the README.md file 
in an example project directory.

Many of the Data Hub 5 example projects can be tested against a snapshot version of the Data Hub Gradle plugin; this is 
typically done when testing these projects locally against the develop branch. A snapshot version will be used when the
Gradle property "testing" has a value of "true". The easiest way to apply this is when you initialize a project, include
the "testing" property on the command line - e.g.

    ./gradlew -Ptesting=true hubInit

After initializing the project, you may want to add "testing=true" to the gradle.properties file so that you do not need to include it as a command line property. 

If you are trying to use a snapshot version of the Gradle plugin and get an error about not being able to find the 
plugin - e.g. "Could not find com.marklogic:ml-data-hub:5.6.2" - then run the following Gradle task from the root
of this repository (this is also described in the CONTRIBUTING.md guide in the section named "Testing changes to the 
Data Hub Gradle plugin"): 

    ./gradlew publishToMavenLocal

That task will build and publish a copy of the Data Hub Gradle plugin to your local Maven repository, thus making it 
available for use within an example project. 

## Data Hub 5

1. [insurance](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/insurance) - an example that ingests, maps, and masters customer data from two fictitious insurance companies

1. [dh-5-example](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dh-5-example) - an example that demonstrated getting started with configuring and using ingestion, mapping, and mastering flows using gradle

1. [dh5-custom-hook](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dh5-custom-hook) - an example of a simple flow with one ingestion step that utilizes a custom hook

1. [dhs-example](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dhs-example) - demonstrates where to store 
  resources that can be deployed to a DHS instance. 

1. [mapping-example](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/mapping-example) - demonstrates the new mapping features in Data Hub 5.1.0

1. [smart-mastering-complete](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/smart-mastering-complete) - demonstrates various features of the mastering step

1. [snapshot-testing](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/snapshot-testing) - only used for testing snapshot (non-released) versions of DHF.

## Data Hub 4

1. [barebones](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/barebones) - an example of the minimum configuration necessary to run a Gradle-based Data Hub
1. [dhf-with-tests-xquery](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dhf4/dhf-with-tests-xquery) - an example of a DHF4 application with unit tests in xquery. Features an example of a search and uses higher order functions to compare expected values to the search results. Flows are invoked via REST with XQuery clients.  
1. [DHS-e2e](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dhf4/DHS-e2e) - an end-to-end example demonstrating ingestion, harmonization, and retrieval of data in DHS environment
1. [gradle-tasks-demo](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dhf4/gradle-tasks-demo) - a demonstration of gradle commands in the DHS environment
1. [healthcare](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dhf4/healthcare) - an example of a Healthcare 360 Data Hub
1. [hr-hub](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dhf4/hr-hub) - an example used for our 1.x tutorial. This example harmonizes data from various HR systems
1. [load-binaries](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dhf4/load-binaries) - an example of how to ingest binaries via an MLCP Input Flow
1. [single-step-ingest](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dhf4/single-step-ingest) - an example of a custom REST endpoint that a user can call that will ingest a document into the STAGING database and then harmonize the same document immediately after the document was ingested
1. [spring-batch](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dhf4/spring-batch) - an example of how to load relational data into a Data Hub using Spring Batch
1. [ssl](https://github.com/marklogic/marklogic-data-hub/tree/master/examples/dhf4/ssl) - an example of how to configure your Data Hub to use SSL for added security
