define([
    'test/bit/lib/Rest',
    'test/bit/usersgroupedit/Environment/data/Applications'
], function(Rest, Applications) {

    var generate = function(_data) {
        return {
            apply: function(server) {
                server.respondWith(
                    'GET',
                    '/rest/apps',
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

    var failAuth = function() {

        return {
            apply: function(server) {
                server.respondWith(
                    'GET',
                    '/rest/apps',
                    function(xhr) {
                        xhr.respond(
                            401, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify({
                                httpStatusCode: 401
                            })
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(Applications),
        Failure: failAuth()
    };
});
