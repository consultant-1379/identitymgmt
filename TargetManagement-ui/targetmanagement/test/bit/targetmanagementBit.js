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
    'src/targetmanagement/Targetmanagement',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/common/targetmgmtlib/Targetmanagement/Steps',
    'test/bit/common/identitymgmtlib/General/Steps',
    'test/bit/common/identitymgmtlib/PaginatedTable/Steps',
    'test/bit/targetmanagementEnvironment/Rest',
    'test/bit/targetmanagementEnvironment/data/ExpectedAscData',
    'i18n!identitymgmtlib/error-codes.json',
    'i18n!targetmanagement/app.json'
], function(Targetmanagement, Flow, Browser, Environment, TargetmanagementSteps, GeneralSteps, PaginatedTableSteps, TargetGroupRest, ExpectedAscData, ErrorCodes, Dictionary) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 20000;

    describe('Targetmanagement - Bit Tests', function() {

        var environment, app;
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher'
            }],
            namespace: 'targetmanagement',
            properties: {
                title: 'Target Group Management'
            }
        };

        beforeEach(function() {
            window.location.hash = 'targetmanagement?pagenumber=1&pagesize=10';
            app = new Targetmanagement(options);
        });

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Targetmanagement - List target groups', function() {

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should properly init application and load targetgroups list', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        GeneralSteps.verifyLocationHashParameterPresent('pagenumber'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashParameterPresent('pagesize'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
                        GeneralSteps.verifyLocationHashParameterPresent('sort'),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"name","order":"asc"}'),
                        PaginatedTableSteps.verifyTableLength(10),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.createTargetGroup),
                        GeneralSteps.verifyLocationHash('#targetmanagement/targetgroup/create')
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should show error with Internal code: TGIDM-3-query', function() {

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.GetTargetGroups.generateGetListFail);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should properly show error dialog', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Access Denied"),
                        GeneralSteps.verifyDialogSecondaryText("Your Role does not allow you access to this application. Contact your System Administrator to change your access rights or return to the Application Launcher."),
                        GeneralSteps.clickDialogButton('Ok'),
                        //GeneralSteps.waitForDialogDisappear()
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should successfully delete target group', function() {

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.setREST(TargetGroupRest.GetTargetGroups.generateDeleteTargetGroupSuccess);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should properly show error dialog', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.sleep(2000),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.deleteTargetGroup),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.confirmDialog.deleteTgHeader),
                        GeneralSteps.verifyDialogSecondaryText(Dictionary.deleteTargetGroups.confirmDialog.deleteTgContent),
                        GeneralSteps.clickDialogButton(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.waitForNotification,
                        GeneralSteps.clickNotificationClose
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should fail delete target group', function() {

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupFail_unexpected_http_code);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handle error response with unexpected http code', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.sleep(2000),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.deleteTargetGroup),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.confirmDialog.deleteTgHeader),
                        GeneralSteps.verifyDialogSecondaryText(Dictionary.deleteTargetGroups.confirmDialog.deleteTgContent),
                        GeneralSteps.clickDialogButton(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup),
                        GeneralSteps.verifyDialogSecondaryText("Code 777 - Unexpected reason"),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHashPage("#targetmanagement")
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should fail delete target group', function() {

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupFail_no_internal_code);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('Should correctly handle error response with no internal code', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.sleep(2000),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.deleteTargetGroup),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.confirmDialog.deleteTgHeader),
                        GeneralSteps.verifyDialogSecondaryText(Dictionary.deleteTargetGroups.confirmDialog.deleteTgContent),
                        GeneralSteps.clickDialogButton(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup),
                        GeneralSteps.verifyDialogSecondaryText("Unprocessable Entity (422)"),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHashPage("#targetmanagement")
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should fail delete target group', function() {

            var _internalCode = "TGIDM-3-delete";
            var _internalCodeMessage = ErrorCodes.internalErrorCodes[_internalCode];

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should properly show error dialog with internal code TGIDM-3-delete', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.sleep(2000),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.deleteTargetGroup),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.clickDialogButton(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHashPage("#targetmanagement")
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should fail delete target group', function() {

            var _internalCode = "GenericDAO-4-1";
            var _internalCodeMessage = ErrorCodes.internalErrorCodes[_internalCode];

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should properly show error dialog with internal code GenericDAO-4-1', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.sleep(2000),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.deleteTargetGroup),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.clickDialogButton(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHashPage("#targetmanagement")
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should fail delete target group', function() {

            var _internalCode = "GenericDAO-5-1-0";
            var _internalCodeMessage = ErrorCodes.internalErrorCodes[_internalCode];

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should properly show error dialog with internal code GenericDAO-5-1-0', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.sleep(2000),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.deleteTargetGroup),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.clickDialogButton(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHashPage("#targetmanagement")
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should fail delete target group', function() {

            var _internalCode = "TGIDM-5-1-2";
            var _internalCodeMessage = ErrorCodes.internalErrorCodes[_internalCode];

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should properly show error dialog with internal code TGIDM-5-1-2', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.sleep(2000),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.deleteTargetGroup),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.clickDialogButton(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHashPage("#targetmanagement")
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should fail delete target group', function() {

            var _internalCode = "TGIDM-5-1-1";
            var _internalCodeMessage = ErrorCodes.internalErrorCodes[_internalCode];

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should properly show error dialog with internal code TGIDM-5-1-1', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.sleep(2000),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.deleteTargetGroup),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.clickDialogButton(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHashPage("#targetmanagement")
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should fail delete target group', function() {

            var _internalCode = "GenericDAO-10";
            var _internalCodeMessage = ErrorCodes.internalErrorCodes[_internalCode];

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should properly show error dialog with internal code GenericDAO-10', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.sleep(2000),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.deleteTargetGroup),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.clickDialogButton(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup),
                        GeneralSteps.verifyDialogSecondaryText(_internalCodeMessage),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHashPage("#targetmanagement")
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - should fail delete multiple target groups with different errors', function() {

            var _internalCode_GenericDAO_10 = "GenericDAO-10";
            var _internalCode_TGIDM_5_1_1 = "TGIDM-5-1-1";
            var _internalCode_TGIDM_5_1_2 = "TGIDM_5_1_2";
            var _internalCode_GenericDAO_5_1_0 = "GenericDAO-5-1-0";
            var _internalCode_GenericDAO_4_1 = "GenericDAO-4-1";
            var _internalCode_TGIDM_3_delete = "TGIDM-3-delete";

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupMultipleFail_internalCodeGenerator(_internalCode_GenericDAO_10, "mockName1"));
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupMultipleFail_internalCodeGenerator(_internalCode_TGIDM_5_1_1, "mockName2"));
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupMultipleFail_internalCodeGenerator(_internalCode_TGIDM_5_1_2, "mockName3"));
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupMultipleFail_internalCodeGenerator(_internalCode_GenericDAO_5_1_0, "mockName4"));
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupMultipleFail_internalCodeGenerator(_internalCode_GenericDAO_4_1, "mockName5"));
                environment.setREST(TargetGroupRest.GetTargetGroups.DeleteTargetGroupMultipleFail_internalCodeGenerator(_internalCode_TGIDM_3_delete, "mockName6"));


                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should properly show error dialog with internal code GenericDAO-10', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        // TargetmanagementSteps.selectMultipleTargetGroups,

                        PaginatedTableSteps.selectRow(3),
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.sleep(2000),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.deleteTargetGroup),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.clickDialogButton(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.verifyLocationHashPage("#targetmanagement")
                    ])
                    .run(done);
            });
        });

        describe('Targetmanagement - sort', function() {


            beforeEach(function() {
                environment = new Environment();
                environment.setREST(TargetGroupRest.Default);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should sort Target Group Name asc and desc', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        GeneralSteps.sleep(2000),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"name","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Target Group Name'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"name"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedAscData,
                            sortMode: "desc",
                            column: "Target Group Name",
                            from: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Target Group Name'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"name"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedAscData,
                            sortMode: "asc",
                            column: "Target Group Name",
                            from: 0,
                            to: 9
                        })
                    ])
                    .run(done);
            });

            it('Should sort Description asc and desc', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        GeneralSteps.sleep(2000),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"name","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Description'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"description"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedAscData,
                            sortMode: "asc",
                            column: "Description",
                            from: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Description'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"description"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedAscData,
                            sortMode: "desc",
                            column: "Description",
                            from: 0,
                            to: 9
                        })
                    ])
                    .run(done);
            });
        });
    });
});
