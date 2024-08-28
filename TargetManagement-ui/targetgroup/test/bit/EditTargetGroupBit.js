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
    'i18n!targetgroup/app.json',
    'i18n!targetmgmtlib/dictionary.json'
], function (TargetGroup, Flow, Browser, Environment, TargetGroupRest, TargetGroupSteps, GeneralSteps, ServerResponseCodes, Dictionary, DictionaryTgmLib) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 999999;

    describe('Target Group Management - Edit Target Group', function () {

        var environment, app;
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher' //TODO: fill breadcrumb
            }],
            namespace: '/targetmanagement/targetgroup',
            properties: {
                title: 'Edit Target Group'
            }
        };


        var scopeCollection = {
            collections: ["52295"],
            nestedCollections: [],
            networkObjects: [],
            recursivelyFoundNetworkObjects: [],
            savedSearches: [],
            equals: function(scope) { 
                return this.collections.equals(scope.collections) &&
                        this.nestedCollections.equals(scope.nestedCollections) &&
                        this.networkObjects.equals(scope.networkObjects) &&
                        this.savedSearches.equals(scope.savedSearches);
            }.bind(this)
        };

        var scopeSavedSearch = {
            collections: [],
            nestedCollections: [],
            networkObjects: [],
            savedSearches: [48649],
            equals: function(scope) { 
                return this.collections.equals(scope.collections) &&
                        this.nestedCollections.equals(scope.nestedCollections) &&
                        this.networkObjects.equals(scope.networkObjects) &&
                        this.savedSearches.equals(scope.savedSearches);
            }.bind(this)
        };

        beforeEach(function () {
            window.location.hash = '/targetmanagement/targetgroup/edit/mockName';
            app = new TargetGroup(options);
        });

        afterEach(function () {
            Browser.gotoHash();
        });

        describe('Edit Target Group - success', function () {

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.generatePutTargetSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateCollection);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateRootAssociations);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateSavedSearch);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateSavedSearchResult);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateObjectByPoID);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupDescriptionSuccess);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly change Target Group description', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForSuccessNotification(),
                        GeneralSteps.verifySuccessNotificationText(Dictionary.notifications.targetgroupEdited),
                        GeneralSteps.clickSuccessNotificationClose(),
                        GeneralSteps.verifyLocationHash("#targetmanagement")
                    ])
                    .run(done);
            });

           it('Should correctly change Target Group target list from collection', function (done) {
               this.timeout(DEFAULT_TEST_TIMEOUT);

               new Flow()
                   .setSteps([
                       GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                       TargetGroupSteps.loadTopologyData(app.getEventBus(), scopeCollection),
                       GeneralSteps.waitForSuccessNotification(),
                       GeneralSteps.clickSuccessNotificationClose(),
                       TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                       TargetGroupSteps.saveCreateTargetGroup(),
                       GeneralSteps.waitForSuccessNotification(),
                       GeneralSteps.clickSuccessNotificationClose(),
                       TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                       TargetGroupSteps.verifyTargets("LTE01ERBS00001"),
                       GeneralSteps.verifyLocationHash("#targetmanagement")
                   ])
                   .run(done);
           });

           it('Should correctly change Target Group target list from savedsearch', function (done) {
               this.timeout(DEFAULT_TEST_TIMEOUT);

               new Flow()
                   .setSteps([
                       GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                       TargetGroupSteps.loadTopologyData(app.getEventBus(), scopeSavedSearch),
                       TargetGroupSteps.onResume(app),
                       GeneralSteps.waitForSuccessNotification(),
                       GeneralSteps.clickSuccessNotificationClose(),
                       TargetGroupSteps.verifyTargets("LTE05ERBS00001"),
                       TargetGroupSteps.clickOnCancelButton(),
                       GeneralSteps.verifyLocationHash("#targetmanagement")
                   ])
                   .run(done);
           });

            it('Should correctly change Target Group target list from collection removing a target', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),                        
                        TargetGroupSteps.verifyTargets("LTE01ERBS00001"),
                        TargetGroupSteps.clickFilterSelectedByName("LTE01ERBS00001",2),
                        TargetGroupSteps.clickOnRemoveButton(),
                        TargetGroupSteps.verifyTargetsNotInList("LTE01ERBS00001",2),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForSuccessNotification(),
                        GeneralSteps.clickSuccessNotificationClose(),
                        GeneralSteps.verifyLocationHash("#targetmanagement")
                    ])
                    .run(done);
            });

            it('Should correctly filter target name', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),                        
                        TargetGroupSteps.verifyTargets("LTE01ERBS00001"),
                        TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                        TargetGroupSteps.putFilterTargetName('LTE01ERBS00001'),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.verifyTargets("LTE01ERBS00001"),
                        TargetGroupSteps.verifyTargetsNotInList("LTE01dg2ERBS20002",2),
                    ])
                    .run(done);
            });

            it('Should correctly filter partial target name', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),                        
                        TargetGroupSteps.verifyTargets("LTE01ERBS00001"),
                        TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                        TargetGroupSteps.putFilterTargetName('dg2'),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                        TargetGroupSteps.verifyTargetsNotInList("LTE01ERBS00001",2),                        
                    ])
                    .run(done);
            });

            it('Should correctly filter target type', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),                    
                        TargetGroupSteps.verifyTargets("LTE01ERBS00001"),
                        TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                        TargetGroupSteps.putFilterTargetType('RadioNode'),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                        TargetGroupSteps.verifyTargetsNotInList("LTE01ERBS00001",2),
                    ])
                    .run(done);
            });

            it('Should correctly filter partial target type', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),                        
                        TargetGroupSteps.verifyTargets("LTE01ERBS00001"),
                        TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                        TargetGroupSteps.putFilterTargetType('Radio'),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                        TargetGroupSteps.verifyTargetsNotInList("LTE01ERBS00001",2)                     
                    ])
                    .run(done);
            });

            it('Should correctly filter no targets by targetname', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),                        
                        TargetGroupSteps.verifyTargets("LTE01ERBS00001"),
                        TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                        TargetGroupSteps.putFilterTargetName('Pippo'),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.verifyTargetsNotInList("LTE01dg2ERBS20002", 2),
                        TargetGroupSteps.verifyTargetsNotInList("LTE01ERBS00001",2),
                        TargetGroupSteps.verifyInlineMessage(DictionaryTgmLib.targetListWidget.noData.header)
                    ])
                    .run(done);
            });

            it('Should correctly filter no targets by targetType', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),                        
                        TargetGroupSteps.verifyTargets("LTE01ERBS00001"),
                        TargetGroupSteps.verifyTargets("LTE01dg2ERBS20002"),
                        TargetGroupSteps.putFilterTargetType('Pippo'),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.verifyTargetsNotInList("LTE01dg2ERBS20002", 2),
                        TargetGroupSteps.verifyTargetsNotInList("LTE01ERBS00001",2),
                        TargetGroupSteps.verifyInlineMessage(DictionaryTgmLib.targetListWidget.noData.header)
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, unexpected http code', function () {

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_unexpected_http_code);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText("Code 777 - Unexpected reason"),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear()
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, invalid internal code', function () {

            var _internalCode = "mockInvalidInternalCode";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText("Unprocessable Entity (422)"),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle("Edit Target Group")
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: TGIDM-6-1-1', function () {

            var _internalCode = "TGIDM-6-1-1";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(400, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle("Edit Target Group")
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: TGIDM-6-1-2', function () {

            var _internalCode = "TGIDM-6-1-2";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(400, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle("Edit Target Group")
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: TGIDM-3-patch', function () {

            var _internalCode = "TGIDM-3-patch";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(403, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle("Edit Target Group")
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: GenericDAO-4-1', function () {

            var _internalCode = "GenericDAO-4-1";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(404, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle("Edit Target Group")
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: GenericDAO-4-2', function () {

            var _internalCode = "GenericDAO-4-2";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(402, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit)
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: GenericDAO-5-1-0', function () {

            var _internalCode = "GenericDAO-5-1-0";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit)
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: GenericDAO-5-2-0', function () {

            var _internalCode = "GenericDAO-5-2-0";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit)
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: TGIDM-15-2-1', function () {

            var _internalCode = "TGIDM-15-2-1";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit)
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: TGIDM-5-1-3', function () {

            var _internalCode = "TGIDM-5-1-3";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit)
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: TGIDM-5-1-4', function () {

            var _internalCode = "TGIDM-5-1-4";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit)
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: TGIDM-5-1-5', function () {

            var _internalCode = "TGIDM-5-1-5";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit)
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: TGIDM-5-1-6', function () {

            var _internalCode = "TGIDM-5-1-6";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit)
                    ])
                    .run(done);
            });
        });

        describe('Edit Target Group - edit fail, internal code: GenericDAO-10', function () {

            var _internalCode = "GenericDAO-10";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(500, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupSuccess);
                environment.setREST(TargetGroupRest.EditTargetGroup.generateTargetList);
                environment.setREST(TargetGroupRest.EditTargetGroup.EditTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error dialog', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        TargetGroupSteps.setDescription("mockDescriptionUpdated"),
                        GeneralSteps.sleep(500),
                        TargetGroupSteps.saveCreateTargetGroup(),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Error"),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage.internalErrorCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit)
                    ])
                    .run(done);
            });
        });

        describe('Fetch Target Group - load fail, Internal Code: TGIDM-3-read', function () {

            var _internalCode = "TGIDM-3-read";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(403, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error widget', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        GeneralSteps.waitForErrorWidget,
                        GeneralSteps.verifyErrorWidgetHeader(DictionaryTgmLib.targetgroupForm.fetch_target_group_failed),
                        GeneralSteps.verifyErrorWidgetContent(_internalCodeMessage.internalErrorCodeMessage)
                    ])
                    .run(done);
            });
        });

        describe('Fetch Target Group - load fail, Internal Code: GenericDAO-4-1', function () {

            var _internalCode = "GenericDAO-4-1";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(404, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Load correctly show error widget', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        GeneralSteps.waitForErrorWidget,
                        GeneralSteps.verifyErrorWidgetHeader(DictionaryTgmLib.targetgroupForm.fetch_target_group_failed),
                        GeneralSteps.verifyErrorWidgetContent(_internalCodeMessage.internalErrorCodeMessage)
                    ])
                    .run(done);
            });
        });

        describe('Fetch Target Group - load fail, Internal Code: GenericDAO-5-1-0', function () {

            var _internalCode = "GenericDAO-5-1-0";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error widget', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        GeneralSteps.waitForErrorWidget,
                        GeneralSteps.verifyErrorWidgetHeader(DictionaryTgmLib.targetgroupForm.fetch_target_group_failed),
                        GeneralSteps.verifyErrorWidgetContent(_internalCodeMessage.internalErrorCodeMessage)
                    ])
                    .run(done);
            });
        });

        describe('Fetch Target Group - load fail, Internal Code: GenericDAO-10', function () {

            var _internalCode = "GenericDAO-10";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(500, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.EditTargetGroup.LoadTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly show error widget', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        GeneralSteps.waitForErrorWidget,
                        GeneralSteps.verifyErrorWidgetHeader(DictionaryTgmLib.targetgroupForm.fetch_target_group_failed),
                        GeneralSteps.verifyErrorWidgetContent(_internalCodeMessage.internalErrorCodeMessage)
                    ])
                    .run(done);
            });
        });
    });
});
