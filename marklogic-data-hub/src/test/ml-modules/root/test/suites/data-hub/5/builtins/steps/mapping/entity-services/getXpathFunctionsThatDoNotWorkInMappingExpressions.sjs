const esMappingLib = require("/data-hub/5/builtins/steps/mapping/entity-services/lib.sjs");
const test = require("/test/test-helper.xqy");

const entityType = "http://marklogic.com/data-hub/example/CustomerType-0.0.1/CustomerType";

function testFunctionInMapping(functionSignature) {
  return esMappingLib.validateAndTestMapping({
    targetEntityType: entityType,
    properties: {
      gender: {
        sourcedFrom: functionSignature
      }
    }
  }, "/content/mapTest.json");
}

const expectedFunctionsThatDontWork = esMappingLib.getXpathFunctionsThatDoNotWorkInMappingExpressions();

/**
 * This test uses the approach below to identify functions that don't work. The approach is fairly primitive, but seems
 * effective - grab the signature and try using it as the "sourcedFrom", and if there's an error that starts with
 * "Undefined function", then the function will never work in a mapping expression. Other errors, such as invalid arg
 * type, indicates that the function will work, just need to give it valid args.
 *
 * The goal of this test then is to verify that we don't get any additional functions that don't work - i.e. that
 * the ones excluded by esMappingLib covers all the functions that should be ignored.
 */
const functions = esMappingLib.getXpathMappingFunctions();
const actualFunctionsThatDontWork = [];
for(let i=0; i< functions.length; i++){
  const result = testFunctionInMapping(functions[i].signature);
  if (result.properties.gender.errorMessage && result.properties.gender.errorMessage.startsWith("Unable to find function")){
    actualFunctionsThatDontWork.push(String(functions[i].functionName));
  }
}

[
  test.assertEqual(0, actualFunctionsThatDontWork.length,
    "Expected to find zero functions that don't work, as getXpathMappingFunctions should have already removed " +
    "ones that don't work.")
];
