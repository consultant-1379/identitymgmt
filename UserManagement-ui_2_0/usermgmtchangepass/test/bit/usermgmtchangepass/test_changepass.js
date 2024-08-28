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
    'test/bit/usermgmtchangepass/Steps',
    'test/bit/usermgmtchangepass/Expects',
    './Model',
    'src/usermgmtchangepass/Usermgmtchangepass',
    './environment/Rest',
    'test/bit/common/identitymgmtlib/General/Steps'
], function(core, Flow, Browser, Environment, steps, expects, Model, UserMgmtChangePass, REST, GeneralSteps) {
    'use strict';

    describe('Usermgmtchangepass', function() {
        var environment, app;
        var sandbox = sinon.sandbox.create();
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher'
            },{
                name: 'User Management'
            }],
            namespace: 'usermgmtchangepass',
            properties: {
                title: 'Change User Local Password'
            }
        };

        beforeEach(function() {
            app = new UserMgmtChangePass(options);
            sandbox.stub(app, 'goBack');
        });

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Usermgmtchangepass - Check title,labels,buttons', function() {

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
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.checkTitle(options.properties.title)
                    ])
                    .run(done);
            });

            it('Check Message text', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.checkTopInfoText("admin_test")
                    ])
                    .run(done);
            });

            it('Check buttons', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        GeneralSteps.verifyTopSectionButton('Save'),
                        GeneralSteps.verifyTopSectionButton('Cancel')
                    ])
                    .run(done);
            });

            it('Check Force change password - turn OFF', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.verifyResetPasswordFlag('enabled'),
                        steps.clickResetPasswordFlag(),
                        steps.verifyResetPasswordFlag('disabled')
                    ])
                    .run(done);
            });
            
            it('Check Force change password - disabled (grayed) with EnforceUserHardening is enabled', function(done) {
                environment.setREST(REST.EnforcedUserHardening.Enabled);
                environment.apply();
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.verifyResetPasswordFlag('enabled'),
                        steps.verifyResetPasswordFlagDisable()
                    ])
                    .run(done);
            });

            it('Check Force change password - turn OFF with EnforceUserHardening is disabled', function(done) {
                environment.setREST(REST.EnforcedUserHardening.Default);
                environment.apply();
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.verifyResetPasswordFlag('enabled'),
                        steps.clickResetPasswordFlag(),
                        steps.verifyResetPasswordFlag('disabled')
                    ])
                    .run(done);
            });

        });

        describe('Usermgmtchangepass - validate Password Policies', function() {

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

            it('Check that Password Policies are properly displayed', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.validatePasswordPolicyOnList('maximumLength', 'The maximum length of password is '),
                        steps.validatePasswordPolicyOnList('minimumLength', 'The minimum length of password is '),
                        steps.validatePasswordPolicyOnList('minimumLowerCase', 'The minimum lowercase letter(s) is '),
                        steps.validatePasswordPolicyOnList('minimumUpperCase', 'The minimum uppercase letter(s) is '),
                        steps.validatePasswordPolicyOnList('minimumDigits', 'The minimum digit(s) is '),
                        steps.validatePasswordPolicyOnList("mustNotContainUnsupportedChars" , "Every character in password must be one of : a-z, A-Z, 0-9,! \" # $ % ^ & ' ( ) * + , / | : ; < > ? @ = [ ] ` ~ { } - _ . \\")
                    ])
                    .run(done);
            });
        });


        describe('Usermgmtchangepass - validate correct password', function() {

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

            it('Validate correct password', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputCorrectPassword("Passw0rd"),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Save'),
                        GeneralSteps.verifyTopSectionButtonEnabled('Save')
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtchangepass password validation - password too short', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.PasswordValidation.PasswordToShort);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Validate incorrect too short password', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputIncorrectPasswordToShort("Pasw0rd"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([2])
                    ])
                    .run(done);
            });
        });


        describe('Usermgmtchangepass password validation - password too long', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.PasswordValidation.PasswordToLong);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Validate incorrect too long password', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputIncorrectPasswordToLong("Pasw0rd1234567890qwertyuiopasdfgh"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([1])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtchangepass password validation - password with no minimum lowercase characters ', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.PasswordValidation.PasswordNoMinimumLowercaseLetters);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Validate incorrect password with no lowercase characters', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputIncorrectPasswordNoMinimumLowercaseLetters("PASSW0RD1"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([3])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtchangepass password validation - password with no minimum uppercase characters', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.PasswordValidation.PasswordNoMinimumUppercaseLetters);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Validate incorrect password with no uppercase characters', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputIncorrectPasswordNoMinimumUppercaseLetters("passw0rd1"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([4])
                    ])
                    .run(done);
            });
        });


        describe('Usermgmtchangepass password validation - password with no digits', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.PasswordValidation.PasswordNoMinimumDigits);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Validate incorrect password with no digits', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputIncorrectPasswordNoMinimumDigits("Password"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([5])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtchangepass password validation - password with only digits', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.PasswordValidation.PasswordOnlyDigits);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Validate incorrect password with only digits', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputIncorrectPasswordOnlyDigits("12345678"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([3, 4])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtchangepass password validation - password with only digits', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.PasswordValidation.PasswordOnlySpecialCharacters);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Validate incorrect password with only special characters', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputIncorrectPasswordOnlySpecialCharacters("!@#$%^&*()"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([3, 4, 5])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtchangepass repeate password validation', function() {

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

            it('Validate repeat password - different password', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputIncorrectRepeatPasswordValue("Passw0rd", "Password")
                    ])
                    .run(done);
            });
            it('Validate repeat password - empty repeat password field', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputIncorrectRepeatPasswordValue("Passw0rd")
                    ])
                    .run(done);
            });
        });

           describe('Usermgmtchangepass password validation - password with not supported special chars', function() {

                            this.timeout(7000);
                            beforeEach(function() {
                                environment = new Environment();
                                environment.setREST(REST.Default);
                                environment.setREST(REST.PasswordValidation.PasswordUnsupportedSpecialChars);
                                environment.apply();

                                app.start(Browser.getElement('#bitContainer'));
                            });

                            afterEach(function() {
                                app.stop();
                                environment.restore();
                            });

                            it('Validate incorrect password with unsupported special characters', function(done) {
                                new Flow()
                                    .setSteps([
                                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                                        steps.inputIncorrectPasswordUnsupportedSpecialCharacters("$òàùèù"),
                                        steps.checkPasswordPoliciesAreValidatedCorrectly([0])
                                    ])
                                    .run(done);
                            });
                        });

        describe('Usermgmtchangepass password validated - success notification checked', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.ChangePassword.Default);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Password validate, force change password true, success notification', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputCorrectPassword("Passw0rd"),
                        steps.verifyResetPasswordFlag('enabled'),
                        steps.clickResetPasswordFlag(),
                        steps.verifyResetPasswordFlag('disabled'),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Save'),
                        GeneralSteps.verifyTopSectionButtonEnabled('Save'),
                        GeneralSteps.clickTopSectionButton('Save'),
                        GeneralSteps.sleep(300),
                        steps.verifySuccessNotification('Password changed')
                    ])
                    .run(done);
            });
            it('Password validate, force change password default, success notification', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputCorrectPassword("Passw0rd"),
                        steps.verifyResetPasswordFlag('enabled'),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Save'),
                        GeneralSteps.verifyTopSectionButtonEnabled('Save'),
                        GeneralSteps.clickTopSectionButton('Save'),
                        GeneralSteps.sleep(300),
                        steps.verifySuccessNotification('Password changed')
                    ])
                    .run(done);
            });

        });

        describe('Usermgmtchangepass password validated - failed notification checked ( Failed Internal Code UIDM-3-update)', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.ChangePassword.ChangePasswordFailure_UIDM_3_update);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Password validate, force change password true, failed notification', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputCorrectPassword("Passw0rd"),
                        steps.verifyResetPasswordFlag('enabled'),
                        steps.clickResetPasswordFlag(),
                        steps.verifyResetPasswordFlag('disabled'),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Save'),
                        GeneralSteps.verifyTopSectionButtonEnabled('Save'),
                        GeneralSteps.clickTopSectionButton('Save'),
                        GeneralSteps.sleep(300),
                        steps.verifyErrorNotification('You don\'t have required privileges to perform this action')
                    ])
                    .run(done);
            });

            it('Password validate, force change password default, failed notification', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputCorrectPassword("Passw0rd"),
                        steps.verifyResetPasswordFlag('enabled'),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Save'),
                        GeneralSteps.verifyTopSectionButtonEnabled('Save'),
                        GeneralSteps.clickTopSectionButton('Save'),
                        GeneralSteps.sleep(300),
                        steps.verifyErrorNotification('You don\'t have required privileges to perform this action')
                    ])
                    .run(done);
            });

        });

         describe('Usermgmtchangepass password validated - failed notification checked ( Failed Internal Code UIDM-4-4)', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.ChangePassword.ChangePasswordFailure_UIDM_4_4);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Password validate, force change password true, failed notification', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputCorrectPassword("Passw0rd"),
                        steps.verifyResetPasswordFlag('enabled'),
                        steps.clickResetPasswordFlag(),
                        steps.verifyResetPasswordFlag('disabled'),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Save'),
                        GeneralSteps.verifyTopSectionButtonEnabled('Save'),
                        GeneralSteps.clickTopSectionButton('Save'),
                        GeneralSteps.sleep(300),
                        steps.verifyErrorNotification('User admin_test was not found in a Data Base')
                    ])
                    .run(done);
            });

            it('Password validate, force change password default, failed notification', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputCorrectPassword("Passw0rd"),
                        steps.verifyResetPasswordFlag('enabled'),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Save'),
                        GeneralSteps.verifyTopSectionButtonEnabled('Save'),
                        GeneralSteps.clickTopSectionButton('Save'),
                        GeneralSteps.sleep(300),
                        steps.verifyErrorNotification('User admin_test was not found in a Data Base')
                    ])
                    .run(done);
            });

        });

        describe('UserManagement Access Denied', function() {
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
                        steps.goToChangePassHash('admin_test'),
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
