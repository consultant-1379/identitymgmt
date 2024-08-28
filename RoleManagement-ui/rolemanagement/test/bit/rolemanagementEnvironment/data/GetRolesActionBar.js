define(function() {
    'use strict';

    return [{
        "type": "com",
        "name": "ComRoleTest1",
        "description": "Testing com role",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "ComRoleTest2",
        "description": "Testing com role",
        "status": "DISABLED"
    }, {
        "type": "com",
        "name": "ComRoleTest3",
        "description": "Testing com role",
        "status": "DISABLED_ASSIGNMENT"
    }, {
        "type": "cpp",
        "name": "ZCppRoleTest1",
        "description": "Testing cpp role",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "ZCppRoleTest2",
        "description": "Testing cpp role",
        "status": "DISABLED"
    }, {
        "type": "cpp",
        "name": "ZCppRoleTest3",
        "description": "Testing cpp role",
        "status": "DISABLED_ASSIGNMENT"
    }, {
        "type": "comalias",
        "name": "TestCOMRoleAlias1",
        "description": "Testing COM role alias",
        "status": "ENABLED",
        "roles": [{
            "type": "com",
            "name": "SystemSecurityAdministrator",
            "description": "Provides full control over the fragment of a Managed Element model related to Security Management",
            "status": "ENABLED"
        }]
    }, {
        "type": "comalias",
        "name": "TestCOMRoleAlias2",
        "description": "Testing COM role alias",
        "status": "DISABLED",
        "roles": [{
            "type": "com",
            "name": "SystemSecurityAdministrator",
            "description": "Provides full control over the fragment of a Managed Element model related to Security Management",
            "status": "ENABLED"
        }]
    }, {
        "type": "comalias",
        "name": "TestCOMRoleAlias3",
        "description": "Testing COM role alias",
        "status": "DISABLED_ASSIGNMENT",
        "roles": [{
            "type": "com",
            "name": "SystemSecurityAdministrator",
            "description": "Provides full control over the fragment of a Managed Element model related to Security Management",
            "status": "ENABLED"
        }]
    },{
        "type": "custom",
        "name": "TestCustomRole1",
        "description": "Testing Custom role",
        "status": "ENABLED"
    }, {
        "type": "custom",
        "name": "TestCustomRole2",
        "description": "Testing Custom role",
        "status": "DISABLED"
    }, {
        "type": "custom",
        "name": "TestCustomRole3",
        "description": "Testing Custom role",
        "status": "DISABLED_ASSIGNMENT"
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
    }
    ];
});
