/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 -----------------------------------------------------------------------------*/
/*global define, describe, it, expect */
define([
    'container/main',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'targetmgmtlib/bitTestSteps/Targetmanagement', //TODO: Update paths
    'targetmgmtlib/bitTestSteps/TargetGroup',
    'identitymgmtlib/bitTestSteps/General',
    'identitymgmtlib/bitTestSteps/PaginatedTable'
], function( container, Flow, Browser, TargetmanagementSteps, TargetGroupSteps, GeneralSteps, PaginatedTableSteps) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 15000;

/*
//////////////////////////////////////////////////////////////////////////////////////////
// CONTAINER TIPS AND TRICKS
//////////////////////////////////////////////////////////////////////////////////////////

-to run the container we only need to import 'container/main' (it will do the rest)
-container wil use container.config.js and it will load default app
-run serve with proxy server (connection must be active, to see all needed files)
-dummy file with assets.css must be added (container have asset loader which
wont start default app if we dont, however change hash will then trigger new app start)
-container attaches to divs "eaContainer-SystemBarHolder" and "eaContainer-applicationHolder"
-locales files must be placed i bit test directory for each used proj
-test will depend on the thata on vApp
-if the test will not clean after itselve, next run will break the test
-actions have different time lapse then those on PhantomJs, might break often..

-TODO: Automatic copy for location directories (now manually, might cause errors if dictionaries change)

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
*/

    describe('Targetmanagement INTEGRATION - Bit Tests', function() {

        beforeEach(function() {
            Browser.gotoHash();
        });

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Targetmanagement - positive cases', function() {

            it('Should properly init application and load targetgroups list', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([

                        GeneralSteps.sleep(3000), //TODO: wait for CreateTargetGroup app
                        //PaginatedTableSteps.waitForTableDataIsLoaded, //Default 500ms might be too less
                        //Comunication with vapp is slower thant with fakeServer

                        GeneralSteps.verifyTopSectionTitle('Target Group Management'),
                        GeneralSteps.verifyLocationHashParameterAbsent('filter'),
                        GeneralSteps.verifyLocationHashParameterPresent('pagenumber'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashParameterPresent('pagesize'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
                        PaginatedTableSteps.verifyTableLength(6), //Will change each test ...
                        GeneralSteps.clickTopSectionButton("Create Target Group"),
                        GeneralSteps.sleep(5000), //TODO: wait for CreateTargetGroup app

                        GeneralSteps.verifyLocationHash('#targetmanagement/targetgroup/create'),
                        GeneralSteps.verifyTopSectionTitle("Create Target Group"),
                        TargetGroupSteps.setName("integrationTest3"), //TODO: AUTOMATIC DELETE, must be manually deleted now
                        TargetGroupSteps.setDescription("integrationTest3"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForNotification,
                        GeneralSteps.verifyNotificationText("Target Group Successfully Created"),
                        GeneralSteps.clickNotificationClose,
                        GeneralSteps.sleep(5000), //TODO: wait for CreateTargetGroup app
                        GeneralSteps.verifyLocationHash("#targetmanagement?pagenumber=1&pagesize=10")//#targetmanagement worked in bits ..

                    ])
                    .run(done);
            });
        });
    });
});