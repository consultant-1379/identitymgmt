/** REST Description: http://confluence-nam.lmera.ericsson.se/display/ETO/targetGroups+Management **/
//_ = require('underscore');
module.exports = function(app) {
        var targetGroups = [];
        var numberTargetOriginal = 16000;
        var numberTargetToAdd = 20000;
        var URL = "/oss/idm/targetgroupmanagement/targetgroups";
        for (var i = 0; i < 30; i++) {
            targetGroups.push(generateRandomTargetGroup(i));
            console.log(i);
        }
        targetGroups.push({
            name: "Cannot delete: (TGIDM-3-delete)",
            iec: "TGIDM-3-delete",
            hsc: 403,
            description: "Don't have permissions to delete"
        });
        targetGroups.push({
            name: "Cannot delete: (GenericDAO-4-1)",
            iec: "GenericDAO-4-1",
            hsc: 404,
            description: "TargetGroupEntity was not found in a Data Base."
        });
        targetGroups.push({
            name: "Cannot delete: (GenericDAO-5-1-0)",
            iec: "GenericDAO-5-1-0",
            hsc: 422,
            description: "Query was executed and there is more than one result."
        });
        targetGroups.push({
            name: "Cannot delete: (TGIDM-5-1-2)",
            iec: "TGIDM-5-1-2",
            hsc: 422,
            description: "Specified Target Group is part of a privilege assigned to user. It cannot be removed."
        });
        targetGroups.push({
            name: "Cannot delte: (TGIDM-5-1-1)",
            iec: "TGIDM-5-1-1",
            hsc: 422,
            description: "Specified Target Group is predefined. It cannot be removed."
        });
        targetGroups.push({
            name: "Cannot delete: (GenericDAO-10)",
            iec: "GenericDAO-10",
            hsc: 500,
            description: "Service is currently unavailable. Please try again later or contact your System Administrator."
        });
        // _.each(targetGroups, console.log);
        /** GET all target groups **/
        app.get(URL, function(req, res) {
            if (req.query.targets) {                
                var tmpResponse = targetGroups.some(function(element) {
                    for (var i in req.query.targets) {
                        var find = element.targets.some(function(target) {
                            return target === req.query.targets[i];
                        })
                        if (!find) {
                            return false;
                        }
                        return true;
                    };

                });
                res.send(JSON.stringify(tmpResponse));
            } else {
                res.send(JSON.stringify(targetGroups));
            }
        });
        /** GET role with specified name **/
        app.get(URL + "/:name", function(req, res) {
            for (var i = 0; i < targetGroups.length; i++) {
                if (targetGroups[i].name == req.params.name) {
                    res.status(200).send(JSON.stringify(targetGroups[i]));
                    return;
                }
            }
            res.setHeader("Content-Type", "application/json charset=utf-8");
            res.status(404).send('{"error":"Role with name: ' + req.params.name + ' was not found"}');
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
            targetGroups.forEach(function(role) {
                if (role.name === requestRole.name) {
                    isUnique = false;
                    return;
                }
            }.bind(this))
            resObj = {
                "userMessage": "Role name must be unique.",
                "httpStatusCode": 422
            }
            if (!isUnique) {
                res.status(422).send(JSON.stringify(resObj));
            }
            if (requestRole.status === 'enabled' || requestRole.status === 'disabled' || requestRole.status === 'disabled_assigment') {
                console.log("Error adding requestRole, lowercase status is not ok");
                res.status(400).send(JSON.stringify(requestRole));
            } else {
                res.status(201).send(JSON.stringify(requestRole));
                targetGroups.push(requestRole);
            }
        });
        /** UPDATE role with specified name **/
        //TODO: Do it one day!
        app.put(URL + "/:name", function(req, res) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(501).send('{"error": "Endpoint not supported."}');
        });
        /** DELETE all targetGroups **/
        app.delete(URL, function(req, res) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.state(422).send('{"userMessage": "You cannot delete all targetGroups.","httpStatusCode": 422,"time": ' + this.Date().toUTCString() + ',}');
        });
        /** Allow pass trough acces control **/
        app.get('/rest/apps', function(req, res) {
            //Copied json for admin response
            var accessControlResponse = [{
                "id": "amos_terminal",
                "name": "Advanced MO Scripting",
                "shortInfo": "AMOS CLI provides access to a number of services (Alarm, Configuration, File Transfer, Inventory, Log, Notification Services) for the administration of CPP Platform Network Elements.",
                "acronym": "AMOS",
                "favorite": "false",
                "resources": null,
                "hidden": false,
                "targetGroups": "",
                "uri": "/rest/apps/web/amos_terminal",
                "targetUri": "https://enmapache.athtem.eei.ericsson.se/#shell?command=amos&goto=launcher"
            }, {
                "id": "alarm_viewer",
                "name": "Alarm Monitor",
                "shortInfo": "Alarm Monitor application is used to monitor all the alarms or events that have occurred in a network. User can perform alarm actions, node operations (supervision toggle, sync initiation), and filtering the alarms with alarm severity and attributes.",
                "acronym": "FM",
                "favorite": "false",
                "resources": null,
                "hidden": false,
                "targetGroups": "",
                "uri": "/rest/apps/web/alarm_viewer",
                "targetUri": "https://enmapache.athtem.eei.ericsson.se/#alarmviewer"
            }, {
                "id": "alarmoverview",
                "name": "Alarm Overview",
                "shortInfo": "Alarm Overview application is used for providing summarized alarm information to the FM user who is monitoring the network from fault management perspective.",
                "acronym": "FM",
                "favorite": "false",
                "resources": null,
                "hidden": false,
                "targetGroups": "",
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
                "targetGroups": "",
                "uri": "/rest/apps/web/alarmtextrouting",
                "targetUri": "https://enmapache.athtem.eei.ericsson.se/#alarmtextrouting"
            }, {
                "id": "alarmsearch",
                "name": "Alarm Search",
                "shortInfo": "Alarm Search is used to search alarms from ENM database based on specified search criteria. It is possible to search both open and historic alarms.",
                "acronym": "FM",
                "favorite": "false",
                "resources": null,
                "hidden": false,
                "targetGroups": "",
                "uri": "/rest/apps/web/alarmsearch",
                "targetUri": "https://enmapache.athtem.eei.ericsson.se/#alarmsearch"
            }, {
                "id": "alex",
                "name": "Alex Library",
                "shortInfo": "Active Library Explorer (ALEX) provides a means for a user to browse Ericsson document libraries.",
                "acronym": "ALEX",
                "favorite": "false",
                "resources": null,
                "hidden": false,
                "targetGroups": "",
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
                "targetGroups": "",
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
                "targetGroups": "",
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
                "targetGroups": "",
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
                "targetGroups": "",
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
                "targetGroups": "",
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
                "targetGroups": "",
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
                "targetGroups": "",
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
                "targetGroups": "",
                "uri": "/rest/apps/web/OSS_Monitoring",
                "targetUri": "https://172.16.30.19:57005/"
            }, {
                "id": "pmic",
                "name": "PM Initiation and Collection",
                "shortInfo": "PM Initiation and Collection provides functionality to allow a user to manage PM measurements in the LTE RAN, allowing a user create, schedule, start, stop, modify and delete subscriptions.",
                "acronym": "PMIC",
                "favorite": "false",
                "resources": null,
                "hidden": false,
                "targetGroups": "",
                "uri": "/rest/apps/web/pmic",
                "targetUri": "https://enmapache.athtem.eei.ericsson.se/#pmiclistsubscription"
            }, {
                "id": "role_management",
                "name": "Role Management",
                "shortInfo": "Role Management is a web based application that allows the Security Administrator to manage all ENM System targetGroups, COM targetGroups, COM role aliases and Custom targetGroups.",
                "acronym": "RM",
                "favorite": "true",
                "resources": null,
                "hidden": false,
                "targetGroups": "",
                "uri": "/rest/apps/web/role_management",
                "targetUri": "https://enmapache.athtem.eei.ericsson.se/#rolemanagement"
            }, {
                "id": "shell_terminal",
                "name": "Shell Terminal",
                "shortInfo": "The Shell Terminal opens a SSH session to run applications and execute commands in a shell command line.",
                "acronym": "SSH",
                "favorite": "false",
                "resources": null,
                "hidden": false,
                "targetGroups": "",
                "uri": "/rest/apps/web/shell_terminal",
                "targetUri": "https://enmapache.athtem.eei.ericsson.se/#shell?goto=launcher"
            }, {
                "id": "shm",
                "name": "Software and Hardware Manager",
                "shortInfo": "Use Software and Hardware Manager to perform Software, Hardware, Backup and License Administration related tasks. It includes software upgrade, node backup and restore, license installation.",
                "acronym": "SHM",
                "favorite": "false",
                "resources": null,
                "hidden": false,
                "targetGroups": "",
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
                "targetGroups": "",
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
                "targetGroups": "",
                "uri": "/rest/apps/web/user_management",
                "targetUri": "https://enmapache.athtem.eei.ericsson.se/#usermanagement"
            }];
            res.send(JSON.stringify(accessControlResponse));
        });

        function generateTargets(number) {
            var targets = [];
            for (var i = 0; i < number; i++) {
                targets.push({"name": "Target" + i, "targetTypeName": "Router6672"});
            }
            return targets;
        }

        app.get("/oss/idm/targetmanagement/targets", function(req, res) {
            var targets = generateTargets(numberTargetOriginal);
            res.send(targets);           
        });

        function zeroPad(num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }

        function generateObjects(number) {
            var objects = [];
            for (var i = 0; i < number; i++) {
                objects.push({  "id": i,
                                "type": "MeContext",
                                "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS"+zeroPad(i,5),
                                "namespace": "OSS_TOP",
                                "name": "LTE09dg2ERBS"+zeroPad(i,5),
                                "attributes": { "neType": "RadioNode"} });
            }
            return objects;
        }

        app.get('/object-configuration/v4/collections', function(req, res) {
            var objects = generateObjects(numberTargetToAdd);
            res.send({
                "id": "281495839389642",
                "name": "auto_generated_1511195552409",
                "owner": "networkexplorer",
                "sharing": "private",
                "type": "LEAF",
                "timeCreated": 1597659851011,
                "timeUpdated": 1597659882013,
                "isCustomTopology": null,
                "userPermissions": {
                    "deletable": true,
                    "updateable": true
                },
                "contentsUpdatedTime": 1597659882012,
                "contents":objects
            })
        });

        function generatePOlist(number) {
            var poList = [];
            for (var i = 0; i < number; i++) {
                poList.push({
                            "moName": "Target" + i,
                            "moType": "NetworkElement",
                            "poId": i,
                            "attributes": {
                                "neType": "MINI-LINK-6352"
                            },
                            "mibRootName": "Target" + i,
                            "parentRDN": ""
                        });
            }
            return poList;
        }
        
//        app.get('/topologyCollections/staticCollections/281474978113727', function(req, res) {
//                var poList = generatePOlist(numberTargetToAdd);
//                res.send({
//                        "details": {
//                            "name": "auto_generated_1511195552409",
//                            "type": "Collection",
//                            "poId": "281474978113727",
//                            "attributes": {
//                                "category": "autoGenerated",
//                                "name": "auto_generated_1511195552409",
//                                "userId": "networkexplorer",
//                                "moList": ["281484217776613", "281484217717872"],
//                                "timeCreated": "1511195552323",
//                                "lastUpdated": "1511195552323"
//                            },
//                            "deletable": true
//                        },
//                        "poList": poList
//                    })
//                });

        app.get('/topologyCollections/savedSearches/281474978988097', function(req, res) {
            res.send({
                    "poId":"281474978988097",
                    "name":"emptySearch",
                    "searchQuery":"NetworkElement*",
                    "attributes":{
                        "category":"Public",
                        "userId":"administrator",
                        "name":"emptySearch",
                        "searchQuery":"NetworkElement*",
                        "lastUpdated":null,
                        "timeCreated":1527673483495
                    },
                    "deletable":true,
                    "update":true,
                    "delete":true,
                    "type":"SavedSearch"
                })
        });

        app.get("/managedObjects/query/*", function(req, res) {
            res.send({
                "poList":[],
                "attributes":[],
                "attributeMappings":[],
                "metadata":{
                    "SORTABLE":true,
                    "RESULT_SET_TOTAL_SIZE":0,
                    "MAX_UI_CACHE_SIZE":100000,
                    "INFO_MESSAGE":2001
                }
            });
        });

        app.put("/oss/idm/targetgroupmanagement/targetgroups/:targetgroupname/description", function(req, res) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            console.log(req);
            res.status(200).send({name: req.params.targetgroupname, description: req.body.description, isDefault: false});
        });

        app.get('oss/idm/targetgroupmanagement/targetgroups/:targetgroupname', function(req, res) {
                res.send({
                    "name": req.params.targetgroupname,
                    "description": "demo",
                    "isDefault": false
                });
            });
            /** DELETE role with specified name **/
            app.delete(URL + "/:name", function(req, res) {
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                var tmpTg = targetGroups.filter(function(tg) {
                    return tg.name === req.params.name;
                })[0];
                if (tmpTg.iec) {
                    console.log("TARGET GROUP NOT DELETED");
                    var tgToSend = {
                        internalErrorCode: tmpTg.iec,
                        httpStatusCode: tmpTg.hsc,
                        message: "Error"
                    }
                    res.status(tmpTg.hsc).send(JSON.stringify(tgToSend));
                } else {
                    var roleName = req.params.name;
                    console.log("Debug: Deleting role " + roleName);
                    for (var i = 0; i < targetGroups.length; i++) {
                        if (targetGroups[i].name == req.params.name) {
                            var role = targetGroups[i];
                            targetGroups.splice(i, 1);
                            res.status(204).send('{"success": "No content."}');
                            return;
                        }
                    }
                    res.status(404).send('{"error":"Role with name: ' + req.params.name + ' was not found"}');
                }
            }); console.log("Started REST API");
        }

        
        function generateRandomTargetGroup(id) {
            var USA = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
            var EUROPE = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "United Kingdom"];
            var USA_CITIES = ["Washington", "Memphis", "Boston", "Nashville", "Baltimore", "Oklahoma City", "Portland", "Las Vegas", "Louisville", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Long Beach", "Kansas City", "Mesa", "Atlanta", "Virginia Beach", "Omaha", "Colorado Springs", "Raleigh", "Miami", "Oakland", "Minneapolis", "Tulsa", "Cleveland", "Wichita", "New Orleans", "Arlington", "Bakersfield", "Tampa", "Aurora", "Honolulu", "Anaheim", "Santa Ana", "Corpus Christi", "Riverside", "St. Louis", "Lexington", "Pittsburgh", "Stockton", "Anchorage", "Cincinnati", "Saint Paul", "Greensboro", "Toledo", "Newark", "Plano", "Henderson", "Lincoln", "Orlando", "Jersey City", "Chula Vista", "Buffalo", "Fort Wayne", "Chandler", "St. Petersburg", "Laredo", "Durham", "Irvine", "Madison", "Norfolk", "Lubbock", "Gilbert", "Winston–Salem", "Glendale", "Reno", "Hialeah", "Garland", "Chesapeake", "Irving", "North Las Vegas", "Scottsdale", "Baton Rouge", "Fremont", "Richmond", "Boise", "San Bernardino"];
            var EUROPE_CITIES = ["London", "Berlin", "Madrid", "Rome", "Paris", "Bucharest", "Vienna", "Hamburg", "Budapest", "Warsaw", "Barcelona", "Munich", "Milan", "Prague", "Sofia", "Brussels", "Birmingham", "Cologne", "Naples", "Stockholm", "Turin", "Marseille", "Amsterdam", "Zagreb", "Valencia", "Kraków", "Leeds", "Łódź", "Frankfurt", "Seville", "Palermo", "Zaragoza", "Riga", "Athens", "Wrocław", "Helsinki", "Rotterdam", "Stuttgart", "Düsseldorf", "Glasgow", "Genoa", "Copenhagen", "Dortmund", "Essen", "Málaga", "Sheffield", "Lisbon", "Poznań", "Bremen", "Gothenburg"];
            var name = '';
            var description = '';
            switch (Math.floor(Math.random() * 2)) {
                case 0:
                    name = 'USA_' + USA[Math.floor(Math.random() * (USA.length - 1))];
                    description = 'Target gorup for USA';
                    targets = (function(targets) {
                        var tgs = [];
                        for (var i = Math.floor(Math.random() * 40) - 1; i >= 0; i--) {
                            tgs.push(targets[Math.floor(Math.random() * (targets.length - 1))]);
                        };
                        return tgs;
                    })(USA_CITIES);
                    break;
                case 1:
                    name = 'Europe_' + EUROPE[Math.floor(Math.random() * 27)];
                    description = 'Target group for Europe region';
                    targets = (function(targets) {
                        var tgs = [];
                        for (var i = Math.floor(Math.random() * 40) - 1; i >= 0; i--) {
                            tgs.push(targets[Math.floor(Math.random() * (targets.length - 1))]);
                        };
                        return tgs;
                    })(EUROPE_CITIES);
                    break;
                case 2:
                    name = 'Moon';
                    description = 'Outer space targets';
                    targets = ["American_Flag", "American_Foot_Step"];
                    break;
                default:
                    name = '[ERROR]';
                    break;
            }
            name = name + id;
            return {
                'id': name,
                'name': name,
                'description': description,
                'targets': targets
            }
        }

        function errorJson(codeDescription) {
            return '{"error": "' + codeDescription + '"}';
        };
