define([
], function(){

    var generate = function(user) {
        return {
            url: '/oss/sls/credentials/users/'+user+'/nodetypes',
            apply: function(server) {
                server.respondWith(
                    'DELETE',
                    '/oss/sls/credentials/users/'+user+'/nodetypes',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify('')
                        );
                    }.bind(this)

                );
            }
        };
    };

    return {
        Default: generate('securityadminuser')

    };
});