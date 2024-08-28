define([
    '../data/UserSettings'
], function(Settings) {

    var generate = function(settings) {

        return {
            url: '/oss/idm/config/usersettings',
            apply: function(server) {
                server.respondWith(
                    'GET',
                    '/oss/idm/config/usersettings',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(settings)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(Settings[0]),
        RegularUser: generate(Settings[1]),
        FederatedUser: generate(Settings[1])
    };
});
