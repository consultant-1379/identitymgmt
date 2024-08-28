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
    'src/targetgroup/Targetgroup',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/targetGroupEnvironment/Rest',
    'test/bit/common/targetmgmtlib/TargetGroup/Steps',
    'test/bit/common/identitymgmtlib/General/Steps',
    'identitymgmtlib/Utils',
    'i18n!/targetgroup/app.json',
    'i18n!/targetmgmtlib/dictionary.json'
], function (TargetGroup, Flow, Browser, Environment, TargetGroupRest, TargetGroupSteps, GeneralSteps, ServerResponseCodes, Dictionary, DictionaryLib) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 99999999;

    //sinon.log = function(_log){console.log(_log)}


    describe('Target Group Management - Create Target Group', function () {

        var environment, app;
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher' //TODO: fill breadcrumb
            }],
            namespace: 'targetmanagement/targetgroup/create',
            properties: {
                title: 'Create Target Group'
            }
        };

        beforeEach(function () {
            window.location.hash = 'targetmanagement/targetgroup/create';
            app = new TargetGroup(options);
        });

        afterEach(function () {
            Browser.gotoHash();
        });

        describe('Create Target Group - Success', function () {

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.CreateTargetGroup.CreateTargetGroupSuccess);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should succesfully create Target Group', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("mockName"),
                        TargetGroupSteps.setDescription("mockDescription"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForNotification,
                        GeneralSteps.verifyNotificationText(Dictionary.notifications.targetgroupCreated),
                        GeneralSteps.clickNotificationClose,
                        GeneralSteps.verifyLocationHash("#targetmanagement")
                    ])
                    .run(done);
            });
        });

        describe('Create Target Group Fail - unexpected http code', function () {

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.CreateTargetGroup.CreateTargetGroupFail_unexpected_http_code);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handle error response', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("mockName"),
                        TargetGroupSteps.setDescription("mockDescription"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText("Code 777 - Unexpected reason"),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                    ])
                    .run(done);
            });
        });

        describe('Create Target Group Fail - no internalError', function () {

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.CreateTargetGroup.CreateTargetGroupFail_no_internal_code);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handdle error response', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("mockName"),
                        TargetGroupSteps.setDescription("mockDescription"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText("Unprocessable Entity (422)"),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                    ])
                    .run(done);
            });
        });

        describe('Create Target Group Fail - internal code TGIDM-6-1-0', function () {

            var _internalCode = "TGIDM-6-1-0";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(400, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.CreateTargetGroup.CreateTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handdle error response', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("mockName"),
                        TargetGroupSteps.setDescription("mockDescription"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                    ])
                    .run(done);
            });
        });

        describe('Create Target Group Fail - internal code TGIDM-3-create', function () {

            var _internalCode = "TGIDM-3-create";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(403, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.CreateTargetGroup.CreateTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handdle error response', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("mockName"),
                        TargetGroupSteps.setDescription("mockDescription"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                    ])
                    .run(done);
            });
        });

        describe('Create Target Group Fail - internal code GenericDAO-4-3', function () {

            var _internalCode = "GenericDAO-4-3";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(404, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.CreateTargetGroup.CreateTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handdle error response', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("mockName"),
                        TargetGroupSteps.setDescription("mockDescription"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                    ])
                    .run(done);
            });
        });

        describe('Create Target Group Fail - internal code TGIDM-7-1-0', function () {

            var _internalCode = "TGIDM-7-1-0";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.CreateTargetGroup.CreateTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handdle error response', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("mockName"),
                        TargetGroupSteps.setDescription("mockDescription"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                    ])
                    .run(done);
            });
        });

        describe('Create Target Group Fail - internal code GenericDAO-5-3-0', function () {

            var _internalCode = "GenericDAO-5-3-0";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.CreateTargetGroup.CreateTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handdle error response', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("mockName"),
                        TargetGroupSteps.setDescription("mockDescription"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                    ])
                    .run(done);
            });
        });

        describe('Create Target Group Fail - internal code GenericDAO-5-1-8', function () {

            var _internalCode = "GenericDAO-5-1-8";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.CreateTargetGroup.CreateTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handdle error response', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("mockName"),
                        TargetGroupSteps.setDescription("mockDescription"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                    ])
                    .run(done);
            });
        });

        describe('Create Target Group Fail - internal code GenericDAO-10', function () {

            var _internalCode = "GenericDAO-10";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(500, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.CreateTargetGroup.CreateTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handdle error response', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("mockName"),
                        TargetGroupSteps.setDescription("mockDescription"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                    ])
                    .run(done);
            });
        });

        describe('Create Target Group Fail - internal validation', function () {

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should display error in case of TG name contains spaces', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("inc TG"),
                        TargetGroupSteps.setDescription("testDesc"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        TargetGroupSteps.verifyNameValidatorError(DictionaryLib.targetgroupModel.name_not_match_pattern),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                        ])
                    .run(done);
            });

            it('Should display error in case of TG name starts with _', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("__incTG1"),
                        TargetGroupSteps.setDescription("testDesc"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        TargetGroupSteps.verifyNameValidatorError(DictionaryLib.targetgroupModel.name_not_start_with_letter),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                        ])
                    .run(done);
            });

            it('Should display error in case of TG name contains #', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("inc_#_TG1"),
                        TargetGroupSteps.setDescription("testDesc"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        TargetGroupSteps.verifyNameValidatorError(DictionaryLib.targetgroupModel.name_not_match_pattern),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                        ])
                    .run(done);
            });

            it('Should display error in case of TG name ends with _', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("incTG1_"),
                        TargetGroupSteps.setDescription("testDesc"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        TargetGroupSteps.verifyNameValidatorError(DictionaryLib.targetgroupModel.name_end_with_alphanumeric),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                        ])
                    .run(done);
            });

            it('Should display error in case of TG name is empty', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName(""),
                        TargetGroupSteps.setDescription("testDesc"),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        TargetGroupSteps.verifyNameValidatorError(DictionaryLib.targetgroupModel.name_empty),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                        ])
                    .run(done);
            });

            it('Should display error in case of TG description is empty', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        TargetGroupSteps.setName("testTG"),
                        TargetGroupSteps.setDescription(""),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        TargetGroupSteps.verifyDescriptionValidatorError(DictionaryLib.targetgroupModel.description_empty),
                        GeneralSteps.verifyLocationHash("#targetmanagement/targetgroup/create")
                    ])
                    .run(done);
            });

        });
    });
});
