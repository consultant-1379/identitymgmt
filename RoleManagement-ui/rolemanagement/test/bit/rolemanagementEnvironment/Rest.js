define([
    './rest/AvabilityCheck',
    './rest/GetRoles',
    './rest/DeleteRole',
    './rest/UiAccessControl'
], function (AvabilityCheck, GetRoles, DeleteRole, UiAccessControl) {

    return {
        Prerequisites: [
            AvabilityCheck.Default,
            GetRoles.Default,
            UiAccessControl.Default
        ],
        Default: [
            AvabilityCheck.Default,
            GetRoles.Default,
            UiAccessControl.Default
        ],
        AvabilityCheck: AvabilityCheck,
        GetRoles: GetRoles,
        DeleteRole: DeleteRole,
        UiAccessControl: UiAccessControl
    };

});
