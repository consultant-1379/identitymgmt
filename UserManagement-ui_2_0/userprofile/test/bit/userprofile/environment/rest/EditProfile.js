define([
    '../data/EditProfile'
], function(EditProfile) {

    var generate = function(editProfile) {

        return {
            url: '/editprofile',
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
        Default: generate(EditProfile[0]),
        RegularUser: generate(EditProfile[1]),
        FederatedUser: generate(EditProfile[2])
    };
});