define([
    "../data/DefaultPasswordAgeing"
], function(UsersPwdAge){

    var generate = function(users) {
        return {
            url: '/oss/idm/config/passwordsettings/enmuser/passwordageing',
            apply: function(server) {
                server.respondWith(
                    'GET',
                    '/oss/idm/config/passwordsettings/enmuser/passwordageing',
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

    return {
        Default: generate(UsersPwdAge)
    };
});