define(function() {
    'use strict';

    return {
            "type": "custom",
            "name": "TestCustomRole",
            "description": "Testing Custom role",
            "status": "ENABLED",
            "roles": [{
                "type": "com",
                "name": "SystemSecurityAdministrator",
                "description": "Provides full control over the fragment of a Managed Element model related to Security Management",
                "status": "ENABLED"
            },{
                "type": "com",
                "name": "SystemReadOnly",
                "description": "Provides full control over the fragment of a Managed Element model related to Security Management",
                "status": "ENABLED"
            }, {
                "type": "com",
                "name": "ENodeB_Application_User",
                "description": "Provides read-only access to ENodeB specific fragments of Managed Element model, including TN, FM, LM, PM, Log and parts of equipment",
                "status": "ENABLED"
            }],
            "policy": {
                "oam": ["read","execute","delete"]
            }
    };
});