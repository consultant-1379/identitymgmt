define([
    'test/bit/lib/Rest',
    '../data/DefaultPrivileges'
], function(Rest, DefaultPrivileges) {

    var generate = function(DefaultPrivileges) {

        return {

            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/privileges',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(DefaultPrivileges)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(DefaultPrivileges)
    };
});
