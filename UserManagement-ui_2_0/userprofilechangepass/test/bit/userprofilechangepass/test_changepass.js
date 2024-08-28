/*global define, describe, it, expect */
define([
    'jscore/core',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/userprofilechangepass/Steps',
    'test/bit/userprofilechangepass/Expects',
    './Model',
    'src/userprofilechangepass/Userprofilechangepass',
    './environment/Rest',
    'test/bit/common/identitymgmtlib/General/Steps',
    'i18n!userprofilechangepass/app.json'
], function(core, Flow, Browser, Environment, steps, expects, Model, UserProfileChangePass, REST, GeneralTestSteps, Dictionary) {
    'use strict';

    describe('Userprofilechangepass', function() {
        var environment, app;
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher'
            },{
                name: 'User Management'
            }],
            namespace: 'userprofilechangepass',
            properties: {
                title: 'Change Your Local Password'
            }
        };

        beforeEach(function() {
            app = new UserProfileChangePass(options);
        });

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Userprofilechangepass - Check title,labels,buttons', function() {

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
                        GeneralTestSteps.verifyTopSectionButton('Save'),
                        GeneralTestSteps.verifyTopSectionButton('Cancel')
                    ])
                    .run(done);
            });


        });

        describe('Userprofilechangepass - validate Password Policies', function() {

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


        describe('Userprofilechangepass - validate correct password', function() {

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
                        GeneralTestSteps.sleep(700),
                        GeneralTestSteps.verifyTopSectionButton('Save'),
                        GeneralTestSteps.verifyTopSectionButtonEnabled('Save'),
                    ])
                    .run(done);
            });

        });

        describe('Userprofilechangepass password validation - password too short', function() {

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
                        steps.checkPasswordPoliciesAreValidatedCorrectly([2]),
                        GeneralTestSteps.verifyTopSectionButtonDisabled('Save')
                    ])
                    .run(done);
            });
        });


        describe('Userprofilechangepass password validation - password too long', function() {

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
                        steps.checkPasswordPoliciesAreValidatedCorrectly([1]),
                        GeneralTestSteps.verifyTopSectionButtonDisabled('Save')
                    ])
                    .run(done);
            });
        });

        describe('Userprofilechangepass password validation - password with no minimum lowercase characters ', function() {

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
                        steps.checkPasswordPoliciesAreValidatedCorrectly([3]),
                        GeneralTestSteps.verifyTopSectionButtonDisabled('Save')
                    ])
                    .run(done);
            });
        });

        describe('Userprofilechangepass password validation - password with no minimum uppercase characters', function() {

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
                        steps.checkPasswordPoliciesAreValidatedCorrectly([4]),
                        GeneralTestSteps.verifyTopSectionButtonDisabled('Save')
                    ])
                    .run(done);
            });
        });


        describe('Userprofilechangepass password validation - password with no digits', function() {

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
                        steps.checkPasswordPoliciesAreValidatedCorrectly([5]),
                        GeneralTestSteps.verifyTopSectionButtonDisabled('Save')
                    ])
                    .run(done);
            });
        });

        describe('Userprofilechangepass password validation - password with only digits', function() {

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
                        steps.checkPasswordPoliciesAreValidatedCorrectly([3, 4]),
                        GeneralTestSteps.verifyTopSectionButtonDisabled('Save')
                    ])
                    .run(done);
            });
        });

        describe('Userprofilechangepass password validation - password with only digits', function() {

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
                        steps.checkPasswordPoliciesAreValidatedCorrectly([3, 4, 5]),
                        GeneralTestSteps.verifyTopSectionButtonDisabled('Save')
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

        describe('Userprofilechangepass repeate password validation', function() {

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
                        steps.inputIncorrectRepeatPasswordValue("Passw0rd", "Password"),
                        GeneralTestSteps.verifyTopSectionButtonDisabled('Save')
                    ])
                    .run(done);
            });
            it('Validate repeat password - empty repeat password field', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputIncorrectRepeatPasswordValue("Passw0rd"),
                        GeneralTestSteps.verifyTopSectionButtonDisabled('Save')
                    ])
                    .run(done);
            });
        });

        describe('Userprofilechangepass password validation - old password is empty', function() {

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

            it('Validate that new password is different then old one', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToChangePassPageAndWaitForPageIsLoaded('admin_test'),
                        steps.inputEmptyOldPassword("Passw0rd"),
                        GeneralTestSteps.verifyTopSectionButtonDisabled('Save')
                    ])
                    .run(done);
            });
        });




    });

});
