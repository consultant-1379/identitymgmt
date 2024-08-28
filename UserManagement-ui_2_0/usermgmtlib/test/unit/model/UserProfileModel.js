define([
    'usermgmtlib/model/UserProfileModel',
    'usermgmtlib/validators/username.validator',
    'usermgmtlib/validators/name.validator',
    'usermgmtlib/validators/surname.validator',
    'usermgmtlib/validators/email.validator',
    'usermgmtlib/validators/password.validator'
], function(UserProfileModel, usernameValidator, nameValidator, surnameValidator, emailValidator, passwordValidator) {
    'use strict';

    describe('UserProfileModel', function() {
        var sandbox, userProfileModel;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            userProfileModel = new UserProfileModel();
            sandbox.stub(userProfileModel, 'setAttribute');
            sandbox.stub(userProfileModel, 'trigger');
            //sandbox.stub(userProfileModel,'get');
        });
        afterEach(function() {
            sandbox.restore();
        });

        it('UserProfileModel should be defined', function() {
            expect(UserProfileModel).not.to.be.undefined;
        });

        it('toJSON method ', function() {
            var output = userProfileModel.toJSON();

            expect(output).not.to.be.undefined;
            expect(output).not.to.be.null;
            expect(output.privileges).not.to.be.undefined;
        });

        it('hasChanged method - dump and model are equals (not changed)', function() {
            sandbox.stub(userProfileModel, 'toJSON', function() {
                return { 
                    status: "enabled",
                    passwordResetFlag: null,
                    username: "test1",
                    name: "test1",
                    surname: "test1",
                    email: "test1@test.pl",
                    description: "test1",
                    passwordChangeTime: "20170303112613+0000",
                    maxSessionTime: null,
                    privileges: [
                        {
                            role: "SEC_ADMIN",
                            tgs: "All"
                        },
                        {
                            role: "Administrator",
                            tgs: "All"
                        }
                    ]
                };
            });

            sandbox.stub(userProfileModel, 'dump', 
                {
                    status: "enabled",
                    passwordResetFlag: null,
                    username: "test1",
                    name: "test1",
                    surname: "test1",
                    email: "test1@test.pl",
                    description: "test1",
                    passwordChangeTime: "20170303112613+0000",
                    maxSessionTime: null,
                    privileges: [
                        {
                            role: "Administrator",
                            tgs: "All"
                        },
                        {
                            role: "SEC_ADMIN",
                            tgs: "All"
                        }
                    ]
                }
            );
            var output = userProfileModel.hasChanged();
            expect(output).to.equals(false);
        });

        it('hasChanged method - dump and model are not equals (changed)', function() {
            sandbox.stub(userProfileModel, 'toJSON', function() {
                             return { status: "enabled",
                                      passwordResetFlag: null,
                                      username: "test1",
                                      name: "test1",
                                      surname: "test1",
                                      email: "test1@test.pl",
                                      description: "test1",
                                      passwordChangeTime: "20170303112613+0000",
                                      maxSessionTime: null,
                                      privileges: [
                                        {
                                            role: "SEC_ADMIN",
                                            tgs: "All"
                                        },
                                        {
                                            role: "Administrator",
                                            tgs: "All"
                                        }
                                      ]
                                    };
            });

            sandbox.stub(userProfileModel, 'dump',
                {
                    status: "enabled",
                    passwordResetFlag: null,
                    username: "test2",
                    name: "test2",
                    surname: "test2",
                    email: "test2@test.pl",
                    description: "test2",
                    passwordChangeTime: "20170303112613+0000",
                    maxSessionTime: null,
                    privileges: [
                        {
                            role: "Administrator",
                            tgs: "All"
                        },
                        {
                            role: "SEC_ADMIN",
                            tgs: "All"
                        }
                    ]
                }
           );
             var output = userProfileModel.hasChanged();
             expect(output).to.equals(true);
         });


        it('validate method', function(done) {

            userProfileModel.setTouched("name");
            userProfileModel.setEditable("name");
            userProfileModel.set('username', 'username');

            userProfileModel.setTouched("username");
            userProfileModel.setEditable("username");

            userProfileModel.setTouched("surname");
            userProfileModel.setEditable("surname");

            userProfileModel.setTouched("email");
            userProfileModel.setEditable("email");

            sandbox.stub(usernameValidator, 'validate', function() {
                return true;
            });
            sandbox.stub(nameValidator, 'validate', function() {
                return true;
            });
            sandbox.stub(surnameValidator, 'validate', function() {
                return true;
            });
            sandbox.stub(emailValidator, 'validate', function() {
                return true;
            });

            var callbackResolve = sinon.spy();
            var server = sinon.fakeServer.create();

            var outputPromise = userProfileModel.validate(true, true);
            var verify = outputPromise.then(callbackResolve);

            server.respond();

            expect(outputPromise).not.to.be.undefined;
            expect(outputPromise).not.to.be.null;

            verify.then(function() {
                var args = callbackResolve.getCall(0).args[0];
                expect(args.name).to.equals(true);
                expect(args.username).to.equals(true);
                expect(args.surname).to.equals(true);
                expect(args.email).to.equals(true);
                done();
            }).catch(done);

        });

        it('validate method - password', function(done) {

            userProfileModel.setTouched("name");
            userProfileModel.setEditable("name");
            userProfileModel.set('username', 'username');

            userProfileModel.setTouched("username");
            userProfileModel.setEditable("username");

            userProfileModel.setTouched("surname");
            userProfileModel.setEditable("surname");

            userProfileModel.setTouched("email");
            userProfileModel.setEditable("email");

            userProfileModel.setTouched("password");
            userProfileModel.setEditable("password");
            userProfileModel.set("password", "passw0rd123ASD");

            sandbox.stub(usernameValidator, 'validate', function() {
                return true;
            });
            sandbox.stub(nameValidator, 'validate', function() {
                return true;
            });
            sandbox.stub(surnameValidator, 'validate', function() {
                return true;
            });
            sandbox.stub(emailValidator, 'validate', function() {
                return true;
            });

            sandbox.stub(passwordValidator, 'validate', function(validationObject) {
                return new Promise(function(resolve, reject) {
                    resolve(validationObject);
                });
            });

            var callbackResolve = sinon.spy();
            var server = sinon.fakeServer.create();

            var outputPromise = userProfileModel.validate(true, true);
            var verify = outputPromise.then(callbackResolve);

            server.respond();

            expect(outputPromise).not.to.be.undefined;
            expect(outputPromise).not.to.be.null;

            verify.then(function() {
                var args = callbackResolve.getCall(0).args[0];
                expect(args.name).to.equals(true);
                expect(args.username).to.equals(true);
                expect(args.surname).to.equals(true);
                expect(args.email).to.equals(true);
                expect(args.password.password).to.equals("passw0rd123ASD");
                expect(args.passwordConfirm.password).to.equals("passw0rd123ASD");
                done();
            }).catch(done);

        });
    });
});