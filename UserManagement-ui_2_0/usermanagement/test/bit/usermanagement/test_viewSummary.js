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
    'src/usermanagement/Usermanagement',
    'test/bit/usermanagement/usermanagementEnvironment/Rest',
    'i18n!identitymgmtlib/error-codes.json',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/usermanagement/Steps',
    'test/bit/common/identitymgmtlib/General/Steps',
    'test/bit/common/identitymgmtlib/PaginatedTable/Steps',
    'test/bit/usermanagement/usermanagementEnvironment/data/ExpectedUsers',
    'test/bit/usermanagement/usermanagementEnvironment/data/ExpectedSortedUser',
    'test/bit/usermanagement/usermanagementEnvironment/data/ExpectedSortedUserByLastLogin',
    'src/usermanagement/Dictionary'
], function(UserManagement, UsermanagementRest, DictionaryErrors, Flow, Browser, Environment, UserManagementSteps, GeneralSteps, PaginatedTableSteps, ExpectedUsers, ExpectedSortedUser, ExpectedSortedUserByLastLogin, Dictionary) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 20000;

    describe('User Management View Summary', function() {

        var environment, app;
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher'
            },{
                name: 'User Management'
            }],
            namespace: 'usermanagement',
            properties: {
                title: 'User Management'
            }
        };

        beforeEach(function() {
        });

        afterEach(function() {
            Browser.gotoHash();
        });



        describe('UserManagement View Summary', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.ProfileSummary);
                environment.setREST(UsermanagementRest.Users.UserRolesAdminWithTG);
                environment.setREST(UsermanagementRest.Users.UserRolesOther);
                environment.setREST(UsermanagementRest.Users.Sessions);
                environment.setREST(UsermanagementRest.Users.UserAdmin);
                environment.setREST(UsermanagementRest.Users.UserSecurityuser);

                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should show profile summary with correct labels', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(1),
                        GeneralSteps.sleep(700),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForLoadRoles(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.waitForTerminateSessionsButton(),
                        UserManagementSteps.waitForEditProfileLink()
                    ])
                    .run(done);
            });

            it('should show profile summary panel with correct user roles', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(700),
                        PaginatedTableSteps.selectRow(1),
                        GeneralSteps.sleep(700),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.waitForLoadRoles(),
                        UserManagementSteps.checkUsernameInProfileSummary("administrator"),
                        UserManagementSteps.checkRoleInProfileSummary(),
                        UserManagementSteps.checkENMTargetGroupsInProfileSummary("ALL"),
                        UserManagementSteps.checkProfileAssignRole("Assigned roles (8)"),
                        UserManagementSteps.checkRoleNameInProfileSummary("ADMINISTRATOR"),
                        UserManagementSteps.checkRoleNameInProfileSummary("SECURITY_ADMIN"),
                        UserManagementSteps.checkRoleNameInProfileSummary("com_role_tg1"),
                        UserManagementSteps.checkRoleNameInProfileSummary("com_role_tg2"),
                        UserManagementSteps.checkRoleNameInProfileSummary("com_role_none"),
                        UserManagementSteps.checkRoleNameInProfileSummary("task_profile_none"),
                        UserManagementSteps.checkRoleNameInProfileSummary("task_profile_all"),
                        UserManagementSteps.checkRoleNameInProfileSummary("task_profile_tg1"),

                        // The table contains two rows for each role (one for the name of role, 
                        // one for expandble row)
                        UserManagementSteps.expandRow(1),
                        UserManagementSteps.checkRoleTypeAndTGNumber(1,"ENM System Role", undefined),

                        UserManagementSteps.expandRow(3),
                        UserManagementSteps.checkRoleTypeAndTGNumber(3, "ENM System Role", undefined),

                        UserManagementSteps.expandRow(5),
                        UserManagementSteps.checkRoleTypeAndTGNumber(5, "COM Role", "1"),

                        UserManagementSteps.expandRow(7),
                        UserManagementSteps.checkRoleTypeAndTGNumber(7, "COM Role", "2"),

                        UserManagementSteps.expandRow(9),
                        UserManagementSteps.checkRoleTypeAndTGNumber(9, "COM Role", "NONE"),

                        UserManagementSteps.expandRow(11),
                        UserManagementSteps.checkRoleTypeAndTGNumber(11, "Task Profile Role", "NONE"),

                        UserManagementSteps.expandRow(13),
                        UserManagementSteps.checkRoleTypeAndTGNumber(13, "Task Profile Role", "ALL"),

                        UserManagementSteps.expandRow(15),
                        UserManagementSteps.checkRoleTypeAndTGNumber(15, "Task Profile Role", "1"),
                    ])
                    .run(done);
            });

            it('should show profile summary panel with correct odp profiles', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(700),
                        PaginatedTableSteps.selectRow(1),
                        GeneralSteps.sleep(700),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.waitForLoadOdpProfiles(),
                        UserManagementSteps.checkUsernameInProfileSummary("administrator"),
                        UserManagementSteps.checkOdpProfilesInProfileSummary(),
                        UserManagementSteps.checkProfileAssignOdpProfiles("ODP Profiles"),
                        UserManagementSteps.checkApplicationNameAndProfileNameInProfileSummary("AMOS", "amosprofile1"),
                        UserManagementSteps.checkApplicationNameAndProfileNameInProfileSummary("EM", "emprofile2"),
                        UserManagementSteps.clickCloseProfileSummary(),
                        PaginatedTableSteps.unselectRow(1),
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.waitForLoadOdpProfiles(),
                        UserManagementSteps.checkUsernameInProfileSummary("operatornotsecurityadmin"),
                        UserManagementSteps.checkOdpProfilesInProfileSummary(),
                        UserManagementSteps.checkProfileAssignOdpProfiles("ODP Profiles"),
                        UserManagementSteps.checkApplicationNameAndProfileNameInProfileSummary("AMOS", Dictionary.odpDefaultProfile),
                        UserManagementSteps.checkApplicationNameAndProfileNameInProfileSummary("EM", Dictionary.odpDefaultProfile),
                        UserManagementSteps.clickCloseProfileSummary(),
                        PaginatedTableSteps.unselectRow(2),
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.waitForLoadOdpProfiles(),
                        UserManagementSteps.checkUsernameInProfileSummary("securityadminuser"),
                        UserManagementSteps.checkOdpProfilesInProfileSummary(),
                        UserManagementSteps.checkProfileAssignOdpProfiles("ODP Profiles"),
                        UserManagementSteps.checkApplicationNameAndProfileNameInProfileSummary("AMOS", Dictionary.odpDefaultProfile),
                        UserManagementSteps.checkApplicationNameAndProfileNameInProfileSummary("EM", 'emprofile1'),
                        UserManagementSteps.clickCloseProfileSummary(),
                        PaginatedTableSteps.unselectRow(3),
                        PaginatedTableSteps.selectRow(4),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.waitForLoadOdpProfiles(),
                        UserManagementSteps.checkUsernameInProfileSummary("securityuser"),
                        UserManagementSteps.checkOdpProfilesInProfileSummary(),
                        UserManagementSteps.checkProfileAssignOdpProfiles("ODP Profiles"),
                        UserManagementSteps.checkApplicationNameAndProfileNameInProfileSummary("AMOS", Dictionary.odpDefaultProfile),
                        UserManagementSteps.checkApplicationNameAndProfileNameInProfileSummary("EM", Dictionary.odpDefaultProfile),

                    ])
                    .run(done);
            });


        });
        describe('UserManagement View Summary Empty Odp', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.ProfileSummary);
                environment.setREST(UsermanagementRest.Users.UserRolesAdminWithTG);
                environment.setREST(UsermanagementRest.Users.UserRolesOther);
                environment.setREST(UsermanagementRest.Users.Sessions);
                environment.setREST(UsermanagementRest.Users.UserAdmin);
                environment.setREST(UsermanagementRest.Users.UserSecurityuser);
                environment.setREST(UsermanagementRest.OdpProfiles.Empty);

                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should show profile summary panel without odp profiles because of no odpProfile configured', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(700),
                        PaginatedTableSteps.selectRow(1),
                        GeneralSteps.sleep(700),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.checkUsernameInProfileSummary("administrator"),
                        GeneralSteps.sleep(700),
                        UserManagementSteps.checkNoOdpProfilesInProfileSummary(),
                        UserManagementSteps.clickCloseProfileSummary(),
                        PaginatedTableSteps.unselectRow(1),
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.checkUsernameInProfileSummary("operatornotsecurityadmin"),
                        GeneralSteps.sleep(700),
                        UserManagementSteps.checkNoOdpProfilesInProfileSummary(),
                        UserManagementSteps.clickCloseProfileSummary(),
                        PaginatedTableSteps.unselectRow(2),
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.checkUsernameInProfileSummary("securityadminuser"),
                        GeneralSteps.sleep(700),
                        UserManagementSteps.checkNoOdpProfilesInProfileSummary(),
                        UserManagementSteps.clickCloseProfileSummary(),
                        PaginatedTableSteps.unselectRow(3),
                        PaginatedTableSteps.selectRow(4),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.checkUsernameInProfileSummary("securityuser"),
                        GeneralSteps.sleep(700),
                        UserManagementSteps.checkNoOdpProfilesInProfileSummary(),

                    ])
                    .run(done);
            });
        });

        describe('UserManagement View Summary for federated', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.ProfileSummary);
                environment.setREST(UsermanagementRest.Users.UsersFederated);
                environment.setREST(UsermanagementRest.Users.CheckStatus);
                environment.setREST(UsermanagementRest.Users.Sessions);
                environment.setREST(UsermanagementRest.Privileges.Federated);

                environment.setREST(UsermanagementRest.ProfileSummary);

                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should not show profile edit profile button', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(700),
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.sleep(700),
                        GeneralSteps.clickButtonSummary(),
                        UserManagementSteps.waitForProfileSummary(),
                        UserManagementSteps.waitForLoadRoles(),
                        UserManagementSteps.waitForTerminateSessionsButton(),
                        UserManagementSteps.checkIfEditProfileLinkIsNotVisible()
                        ])
                    .run(done);
            });
        });
    });
});
