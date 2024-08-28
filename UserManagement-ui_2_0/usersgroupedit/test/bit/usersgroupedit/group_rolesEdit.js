/*global define, describe, it, expect */
define([
    'src/usersgroupedit/Usersgroupedit',
    'test/bit/usersgroupedit/Environment/Rest',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/usersgroupedit/Steps',
    'i18n!usersgroupedit/app.json',
    'test/bit/common/identitymgmtlib/General/Steps'
], function(Usersgroupedit, UsersGroupEditRest, Flow, Browser, Environment, UserGroupEditSteps, Dictionary, GeneralSteps) {
    'use strict';
    var DEFAULT_TEST_TIMEOUT = 150000;
    describe('Usersgroupedit - GROUP EDIT', function() {

        var environment, app;
        var options = {
            breadcrumb: [{
                name: 'ENM',
                url: '#launcher'
            },{
                name: 'User Management'
            }],
            namespace: 'usersgroupedit',
            properties: {
                title: 'Edit User Profiles'
            }
        };

        beforeEach(function() {

        });

        afterEach(function() {
            Browser.gotoHash();
        });


        describe('ROLES assign', function(){
            beforeEach(function(){
                window.location.hash = 'usersgroupedit/?users=administrator,user_0,user_1,user_2,user_3,user_4,user_5,user_6,user_7,user_8,user_9';
                app = new Usersgroupedit(options);

            });
            afterEach(function(){
                app.stop();
                environment.restore();
            });

            it('Check step summary validation if ROLES of 0 users was updated', function(done){
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        function setMockRESTs() {
                            environment = new Environment();
                            environment.setREST(UsersGroupEditRest.Default);
                            environment.apply();
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('disabled'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(false),
                        UserGroupEditSteps.clickRolesCheckbox(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(true),
                        UserGroupEditSteps.verifyAllRolesCount(6),
                        UserGroupEditSteps.verifyAssignedRolesCount(0),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(), //Go to Authentication
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(), //Go to Summary
                        UserGroupEditSteps.checkNextButtonState('disabled'), //Apply button disabled
//                        UserGroupEditSteps.clickNextButton(),
                       UserGroupEditSteps.checkSummaryMessage({
                           value: 0,
                           message: Dictionary.summaryStep.noUserUpdated,
                           icon: 'ebIcon_warningOrange'
                       }),
                       UserGroupEditSteps.checkSummaryMessage({
                           value: 0,
                           message: Dictionary.summaryStep.noRolesSelected,
                           icon: 'ebIcon_warningOrange'
                       }),
                       UserGroupEditSteps.checkSummaryMessage({
                            message: Dictionary.summaryStep.statusUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                       }, false),
                       UserGroupEditSteps.checkSummaryMessage({
                            message: Dictionary.summaryStep.adminUpdatedMsg,
                            icon: 'ebIcon_warningOrange'
                       }, false),
//                        UserGroupEditSteps.checkNextButtonState('disabled')
                    ]).run(done);
            });

            it('Check steps validation of ROLES, summary messages and results (all success)', function(done){
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        function setMockRESTs() {
                            environment = new Environment();
                            environment.setREST(UsersGroupEditRest.Default);
                            environment.apply();
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('disabled'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(false),
                        UserGroupEditSteps.clickRolesCheckbox(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(true),
                        UserGroupEditSteps.verifyAllRolesCount(6),
                        UserGroupEditSteps.verifyAssignedRolesCount(0),
                        UserGroupEditSteps.clickRoleTickButton('application_enabled_1'),
                        UserGroupEditSteps.verifyAssignedRolesCount(1),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 3,
                            message: Dictionary.summaryStep.usersUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 3,
                            message: Dictionary.summaryStep.assignedUpdatedMsgAssigned,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                             message: Dictionary.summaryStep.statusUpdatedMsg,
                             icon: 'ebIcon_dialogInfo'
                        }, false),
                        UserGroupEditSteps.checkSummaryMessage({
                             message: Dictionary.summaryStep.adminUpdatedMsg,
                             icon: 'ebIcon_warningOrange'
                        }, false),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.verifyTotalCount(3),
                        UserGroupEditSteps.verifySuccessCount(3),
                        UserGroupEditSteps.verifyFailureCount(0),
                        UserGroupEditSteps.verifyTableData([
                            { username: 'administrator', success: true },
                            { username: 'user_0', success: true },
                            { username: 'user_1', success: true },
                            { username: 'user_2', success: true },
                        ]),
                        UserGroupEditSteps.checkFinishButtonState('enabled')
                    ]).run(done);
            });


            it('Check steps validation of ROLES with TARGET, summary messages and results (all success)', function(done){
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        function setMockRESTs() {
                            environment = new Environment();
                            environment.setREST(UsersGroupEditRest.Default);
                            environment.apply();
                            app.start(Browser.getElement('#bitContainer'));
                        },

                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('disabled'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(false),
                        UserGroupEditSteps.clickRolesCheckbox(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(true),
                        UserGroupEditSteps.verifyAllRolesCount(6),
                        UserGroupEditSteps.verifyAssignedRolesCount(0),
                        UserGroupEditSteps.checkTargetGroupButtonEnabled('NODE_SECURITY_ADMIN', false),
                        UserGroupEditSteps.clickRoleTickButton('NODE_SECURITY_ADMIN'),
                        UserGroupEditSteps.checkTargetGroupButtonEnabled('NODE_SECURITY_ADMIN', true),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkSummaryMessage({
                              value: 10,
                              message: Dictionary.summaryStep.usersUpdatedMsg,
                              icon: 'ebIcon_dialogInfo'
                          }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 10,
                            message: Dictionary.summaryStep.assignedUpdatedMsgAssigned,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                             message: Dictionary.summaryStep.statusUpdatedMsg,
                             icon: 'ebIcon_dialogInfo'
                        }, false),
                        UserGroupEditSteps.checkSummaryMessage({
                             message: Dictionary.summaryStep.adminUpdatedMsg,
                             icon: 'ebIcon_warningOrange'
                        }, false),
                        UserGroupEditSteps.checkSummaryMessage({
                             message: Dictionary.summaryStep.noRolesSelected,
                             icon: 'ebIcon_warningOrange'
                        }, false),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.verifyTotalCount(10),
                        UserGroupEditSteps.verifySuccessCount(10),
                        UserGroupEditSteps.verifyFailureCount(0),
                        UserGroupEditSteps.checkFinishButtonState('enabled')
                    ]).run(done);
            });


//            it('Check steps validation of No ROLES SELECTED, summary messages (warning message)', function(done){
//                this.timeout(DEFAULT_TEST_TIMEOUT);
//                new Flow()
//                    .setSteps([
//                        function setMockRESTs() {
//                            environment = new Environment();
//                            environment.setREST(UsersGroupEditRest.Default);
//                            environment.apply();
//                            app.start(Browser.getElement('#bitContainer'));
//                        },
//
//                        GeneralSteps.sleep(300),
//                        UserGroupEditSteps.clickNextButton(),
//                        UserGroupEditSteps.checkRolesTableVisibility(false),
//                        UserGroupEditSteps.clickRolesCheckbox(),
//                        UserGroupEditSteps.checkNextButtonState('enabled'),
//                        UserGroupEditSteps.checkRolesSelectBoxStatus('enabled'),
//                        UserGroupEditSteps.checkRolesTableVisibility(true),
//                        UserGroupEditSteps.verifyAllRolesCount(6),
//                        UserGroupEditSteps.verifyAssignedRolesCount(0),
//                        UserGroupEditSteps.checkNextButtonState('enabled'),
//                        UserGroupEditSteps.clickNextButton(),
//                        UserGroupEditSteps.checkNextButtonState('enabled'),
//                        UserGroupEditSteps.clickNextButton(),
//                        UserGroupEditSteps.checkSummaryMessage({
//                            value: 0,
//                            message: Dictionary.summaryStep.noUserUpdated,
//                            icon: 'ebIcon_warningOrange'
//                        }),
//                        UserGroupEditSteps.checkSummaryMessage({
//                             message: Dictionary.summaryStep.assignedUpdatedMsgAssigned,
//                             icon: 'ebIcon_dialogInfo'
//                        }, false),
//                        UserGroupEditSteps.checkSummaryMessage({
//                             message: Dictionary.summaryStep.statusUpdatedMsg,
//                             icon: 'ebIcon_dialogInfo'
//                        }, false),
//                        UserGroupEditSteps.checkSummaryMessage({
//                             message: Dictionary.summaryStep.adminUpdatedMsg,
//                             icon: 'ebIcon_warningOrange'
//                        }, false),
//                        UserGroupEditSteps.checkSummaryMessage({
//                             message: Dictionary.summaryStep.noRolesSelected,
//                             icon: 'ebIcon_warningOrange'
//                        }, true)
//                    ]).run(done);
//            });

            it('Check steps validation of all ROLES SELECTED, summary messages (warning message)', function(done){
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        function setMockRESTs() {
                            environment = new Environment();
                            environment.setREST(UsersGroupEditRest.Default);
                            environment.apply();
                            app.start(Browser.getElement('#bitContainer'));
                        },

                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkRolesTableVisibility(false),
                        UserGroupEditSteps.clickRolesCheckbox(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(true),
                        UserGroupEditSteps.verifyAllRolesCount(6),
                        UserGroupEditSteps.verifyAssignedRolesCount(0),
                        UserGroupEditSteps.clickAllRolesLink(0),
                        UserGroupEditSteps.verifyAllRolesCount(6),
                        UserGroupEditSteps.verifyAssignedRolesCount(6),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 11,
                            message: Dictionary.summaryStep.usersUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 11,
                            message: Dictionary.summaryStep.assignedUpdatedMsgAssigned,
                            icon: 'ebIcon_dialogInfo'
                        })
                    ]).run(done);
            });



        });
        describe('ROLES unassign', function(){
            beforeEach(function(){
                window.location.hash = 'usersgroupedit/?users=administrator,user_0,user_5';
                app = new Usersgroupedit(options);

            });
            afterEach(function(){
                app.stop();
                environment.restore();
            });

            it('Check step summary validation if ROLES of 0 users was updated', function(done){
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        function setMockRESTs() {
                            environment = new Environment();
                            environment.setREST(UsersGroupEditRest.Default);
                            environment.apply();
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('disabled'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(false),
                        UserGroupEditSteps.clickRolesCheckbox(),
                        UserGroupEditSteps.selectOptionInRolesSelectBox('Unassign'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(true),
                        UserGroupEditSteps.verifyAllRolesCount(4),
                        UserGroupEditSteps.verifyAssignedRolesCount(0),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkSummaryMessage({
                           value: 0,
                           message: Dictionary.summaryStep.noUserUpdated,
                           icon: 'ebIcon_warningOrange'
                       }),
                       UserGroupEditSteps.checkSummaryMessage({
                           value: 0,
                           message: Dictionary.summaryStep.noRolesSelected,
                           icon: 'ebIcon_warningOrange'
                       },false),
                       UserGroupEditSteps.checkSummaryMessage({
                            message: Dictionary.summaryStep.statusUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                       }, false),
                       UserGroupEditSteps.checkSummaryMessage({
                            message: Dictionary.summaryStep.adminUpdatedMsg,
                            icon: 'ebIcon_warningOrange'
                       }, false),
                       UserGroupEditSteps.checkNextButtonState('disabled')
                    ]).run(done);
            });

            it('Check steps validation of ROLES, summary messages and results (all success)', function(done){
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        function setMockRESTs() {
                            environment = new Environment();
                            environment.setREST(UsersGroupEditRest.Default);
                            environment.apply();
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('disabled'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(false),
                        UserGroupEditSteps.clickRolesCheckbox(),
                        UserGroupEditSteps.selectOptionInRolesSelectBox('Unassign'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('enabled'),
                        UserGroupEditSteps.checkRolesTableVisibility(true),
                        UserGroupEditSteps.verifyAllRolesCount(4),
                        UserGroupEditSteps.verifyAssignedRolesCount(0),
                        UserGroupEditSteps.clickRoleTickButton('application_enabled_1'),
                        UserGroupEditSteps.verifyAssignedRolesCount(1),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 2,
                            message: Dictionary.summaryStep.usersUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 2,
                            message: Dictionary.summaryStep.assignedUpdatedMsgUnassigned,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 1,
                             message: Dictionary.summaryStep.adminUpdatedMsg,
                             icon: 'ebIcon_warningOrange'
                        }, false),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.verifyTotalCount(2),
                        UserGroupEditSteps.verifySuccessCount(2),
                        UserGroupEditSteps.verifyFailureCount(0),
                        UserGroupEditSteps.verifyTableData([
                            { username: 'user_0', success: true },
                            { username: 'user_5', success: true }
                        ]),
                        UserGroupEditSteps.checkFinishButtonState('enabled')
                    ]).run(done);
            });

            it('Check steps validation of all ROLES is unassigned, summary messages (warning message)', function(done){
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        function setMockRESTs() {
                            environment = new Environment();
                            environment.setREST(UsersGroupEditRest.Default);
                            environment.apply();
                            app.start(Browser.getElement('#bitContainer'));
                        },

                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.clickNextButton(),
                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.checkRolesTableVisibility(false),
                        UserGroupEditSteps.clickRolesCheckbox(),
                        UserGroupEditSteps.selectOptionInRolesSelectBox('Unassign'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkRolesSelectBoxStatus('enabled'),
                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.checkRolesTableVisibility(true),
                        UserGroupEditSteps.verifyAllRolesCount(4),
                        UserGroupEditSteps.verifyAssignedRolesCount(0),
                        UserGroupEditSteps.clickAllRolesLink(),
                        UserGroupEditSteps.verifyAllRolesCount(4),
                        UserGroupEditSteps.verifyAssignedRolesCount(4),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 3,
                            message: Dictionary.summaryStep.usersUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 3,
                            message: Dictionary.summaryStep.assignedUpdatedMsgUnassigned,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 1,
                            message: Dictionary.summaryStep.adminUpdatedMsg,
                            icon: 'ebIcon_warningOrange'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 'administrator',
                            message: Dictionary.summaryStep.cannotUnassignAllRoles,
                            icon: 'ebIcon_warningOrange'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 'user_0',
                            message: Dictionary.summaryStep.cannotUnassignAllRoles,
                            icon: 'ebIcon_warningOrange'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 'user_5',
                            message: Dictionary.summaryStep.cannotUnassignAllRoles,
                            icon: 'ebIcon_warningOrange'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                             message: Dictionary.summaryStep.unassignAllRoles,
                             icon: 'ebIcon_invalid'
                        }),
                        UserGroupEditSteps.checkNextButtonState('disabled')
                    ]).run(done);
            });

        });
    });
});
