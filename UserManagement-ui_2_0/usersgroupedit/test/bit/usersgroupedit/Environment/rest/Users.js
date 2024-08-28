define([
    'test/bit/lib/Rest',
    '../data/DefaultUsers',
    '../data/GenericUsers',
    '../data/Users150',
    '../data/Users10Mixed'
], function(Rest, DefaultUsers, GenericUsers, Users150, Users10Mixed) {

    var generate = function(users) {
        return {
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users',
                    function(xhr) {
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

    var update = function() {
        return Rest({
            url: "/oss/idm/usermanagement/batchusermodify",
            httpStatus: 200,
            method: 'PUT',
            data: { data: "" }
        });

    }

    var UpdateFailureAdmin = function() {
        return Rest({
            url: "/oss/idm/usermanagement/batchusermodify",
            httpStatus: 404,
            method: 'PUT',
            data: { data: "" }
        });
    }

    return {
        Generate: function(numberOfUsers) {
            return generate(GenericUsers(numberOfUsers));
        },
        Default: generate(DefaultUsers),
        Users10: generate(GenericUsers(10)),
        Users10Mixed: generate(Users10Mixed),
        Users10Enabled: generate(GenericUsers(10, { status: 'disabled', description : 'description' })),
        Users21: generate(GenericUsers(21)),
        Users150: generate(Users150),
        Update: update(),
        UpdateFailureAdmin: UpdateFailureAdmin()
    };
});
