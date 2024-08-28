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
    'test/bit/common/identitymgmtlib/PaginatedTable/Steps',
    'identitymgmtlib/Utils',
    'i18n!userrole/app.json',
    'i18n!userrole/dictionary.json',
    'test/bit/userRoleEnvironment/data/ExpectedContentTables'
], function(UserRole, Flow, Browser, Environment, UserRoleRest, UserRoleSteps, GeneralSteps, PaginatedTableSteps, ServerResponseCodes, DictionaryApp, Dictionary, ExpectedContentTables) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 20000;

    sinon.log = function(message) {
        console.log(message);
    };

    var __FakeAbort = sinon.FakeXMLHttpRequest.prototype.abort;
    sinon.FakeXMLHttpRequest.prototype.abort = function() {
        this.onload = function() {};
        this.onerror = function() {};
        __FakeAbort.call(this);
    };

    describe('Role Management - Create User Role', function() {

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

        beforeEach(function() {
            window.location.hash = 'rolemanagement/userrole/create';
            app = new UserRole(options);
        });

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Successfully Create Role ', function() {

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(UserRoleRest.Default);
                environment.setREST(UserRoleRest.PostRole.PostSuccess);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should check default value of create role fields', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(DictionaryApp.headers.create),
                        UserRoleSteps.verifyNamePlaceholderText,
                        UserRoleSteps.verifyDescriptionPlaceholderText,
                        UserRoleSteps.verifyDefaultRoleTypeValue
                    ])
                    .run(done);
            });

            it('Should successfully create COM Role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        UserRoleSteps.setName("MockName"),
                        UserRoleSteps.setDescription("MockDescription"),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("COM Role"),
                        UserRoleSteps.waitForRoleTypeValue("COM Role"),
                        UserRoleSteps.clickSaveButton,
                        GeneralSteps.waitForSuccessNotification(),
                        GeneralSteps.verifySuccessNotificationText(Dictionary.roleCreated),
                        GeneralSteps.clickSuccessNotificationClose()
                    ])
                    .run(done);
            });

            it('Should successfully create COM Role Alias', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        UserRoleSteps.setName("MockName"),
                        UserRoleSteps.setDescription("MockDescription"),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("COM Role Alias"),
                        UserRoleSteps.waitForRoleTypeValue("COM Role Alias"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        UserRoleSteps.selectComRole,
                        UserRoleSteps.clickSaveButton,
                        GeneralSteps.waitForSuccessNotification(),
                        GeneralSteps.verifySuccessNotificationText(Dictionary.roleCreated),
                        GeneralSteps.clickSuccessNotificationClose(),
                        GeneralSteps.verifyLocationHash("#rolemanagement")
                    ])
                    .run(done);
            });

            it('Should successfully create Custom Role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        UserRoleSteps.setName("MockName"),
                        UserRoleSteps.setDescription("MockDescription"),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("Custom Role"),
                        UserRoleSteps.waitForRoleTypeValue("Custom Role"),
                        UserRoleSteps.clickTab("COM Roles"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        UserRoleSteps.selectComRole,
                        UserRoleSteps.clickTab("Capabilities"),
                        UserRoleSteps.waitForCapabilitiesValue("130"),
                        UserRoleSteps.verifyCapabilitiesAreVisible,
                        UserRoleSteps.verifyTitleCapabilitiesIsVisible,
                        UserRoleSteps.verifyCounterCapabilitiesIsVisible,
                        UserRoleSteps.selectCapability,
                        UserRoleSteps.clickTab("Task Profile Roles"),
                        UserRoleSteps.waitForTaskProfileRolesAreLoaded,
                        UserRoleSteps.verifyTaskProfilesAreVisible,
                        UserRoleSteps.verifyTitleTaskProfilesIsVisible,
                        UserRoleSteps.verifyCounterTaskProfilesIsVisible,
                        UserRoleSteps.selectTaskProfileRole,
                        UserRoleSteps.clickSaveButton,
                        GeneralSteps.waitForSuccessNotification(),
                        GeneralSteps.verifySuccessNotificationText(Dictionary.roleCreated),
                        GeneralSteps.clickSuccessNotificationClose(),
                        GeneralSteps.verifyLocationHash("#rolemanagement")
                    ])
                    .run(done);
            });
        });

        describe('Failed Create Role ', function() {

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(UserRoleRest.Default);
                environment.setREST(UserRoleRest.PostRole.PostFail);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should fail create COM role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        UserRoleSteps.setName("Role Name With Spaces"),
                        UserRoleSteps.setDescription(""),
                        UserRoleSteps.clickSaveButton,
                        UserRoleSteps.verifyCreateErrors,
                        UserRoleSteps.setName("MockNameFailed"),
                        UserRoleSteps.setDescription("MockDescription"),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("COM Role"),
                        UserRoleSteps.waitForRoleTypeValue("COM Role"),
                        UserRoleSteps.clickSaveButton,
                        GeneralSteps.sleep(100),
                        UserRoleSteps.verifyCreateErrorByText(Dictionary.roleName_must_be_unique),
                        GeneralSteps.verifyLocationHash("#rolemanagement/userrole/create")
                    ])
                    .run(done);
            });

            it('Should fail create COM Role Alias', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        UserRoleSteps.setName("MockNameFailed"),
                        UserRoleSteps.setDescription("MockFailedDescription"),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("COM Role Alias"),
                        UserRoleSteps.waitForRoleTypeValue("COM Role Alias"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        UserRoleSteps.selectComRole,
                        UserRoleSteps.clickSaveButton,
                        GeneralSteps.sleep(100),
                        UserRoleSteps.verifyCreateErrorByText(Dictionary.roleName_must_be_unique),
                        GeneralSteps.verifyLocationHash("#rolemanagement/userrole/create")
                    ])
                    .run(done);
            });

            it('Should fail create Custom Role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        UserRoleSteps.setName("MockNameFailed"),
                        UserRoleSteps.setDescription("MockFailedDescription"),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("Custom Role"),
                        UserRoleSteps.waitForRoleTypeValue("Custom Role"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        UserRoleSteps.selectComRole,
                        UserRoleSteps.clickTab("Capabilities"),
                        UserRoleSteps.waitForCapabilitiesValue("130"),
                        UserRoleSteps.verifyCapabilitiesAreVisible,
                        UserRoleSteps.verifyTitleCapabilitiesIsVisible,
                        UserRoleSteps.verifyCounterCapabilitiesIsVisible,
                        UserRoleSteps.selectCapability,
                        UserRoleSteps.clickSaveButton,
                        GeneralSteps.sleep(100),
                        UserRoleSteps.verifyCreateErrorByText(Dictionary.roleName_must_be_unique),
                        GeneralSteps.verifyLocationHash("#rolemanagement/userrole/create")
                    ])
                    .run(done);
            });
        });

        describe('Failed Create Custom Role too many Task Profile', function() {

            var _internalCode = "RIDM-7-5-33";
            var _internalCodeMessage = ServerResponseCodes.getErrorMessage(422, _internalCode);

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(UserRoleRest.Default);
                environment.setREST(UserRoleRest.PostRole.PostFailTooManyTaskProfiles);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should fail create Custom Role too many Task Profile', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        UserRoleSteps.setName("MockNameFailed"),
                        UserRoleSteps.setDescription("MockFailedDescription"),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("Custom Role"),
                        UserRoleSteps.waitForRoleTypeValue("Custom Role"),
                        UserRoleSteps.clickTab("Task Profile Roles"),
                        UserRoleSteps.verifyTaskProfilesAreVisible,
                        UserRoleSteps.verifyTitleTaskProfilesIsVisible,
                        UserRoleSteps.verifyCounterTaskProfilesIsVisible,
                        UserRoleSteps.selectTaskProfileRole,
                        UserRoleSteps.clickSaveButton,
                        GeneralSteps.sleep(100),
                        GeneralSteps.waitForNotification,
                        UserRoleSteps.verifyErrorNotificationText(_internalCodeMessage.internalErrorCodeMessage),
                        UserRoleSteps.clickErrorNotificationClose(),
                        GeneralSteps.verifyLocationHash("#rolemanagement/userrole/create")
                    ])
                    .run(done);
            });
        });


        describe('Create Role - verify Roles and Capabilities Table', function() {

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(UserRoleRest.Default);
                environment.setREST(UserRoleRest.PostRole.PostSuccess);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('For creation Custom Role, Roles Table should have 3 column with proper name', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("Custom Role"),
                        UserRoleSteps.waitForRoleTypeValue("Custom Role"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        UserRoleSteps.clickTab("COM Roles"),
                        UserRoleSteps.verifyTableColumnsName("Name"),
                        UserRoleSteps.verifyTableColumnsName("Role Type"),
                        UserRoleSteps.verifyTableColumnsName("Description")

                    ])
                    .run(done);
            });

            it('For creation Custom Role, Capabilities Table should have 4 column with proper name', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("Custom Role"),
                        UserRoleSteps.waitForRoleTypeValue("Custom Role"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
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

            it('For creation COM Role Alias, COM Roles Table should have 2 column with proper name', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("COM Role Alias"),
                        UserRoleSteps.waitForRoleTypeValue("COM Role Alias"),
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

        describe('Create Role - verify Roles and Capabilities content of Table', function() {

            beforeEach(function() {
                environment = new Environment();
                environment.setREST(UserRoleRest.Default);
                environment.setREST(UserRoleRest.PostRole.PostSuccess);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should verify for creation Custom Role, Roles Table content', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("Custom Role"),
                        UserRoleSteps.waitForRoleTypeValue("Custom Role"),
                        UserRoleSteps.clickTab("COM Roles"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        PaginatedTableSteps.verifyTableContents(ExpectedContentTables.customRoleRolesTable, 0, 7)
                    ])
                    .run(done);
            });

            it('Should verify for creation Custom Role, Capabilities Table content', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("Custom Role"),
                        UserRoleSteps.waitForRoleTypeValue("Custom Role"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        UserRoleSteps.clickTab("Capabilities"),
                        UserRoleSteps.waitForCapabilitiesValue("130"),
                        UserRoleSteps.verifyCapabilitiesAreVisible,
                        UserRoleSteps.verifyTitleCapabilitiesIsVisible,
                        UserRoleSteps.verifyCounterCapabilitiesIsVisible,
                        PaginatedTableSteps.verifyTableContents(ExpectedContentTables.capabilitiesTable, 0, 129)
                    ])
                    .run(done);
            });

            it('Should verify for creation COM Role Alias, Roles Table content', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.headers.create),
                        UserRoleSteps.verifyRoleTypeSelectionIsVisible,
                        UserRoleSteps.clickRoleTypeSelection,
                        UserRoleSteps.verifyRoleTypeSelectionOptionIsVisible,
                        UserRoleSteps.clickRoleTypeSelectionOption("COM Role Alias"),
                        UserRoleSteps.waitForRoleTypeValue("COM Role Alias"),
                        UserRoleSteps.waitForComRolesAreLoaded,
                        UserRoleSteps.verifyRolesAreVisible,
                        UserRoleSteps.verifyTitleRolesIsVisible,
                        UserRoleSteps.verifyCounterRolesIsVisible,
                        GeneralSteps.sleep(200),
                        PaginatedTableSteps.verifyTableContents(ExpectedContentTables.comRoleAliasComRolesTable, 0, 7)
                    ])
                    .run(done);
            });
        });
    });
});
