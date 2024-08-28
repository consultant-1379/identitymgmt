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


        describe('UserGroupEdit - edit PASSWORDAGEING', function(){

            beforeEach(function(){
                window.location.hash = 'usersgroupedit/?users=administrator,user_0,user_1,user_2,user_3,user_4,user_5,user_6,user_7,user_8,user_9';
                app = new Usersgroupedit(options);

            });
            afterEach(function(){
                app.stop();
                environment.restore();
            });

            it('Check step summary validation if PASSWORDAGEING of 0 users was updated', function(done) {
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
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkAuthModeStatus('disabled'),
                        UserGroupEditSteps.checkPwdAgeingStatus('disabled'),
                        UserGroupEditSteps.checkNextButtonState('disabled'),
                        UserGroupEditSteps.clickModifyPwdAgeingCheckbox(),
                        UserGroupEditSteps.checkAuthModeStatus('disabled'),
                        UserGroupEditSteps.checkPwdAgeingStatus('enabled'),
                        UserGroupEditSteps.checkNextButtonState('enabled'),
                        UserGroupEditSteps.clickNextButton(),
                        UserGroupEditSteps.checkSummaryMessage({
                            value: 0,
                            message: Dictionary.summaryStep.noUserUpdated,
                            icon: 'ebIcon_warningOrange'
                        }),
                        UserGroupEditSteps.checkNextButtonState('disabled')
                    ])
                    .run(done);
            });
        });
    });
});