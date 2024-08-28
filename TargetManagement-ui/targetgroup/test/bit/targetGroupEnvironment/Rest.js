define([
    './rest/AvabilityCheck',
    './rest/CreateTargetGroup',
    './rest/EditTargetGroup',
    './rest/ViewTargetGroup'
], function (AvabilityCheck, CreateTargetGroup, EditTargetGroup, ViewTargetGroup) {
    return {
        Prerequisites: [
            AvabilityCheck.Default,
            CreateTargetGroup.Default
        ],
        Default: [
            AvabilityCheck.Default
        ],
        AvabilityCheck: AvabilityCheck,
        CreateTargetGroup: CreateTargetGroup,
        EditTargetGroup: EditTargetGroup,
        ViewTargetGroup: ViewTargetGroup
    };
});
