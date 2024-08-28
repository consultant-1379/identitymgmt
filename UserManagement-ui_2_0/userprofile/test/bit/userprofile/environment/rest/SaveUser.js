define([
    '../data/User'
], function(User) {

    var generate = function(user) {

        return {
            url:  '/oss/idm/usermanagement/users/' + user.username,
            apply: function(server) {

                server.respondWith(
                    'PUT',
                    '/oss/idm/usermanagement/users/' + user.username,
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
        Default: generate(User[0]),
        RegularUser: generate(User[1])
    };
});
