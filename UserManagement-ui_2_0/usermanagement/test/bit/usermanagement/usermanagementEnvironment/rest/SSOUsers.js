define([
     '../data/DefaultSSOUsers'
], function(DefaultSSOUsers) {

    var generate = function(users) {
        return {
            url: '/oss/sso/utilities/users',
            apply: function(server){
                server.respondWith(
                    'GET',
                    '/oss/sso/utilities/users',
                    function(xhr){
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
        Default: generate(DefaultSSOUsers)
    };
});