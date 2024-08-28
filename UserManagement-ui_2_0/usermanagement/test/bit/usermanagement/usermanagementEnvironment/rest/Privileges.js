define([
    'test/bit/lib/Rest',
    '../data/DefaultPrivileges',
    '../data/FederatedPrivileges',
    'test/bit/usermanagement/usermanagementEnvironment/data/UsersFilterRolesData'
], function(Rest, DefaultPrivileges, FederatedPrivileges, UsersFilterRolesData) {

    var generate = function(DefaultPrivileges) {

        return {
            url: '/oss/idm/usermanagement/privileges',
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

    var filterRoles = function(_data) {

        return Rest({
            url: '/oss/idm/usermanagement/privileges',
            httpStatus: 200,
            method: 'GET',
            data: _data
        });
    };


    return {
        Default: generate(DefaultPrivileges),
        Federated: generate(FederatedPrivileges),
        Filter: filterRoles(UsersFilterRolesData)
    };
});
