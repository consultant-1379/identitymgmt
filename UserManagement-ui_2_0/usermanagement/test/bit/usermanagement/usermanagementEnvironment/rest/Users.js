define([
    'test/bit/lib/Rest',
    '../data/DefaultUsers',
    '../data/GenericUsers',
    '../data/Users150',
    '../data/UsersFederated',
    '../data/UsersAuthModeMixed',
    '../data/UsersFilterData',
    '../data/FederatedUsersFilterData',
    '../data/UserForSort'
], function(Rest, DefaultUsers, GenericUsers, Users150, UsersFederated, UsersAuthModeMixed, UsersFilterData, FederatedUsersFilterData, UserForSort) {

    var generate = function(users) {

        return {
            url: /\/oss\/idm\/usermanagement\/users(.*)/,
            apply: function(server) {

                server.respondWith(
                    'GET',
                    /\/oss\/idm\/usermanagement\/users(.*)/,
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(users)
                        );
                    }.bind(this)
                );
            }
        };
    };
    var terminateSessions = function() {
        return Rest({
            url: /^\/oss\/sso\/utilities\/users\/.+$/,
            httpStatus: 204,
            method: 'DELETE',
            data: { data: "" }
        });
    };

    var forceChangePassword = function() {

        return {
            url: /\/oss\/idm\/usermanagement\/users((?!\/administrator\/).)*\/forcepasswordchange/,
            apply: function(server) {

                server.respondWith(
                    'PUT',
                    /\/oss\/idm\/usermanagement\/users((?!\/administrator\/).)*\/forcepasswordchange/,
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify('')
                        );
                    }.bind(this)
                );
            }
        };
    };

    var forceChangePasswordAdmin = function() {
        return Rest({
            url: /^\/oss\/idm\/usermanagement\/users\/administrator\/forcepasswordchange$/,
            httpStatus: 412,
            method: 'PUT',
            data: {
                httpStatusCode: 412,
                internalErrorCode: "UIDM-11-4",
                rowValue: 'administrator'
            }
        });
    };


    var sessions = function() {
        return {
            url: '/oss/sso/utilities/users',
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/sso/utilities/users',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify({ "users": { "administrator": 1, } })
                        );
                    }.bind(this)
                );
            }
        };
    };
    var userRoles = function(user) {
        var adminRoles = [{
            "user": "administrator",
            "role": "ADMINISTRATOR",
            "targetGroup": "ALL"
        }, {
            "user": "administrator",
            "role": "SECURITY_ADMIN",
            "targetGroup": "ALL"
        }];
        var securityuserRoles = [{
            "user": "administrator",
            "role": "SECURITY_ADMIN",
            "targetGroup": "ALL"
        }];
        var roles = user === 'administrator' ? adminRoles : securityuserRoles;
        return {
            url: '/oss/idm/usermanagement/users/' + user + '/privileges',
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users/' + user + '/privileges',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(roles)
                        );
                    }.bind(this)
                );
            }
        };

    };

    var userRolesWithTG = function(user) {
        var adminRoles = [{
            "user": "administrator",
            "role": "ADMINISTRATOR",
            "targetGroup": "ALL"
        }, {
            "user": "administrator",
            "role": "SECURITY_ADMIN",
            "targetGroup": "TG1"
        }, {
            "user": "administrator",
            "role": "com_role_tg1",
            "targetGroup": "TG1"
        }, {
            "user": "administrator",
            "role": "com_role_tg2",
            "targetGroup": "NONE"
        }, {
            "user": "administrator",
            "role": "com_role_tg2",
            "targetGroup": "TG2"
        }, {
            "user": "administrator",
            "role": "com_role_none",
            "targetGroup": "NONE"
        }, {
            "user": "administrator",
            "role": "task_profile_none",
            "targetGroup": "NONE"
        }, {
            "user": "administrator",
            "role": "task_profile_all",
            "targetGroup": "ALL"
        }, {
            "user": "administrator",
            "role": "task_profile_tg1",
            "targetGroup": "TG1"
        }
        ];

        return {
            url: '/oss/idm/usermanagement/users/' + user + '/privileges',
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users/' + user + '/privileges',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(adminRoles)
                        );
                    }.bind(this)
                );
            }
        };

    };

    var userSecurityuser = function() {
        return {
            url: '/oss/idm/usermanagement/users/securityuser',
            apply: function(server) {
                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users/securityuser',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify({
                                "username": "securityuser",
                                "password": "********",
                                "status": "enabled",
                                "name": "security",
                                "surname": "admin",
                                "description": "any text",
                                "authMode": "local",
                                "email": "security@securityuser.com",
                                "previousLogin": "20160531164731+0000",
                                "lastLogin": "20160531171028+0000",
                                'failedLogins': 0,
                                "passwordResetFlag": null,
                                "privileges": []
                            })
                        );
                    }.bind(this)
                );
            }
        };

    };

    var userAdmin = function() {
        return {
            url: '/oss/idm/usermanagement/users/administrator',
            apply: function(server) {
                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users/administrator',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify({
                                "username": "administrator",
                                "password": "********",
                                "status": "enabled",
                                "name": "security",
                                "surname": "admin",
                                "description": "any text",
                                "authMode": "local",
                                "email": "security@administrator.com",
                                "previousLogin": "20160531164731+0000",
                                "lastLogin": "20160531171028+0000",
                                'failedLogins': 0,
                                "passwordResetFlag": null,
                                "privileges": []
                            })
                        );
                    }.bind(this)
                );
            }
        };

    };

    var checkStatus = function() {
        return {
            url: '/oss/idm/usermanagement/checkStatus',
            apply: function(server) {
                server.respondWith(
                    'POST',
                    '/oss/idm/usermanagement/checkStatus',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify([])
                        );
                    }.bind(this)
                );
            }
        }
    }


    return {
        Generate: function(numberOfUsers) {
            return generate(GenericUsers(numberOfUsers));
        },
        Default: generate(DefaultUsers),
        Users10: generate(GenericUsers(10)),
        Users21: generate(GenericUsers(21)),
        Users150: generate(Users150),
        UsersAuthModeMixed: generate(UsersAuthModeMixed),
        UsersFederated: generate(UsersFederated),
        UsersFilterTestData: generate(UsersFilterData),
        FederatedUsersFilterTestData: generate(FederatedUsersFilterData),
        TerminateSessions: terminateSessions(),
        ForceChangePassword: forceChangePassword(),
        ForceChangePasswordAdmin: forceChangePasswordAdmin(),
        Sessions: sessions(),
        UserRolesAdmin: userRoles('administrator'),
        UserRolesAdminWithTG: userRolesWithTG('administrator'),
        UserRolesOther: userRoles('securityuser'),
        UserAdmin: userAdmin(),
        UserSecurityuser: userSecurityuser(),
        UserSort: generate(UserForSort),
        CheckStatus: checkStatus
    };
});
