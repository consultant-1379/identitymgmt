define([
    'src/usersgroupedit/Usersgroupedit',
    'test/bit/usersgroupedit/Environment/Rest',
    'test/bit/lib/Flow',
    'test/bit/lib/Browser',
    'test/bit/lib/Environment',
    'test/bit/usersgroupedit/Steps',
    'i18n!usersgroupedit/app.json',
    'identitymgmtlib/Utils',
    'test/bit/common/identitymgmtlib/General/Steps'
], function(Usersgroupedit, UsersGroupEditRest, Flow, Browser, Environment, UserGroupEditSteps, Dictionary, Utils, GeneralSteps) {
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


        describe('UserGroupEdit - edit DESCRIPTION', function(){

            beforeEach(function(){
                window.location.hash = 'usersgroupedit/?users=administrator,user_0,user_1,user_2,user_3,user_4,user_5,user_6,user_7,user_8,user_9';
                app = new Usersgroupedit(options);

            });
            afterEach(function(){
                app.stop();
                environment.restore();
            });

            it('Check step summary validation if DESCRIPTION of 0 users was updated', function(done) { //Despicable
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
                        UserGroupEditSteps.checkDescriptionStatus('disabled'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickModifyDescriptionCheckbox(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkDescriptionStatus('enabled'),
                        UserGroupEditSteps.fillDescription('description'),
                        UserGroupEditSteps.clickNextButton(),
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
                            message: Dictionary.summaryStep.statusUpdatedMsg,
                            icon: 'ebIcon_dialogInfo'
                        }, false),
                        UserGroupEditSteps.checkSummaryMessage({
                            message: Dictionary.summaryStep.adminUpdatedMsg,
                            icon: 'ebIcon_warningOrange'
                        }, false),
                        UserGroupEditSteps.checkNextButtonState('disabled')
                    ])
                    .run(done);
            });

            it('Check steps validation, summary messages/warnings and results (6 modified success) by Description', function(done) { //Despicable
                this.timeout(DEFAULT_TEST_TIMEOUT);
                new Flow()
                    .setSteps([
                        function setMockRESTs() {
                            environment = new Environment();
                            environment.setREST(UsersGroupEditRest.Users10Mixed);
                            environment.apply();
                            app.start(Browser.getElement('#bitContainer'));
                        },
                        GeneralSteps.sleep(300),
                        UserGroupEditSteps.checkStatusSwitcherStatus('disabled'),
                        UserGroupEditSteps.checkDescriptionStatus('disabled'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickModifyDescriptionCheckbox(),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.checkDescriptionStatus('enabled'),
                        UserGroupEditSteps.fillDescription('description10'),
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
                            message: Utils.printf(Dictionary.summaryStep.descriptionUpdatedMsg,'description10'),
                            icon: 'ebIcon_dialogInfo'
                        }),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 1,
                            message: Dictionary.summaryStep.adminUpdatedMsg,
                            icon: 'ebIcon_warningOrange'
                        },false),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.verifyTotalCount(6),
                        UserGroupEditSteps.verifySuccessCount(6),
                        UserGroupEditSteps.verifyFailureCount(0),
                        UserGroupEditSteps.verifyTableData([
                            { username: 'administrator', success: true },
                            { username: 'user_0', success: true },
                            { username: 'user_1', success: true },
                            { username: 'user_2', success: true },
                            { username: 'user_3', success: true },
                            { username: 'user_4', success: true }
                        ]),
                        UserGroupEditSteps.checkNextButtonState('enabled')
                    ])
                    .run(done);
            });
        });
    });
});