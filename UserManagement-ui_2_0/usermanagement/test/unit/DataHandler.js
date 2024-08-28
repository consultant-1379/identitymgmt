define([
    'jscore/core',
    'usermgmtlib/DataHandler',
    'i18n!identitymgmtlib/common.json'
], function(core, DataHandler, Dictionary) {
    'use strict';

    describe('DataHandler', function() {
        var sandbox, dataHandler, server, user_Administrator, user_Admin, user_SomeUser;
        beforeEach(function() {

            sandbox = sinon.sandbox.create();

            dataHandler = new DataHandler();

            server = sandbox.useFakeServer();

            user_Administrator = {
                username: "administrator",
                password: "********",
                status: "enabled",
                statusColumn: "Enabled",
                name: "security",
                surname: "admin",
                email: "security@administrator.com",
                previousLogin: null,
                lastLogin: "20160127122532+0000",
                failedLogins: 0,
                passwordChangeTime: "20160127122532+0000",
                passwordAgeing: null,
                passwordAgeingColumn: "System Settings",
                credentialStatus: "ACTIVE",
                expirationData: {
                    passwordAgeing: null,
                    passwordChangeTime: "20160127122532+0000"
                }
            };
            user_Admin = {
                username: "admin",
                password: "********",
                status: "enabled",
                statusColumn: "Enabled",
                name: "security",
                surname: "admin",
                email: "security@administrator.com",
                previousLogin: null,
                lastLogin: "20160827122532+0000",
                failedLogins: 0,
                passwordChangeTime: "20160827122532+0000",
                passwordAgeing: null,
                passwordAgeingColumn: "System Settings",
                credentialStatus: "",
                expirationData: {
                    passwordAgeing: null,
                    passwordChangeTime: "20160827122532+0000"
                }
            };
            user_SomeUser = {
                username: "someUser",
                password: "********",
                status: "enabled",
                statusColumn: "Enabled",
                name: "security",
                surname: "admin",
                email: "security@administrator.com",
                previousLogin: null,
                lastLogin: "20160127122532+0000",
                failedLogins: 0,
                passwordChangeTime: "20160127122532+0000",
                passwordAgeing: null,
                passwordAgeingColumn: "System Settings",
                credentialStatus: "",
                expirationData: {
                    passwordAgeing: null,
                    passwordChangeTime: "20160127122532+0000"
                }
            };

            server.respondWith('GET', /\/oss\/idm\/usermanagement\/users(.*)/, [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify([user_Administrator, user_Admin, user_SomeUser])
            ]);

            server.respondWith('GET', '/oss/sls/users', [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify([{
                    user: 'administrator',
                    status: 'ACTIVE'
                }])
            ]);

            server.respondWith('GET', '/oss/idm/config/passwordsettings/enmuser/passwordageing', [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify({
                    "enabled":true,
                    "pwdMaxAge":60,
                    "pwdExpireWarning":5,
                    "graceLoginCount":3
                })
            ]);

// TODO: Aggiungere GET ODP Profiles
//            server.respondWith('GET', '/oss/idm/config/passwordsettings/enmuser/passwordageing', [200, {
//                    'Content-Type': 'application/json'
//                },
//                JSON.stringify({
//                    "enabled":true,
//                    "pwdMaxAge":60,
//                    "pwdExpireWarning":5,
//                    "graceLoginCount":3
//                })
//            ]);

            server.respondWith('GET', '/rest/system/time', [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify({
                    "timestamp":1472555977423,
                    "utcOffset": 1,
                    "timezone": "IST",
                    "serverLocation": "Europe/Dublin"
                })
            ]);

            server.respondWith('GET', '/oss/idm/usermanagement/privileges', [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify([{
                    "user": "administrator",
                    "role": "roleA",
                    "targetGroup": "tg1"
                }, {
                    "user": "admin",
                    "role": "roleB",
                    "targetGroup": "tg1"
                }, {
                    "user": "someUser",
                    "role": "roleB",
                    "targetGroup": "tg1"
                }])
            ]);


            server.respondWith('GET', '/oss/sso/utilities/users', [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify({
                    "users": {
                        "administrator": 4
                    }
                })
            ]);

            server.autoRespond = true;
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('DataHandler should be defined', function() {
            expect(DataHandler).not.to.be.undefined;
        });

        describe('fetchData() - regular flow', function() {

            it('Empty query', function(done) {
                dataHandler.getData({}).then(function(data) {
                    expect(data[0].username).to.equal("administrator");
                    expect(data[1].username).to.equal("admin");
                    expect(data[2].username).to.equal("someUser");
                    done();
                }).catch(done);
            });

            it('Query with filters', function(done) {
                dataHandler.getData({
                    filter: {
                        username: "administrator"
                    }
                }).then(function(data) {
                    expect(data[0].username).to.equal("administrator");
                    expect(data[1]).to.equal(undefined);
                    expect(data[2]).to.equal(undefined);
                    done();
                }).catch(done);
            });

            it('Query with asecnding username sort', function(done) {
                dataHandler.getData({
                    sort: {
                        order: "asc",
                        attribute: "username"
                    }
                }).then(function(data) {
                    expect(data[0].username).to.equal("admin");
                    expect(data[1].username).to.equal("administrator");
                    expect(data[2].username).to.equal("someUser");
                    done();
                }).catch(done);
            });

            it('Query with descending username sort', function(done) {
                dataHandler.getData({
                    sort: {
                        order: "desc",
                        attribute: "username"
                    }
                }).then(function(data) {
                    expect(data[0].username).to.equal("someUser");
                    expect(data[1].username).to.equal("administrator");
                    expect(data[2].username).to.equal("admin");
                    done();
                }).catch(done);
            });

            it('Query with filter and sort ascending', function(done) {
                dataHandler.getData({
                    sort: {
                        order: "asc",
                        attribute: "username"
                    },
                    filter: {
                        username: "admin"
                    }
                }).then(function(data) {
                    expect(data[0].username).to.equal("admin");
                    expect(data[1].username).to.equal("administrator");
                    done();
                }).catch(done);
            });

            // it('Query with force set to true', function(done) {
            //     dataHandler.getData({
            //         force: true
            //     }).then(function(data) {
            //         expect(data[0].username).to.equal("administrator");
            //         done();
            //     }).catch(done);
            // });

        });

        describe('fetchData() - with extra features (force data load or addtional filters which needs to fetch more data)', function() {

            it('Query with filters for roles - 1 result', function(done) {
                dataHandler.getData({
                    filter: {
                        roles: ["roleA"]
                    }
                }).then(function(data) {
                    expect(data[0].username).to.equal(user_Administrator.username);
                    expect(data[0]).to.deep.equal({
                        username: user_Administrator.username,
                        password: user_Administrator.password,
                        status: user_Administrator.status,
                        statusColumn: user_Administrator.statusColumn,
                        name: user_Administrator.name,
                        surname: user_Administrator.surname,
                        email: user_Administrator.email,
                        previousLogin: user_Administrator.previousLogin,
                        lastLogin: user_Administrator.lastLogin,
                        failedLogins: user_Administrator.failedLogins,
                        passwordChangeTime: user_Administrator.passwordChangeTime,
                        passwordAgeing: null,
                        passwordAgeingColumn: user_Administrator.passwordAgeingColumn,
                        roles: ['roleA'],
                        credentialStatus: "ACTIVE",
                        expirationData: {
                            passwordAgeing: null,
                            passwordChangeTime: user_Administrator.passwordChangeTime
                        }
                    });
                    done();
                }).catch(done);
            });

            it('Query with filters for roles - 2 results', function(done) {
                dataHandler.getData({
                    filter: {
                        roles: ["roleB"]
                    }
                }).then(function(data) {
                    expect(data[0].username).to.equal(user_Admin.username);
                    expect(data[0]).to.deep.equal({
                        username: user_Admin.username,
                        password: user_Admin.password,
                        status: user_Admin.status,
                        statusColumn: user_Admin.statusColumn,
                        name: user_Admin.name,
                        surname: user_Admin.surname,
                        email: user_Admin.email,
                        previousLogin: user_Admin.previousLogin,
                        lastLogin: user_Admin.lastLogin,
                        failedLogins: user_Admin.failedLogins,
                        passwordChangeTime: user_Admin.passwordChangeTime,
                        passwordAgeing: null,
                        passwordAgeingColumn: user_Admin.passwordAgeingColumn,
                        roles: ['roleB'],
                        credentialStatus: Dictionary.filters.credentialStatus.names.not_applicable,
                        expirationData: {
                            passwordAgeing: null,
                            passwordChangeTime: user_Admin.passwordChangeTime
                        }
                    });

                    expect(data[1].username).to.equal(user_SomeUser.username);
                    expect(data[1]).to.deep.equal({
                        username: user_SomeUser.username,
                        password: user_SomeUser.password,
                        status: user_SomeUser.status,
                        statusColumn: user_SomeUser.statusColumn,
                        name: user_SomeUser.name,
                        surname: user_SomeUser.surname,
                        email: user_SomeUser.email,
                        previousLogin: user_SomeUser.previousLogin,
                        lastLogin: user_SomeUser.lastLogin,
                        failedLogins: user_SomeUser.failedLogins,
                        passwordChangeTime: user_SomeUser.passwordChangeTime,
                        passwordAgeing: null,
                        passwordAgeingColumn: user_SomeUser.passwordAgeingColumn,
                        roles: ['roleB'],
                        credentialStatus: Dictionary.filters.credentialStatus.names.not_applicable,
                        expirationData: {
                            passwordAgeing: null,
                            passwordChangeTime: user_SomeUser.passwordChangeTime
                        }
                    });
                    done();
                }).catch(done);
            });

            it('Query with filters for sessions', function(done) {
                dataHandler.getData({
                    filter: {
                        currentlyLoggedIn: "true"
                    }
                }).then(function(data) {
                    expect(data[0].username).to.equal("administrator");
                    expect(data[0]).to.deep.equal({
                        username: user_Administrator.username,
                        password: user_Administrator.password,
                        status: user_Administrator.status,
                        statusColumn: user_Administrator.statusColumn,
                        name: user_Administrator.name,
                        surname: user_Administrator.surname,
                        email: user_Administrator.email,
                        previousLogin: user_Administrator.previousLogin,
                        lastLogin: user_Administrator.lastLogin,
                        failedLogins: user_Administrator.failedLogins,
                        passwordChangeTime: user_Administrator.passwordChangeTime,
                        passwordAgeing: null,
                        passwordAgeingColumn: user_Administrator.passwordAgeingColumn,
                        credentialStatus: "ACTIVE",
                        expirationData: {
                            passwordAgeing: null,
                            passwordChangeTime: user_SomeUser.passwordChangeTime
                        },
                        currentlyLoggedIn: "true",
                        numberOfSessions: 4
                    });
                    done();
                }).catch(done);
            });


            // it('Query with force set to true', function(done) {
            //     dataHandler.getData({
            //         force: true,
            //         filter: {
            //             roles: ["ADMINISTRATOR"]
            //         }
            //     }).then(function(data) {
            //         expect(data[0].username).to.equal("administrator");
            //         done();
            //     }).catch(done);
            // });
        });
    });
});
