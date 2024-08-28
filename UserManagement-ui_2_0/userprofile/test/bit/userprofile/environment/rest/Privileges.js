define([
    '../data/Privileges'
], function(privileges) {

    var generate = function(privileges) {

        return {
            url: /\/oss\/idm\/usermanagement\/users\/administrator\/privileges.*/,
            apply: function(server) {
                server.respondWith(
                    'GET',
                    /\/oss\/idm\/usermanagement\/users\/administrator\/privileges.*/,
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(privileges.admin)
                        );
                    }.bind(this)
                );
            }
        };
    };

    var generateRegularUser = function(privileges) {

            return {
                url: /\/oss\/idm\/usermanagement\/users\/regular_user\/privileges.*/,
                apply: function(server) {
                    server.respondWith(
                        'GET',
                        /\/oss\/idm\/usermanagement\/users\/regular_user\/privileges.*/,
                        function(xhr) {
                            xhr.respond(
                                200, {
                                    'Content-Type': 'application/json'
                                },
                                JSON.stringify(privileges.regular_user)
                            );
                        }.bind(this)
                    );
                }
            };
        };

    var generateFederatedUser = function(privileges) {

            return {
                url: /\/oss\/idm\/usermanagement\/users\/federated_user\/privileges.*/,
                apply: function(server) {
                    server.respondWith(
                        'GET',
                        /\/oss\/idm\/usermanagement\/users\/federated_user\/privileges.*/,
                        function(xhr) {
                            xhr.respond(
                                200, {
                                    'Content-Type': 'application/json'
                                },
                                JSON.stringify(privileges.federated_user)
                            );
                        }.bind(this)
                    );
                }
            };
        };

    return {
        Default: generate(privileges),
        RegularUser: generateRegularUser(privileges),
        FederatedUser: generateFederatedUser(privileges)
    };
});