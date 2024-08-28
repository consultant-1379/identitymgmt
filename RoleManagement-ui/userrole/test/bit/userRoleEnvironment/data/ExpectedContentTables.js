define([
    './GetUseCasesDefaultData'
], function(GetUseCasesDefaultData) {
    "use strict";

    var rolesForCreateCustomRole = [{
        'columns': ['',
            'SystemAdministrator',
            'COM Role',
            'Provides full control over Managed Element model fragments related to System Functions, Equipment and Transport, excluding the fragment related to Security Management'
        ]
    }, {
        'columns': ['',
            'SystemSecurityAdministrator',
            'COM Role', 'Provides full control over the fragment of a Managed Element model related to Security Management'
        ]
    }, {
        'columns': ['',
            'SystemReadOnly', 'COM Role',
            'Provides read-only access to Managed Element model fragments related to System Functions as well as Equipment and Transport, but excluding the fragments related to Security Management'
        ]
    }, {
        'columns': ['',
            'ENodeB_Application_Administrator',
            'COM Role', 'Provides full control over ENodeB specific fragments of Managed Element model, including TN, FM, LM, PM, Log and parts of equipment'
        ]
    }, {
        'columns': ['',
            'ENodeB_Application_SecurityAdministrator',
            'COM Role', 'Provides full control over ENodeB specific security features'
        ]
    }, {
        'columns': ['',
            'ENodeB_Application_User',
            'COM Role', 'Provides read-only access to ENodeB specific fragments of Managed Element model, including TN, FM, LM, PM, Log and parts of equipment'
        ]
    }, {
        'columns': ['',
            'Support_Application_Administrator',
            'COM Role', 'Provides full control over Climate and Power Supply specific fragments of Managed Element model, including FM, PM, Log and parts of equipment'
        ]
    }, {
        'columns': ['',
            'Support_Application_User',
            'COM Role', 'Provides read-only access to Climate and Power Supply specific fragments of Managed Element model, including FM, Log, PM and parts of equipment'
        ]
    }];

    var rolesForCreateComRoleAlias = [{
        'columns': ['',
            'SystemAdministrator',
            'Provides full control over Managed Element model fragments related to System Functions, Equipment and Transport, excluding the fragment related to Security Management'
        ]
    }, {
        'columns': ['',
            'SystemSecurityAdministrator',
            'Provides full control over the fragment of a Managed Element model related to Security Management'
        ]
    }, {
        'columns': ['',
            'SystemReadOnly',
            'Provides read-only access to Managed Element model fragments related to System Functions as well as Equipment and Transport, but excluding the fragments related to Security Management'
        ]
    }, {
        'columns': ['',
            'ENodeB_Application_Administrator',
            'Provides full control over ENodeB specific fragments of Managed Element model, including TN, FM, LM, PM, Log and parts of equipment'
        ]
    }, {
        'columns': ['',
            'ENodeB_Application_SecurityAdministrator',
            'Provides full control over ENodeB specific security features'
        ]
    }, {
        'columns': ['',
            'ENodeB_Application_User',
            'Provides read-only access to ENodeB specific fragments of Managed Element model, including TN, FM, LM, PM, Log and parts of equipment'
        ]
    }, {
        'columns': ['',
            'Support_Application_Administrator',
            'Provides full control over Climate and Power Supply specific fragments of Managed Element model, including FM, PM, Log and parts of equipment'
        ]
    }, {
        'columns': ['',
            'Support_Application_User',
            'Provides read-only access to Climate and Power Supply specific fragments of Managed Element model, including FM, Log, PM and parts of equipment'
        ]
    }];

    var capabilities = [];

    for (var i = 0; i < GetUseCasesDefaultData.length; i++) {
        capabilities.push({ 'columns': ['', GetUseCasesDefaultData[i].application, GetUseCasesDefaultData[i].resource, GetUseCasesDefaultData[i].action, ''] });
    };

    var expectedRoles = {
        customRoleRolesTable: rolesForCreateCustomRole,
        capabilitiesTable: capabilities,
        comRoleAliasComRolesTable: rolesForCreateComRoleAlias
    };


    return expectedRoles;

});
