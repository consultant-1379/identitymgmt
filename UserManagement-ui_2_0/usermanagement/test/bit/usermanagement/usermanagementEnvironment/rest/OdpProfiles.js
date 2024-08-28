define([
    'test/bit/lib/Rest',
    '../data/OdpProfiles'
], function(Rest, OdpProfiles) {

    var generate = function(odpProfiles) {

        return {
            url: '/oss/idm/usermanagement/odpprofiles',
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/odpprofiles',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(odpProfiles)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(OdpProfiles),
        Empty: generate([])
    };
});
