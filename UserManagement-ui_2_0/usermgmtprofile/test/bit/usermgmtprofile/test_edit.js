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
    'test/bit/usermgmtprofile/Steps',
    'test/bit/usermgmtprofile/Expects',
    './Model',
    'src/usermgmtprofile/Usermgmtprofile',
    './environment/Rest',
    'identitymgmtlib/Utils',
    'test/bit/common/identitymgmtlib/General/Steps'
], function(core, Flow, Browser, Environment, steps, expects, Model, Usermgmtprofile, REST, ServerResponseCodes, GeneralSteps) {
    'use strict';

    describe('Usermgmtprofile - EDIT USER', function() {
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
            window.location.hash = '/usermgmtprofile/edit/mockName';
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
                        steps.checkTitle(options.properties.title)
                    ])
                    .run(done);
            });

        });

        describe('Check Role Type column', function() {

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

            it('Check Role Type column', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralSteps.sleep(300),
                        steps.checkRolesTableHeaderExists('Type'),
                        steps.checkRoleTypeCellExists('ENM System Role')
                    ])
                    .run(done);
            });

        });


        describe('Usermgmtprofile Surname validation', function() {

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

            it('Validate Surname - check for digits, letters, special characters', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        steps.inputDifferentCharactersInNameField("username123"),
                        steps.inputDifferentCharactersInSurnameField("!*&@(1234adsafsNMNKJ")
                    ])
                    .run(done);
            });
            it('Validate Surname - check for error message after setting and deleting Surname', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        steps.inputDifferentCharactersInNameField("username123"),
                        steps.inputDifferentCharactersInSurnameField("surname123"),
                        steps.inputDifferentCharactersInSurnameField("")
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile email validation', function() {
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

            it('Validate email - validate proper email addresses', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        steps.textCorrectUsername("administrator"),
                        steps.inputDifferentCharactersInNameField("username123"),
                        steps.inputDifferentCharactersInSurnameField("surname123"),
                        steps.inputProperDescription("Description"),
                        steps.inputProperEmailAddress("user@gmail.com"),
                        steps.inputProperEmailAddress("user@gmail.se"),
                        steps.inputProperEmailAddress("user@gmail.CO"),
                        steps.inputProperEmailAddress("user@gmail4.com"),
                        steps.inputProperEmailAddress("user@gma4il4.com"),
                        steps.inputProperEmailAddress("user@32gmail4.com"),
                        steps.inputProperEmailAddress("user@4.com"),
                        steps.inputProperEmailAddress("user@c.com"),
                        steps.inputProperEmailAddress("user@C.com"),
                        steps.inputProperEmailAddress("user@32gmail4.com"),
                        steps.inputProperEmailAddress("a@32gmail4.com"),
                        steps.inputProperEmailAddress("A@32gmail4.com"),
                        steps.inputProperEmailAddress("3@32gmail4.com"),
                        steps.inputProperEmailAddress("33us.3e34@32gmail4.commm"),
                        steps.inputProperEmailAddress("~!$#%^|`&*_-.+={}/'?@32gmail4.com"),
                        steps.inputProperEmailAddress("user@gma.sadf.asdil.com"),
                        steps.inputProperEmailAddress("")
                    ])
                    .run(done);
            });
            it('Validate email - validate incorrect email addresses', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        steps.textCorrectUsername("administrator"),
                        steps.inputDifferentCharactersInNameField("username123"),
                        steps.inputDifferentCharactersInSurnameField("surname123"),
                        steps.inputProperDescription("Description"),
                        steps.inputIncorrectEmailAddress("user@gmail.c1"),
                        steps.inputIncorrectEmailAddress("user@gmail.c%"),
                        steps.inputIncorrectEmailAddress("user@gmail.c"),
                        steps.inputIncorrectEmailAddress(".user@gmail.com"),
                        steps.inputIncorrectEmailAddress("user.@gmail.com"),
                        steps.inputIncorrectEmailAddress("add\"user@gmail.com"),
                        steps.inputIncorrectEmailAddress("add[user@gmail.com"),
                        steps.inputIncorrectEmailAddress("adduser@gma)il.com"),
                        steps.inputIncorrectEmailAddress("add\\user@gmail.com"),
                        steps.inputIncorrectEmailAddress("add[user@gmail.com"),
                        steps.inputIncorrectEmailAddress("adduser;@gmail.com"),
                        steps.inputIncorrectEmailAddress("add:user@gmail.com"),
                        steps.inputIncorrectEmailAddress("add[user@gm,ail.com"),
                        steps.inputIncorrectEmailAddress("a<ddus>er@gmail.com"),
                        steps.inputIncorrectEmailAddress(" ")
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile status button - click status button', function() {
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

            it('Validate status button', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        steps.clickStatusButtonEnabled(),
                        steps.clickStatusButtonDisabled(),
                        steps.clickStatusButtonEnabled()
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile authMode - click authMode select box', function() {
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

            it('Validate authMode select box', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        steps.checkAuthModeSelected('Remote'),
                        steps.clickAuthModeSelectBox('Local'),
                        GeneralSteps.sleep(1000),
                        steps.checkAuthModeSelected('Local'),
                        steps.clickAuthModeSelectBox('Remote'),
                        GeneralSteps.sleep(1000),
                        steps.checkAuthModeSelected('Remote')
                     ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile validate error messages', function() {
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

            it('Check that all error messages are displayed after clicking save button', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        steps.textCorrectUsername("administrator"),
                        GeneralSteps.sleep(100), //because first input loads late than others
                        steps.inputDifferentCharactersInNameField(""),
                        steps.inputDifferentCharactersInSurnameField(""),
                        steps.inputProperDescription(""),
                        steps.validateClickSaveButton(),
                        steps.checkErrorMessageNameMustBeSpecified(),
                        steps.checkErrorMessageSurnameMustBeSpecified()
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile validate error 48 users TGALL', function() {
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, "UIDM-15-2-0");

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Error48TgAll);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Check error USERs with Taskprofile and TG ALL > 48 in LAAD file notification after clicking save button', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralSteps.sleep(100), //because first input loads late than others
                        steps.inputProperDescription("Error48"),
                        steps.validateClickSaveButton(),
                        steps.verifyErrorNotificationText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickNotificationClose()
                    ])
                    .run(done);
            });

        });

        describe('Usermgmtprofile validate error 48 users for CPP', function() {
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, "UIDM-15-2-1");

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Error48usersForCpp);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Check error CPP with 48 users in LAAD file notification after clicking save button', function(done) {

                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralSteps.sleep(100), //because first input loads late than others
                        steps.inputProperDescription("Error48CPP"),
                        steps.validateClickSaveButton(),
                        steps.verifyErrorNotificationText(ServerResponseCodes.printf(_internalCodeMessage.internalErrorCodeMessage, "[testTarget]")),
                        GeneralSteps.clickNotificationClose()
                    ])
                    .run(done);
            });

        });

        describe('Usermgmtprofile validate error 10 Task Profiles per User', function() {
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, "UIDM-7-4-51");

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Error10TP);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Check error 10 Task Profiles per User notification after clicking save button', function(done) {

                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralSteps.sleep(100), //because first input loads late than others
                        GeneralSteps.clickNotificationClose(),
                        steps.inputProperDescription("Error10TaskProfiles"),
                        steps.clickRole("ADMINISTRATOR"),
                        steps.validateClickSaveButton(),
                        steps.verifyErrorNotificationText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickNotificationClose()
                    ])
                    .run(done);
            });

        });

/*        describe('Usermgmtprofile - EDIT USER - Access Denied', function() {

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

            it('Should show Access Denied Dialog when user has not right access', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPage('administrator'),
                        GeneralSteps.sleep(200), 
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Access Denied"),
                        GeneralSteps.verifyDialogSecondaryText("Your Role does not allow you access to this application. Contact your System Administrator to change your access rights or return to the Application Launcher."),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                    ])
                    .run(done);
            });
        });
*/
        describe('Usermgmtprofile password ageing section', function() {
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

            it('Validate password ageing section', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        steps.selectPwdAgeingSystemSettings(),
                        steps.selectPwdAgeingCustomized(),
                        steps.clickEnablePasswordAgeing(),
                        steps.fillInputFieldWithPwdMaxAgeEdit(60),
                        steps.fillInputFieldWithPwdExpireWarningEdit(5)
                    ])
                    .run(done);
            });

        });

        describe('Usermgmtprofile password ageing section with EnforceduserHardening enabled', function() {
            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.EditUserHardening);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Validate password ageing section with EnforceduserHardening enabled', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        steps.checkEnablePasswordAgeingIsDisabled(),
                        steps.fillInputFieldWithPwdMaxAgeEdit(60),
                        steps.fillInputFieldWithPwdExpireWarningEdit(5)
                    ])
                    .run(done);
            });
        });

        describe('EDIT USER Force/Revoke Change Password', function() {

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                //environment.setREST(REST.DefaultEdit);
                environment.setREST(REST.User.UserPasswordResetFlagFalseEdit);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));

            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });


            it('"Revoke Force Change Password" button for default user ', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralSteps.verifyTopSectionTitle('Edit User Profile'),
                        GeneralSteps.verifyTopSectionButton('Revoke Force Password Change')
                    ])
                    .run(done);
            });

            it('"Revoke Force Change Password" button for default user with EnforcedUserHardening disabled', function(done) {
                environment.setREST(REST.EnforcedUserHardening.Default);
                environment.apply();
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralSteps.verifyTopSectionTitle('Edit User Profile'),
                        GeneralSteps.verifyTopSectionButton('Revoke Force Password Change')
                    ])
                    .run(done);
            });

            it('"Revoke Force Change Password" button missing for default user with EnforcedUserHardening enabled', function(done) {
                environment.setREST(REST.EnforcedUserHardening.Enabled);
                environment.apply();
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralSteps.verifyTopSectionTitle('Edit User Profile'),
                        GeneralSteps.verifyTopSectionButtonNotVisible('Revoke Force Password Change')
                    ])
                    .run(done);
            });

            it('"Revoke Force Change Password" button missing for default user with EnforcedUserHardening enabled', function(done) {
                environment.setREST(REST.EnforcedUserHardening.Enabled);
                environment.apply();
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('user1'),
                        GeneralSteps.verifyTopSectionTitle('Edit User Profile'),
                        GeneralSteps.verifyTopSectionButton('Force Password Change'),
                        GeneralSteps.verifyTopSectionButtonNotVisible('Revoke Force Password Change')
                    ])
                    .run(done);
            });
            
        });
    });
});
