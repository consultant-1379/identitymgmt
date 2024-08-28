/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2017
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
    'test/bit/usermanagement/usermanagementEnvironment/data/ExpectedSortedUserByFailedLogins',
    'usermanagement/Dictionary'
], function(UserManagement, UsermanagementRest, DictionaryErrors, Flow, Browser, Environment, UserManagementSteps, GeneralSteps, PaginatedTableSteps, ExpectedUsers, ExpectedSortedUser, ExpectedSortedUserByLastLogin, ExpectedSortedUserByFailedLogins, Dictionary) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 20000;

    describe('User Management User List', function() {

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



        describe('UserManagement List', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.Users150);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should properly display users in table when 10 users per page are selected', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(10),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.verifyShowRowsValue(10),
                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(10),
                        PaginatedTableSteps.verifyHeader('1-10 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 0, 9),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('11-20 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 10, 19),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('21-30 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 20, 29),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('31-40 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 30, 39),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('41-50 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 40, 49),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('51-60 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 50, 59),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('61-70 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 60, 69),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('71-80 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 70, 79),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('81-90 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 80, 89),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('91-100 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 90, 99),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('101-110 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 100, 109),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('111-120 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 110, 119),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('121-130 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 120, 129),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('131-140 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 130, 139),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('141-150 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 140, 149)
                    ])
                    .run(done);
            });

            it('should properly display users in table when 20 users per page are selected', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.selectShowRows(20),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.verifyShowRowsValue(20),
                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(20),
                        PaginatedTableSteps.verifyHeader('1-20 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 0, 19),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('21-40 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 20, 39),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('41-60 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 40, 59),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('61-80 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 60, 79),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('81-100 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 80, 99),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('101-120 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 100, 119),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('121-140 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 120, 139),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('141-150 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 140, 149)
                    ])
                    .run(done);
            });

            it('should properly display users in table when 50 users per page are selected', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.goToHash,
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(50),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.verifyShowRowsValue(50),
                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(50),
                        PaginatedTableSteps.verifyHeader('1-50 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 0, 49),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('51-100 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 50, 99),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('101-150 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 100, 149)
                    ])
                    .run(done);
            });

            it('should properly display users in table when 100 users per page are selected', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.goToHash,
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(100),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.verifyShowRowsValue(100),
                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(100),
                        PaginatedTableSteps.verifyHeader('1-100 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 0, 99),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('101-150 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 100, 149)
                    ])
                    .run(done);
            });

            it('should properly display users in table when 500 users per page are selected', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.goToHash,
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(700),
                        PaginatedTableSteps.verifyShowRowsValue(500),
                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(500),
                        PaginatedTableSteps.verifyHeader('1-150 of 150'),
                        PaginatedTableSteps.verifyTableContents(ExpectedUsers, 0, 149)
                    ])
                    .run(done);
            });
        });

        describe('UserManagement TableSelectionInfo widget', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.Users150);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });
//
//            it('Should TableSelectionInfo correctly show info and action for 1 selected item', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectShowRows(10),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(10),
//
//                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
//                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
//                        GeneralSteps.sleep(500),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),
//
//                        PaginatedTableSteps.selectRow(1),
//                        GeneralSteps.sleep(1000),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Text('1 User selected.'),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Link_clearAll('Clear Selection.')
//                    ])
//                    .run(done);
//            });
//            it('Should TableSelectionInfo correctly show info and action for 2 selected items', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.goToHash,
//                        PaginatedTableSteps.setContextRegion('usermanagement'),
//                        GeneralSteps.verifyTopSectionTitle('User Management'),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.selectShowRows(10),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(10),
//
//                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
//                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
//                        GeneralSteps.sleep(500),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),
//
//                        PaginatedTableSteps.selectRow(1),
//                        PaginatedTableSteps.selectRow(2),
//                        GeneralSteps.sleep(500),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Text('2 Users are selected.'),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Link_clearAll('Clear Selection.')
//                    ])
//                    .run(done);
//            });

            it('Should TableSelectionInfo correctly deselect all items when few are selected', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.goToHash,
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(10),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(10),

                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),

                        PaginatedTableSteps.selectRow(1),
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.sleep(400),
                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
                        GeneralSteps.sleep(400),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false)
                    ])
                    .run(done);
            });

            it('Should TableSelectionInfo correctly select all items on page', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(10),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(10),

                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),

                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
                        GeneralSteps.sleep(400),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),
                        PaginatedTableSteps.verifyTableSelectionInfo_Text('10 Users are selected.'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_SelectAllOnAllPage('Select all 150 on all pages'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_clearAll('')
                ])
                .run(function(){ done(); });
            });

            it('Should TableSelectionInfo correctly select all items on all pages', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(10),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(10),

                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),

                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
                        GeneralSteps.sleep(400),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),

                        PaginatedTableSteps.clickTableSelectionInfo_Link_SelectAllOnAllPage(),
                        PaginatedTableSteps.verifyTableSelectionInfo_Text('All 150 Users are selected.'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_clearAll('Clear Selection.')
                ])
                .run(function(){ done(); });
            });

            it('Should TableSelectionInfo correctly deselect all items on all pages', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.goToHash,
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(10),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.waitForTableDataRefreshAfterPaginationChangeTo(10),

                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),

                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
                        GeneralSteps.sleep(400),
                        PaginatedTableSteps.clickTableSelectionInfo_Link_SelectAllOnAllPage(),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),

                        PaginatedTableSteps.clickTableSelectionInfo_Link_clearAll(),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false)
                ])
                .run(done);
            });

        });

        describe('UserManagement Sort User List - button update', function() {
            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.UserSort);

                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should sort asc/desc table by Username', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"username","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Username'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"username"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "desc",
                            column: "Username",
                            form: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Username'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"username"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "asc",
                            column: "Username",
                            form: 0,
                            to: 9
                        }),
                    ])
                    .run(done);
            });

            it('Should sort asc/desc table by Status', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"username","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Status'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"statusColumn"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "asc",
                            column: "Status",
                            form: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Status'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"statusColumn"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "desc",
                            column: "Status",
                            form: 0,
                            to: 9
                        })
                    ])
                    .run(done);
            });

            it('Should sort asc/desc table by Name', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"username","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Name'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"name"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "asc",
                            column: "Name",
                            form: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Name'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"name"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "desc",
                            column: "Name",
                            form: 0,
                            to: 9
                        })
                    ])
                    .run(done);
            });

            it('Should sort asc/desc table by Surname', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"username","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Surname'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"surname"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "asc",
                            column: "Surname",
                            form: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Surname'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"surname"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "desc",
                            column: "Surname",
                            form: 0,
                            to: 9
                        })
                    ])
                    .run(done);
            });

            it('Should sort asc table by Description', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"username","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Description'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"description"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "asc",
                            column: "Description",
                            form: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Description'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"description"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "desc",
                            column: "Description",
                            form: 0,
                            to: 9
                        })
                    ])
                .run(done);
            });

            it('Should sort asc/desc table by AuthMode', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"username","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Authentication Mode'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"authMode"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "asc",
                            column: "Authentication Mode",
                            form: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Authentication Mode'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"authMode"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "desc",
                            column: "Authentication Mode",
                            form: 0,
                            to: 9
                        })
                    ])
                    .run(done);
            });

            it('Should sort asc/desc table by Email', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"username","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Email'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"email"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "asc",
                            column: "Email",
                            form: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Email'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"email"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedSortedUser.users,
                            sortMode: "desc",
                            column: "Email",
                            form: 0,
                            to: 9
                        })
                    ])
                    .run(done);
            });

            it('Should sort asc table by Last Login', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"username","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Last Login'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"lastLogin"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user:ExpectedSortedUserByLastLogin.sortedAsc,
                            sortMode: "asc",
                            column: "Last Login",
                            form: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Last Login'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"lastLogin"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user:ExpectedSortedUserByLastLogin.sortedAsc,
                            sortMode: "desc",
                            column: "Last Login",
                            form: 0,
                            to: 9
                        })
                    ])
                    .run(done);
            });

            it('Should sort asc/desc table by Failed Logins', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"username","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Failed Logins'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"failedLogins"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user:ExpectedSortedUserByFailedLogins.sortedAsc,
                            sortMode: "asc",
                            column: "Failed Logins",
                            form: 0,
                            to: 9
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Failed Logins'),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"failedLogins"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user:ExpectedSortedUserByFailedLogins.sortedAsc,
                            sortMode: "desc",
                            column: "Failed Logins",
                            form: 0,
                            to: 9
                        })
                    ])
                    .run(done);
            });
        });

        describe('UserManagement Sort User List - manual link update', function() {

            describe('UserManagement Sort User List - manual link update - sort DESC by username', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"desc"%2C"attribute"%3A"username"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should sort desc table by Username', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(200),
                            PaginatedTableSteps.verifyTableContentsForSortedData({
                                user: ExpectedSortedUser.users,
                                sortMode: "desc",
                                column: "Username",
                                form: 0,
                                to: 9
                            })
                        ])
                        .run(done);
                });
            });

            describe('UserManagement Sort User List - manual link update - sort ASC by username', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"asc"%2C"attribute"%3A"username"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should sort asc table by Username', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(200),
                            PaginatedTableSteps.verifyTableContentsForSortedData({
                                user: ExpectedSortedUser.users,
                                sortMode: "asc",
                                column: "Username",
                                form: 0,
                                to: 9
                            })
                        ])
                        .run(done);
                });
            });
            describe('UserManagement Sort User List - manual link update - sort DESC by Status', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"desc"%2C"attribute"%3A"status"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should sort desc table by Status', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(200),
                            PaginatedTableSteps.verifyTableContentsForSortedData({
                                user: ExpectedSortedUser.users,
                                sortMode: "desc",
                                column: "Status",
                                form: 0,
                                to: 9
                            })
                        ])
                        .run(done);
                });
            });

            describe('UserManagement Sort User List - manual link update - sort ASC by status', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"asc"%2C"attribute"%3A"status"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should sort asc table by Status', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(200),
                            PaginatedTableSteps.verifyTableContentsForSortedData({
                                user: ExpectedSortedUser.users,
                                sortMode: "asc",
                                column: "Status",
                                form: 0,
                                to: 9
                            })
                        ])
                        .run(done);
                });
            });
            describe('UserManagement Sort User List - manual link update - sort DESC by Name', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"desc"%2C"attribute"%3A"name"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    GeneralSteps.sleep(200),
                        environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should desc sort table by Name', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(200),
                            PaginatedTableSteps.verifyTableContentsForSortedData({
                                user: ExpectedSortedUser.users,
                                sortMode: "desc",
                                column: "Name",
                                form: 0,
                                to: 9
                            })
                        ])
                        .run(done);
                });
            });

            describe('UserManagement Sort User List - manual link update - sort ASC by name', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"asc"%2C"attribute"%3A"name"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should asc sort table by Name', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(200),
                            PaginatedTableSteps.verifyTableContentsForSortedData({
                                user: ExpectedSortedUser.users,
                                sortMode: "asc",
                                column: "Name",
                                form: 0,
                                to: 9
                            })
                        ])
                        .run(done);
                });
            });
            describe('UserManagement Sort User List - manual link update - sort DESC by surname', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"desc"%2C"attribute"%3A"surname"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should desc sort table by Surname', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(200),
                            PaginatedTableSteps.verifyTableContentsForSortedData({
                                user: ExpectedSortedUser.users,
                                sortMode: "desc",
                                column: "Surname",
                                form: 0,
                                to: 9
                            })
                        ])
                        .run(done);
                });
            });

            describe('UserManagement Sort User List - manual link update - sort ASC by surname', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"asc"%2C"attribute"%3A"surname"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should asc sort table by Surname', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(200),
                            PaginatedTableSteps.verifyTableContentsForSortedData({
                                user: ExpectedSortedUser.users,
                                sortMode: "asc",
                                column: "Surname",
                                form: 0,
                                to: 9
                            })
                        ])
                        .run(done);
                });
            });
            describe('UserManagement Sort User List - manual link update - sort DESC by email', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"desc"%2C"attribute"%3A"email"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should desc sort table by Email', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(200),
                            PaginatedTableSteps.verifyTableContentsForSortedData({
                                user: ExpectedSortedUser.users,
                                sortMode: "desc",
                                column: "Email",
                                form: 0,
                                to: 9
                            })
                        ])
                        .run(done);
                });
            });

            describe('UserManagement Sort User List - manual link update - sort ASC by email', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"asc"%2C"attribute"%3A"email"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should asc sort table by Email', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(200),
                            PaginatedTableSteps.verifyTableContentsForSortedData({
                                user: ExpectedSortedUser.users,
                                sortMode: "asc",
                                column: "Email",
                                form: 0,
                                to: 9
                            })
                        ])
                        .run(done);
                });
            });
            describe('UserManagement Sort User List - manual link update - sort DESC by last login', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"desc"%2C"attribute"%3A"lastLogin"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should desc sort table by Last Login', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            PaginatedTableSteps.verifyTableContents(ExpectedSortedUserByLastLogin.sortedDesc, 0, 9)
                        ])
                        .run(done);
                });
            });

   /*         describe('UserManagement Sort User List - manual link update - sort ASC by last login', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"asc"%2C"attribute"%3A"lastLogin"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should asc sort table by Last Login', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.sleep(900),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            GeneralSteps.sleep(900),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            PaginatedTableSteps.verifyTableContents(ExpectedSortedUserByLastLogin.sortedAsc, 0, 9)
                        ])
                        .run(done);
                });
            });*/
            describe('UserManagement Sort User List - manual link update - sort DESC by failed logins', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"desc"%2C"attribute"%3A"failedLogins"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should desc sort table by Failed Logins', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            PaginatedTableSteps.verifyTableContents(ExpectedSortedUserByFailedLogins.sortedDesc, 0, 9)
                        ])
                        .run(done);
                });
            });
            /*describe('UserManagement Sort User List - manual link update - sort ASC by failed logins', function() {
                beforeEach(function() {
                    window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&sort={"order"%3A"asc"%2C"attribute"%3A"failedLogins"}';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.Default);
                    environment.setREST(UsermanagementRest.Users.UserSort);

                    environment.apply();

                    app.start(Browser.getElement('#bitContainer'));
                });

                afterEach(function() {
                    app.stop();
                    environment.restore();
                });

                it('Should asc sort table by Failed Logins', function(done) {
                    this.timeout(DEFAULT_TEST_TIMEOUT);
                    new Flow()
                        .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            PaginatedTableSteps.verifyTableContents(ExpectedSortedUserByFailedLogins.sortedAsc, 0, 9)
                        ])
                        .run(done);
                });
            });*/
            describe('UserManagement Access Denied', function() {

                beforeEach(function() {
                    window.location.hash = 'usermanagement';
                    app = new UserManagement(options);
                    environment = new Environment();
                    environment.setREST(UsermanagementRest.NotAuthorize);
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
                        .run(done);

                });
            });
        });

        describe('UserManagement TableSelection after create user', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.Users150);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Should TableSelectionInfo correctly select user_007', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                            PaginatedTableSteps.setContextRegion('usermanagement'),
                            GeneralSteps.verifyTopSectionTitle('User Management'),
                            PaginatedTableSteps.waitForTableDataIsLoaded(),
                            GeneralSteps.sleep(5000),
                            UserManagementSteps.getSavedUserHash('user_007'),
                            GeneralSteps.sleep(5000)
                ])
                .run(function(){ done(); });
            });
        });
    });

});
