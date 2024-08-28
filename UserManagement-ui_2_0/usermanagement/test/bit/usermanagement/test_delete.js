/*global define, describe, it, expect */
define([
    'src/usermanagement/Usermanagement',
    'test/bit/usermanagement/usermanagementEnvironment/Rest',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/usermanagement/Steps',
    'test/bit/common/identitymgmtlib/General/Steps',
    'test/bit/common/identitymgmtlib/PaginatedTable/Steps',
    'test/bit/usermanagement/usermanagementEnvironment/data/ExpectedDeleteUsers',
    'i18n!usermgmtlib/app.json'
], function(UserManagement, UsermanagementRest, Flow, Browser, Environment, UserManagementSteps, GeneralSteps, PaginatedTableSteps, ExpectedDeleteUsers, Dictionary) {
    'use strict';
    var DEFAULT_TEST_TIMEOUT = 15000;
    describe('UserManagement - DELETE USER', function() {

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


        describe('UserManagement ConfirmationDeleteUsersDialog Widget', function(){

            beforeEach(function(){
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();

                environment.setREST(UsermanagementRest.Default);
                // user: "operatornotsecurityadmin" has active sessions -> second user in list
                environment.setREST(UsermanagementRest.DeleteUsers);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function(){
                app.stop();
                environment.restore();
            });
//            it('Should verify static content of ConfirmationDeleteUsersDialog', function(done){
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectShowRows(10),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//
//                        PaginatedTableSteps.selectRow(3),
//
//                        PaginatedTableSteps.waitForTopSectionButtons(),
//                        GeneralSteps.clickTopSectionButton('Delete'),
//                        GeneralSteps.waitForDialog(),
//
//                        GeneralSteps.waitForDialogPrimaryText(),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogPresent(),
//
//                        GeneralSteps.verifyDialogPrimaryText(Dictionary.deleteUser.deleteUsersConfirmationHeader),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogInfo(Dictionary.confirmationDeleteSummaryList.info),
//                        UserManagementSteps.clickConfirmationDeleteUsersDialogButton(Dictionary.confirmationDeleteSummaryList.deleteCancelCaption),
//                        GeneralSteps.waitForDialogDisappear()
//
//                    ])
//                    .run(done);
//            });

//            it('Should show ConfirmationDeleteUsersDialog when one inactive user is selected to delete', function(done){
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectShowRows(10),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//
//                        PaginatedTableSteps.selectRow(3),
//
//                        PaginatedTableSteps.waitForTopSectionButtons(),
//                        GeneralSteps.clickTopSectionButton('Delete'),
//                        GeneralSteps.waitForDialog(),
//
//
//                        //wait for status
//                        UserManagementSteps.waitForConfirmationDeleteUsersDialogStatusTotal(),
//                        UserManagementSteps.waitForConfirmationDeleteUsersDialogStatusActive(),
//                        UserManagementSteps.waitForConfirmationDeleteUsersDialogStatusInactive(),
//
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogStatusTotal('1'),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogStatusInactive('Inactive (1)'),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogStatusActive('Active (0)'),
//
//                         //verify result table
//
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogTableHeader('Delete User','Result'),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogTableContents(ExpectedDeleteUsers.oneinactiveuser),
//
//                        //close dialog
//
//                        UserManagementSteps.clickConfirmationDeleteUsersDialogButton(Dictionary.confirmationDeleteSummaryList.deleteCancelCaption),
//                    ])
//                    .run(done);
//            });

//            it('Should show ConfirmationDeleteUsersDialog when one active user is selected to delete', function(done){
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectShowRows(10),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//
//                        PaginatedTableSteps.selectRow(2),
//
//                        PaginatedTableSteps.waitForTopSectionButtons(),
//                        GeneralSteps.clickTopSectionButton('Delete'),
//                        GeneralSteps.waitForDialog(),
//
//                        //depends on selected users to delete
//                        UserManagementSteps.waitForConfirmationDeleteUsersDialogStatusTotal(),
//                        UserManagementSteps.waitForConfirmationDeleteUsersDialogStatusActive(),
//                        UserManagementSteps.waitForConfirmationDeleteUsersDialogStatusInactive(),
//
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogStatusTotal('1'),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogStatusInactive('Inactive (0)'),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogStatusActive('Active (1)'),
//
//                         //verify result table
//
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogTableHeader('Delete User','Result'),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogTableContents(ExpectedDeleteUsers.oneactiveuser),
//
//                        //close dialog
//
//                        UserManagementSteps.clickConfirmationDeleteUsersDialogButton(Dictionary.confirmationDeleteSummaryList.deleteCancelCaption),
//                    ])
//                    .run(done);
//            });

//            it('Should show ConfirmationDeleteUsersDialog when two, active and inactive users are selected to delete', function(done){
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectShowRows(10),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//
//                        PaginatedTableSteps.selectRow(2),
//                        PaginatedTableSteps.selectRow(3),
//
//                        PaginatedTableSteps.waitForTopSectionButtons(),
//                        GeneralSteps.clickTopSectionButton('Delete'),
//                        GeneralSteps.waitForDialog(),
//
//
//                        //depends on selected users to delete
//                        UserManagementSteps.waitForConfirmationDeleteUsersDialogStatusTotal(),
//                        UserManagementSteps.waitForConfirmationDeleteUsersDialogStatusActive(),
//                        UserManagementSteps.waitForConfirmationDeleteUsersDialogStatusInactive(),
//
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogStatusTotal('2'),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogStatusInactive('Inactive (1)'),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogStatusActive('Active (1)'),
//
//                         //verify result table
//
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogTableHeader('Delete User','Result'),
//                        UserManagementSteps.verifyConfirmationDeleteUsersDialogTableContents(ExpectedDeleteUsers.deleteusers),
//
//                        //close dialog
//
//                        UserManagementSteps.clickConfirmationDeleteUsersDialogButton(Dictionary.confirmationDeleteSummaryList.deleteCancelCaption)
//
//                    ])
//                    .run(done);
//            });
        });

        describe('UserManagement Test Delete Active/Inactive users', function(){

            beforeEach(function(){
                environment = new Environment();

                environment.setREST(UsermanagementRest.Default);
                // user: "operatornotsecurityadmin" has active sessions -> second user in list
                environment.setREST(UsermanagementRest.DeleteUsers);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function(){
                app.stop();
                environment.restore();
            });

//            it('Should delete all selected users when two, active and inactive users are selected to delete', function(done){
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded,
//
//                        PaginatedTableSteps.selectRow(2),
//                        PaginatedTableSteps.selectRow(3),
//
//                        GeneralSteps.clickTopSectionButton('Delete'),
//
//                        GeneralSteps.waitForDialog(),
//
//                        //click delete all users button
//
//                        UserManagementSteps.clickConfirmationDeleteUsersDialogButton(Dictionary.confirmationDeleteSummaryList.deleteAllUserCaption),
//                       // GeneralSteps.verifyLocationHash('#usermanagement/?pagenumber=1&pagesize=10'),
//
//                    ])
//                    .run(done);
//            });

//            it.skip('Should delete all inactive users when two, active and inactive users are selected to delete', function(done){
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        GeneralSteps.verifyTopSectionTitle('User Management'),

//
//                        PaginatedTableSteps.selectRow(2),
//                        PaginatedTableSteps.selectRow(3),
//
//                        GeneralSteps.clickTopSectionButton('Delete'),
//                        GeneralSteps.sleep(5000),
//                        GeneralSteps.waitForDialog(),
//
//                        //click delete all users button
//
//                        UserManagementSteps.clickConfirmationDeleteUsersDialogButton(Dictionary.confirmationDeleteSummaryList.deleteInactiveUserCaption),
//
//            ])
//            .run(done);
//            });
        });
    });

});
