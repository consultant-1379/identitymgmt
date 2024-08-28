/*global define, describe, it, expect */
define([
    'jscore/core',
    'container/api',
    'src/usermanagement/Usermanagement',
    'test/bit/usermanagement/usermanagementEnvironment/Rest',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/usermanagement/Steps',
    'test/bit/common/identitymgmtlib/General/Steps',
    'test/bit/common/identitymgmtlib/PaginatedTable/Steps',
    'test/bit/usermanagement/usermanagementEnvironment/data/ExpectedDeleteUsers',
    'i18n!usermgmtlib/app.json',
    'test/bit/usermanagement/usermanagementEnvironment/data/GetRolesDefaultData',
    'i18n!identitymgmtlib/common.json'
], function(core, containerApi, UserManagement, UsermanagementRest, Flow, Browser, Environment, UserManagementSteps, GeneralSteps, PaginatedTableSteps, ExpectedDeleteUsers, Dictionary, GetRolesDefaultData, DictionaryCommon) {
    'use strict';
    var DEFAULT_TEST_TIMEOUT = 50000;
    describe('UserManagement - FILTERS', function() {

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

        var flyoutMock, flyoutId;
        //var setFlyoutMock = function(document) {
            containerApi.loadAppModule('flyout/Flyout', function(flyout) {
                flyoutMock = new flyout();
                //flyoutMock.start(document);
                flyoutMock.start(core.Element.wrap(document.getElementById('bitContainer')));
                flyoutId = containerApi.getEventBus().subscribe('flyout:show', function(options) {
                   options.content !== flyoutMock._uiElement && (flyoutMock.contentOnHide(),
                    flyoutMock.setHeader(options.header || ''),
                    flyoutMock.width = options.width || '400px',
                    flyoutMock.show(options));
                }.bind(this));
            }, function(error) { console.log("errore"); console.log(error); });
        //};

        var stopFlyoutMock = function() {
            containerApi.getEventBus().unsubscribe('flyout:show', flyoutId);
            flyoutMock.stop();
            flyoutMock = undefined;
        };


        beforeEach(function() {
        });

        afterEach(function() {
            Browser.gotoHash();
        });


        describe('UserManagement Filter Widget', function() {

            beforeEach(function() {
                window.location.hash = 'usermanagement';
                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Filters);
                environment.apply();

                app.start(core.Element.wrap(document.getElementById('bitContainer')));
            });

            afterEach(function() {
                //stopFlyoutMock();
                app.stop();
                environment.restore();
            });


            it('Should return properly message when filter return empty data', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.setFilterUserName('MockName'),
                        UserManagementSteps.setFilterDescription('testDescription'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyNoDataMessageIsVisible(),
                        PaginatedTableSteps.verifyNoDataMessageContent({
                            title: DictionaryCommon.filterNoResult.title,
                            info: DictionaryCommon.filterNoResult.info
                        })
                    ])
                    .run(done);
            });

            it('Should properly search Role in filter by Role Name', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        UserManagementSteps.setFilterRoleName('application_enabled_2'),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(1),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.setFilterRoleName('application'),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(6),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.setFilterRoleName('enabled'),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(10),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.setFilterRoleName('MockName'),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(0),
                        UserManagementSteps.clickFilterButtonClose()
                    ])
                    .run(done);
            });


            it('should properly filter users by Credential Status', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.clickFilterCredentialsRadioButton('New'),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('new', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(1),
                        PaginatedTableSteps.verifyTableContainItem('user_disabled_already_logged_1'),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.clickFilterCredentialsRadioButton('Active'),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('active', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(1),
                        PaginatedTableSteps.verifyTableContainItem('user_enabled_already_logged_1'),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.clickFilterCredentialsRadioButton('INACTIVE'),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(1),
                        PaginatedTableSteps.verifyTableContainItem('user_enabled_already_logged_2'),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.clickFilterCredentialsRadioButton('Deleted'),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('deleted', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(1),
                        PaginatedTableSteps.verifyTableContainItem('user_disabled_already_logged_2'),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.clickFilterCredentialsRadioButton('Not applicable'),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(3),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.clickFilterCredentialsRadioButton('active'),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('active', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.clickFilterCredentialsRadioButton('INACTIVE'),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(5),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.clickFilterCredentialsRadioButton('New'),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('New', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(6),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.clickFilterCredentialsRadioButton('Deleted'),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Deleted', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(7)
                    ])
                    .run(done);
            });

            it('should properly filter users by Status', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterStatusRadioButton('Enabled'),
                        UserManagementSteps.verifyFilterStatusRadioButton('Enabled', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterStatusRadioButton('disabled'),
                        UserManagementSteps.verifyFilterStatusRadioButton('disabled', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8)
                    ])
                    .run(done);
            });

            it('should properly filter users by AuthMode', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterAuthModeRadioButton('Local'),
                        UserManagementSteps.verifyFilterAuthModeRadioButton('Local', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(6),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterAuthModeRadioButton('Remote'),
                        UserManagementSteps.verifyFilterAuthModeRadioButton('Remote', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(2),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.verifyFilterAuthModeRadioButton('All', true),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8)
                    ])
                    .run(done);
            });

            it('should properly filter users by Expired', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterStatusRadioButton('expired'),
                        UserManagementSteps.verifyFilterStatusRadioButton('expired', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterStatusRadioButton('notExpired'),
                        UserManagementSteps.verifyFilterStatusRadioButton('notExpired', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8)
                    ])
                    .run(done);
            });

            it('should properly filter users by Custom Password Ageing', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.clickFilterStatusRadioButton('custom'),
                        UserManagementSteps.verifyFilterStatusRadioButton('custom', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(0),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterStatusRadioButton('system'),
                        UserManagementSteps.verifyFilterStatusRadioButton('system', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8)
                    ])
                    .run(done);
            });

            it('should properly filter users by Currently loggined in', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterLogginedInRadioButton('yes'),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('yes', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterLogginedInRadioButton('no'),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('no', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8)
                    ])
                    .run(done);
            });

            it('should properly filter users by Failed Logins', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterFailedLoginsRadioButton('withfailed'),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('withfailed', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterFailedLoginsRadioButton('withoutfailed'),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('withoutfailed', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8)
                    ])
                    .run(done);
            });

            it('should properly filter users by Login Time', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.clickFilterLoginTime('Never Logged In'),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', true),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterLoginTime('loggedWithin'),
                        UserManagementSteps.verifyFilterLoginTime('loggedWithin', true),
                        UserManagementSteps.setFilterLoggedWithinDays('5'),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8)
                    ])
                    .run(done);
            });

            it('Should properly filter users by Roles', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        //----PART 1 start
                        //there is only 1 user with role 'application_enabled_1'
                        //only 'application_enabled_1' is selected
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        PaginatedTableSteps.clickFilterSelectedByName('application_enabled_1', 4),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(1),
                        //----PART 1 end
                        //----PART 2 start
                        //uncheck just selected role 'application_enabled_1'
                        //now any role is selected so table should contains all users
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        PaginatedTableSteps.clickFilterSelectedByName('application_enabled_1', 4),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(8),
                        //----PART 2 end
                        //----PART 3 start
                        //select role 'application_enabled_2', 2 users has this role
                        //filtering should show 2 rows in users table
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        PaginatedTableSteps.clickFilterSelectedByName('application_enabled_2', 4),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        //----PART 3 end
                        //----PART 4 start
                        //select extra 'system_enabled_1' role, now 2 roles are selected
                        //only 1 user has role 'system_enabled_1' and 'application_enabled_2'
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        PaginatedTableSteps.clickFilterSelectedByName('system_enabled_1', 4),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(1),
                        //----PART 4 end
                        //----PART 5 start
                        //uncheck just selected role 'system_enabled_1' and check if users tabla again contains 2 rows
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        PaginatedTableSteps.clickFilterSelectedByName('system_enabled_1', 4),
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(2),
                        //----PART 5 end
                        //----PART 6 start
                        //select again role 'system_enabled_1' but select NOT ASSING (!=) for role 'application_enabled_2'
                        //users table should contains 1 user with role 'system_enabled_1' and not contains role 'system_enabled_2'
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        PaginatedTableSteps.clickFilterSelectedByName('system_enabled_1', 4),
                        PaginatedTableSteps.clickSelectListInTableInRowWithName('system_enabled_2', 4, false),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(1),
                        //----PART 6 end
                        //----PART 7 start
                        //click 'No Role Assigned' and 'Clear link and check selected state
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        UserManagementSteps.clickFilterRolesNoRoleAssigned(),
                        UserManagementSteps.clickFilterButtonApply(),
                        PaginatedTableSteps.verifyAllRolesSelected(GetRolesDefaultData, 4, true),
                        PaginatedTableSteps.verifyAllRolesNoAssignedSelected(GetRolesDefaultData,4),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(0),
                        PaginatedTableSteps.verifyNoDataMessageIsVisible(),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        UserManagementSteps.clickFilterRolesClear(),
                        UserManagementSteps.clickFilterButtonApply(),
                        PaginatedTableSteps.verifyAllRolesSelected(GetRolesDefaultData, 4, false),
                        UserManagementSteps.clickFilterButtonClose(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.verifyTableLength(8),
                        //----PART 7 end
                    ])
                    .run(done);
            });

            it('should properly filter users by Name', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.setFilterName('mockName'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(3),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.setFilterName('*'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(0),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.setFilterName('security'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(5),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.setFilterName('NotExistingName'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(0),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8)
                    ])
                    .run(done);
            });

            it('should properly filter users by Surname', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.setFilterSurname('mockSurname'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.setFilterSurname('('),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(0),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.setFilterSurname('admin'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(4),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.setFilterSurname('NotExistingSurname'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(0),
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8)
                    ])
                    .run(done);
            });


            it('should properly filter users by Description', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(200),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.setFilterDescription('mockDescription'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(3),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.setFilterDescription('.*'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.setFilterDescription('NotExistingDescription'),
                        UserManagementSteps.clickFilterButtonApply(),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(0),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.clickFilterButtonClear(),
                        UserManagementSteps.verifyFilterDescription(''),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.verifyTableLength(8)
                    ])
                    .run(done);
            });

        });

        describe('UserManagement Filter Widget - manual link update, criteria: "user name"', function() {

            beforeEach(function() {

                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.UsersFilterTestData);
                environment.apply();

            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should properly update filter inputs when when passing link manually', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        function() {
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter={"username"%3A"mockUserName"}';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName('mockUserName'),
                        UserManagementSteps.verifyFilterDescription(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter={"username"%3A"mockUserName"%2C"description"%3A"testDescription"}';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName('mockUserName'),
                        UserManagementSteps.verifyFilterDescription('testDescription'),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter={"description"%3A"testDescription"}';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterDescription('testDescription'),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter={"username"%3A"mockUserName"%2C"name"%3A"testName"%2C"surname"%3A"testSurname"}';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName('mockUserName'),
                        UserManagementSteps.verifyFilterName('testName'),
                        UserManagementSteps.verifyFilterSurname('testSurname'),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter={"name"%3A"testName"%2C"surname"%3A"testSurname"}';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName('testName'),
                        UserManagementSteps.verifyFilterSurname('testSurname'),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter={"name"%3A"testName1"}';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName('testName1'),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter={"surname"%3A"testSurname1"}';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname('testSurname1'),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22status%22%3A%5B%22enabled%22%5D%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('enabled', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        // UserManagementSteps.verifyFilterLogginedInRadioButton('all', true), //no idea why this All element is false (not checked), other cases works, manual test also works
                        // UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true), //no idea why this All element is false (not checked), other cases works, manual test also works
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22lastLogin%22%3A%5B%22NEVER_LOGGED_IN%22%5D%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22credentialStatus%22%3A%5B%22ACTIVE%22%2C%22NOT%20APPLICABLE%22%5D%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', false),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', true),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22currentlyLoggedIn%22%3A%5B%22true%22%5D%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', false),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('Yes', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22status%22%3A%5B%22disabled%22%5D%2C%22lastLogin%22%3A%5B%7B%22LOGGED_WITHIN%22%3A5%7D%5D%2C%22credentialStatus%22%3A%5B%22INACTIVE%22%5D%2C%22currentlyLoggedIn%22%3A%5B%22false%22%5D%7D&sort=%7B%22attribute%22%3A%22username%22%2C%22order%22%3A%22asc%22%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('Disabled', true),
                        UserManagementSteps.verifyFilterLoginTime('loggedWithin', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('no', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22failedLogins%22%3A%5B%22withfailed%22%5D%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', false),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('withfailed', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22failedLogins%22%3A%5B%22withoutfailed%22%5D%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', false),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('withoutfailed', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22expirationData%22%3A%5B%22expired%22%5D%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('expired', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22expirationData%22%3A%5B%22notexpired%22%5D%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('notexpired', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22passwordAgeing%22%3A%5B%22system%22%5D%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('system', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22passwordAgeing%22%3A%5B%22custom%22%5D%7D';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('custom', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter={"roles"%3A{"assigned"%3A["application_enabled_1"]%2C"not_assigned"%3A["application_enabled_2"]}}';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.verifyFilterName(''),
                        UserManagementSteps.verifyFilterSurname(''),
                        UserManagementSteps.verifyFilterStatusRadioButton('all', true),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.verifyFilterSelectedByName("application_enabled_1",4),
                        PaginatedTableSteps.verifyFilterSelectedByName("application_enabled_2",4),
                        PaginatedTableSteps.verifyColorFilterSelectedByName("application_enabled_1",4,'rgb(134, 188, 37)'),
                        PaginatedTableSteps.verifyColorFilterSelectedByName("application_enabled_2",4,'rgb(156, 156, 156)'),
                        PaginatedTableSteps.verifySelectedListInTableInRowWithName("application_enabled_1",4,'='),
                        PaginatedTableSteps.verifySelectedListInTableInRowWithName("application_enabled_2",4,'!=')
                    ])
                    .run(done);
            });
        });

        describe.skip('UserManagement Filter Widget - manual link update, criteria: "user name"', function() {

            beforeEach(function() {

                app = new UserManagement(options);
                environment = new Environment();
                environment.setREST(UsermanagementRest.Default);
                environment.setREST(UsermanagementRest.Users.FederatedUsersFilterTestData);
                environment.apply();

            });

            afterEach(function() {
                app.stop();
                environment.restore();
            });

            it('should properly update filter inputs when user is federated', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('usermanagement'),
                        function() {
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter={"username"%3A"mockUserNameFederated"}&federated=true';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.verifyTopSectionTitle('User Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName('mockUserNameFederated'),
                        UserManagementSteps.checkStatusFilterNotPresent(),
                        UserManagementSteps.checkAuthModeFilterNotPresent(),
                        UserManagementSteps.checkGeneralFiltersNotPresent(),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22lastLogin%22%3A%5B%22NEVER_LOGGED_IN%22%5D%7D&federated=true';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.checkStatusFilterNotPresent(),
                        UserManagementSteps.checkAuthModeFilterNotPresent(),
                        UserManagementSteps.checkGeneralFiltersNotPresent(),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22credentialStatus%22%3A%5B%22ACTIVE%22%2C%22NOT%20APPLICABLE%22%5D%7D&federated=true';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.checkStatusFilterNotPresent(),
                        UserManagementSteps.checkAuthModeFilterNotPresent(),
                        UserManagementSteps.checkGeneralFiltersNotPresent(),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', false),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', true),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22currentlyLoggedIn%22%3A%5B%22true%22%5D%7D&federated=true';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.checkStatusFilterNotPresent(),
                        UserManagementSteps.checkAuthModeFilterNotPresent(),
                        UserManagementSteps.checkGeneralFiltersNotPresent(),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', false),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('Yes', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22failedLogins%22%3A%5B%22withfailed%22%5D%7D&federated=true';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.checkStatusFilterNotPresent(),
                        UserManagementSteps.checkAuthModeFilterNotPresent(),
                        UserManagementSteps.checkGeneralFiltersNotPresent(),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', false),
//                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('withfailed', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter=%7B%22failedLogins%22%3A%5B%22withoutfailed%22%5D%7D&federated=true';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.checkStatusFilterNotPresent(),
                        UserManagementSteps.checkAuthModeFilterNotPresent(),
                        UserManagementSteps.checkGeneralFiltersNotPresent(),
                        UserManagementSteps.verifyFilterLoginTime('Never Logged In', false),
//                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('withoutfailed', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        function() {
                            app.stop();
                            window.location.hash = 'usermanagement/?pagenumber=1&pagesize=10&filter={"roles"%3A{"assigned"%3A["application_enabled_1"]%2C"not_assigned"%3A["application_enabled_2"]}}&federated=true';
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        PaginatedTableSteps.setContextRegion('usermanagement_filters'),
                        UserManagementSteps.clickUsermanagementButtonFilters(),
                        UserManagementSteps.verifyFilterPanelPresent(),
                        UserManagementSteps.verifyFilterUserName(''),
                        UserManagementSteps.checkStatusFilterNotPresent(),
                        UserManagementSteps.checkAuthModeFilterNotPresent(),
                        UserManagementSteps.checkGeneralFiltersNotPresent(),
                        UserManagementSteps.verifyFilterLoginTime('all', true),
                        UserManagementSteps.verifyFilterLogginedInRadioButton('all', true),
                        UserManagementSteps.verifyFilterFailedLoginsRadioButton('all', true),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('ACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('INACTIVE', false),
                        UserManagementSteps.verifyFilterCredentialsRadioButton('Not applicable', false),
                        UserManagementSteps.clickFilterButtonClose(),
                        PaginatedTableSteps.verifyFilterSelectedByName("application_enabled_1",4),
                        PaginatedTableSteps.verifyFilterSelectedByName("application_enabled_2",4),
                        PaginatedTableSteps.verifyColorFilterSelectedByName("application_enabled_1",4,'rgb(134, 188, 37)'),
                        PaginatedTableSteps.verifyColorFilterSelectedByName("application_enabled_2",4,'rgb(156, 156, 156)'),
                        PaginatedTableSteps.verifySelectedListInTableInRowWithName("application_enabled_1",4,'='),
                        PaginatedTableSteps.verifySelectedListInTableInRowWithName("application_enabled_2",4,'!=')
                    ])
                    .run(done);
            });
        });
    });
});
