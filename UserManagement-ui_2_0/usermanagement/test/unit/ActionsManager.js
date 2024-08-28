define([
    'usermanagement/ActionsManager',
    'usermanagement/Dictionary',
], function(ActionsManager, Dictionary){
    'use strict';

    describe('ActionsManager', function(){
        var sandbox;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
        });

        afterEach(function(){
            sandbox.restore();
        });

        it('ActionsManager Should be defined', function(){
            expect(ActionsManager).not.to.be.undefined;
        });

        describe('getActions()', function(){
            var excludeDefaults,checkedRows, output;

            beforeEach(function() {
                checkedRows = 0;
                excludeDefaults = false;
            });

            it('0 user selected, excludeDefaults is false -> Actions: Create User Profile', function(){
                output = ActionsManager.getActions(checkedRows,excludeDefaults);
                expect(output).not.to.be.empty;
                expect(output[0][0]).to.equal((ActionsManager.getDefaultActions())[0][0]);
                expect(output[1][0]).to.equal((ActionsManager.getDefaultActions())[1][0]);
                expect(output[0][0].name).to.equal(Dictionary.createUserProfile);
                expect(output[1][0].name).to.equal(Dictionary.importUsers);
            });

            it('0 user selected, excludeDefaults is true -> Actions: delete/forcePasswordChange', function(){
                excludeDefaults = true;
                output = ActionsManager.getActions(checkedRows,excludeDefaults);
                expect(output).not.to.be.empty;
                expect(output[0][0].name).to.equal(Dictionary.createUserProfile);
                expect(output[1][0].name).to.equal(Dictionary.importUsers);
            });


            it('1 user selected, excludeDefaults is false and passwordResetFlag is false -> Actions: create/forcePasswordChange', function(){
                checkedRows = [ {"username" : 'administrator',
                                 "status" : 'enabled',
                                 "passwordResetFlag" : false}];
                               
                output = ActionsManager.getActions(checkedRows,excludeDefaults);
                expect(output).not.to.be.empty;
                //NOTE: if more buttons added the index of output will change
                //NOTE: be carefull for index becouse of separators - separators take one index in output array
                expect(output[0][0].name).to.equal(Dictionary.createUserProfile);
                expect(output[1][0].name).to.equal(Dictionary.importUsers);
                expect(output[2][0].name).to.equal(Dictionary.editProfile);
                expect(output[2][1].name).to.equal(Dictionary.editPassword);
                expect(output[2][2].name).to.equal(Dictionary.duplicate);
                expect(output[2][3].name).to.equal(Dictionary.delete);
                expect(output[3][0].name).to.equal(Dictionary.terminateSessions);
                expect(output[3][1].name).to.equal(Dictionary.revokeCertificate);
                expect(output[4][0].name).to.equal(Dictionary.disableUser);
                expect(output[5][0].name).to.equal(Dictionary.forcePasswordChange);
            });

            it('1 user selected, excludeDefaults is false, status is disabled and passwordResetFlag is false', function(){
                checkedRows = [ {"username" : 'administrator',
                                 "status" : 'disabled',
                                 "passwordResetFlag" : false}];

                output = ActionsManager.getActions(checkedRows,excludeDefaults);
                expect(output).not.to.be.empty;
                //NOTE: if more buttons added the index of output will change
                //NOTE: be carefull for index becouse of separators - separators take one index in output array
                expect(output[0][0].name).to.equal(Dictionary.createUserProfile);
                expect(output[1][0].name).to.equal(Dictionary.importUsers);
                expect(output[2][0].name).to.equal(Dictionary.editProfile);
                expect(output[2][1].name).to.equal(Dictionary.editPassword);
                expect(output[2][2].name).to.equal(Dictionary.duplicate);
                expect(output[2][3].name).to.equal(Dictionary.delete);
                expect(output[3][0].name).to.equal(Dictionary.terminateSessions);
                expect(output[3][1].name).to.equal(Dictionary.revokeCertificate);
                expect(output[4][0].name).to.equal(Dictionary.enableUser);
                expect(output[5][0].name).to.equal(Dictionary.forcePasswordChange);
            });

            it('1 user selected, excludeDefaults is false and passwordResetFlag is true -> Actions: create/forcePasswordChange', function(){
                checkedRows = [ {"username" : 'administrator',
                                 "status" : 'enabled',
                                 "passwordResetFlag" : true}];

                output = ActionsManager.getActions(checkedRows,excludeDefaults);
                expect(output).not.to.be.empty;
                //NOTE: if more buttons added the index of output will change
                //NOTE: be carefull for index becouse of separators - separators take one index in output array
                expect(output[0][0].name).to.equal(Dictionary.createUserProfile);
                expect(output[1][0].name).to.equal(Dictionary.importUsers);
                expect(output[2][0].name).to.equal(Dictionary.editProfile);
                expect(output[2][1].name).to.equal(Dictionary.editPassword);
                expect(output[2][2].name).to.equal(Dictionary.duplicate);
                expect(output[2][3].name).to.equal(Dictionary.delete);
                expect(output[3][0].name).to.equal(Dictionary.terminateSessions);
                expect(output[3][1].name).to.equal(Dictionary.revokeCertificate);
                expect(output[4][0].name).to.equal(Dictionary.disableUser);
                expect(output[5][0].name).to.equal(Dictionary.disablePasswordChange);
            });

            it('2 users selected, passwordResetFlag is mixed -> Actions: create/forcePasswordChange', function(){
                checkedRows = [ {"username" : 'administrator',
                                 "status" : 'enabled',
                                 "passwordResetFlag" : true}, 
                                 {"username" : 'administrator1',
                                 "status" : 'enabled',
                                 "passwordResetFlag" : false}];
                
                output = ActionsManager.getActions(checkedRows,undefined);
                expect(output).not.to.be.empty;
                expect(output[0][0].name).to.equal(Dictionary.editProfile);
                expect(output[0][1].name).to.equal(Dictionary.delete);
                expect(output[1][0].name).to.equal(Dictionary.terminateSessions);
                expect(output[2][0].name).to.equal(Dictionary.disableUser);
                expect(output[3][0].name).to.equal(Dictionary.forcePasswordChange);
                expect(output[3][1].name).to.equal(Dictionary.disablePasswordChange);
            });

            it('2 users selected, passwordResetFlag and status are mixed', function(){
                checkedRows = [ {"username" : 'administrator',
                                 "status" : 'enabled',
                                 "passwordResetFlag" : true},
                                 {"username" : 'administrator1',
                                 "status" : 'disabled',
                                 "passwordResetFlag" : false}];

                output = ActionsManager.getActions(checkedRows,undefined);
                expect(output).not.to.be.empty;
                expect(output[0][0].name).to.equal(Dictionary.editProfile);
                expect(output[0][1].name).to.equal(Dictionary.delete);
                expect(output[1][0].name).to.equal(Dictionary.terminateSessions);
                expect(output[2][0].name).to.equal(Dictionary.enableUser);
                expect(output[2][1].name).to.equal(Dictionary.disableUser);
                expect(output[3][0].name).to.equal(Dictionary.forcePasswordChange);
                expect(output[3][1].name).to.equal(Dictionary.disablePasswordChange);
            });

            it('1 user selected, excludeDefaults is true -> Actions: forcePasswordChange', function(){
                checkedRows = ['administrator'];
                excludeDefaults = true;
                output = ActionsManager.getActions(checkedRows,excludeDefaults);
                expect(output).not.to.be.empty;

                //NOTE: if more buttons added the index of output will change
                //NOTE: be carefull for index becouse of separators - separators take one index in output array
                // expect(output[2].name).to.equal(Dictionary.duplicate);
                expect(output[0][0].name).to.equal(Dictionary.editProfile);
                expect(output[0][1].name).to.equal(Dictionary.editPassword);
                expect(output[0][2].name).to.equal(Dictionary.duplicate);
                expect(output[0][3].name).to.equal(Dictionary.delete);
                expect(output[1][0].name).to.equal(Dictionary.terminateSessions);
                expect(output[1][1].name).to.equal(Dictionary.revokeCertificate);
                //expect(output[1][3].name).to.equal(Dictionary.forcePasswordChange);
            });

        });

        describe('getDefaultActions()', function(){

            it('should return actions -> create', function(){
                var output;
                output = ActionsManager.getDefaultActions();
                expect(output).not.to.be.empty;
                expect(output[0][0].name).to.equal(Dictionary.createUserProfile);
            });
        });

        describe('setRevokeCertificate()', function(){
            var selectedRows, output;


            it('Should set button disabled', function(){
                selectedRows = [{
                    username:'mockName',
                    status: 'Enabled',
                    name: 'mockname',
                    surname: 'mocksurname',
                    email: 'email@mail.com',
                    credentialStatus: 'ACTIVE'
                }];

                output = ActionsManager.getActions(selectedRows);
                expect(output[3][1].disabled).to.equal(false);

            });

            it('Should set button enabled', function(){
                selectedRows = [{
                    username:'mockName',
                    status: 'Enabled',
                    name: 'mockname',
                    surname: 'mocksurname',
                    email: 'email@mail.com',
                    credentialStatus: 'INACTIVE'
                }];

                output = ActionsManager.getActions(selectedRows);
                expect(output[3][1].disabled).to.equal(true);
            });
        });


    });



});
