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
    './environment/Rest',
    'i18n!userprofile/app.json'
], function(core, Flow, Browser, Environment, steps, expects, Model, UserProfile, REST, Dictionary) {
    'use strict';

    describe('Userprofile', function() {
        sinon.log = function (message) { console.log(message); };
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
                title: 'Edit Profile'
            }
        };

        beforeEach(function() {
            app = new UserProfile(options);
        });

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Userprofile - Check title,labels,buttons', function() {

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
                        steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                        steps.checkTitle(options.properties.title)
                    ])
                    .run(done);
            });
			
			it('Check Buttons', function(done) {				
                new Flow()
                    .setSteps([
                        steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                        steps.checkSaveButton(),
						steps.checkCancelButton()
                    ])
                    .run(done);
            });
			
			it('Check Headers', function(done) {				
                new Flow()
                    .setSteps([
                        steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                        steps.checkGeneralInformationHeader(),
						steps.checkDetailsHeader(),
						steps.checkRolesHeader()
                    ])
                    .run(done);
            });

        });
		
        describe('Userprofile - Roles', function() {

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
                        steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                        steps.checkDisplayedRoles(['ADMINISTRATOR', 'SECURITY_ADMIN'])
                    ])
                    .run(done);
            });

        });

        describe('Userprofile - Validation of Username, Name, Surname, Email', function() {

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

            it('Check Username', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                        steps.checkUsernameHeaderIsDisplayed(),
                        steps.checkUsernameIsDisplayed('administrator')
                    ])
                    .run(done);
            });

            it('Check Name validation', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                        steps.checkNameHeaderIsDisplayed(),
                        steps.checkDifferentCharactersInNameField("!*&@(1234adsafsNMNKJ"),
                    ])
                    .run(done);
            });

            it('Check Surname validation', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                        steps.checkSurnameHeaderIsDisplayed(),
                        steps.checkDifferentCharactersInSurnameField("!*&@(1234adsafsNMNKJ"),
                    ])
                    .run(done);
            });

            it('Check Email validation - correct Email Address ', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                        steps.checkEmailHeaderIsDisplayed(),
                        steps.inputCorrectEmailAddress("user@gmail.com"),
                        steps.inputCorrectEmailAddress("user@gmail.se"),
                        steps.inputCorrectEmailAddress("user@gmail.CO"),
                        steps.inputCorrectEmailAddress("user@gmail4.com"),
                        steps.inputCorrectEmailAddress("user@gma4il4.com"),
                        steps.inputCorrectEmailAddress("user@32gmail4.com"),
                        steps.inputCorrectEmailAddress("user@4.com"),
                        steps.inputCorrectEmailAddress("user@c.com"),
                        steps.inputCorrectEmailAddress("user@C.com"),
                        steps.inputCorrectEmailAddress("user@32gmail4.com"),
                        steps.inputCorrectEmailAddress("a@32gmail4.com"),
                        steps.inputCorrectEmailAddress("A@32gmail4.com"),
                        steps.inputCorrectEmailAddress("3@32gmail4.com"),
                        steps.inputCorrectEmailAddress("33us.3e34@32gmail4.commm"),
                        steps.inputCorrectEmailAddress("~!$#%^|`&*_-.+={}/'?@32gmail4.com"),
                        steps.inputCorrectEmailAddress("user@gma.sadf.asdil.com"),
                        steps.inputCorrectEmailAddress("")
                    ])
                    .run(done);
            });

            it('Check Email validation - incorrect Email Address ', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                        steps.checkEmailHeaderIsDisplayed(),
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

            it('Check Error messages when empty fields are set', function(done) {
                new Flow()
                    .setSteps([
                        steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                        steps.checkDifferentCharactersInNameField(""),
                        steps.checkDifferentCharactersInSurnameField(""),
                        steps.clickSaveButton(),
                        steps.checkErrorMessage(0, Dictionary.errorMessages.emptyName),
                        steps.checkErrorMessage(1, Dictionary.errorMessages.emptySurname)
                    ])
                    .run(done);
            });

        });

        describe('Userprofile - check if regular user can edit forbidden attributes', function() {

            this.timeout(7000);
            beforeEach(function() {
                environment = new Environment();
                environment.setREST(REST.RegularUser);
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
                         steps.goToUserProfileEditPageAndWaitForPageIsLoaded(),
                         steps.checkIfNotModifiableFieldIsVisible("name","regular"),
                         steps.checkIfNotModifiableFieldIsVisible("surname", "user"),
                         steps.checkIfNotModifiableFieldIsVisible("email", "regular_user@regular.user")
                     ])
                     .run(done);
            });
        });
    });
});