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
    'src/userrole/UserRole',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/userRoleEnvironment/Rest',
    'test/bit/common/rolemgmtlib/Userrole/Steps',
    'test/bit/common/identitymgmtlib/General/Steps',
    'i18n!userrole/dictionary.json'
], function (UserRole, Flow, Browser, Environment, UserRoleRest, UserRoleSteps, GeneralSteps, Dictionary) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 20000;

    sinon.log = function (message) {
        console.log(message);
    };

    var __FakeAbort = sinon.FakeXMLHttpRequest.prototype.abort;
    sinon.FakeXMLHttpRequest.prototype.abort = function () {
        this.onload = function () {
        };
        this.onerror = function () {
        };
        __FakeAbort.call(this);
    };

    describe('Role Management - Edit User Role', function () {

        var environment, app;

        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher'
            }, {
                name: 'Role management'
            }],
            namespace: 'rolemanagement/userrole',
            properties: {
                title: 'Role Management'
            }
        };

        beforeEach(function () {
            environment = new Environment();
            environment.setREST(UserRoleRest.Default);
            environment.setREST(UserRoleRest.EditRole.GetComRole);
            environment.setREST(UserRoleRest.EditRole.PutComRole);
            environment.setREST(UserRoleRest.EditRole.GetComRoleAlias);
            environment.setREST(UserRoleRest.EditRole.PutComRoleAlias);
            environment.setREST(UserRoleRest.EditRole.GetCustomRole);
            environment.setREST(UserRoleRest.EditRole.PutCustomRole);

            environment.apply();
            app = new UserRole(options);

            app.start(Browser.getElement('#bitContainer'));
        });

        afterEach(function () {
            Browser.gotoHash();
        });

        describe('Successfully Edit Role ', function () {

            beforeEach(function () {
            });

            afterEach(function () {
                app.stop();
                environment.restore();
            });

            it('Should check default value of edit role fields', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/SystemAdministrator"),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.edit),
                        UserRoleSteps.verifyEditNameValue("SystemAdministrator"),
                        UserRoleSteps.verifyEditDescriptionValue("Provides full control over Managed Element model fragments related to System Functions, Equipment and Transport, excluding the fragment related to Security Management"),
                        UserRoleSteps.verifyStatusFieldValue("ENABLED"),
                        UserRoleSteps.verifyIsRoleTypeFieldDisabled
                    ])
                    .run(done);
            });

            it('Should edit COM role correctly ', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/SystemAdministrator"),
                        UserRoleSteps.setName("MockName"),
                        UserRoleSteps.setDescription("MockDescription"),
                        UserRoleSteps.setStatus("DISABLED"),
                        UserRoleSteps.clickSaveButton,
                        GeneralSteps.waitForNotification(),
                        GeneralSteps.verifyNotificationText(Dictionary.roleUpdated),
                        GeneralSteps.clickNotificationClose(),
                        GeneralSteps.verifyLocationHash("#rolemanagement")
                    ])
                    .run(done);
            });

            it('Should edit COM role alias correctly ', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/comalias_enabled_1"),
                        UserRoleSteps.setName("MockName"),
                        UserRoleSteps.setDescription("MockDescription"),
                        UserRoleSteps.setStatus("DISABLED"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        UserRoleSteps.selectComRole,
                        UserRoleSteps.clickSaveButton,
                        GeneralSteps.waitForSuccessNotification(),
                        GeneralSteps.verifySuccessNotificationText(Dictionary.roleUpdated),
                        GeneralSteps.clickSuccessNotificationClose(),
                        GeneralSteps.verifyLocationHash("#rolemanagement")
                    ])
                    .run(done);
            });

            it('Should edit Custom role correctly ', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/custom_enabled_1"),
                        UserRoleSteps.setDescription("MockDescription"),
                        UserRoleSteps.setStatus("DISABLED"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        UserRoleSteps.selectComRole,
                        UserRoleSteps.clickTab("Capabilities"),
                        UserRoleSteps.waitForCapabilitiesValue("130"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyCapabilitiesAreVisible,
                        UserRoleSteps.verifyTitleCapabilitiesIsVisible,
                        UserRoleSteps.verifyCounterCapabilitiesIsVisible,
                        UserRoleSteps.selectCapability,
                        UserRoleSteps.clickSaveButton,
                        GeneralSteps.waitForSuccessNotification(),
                        GeneralSteps.verifySuccessNotificationText(Dictionary.roleUpdated),
                        GeneralSteps.clickSuccessNotificationClose(),
                        GeneralSteps.verifyLocationHash("#rolemanagement")
                    ])
                    .run(done);
            });
        });
        // describe('Fail EditRole', function () {
        //
        //     beforeEach(function () {
        //         environment = new Environment();
        //         environment.setREST(UserRoleRest.Default);
        //         environment.setREST(UserRoleRest.EditRole.GetComRoleAlias);
        //         environment.setREST(UserRoleRest.EditRole.PutComRoleAliasFail);
        //         environment.setREST(UserRoleRest.EditRole.GetCustomRole);
        //         environment.setREST(UserRoleRest.EditRole.PutCustomRoleFail);
        //         environment.setREST(UserRoleRest.EditRole.GetComRole);
        //         environment.setREST(UserRoleRest.EditRole.PutComRoleFail);
        //
        //         environment.apply();
        //         app.start(Browser.getElement('#bitContainer'));
        //     });
        //
        //     afterEach(function () {
        //         app.stop();
        //         environment.restore();
        //     });
        //
        //     it('Should fail edit COM role Alias', function (done) {
        //         this.timeout(DEFAULT_TEST_TIMEOUT);
        //
        //         new Flow()
        //             .setSteps([
        //                 GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/comalias_enabled_1"),
        //                 UserRoleSteps.setName("MockName"),
        //                 UserRoleSteps.setDescription("MockDescription"),
        //                 UserRoleSteps.setStatus("DISABLED"),
        //                 UserRoleSteps.waitForComRolesAreLoaded,
        //                 UserRoleSteps.verifyRolesAreVisible,
        //                 UserRoleSteps.selectComRole,
        //                 UserRoleSteps.clickSaveButton,
        //                 GeneralSteps.waitForDialog(),
        //                 GeneralSteps.verifyDialogPrimaryText("Error"),
        //                 GeneralSteps.verifyDialogSecondaryText("Role name must be unique"),
        //                 GeneralSteps.clickDialogOkButton,
        //                 GeneralSteps.waitForDialogDisappear(),
        //                 GeneralSteps.verifyLocationHash("#rolemanagement/userrole/edit/comalias_enabled_1")
        //             ])
        //             .run(done);
        //     });
        //
        //     it('Should fail edit Custom Role', function (done) {
        //         this.timeout(DEFAULT_TEST_TIMEOUT);
        //
        //         new Flow()
        //             .setSteps([
        //                 GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/custom_enabled_1"),
        //                 UserRoleSteps.setDescription("MockDescription"),
        //                 UserRoleSteps.setStatus("DISABLED"),
        //                 UserRoleSteps.waitForComRolesAreLoaded,
        //                 UserRoleSteps.verifyRolesAreVisible,
        //                 UserRoleSteps.selectComRole,
        //                 UserRoleSteps.clickTab("Capabilities"),
        //                 UserRoleSteps.waitForCapabilitiesValue("130"),
        //                 UserRoleSteps.verifyCapabilitiesAreVisible,
        //                 UserRoleSteps.selectCapability,
        //                 UserRoleSteps.clickSaveButton,
        //                 GeneralSteps.waitForDialog(),
        //                 GeneralSteps.verifyDialogPrimaryText("Error"),
        //                 GeneralSteps.verifyDialogSecondaryText("Role name must be unique"),
        //                 GeneralSteps.clickDialogOkButton,
        //                 GeneralSteps.waitForDialogDisappear(),
        //                 GeneralSteps.verifyLocationHash("#rolemanagement/userrole/edit/custom_enabled_1")
        //             ])
        //             .run(done);
        //     });
        //
        //     it('Should fail edit COM Role', function (done) {
        //         this.timeout(DEFAULT_TEST_TIMEOUT);
        //
        //         new Flow()
        //             .setSteps([
        //                 GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/SystemAdministrator"),
        //                 UserRoleSteps.setName("MockName"),
        //                 UserRoleSteps.setDescription("MockDescription"),
        //                 UserRoleSteps.setStatus("DISABLED"),
        //                 UserRoleSteps.clickSaveButton,
        //                 GeneralSteps.waitForDialog(),
        //                 GeneralSteps.verifyDialogPrimaryText("Error"),
        //                 GeneralSteps.verifyDialogSecondaryText("Role name must be unique"),
        //                 GeneralSteps.clickDialogOkButton,
        //                 GeneralSteps.waitForDialogDisappear(),
        //                 GeneralSteps.verifyLocationHash("#rolemanagement/userrole/edit/SystemAdministrator")
        //             ])
        //             .run(done);
        //     });
        //
        // });



        describe('Edit Role - verify Roles and Capabilities Table', function () {

            beforeEach(function () {
             environment = new Environment();
             environment.setREST(UserRoleRest.Default);
             environment.setREST(UserRoleRest.EditRole.GetComRoleAlias);
             environment.setREST(UserRoleRest.EditRole.PutComRoleAliasFail);
             environment.setREST(UserRoleRest.EditRole.GetCustomRole);
             environment.setREST(UserRoleRest.EditRole.PutCustomRoleFail);
             environment.setREST(UserRoleRest.EditRole.GetComRole);
             environment.setREST(UserRoleRest.EditRole.PutComRoleFail);

             environment.apply();
             app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
             app.stop();
             environment.restore();
            });

            it('For edit Custom Role, Roles Table should have 3 column with proper name', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/custom_enabled_1"),
                        GeneralSteps.sleep(500),
                        UserRoleSteps.clickTab("COM Roles"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTableColumnsName("Name"),
                        UserRoleSteps.verifyTableColumnsName("Role Type"),
                        UserRoleSteps.verifyTableColumnsName("Description")

                    ])
                    .run(done);
            });

            it('For edit Custom Role, Task Profiles Table should have 3 column with proper name', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/custom_enabled_1"),
                        GeneralSteps.sleep(500),
                        UserRoleSteps.clickTab("Task Profile Roles"),
                        UserRoleSteps.waitForTaskProfileRolesAreLoaded,
                        UserRoleSteps.verifyTaskProfilesAreVisible,
                        UserRoleSteps.verifyTableColumnsName("Name"),
                        UserRoleSteps.verifyTableColumnsName("Role Type"),
                        UserRoleSteps.verifyTableColumnsName("Description")

                    ])
                    .run(done);
            });

            it('For edit Custom Role, Capabilities Table should have 4 column with proper name', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/custom_enabled_1"),

                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.clickTab("Capabilities"),
                        UserRoleSteps.waitForCapabilitiesValue("130"),
                        UserRoleSteps.verifyCapabilitiesAreVisible,
                        UserRoleSteps.verifyTitleCapabilitiesIsVisible,
                        UserRoleSteps.verifyCounterCapabilitiesIsVisible,
                        UserRoleSteps.selectCapability,
                        UserRoleSteps.verifyTableColumnsName("Application"),
                        UserRoleSteps.verifyTableColumnsName("Resource"),
                        UserRoleSteps.verifyTableColumnsName("Operation"),
                        UserRoleSteps.verifyTableColumnsName("Description")
                    ])
                    .run(done);
            });

            it('For edit COM role alias, COM Roles Table should have 2 column with proper name', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.changeLocationHash("rolemanagement/userrole/edit/comalias_enabled_1"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        UserRoleSteps.verifyTableColumnsName("Role Name"),
                        UserRoleSteps.verifyTableColumnsName("Description")
                    ])
                    .run(done);
            });
        });

    });
});
