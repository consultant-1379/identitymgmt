define([
    'test/bit/lib/Rest'
], function(Rest) {

    var generate = function() {
        return {
            url: '/oss/uiaccesscontrol/resources/user_mgmt/actions',
            apply: function(server) {
                server.respondWith(
                    'GET',
                    '/oss/uiaccesscontrol/resources/user_mgmt/actions',
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

    var fail = function() {
        return {
            url: '/oss/uiaccesscontrol/resources/user_mgmt/actions',
            apply: function(server) {
                server.respondWith(
                    'GET',
                    '/oss/uiaccesscontrol/resources/user_mgmt/actions',
                    function(xhr) {
                        xhr.respond(
                            404, {
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
        Default: generate(),
        NotImplemented: fail()
    };
});
