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

    describe('Role Summary Integration Test', function() {

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

        describe('Rolemanagement - Role Summary Panel Visibility ', function() {

            beforeEach(function() {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.SummaryPanelData);
                environment.setREST(REST.GetRoles.SummaryPanelDataTestCOMRoleAlias);
                environment.setREST(REST.GetRoles.SummaryPanelDataTestCustomRole);
                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function() {
                app.stop();
                environment.restore();
                GeneralSteps.restoreBrowser();

            });

            it('should correctly display COM Role role summary', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(1),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelVisibility(),
                        RolemanagementSteps.verifyRoleSummaryField("Name", "ComRoleTest"),
                        RolemanagementSteps.verifyRoleSummaryField("Description", "Testing com role"),
                        RolemanagementSteps.verifyRoleSummaryField("Type", "COM Role"),
                        RolemanagementSteps.verifyRoleSummaryField("Status", "Enabled"),
                        RolemanagementSteps.verifyComRoleAccordionInvisibility(),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelInvisibility()
                    ])
                    .run(done);
            });

            it('should correctly display Application Role role summary', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(2),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelVisibility(),
                        RolemanagementSteps.verifyRoleSummaryField("Name", "TestApplicationRole"),
                        RolemanagementSteps.verifyRoleSummaryField("Description", "Testing application role"),
                        RolemanagementSteps.verifyRoleSummaryField("Type", "ENM System Role"),
                        RolemanagementSteps.verifyRoleSummaryField("Status", "Enabled"),
                        RolemanagementSteps.verifyComRoleAccordionInvisibility(),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelInvisibility()
                    ])
                    .run(done);
            });

            it('should correctly display COM Role Alias role summary', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(3),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelVisibility(),
                        RolemanagementSteps.verifyRoleSummaryField("Name", "TestCOMRoleAlias"),
                        RolemanagementSteps.verifyRoleSummaryField("Description", "Testing COM role alias"),
                        RolemanagementSteps.verifyRoleSummaryField("Type", "COM Role Alias"),
                        RolemanagementSteps.verifyRoleSummaryField("Status", "Enabled"),
                        RolemanagementSteps.verifyComRoleAccordionClosed(),
                        RolemanagementSteps.clickComRoleAccordion(),
                        RolemanagementSteps.verifyComRoleLabel("SystemReadOnly"),
                        RolemanagementSteps.verifyComRoleLabel("SystemSecurityAdministrator"),
                        RolemanagementSteps.verifyComRoleLabel("ENodeB_Application_User"),
                        RolemanagementSteps.verifyVisibilityDetailsLink(),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelInvisibility()
                    ])
                    .run(done);
            });

            it('should correctly display Custom Role role summary', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(4),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelVisibility(),
                        RolemanagementSteps.verifyRoleSummaryField("Name", "TestCustomRole"),
                        RolemanagementSteps.verifyRoleSummaryField("Description", "Testing Custom role"),
                        RolemanagementSteps.verifyRoleSummaryField("Type", "Custom Role"),
                        RolemanagementSteps.verifyRoleSummaryField("Status", "Enabled"),
                        RolemanagementSteps.verifyComRoleAccordionClosed(),
                        RolemanagementSteps.clickComRoleAccordion(),
                        RolemanagementSteps.verifyComRoleLabel("SystemReadOnly"),
                        RolemanagementSteps.verifyComRoleLabel("SystemSecurityAdministrator"),
                        RolemanagementSteps.verifyComRoleLabel("ENodeB_Application_User"),
                        RolemanagementSteps.verifyNumberOfCapabilities(3),
                        RolemanagementSteps.verifyVisibilityDetailsLink(),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelInvisibility()
                    ])
                    .run(done);
            });

            it('should correctly display System Role role summary', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(5),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelVisibility(),
                        RolemanagementSteps.verifyRoleSummaryField("Name", "TestSystemRole"),
                        RolemanagementSteps.verifyRoleSummaryField("Description", "Testing system role"),
                        RolemanagementSteps.verifyRoleSummaryField("Type", "ENM System Role"),
                        RolemanagementSteps.verifyRoleSummaryField("Status", "Enabled"),
                        RolemanagementSteps.verifyComRoleAccordionInvisibility(),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelInvisibility()
                    ])
                    .run(done);
            });

            it('should correctly display CPP Role role summary', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        PaginatedTableSteps.setContextRegion('rolemanagement'),
                        GeneralSteps.verifyTopSectionTitle('Role Management'),
                        PaginatedTableSteps.waitForTableDataIsLoaded,
                        PaginatedTableSteps.selectRow(6),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelVisibility(),
                        RolemanagementSteps.verifyRoleSummaryField("Name", "ZTestCPPRole"),
                        RolemanagementSteps.verifyRoleSummaryField("Description", "Testing cpp role"),
                        RolemanagementSteps.verifyRoleSummaryField("Type", "Task Profile Role"),
                        RolemanagementSteps.verifyRoleSummaryField("Status", "Enabled"),
                        RolemanagementSteps.verifyComRoleAccordionInvisibility(),
                        GeneralSteps.clickButtonSummary(),
                        RolemanagementSteps.verifyRoleSummaryPanelInvisibility()
                    ])
                    .run(done);
            });

        });

    });
});
