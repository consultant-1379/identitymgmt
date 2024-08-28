define(function() {
    'use strict';

    return [{
        "type": "com",
        "name": "ComRoleTest",
        "description": "Testing com role",
        "status": "ENABLED"
    }, {
        "type": "comalias",
        "name": "TestCOMRoleAlias",
        "description": "Testing COM role alias",
        "status": "ENABLED",
        "roles": [{
            "type": "com",
            "name": "SystemSecurityAdministrator",
            "description": "Provides full control over the fragment of a Managed Element model related to Security Management",
            "status": "ENABLED"
        }]
    }, {
        "type": "custom",
        "name": "TestCustomRole",
        "description": "Testing Custom role",
        "status": "ENABLED"
    }, {
        "type": "system",
        "name": "TestSystemRole",
        "description": "Testing system role",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "TestApplicationRole",
        "description": "Testing application role",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "ZTestCPPRole",
        "description": "Testing cpp role",
        "status": "ENABLED"
    }
    ];
});
