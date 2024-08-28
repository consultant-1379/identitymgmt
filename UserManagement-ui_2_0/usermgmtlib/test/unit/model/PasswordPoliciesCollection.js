define([
    'usermgmtlib/model/PasswordPoliciesCollection',
    'usermgmtlib/model/PasswordPoliciesModel',
    'identitymgmtlib/mvp/Collection',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/Dictionary'
], function(PasswordPoliciesCollection, PasswordPoliciesModel, Collection, UserManagementService, Dictionary) {
    'use strict';

    describe('PasswordPoliciesCollection', function() {
        var passwordPoliciesCollection, sandbox, server;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            server = sinon.fakeServer.create();
            passwordPoliciesCollection = new PasswordPoliciesCollection();
            server.autoRespond = true;
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('PasswordPoliciesCollection should be defined', function() {
            expect(PasswordPoliciesCollection).not.to.be.undefined;
            expect(PasswordPoliciesCollection).not.to.be.null;
        });

        describe('clearTicks()', function() {
            it('Should clear policy and data of collection ', function() {

                passwordPoliciesCollection.first = true;
                passwordPoliciesCollection.lastPassword = 'testPassw0rd';
                passwordPoliciesCollection.lastConfirmPassword = 'testPassw0rd';

                passwordPoliciesCollection.clearTicks();

                expect(passwordPoliciesCollection.first).to.equal(false);
                expect(passwordPoliciesCollection.lastPassword).to.equal("");
                expect(passwordPoliciesCollection.lastConfirmPassword).to.equal("");

            });
        });

        describe('Validate', function(done) {
            var data, validationResult;

            beforeEach(function() {

                sandbox.stub(passwordPoliciesCollection, 'fetch', function() {
                    return new Promise(function(resolve, reject) {
                        resolve();
                    });
                });
                sandbox.spy(UserManagementService, 'getPasswordValidationResult');

            });

            it('Should validate password without any message', function(done) {
                data = {
                    username: 'MockUsername',
                    name: 'MockName',
                    surname: 'MockSurname',
                    password: 'TestPassw0rd',
                    passwordConfirm: 'TestPassw0rd'
                };

                var policiesValues = [{
                    "name": "maximumLength",
                    "value": 32
                }, {
                    "name": "minimumLength",
                    "value": 8
                }, {
                    "name": "minimumLowerCase",
                    "value": 1
                }, {
                    "name": "minimumUpperCase",
                    "value": 1
                }, {
                    "name": "minimumDigits",
                    "value": 1
                }];

                var policiesValid = [{
                    "name": "maximumLength",
                    "valid": true
                }, {
                    "name": "minimumLength",
                    "valid": true
                }, {
                    "name": "minimumLowerCase",
                    "valid": true
                }, {
                    "name": "minimumUpperCase",
                    "valid": true
                }, {
                    "name": "minimumDigits",
                    "valid": true
                }];

                server.respondWith("GET", "/oss/idm/usermanagement/users/validationrules/password", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(policiesValues)]);

                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(policiesValid)]);

                var passwordPoliciesCollection = new PasswordPoliciesCollection();

                var callbackResolve = sinon.spy();

                validationResult = passwordPoliciesCollection.validate(data);
                var verify = validationResult.then(callbackResolve);

                expect(validationResult).not.to.be.undefined;
                expect(validationResult).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(args).to.be.undefined;
                    expect(UserManagementService.getPasswordValidationResult.callCount).to.equal(1);

                    done();
                }).catch(done);
            });

            it('When password is not equal to password confirmation should return proper message',function(done){
                data = {
                    username: 'MockUsername',
                    name: 'MockName',
                    surname: 'MockSurname',
                    password: 'TestPassw0rdTest',
                    passwordConfirm: 'TestPassw0rd'
                };

                var policiesValues = [{
                    "name": "maximumLength",
                    "value": 32
                }, {
                    "name": "minimumLength",
                    "value": 8
                }, {
                    "name": "minimumLowerCase",
                    "value": 1
                }, {
                    "name": "minimumUpperCase",
                    "value": 1
                }, {
                    "name": "minimumDigits",
                    "value": 1
                }];

                var policiesValid = [{
                    "name": "maximumLength",
                    "valid": true
                }, {
                    "name": "minimumLength",
                    "valid": true
                }, {
                    "name": "minimumLowerCase",
                    "valid": true
                }, {
                    "name": "minimumUpperCase",
                    "valid": true
                }, {
                    "name": "minimumDigits",
                    "valid": true
                }];

                server.respondWith("GET", "/oss/idm/usermanagement/users/validationrules/password", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(policiesValues)]);

                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(policiesValid)]);

                var passwordPoliciesCollection = new PasswordPoliciesCollection();

                var callbackResolve = sinon.spy();

                validationResult = passwordPoliciesCollection.validate(data);
                var verify = validationResult.then(callbackResolve);

                expect(validationResult).not.to.be.undefined;
                expect(validationResult).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(args.message).to.equal(Dictionary.validator.password.passwords_must_match);
                    expect(UserManagementService.getPasswordValidationResult.callCount).to.equal(1);

                    done();
                }).catch(done);

            });

            it('When password or password confirmation is empty should return proper message', function(done){
                data = {
                    username: 'MockUsername',
                    name: 'MockName',
                    surname: 'MockSurname',
                    password: '',
                    passwordConfirm: 'TestPassw0rd',
                    strictMode: true
                };

                var policiesValues = [{
                    "name": "maximumLength",
                    "value": 32
                }, {
                    "name": "minimumLength",
                    "value": 8
                }, {
                    "name": "minimumLowerCase",
                    "value": 1
                }, {
                    "name": "minimumUpperCase",
                    "value": 1
                }, {
                    "name": "minimumDigits",
                    "value": 1
                }];

                var policiesValid = [{
                    "name": "maximumLength",
                    "valid": true
                }, {
                    "name": "minimumLength",
                    "valid": true
                }, {
                    "name": "minimumLowerCase",
                    "valid": true
                }, {
                    "name": "minimumUpperCase",
                    "valid": true
                }, {
                    "name": "minimumDigits",
                    "valid": true
                }];

                server.respondWith("GET", "/oss/idm/usermanagement/users/validationrules/password", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(policiesValues)]);

                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(policiesValid)]);

                var passwordPoliciesCollection = new PasswordPoliciesCollection();

                var callbackResolve = sinon.spy();

                validationResult = passwordPoliciesCollection.validate(data);
                var verify = validationResult.then(callbackResolve);

                expect(validationResult).not.to.be.undefined;
                expect(validationResult).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(args.message).to.equal(Dictionary.validator.password.enter_pass_and_reppass);
                    expect(UserManagementService.getPasswordValidationResult.callCount).to.equal(1);

                    done();
                }).catch(done);
            });

            it('When password is empty but password confirmation is not, should return proper message', function(done){

                data = {
                    username: 'MockUsername',
                    name: 'MockName',
                    surname: 'MockSurname',
                    password: '',
                    passwordConfirm: 'TestPassw0rd',
                    strictMode: false
                };

                var policiesValues = [{
                    "name": "maximumLength",
                    "value": 32
                }, {
                    "name": "minimumLength",
                    "value": 8
                }, {
                    "name": "minimumLowerCase",
                    "value": 1
                }, {
                    "name": "minimumUpperCase",
                    "value": 1
                }, {
                    "name": "minimumDigits",
                    "value": 1
                }];

                var policiesValid = [{
                    "name": "maximumLength",
                    "valid": true
                }, {
                    "name": "minimumLength",
                    "valid": true
                }, {
                    "name": "minimumLowerCase",
                    "valid": true
                }, {
                    "name": "minimumUpperCase",
                    "valid": true
                }, {
                    "name": "minimumDigits",
                    "valid": true
                }];

                server.respondWith("GET", "/oss/idm/usermanagement/users/validationrules/password", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(policiesValues)]);

                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(policiesValid)]);


                var passwordPoliciesCollection = new PasswordPoliciesCollection();


                var callbackResolve = sinon.spy();


                validationResult = passwordPoliciesCollection.validate(data);
                var verify = validationResult.then(callbackResolve);


                expect(validationResult).not.to.be.undefined;
                expect(validationResult).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(args.message).to.equal(Dictionary.validator.password.enter_password);
                    expect(UserManagementService.getPasswordValidationResult.callCount).to.equal(1);
                    done();
                }).catch(done);
            });

            it('Should return proper message, when any policy is not valid', function(done){

                data = {
                    username: 'UserMock1',
                    name: '',
                    surname: '',
                    password: 'UserMock1',
                    passwordConfirm: 'UserMock1',
                    strictMode: false,

                };

                var policiesValues = [{
                    "name": "maximumLength",
                    "value": 32
                }, {
                    "name": "minimumLength",
                    "value": 8
                }, {
                    "name": "minimumLowerCase",
                    "value": 1
                }, {
                    "name": "minimumUpperCase",
                    "value": 1
                }, {
                    "name": "minimumDigits",
                    "value": 1
                }];

                var policiesValid = [{
                    "name": "maximumLength",
                    "valid": true
                }, {
                    "name": "minimumLength",
                    "valid": false
                }, {
                    "name": "minimumLowerCase",
                    "valid": false
                }, {
                    "name": "minimumUpperCase",
                    "valid": false
                }, {
                    "name": "minimumDigits",
                    "valid": false
                }];

                server.respondWith("GET", "/oss/idm/usermanagement/users/validationrules/password", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(policiesValues)]);

                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(policiesValid)]);


                var passwordPoliciesCollection = new PasswordPoliciesCollection();


                var callbackResolve = sinon.spy();


                validationResult = passwordPoliciesCollection.validate(data);
                var verify = validationResult.then(callbackResolve);


                expect(validationResult).not.to.be.undefined;
                expect(validationResult).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(args.message).to.equal(Dictionary.validator.password.policies_must_fulfilled);
                    expect(UserManagementService.getPasswordValidationResult.callCount).to.equal(1);
                    done();
                }).catch(done);
            });
        });


    });
});
