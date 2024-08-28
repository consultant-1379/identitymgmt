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
    'jscore/core',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/usermgmtprofile/Steps',
    'test/bit/usermgmtprofile/Expects',
    'test/bit/common/identitymgmtlib/General/Steps',
    './Model',
    'src/usermgmtprofile/Usermgmtprofile',
    './environment/Rest'
], function(core, Flow, Browser, Environment, steps, expects, GeneralSteps, Model, Usermgmtprofile, REST) {
    'use strict';

    describe('Usermgmtprofile - DUPLICATE USER', function() {

        var environment, app;
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher'
            },{
                name: 'User Management'
            }],
            namespace: 'usermgmtprofile',
            properties: {
                title: 'Edit User Profile'
            }
        };

        beforeEach(function() {
            app = new Usermgmtprofile(options);
            steps.setMode("editUser");
        });

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Check title', function() {

            this.timeout(7000);
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

            it('Check Title', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        steps.checkTitle(options.properties.title),
                        GeneralSteps.clickTopSectionButton('Duplicate'),
                        GeneralSteps.verifyLocationHash('#usermanagement/usermgmtprofile/duplicate/administrator')
                    ])
                    .run(done);
            });
        });

        describe('Duplicate user', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.DuplicateUser);

                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Duplicate', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToDuplicatePageAndWaitForPageIsLoaded('administrator'),
                        steps.checkTitle('Create User Profile'),
                        steps.verifyRoleSelected('ADMINISTRATOR'),
                        steps.verifyRoleSelected('SECURITY_ADMIN'),
                        steps.checkAuthModeSelected('Local')
                    ])
                    .run(done);
            });

            it('Force change password - verify disabled with EnforcedUserHardening enabled', function(done) {
                environment.setREST(REST.EnforcedUserHardening.Enabled);
                environment.apply();
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("user1234"),
                        steps.inputCorrectPassword("Kruszywo1234"),
                        steps.inputDifferentCharactersInNameField("user"),
                        steps.inputDifferentCharactersInSurnameField("useruser"),
                        steps.inputProperEmailAddress("user@user.com"),
                        steps.verifyResetPasswordFlagDisable()                        
                    ])
                    .run(done);
            });

            it('Force change password - turn OFF with EnforcedUserHardening disabled', function(done) {
                environment.setREST(REST.EnforcedUserHardening.Default);
                environment.apply();
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,                        
                        steps.verifyResetPasswordFlag('enabled'),
                        steps.clickResetPasswordFlag(),
                        steps.verifyResetPasswordFlag('disabled')
                    ])
                    .run(done);
            });

            it('Force change password - turn OFF with EnforcedUserHardening 404', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,                        
                        steps.verifyResetPasswordFlag('enabled'),
                        steps.clickResetPasswordFlag(),
                        steps.verifyResetPasswordFlag('disabled')
                    ])
                    .run(done);
            });

        });

        describe('Duplicate user with AuthMode', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.DuplicateUserWithAuthMode);

                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });


            it('Duplicate user with AuthMode', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToDuplicatePageAndWaitForPageIsLoaded('userToDuplicate'),
                        steps.checkTitle('Create User Profile'),
                        steps.verifyRoleSelected('ADMINISTRATOR'),
                        steps.checkAuthModeSelected('Remote')
                    ])
                    .run(done);
            });


        });
        describe('Access Denied', function() {

            this.timeout(7000);
            beforeEach(function() {

                environment = new Environment();
                environment.setREST(REST.NotAuthorize);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it.skip('Should show Access Denied Dialog when user has not right to access app', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToDuplicatePage('administrator'),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Access Denied"),
                        GeneralSteps.verifyDialogSecondaryText("Your Role does not allow you access to this application. Contact your System Administrator to change your access rights or return to the Application Launcher."),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear()
                    ])
                    .run(done);
            });
        });
    });
});
