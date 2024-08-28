define([
    '../data/Privileges',
    '../data/AllRoles'
], function(Privileges, AllRoles) {

    var generate = function(privileges) {

        return {
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users/administrator/privileges',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(privileges)
                        );
                    }.bind(this)
                );
            }
        };
    };

    var generateForuser = function(privileges) {

        return {
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users/userToDuplicate/privileges',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(privileges)
                        );
                    }.bind(this)
                );
            }
        };
    };
    var roles = function(roles) {
        return {
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/rolemanagement/roles',
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

    return {
        Default: generate(Privileges),
        UserToDuplicate: generateForuser(Privileges),
        Roles: roles(AllRoles)
    };
});
