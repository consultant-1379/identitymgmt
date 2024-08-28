define(function() {
    'use strict';

    return [{
        "type": "system",
        "name": "SECURITY_ADMIN",
        "description": "Permits access to Security applications supporting management of users accounts and access control",
        "status": "ENABLED"
    }, {
        "type": "system",
        "name": "ADMINISTRATOR",
        "description": "Permits unrestricted access to all ENM applications and commands within these applications, excluding Security applications",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "SystemAdministrator",
        "description": "Provides full control over Managed Element model fragments related to System Functions, Equipment and Transport, excluding the fragment related to Security Management",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "ENodeB_Application_Administrator",
        "description": "Provides full control over ENodeB specific fragments of Managed Element model, including TN, FM, LM, PM, Log and parts of equipment",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Credm_Administrator",
        "description": "Authorized for all actions on Credential Manager Web CLI",
        "status": "ENABLED"
    }, {
        "type": "comalias",
        "name": "ComAlias1",
        "description": "My first COM alias",
        "status": "DISABLED"
    }, {
        "type": "comalias",
        "name": "ComAlias2",
        "description": "My second COM alias",
        "status": "ENABLED"
    }, {
        "type": "custom",
        "name": "Custom1",
        "description": "My first custom",
        "status": "ENABLED"
    }, {
        "type": "custom",
        "name": "Custom2",
        "description": "My second custom",
        "status": "DISABLED"
    }];
});