define([
    '../data/EditProfile'
], function(EditProfile) {

    var generate = function(editProfile) {

        return {
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/editprofile',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(editProfile)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(EditProfile)
    };
});