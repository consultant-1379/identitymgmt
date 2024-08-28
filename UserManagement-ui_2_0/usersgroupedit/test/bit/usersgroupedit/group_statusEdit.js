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

        describe('UserGroupEdit - edit STATUS', function(){
            beforeEach(function(){
                window.location.hash = 'usersgroupedit/?users=administrator,user_0,user_1,user_2,user_3,user_4,user_5,user_6,user_7,user_8,user_9';
                app = new Usersgroupedit(options);

            });
            afterEach(function(){
                app.stop();
                environment.restore();
            });

            it('Check step summary validation if STATUS of 0 users was updated', function(done){
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        function setMockRESTs() {
                            environment = new Environment();
                            environment.setREST(UsersGroupEditRest.NoChange);
                            environment.apply();
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.checkStatusSwitcherStatus('disabled'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickModifyStatusCheckbox(),
                        UserGroupEditSteps.clickStatusSwitcher(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkStatusSwitcherStatus('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(), // Roles
                        UserGroupEditSteps.clickNextButton(), // Authentication
                        UserGroupEditSteps.checkSummaryMessage({
                            message: Dictionary.summaryStep.noUserUpdated,
                            icon: 'ebIcon_warningOrange'
                        }),
                        UserGroupEditSteps.checkNextButtonState('disabled')
                ]).run(done);
            });

            it('Check steps validation of STATUS, summary messages/warnings and results (all success)', function(done) {
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
                        UserGroupEditSteps.checkStatusSwitcherStatus('disabled'),
                        UserGroupEditSteps.clickModifyStatusCheckbox(),
                        UserGroupEditSteps.clickStatusSwitcher(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 6,
                            message: Dictionary.summaryStep.usersUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            message: Dictionary.summaryStep.statusUpdatedMsgDisabled,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 1,
                            message: Dictionary.summaryStep.adminUpdatedMsg,
                            icon: 'ebIcon_warningOrange'
                        }),
                        UserGroupEditSteps.clickPreviousButton(),
                        UserGroupEditSteps.clickPreviousButton(),
                        UserGroupEditSteps.clickPreviousButton(),
                        UserGroupEditSteps.clickStatusSwitcher(),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 5,
                            message: Dictionary.summaryStep.usersUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            message: Dictionary.summaryStep.statusUpdatedMsgEnabled,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 1,
                            message: Dictionary.summaryStep.adminUpdatedMsg,
                        },false),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.verifyTotalCount(5),
                        UserGroupEditSteps.verifySuccessCount(5),
                        UserGroupEditSteps.verifyFailureCount(0),
                        UserGroupEditSteps.verifyTableData([
                            { username: 'user_0', success: true },
                            { username: 'user_2', success: true },
                            { username: 'user_4', success: true },
                            { username: 'user_6', success: true },
                            { username: 'user_8', success: true }
                        ])
                    ]).run(done);
            });

            it('Check failure results of STATUS', function(done){
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        function setMockRESTs() {
                            environment = new Environment();
                            environment.setREST(UsersGroupEditRest.Failure);
                            environment.apply();
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.checkStatusSwitcherStatus('disabled'),
                        UserGroupEditSteps.clickModifyStatusCheckbox(),
                        UserGroupEditSteps.clickStatusSwitcher(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkStatusSwitcherStatus('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 6,
                            message: Dictionary.summaryStep.usersUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            message: Dictionary.summaryStep.statusUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 1,
                            message: Dictionary.summaryStep.adminUpdatedMsg,
                            icon: 'ebIcon_warningOrange'
                        }),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.verifyTotalCount(6),
                        UserGroupEditSteps.verifySuccessCount(0),
                        UserGroupEditSteps.verifyFailureCount(6),
                        UserGroupEditSteps.verifyTableData([
                            { username: 'administrator', success: false },
                            { username: 'user_1', success: false },
                            { username: 'user_3', success: false },
                            { username: 'user_5', success: false },
                            { username: 'user_7', success: false },
                            { username: 'user_9', success: false }
                        ]),
                        UserGroupEditSteps.checkFinishButtonState('enabled')
                    ]).run(done);
            });
        });
    });
});