define(function() {
    'use strict';

    return [{
        "id": "alarm_viewer",
        "name": "Alarm Monitor",
        "shortInfo": "Alarm Monitor application is used to monitor all the alarms or events that have occurred in a network. User can perform alarm actions, node operations (supervision toggle, sync initiation), and filtering the alarms with alarm severity and attributes.",
        "acronym": "FM",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/alarm_viewer",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#alarmoverview/alarmviewer"
    }, {
        "id": "alarmoverview",
        "name": "Alarm Overview",
        "shortInfo": "Alarm Overview application is used for providing summarized alarm information to the FM user who is monitoring the network from fault management perspective.",
        "acronym": "FM",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/alarmoverview",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#alarmoverview"
    }, {
        "id": "alarmtextrouting",
        "name": "Alarm Routing",
        "shortInfo": "Alarm Routing application is used to create, read, update, and delete alarm route(s) in the system. These routes are used to send alarms to different destination(s) based on the rules defined. ",
        "acronym": "FM",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/alarmtextrouting",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#alarmoverview/alarmrouting"
    }, {
        "id": "alarmsearch",
        "name": "Alarm Search",
        "shortInfo": "Alarm Search is used to search alarms from ENM database based on specified search criteria. It is possible to search both open and historic alarms.",
        "acronym": "FM",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/alarmsearch",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#alarmoverview/alarmsearch"
    }, {
        "id": "alex",
        "name": "Alex Library",
        "shortInfo": "Active Library Explorer (ALEX) provides a means for a user to browse Ericsson document libraries.",
        "acronym": "ALEX",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/alex",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/alex"
    }, {
        "id": "autoidmanagement",
        "name": "Automatic ID Management",
        "shortInfo": "Automatic ID Management is used to manage the PCI functionalities in the network",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/autoidmanagement",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#autoidmanagement"
    }, {
        "id": "command_line_interface",
        "name": "Command Line Interface",
        "shortInfo": "Command Line Interface enables users to perform essential viewing and updating of OSS and network data.",
        "acronym": "CLI",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/command_line_interface",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#cliapp"
    }, {
        "id": "kpimanagement",
        "name": "KPI Management",
        "shortInfo": "KPI Management is used to define KPIs and activate KPI measurements on nodes",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/kpimanagement",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#kpimanagement"
    }, {
        "id": "Log_Viewer",
        "name": "Log Viewer",
        "shortInfo": "Use to query and view details of the platform syslogs, provides a full text search and complex filtering of logs based on syslog data.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/Log_Viewer",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#logviewer"
    }, {
        "id": "network_explorer",
        "name": "Network Explorer",
        "shortInfo": "Use Network Explorer to search and retrieve all Network Configuration Data. The returned data can be grouped into Collections or Saved searches to facilitate sharing and reuse.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/network_explorer",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#networkexplorer"
    }, {
        "id": "networkhealthmonitor",
        "name": "Network Health Monitor",
        "shortInfo": "Network Health Monitor is used to monitor the state/health of the network with respect to CM, FM and PM Data",
        "acronym": "NHM",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/networkhealthmonitor",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#networkhealthmonitor"
    }, {
        "id": "nodemonitor",
        "name": "Node Monitor",
        "shortInfo": "Node Monitor is used to monitor individual nodes for state, alarms and performance",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/nodemonitor",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#nodemonitor"
    }, {
        "id": "OSS_Monitoring",
        "name": "OSS Monitoring",
        "shortInfo": "Use to monitor OSS Server hardware and OSS Operating system via agents installed on the servers which transmit back information to display on the portal.",
        "acronym": "OSS-MT",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/OSS_Monitoring",
        "targetUri": "http://172.16.30.19:57005/"
    }, {
        "id": "pmic",
        "name": "PM Initiation and Collection",
        "shortInfo": "PM Initiation and Collection provides functionality to allow a user to manage PM measurements in the LTE RAN, allowing a user create, schedule, start, stop, modify and delete subscriptions.",
        "acronym": "PMIC",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/pmic",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#pmiclistsubscription"
    }, {
        "id": "role_management",
        "name": "Role Management",
        "shortInfo": "Role Management is a web based application that allows the Security Administrator to manage all ENM System roles, COM roles, COM role aliases and Custom roles.",
        "acronym": "RM",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/role_management",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#rolemanagement"
    }, {
        "id": "shm",
        "name": "Software and Hardware Manager",
        "shortInfo": "Use Software and Hardware Manager to perform Software, Hardware, Backup and License Administration related tasks. It includes software upgrade, node backup and restore, license installation.",
        "acronym": "SHM",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/shm",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#shm"
    }, {
        "id": "targetmanagement",
        "name": "Target Group Management",
        "shortInfo": "Target Group Management application allows users to perform operations on a Target Group.",
        "acronym": "TGM",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/targetmanagement",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#targetmanagement"
    }, {
        "id": "transportnetworkdiscovery",
        "name": "Transport Network Discovery",
        "shortInfo": "Transport Network Discovery is used to Create/Modify/View the Transport Network Discovery Activities.",
        "acronym": "TND",
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/transportnetworkdiscovery",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#discovery"
    }, {
        "id": "user_management",
        "name": "User Management",
        "shortInfo": "User Management is a web based application that allows the Security Administrator to create, delete users and provide them access to ENM tools.",
        "acronym": null,
        "favorite": "false",
        "resources": null,
        "hidden": false,
        "roles": "",
        "uri": "/rest/apps/web/user_management",
        "targetUri": "https://enmapache.athtem.eei.ericsson.se/#usermanagement"
    }];

});