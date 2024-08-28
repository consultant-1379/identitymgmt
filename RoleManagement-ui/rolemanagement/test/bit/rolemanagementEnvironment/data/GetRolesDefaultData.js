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
        "type": "system",
        "name": "OPERATOR",
        "description": "Permits limited access to all ENM applications and commands within these applications, excluding Security applications. Permitted operations are application specific",
        "status": "ENABLED"
    }, {
        "type": "system",
        "name": "FIELD_TECHNICIAN",
        "description": "Permits limited access to the ENM system. Allows basic user self-management operations and obtaining certificates for accessing nodes",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "SystemAdministrator",
        "description": "Provides full control over Managed Element model fragments related to System Functions, Equipment and Transport, excluding the fragment related to Security Management",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "SystemSecurityAdministrator",
        "description": "Provides full control over the fragment of a Managed Element model related to Security Management",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "SystemReadOnly",
        "description": "Provides read-only access to Managed Element model fragments related to System Functions as well as Equipment and Transport, but excluding the fragments related to Security Management",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "ENodeB_Application_Administrator",
        "description": "Provides full control over ENodeB specific fragments of Managed Element model, including TN, FM, LM, PM, Log and parts of equipment",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "ENodeB_Application_SecurityAdministrator",
        "description": "Provides full control over ENodeB specific security features",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "ENodeB_Application_User",
        "description": "Provides read-only access to ENodeB specific fragments of Managed Element model, including TN, FM, LM, PM, Log and parts of equipment",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "Support_Application_Administrator",
        "description": "Provides full control over Climate and Power Supply specific fragments of Managed Element model, including FM, PM, Log and parts of equipment",
        "status": "ENABLED"
    }, {
        "type": "com",
        "name": "Support_Application_User",
        "description": "Provides read-only access to Climate and Power Supply specific fragments of Managed Element model, including FM, Log, PM and parts of equipment",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "Read_Only",
        "description": "Permits collecting network configuration and performance data from the node",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "CM_Normal",
        "description": "Permits network and planned area configuration",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "CM_Advanced",
        "description": "Permits software upgrades and hardware extensions",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "FM_Normal",
        "description": "Permits alarm handling, node supervision and sending trouble reports",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "FM_Advanced",
        "description": "Permits troubleshooting rights",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "PM_Normal",
        "description": "Permits collecting performance data",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "PM_Advanced",
        "description": "Permits performance configurations",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "Security_Management",
        "description": "Permits O&M security rights on the node",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "IPsec_Management",
        "description": "Permits IPsec management on the node",
        "status": "ENABLED"
    }, {
        "type": "cpp",
        "name": "Ericsson_Support",
        "description": "Permits troubleshooting rights to Ericsson employees",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Credm_Operator",
        "description": "Authorized for list action on Credential Manager Web CLI",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Credm_Administrator",
        "description": "Authorized for all actions on Credential Manager Web CLI",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Lcm_Administrator",
        "description": "Authorized for all actions (create, read, update, delete, execute, query) on LCM",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Cmedit_Operator",
        "description": "Authorized for read action on CM Editor",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Cmedit_Administrator",
        "description": "Authorized for all actions on CM Editor (read, create, execute, update, delete)",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "FMX_Administrator",
        "description": "Authorized for FMX Module Management",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "FMX_Operator",
        "description": "Authorized for FMX Module Management",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Topology_Browser_Operator",
        "description": "Authorized for read actions on PersistentObjectService",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Topology_Browser_Administrator",
        "description": "Authorized for read and update actions on PersistentObjectService",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "FM_BNSINBI_Operator",
        "description": "Authorize Operator for accessing NBI BNSI Server",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "FM_BNSINBI_Administrator",
        "description": "Authorize Administrator for accessing NBI BNSI Server",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Shm_Operator",
        "description": "Permits read action on managed objects in the SHM services",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Shm_Administrator",
        "description": "Permits create, execute, update and delete actions on managed objects in the SHM services",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "PM_Operator",
        "description": "Authorized to perform all tasks in PM.",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "PM_Read_Operator",
        "description": "Authorized to perform read-only tasks in PM.",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "PM_Topology_Operator",
        "description": "Authorized to perform edit tasks in PM.",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "FM_Operator",
        "description": "Authorized for updating/deleting the open alarm",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "FM_Administrator",
        "description": "Authorized for updating/deleting the open alarm",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "CM_Operator",
        "description": "Authorize Operator for read access on CM Services",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "CM_Administrator",
        "description": "Authorize Administrator for all actions on CM Services (read, create, execute, update, delete)",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Element_Manager_Operator",
        "description": "Authorized for get actions on Element Manager",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Network_Explorer_Operator",
        "description": "Authorized for accessing network explorer applications",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Network_Explorer_Administrator",
        "description": "Authorized for accessing network explorer applications",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "NodeCLI_Administrator",
        "description": "Execute access to nodecli_usertype_admin",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "NodeCLI_Operator",
        "description": "Execute access to nodecli_usertype_control",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "CM_EVENTSNBI_Operator",
        "description": "Authorized for CM Events NBI",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "CM_EVENTSNBI_Administrator",
        "description": "Authorized for CM Events NBI",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Target_Group_Administrator",
        "description": "Authorized for the following actions in TG Manager: create, patch, execute, delete, read, query",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "NodeVersionSupport_Operator",
        "description": "Authorized to perform read-only action on Node Version Support service",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "NodeVersionSupport_Administrator",
        "description": "Authorized for all actions on Node Version Support service (read, execute, delete)",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Autoprovisioning_Operator",
        "description": "Authorized for actions as an operator in the Auto Provisioning Service (read, execute)",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Autoprovisioning_Administrator",
        "description": "Authorized for actions as an administrator in the Auto Provisioning Service (read, execute)",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Amos_Administrator",
        "description": "Read, Write and Telnet access to AMOS",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Amos_Operator",
        "description": "Read and Write access to AMOS",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Scripting_Operator",
        "description": "Access to Scripting VM and cron jobs",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "NodeSecurity_Operator",
        "description": "Authorized for actions as an operator in the Node Security Configuration Service (read)",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "NodeSecurity_Administrator",
        "description": "Authorized for actions as an administrator in the Node Security Configuration Service (read, create, update, execute)",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Nodediscovery_Operator",
        "description": "Authorized actions on NODE (IP) Discovery",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Nodediscovery_Administrator",
        "description": "Authorized actions on NODE (IP) Discovery",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "Healthcheck_Operator",
        "description": "Authorized for access to ENM CLI and execution of Healthcheck actions",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "TemplateManager_Operator",
        "description": "Authorized for read actions on Template Manager",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "TemplateManager_Administrator",
        "description": "Authorized for all actions on Template Manager",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "ServiceDefinition_Operator",
        "description": "Authorized for read actions on Service Definition.",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "ServiceDefinition_Administrator",
        "description": "Authorized for all actions on Service Definition",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "ServiceManager_Operator",
        "description": "Authorized for read actions on Service Manager.",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "ServiceManager_Administrator",
        "description": "Authorized for all actions on Service Manager.",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "NHM_Operator",
        "description": "Authorized for read actions on NetworkHealthMonitor",
        "status": "ENABLED"
    }, {
        "type": "application",
        "name": "NHM_Administrator",
        "description": "Authorized for read and update actions on NetworkHealthMonitor",
        "status": "ENABLED"
    }];
});
