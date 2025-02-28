/**
 Copyright (c) 2021 MarkLogic Corporation

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
'use strict';

const config = require("/com.marklogic.hub/config.sjs");
const hubUtils = require("/data-hub/5/impl/hub-utils.sjs");
const StepDefinition = require("/data-hub/5/impl/stepDefinition.sjs");
const collections = ['http://marklogic.com/data-hub/step-definition'];
const databases = [config.STAGINGDATABASE, config.FINALDATABASE];
const requiredProperties = ['name'];

function getNameProperty() {
    return 'name';
}

function getCollections() {
    return collections;
}

function getStorageDatabases() {
    return databases;
}

function getPermissions() {
  let permsString = "%%mlStepDefinitionPermissions%%";
  // Default to the given string in case the above token has not been replaced
  permsString = permsString.indexOf("%mlStepDefinitionPermissions%") > -1 ?
    "data-hub-step-definition-reader,read,data-hub-step-definition-writer,update" :
    permsString;
  return hubUtils.parsePermissions(permsString);
}

function getArtifactNode(artifactName, artifactVersion) {
    const stepDef = new StepDefinition().getStepDefinition(artifactName);
    return stepDef;
}

function getDirectory(artifactName, artifact, artifactDirName) {
    let doc = getArtifactNode(artifactName, null);
    let dir = "/step-definitions/";
    if(!doc && artifact && artifactName) {
        dir = dir + artifact.type.toLowerCase() + "/" + (artifactDirName || artifact.name) +"/"
    }
    else if (doc) {
        let stepDefinition = doc.toObject();
        if (stepDefinition.type && stepDefinition.name) {
            dir = dir + stepDefinition.type.toLowerCase() + "/" + stepDefinition.name + "/";
        }
    }
    return dir;
}

function getFileExtension() {
    return ".step.json";
}

function validateArtifact(artifact) {
    const missingProperties = requiredProperties.filter((propName) => !artifact[propName]);
    if (missingProperties.length) {
        return new Error(`Step definition '${artifact.name}' is missing the following required properties: ${JSON.stringify(missingProperties)}`);
    }
    return artifact;
}

module.exports = {
  getNameProperty,
  getCollections,
  getStorageDatabases,
  getDirectory,
  getPermissions,
  getFileExtension,
  getArtifactNode,
  validateArtifact
};
