xquery version "1.0-ml";
import module namespace hub-test = "http://marklogic.com/data-hub/test" at "/test/data-hub-test-helper.xqy";
hub-test:reset-hub()

;

xquery version "1.0-ml";
import module namespace hub-test = "http://marklogic.com/data-hub/test" at "/test/data-hub-test-helper.xqy";
import module namespace test = "http://marklogic.com/test" at "/test/test-helper.xqy";
hub-test:load-artifacts($test:__CALLER_FILE__)

;

xquery version "1.0-ml";
import module namespace hub-test = "http://marklogic.com/data-hub/test" at "/test/data-hub-test-helper.xqy";
hub-test:wait-for-indexes()

;

xquery version "1.0-ml";
import module namespace hub-test = "http://marklogic.com/data-hub/test" at "/test/data-hub-test-helper.xqy";
hub-test:wait-for-indexes();