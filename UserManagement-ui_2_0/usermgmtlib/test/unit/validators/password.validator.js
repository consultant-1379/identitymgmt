define([
    'jscore/ext/utils/base/underscore',
    'usermgmtlib/validators/password.validator',
    'usermgmtlib/Dictionary',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'usermgmtlib/model/PasswordPoliciesCollection'
], function(_, PasswordValidator, Dictionary, UserManagementService, responseHandler, PasswordPoliciesCollection) {
    'use strict';

    describe('PasswordValidator', function() {
        var server, collection, policiesValues, validationData;

        beforeEach(function() {
            server = sinon.fakeServer.create();
            collection = new PasswordPoliciesCollection();
            policiesValues = [{ "name": "maximumLength", "value": 32 },
                { "name": "minimumLength", "value": 8 },
                { "name": "minimumLowerCase", "value": 1 },
                { "name": "minimumUpperCase", "value": 1 },
                { "name": "minimumDigits", "value": 1 }
            ];
        });

        afterEach(function() {
            server.restore();
        });


        it('PasswordValidator should be defined', function() {
            expect(PasswordValidator).not.to.be.undefined;
        });

        describe('Check validation fail', function() {

            var validResponse;
            beforeEach(function() {
                validResponse = [
                    { "name": "maximumLength", "valid": true },
                    { "name": "minimumLength", "valid": true },
                    { "name": "minimumLowerCase", "valid": true },
                    { "name": "minimumDigits", "valid": true }
                ];
            });

            var pass = "passw0rdABC";
            var passConfirm = "passw0rdABC";
            var strictMode = true;
            var saveButton = false;

            var callbackResolve;


            it('Password dosn\'t contain upper case', function(done) {

                validResponse.push({ "name": "minimumUpperCase", "valid": false });

                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, { "Content-Type": "application/json" }, JSON.stringify(validResponse)]);
                server.respondWith("GET",
                    "/oss/idm/usermanagement/users/validationrules/password", [200, { "Content-Type": "application/json" },
                        JSON.stringify(policiesValues)
                    ]);
                server.autoRespond = true;

                var outputPromise = PasswordValidator.validate({
                    policiesCollection: collection,
                    password: pass,
                    passwordConfirm: passConfirm,
                    strictMode: strictMode,
                    saveButton: saveButton
                });

                callbackResolve = sinon.spy();
                var verify = outputPromise.then(callbackResolve);


                expect(verify).not.to.be.undefined;
                expect(verify).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(callbackResolve.callCount).to.equals(1);
                    expect(args).not.to.be.undefined;
                    expect(args).not.to.be.null;
                    expect(args.message).to.equal(Dictionary.validator.password.policies_must_fulfilled);
                    done();
                }).catch(done);

            });

            it('Confirmation password empty and submit', function(done) {

                validResponse.push({ "name": "minimumUpperCase", "valid": true });
                passConfirm = "";
                saveButton = true;

                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, { "Content-Type": "application/json" }, JSON.stringify(validResponse)]);

                server.respondWith("GET",
                    "/oss/idm/usermanagement/users/validationrules/password", [200, { "Content-Type": "application/json" },
                        JSON.stringify(policiesValues)
                    ]);
                server.autoRespond = true;

                var outputPromise = PasswordValidator.validate({
                    policiesCollection: collection,
                    password: pass,
                    passwordConfirm: passConfirm,
                    strictMode: strictMode,
                    saveButton: saveButton
                });
                callbackResolve = sinon.spy();
                var verify = outputPromise.then(callbackResolve);


                expect(verify).not.to.be.undefined;
                expect(verify).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(callbackResolve.callCount).to.equals(1);
                    expect(args).not.to.be.undefined;
                    expect(args).not.to.be.null;
                    expect(args.message).to.equal(Dictionary.validator.password.enter_pass_and_reppass);
                    done();
                }).catch(done);

            });

            it('Passwords are not match', function(done) {

                validResponse.push({ "name": "minimumUpperCase", "valid": true });
                passConfirm = passConfirm + "noMatch";

                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, { "Content-Type": "application/json" }, JSON.stringify(validResponse)]);

                server.respondWith("GET",
                    "/oss/idm/usermanagement/users/validationrules/password", [200, { "Content-Type": "application/json" },
                        JSON.stringify(policiesValues)
                    ]);
                server.autoRespond = true;


                var outputPromise = PasswordValidator.validate({
                    policiesCollection: collection,
                    password: pass,
                    passwordConfirm: passConfirm,
                    strictMode: strictMode,
                    saveButton: saveButton
                });

                callbackResolve = sinon.spy();
                var verify = outputPromise.then(callbackResolve);

                expect(verify).not.to.be.undefined;
                expect(verify).not.to.be.null;
                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(callbackResolve.callCount).to.equals(1);
                    expect(args).not.to.be.undefined;
                    expect(args).not.to.be.null;
                    expect(args.message).to.equal(Dictionary.validator.password.passwords_must_match);
                    done();
                }).catch(done);

            });

            it('Password empty and submit', function(done) {

                validResponse.push({ "name": "minimumUpperCase", "valid": true });
                pass = "";
                // passConfirm = "";
                saveButton = true;
                strictMode = false;

                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, { "Content-Type": "application/json" }, JSON.stringify(validResponse)]);

                server.respondWith("GET",
                    "/oss/idm/usermanagement/users/validationrules/password", [200, { "Content-Type": "application/json" },
                        JSON.stringify(policiesValues)
                    ]);
                server.autoRespond = true;


                var outputPromise = PasswordValidator.validate({
                    policiesCollection: collection,
                    password: pass,
                    passwordConfirm: passConfirm,
                    strictMode: strictMode,
                    saveButton: saveButton
                });

                callbackResolve = sinon.spy();
                var verify = outputPromise.then(callbackResolve);

                expect(verify).not.to.be.undefined;
                expect(verify).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(callbackResolve.callCount).to.equals(1);
                    expect(args).not.to.be.undefined;
                    expect(args).not.to.be.null;
                    expect(args.message).to.equal(Dictionary.validator.password.enter_password);
                    done();
                }).catch(done);

            });
        });

        describe('Password validation success', function() {

            var validResponse;

            beforeEach(function() {
                validResponse = [
                    { "name": "maximumLength", "valid": true },
                    { "name": "minimumLength", "valid": true },
                    { "name": "minimumLowerCase", "valid": true },
                    { "name": "minimumDigits", "valid": true },
                    { "name": "minimumUpperCase", "valid": true }
                ];
            });

            var pass = "passw0rdABC";
            var passConfirm = "passw0rdABC";
            var strictMode = true;
            var saveButton = false;

            var callbackResolve;

            it('Password validator success', function(done) {


                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, { "Content-Type": "application/json" }, JSON.stringify(validResponse)]);

                server.respondWith("GET",
                    "/oss/idm/usermanagement/users/validationrules/password", [200, { "Content-Type": "application/json" },
                        JSON.stringify(policiesValues)
                    ]);
                server.autoRespond = true;

                var outputPromise = PasswordValidator.validate({
                    policiesCollection: collection,
                    password: pass,
                    passwordConfirm: passConfirm,
                    strictMode: strictMode,
                    saveButton: saveButton
                });
                callbackResolve = sinon.spy();
                var verify = outputPromise.then(callbackResolve);


                expect(verify).not.to.be.undefined;
                expect(verify).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(callbackResolve.callCount).to.equals(1);
                    expect(args).to.be.undefined;
                    done();
                }).catch(done);

            });

            it('Password validator success (two validations)', function(done) {


                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [200, { "Content-Type": "application/json" }, JSON.stringify(validResponse)]);

                server.respondWith("GET",
                    "/oss/idm/usermanagement/users/validationrules/password", [200, { "Content-Type": "application/json" },
                        JSON.stringify(policiesValues)
                    ]);
                server.autoRespond = true;

                PasswordValidator.validate(pass, passConfirm, strictMode, saveButton);
                var outputPromise = PasswordValidator.validate({
                    policiesCollection: collection,
                    password: pass,
                    passwordConfirm: passConfirm,
                    strictMode: strictMode,
                    saveButton: saveButton
                });
                callbackResolve = sinon.spy();
                var verify = outputPromise.then(callbackResolve);

                expect(verify).not.to.be.undefined;
                expect(verify).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(callbackResolve.callCount).to.equals(1);
                    expect(args).to.be.undefined;
                    done();
                }).catch(done);

            });

        });


        describe('Check response 400', function() {


            var sandbox;

            beforeEach(function() {
                sandbox = sinon.sandbox.create();
            });

            afterEach(function() {
                sandbox.restore();
            });

            var pass = "passw0rdASD";
            var passConfirm = "passw0rdASD";
            var strictMode = true;
            var saveButton = false;

            var callbackResolve, callbackReject;

            it('Password validator - response 400', function(done) {

                sandbox.stub(responseHandler, 'setNotification');

                var validResponse = [{
                    "userMessage": "Wrong address attribute",
                    "httpStatusCode": 400,
                    "internalErrorCode": "1.32",
                    "developerMessage": "Wrong address attribute: /password",
                    "time": "2016-04-27T08:28:44",
                    "links": []
                }];

                server.respondWith("POST", "/oss/idm/usermanagement/users/validate/password", [400, { "Content-Type": "application/json" }, JSON.stringify(validResponse)]);
                server.respondWith("GET",
                    "/oss/idm/usermanagement/users/validationrules/password", [200, { "Content-Type": "application/json" },
                        JSON.stringify(policiesValues)
                    ]);
                server.autoRespond = true;
                var outputPromise = PasswordValidator.validate({
                    policiesCollection: collection,
                    password: pass,
                    passwordConfirm: passConfirm,
                    strictMode: strictMode,
                    saveButton: saveButton
                });
                callbackResolve = sinon.spy();
                callbackReject = sinon.spy();

                var verify = outputPromise.then(callbackResolve, callbackReject);

                verify.then(function() {
                    expect(callbackResolve.callCount).to.equals(0);
                    expect(callbackReject.callCount).to.equals(1);
                    done();
                }).catch(done);
            });
        });
    });
});
