define([
    '../data/User'
], function(User) {

    var generate = function(user) {

        return {
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users/admin_test',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(user)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(User)
    };
});