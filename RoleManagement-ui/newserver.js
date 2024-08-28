/** REST Description: http://confluence-nam.lmera.ericsson.se/display/ETO/Roles+Management **/


module.exports = function(app) {

    var roles = [];
    var URL = "/oss/idm/rolemanagement/roles";

    //PREDEFINED ROLES WITH ERROR CODES
    var roleCannotDelete400group = createRoleCannotDelete400group();
    var roleCannotDelete404notFound = createRoleCannotDelete404notFound();
    var roleCannotDelete422roleAssignedToUser = createRoleCannotDelete422roleAssignedToUser();
    var roleCannotDelete499unexpectedReason = createRoleCannotDelete499unexpectedReason();
    var roleCannotDelete500internaServerError = createRoleCannotDelete500internaServerError();

    //CONSTRUCT ALL ROLES ARRAY
    roles.push(roleCannotDelete400group);
    roles.push(roleCannotDelete404notFound);
    roles.push(roleCannotDelete422roleAssignedToUser);
    roles.push(roleCannotDelete499unexpectedReason);
    roles.push(roleCannotDelete500internaServerError);

    for (var i=5; i<340; i++) {
        roles.push(generateRandomRole(i));
    }

    /** GET all roles **/
    app.get(URL, function(req, res) {
        res.send(JSON.stringify(roles));
    });

    /** GET role with specified name **/
    app.get(URL+"/:name", function(req, res) {
        for (var i = 0; i < roles.length; i++) {
            if (roles[i].name == req.params.name) {
                console.log("Sending role " + i);
                console.log( JSON.stringify(roles[i]));

                res.status(200).send( JSON.stringify(roles[i]));
                return;
            }
        }
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.status(404).send('{"error":"Role with name: '+req.params.name+' was not found"}');
    });

    /**  CREATE new role **/
    app.post(URL, function(req, res) {
        console.log("Debug: CREATE new role");
        var requestRole = req.body;

        console.log("Adding requestRole...");
        console.log(JSON.stringify(requestRole));

        requestRole.id = new Date().getTime();


        // Find for uniqueness name error
        var isUnique = true;
        roles.forEach(function(role) {
            if(role.name === requestRole.name) {
                isUnique = false;
                return;
            }
        }.bind(this))

        resObj = {
            "userMessage":"Role name must be unique.",
            "httpStatusCode":422
        }

        if(!isUnique) {
            res.status(422).send(JSON.stringify(resObj));
        }


        if(requestRole.status === 'enabled' ||
           requestRole.status === 'disabled' ||
           requestRole.status === 'disabled_assigment') {
             console.log("Error adding requestRole, lowercase status is not ok");
             res.status(400).send(JSON.stringify(requestRole));
           }
        else {
          res.status(201).send(JSON.stringify(requestRole));
          roles.push(requestRole);
        }
    });

    /** UPDATE role with specified name **/
    //TODO: Do it one day!
    app.put(URL+"/:name", function(req, res) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.status(501).send('{"error": "Endpoint not supported."}');
    });


    /** DELETE all roles **/
    app.delete(URL, function(req, res) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.state(422).send('{"userMessage": "You cannot delete all Roles.","httpStatusCode": 422,"time": ' + this.Date().toUTCString() + ',}');
    });



    app.get('/oss/uiaccesscontrol/resources/:resource/actions', function(req, res) {

        var accessControlResponse = [{
            "resource":req.params.resource,
            "actions":["patch","read","query","create","delete"]
        }];
         res.send(JSON.stringify(accessControlResponse));
   });


    /** Allow pass trough acces control **/
    app.get('/rest/apps', function(req, res) {

        //Copied json for admin response
        var accessControlResponse = [
            {"id":"amos_terminal","name":"Advanced MO Scripting","shortInfo":"AMOS CLI provides access to a number of services (Alarm, Configuration, File Transfer, Inventory, Log, Notification Services) for the administration of CPP Platform Network Elements.","acronym":"AMOS","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/amos_terminal","targetUri":"https://enmapache.athtem.eei.ericsson.se/#shell?command=amos&goto=launcher"},
            {"id":"alarm_viewer","name":"Alarm Monitor","shortInfo":"Alarm Monitor application is used to monitor all the alarms or events that have occurred in a network. User can perform alarm actions, node operations (supervision toggle, sync initiation), and filtering the alarms with alarm severity and attributes.","acronym":"FM","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/alarm_viewer","targetUri":"https://enmapache.athtem.eei.ericsson.se/#alarmviewer"},
            {"id":"alarmoverview","name":"Alarm Overview","shortInfo":"Alarm Overview application is used for providing summarized alarm information to the FM user who is monitoring the network from fault management perspective.","acronym":"FM","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/alarmoverview","targetUri":"https://enmapache.athtem.eei.ericsson.se/#alarmoverview"},
            {"id":"alarmtextrouting","name":"Alarm Routing","shortInfo":"Alarm Routing application is used to create, read, update, and delete alarm route(s) in the system. These routes are used to send alarms to different destination(s) based on the rules defined. ","acronym":"FM","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/alarmtextrouting","targetUri":"https://enmapache.athtem.eei.ericsson.se/#alarmtextrouting"},
            {"id":"alarmsearch","name":"Alarm Search","shortInfo":"Alarm Search is used to search alarms from ENM database based on specified search criteria. It is possible to search both open and historic alarms.","acronym":"FM","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/alarmsearch","targetUri":"https://enmapache.athtem.eei.ericsson.se/#alarmsearch"},
            {"id":"alex","name":"Alex Library","shortInfo":"Active Library Explorer (ALEX) provides a means for a user to browse Ericsson document libraries.","acronym":"ALEX","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/alex","targetUri":"https://enmapache.athtem.eei.ericsson.se/alex"},
            {"id":"autoidmanagement","name":"Automatic ID Management","shortInfo":"Automatic ID Management is used to manage the PCI functionalities in the network","acronym":null,"favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/autoidmanagement","targetUri":"https://enmapache.athtem.eei.ericsson.se/#autoidmanagement"},
            {"id":"command_line_interface","name":"Command Line Interface","shortInfo":"Command Line Interface enables users to perform essential viewing and updating of OSS and network data.","acronym":"CLI","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/command_line_interface","targetUri":"https://enmapache.athtem.eei.ericsson.se/#cliapp"},
            {"id":"kpimanagement","name":"KPI Management","shortInfo":"KPI Management is used to define KPIs and activate KPI measurements on nodes","acronym":null,"favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/kpimanagement","targetUri":"https://enmapache.athtem.eei.ericsson.se/#kpimanagement"},
            {"id":"Log_Viewer","name":"Log Viewer","shortInfo":"Use to query and view details of the platform syslogs, provides a full text search and complex filtering of logs based on syslog data.","acronym":null,"favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/Log_Viewer","targetUri":"https://enmapache.athtem.eei.ericsson.se/#logviewer"},
            {"id":"network_explorer","name":"Network Explorer","shortInfo":"Use Network Explorer to search and retrieve all Network Configuration Data. The returned data can be grouped into Collections or Saved searches to facilitate sharing and reuse.","acronym":null,"favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/network_explorer","targetUri":"https://enmapache.athtem.eei.ericsson.se/#networkexplorer"},
            {"id":"networkhealthmonitor","name":"Network Health Monitor","shortInfo":"Network Health Monitor is used to monitor the state/health of the network with respect to CM, FM and PM Data","acronym":"NHM","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/networkhealthmonitor","targetUri":"https://enmapache.athtem.eei.ericsson.se/#networkhealthmonitor"},
            {"id":"nodemonitor","name":"Node Monitor","shortInfo":"Node Monitor is used to monitor individual nodes for state, alarms and performance","acronym":null,"favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/nodemonitor","targetUri":"https://enmapache.athtem.eei.ericsson.se/#nodemonitor"},
            {"id":"OSS_Monitoring","name":"OSS Monitoring","shortInfo":"Use to monitor OSS Server hardware and OSS Operating system via agents installed on the servers which transmit back information to display on the portal.","acronym":"OSS-MT","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/OSS_Monitoring","targetUri":"https://172.16.30.19:57005/"},
            {"id":"pmic","name":"PM Initiation and Collection","shortInfo":"PM Initiation and Collection provides functionality to allow a user to manage PM measurements in the LTE RAN, allowing a user create, schedule, start, stop, modify and delete subscriptions.","acronym":"PMIC","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/pmic","targetUri":"https://enmapache.athtem.eei.ericsson.se/#pmiclistsubscription"},
            {"id":"role_management","name":"Role Management","shortInfo":"Role Management is a web based application that allows the Security Administrator to manage all ENM System roles, COM roles, COM role aliases and Custom roles.","acronym":"RM","favorite":"true","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/role_management","targetUri":"https://enmapache.athtem.eei.ericsson.se/#rolemanagement"},
            {"id":"shell_terminal","name":"Shell Terminal","shortInfo":"The Shell Terminal opens a SSH session to run applications and execute commands in a shell command line.","acronym":"SSH","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/shell_terminal","targetUri":"https://enmapache.athtem.eei.ericsson.se/#shell?goto=launcher"},
            {"id":"shm","name":"Software and Hardware Manager","shortInfo":"Use Software and Hardware Manager to perform Software, Hardware, Backup and License Administration related tasks. It includes software upgrade, node backup and restore, license installation.","acronym":"SHM","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/shm","targetUri":"https://enmapache.athtem.eei.ericsson.se/#shm"},
            {"id":"transportnetworkdiscovery","name":"Transport Network Discovery","shortInfo":"Transport Network Discovery is used to Create/Modify/View the Transport Network Discovery Activities.","acronym":"TND","favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/transportnetworkdiscovery","targetUri":"https://enmapache.athtem.eei.ericsson.se/#discovery"},
            {"id":"user_management","name":"User Management","shortInfo":"User Management is a web based application that allows the Security Administrator to create, delete users and provide them access to ENM tools.","acronym":null,"favorite":"false","resources":null,"hidden":false,"roles":"","uri":"/rest/apps/web/user_management","targetUri":"https://enmapache.athtem.eei.ericsson.se/#usermanagement"}
        ];
        res.send(JSON.stringify(accessControlResponse));
    });

    /** Allow pass trough acces control **/
    app.get('/oss/idm/rolemanagement/usecases', function(req, res) {

        //Copied json for admin response
        var accessControlResponse = [
            {"application":"CM-CLI","resource":"cm_editor","action":"read","description":"Read Network Configuration Data"},
            {"application":"CM-CLI","resource":"cm_editor","action":"create","description":"Create Network Configuration Data"},
            {"application":"CM-CLI","resource":"cm_editor","action":"execute","description":"Perform modelled actions on Network Configuration Data"},
            {"application":"CM-CLI","resource":"cm_editor","action":"update","description":"Update Network Configuration Data"},
            {"application":"CM-CLI","resource":"cm_editor","action":"delete","description":"Delete Network Configuration Data"},
            {"application":"Network Health Monitor","resource":"nhm","action":"read","description":"Allows monitoring of selected nodes and viewing of KPI information."},
            {"application":"Network Health Monitor","resource":"nhm","action":"execute","description":"Allows activation and deactivation of selected KPIs."},
            {"application":"Network Health Monitor","resource":"nhm","action":"update","description":"Update selected custom defined KPIs."},
            {"application":"Network Health Monitor","resource":"nhm","action":"create","description":"Create custom defined KPIs."},
            {"application":"Network Health Monitor","resource":"nhm","action":"query","description":"Query the application for node and KPI data."},
            {"application":"Network Health Monitor","resource":"nhm","action":"delete","description":"Delete selected custom defined KPIs."},
            {"application":"FM","resource":"alarm_export","action":"query","description":"Query for Open/History alarms data to export the same"},
            {"application":"Generic Identity Configuration","resource":"gic_password_policy_mgmt","action":"update","description":"Allows to update password policy values"},
            {"application":"Generic Identity Configuration","resource":"gic_password_policy_mgmt","action":"read","description":"Allows to list current status and values of password policies"},
            {"application":"Service Manager","resource":"service_manager","action":"create","description":"Allows to create Services for Network Configuration."},
            {"application":"Service Manager","resource":"service_manager","action":"read","description":"Allows to read Services and its details."},
            {"application":"Service Manager","resource":"service_manager","action":"update","description":"Allows to update Services."},
            {"application":"Service Manager","resource":"service_manager","action":"delete","description":"Allows to delete Services."},
            {"application":"Service Manager","resource":"service_manager","action":"execute","description":"Allows to execute actions on Services (ex. Deploy, Undeploy)."},
            {"application":"FM","resource":"fm_services","action":"read","description":"Start BNSI NBI communication session."},
            {"application":"FM","resource":"fm_services","action":"query","description":"Synchronize alarms action commands."},
            {"application":"FM","resource":"fm_services","action":"update","description":"Enabling/Disabling filter control."},
            {"application":"FM","resource":"fm_services","action":"execute","description":"Acknowledge/Terminate alarm action commands."},
            {"application":"FM","resource":"alarm_overview","action":"query","description":"Query for Open alarms data to show the overview"},
            {"application":"CM","resource":"cm_bulk_rest_nbi","action":"read","description":"Get information about bulk import export job through REST NBI services."},
            {"application":"CM","resource":"cm_bulk_rest_nbi","action":"create","description":"Execute bulk import export operation through REST NBI services."},
            {"application":"NetworkExplorer","resource":"searchExecutor","action":"read","description":"Perform searches in Network Explorer. Requires resource 'topologySearchService' to display search results"},
            {"application":"TND-Discovery","resource":"NodeDiscovery","action":"create","description":"Allows the following use cases: create discovery connection profile, create discovery activity"},
            {"application":"TND-Discovery","resource":"NodeDiscovery","action":"update","description":"Allows the following use cases: update discovery connection profile, update discovery activity"},
            {"application":"TND-Discovery","resource":"NodeDiscovery","action":"delete","description":"Allows the following use cases: delete discovery connection profile, delete discovery activity"},
            {"application":"TND-Discovery","resource":"NodeDiscovery","action":"read","description":"Allows the following use cases: view discovery connection profiles, view discovery activities and details"},
            {"application":"TND-Discovery","resource":"NodeDiscovery","action":"execute","description":"Allows the following use cases: start/stop the discovery activity"},
            {"application":"Template Manager","resource":"template_manager","action":"create","description":"Allows to create Templates for Service Configuration."},
            {"application":"Template Manager","resource":"template_manager","action":"read","description":"Allows to read Templates and its details."},
            {"application":"Template Manager","resource":"template_manager","action":"update","description":"Allows to update Templates."},
            {"application":"Template Manager","resource":"template_manager","action":"delete","description":"Allows to delete Templates."},
            {"application":"Template Manager","resource":"template_manager","action":"execute","description":"Allows to execute actions on Templates (ex. Activate, Deprecate)."},
            {"application":"CM Events NBI","resource":"cm-events-nbi","action":"read","description":"Get events for cm events nbi"},
            {"application":"Auto Provisioning","resource":"ap","action":"read","description":"Allows execution of the view autoprovisioning command."},
            {"application":"Auto Provisioning","resource":"ap","action":"execute","description":"Allows execution of the validate, import, order, unorder, bind, delete, download and upload autoprovisioning commands."},
            {"application":"SHM","resource":"cppinventorysynch_service","action":"create","description":"Allows to create jobs such as Upgrade, Backup, License, Restore."},
            {"application":"SHM","resource":"cppinventorysynch_service","action":"execute","description":"Allows to View Job Related Details(Job Progress/Job logs),Software Package Details,Inventory Details(software/hardware/license/backup),Import of Software Packages,License Key Files and Export Job Logs and Invocation of manual job and Canceling of a Job."},
            {"application":"SHM","resource":"cppinventorysynch_service","action":"delete","description":"Allows to deletion of Jobs,Software Packages,License Key Files"},
            {"application":"FMX","resource":"fmxModuleManagement","action":"execute","description":"Perform Activate/Deactivate operations on Modules and change running Module Parameters"},
            {"application":"FMX","resource":"fmxModuleManagement","action":"create","description":"Perform Import/Load operations on Modules"},
            {"application":"FMX","resource":"fmxModuleManagement","action":"delete","description":"Perform Unload operation on Modules"},
            {"application":"FMX","resource":"fmxModuleManagement","action":"update","description":"Create/Edit rules using Rule Editor"},
            {"application":"FMX","resource":"fmxModuleManagement","action":"read","description":"View Monitor graphs and subscribe to Rule Trace"},
            {"application":"FMX","resource":"fmxModuleManagement","action":"query","description":"Query for Modules archived/exported/loaded and their status"},
            {"application":"FM","resource":"nodes","action":"execute","description":"Enabling/Disabling Supervision on Network Elements and To initiate Alarm Synchronization"},
            {"application":"FM","resource":"nodes","action":"query","description":"Query the SupervisionState and CurrentServiceState"},
            {"application":"FM","resource":"nodes","action":"update","description":"Update the values of HeartBeat Timeout, Automatic Synchronization and other attributes under FmAlarmSupervision and FmFunction childs"},
            {"application":"CM","resource":"cm_config_rest_nbi","action":"read","description":"Read network configuration data through REST NBI services."},
            {"application":"CM","resource":"cm_config_rest_nbi","action":"create","description":"Create network configuration data through REST NBI services."},
            {"application":"CM","resource":"cm_config_rest_nbi","action":"update","description":"Update network configuration data through REST NBI services."},
            {"application":"CM","resource":"cm_config_rest_nbi","action":"execute","description":"Perform activate operation on network configuration data through REST NBI services."},
            {"application":"CM","resource":"cm_config_rest_nbi","action":"delete","description":"Delete network configuration data through REST NBI services."},
            {"application":"NetworkExplorer","resource":"modelInformationService","action":"read","description":"Read Models and associated attributes in CriteriaBuilder"},
            {"application":"PM Initiation and Collection","resource":"subscription","action":"create","description":"Allows to create a Subscription to enable Performance Monitoring on the Network"},
            {"application":"PM Initiation and Collection","resource":"subscription","action":"update","description":"Allows to update a Subscription"},
            {"application":"PM Initiation and Collection","resource":"subscription","action":"delete","description":"Allows to delete a Subscription"},
            {"application":"PM Initiation and Collection","resource":"subscription","action":"read","description":"Allows to read information about the Subscriptions"},
            {"application":"PM Initiation and Collection","resource":"subscription","action":"execute","description":"Allows to activate/deactivate a Subscription"},
            {"application":"FM","resource":"open_alarms","action":"execute","description":"Perform ACK/UNACK and CLEAR operation on open alarms"},
            {"application":"FM","resource":"open_alarms","action":"update","description":"Updating the Comments on the alarms"},
            {"application":"FM","resource":"open_alarms","action":"query","description":"Query for Open alarms data"},
            {"application":"FM","resource":"alarms_search","action":"query","description":"Query for Open or History alarms data"},
            {"application":"NetworkExplorer","resource":"topologyCollectionsService","action":"create","description":"Create Collection and Saved Searches"},
            {"application":"NetworkExplorer","resource":"topologyCollectionsService","action":"delete","description":"Delete Collection and Saved Searches"},
            {"application":"NetworkExplorer","resource":"topologyCollectionsService","action":"read","description":"View Collection and Saved Searches"},
            {"application":"Single Logon Service","resource":"sls-credentialmanagement","action":"delete","description":"Allows to revoke credential for any user"},
            {"application":"Service Definition","resource":"service_definition","action":"create","description":"Allows to create Service Definitions for Network Configuration."},
            {"application":"Service Definition","resource":"service_definition","action":"read","description":"Allows to read Service Definitions and its details."},
            {"application":"Service Definition","resource":"service_definition","action":"update","description":"Allows to update Service Definitions."},
            {"application":"Service Definition","resource":"service_definition","action":"delete","description":"Allows to delete Service Definitions."},
            {"application":"Service Definition","resource":"service_definition","action":"execute","description":"Allows to execute actions on Service Definitions (ex. Activate, Deprecate)."},
            {"application":"FM","resource":"alarm_policies","action":"create","description":"Create Alarm Route Policies"},
            {"application":"FM","resource":"alarm_policies","action":"query","description":"List the Alarm Route Policies"},
            {"application":"FM","resource":"alarm_policies","action":"update","description":"Update Alarm Route Policies"},
            {"application":"FM","resource":"alarm_policies","action":"delete","description":"Delete Alarm Route Policies"},
            {"application":"Node Version Support","resource":"node_version_support","action":"read","description":"Allows to read information from Node Version Support service."},
            {"application":"Node Version Support","resource":"node_version_support","action":"execute","description":"Allows to execute actions on the Node Version Support service, such as activating support for new network nodes."},
            {"application":"Node Version Support","resource":"node_version_support","action":"delete","description":"Allows to delete Node Version Support service results."},
            {"application":"NetworkExplorer","resource":"topologySearchService","action":"read","description":"Perform searches in Network Explorer. Requires resource 'searchExecutor' to perform searches"}];
        res.send(JSON.stringify(accessControlResponse));
    });

    /** DELETE role with specified name **/
    app.delete(URL+"/:name", function(req, res) {

        var roleName = req.params.name;
        console.log("Debug: Deleting role " + roleName);

        if(roleName === roleCannotDelete400group.name){
            res.status(400).send( errorJson( roleCannotDelete400group.description));
            return;
        }

        if(roleName === roleCannotDelete404notFound.name){
            res.status(404).send(errorJson( roleCannotDelete404notFound.description));
            return;
        }

        if(roleName === roleCannotDelete422roleAssignedToUser.name){
            res.status(422).send(errorJson( roleCannotDelete422roleAssignedToUser.description));
            return;
        }

        if(roleName === roleCannotDelete499unexpectedReason.name){
            res.status(499).send(errorJson( roleCannotDelete499unexpectedReason.description));
            return;
        }

        if(roleName === roleCannotDelete500internaServerError.name){
            res.status(500).send(errorJson( roleCannotDelete500internaServerError.description));
            return;
        }

        for (var i = 0; i < roles.length; i++) {
            if (roles[i].name == req.params.name) {
                var role = roles[i];
                roles.splice(i, 1);
                res.status(204).send( '{"success": "No content."}' );//204 is No Content
                return;
            }
        }

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.status(404).send('{"error":"Role with name: '+req.params.name+' was not found"}');
    });

    console.log("Started REST API");
}

function generateRandomRole(id) {
    //name & description
    var name = '';
    var description = '';
    switch(Math.floor(Math.random() * 3)){
        case 0:
            name = 'Administrator';
            description = 'This is administrator role.';
            break;
        case 1:
            name = 'Operator';
            description = 'This is operator role.';
            break;
        case 2:
            name = 'ENM_operator';
            description = 'This is ENM operator role.';
            break;
        default:
            name = '[ERROR]';
            break;
    }

    name = name + id;

    //type
    var type = '';
    switch(Math.floor(Math.random() * 6)){
        case 0:
            type = 'com';
            break;
        case 1:
            type = 'comalias';
            break;
        case 2:
            type = 'custom';
            break;
        case 3:
            type = 'system';
            break;
        case 4:
            type = 'application';
            break;
        case 5:
            type = 'cpp';
            break;
        default:
            type = '[ERROR]';
            break;
    }

    //status
    var status = '';
    switch(Math.floor(Math.random() * 3)){
        case 0:
            status = 'ENABLED';
            break;
        case 1:
            status = 'DISABLED';
            break;
        case 2:
            status = 'DISABLED_ASSIGNMENT';
            break;
        default:
            status = '[ERROR]';
            break;
    }

    return {
        'id':id,
        'name':name,
        'description':description,
        'type':type,
        'status':status,
        'roles': []
    }
}


function createRoleCannotDelete400group() {

    var id = 0;
    var name = 'aaaaa RoleAssignedToGroupRole'; //now paginated table by default sort
    var description = 'Should result in conde 400, "Cannot delete a role that is assigned to group role."';
    var type = 'com';
    var status = 'enabled';

    return {
        'id':id,
        'name':name,
        'description':description,
        'type':type,
        'status':status,
        'roles': []
    }
}

function createRoleCannotDelete404notFound() {

    var id = 2;
    var name = 'aaaaa RoleNotFound'; //now paginated table by default sort
    var description = 'Should result in http code 404, "Specified role not found"';
    var type = 'com';
    var status = 'enabled';

    return {
        'id':id,
        'name':name,
        'description':description,
        'type':type,
        'status':status,
        'roles': []
    }
}

function createRoleCannotDelete422roleAssignedToUser() {

    var id = 3;
    var name = 'aaaaa RoleAssignedToUser'; //now paginated table by default sort
    var description = 'Should result in http code 422';
    var type = 'com';
    var status = 'enabled';

    return {
        'id':id,
        'name':name,
        'description':description,
        'type':type,
        'status':status,
        'roles': []
    }
}

function createRoleCannotDelete499unexpectedReason() {

    var id = 4;
    var name = 'aaaaa UnexpectedReason'; //now paginated table by default sort
    var description = 'Should result in http code 499';
    var type = 'com';
    var status = 'enabled';

    return {
        'id':id,
        'name':name,
        'description':description,
        'type':type,
        'status':status,
        'roles': []
    }
}

function createRoleCannotDelete500internaServerError() {

    var id = 5;
    var name = 'aaaaa InternaServerError'; //now paginated table by default sort
    var description = 'Should result in http code 500';
    var type = 'com';
    var status = 'enabled';

    return {
        'id':id,
        'name':name,
        'description':description,
        'type':type,
        'status':status,
        'roles': []
    }
}

function errorJson( codeDescription ) {
    return '{"error": "' + codeDescription + '"}';
};


