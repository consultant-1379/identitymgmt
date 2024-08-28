define([
    'test/bit/lib/Rest',
    '../data/EnforcedUserPasswordFalse',
    '../data/EnforcedUserPasswordTrue',
], function(Rest, EnforcedUserPasswordFalse, EnforcedUserPasswordTrue) {

    var generate = function(_data) {
        return {
            apply: function(server) {
                server.respondWith(
                    'GET',
                    '/oss/idm/config/passwordsettings/enmuser/passwordageing',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(_data)
                        );
                    }.bind(this)
                );
            }
        };
    };


    return {
        Default: generate(EnforcedUserPasswordTrue),
        EnforcedUserPassword: generate(EnforcedUserPasswordFalse)
    };
});
