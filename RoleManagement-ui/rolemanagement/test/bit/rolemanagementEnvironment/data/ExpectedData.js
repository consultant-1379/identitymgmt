define(function() {
    'use strict';
    return [{
        'itemId': 'ADMINISTRATOR',
        'columns': ['', "ADMINISTRATOR", "ENM System Role", "Permits unrestricted access to all ENM applications and commands within these applications, excluding Security applications", "Enabled"]
    }, {
        'itemId': 'ComAlias1',
        'columns': ['', "ComAlias1", "COM Role Alias", "My first COM alias", "Disabled"]
    }, {
        'itemId': 'ComAlias2',
        'columns': ['', "ComAlias2", "COM Role Alias", "My second COM alias", "Enabled"]
    }, {
        'itemId': 'Custom1',
        'columns': ['', "Custom1", "Custom Role", "My first custom", "Enabled"]
    }, {
        'itemId': 'Custom2',
        'columns': ['', "Custom2", "Custom Role", "My second custom", "Disabled"]
    }, {
        'itemId': 'Credm_Administrator',
        'columns': ['', "Credm_Administrator", "ENM System Role", "Authorized for all actions on Credential Manager Web CLI", "Enabled"]    
    }, {
        'itemId': 'ENodeB_Application_Administrator',
        'columns': ['', "ENodeB_Application_Administrator", "COM Role", "Provides full control over ENodeB specific fragments of Managed Element model, including TN, FM, LM, PM, Log and parts of equipment", "Enabled"]
    }, {
        'itemId': 'SECURITY_ADMIN',
        'columns': ['', "SECURITY_ADMIN", "ENM System Role", "Permits access to Security applications supporting management of users accounts and access control", "Enabled"]        
    }, {
        'itemId': 'SystemAdministrator',
        'columns': ['', "SystemAdministrator", "COM Role", "Provides full control over Managed Element model fragments related to System Functions, Equipment and Transport, excluding the fragment related to Security Management", "Enabled"]
    }];
});
