/*******************************************************************************
  * COPYRIGHT Ericsson 2016
  *
  * The copyright to the computer program(s) herein is the property of
  * Ericsson Inc. The programs may be used and/or copied only with written
  * permission from Ericsson Inc. or in accordance with the terms and
  * conditions stipulated in the agreement/contract under which the
  * program(s) have been supplied.
*******************************************************************************/

define([
    'jscore/core',
    'container/api',
    'src/rolemanagement/Rolemanagement',
    'i18n!rolemanagement/app.json',
    'test/bit/rolemanagementEnvironment/Rest',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/common/rolemgmtlib/Rolemanagement/Steps',
    'test/bit/common/identitymgmtlib/General/Steps',
    'test/bit/common/identitymgmtlib/PaginatedTable/Steps',
    'i18n!identitymgmtlib/error-codes.json',
    'identitymgmtlib/Utils'
], function(core, ContainerApi, Rolemanagement, Dictionary, REST, Flow, Browser, Environment, RolemanagementSteps, GeneralSteps, PaginatedTableSteps, ErrorCodes, Utils) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 30000;

    describe('Delete Role Integration Test', function() {

        var environment, app;
        var options = {
            breadcrumb: [{
                name: 'Ericsson Network Manager',
                url: '#launcher'
            }, {
                name: 'Role management'
            }],
            namespace: 'rolemanagement',
            properties: {
                title: 'Role Management'
            }
        };

        var flyoutMock, flyoutId;
        //var setFlyoutMock = function(document) {
            ContainerApi.loadAppModule('flyout/Flyout', function(flyout) {
                flyoutMock = new flyout();
                //flyoutMock.start(document);
                flyoutMock.start(core.Element.wrap(document.getElementById('bitContainer')));
                flyoutId = ContainerApi.getEventBus().subscribe('flyout:show', function(options) {
                   options.content !== flyoutMock._uiElement && (flyoutMock.contentOnHide(),
                    flyoutMock.setHeader(options.header || ''),
                    flyoutMock.width = options.width || '400px',
                    flyoutMock.show(options));
                }.bind(this));
            }, function(error) { console.log("errore"); console.log(error); });
        //};

        var stopFlyoutMock = function() {
            ContainerApi.getEventBus().unsubscribe('flyout:show', flyoutId);
            flyoutMock.stop();
            flyoutMock = undefined;
        };

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Rolemanagement Delete Role - Success', function() {
            // solution for "global leaks detected: index, notification
            // found here: https://confluence-nam.lmera.ericsson.se/display/JCF/Stub+window+confirm+-+unit+test?focusedCommentId=74946779#comment-74946779
            mocha.setup({globals: ['index','notification']});

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.Default);
                environment.setREST(REST.DeleteRole.DeleteRoleSuccess);
                environment.apply();

                //app.start(Browser.getElement('#bitContainer'));
                app.start(core.Element.wrap(document.getElementById('bitContainer')));

            });

            afterEach(function() {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();

            });

            it('should successfully delete role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCom,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.DeleteUserRole),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.dialogues.deleteRolesHeader),
                        GeneralSteps.verifyDialogSecondaryText(Dictionary.dialogues.deleteRolesContent),
                        GeneralSteps.clickDialogButton('Delete'),
                        GeneralSteps.waitForDialogDisappear(),
                        GeneralSteps.waitForNotification(),
                        GeneralSteps.verifyNotificationText(Dictionary.actionsResponses.RoleDeleted),
                        GeneralSteps.clickNotificationClose()
                    ])
                    .run(done);
            });

        });
            describe('Rolemanagement Delete Role - Failed Internal Code RIDM-14-5-7', function() {

                beforeEach(function() {
                    window.location.hash = 'rolemanagement';
                    app = new Rolemanagement(options);
                    environment = new Environment();
                    environment.setREST(REST.Default);
                    environment.setREST(REST.GetRoles.Default);
                    environment.setREST(REST.DeleteRole.DeleteRoleFailed_RIDM_14_5_7);
                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                    GeneralSteps.restoreBrowser();

                });

                it('should fail delete role', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('rolemanagement'),
                            GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.clickButtonFilters(),
                            GeneralSteps.verifyFilterPanelPresent(),
                            GeneralSteps.sleep(300),
                            RolemanagementSteps.clickFilterCheckboxRoleTypeCom,
                            RolemanagementSteps.clickFilterButtonApply,
                            GeneralSteps.clickFilterButtonClose(),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            PaginatedTableSteps.selectRow(4),
                            GeneralSteps.clickTopSectionButton(Dictionary.actions.DeleteUserRole),
                            GeneralSteps.waitForDialog(),
                            GeneralSteps.verifyDialogPrimaryText(Dictionary.dialogues.deleteRolesHeader),
                            GeneralSteps.verifyDialogSecondaryText(Dictionary.dialogues.deleteRolesContent),
                            GeneralSteps.clickDialogButton('Delete'),
                            GeneralSteps.waitForDialog(),
                            GeneralSteps.verifyDialogPrimaryText(Dictionary.actionsResponses.CannotDeletedRoles),
                            GeneralSteps.verifyDialogSecondaryText(Utils.printf(ErrorCodes.internalErrorCodes["RIDM-14-5-7"],"[]","[testRole]")),
                            GeneralSteps.clickDialogButton('Ok'),
                            GeneralSteps.waitForDialogDisappear()
                        ])
                        .run(done);
                });
            });
        describe('Rolemanagement Delete Role - Failed Internal Code RIDM-14-5-9', function() {

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.Default);
                environment.setREST(REST.DeleteRole.DeleteRoleFailed_RIDM_14_5_9);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();

            });

            it('should fail delete role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCom,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(5),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.DeleteUserRole),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.dialogues.deleteRolesHeader),
                        GeneralSteps.verifyDialogSecondaryText(Dictionary.dialogues.deleteRolesContent),
                        GeneralSteps.clickDialogButton('Delete'),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.actionsResponses.CannotDeletedRoles),
                        GeneralSteps.verifyDialogSecondaryText(Utils.printf(ErrorCodes.internalErrorCodes["RIDM-14-5-9"],"[]","[testUser]")),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear()
                    ])
                    .run(done);
            });
        });

        describe('Rolemanagement Delete Role - delete multiple roles', function() {

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.Default);
                environment.setREST(REST.DeleteRole.DeleteRoleFailed_RIDM_14_5_7);
                environment.setREST(REST.DeleteRole.DeleteRoleFailed_RIDM_14_5_9);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();

            });

            it('should fail delete role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCom,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(4),
                        PaginatedTableSteps.selectRow(5),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.DeleteUserRole),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.dialogues.deleteRolesHeader),
                        GeneralSteps.clickDialogButton('Delete'),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(Dictionary.actionsResponses.CannotDeletedRoles),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear()
                    ])
                    .run(done);
            });
        });
    });
});
