define([
    '../data/DefaultTimeServer'
], function(DefaultTimeServer) {

    var generate = function(serverTime) {

        return {
            url: '/rest/system/time',
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/rest/system/time',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(serverTime)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(DefaultTimeServer)
    };
});