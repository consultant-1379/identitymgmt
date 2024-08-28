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
    'test/bit/usermanagement/usermanagementEnvironment/data/ExpectedSortedUserByLastLogin'
], function(UserManagement, UsermanagementRest, DictionaryErrors, Flow, Browser, Environment, UserManagementSteps, GeneralSteps, PaginatedTableSteps, ExpectedUsers, ExpectedSortedUser, ExpectedSortedUserByLastLogin) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 20000;

    describe('User Management Action Bar', function() {

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

        describe('UserManagement Force Change Password', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.ForceChangePassword);
                environment.setREST(UsermanagementRest.Users.ForceChangePasswordAdmin);
                environment.setREST(UsermanagementRest.Users.CheckStatus);

                environment.apply();

                app.start(Browser.getElement('#bitContainer'));

            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

//            it('should show success message after click "Force Change Password" button for single user', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectRow(2),
//                        //GeneralSteps.sleep(700),
//                        PaginatedTableSteps.waitForTopSectionButtons(),
//                        GeneralSteps.clickTopSectionButton('Force Password Change'),
//                        UserManagementSteps.verifySuccessNotification('The password for the selected user(s) must be changed on the next login')
//                    ])
//                    .run(done);
//            });

//            it('should show success message after click "Force Change Password" button for multiple users', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectRow(2),
//                        PaginatedTableSteps.selectRow(3),
//                        PaginatedTableSteps.waitForTopSectionButtons(),
////                        GeneralSteps.sleep(700),
//                        GeneralSteps.clickTopSectionButton('Force Password Change'),
//                        UserManagementSteps.verifySuccessNotification('The password for the selected user(s) must be changed on the next login'),
//                    ])
//                    .run(done);
//            });

//            it('should show success message after click "Revoke Force Change Password" button for single user', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectRow(4),
//                        GeneralSteps.sleep(700),
//                        GeneralSteps.clickTopSectionButton('Revoke Force Password Change'),
//                        UserManagementSteps.verifySuccessNotification('Force password change operation has been revoked'),
//                    ])
//                    .run(done);
//            });

            it('should show success message after click "Revoke Force Change Password" button for multiple users', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(3),
                        PaginatedTableSteps.selectRow(4),
                        GeneralSteps.sleep(700),
                        GeneralSteps.clickTopSectionButton('Revoke Force Password Change'),
                        UserManagementSteps.verifySuccessNotification('Force password change operation has been revoked'),
                        GeneralSteps.clickTopSectionButton('Force Password Change'),
                        UserManagementSteps.verifySuccessNotification('The password for the selected user(s) must be changed on the next login'),
                    ])
                    .run(function(){ done(); });
            });

            it('should show error message after click "Force Change Password" button for security admin', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(1),
                        GeneralSteps.sleep(700),
                        GeneralSteps.clickTopSectionButton('Force Password Change'),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(DictionaryErrors.responseDialog.full['forcePasswordChange']),
                        GeneralSteps.verifyDialogSecondaryText(DictionaryErrors.internalErrorCodes['UIDM-11-4']),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear()
                    ])
                    .run(function(){ done(); });
            });

            it('should show error message after click "Force Change Password" button for security admin and normal user', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(1),
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.sleep(700),
                        GeneralSteps.clickTopSectionButton('Force Password Change'),
//                        UserManagementSteps.verifySuccessNotification('The password for the selected user(s) must be changed on the next login'),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText(DictionaryErrors.responseDialog.full['forcePasswordChange']),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear()
                    ])
                    .run(function(){ done(); });
            });
        });

        describe('UserManagement EUH Enbaled Revoke Change Password ', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.EnforcedUserHardening.Enabled);
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.ForceChangePassword);
                environment.setREST(UsermanagementRest.Users.ForceChangePasswordAdmin);
                environment.setREST(UsermanagementRest.Users.CheckStatus);

                environment.apply();

                app.start(Browser.getElement('#bitContainer'));

            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });


            it('should  not show "Revoke Force Change Password" button for multiple users', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(3),
                        PaginatedTableSteps.selectRow(4),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButtonNotVisible('Revoke Force Password Change'),

                    ])
                    .run(function(){ done(); });
            });

            it('should  not show "Revoke Force Change Password" button for single users', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(4),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButtonNotVisible('Revoke Force Password Change'),

                    ])
                    .run(function(){ done(); });
            });
            
        });

        describe('UserManagement Terminate Sessions', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.TerminateSessions);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should show success message after click "Terminate Sessions" button for single user', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(1),
                        GeneralSteps.sleep(700),
                        GeneralSteps.clickTopSectionButton('Terminate Sessions'),
                        UserManagementSteps.verifySuccessNotification('User session terminated'),
                    ])
                    .run(function(){ done(); });
            });

            it('should show success message after click "Terminate Sessions" button for multiple users', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(1),
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.sleep(700),
                        GeneralSteps.clickTopSectionButton('Terminate Sessions'),
                        UserManagementSteps.verifySuccessNotification('User session terminated'),
                    ])
                    .run(function(){ done(); });
            });
        });

        describe('UserManagement View Summary', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.UserRolesAdmin);
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

//            it('should show profile summary panel with correct user roles', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectRow(1),
//                        GeneralSteps.sleep(700),
//                        GeneralSteps.clickTopSectionButton('View Summary'),
//                        UserManagementSteps.waitForProfileSummary(),
//                        UserManagementSteps.waitForLoadRoles(),
//                        UserManagementSteps.checkUsernameInProfileSummary("administrator"),
//                        UserManagementSteps.checkRoleInProfileSummary("SECURITY_ADMIN"),
//                        UserManagementSteps.checkRoleInProfileSummary("ADMINISTRATOR"),
//                        PaginatedTableSteps.unselectRow(1),
//                        PaginatedTableSteps.selectRow(4),
//                        GeneralSteps.sleep(700),
//                        UserManagementSteps.checkUsernameInProfileSummary("securityuser"),
//                        UserManagementSteps.checkRoleInProfileSummary("SECURITY_ADMIN")
//                    ])
//                    .run(done);
//            });
        });

        describe('UserManagement Duplicate User', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.TerminateSessions);
                environment.setREST(UsermanagementRest.Users.CheckStatus);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should show Duplicate button after selecting 1 user', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.selectRow(1),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Duplicate'),
                    ])
                    .run(done);
            });
        });

        describe('UserManagement Revoke Certificate', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.CheckStatus);

                environment.apply();
                app.start(Browser.getElement('#bitContainer'));

            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should button be disabled for selected inactive or default user', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(4),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Revoke Certificate'),
                        GeneralSteps.verifyTopSectionButtonDisabled('Revoke Certificate'),
                        PaginatedTableSteps.unselectRow(4),
                        PaginatedTableSteps.selectRow(1),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Revoke Certificate'),
                        GeneralSteps.verifyTopSectionButtonDisabled('Revoke Certificate'),
                        PaginatedTableSteps.unselectRow(1),
                    ])
                    .run(done);
            });

            it('Should button be enabled for active user', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Revoke Certificate'),
                        GeneralSteps.verifyTopSectionButtonEnabled('Revoke Certificate'),

                    ])
                    .run(done);
            });

            it('Should show success message after click "Revoke Certificate" button for single user ', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.sleep(700),
                        GeneralSteps.verifyTopSectionButton('Revoke Certificate'),
                        GeneralSteps.verifyTopSectionButtonEnabled('Revoke Certificate'),
                        GeneralSteps.clickTopSectionButton('Revoke Certificate'),
                        GeneralSteps.waitForNotification(),
                        GeneralSteps.verifyNotificationText('Certificate has been revoked'),
                        GeneralSteps.clickNotificationClose(),
                    ])
                    .run(function(){ done(); });
            });


        });

        describe('UserManagement Access Denied', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.NotAuthorize);
                environment.setREST(UsermanagementRest.Users.CheckStatus);

                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should show Access Denied Dialog when user has not right access', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.waitForDialog(),
                        GeneralSteps.verifyDialogPrimaryText("Access Denied"),
                        GeneralSteps.verifyDialogSecondaryText("Your Role does not allow you access to this application. Contact your System Administrator to change your access rights or return to the Application Launcher."),
                        GeneralSteps.clickDialogButton('Ok'),
                        GeneralSteps.waitForDialogDisappear()
                    ])
                    .run(function(){ done(); });

            });
        });

//        describe('UserManagement Federated user', function() {
//
//            beforeEach(function() {
//                window.location.hash = 'usermanagement';
//                app = new UserManagement(options);
//                environment = new Environment();
//                environment.setREST(UsermanagementRest.ProfileSummary);
//                environment.setREST(UsermanagementRest.Default);
//                environment.setREST(UsermanagementRest.Users.UsersFederated);
//
//                environment.apply();
//                app.start(Browser.getElement('#bitContainer'));
//            });
//
//            afterEach(function() {
//                app.stop();
//                environment.restore();
//            });
//
//            it('Should selecting federated user show right button on action bar', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectRow(3),
//                        GeneralSteps.sleep(700),
//                        GeneralSteps.verifyTopSectionButton('Import'),
//                        GeneralSteps.verifyTopSectionButton('Create User Profile'),
//                        GeneralSteps.verifyTopSectionButton('Change Password'),
//                        GeneralSteps.verifyTopSectionButton('Terminate Sessions'),
//                        GeneralSteps.verifyTopSectionButton('Revoke Certificate'),
//                        GeneralSteps.verifyTopSectionButtonNotVisible('Edit Profile'),
//                        GeneralSteps.verifyTopSectionButtonNotVisible('Duplicate'),
//                        GeneralSteps.verifyTopSectionButtonNotVisible('Delete'),
//                        GeneralSteps.verifyTopSectionButtonNotVisible('Force Password Change'),
//                        GeneralSteps.verifyTopSectionButtonNotVisible('Export')
//                    ])
//                    .run(done);
//            });
//        });
//
//        describe('UserManagement Federated user', function() {
//
//            beforeEach(function() {
//                window.location.hash = 'usermanagement';
//                app = new UserManagement(options);
//                environment = new Environment();
//                environment.setREST(UsermanagementRest.Default);
//                environment.setREST(UsermanagementRest.Users.UsersAuthModeMixed);
//
//                environment.apply();
//                app.start(Browser.getElement('#bitContainer'));
//            });
//
//            afterEach(function() {
//                app.stop();
//                environment.restore();
//            });
//
//            it('Should selecting all users show right button on action bar', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
//                        GeneralSteps.sleep(700),
//                        GeneralSteps.verifyTopSectionButton('Terminate Sessions'),
//                        GeneralSteps.verifyTopSectionButtonNotVisible('Edit Profile'),
//                        GeneralSteps.verifyTopSectionButtonNotVisible('Delete'),
//                        GeneralSteps.verifyTopSectionButtonNotVisible('Force Password Change'),
//                        GeneralSteps.verifyTopSectionButtonNotVisible('Export')
//                    ])
//                    .run(done);
//
//            });
//        });
    });
});
