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

    describe('Target Group Management - View Target Group', function () {

        var environment, app;
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher' //TODO: fill breadcrumb
            }],
            namespace: '/targetmanagement/targetgroup',
            properties: {
                title: 'View Target Group'
            }
        };

        beforeEach(function () {
            window.location.hash = '/targetmanagement/targetgroup/view/mockName';
            app = new TargetGroup(options);
        });

        afterEach(function () {
            Browser.gotoHash();
        });

        describe('View Target Group - load fail, unexpected http code', function () {

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.ViewTargetGroup.LoadTargetGroupFail_unexpected_http_code);
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
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.view),
                        GeneralSteps.waitForErrorWidget,
                        GeneralSteps.verifyErrorWidgetHeader(DictionaryTgmLib.targetgroupForm.fetch_target_group_failed),
                        GeneralSteps.verifyErrorWidgetContent("Code 777 - Unexpected reason")
                    ])
                    .run(done);
            });
        });

        describe('View Target Group - load fail, no internal code', function () {

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.ViewTargetGroup.LoadTargetGroupFail_no_internal_code);
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
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.view),
                        GeneralSteps.waitForErrorWidget,
                        GeneralSteps.verifyErrorWidgetHeader(DictionaryTgmLib.targetgroupForm.fetch_target_group_failed),
                        GeneralSteps.verifyErrorWidgetContent("Unprocessable Entity (422)")
                    ])
                    .run(done);
            });
        });

        describe('View Target Group - load fail, Internal Code: TGIDM-3-read', function () {

            var _internalCode = "TGIDM-3-read";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(403, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.ViewTargetGroup.LoadTargetGroupFail_internalCodeGenerator(_internalCode));
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
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.view),
                        GeneralSteps.waitForErrorWidget,
                        GeneralSteps.verifyErrorWidgetHeader(DictionaryTgmLib.targetgroupForm.fetch_target_group_failed),
                        GeneralSteps.verifyErrorWidgetContent(_internalCodeMessage.internalErrorCodeMessage)
                    ])
                    .run(done);
            });
        });

        describe('View Target Group - load fail, Internal Code: GenericDAO-4-1', function () {

            var _internalCode = "GenericDAO-4-1";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(404, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.ViewTargetGroup.LoadTargetGroupFail_internalCodeGenerator(_internalCode));
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
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.view),
                        GeneralSteps.waitForErrorWidget,
                        GeneralSteps.verifyErrorWidgetHeader(DictionaryTgmLib.targetgroupForm.fetch_target_group_failed),
                        GeneralSteps.verifyErrorWidgetContent(_internalCodeMessage.internalErrorCodeMessage)
                    ])
                    .run(done);
            });
        });

        describe('View Target Group - load fail, Internal Code: GenericDAO-5-1-0', function () {

            var _internalCode = "GenericDAO-5-1-0";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.ViewTargetGroup.LoadTargetGroupFail_internalCodeGenerator(_internalCode));
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();
            });

            it('View correctly show error widget', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.view),
                        GeneralSteps.waitForErrorWidget,
                        GeneralSteps.verifyErrorWidgetHeader(DictionaryTgmLib.targetgroupForm.fetch_target_group_failed),
                        GeneralSteps.verifyErrorWidgetContent(_internalCodeMessage.internalErrorCodeMessage)
                    ])
                    .run(done);
            });
        });

        describe('View Target Group - load fail, Internal Code: GenericDAO-10', function () {

            var _internalCode = "GenericDAO-10";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(500, _internalCode);

            beforeEach(function () {
                environment = new Environment();
                environment.setREST(TargetGroupRest.AvabilityCheck.Default);
                environment.setREST(TargetGroupRest.ViewTargetGroup.LoadTargetGroupFail_internalCodeGenerator(_internalCode));
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
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.view),
                        GeneralSteps.waitForErrorWidget,
                        GeneralSteps.verifyErrorWidgetHeader(DictionaryTgmLib.targetgroupForm.fetch_target_group_failed),
                        GeneralSteps.verifyErrorWidgetContent(_internalCodeMessage.internalErrorCodeMessage)
                    ])
                    .run(done);
            });
        });
    });
});