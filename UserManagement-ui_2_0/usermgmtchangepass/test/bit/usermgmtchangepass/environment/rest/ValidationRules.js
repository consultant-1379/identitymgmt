define([
    '../data/PasswordRules'
], function(PasswordRules) {

    var generate = function(passwordRules) {

        return {
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users/validationrules/password',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(passwordRules)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(PasswordRules)
    };
});