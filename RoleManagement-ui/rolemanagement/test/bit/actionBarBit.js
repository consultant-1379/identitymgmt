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
    'container/api',
    'src/rolemanagement/Rolemanagement',
    'i18n!rolemanagement/app.json',
    'test/bit/rolemanagementEnvironment/Rest',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/common/rolemgmtlib/Rolemanagement/Steps',
    'test/bit/common/identitymgmtlib/General/Steps',
    'test/bit/common/identitymgmtlib/PaginatedTable/Steps'
], function(ContainerApi, Rolemanagement, Dictionary, REST, Flow, Browser, Environment, RolemanagementSteps, GeneralSteps, PaginatedTableSteps) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 20000;

    describe('Action Bar Integration Test', function() {

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

        afterEach(function() {
            Browser.gotoHash();
        });

        describe('Rolemanagement - Action Bar Visibility ', function() {

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.ActionBarData);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();

            });

            it('should correctly display Enabled COM Role action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(1),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButtonNotVisible("Enable"),
                        GeneralSteps.verifyTopSectionButtonNotVisible("Disable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display Disabled COM Role action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Enable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display Nonassignabled COM Role action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButtonNotVisible("Disable"),
                        GeneralSteps.verifyTopSectionButton("Enable")
                    ])
                    .run(done);
            });

            it('should correctly display ENM System Role action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(4),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                    ])
                    .run(done);
            });

            it('should correctly display Enabled COM Role Alias action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(5),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Disable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display Disabled COM Role Alias action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(6),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable"),
                        GeneralSteps.verifyTopSectionButton("Enable")
                    ])
                    .run(done);
            });

            it('should correctly display Nonassignabled COM Role Alias action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(7),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Disable"),
                        GeneralSteps.verifyTopSectionButton("Enable")
                    ])
                    .run(done);
            });

            it('should correctly display Enabled Custom Role action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(8),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Disable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display Disabled Custom Role action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(9),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable"),
                        GeneralSteps.verifyTopSectionButton("Enable")
                    ])
                    .run(done);
            });

            it('should correctly display Nonassignabled Custom Role action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(10),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Disable"),
                        GeneralSteps.verifyTopSectionButton("Enable")
                    ])
                    .run(done);
            });

            it('should correctly display Enabled CPP Role action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        GeneralSteps.changeLocationHash('#rolemanagement?pagenumber=1&pagesize=20'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(12),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButtonNotVisible("Enable"),
                        GeneralSteps.verifyTopSectionButtonNotVisible("Disable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display Disabled CPP Role action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        GeneralSteps.changeLocationHash('#rolemanagement?pagenumber=1&pagesize=20'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(13),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Enable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display Nonassignabled CPP Role action bar', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        GeneralSteps.changeLocationHash('#rolemanagement?pagenumber=1&pagesize=20'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(14),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Edit"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButtonNotVisible("Disable"),
                        GeneralSteps.verifyTopSectionButton("Enable")
                    ])
                    .run(done);
            });

            it('should correctly display action bar for two selected COM Roles', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(1),
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        //eneralSteps.verifyTopSectionButton("Compare"),
                        GeneralSteps.verifyTopSectionButtonNotVisible("Disable"),
                        GeneralSteps.verifyTopSectionButton("Enable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display action bar for three selected COM Roles', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(1),
                        PaginatedTableSteps.selectRow(2),
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButtonNotVisible("Disable"),
                        GeneralSteps.verifyTopSectionButton("Enable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display action bar for two selected COM Role Aliases', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(5),
                        PaginatedTableSteps.selectRow(6),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        //GeneralSteps.verifyTopSectionButton("Compare"),
                        GeneralSteps.verifyTopSectionButton("Disable"),
                        GeneralSteps.verifyTopSectionButton("Enable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display action bar for three selected COM Role Aliases', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(5),
                        PaginatedTableSteps.selectRow(6),
                        PaginatedTableSteps.selectRow(7),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Disable"),
                        GeneralSteps.verifyTopSectionButton("Enable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable"),
                    ])
                    .run(done);
            });

            it('should correctly display action bar for two selected Custom Roles', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(8),
                        PaginatedTableSteps.selectRow(9),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Compare"),
                        GeneralSteps.verifyTopSectionButton("Disable"),
                        GeneralSteps.verifyTopSectionButton("Enable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display action bar for three selected Custom Roles', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(8),
                        PaginatedTableSteps.selectRow(9),
                        PaginatedTableSteps.selectRow(10),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        GeneralSteps.verifyTopSectionButton("Delete"),
                        GeneralSteps.verifyTopSectionButton("Disable"),
                        GeneralSteps.verifyTopSectionButton("Enable"),
                        GeneralSteps.verifyTopSectionButton("Nonassignable")
                    ])
                    .run(done);
            });

            it('should correctly display action bar for two selected ENM System Roles', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        GeneralSteps.changeLocationHash('#rolemanagement?pagenumber=1&pagesize=20'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(4),
                        PaginatedTableSteps.selectRow(11),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        //GeneralSteps.verifyTopSectionButton("Compare")
                    ])
                    .run(done);
            });

            it('should correctly display action bar for checked ENM System Role and one different role type', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        PaginatedTableSteps.selectRow(1),
                        PaginatedTableSteps.selectRow(4),
                        GeneralSteps.verifyTopSectionButton("Create User Role"),
                        //GeneralSteps.verifyTopSectionButton("Compare")
                    ])
                    .run(done);
            });
        });
    });
});
