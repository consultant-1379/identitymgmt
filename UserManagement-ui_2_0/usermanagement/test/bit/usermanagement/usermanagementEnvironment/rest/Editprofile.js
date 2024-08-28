define([
    'test/bit/lib/Rest'
], function(Rest) {

    var generate = function() {
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
                            JSON.stringify([])
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate()
    };
});
