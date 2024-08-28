define([
    '../data/DefaultSls'
], function(DefaultSls) {

    var generate = function(data) {
        return {
            url: '/oss/sls/users',
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/sls/users',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(data)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(DefaultSls)
    };
});