define([
    'test/bit/lib/Rest'
], function(Rest) {

    var generate = function(value) {
        return {
            url: '/oss/idm/usermanagement/enforceduserhardening',
            apply: function(server) {
                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/enforceduserhardening',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify({'enforcedUserHardening': value})
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(false),
        Enabled: generate(true)
    };
});
