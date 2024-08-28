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
    'test/bit/rolemanagementEnvironment/data/Expected150Roles',
    'test/bit/rolemanagementEnvironment/data/ExpectedData',
    'test/bit/rolemanagementEnvironment/data/ExpectedDataForStatus',
    'i18n!identitymgmtlib/common.json'
], function(core, ContainerApi, Rolemanagement, Dictionary, REST, Flow, Browser, Environment, RolemanagementSteps, GeneralSteps, PaginatedTableSteps, Expected150Roles, ExpectedData, ExpectedDataForStatus, DictionaryCommon) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 20000;

    describe('Role management Integration Tests', function() {

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

        describe('Rolemanagement List', function() {

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.Roles150);
                environment.apply();

                //app.start(Browser.getElement('#bitContainer'));
                app.start(core.Element.wrap(document.getElementById('bitContainer')));

            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('Table should have 4 column with proper name', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.verifyTableColumnsName(Dictionary.roleMgmt.RoleNameHeader),
                        PaginatedTableSteps.verifyTableColumnsName(Dictionary.roleMgmt.RoleTypeHeader),
                        PaginatedTableSteps.verifyTableColumnsName(Dictionary.roleMgmt.RoleDescriptionHeader),
                        PaginatedTableSteps.verifyTableColumnsName(Dictionary.roleMgmt.RoleStatusHeader)

                    ])
                    .run(done);
            });
            it('Should properly display roles in table when 10 roles per page are selected', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(10),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
                        PaginatedTableSteps.verifyShowRowsValue(10),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyHeader('(1-10 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 0, 9),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(11-20 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 10, 19),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(21-30 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 20, 29),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(31-40 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 30, 39),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(41-50 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 40, 49),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(51-60 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 50, 59),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(61-70 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 60, 69),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(71-80 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 70, 79),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(81-90 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 80, 89),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(91-100 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 90, 99),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(101-110 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 100, 109),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(111-120 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 110, 119),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(121-130 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 120, 129),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(131-140 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 130, 139),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(141-150 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 140, 149)
                    ])
                    .run(done);
            });

            it('Should properly display roles in table when 20 roles per page are selected', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(20),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '20'),
                        PaginatedTableSteps.verifyShowRowsValue(20),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyHeader('(1-20 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 0, 19),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(21-40 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 20, 29),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(41-60 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 40, 59),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(61-80 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 60, 79),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(81-100 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 80, 99),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(101-120 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 100, 119),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(121-140 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 120, 139),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(141-150 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 140, 149)
                    ])
                    .run(done);
            });
            it('Should properly display roles in table when 50 roles per page are selected', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(50),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '50'),
                        PaginatedTableSteps.verifyShowRowsValue(50),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyHeader('(1-50 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 0, 49),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(51-100 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 50, 99),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(101-150 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 100, 149)
                    ])
                    .run(done);
            });

            it('Should properly display roles in table when 100 roles per page are selected', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectShowRows(100),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '100'),
                        PaginatedTableSteps.verifyShowRowsValue(100),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyHeader('(1-100 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 0, 99),
                        PaginatedTableSteps.gotoNextPage(),
                        PaginatedTableSteps.verifyHeader('(101-150 of 150)'),
                        PaginatedTableSteps.verifyTableContents(Expected150Roles, 100, 149)
                    ])
                    .run(done);
            });


        });

        describe('Rolemanagement select all by checkbox', function() {

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.Default);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should correctly select all items on one page', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),
                        PaginatedTableSteps.verifyTableSelectionInfo_Text('10 Roles are selected.'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_selectAllOnCurrentPageLink(''),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_SelectAllOnAllPage('Select all 70 on all pages'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_clearAll(''),
                        PaginatedTableSteps.verifyRowSelectedForItem('ADMINISTRATOR'),
                        PaginatedTableSteps.verifyRowSelectedForItem('CM_Advanced'),
                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),
                        PaginatedTableSteps.verifyRowNotSelectedForItem('ADMINISTRATOR'),
                        PaginatedTableSteps.verifyRowNotSelectedForItem('CM_Advanced'),

                    ])
                    .run(done);
            });

        });

        describe('Rolemanagement TableSelectionInfo Widget', function() {

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.Default);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

//            it('should TableSelectionInfo correctly show info and action for 1 selected item', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('rolemanagement'),
//                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//
//                        //INFO: Full check, just once
//                        GeneralSteps.verifyLocationHashParameterAbsent('filter'),
//                        GeneralSteps.verifyLocationHashParameterPresent('pagenumber'),
//                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
//                        GeneralSteps.verifyLocationHashParameterPresent('pagesize'),
//                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
//                        GeneralSteps.verifyLocationHashParameterPresent('sort'),
//                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"name","order":"asc"}'),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),
//
//                        PaginatedTableSteps.selectRow(1),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Text('1 Role selected.'),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Link_selectAllOnCurrentPageLink(''),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Link_SelectAllOnAllPage(''),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Link_clearAll('Clear Selection.'),
//                    ])
//                    .run(done);
//            });
//
//            it('should TableSelectionInfo correctly show info and action for 2 selected items', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('rolemanagement'),
//                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),
//
//                        PaginatedTableSteps.selectRow(1),
//                        PaginatedTableSteps.selectRow(2),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Text('2 Roles are selected.'),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Link_selectAllOnCurrentPageLink(''),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Link_SelectAllOnAllPage(''),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Link_clearAll('Clear Selection.'),
//                    ])
//                    .run(done);
//            });

//            it('should TableSelectionInfo correctly deselect all items when few are selected', function(done) {
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        PaginatedTableSteps.setContextRegion('rolemanagement'),
//                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
//                        PaginatedTableSteps.waitForTableDataIsLoaded(),
//                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),
//
//                        PaginatedTableSteps.selectRow(1),
//                        PaginatedTableSteps.selectRow(2),
//                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
//                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),
//                    ])
//                    .run(done);
//            });

            it('should TableSelectionInfo correctly select all items on page', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),

                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),
                        PaginatedTableSteps.verifyTableSelectionInfo_Text('10 Roles are selected.'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_selectAllOnCurrentPageLink(''),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_SelectAllOnAllPage('Select all 70 on all pages'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_clearAll(''),
                    ])
                    .run(done);
            });

            it('should TableSelectionInfo correctly select all items on all pages', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),

                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),

                        PaginatedTableSteps.clickTableSelectionInfo_Link_SelectAllOnAllPage(),
                        PaginatedTableSteps.verifyTableSelectionInfo_Text('All 70 Roles are selected.'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_selectAllOnCurrentPageLink(''),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_SelectAllOnAllPage(''),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_clearAll('Clear Selection.')
                    ])
                    .run(done);
            });

            it('should TableSelectionInfo correctly deselect all items on all pages', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),

                        PaginatedTableSteps.toggleTableHeaderCheckBox(),
                        PaginatedTableSteps.clickTableSelectionInfo_Link_SelectAllOnAllPage,
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(true),

                        PaginatedTableSteps.clickTableSelectionInfo_Link_clearAll(),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),
                        PaginatedTableSteps.verifyTableSelectionInfo_Text(''),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_selectAllOnCurrentPageLink(''),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_SelectAllOnAllPage(''),
                        PaginatedTableSteps.verifyTableSelectionInfo_Link_clearAll(''),
                    ])
                    .run(done);
            });

        });

        describe('Rolemanagement Show Rows Widget', function() {

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            // TODO: Count number of rows basing on rows class
            // Now only checks proper update oflocation hash
            it('should correctly change the number items and update location hash after change ShowRows widget value', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
                        PaginatedTableSteps.verifyTableSelectionInfo_Visible(false),
                        PaginatedTableSteps.verifyShowRowsValue(10),
                        PaginatedTableSteps.verifyTableLength(10),
                        PaginatedTableSteps.selectShowRows(20),
                        GeneralSteps.sleep(700),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '20'),
                        PaginatedTableSteps.verifyTableLength(20),
                        PaginatedTableSteps.selectShowRows(50),
                        GeneralSteps.sleep(700),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '50'),
                        PaginatedTableSteps.verifyTableLength(50),
                        PaginatedTableSteps.selectShowRows(100),
                        GeneralSteps.sleep(700),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '100'),
                        PaginatedTableSteps.verifyTableLength(70), //There is only 70 items in data source
                        PaginatedTableSteps.selectShowRows(10),
                        GeneralSteps.sleep(700),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),
                        PaginatedTableSteps.verifyTableLength(10)
                    ])
                    .run(done);
            });

            it('should correctly update ShowRows widget value when update location hash', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagenumber', '1'),
                        GeneralSteps.verifyLocationHashHasParameterValue('pagesize', '10'),

                        GeneralSteps.changeLocationHashParameter('pagesize', '20'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyShowRowsValue(20),
                        PaginatedTableSteps.verifyTableLength(20),

                        GeneralSteps.changeLocationHashParameter('pagesize', '50'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyShowRowsValue(50),
                        PaginatedTableSteps.verifyTableLength(50),

                        GeneralSteps.changeLocationHashParameter('pagesize', '100'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyShowRowsValue(100),
                        PaginatedTableSteps.verifyTableLength(70), //There is only 70 items in data source

                        GeneralSteps.changeLocationHashParameter('pagesize', '10'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyShowRowsValue(10),
                        PaginatedTableSteps.verifyTableLength(10),
                    ])
                    .run(done);
            });
        });

        describe('Rolemanagement Filter Widget', function() {

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.FilterData);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should properly update table when using role name criteria', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.setFilterRoleName('custom_nonassignable_2'),
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.CreateUserRole),
                        GeneralSteps.verifyTopSectionButtonNotVisible(Dictionary.actions.EditUserRole),
                        GeneralSteps.verifyTopSectionButtonNotVisible(Dictionary.actions.DeleteUserRole),
                        GeneralSteps.verifyTopSectionButtonNotVisible(Dictionary.actions.RoleSummary),
                        GeneralSteps.verifyTopSectionButtonNotVisible(Dictionary.actions.CompareRoles),
                        GeneralSteps.verifyTopSectionButtonNotVisible(Dictionary.actions.Enable),
                        GeneralSteps.verifyTopSectionButtonNotVisible(Dictionary.actions.Disable),
                        GeneralSteps.verifyTopSectionButtonNotVisible(Dictionary.actions.Nonassignable),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(1),
                        PaginatedTableSteps.verifyTableContainItem('custom_nonassignable_2'),
                    ])
                    .run(done);
            });

            // it('should properly update table when using role name criteria and applying by Enter key', function(done) {
            //     this.timeout(DEFAULT_TEST_TIMEOUT);
            //     new Flow()
            //         .setSteps([
            //             GeneralSteps.verifyTopSectionTitle('Role Management'),
            //             PaginatedTableSteps.waitForTableDataIsLoaded(),
            //             RolemanagementSteps.clickRolemanagementButtonFilters,
            //             RolemanagementSteps.setFilterRoleName('custom_nonassignable_2'),
            //             RolemanagementSteps.applyFilterRoleNameByEnterKey();
            //             PaginatedTableSteps.waitForTableDataIsLoaded(),
            //             PaginatedTableSteps.verifyTableLength(1),
            //             PaginatedTableSteps.verifyTableContainItem('custom_nonassignable_2')
            //         ])
            //         .run(done);
            // });

            it('should properly update table for enabled system role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusEnabled,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeSystem,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(4),
                        PaginatedTableSteps.verifyTableContainItem('system_enabled_1'),
                        PaginatedTableSteps.verifyTableContainItem('system_enabled_2'),
                        PaginatedTableSteps.verifyTableContainItem('application_enabled_1'),
                        PaginatedTableSteps.verifyTableContainItem('application_enabled_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for disabled system role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusDisabled,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeSystem,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(4),
                        PaginatedTableSteps.verifyTableContainItem('system_disabled_1'),
                        PaginatedTableSteps.verifyTableContainItem('system_disabled_2'),
                        PaginatedTableSteps.verifyTableContainItem('application_disabled_1'),
                        PaginatedTableSteps.verifyTableContainItem('application_disabled_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for nonassignable system role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusNonassignable,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeSystem,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(4),
                        PaginatedTableSteps.verifyTableContainItem('system_nonassignable_1'),
                        PaginatedTableSteps.verifyTableContainItem('system_nonassignable_2'),
                        PaginatedTableSteps.verifyTableContainItem('application_nonassignable_1'),
                        PaginatedTableSteps.verifyTableContainItem('application_nonassignable_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for enabled com role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusEnabled,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCom,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        PaginatedTableSteps.verifyTableContainItem('com_enabled_1'),
                        PaginatedTableSteps.verifyTableContainItem('com_enabled_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for disabled com role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusDisabled,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCom,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        PaginatedTableSteps.verifyTableContainItem('com_disabled_1'),
                        PaginatedTableSteps.verifyTableContainItem('com_disabled_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for nonassignable com role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusNonassignable,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCom,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        PaginatedTableSteps.verifyTableContainItem('com_nonassignable_1'),
                        PaginatedTableSteps.verifyTableContainItem('com_nonassignable_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for enabled cpp role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusEnabled,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCpp,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(1),
                        PaginatedTableSteps.verifyTableContainItem('zcpp_enabled_1'),
                    ])
                    .run(done);
            });

            it('should properly update table for disabled cpp role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusDisabled,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCpp,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(1),
                        PaginatedTableSteps.verifyTableContainItem('zcpp_disabled_1'),
                    ])
                    .run(done);
            });

            it('should properly update table for nonassignable cpp role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusNonassignable,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCpp,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(1),
                        PaginatedTableSteps.verifyTableContainItem('zcpp_nonassignable_1'),
                    ])
                    .run(done);
            });

            it('should properly update table for enabled comalias role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusEnabled,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeComAlias,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        PaginatedTableSteps.verifyTableContainItem('comalias_enabled_1'),
                        PaginatedTableSteps.verifyTableContainItem('comalias_enabled_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for disabled comalias role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusDisabled,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeComAlias,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        PaginatedTableSteps.verifyTableContainItem('comalias_disabled_1'),
                        PaginatedTableSteps.verifyTableContainItem('comalias_disabled_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for nonassignable comalias role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusNonassignable,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeComAlias,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        PaginatedTableSteps.verifyTableContainItem('comalias_nonassignable_1'),
                        PaginatedTableSteps.verifyTableContainItem('comalias_nonassignable_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for enabled custom role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusEnabled,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCustom,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        PaginatedTableSteps.verifyTableContainItem('custom_enabled_1'),
                        PaginatedTableSteps.verifyTableContainItem('custom_enabled_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for disabled custom role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusDisabled,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCustom,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        PaginatedTableSteps.verifyTableContainItem('custom_disabled_1'),
                        PaginatedTableSteps.verifyTableContainItem('custom_disabled_2'),
                    ])
                    .run(done);
            });

            it('should properly update table for nonassignable custom role', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.clickFilterCheckboxStatusNonassignable,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCustom,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        PaginatedTableSteps.verifyTableContainItem('custom_nonassignable_1'),
                        PaginatedTableSteps.verifyTableContainItem('custom_nonassignable_2'),
                    ])
                    .run(done);
            });

            it('should properly update the table during manual change of windows.location hash when filters active', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyShowRowsValue(10),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),

                        RolemanagementSteps.setFilterRoleName('sys'),

                        // INFO: Full check, just once
                        RolemanagementSteps.clickFilterCheckboxStatusEnabled,
                        RolemanagementSteps.clickFilterCheckboxStatusEnabled,
                        RolemanagementSteps.clickFilterCheckboxStatusDisabled,
                        RolemanagementSteps.clickFilterCheckboxStatusNonassignable,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCom,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeComAlias,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeCustom,
                        RolemanagementSteps.clickFilterCheckboxRoleTypeSystem,
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),

                        GeneralSteps.verifyLocationHashParameterPresent('filter'),
                        GeneralSteps.changeLocationHashParameter('pagesize', '2'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyShowRowsValue(2),

                        //WARNING: UNCOMMENT FOR PARAM LOCATION CONTROLLER BUG
                        // GeneralSteps.changeLocationHashParameter('pagesize', '3'),
                        // PaginatedTableSteps.waitForEventsPropagation,
                        // PaginatedTableSteps.verifyShowRowsValue(3),

                        // GeneralSteps.changeLocationHashParameter('pagesize', '4'),
                        // PaginatedTableSteps.waitForEventsPropagation,
                        // PaginatedTableSteps.verifyShowRowsValue(4),

                        // GeneralSteps.changeLocationHashParameter('pagesize', '5'),
                        // PaginatedTableSteps.waitForEventsPropagation,
                        // PaginatedTableSteps.verifyShowRowsValue(5),

                    ])
                    .run(done);
            });

            it('Should return properly message when filter return empty data', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.clickButtonFilters(),
                        GeneralSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        RolemanagementSteps.setFilterRoleName('MockName'),
                        RolemanagementSteps.clickFilterButtonApply,
                        GeneralSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(500),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(0),
                        GeneralSteps.sleep(200),
                        PaginatedTableSteps.verifyNoDataMessageIsVisible(),
                        PaginatedTableSteps.verifyNoDataMessageContent({
                            title: DictionaryCommon.filterNoResult.title,
                            info: DictionaryCommon.filterNoResult.info
                        })

                    ])
                    .run(done);
            });
        });

        //WARNING: UNCOMMENT FOR PARAM LOCATION CONTROLLER BUG - TORF-98640
        // describe('Rolemanagement Filter fields', function() {
        //
        //     beforeEach(function() {
        //         window.location.hash = 'rolemanagement';
        //         app = new Rolemanagement(options);
        //         environment = new Environment();
        //         environment.setREST(REST.Default);
        //         environment.apply();
        //         app.start(Browser.getElement('#bitContainer'));
        //     });
        //
        //     afterEach(function() {
        //         app.stop();
        //         environment.restore();
        //     });
        //
        //     it('should correctly fill filter fields using location hash ', function(done) {
        //         this.timeout(DEFAULT_TEST_TIMEOUT);
        //         new Flow()
        //             .setSteps([
        //                 GeneralSteps.verifyTopSectionTitle('Role Management'),
        //                 PaginatedTableSteps.waitForTableDataIsLoaded,
        //                 PaginatedTableSteps.verifyShowRowsValue(10),
        //                 PaginatedTableSteps.verifyTableLength(10),
        //                 Steps.verifyPage(1),
        //                 RolemanagementSteps.clickRolemanagementButtonFilters,
        //                 Steps.verifyFilterPanelPresent(),
        //
        //                 RolemanagementSteps.setFilterRoleName("mockSearchString"),
        //                 Steps.verifyFilterRoleNameHasParameterValue(),
        //
        //                 RolemanagementSteps.clickFilterCheckboxStatusEnabled,
        //                 Steps.verifyFilterCheckboxStatusEnabledChecked(),
        //
        //                 RolemanagementSteps.clickFilterCheckboxStatusDisabled,
        //                 Steps.verifyFilterCheckboxStatusDisabledChecked(),
        //
        //                 RolemanagementSteps.clickFilterCheckboxStatusNonassignable,
        //                 Steps.verifyFilterCheckboxStatusNonassignableChecked(),
        //
        //                 RolemanagementSteps.clickFilterCheckboxRoleTypeCom,
        //                 Steps.verifyFilterCheckboxRoleTypeComChecked(),
        //
        //                 RolemanagementSteps.clickFilterCheckboxRoleTypeComAlias,
        //                 Steps.verifyFilterCheckboxRoleTypeComAliasChecked(),
        //
        //                 RolemanagementSteps.clickFilterCheckboxRoleTypeCustom,
        //                 Steps.verifyFilterCheckboxRoleTypeCustomChecked(),
        //
        //                 RolemanagementSteps.clickFilterCheckboxRoleTypeSystem,
        //                 Steps.verifyFilterCheckboxRoleTypeSystemChecked(),
        //
        //
        //             ])
        //             .run(done);
        //     });
        //
        // });

        describe('Rolemanagement - update selected role using container/api', function() {
            //INFO: TORF-114077 - new role name is checked after name edit

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.FilterData);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should correctly select role on request from container', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyRowNotSelectedForItem('application_enabled_1'),
                        PaginatedTableSteps.verifyRowNotSelectedForItem('application_enabled_2'),
                        app.onPause.bind(app), //IMPROVEMENT: Consider move this to lib
                        function() {
                            ContainerApi.getEventBus().publish("userrole:roleupdated", 'application_enabled_1'); //IMPROVEMENT: Consider move this to lib
                        },
                        app.onResume.bind(app), //IMPROVEMENT: Consider move this to lib
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyRowSelectedForItem('application_enabled_1'),
                        PaginatedTableSteps.verifyRowNotSelectedForItem('application_enabled_2'),
                    ])
                    .run(done);
            });
        });

        describe('Rolemanagement - sort', function() {
            //INFO: TORF-114077 - new role name is checked after name edit

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.SortData);
                environment.apply();
                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should correctly sort desc/asc by Role Name', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"name","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Role Name'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"name"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedData,
                            sortMode: "desc",
                            column: "Role Name",
                            from: 0,
                            to: 8
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Role Name'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"name"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedData,
                            sortMode: "asc",
                            column: "Role Name",
                            from: 0,
                            to: 8
                        })
                    ])
                    .run(done);
            });

            it('should correctly sort asc/desc by Role Type', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"name","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Role Type'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"typeColumn"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedData,
                            sortMode: "asc",
                            column: "Role Type",
                            from: 0,
                            to: 8
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Role Type'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"typeColumn"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedData,
                            sortMode: "desc",
                            column: "Role Type",
                            from: 0,
                            to: 8
                        })
                    ])
                    .run(done);
            });

            it('should correctly sort asc/desc by Description', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"name","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Description'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"description"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedData,
                            sortMode: "asc",
                            column: "Description",
                            from: 0,
                            to: 8
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Description'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"description"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedData,
                            sortMode: "desc",
                            column: "Description",
                            from: 0,
                            to: 8
                        })
                    ])
                    .run(done);
            });

            it('should correctly sort asc/desc by Status', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"attribute":"name","order":"asc"}'),
                        PaginatedTableSteps.sortTableByColumnName('Status'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"asc","attribute":"statusColumn"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedDataForStatus,
                            sortMode: "asc",
                            column: "Status",
                            from: 0,
                            to: 8
                        }),
                        PaginatedTableSteps.sortTableByColumnName('Status'),
                        GeneralSteps.sleep(200),
                        GeneralSteps.verifyLocationHashHasParameterValue('sort', '{"order":"desc","attribute":"statusColumn"}'),
                        PaginatedTableSteps.verifyTableContentsForSortedData({
                            user: ExpectedDataForStatus,
                            sortMode: "desc",
                            column: "Status",
                            from: 0,
                            to: 8
                        })
                    ])
                    .run(done);
            });
        });
    });
});
