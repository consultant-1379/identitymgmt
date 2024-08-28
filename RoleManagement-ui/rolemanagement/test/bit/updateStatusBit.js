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
    'container/api',
    'src/rolemanagement/Rolemanagement',
    'i18n!rolemanagement/app.json',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/rolemanagementEnvironment/Rest',
    'test/bit/common/identitymgmtlib/General/Steps',
    'test/bit/common/identitymgmtlib/PaginatedTable/Steps'
], function (ContainerApi, Rolemanagement, Dictionary, Flow, Browser, Environment, REST, GeneralSteps, PaginatedTableSteps) {
    'use strict';

    var DEFAULT_TEST_TIMEOUT = 20000;

    sinon.log = function (message) {
        console.log(message);
    };



    describe('Role Management - change status', function () {

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

        afterEach(function () {
            Browser.gotoHash();
        });

        describe('Role Management - change status for one role and more', function () {
            mocha.setup({globals: ['roleModel', 'notification']});


            beforeEach(function () {
                window.location.hash = 'rolemanagement';
                app = new Rolemanagement(options);
                environment = new Environment();
                environment.setREST(REST.Default);
                environment.setREST(REST.GetRoles.ActionBarData);
                environment.setREST(REST.GetRoles.GetEnabledNonassignableRole);
                environment.setREST(REST.GetRoles.PutEnabledNonassignableRole);
                environment.setREST(REST.GetRoles.GetDisabledNonassignableRole);
                environment.setREST(REST.GetRoles.PutDisabledNonassignableRole);
                environment.setREST(REST.GetRoles.GetEnabledDisabledRole);
                environment.setREST(REST.GetRoles.PutEnabledDisabledRole);

                environment.apply();

                app.start(Browser.getElement('#bitContainer'));
            });

            afterEach(function () {
                app.stop();
                environment.restore();
            });

            it('Should select one role and change status to enable', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.selectRow(6),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Enable),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Nonassignable),
                        GeneralSteps.verifyTopSectionButtonNotVisible(Dictionary.actions.Disable),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.Enable),
                        GeneralSteps.waitForNotification(),
                        GeneralSteps.verifyNotificationText(Dictionary.actionsResponses.StatusEnabled),
                        GeneralSteps.clickNotificationClose()
                    ])
                    .run(done);
            });

            it('Should select one role and change status to disabled', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.selectRow(5),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Disable),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Nonassignable),
                        GeneralSteps.verifyTopSectionButtonNotVisible(Dictionary.actions.Enable),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.Disable),
                        GeneralSteps.waitForNotification(),
                        GeneralSteps.verifyNotificationText(Dictionary.actionsResponses.StatusDisabled),
                        GeneralSteps.clickNotificationClose()
                ])
                .run(done);
            });

            it('Should select one role and change status to nonassignable', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.selectRow(5),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Disable),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Nonassignable),
                        GeneralSteps.verifyTopSectionButtonNotVisible(Dictionary.actions.Enable),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.Nonassignable),
                        GeneralSteps.waitForNotification(),
                        GeneralSteps.verifyNotificationText(Dictionary.actionsResponses.StatusNonassignable),
                        GeneralSteps.clickNotificationClose()
                ])
                .run(done);
            });


            it('Should select more than one role and change status to enable', function (done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.selectRow(5),
                        PaginatedTableSteps.selectRow(6),
                        PaginatedTableSteps.selectRow(7),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Enable),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Nonassignable),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Disable),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.Enable),
                        GeneralSteps.waitForNotification(),
                        GeneralSteps.verifyNotificationText(Dictionary.actionsResponses.StatusEnabled),
                        GeneralSteps.clickNotificationClose()
                    ])
                    .run(done);
            });

            it('Should select all roles and change status to disabled', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.selectRow(5),
                        PaginatedTableSteps.selectRow(6),
                        PaginatedTableSteps.selectRow(7),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Enable),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Nonassignable),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Disable),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.Disable),
                        GeneralSteps.waitForNotification(),
                        GeneralSteps.verifyNotificationText(Dictionary.actionsResponses.StatusDisabled),
                        GeneralSteps.clickNotificationClose()
                ])
                .run(done);
            });

            it('Should select all roles and change status to nonassignable', function(done) {
                this.timeout(DEFAULT_TEST_TIMEOUT);

                new Flow()
                    .setSteps([
                        GeneralSteps.verifyTopSectionTitle(Dictionary.title),
                        PaginatedTableSteps.waitForTableDataIsLoaded(),
                        GeneralSteps.verifyLocationHashPage('#rolemanagement'),
                        PaginatedTableSteps.selectRow(5),
                        PaginatedTableSteps.selectRow(6),
                        PaginatedTableSteps.selectRow(7),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Enable),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Nonassignable),
                        GeneralSteps.verifyTopSectionButton(Dictionary.actions.Disable),
                        GeneralSteps.clickTopSectionButton(Dictionary.actions.Nonassignable),
                        GeneralSteps.waitForNotification(),
                        GeneralSteps.verifyNotificationText(Dictionary.actionsResponses.StatusNonassignable),
                        GeneralSteps.clickNotificationClose()
                ])
                .run(done);
            });

        });

    });
});
