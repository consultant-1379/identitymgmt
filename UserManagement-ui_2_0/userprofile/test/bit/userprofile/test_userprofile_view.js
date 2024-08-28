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
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/userprofile/Steps',
    'test/bit/userprofile/Expects',
    './Model',
    'src/userprofile/Userprofile',
    './environment/Rest'
], function(core, Flow, Browser, Environment, steps, expects, Model, Userprofile, REST) {
    'use strict';

    describe('Userprofile - Display profile details', function() {
        var environment, app;
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher'
            },{
                name: 'User Management'
            }],
            namespace: 'userprofile',
            properties: {
                title: 'User Profile'
            }
        };

        beforeEach(function() {
            app = new Userprofile(options);
        });

        afterEach(function() {
            Browser.gotoHash();
        });


        describe('Userprofile - check titles, buttons and headers', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Check Title', function(done) {
                 new Flow()
                    .setSteps([
                        steps.goToUserProfileViewPageAndWaitForPageIsLoaded(),
                        steps.checkTitle(options.properties.title)
                    ])
                    .run(done);
            });

            it('Check Top Section Buttons', function(done){
                new Flow()
                    .setSteps([
                        steps.goToUserProfileViewPageAndWaitForPageIsLoaded(),
                        steps.checkEditPasswordButton(),
                        steps.checkEditDataButton(),
                        steps.checkGetCredentialsButton()
                    ])
                    .run(done);
            });

            it('Check Headers', function(done){
                new Flow()
                    .setSteps([
                        steps.goToUserProfileViewPageAndWaitForPageIsLoaded(),
                        steps.checkGeneralInformationHeader(),
                        steps.checkDetailsHeader(),
                        steps.checkUserRolesHeader()
                    ])
                    .run(done);
            });
        });

        describe('Userprofile - check details user', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Check Name Labels', function(done) {
                 new Flow()
                    .setSteps([
                        steps.goToUserProfileViewPageAndWaitForPageIsLoaded(),
                        steps.checkDisplayedNamesOfLabels(['Username', 'Name', 'Surname', 'Description', 'Email Address','Status', 'Previous Login'])
                    ])
                    .run(done);
            });

            it('Check Details User', function(done) {
                 new Flow()
                    .setSteps([
                        steps.goToUserProfileViewPageAndWaitForPageIsLoaded(),
                        steps.checkDisplayedUserName('administrator'),
                        steps.checkDisplayedName('security'),
                        steps.checkDisplayedSurname('admin'),
                        steps.checkDisplayedDescription('Any description'),
                        steps.checkDisplayedEmail('security@administrator.com'),
                        steps.checkDisplayedStatus('Enabled')
                    ])
                    .run(done);
            });

        });

        describe('Userprofile - check User Roles', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Check Roles', function(done) {
                 new Flow()
                    .setSteps([
                        steps.goToUserProfileViewPageAndWaitForPageIsLoaded(),
                        steps.checkUserRolesHeader(),
                        steps.checkDisplayedRoles(['ADMINISTRATOR', 'SECURITY_ADMIN'])
                    ])
                    .run(done);
            });

        });

    });

});
