/*******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************/

/*global define, describe, it, expect */
define([
    'jscore/core',
    'usermgmtlib/Dictionary',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/usermgmtprofile/Steps',
    'test/bit/usermgmtprofile/Expects',
    './Model',
    'src/usermgmtprofile/Usermgmtprofile',
    './environment/Rest',
    'test/bit/common/identitymgmtlib/General/Steps',
    'jscore/ext/net'
], function(core, Dictionary, Flow, Browser, Environment, steps, expects, Model, Usermgmtprofile, REST, GeneralTestSteps, net) {
    'use strict';

    describe('Usermgmtprofile - Filters USER', function() {
        var timeout = timeout;
        var environment, app;
        var sandbox = sinon.sandbox.create();
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher'
            },{
                name: 'User Management'
            }],
            namespace: 'usermgmtprofile',
            properties: {
                title: 'Create User Profile'
            }
        };

        beforeEach(function() {
            app = new Usermgmtprofile(options);
            sandbox.stub(app, 'goBack');
        });

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Check Role Type column', function() {

            this.timeout(timeout);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.EditUser);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Check Filter ENM System Role Type columns', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralTestSteps.sleep(300),
                        steps.clickFilterRoleButton(1),
                        GeneralTestSteps.sleep(1000),
                        steps.clickFilterRoleCheckBoxListItem('application_system'),
                        steps.clickFilterRoleCheckBoxListItem('com')
                    ])
                    .run(done);
            });

//            it('Check Filter ENM System Role Status columns', function(done) {
//                new Flow()
//                    .setSteps([
//                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
//                        GeneralTestSteps.sleep(300),
//                        steps.clickFilterRoleButton(2),
//                        GeneralTestSteps.sleep(1000),
//                        steps.clickFilterRoleCheckBoxListItem('ENABLED')
//                    ])
//                    .run(done);
//            });

        });
    });
});
