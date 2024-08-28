define([
    'test/bit/usersgroupedit/Environment/rest/Users',
    'test/bit/usersgroupedit/Environment/rest/Authorize',
    'test/bit/usersgroupedit/Environment/rest/Privileges',
    'test/bit/usersgroupedit/Environment/rest/Roles'
], function(Users, Authorize, Privileges, Roles) {


    return {
        Default: [
            Authorize.Default,
            Users.Users10,
            Users.Update,
            Privileges.Default,
            Roles.Default
        ],
        NoChange: [
            Authorize.Default,
            Users.Users10Enabled,
            Users.Update,
            Privileges.Default
        ],
        Users10Mixed: [
            Authorize.Default,
            Users.Users10Mixed,
            Users.Update,
            Privileges.Default
        ],
        Failure: [
            Authorize.Default,
            Users.Users10,
            Users.Update,
            Users.UpdateFailureAdmin,
            Privileges.Default
        ]
    };
});
