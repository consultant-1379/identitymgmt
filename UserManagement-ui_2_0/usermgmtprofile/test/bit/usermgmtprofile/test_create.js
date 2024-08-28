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


    describe('Usermgmtprofile - CREATE USER', function() {
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
            namespace: 'usermgmtprofile/create',
            properties: {
                title: 'Create User Profile'
            }
        };

        beforeEach(function() {
            app = new Usermgmtprofile(options);
            sandbox.stub(app, 'goBack');
            Browser.gotoHash('usermgmtprofile/create');
        });

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Usermgmtprofile - CREATE USER -  Access Denied', function() {

            this.timeout(timeout);
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
                        function(resolve) {
                            window.requestAnimationFrame(resolve);
                        },
                        GeneralTestSteps.waitForDialog(),
                        GeneralTestSteps.verifyDialogPrimaryText("Access Denied"),
                        GeneralTestSteps.verifyDialogSecondaryText("Your Role does not allow you access to this application. Contact your System Administrator to change your access rights or return to the Application Launcher."),
                        GeneralTestSteps.clickDialogButton('Ok'),
                        GeneralTestSteps.waitForDialogDisappear()
                    ])
                    .run(done);

            });
        });
    });


    describe('Usermgmtprofile - CREATE USER', function() {
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


        describe('Check title', function() {

            this.timeout(timeout);
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
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.checkTitle(options.properties.title)
                    ])
                    .run(done);
            });

        });

         describe('Usermgmtprofile - validate Password Policies', function() {

            this.timeout(timeout);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                environment.restore();
                app.stop();
            });

            it('Check that Password Policies are properly displayed', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        GeneralTestSteps.sleep(400),
                        steps.validatePasswordPolicyOnList('maximumLength', true, Dictionary.passwordPolicies['maximumLength']),
                        steps.validatePasswordPolicyOnList('minimumLength', true, Dictionary.passwordPolicies['minimumLength']),
                        steps.validatePasswordPolicyOnList('minimumLowerCase', true, Dictionary.passwordPolicies['minimumLowerCase']),
                        steps.validatePasswordPolicyOnList('minimumUpperCase', true, Dictionary.passwordPolicies['minimumUpperCase']),
                        steps.validatePasswordPolicyOnList('minimumDigits', true, Dictionary.passwordPolicies['minimumDigits']),
                        function() {
                            environment = new Environment();
                            environment.setREST(REST.NewPoliciesPlusResult);
                            environment.setREST(REST.NewPoliciesPlus);
                            environment.apply();
                        },
                        steps.inputCorrectPassword("TestPassw0rd"),
                        GeneralTestSteps.sleep(400),
                        steps.validatePasswordPolicyOnList('maximumRepeatingChars', true, Dictionary.passwordPolicies['maximumRepeatingChars']),
                        steps.validatePasswordPolicyOnList('maximumConsecutiveChars', true, Dictionary.passwordPolicies['maximumConsecutiveChars']),
                        function() {
                            environment = new Environment();
                            environment.setREST(REST.NewPoliciesMinusResult);
                            environment.setREST(REST.NewPoliciesMinus);
                            environment.apply();
                        },
                        steps.inputCorrectPassword("TestPassw0rd2"),
                        GeneralTestSteps.sleep(400),
                        steps.validatePasswordPolicyOnList('maximumRepeatingChars', false),
                        steps.validatePasswordPolicyOnList('maximumConsecutiveChars', false),
                        steps.validatePasswordPolicyOnList('minimumDigits', false)
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile - validate username and correct password', function() {

            this.timeout(timeout);
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

            it('Validate correct username', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername('useR1-_.GZ')
                    ])
                    .run(done);
            });

            it('Validate incorrect username with displayed forbidden characters in error message', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputIncorrectUsername("Use only: a-z, A-Z, 0-9, _, -, .")
                    ])
                    .run(done);
            });

            it('Validate incorrect username with double forbidden characters displayed once in error message', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputIncorrectUsername("user124***^^###)", "Use only: a-z, A-Z, 0-9, _, -, .")
                    ])
                    .run(done);
            });

            it('Validate correct password', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputCorrectPassword("Passw0rd")
                    ])
                    .run(done);
            });

        });

        describe('Usermgmtprofile password validation - password too short', function() {

            this.timeout(timeout);
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
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputIncorrectPasswordToShort("Pasw0rd"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([1])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile password validation - password too long', function() {

            this.timeout(timeout);
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
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputIncorrectPasswordToLong("Pasw0rd1234567890qwertyuiopasdfgh"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([0])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile password validation - password with no minimum lowercase characters ', function() {

            this.timeout(timeout);
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
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputIncorrectPasswordNoMinimumLowercaseLetters("PASSW0RD1"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([2])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile password validation - password with no minimum uppercase characters', function() {

            this.timeout(timeout);
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
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputIncorrectPasswordNoMinimumUppercaseLetters("passw0rd1"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([3])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile password validation - password with no digits', function() {

            this.timeout(timeout);
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
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputIncorrectPasswordNoMinimumDigits("Password"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([4])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile password validation - password with only digits', function() {

            this.timeout(timeout);
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
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputIncorrectPasswordOnlyDigits("12345678"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([2, 3])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile password validation - password with only digits', function() {

            this.timeout(timeout);
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
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputIncorrectPasswordOnlySpecialCharacters("!@#$%^&*()"),
                        steps.checkPasswordPoliciesAreValidatedCorrectly([2, 3, 4])
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile repeate password validation', function() {

            this.timeout(timeout);
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
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputIncorrectRepeatPasswordValue("Passw0rd", "Password")
                    ])
                    .run(done);
            });
            it('Validate repeat password - empty repeat password field', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputIncorrectRepeatPasswordValue("Passw0rd")
                    ])
                    .run(done);
            });
        });

        describe('Userprofileeditor Force Password Change', function() {

            this.timeout(timeout);
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

            it('Force change password - turn OFF', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("user1234"),
                        steps.inputCorrectPassword("Kruszywo1234"),
                        steps.inputDifferentCharactersInNameField("user"),
                        steps.inputDifferentCharactersInSurnameField("useruser"),
                        steps.inputProperEmailAddress("user@user.com"),
                        steps.clickResetPasswordFlag(),
                        steps.clickRole("ADMINISTRATOR"),
                        GeneralTestSteps.sleep(400),
                        steps.validateClickSaveButton(),
                        steps.waitForResponseOfCreateUser(),
                        // steps.restSpy(rest)
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

        });

        describe('Usermgmtprofile Name validation', function() {

            this.timeout(timeout);
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

            it('Validate Name - check for digits, letters, special characters', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputCorrectPassword("Passw0rd"),
                        steps.inputDifferentCharactersInNameField("!*&@(1234adsafsNMNKJ")
                    ])
                    .run(done);
            });
            it('Validate Name - check for error message after setting and deleting Name', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputCorrectPassword("Passw0rd"),
                        steps.inputDifferentCharactersInNameField("userName123"),
                        steps.inputDifferentCharactersInNameField("")
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile Surname validation', function() {

            this.timeout(timeout);
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

            it('Validate Surname - check for digits, letters, special characters', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputCorrectPassword("Passw0rd"),
                        steps.inputDifferentCharactersInNameField("username123"),
                        steps.inputDifferentCharactersInSurnameField("!*&@(1234adsafsNMNKJ")
                    ])
                    .run(done);
            });
            it('Validate Surname - check for error message after setting and deleting Surname', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputCorrectPassword("Passw0rd"),
                        steps.inputDifferentCharactersInNameField("username123"),
                        steps.inputDifferentCharactersInSurnameField("surname123"),
                        steps.inputDifferentCharactersInSurnameField("")
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile email validation', function() {

            this.timeout(timeout);
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

            it('Validate email - validate proper email addresses', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputCorrectPassword("Passw0rd"),
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
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername("User24"),
                        steps.inputCorrectPassword("Passw0rd"),
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

            this.timeout(timeout);
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

            it('Validate status button', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.clickStatusButtonEnabled(),
                        steps.clickStatusButtonDisabled(),
                        steps.clickStatusButtonEnabled()
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile authMode button - click authMode button', function() {

            this.timeout(timeout);
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

            it('Validate authMode button', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.clickAuthModeSelectBox('Remote'),
                        GeneralTestSteps.sleep(1000),
                        steps.checkAuthModeSelected('Remote'),
                        steps.clickAuthModeSelectBox('Local'),
                        GeneralTestSteps.sleep(1000),
                        steps.checkAuthModeSelected('Local')
                    ])
                    .run(done);
            });
        });

        describe('Usermgmtprofile validate error messages', function() {

            this.timeout(timeout);
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

            it('Check that all error messages are displayed after clicking save button', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToCreatePageAndWaitForPageIsLoaded,
                        steps.inputCorrectUsername(""),
                        steps.inputCorrectPassword(""),
                        steps.inputDifferentCharactersInNameField(""),
                        steps.inputDifferentCharactersInSurnameField(""),
                        steps.inputProperDescription(""),
                        steps.validateClickSaveButton(),
                        steps.checkErrorMessageUsernameMustBeSpecified(),
                        steps.checkErrorMessagePasswordAndRepeatPasswordMustBeSpecified(),
                        steps.checkErrorMessageNameMustBeSpecified(),
                        steps.checkErrorMessageSurnameMustBeSpecified()
                    ])
                    .run(done);
            });
        });

       describe('Check Assigned Role column', function() {

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

            it('Check Filter Assigned Role column', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralTestSteps.sleep(300),
                        steps.clickFilterRoleButton(0),
                        steps.clickFilterRoleListItem('Assigned')
                    ])
                    .run(done);
            });

            it('Check Filter Not Assigned Role column', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralTestSteps.sleep(300),
                        steps.clickFilterRoleButton(0),
                        steps.clickFilterRoleListItem('Not Assigned')
                    ])
                    .run(done);
            });

            it('Check Filter All Role column', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToEditPageAndWaitForPageIsLoaded('administrator'),
                        GeneralTestSteps.sleep(300),
                        steps.clickFilterRoleButton(0),
                        steps.clickFilterRoleListItem('All')
                    ])
                    .run(done);
            });
        });
    });
});
