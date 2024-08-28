module.exports = function(app) {
    var countOdpProfiles = 1;

    var DATA = {
        tgs: [{
            name: 'ALL',
            description: 'All TGS',
            isDefault: true
        }, {
            name: 'TG1',
            description: 'Description TG1',
            isDefault: true
        }, {
            name: 'TG2',
            description: 'Description TG2',
            isDefault: true
        }, {
            name: 'TG3',
            description: 'Description TG3',
            isDefault: true
        }]
    };

    var pwdAgeing = {
        "enabled":true,
        "pwdMaxAge":60,
        "pwdExpireWarning":5,
        "graceLoginCount":3
    };

    var odpProfiles = [{
        applicationName: "AMOS",
        profiles: [ { name: "Small AMOS", description: "1 cpu 200M" },
                    { name: "Medium AMOS", description: "2 cpu 400M" },
                    { name: "Large AMOS", description: "4 cpu 800M" } ]
    },
    {
        applicationName:"General Scripting",
        profiles: [ { name: "Small General Scripting", description: "1 cpu 300M" },
                    { name: "Medium General Scripting", description: "2 cpu 600M" },
                    { name: "Large General Scripting", description: "4 cpu 900M" } ]
    },
    {
        applicationName: "Winfiol",
        profiles: [ { name: "Small Winfiol", description: "1 cpu 210M" },
                    { name: "Medium Winfiol", description: "2 cpu 420M" },
                    { name: "Large Winfiol", description: "4 cpu 630M" } ]
    },
    {
        applicationName: "Element Manager",
        profiles: [ { name: "Small Element Manager", description: "1 cpu 220M" },
                    { name: "Medium Element Manager", description: "2 cpu 440M" },
                    { name: "Large Element Manager", description: "3 cpu 660M" } ]
    },
    {
        applicationName: "OPS",
        profiles: [ { name: "Small OPS", description: "1 cpu 310M" },
                    { name: "Medium OPS", description: "2 cpu 620M" },
                    { name: "Large OPS", description: "4 cpu 930M" } ]
    }];


    var userSettings = {
        "allowDataModification": [{
                name: "personals",
                enabled: true
            }, {
                name: "email",
                enabled: true
            }
        ]
    };

    var USER_L = 1001;
    var ROLE_L = 10;
    var PRIVILEGES_PER_USER = 3;

    var loggedInUser = {
        username: "administrator",
        password: "********",
        status: "enabled",
        name: "security",
        surname: "admin",
        description: null,
        email: "security@administrator.com",
        previousLogin: null,
        lastLogin: "20160127122532+0000",
        failedLogins: 0,
        authMode: 'local',
        passwordChangeTime: (Math.random() >= 0.5) ? '20160110172339+0000' : '20151010172339+0000',
        passwordAgeing : {
            customizedPasswordAgeingEnable: true,
            passwordAgeingEnable: pwdAgeing.enabled,
            pwdMaxAge:pwdAgeing.pwdMaxAge,
            pwdExpireWarning:pwdAgeing.pwdExpireWarning,
            graceLoginCount:pwdAgeing.graceLoginCount
        },
        odpProfiles: [
            {
                applicationName: "AMOS",
                profileName: "Large AMOS"
            },
            {
                applicationName: "General Scripting",
                profileName: "Small General Scripting"
            },
            {
                applicationName: "Winfiol",
                profileName: "Medium Winfiol"
            },
            {
              applicationName: "Element Manager",
              profileName: "Medium Element Manager"
            },
            {
              applicationName: "OPS",
              profileName: "Large OPS"
            }
          ],
        privileges: []
    };

    function generateCredentialStatus(size) {
        var credentialsStatus = [];
        credentialsStatus.push({user: loggedInUser.username, status: 'ACTIVE'});
        if (size > 0) {
            var sizeTurn = Math.floor(size / 3);
            var sizeStatus = Math.floor(sizeTurn / 5);
            for (var j = 0; j < 3; j++) {
                for (var i = sizeTurn * j; i < sizeTurn*j + sizeTurn - 1; i++) {
                    if (i < sizeStatus + sizeTurn*j)
                        credentialsStatus.push({user: 'user' + i, status: 'NEW'});
                    else if (i < 2 * sizeStatus + sizeTurn*j)
                        credentialsStatus.push({user: 'user' + i, status: 'ACTIVE'});
                    else if (i < 3 * sizeStatus + sizeTurn*j)
                        credentialsStatus.push({user: 'user' + i, status: 'INACTIVE'});
                    else if (i < 4 * sizeStatus + sizeTurn*j)
                        credentialsStatus.push({user: 'user' + i, status: 'DELETED'});
                }
            }
        }
        return credentialsStatus;
    }

    function generateUsers(size) {
        var users = [];

        users.push(loggedInUser);
        if (size > 0) {
            var sizeNotLocal = Math.floor(size / 2);
            var sizeLocal = size - sizeNotLocal;
            var sizeFederated = Math.floor(sizeNotLocal / 2);
            var sizeRemote = sizeNotLocal - sizeFederated;
            var authMode = 'local';
            for (var i = 0; i < size - 1; i++) {
                if (i < sizeLocal) {
                    authMode = 'local';
                } else if (i >= sizeLocal && i < sizeLocal+sizeRemote) {
                    authMode = 'remote';
                } else {
                    authMode = 'federated';
                }

                users.push({
                    username: 'user' + i,
                    password: "********",
                    status: ['enabled', 'disabled'][Math.floor((Math.random() * 2))],
                    name: 'User' + i,
                    surname: 'Sur' + i,
                    description: [null, 'Description' + i][Math.floor((Math.random() * 2))],
                    email: 'user' + i + '@enm.com',
                    previousLogin: null,
                    lastLogin: [null, '20150910172339+0000'][Math.floor((Math.random() * 2))],
                    failedLogins: [0, Math.floor(Math.random() * 151)][Math.floor((Math.random() * 2))],
                    passwordChangeTime: (Math.random() >= 0.5) ? '20160110172339+0000' : '20151010172339+0000',
                    passwordAgeing : {},
                    odpProfiles: [],
                    authMode: authMode,
                    privileges: [{
                        role: 'role1',
                        targetGroup: 'TG1'
                    }, {
                        role: 'role1',
                        targetGroup: 'TG2'
                    }, {
                        role: 'role1',
                        targetGroup: 'TG3'
                    }, {
                        role: 'role2',
                        targetGroup: 'TG1'
                    }, {
                        role: 'role2',
                        targetGroup: 'TG2'
                    } ]
                });
            }
        }
        return users;
    }

    function generateRoles(size) {

        var roles = [];

        for (var i = 0; i < 3; i++) {
            roles.push({
                name: 'role' + i,
                type: 'com',
                description: 'Role ' + i + ' description.',
                status: 'ENABLED'
            });
        }

        for (var i = 3; i < size; i++) {
            roles.push({
                name: 'role' + i,
                type: ['com', 'comalias', 'system', 'custom', 'application', 'cpp'][Math.floor((Math.random() * 5))],
                description: 'Role ' + i + ' description.',
                status: ['ENABLED', 'DISABLED', 'DISABLED_ASSIGNMENT'][Math.floor((Math.random() * 3))]
            });
        }
        roles.push({
              name: 'administrator',
              type: 'system',
              descripton: 'administrator role description',
              status: 'ENABLED'});
        roles.push({
              name: 'SECURITY_ADMIN',
              type: 'system',
              descripton: 'SECURITY_ADMIN role description',
              status: 'ENABLED'});


        return roles;
    }

    function generatePrivileges(data, usersSize, rolesSize, privilegesPerUser) {

        var privileges = [];
        privileges.push({
            "user": "administrator",
            "role": "administrator",
            "targetGroup": "tg3"
        },{
            "user": "administrator",
            "role": "SECURITY_ADMIN",
            "targetGroup": "ALL"
        });
        for (var i = 0; i < usersSize; i++) {
            for (var j = 0; j < privilegesPerUser; j++) {
                privileges.push({
                    "user": data.users[i].username,
                    // "user": data.users.map(function(user) {
                    //     return user.username
                    // })[Math.floor((Math.random() * usersSize))],
                    "role": data.roles.map(function(role) {
                        return role.name;
                    })[Math.floor((Math.random() * rolesSize))],
                    "targetGroup": data.tgs.map(function(tg) {
                        return tg.name;
                    })[Math.floor((Math.random() * data.tgs.length))]
                });
            }
        }

        return privileges;
    }

    function generateData(data, usersSize, rolesSize, privilegesPerUser) {

        //var data = {};
        // USERS
        if (data.users) {
            if (data.users.length !== usersSize) {
                data.users = generateUsers(usersSize);
            }
        } else {
            data.users = generateUsers(usersSize);
        }

        // ROLES
        if (data.roles) {
            if (data.roles.length !== rolesSize) {
                data.roles = generateRoles(rolesSize);
            }
        } else {
            data.roles = generateRoles(rolesSize);
        }

        // PRIVILEGES
        data.privileges = generatePrivileges(data, usersSize, rolesSize, privilegesPerUser);

        return data;
    }

    generateData(DATA, USER_L, ROLE_L, PRIVILEGES_PER_USER);

    // LOCAL SERVE SETTINGS
    app.get('/localserver/settings', function(req, res) {

        if (req.query.users)
            USER_L = req.query.users;

        if (req.query.roles)
            ROLE_L = req.query.roles;

        if (req.query.privilegesperuser)
            PRIVILEGES_PER_USER = req.query.privilegesperuser;

        generateData(DATA, USER_L, ROLE_L, PRIVILEGES_PER_USER);

        res.send("DATA generated (users=" + USER_L + ", roles=" + ROLE_L + ", privilegesperuser=" + PRIVILEGES_PER_USER + ")");
    });

    // get users
    app.get('/oss/idm/usermanagement/users', function(req, res) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.send(DATA.users);
    });

    //get pwd ageing
    app.get('/oss/idm/config/passwordsettings/enmuser/passwordageing', function(req, res) {
        res.send(pwdAgeing);
    });

    app.get('/oss/idm/usermanagement/odpprofiles', function(req, res) {
        if (countOdpProfiles === 1) {
           countOdpProfiles++;
           res.send(odpProfiles);
        } else if (countOdpProfiles === 2) {
           countOdpProfiles++;
           res.send([]);
        } else if (countOdpProfiles === 3) {
           countOdpProfiles++;
           res.status(404).send(
                           {
                             "httpStatusCode": 404,
                             "time": "2020-01-29T18:54:27",
                             "links": [],
                             "errorData": null
                           }
           );
        } else {
        countOdpProfiles = 1;
                      res.status(500).send(
                           {
                             "userMessage": "InternalError",
                             "httpStatusCode": 500,
                             "internalErrorCode": "UM-3-read",
                             "developerMessage": "Internal Error",
                             "time": "2020-01-29T18:54:27",
                             "links": [],
                             "errorData": null
                           }
                       );
        }
    });

    app.get('/oss/idm/config/usersettings', function(req, res) {
        res.send(userSettings);
    });

    app.put('/oss/idm/config/usersettings', function(req, res) {
        res.send(userSettings);
    });

    // get user
    app.get('/oss/idm/usermanagement/users/:username', function(req, res) {

        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        var user = DATA.users.filter(function(user) {
            return user.username == req.params.username;
        })[0];

        res.send(user);
    });

    // get target groups
    app.get('/oss/idm/targetgroupmanagement/targetgroups', function(req, res) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.send(DATA.tgs);
    });

    // get privileges
    app.get('/oss/idm/usermanagement/users/:username/privileges', function(req, res) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        var privileges = DATA.privileges.filter(function(privilege) {
            return privilege.user == req.params.username;
        });
        res.send(privileges);
    });

    // create user
    app.post('/oss/idm/usermanagement/users', function(req, res) {
        var index = DATA.users.map(function(user) {
            return user.username;
        }).indexOf(req.body.username);

        // check if element not exists
        if (index === -1) {
            DATA.users.push(req.body);
        } else {
            // TODO: return 422
        }

        res.send(req.body);
    });

    // update user
    app.put('/oss/idm/usermanagement/users/:username', function(req, res) {
        var index = DATA.users.map(function(user) {
            return user.username;
        }).indexOf(req.params.username);

        // check if element exists
        if (index !== -1) {
            DATA.users[index] = req.body;
        } else {
            // TODO: return if not found
        }

        res.send(req.body);
    });

    app.delete('/oss/idm/usermanagement/users/:username', function(req, res) {
        var index = DATA.users.map(function(user) {
            return user.username;
        }).indexOf(req.params.username);

        // check if element exists
        if (index !== -1) {
            DATA.users.splice(index, 1);           
        } else {
            // TODO: return if not found
        }

        if (req.params.username == 'user100') {
            res.status(502).send();
        } else {
            res.send();
        }
    });

    app.get('/oss/idm/rolemanagement/roles', function(req, res) {
        res.send(DATA.roles);
    });

    app.put('/oss/idm/usermanagement/modifyprivileges', function(req, res) {
        // TODO: handle add and remove privelages
        res.send([]);
    });

    app.get('/oss/idm/usermanagement/privileges', function(req, res) {
        res.send(DATA.privileges);
    });

    app.get('/rest/system/time', function(req, res) {
        res.send({
            "timestamp": 1453897940451,
            "utcOffset": 0.0,
            "timezone": "IST",
            "serverLocation": "Eire"
        });
    });

    app.get('/oss/sls/users', function(req, res) {
        res.send(generateCredentialStatus(USER_L));
    });

    app.get('/sso-utilities-service/ssoutils/activeUsers', function(req, res) {
        res.send([]);
    });

    app.get('/oss/sso/utilities/users', function(req, res) {
        res.send({
            "users": {
                "administrator": 4
            }
        });
    });

    app.get('/rest/apps', function(req, res) {
        res.send([{
            "id": "user_management",
            "name": "User Management",
            "shortInfo": "User Management is a web based application that allows the Security Administrator to create, delete users and provide them access to ENM tools.",
            "acronym": null,
            "hidden": false,
            "resources": null,
            "roles": "",
            "favorite": "false",
            "path": "/#usermanagement",
            "host": "enmapache.athtem.eei.ericsson.se",
            "port": "",
            "protocol": "https",
            "consumes": null,
            "uri": "/rest/apps/web/user_management",
            "targetUri": "https://enmapache.athtem.eei.ericsson.se/#usermanagement"
        }, {
            "id": "role_management"
        }]);
    });

    app.get('/editprofile', function(req, res) {
        res.send(loggedInUser);
    });

    //if rules are changed the POST must be updated too
    app.get('/oss/idm/usermanagement/users/validationrules/password*', function(req, res) {
        res.send([{
            "name": "maximumLength",
            "value": 32
        }, {
            "name": "minimumLength",
            "value": 8
        }, {
            "name": "minimumLowerCase",
            "value": 1
        }, {
            "name": "minimumUpperCase",
            "value": 1
        }, {
            "name": "minimumDigits",
            "value": 1
        }]);
    });

    app.post('/oss/idm/usermanagement/users/validate/password*', function(req, res) {
	    var maximumLength = true, minimumLength = true, minimumLowerCase = true, minimumUpperCase = true, minimumDigits = true;
	    if (req.body.attributeValue) {
	        if (req.body.attributeValue.length > 32)
	            maximumLength = false;
		    if (req.body.attributeValue.length < 8)
		        minimumLength = false;
		    if (req.body.attributeValue.search(/[A-Z]/) === -1)
		        minimumLowerCase = false;
		    if (req.body.attributeValue.search(/[a-z]/) === -1)
		        minimumUpperCase = false;
		    if (req.body.attributeValue.search(/[0-9]/) === -1)
                minimumDigits = false;
        }
        res.send([{
            "name": "maximumLength",
            "valid": maximumLength
        }, {
            "name": "minimumLength",
            "valid": minimumLength
        }, {
            "name": "minimumLowerCase",
            "valid": minimumLowerCase
        }, {
            "name": "minimumUpperCase",
            "valid": minimumUpperCase
        }, {
            "name": "minimumDigits",
            "valid": minimumDigits
        }]);
    });

    app.get('/oss/uiaccesscontrol/resources/user_mgmt/actions', function(req, res) {
        res.send({"resource":"user_mgmt","actions":["read","create","update","delete"]});
    });

    app.get('/openidm/policy/managed/user*', function(req, res) {
        switch (req.query.policyName) {

            case 'userName':
                res.send([{
                    "policyId": "required"
                }, {
                    "policyId": "not-empty"
                }, {
                    "policyId": "unique-mixed-case-username"
                }, {
                    "policyId": "no-internal-user-conflict"
                }, {
                    "policyId": "contains-only-characters",
                    "params": {
                        "allowedCharsPattern": "[A-Za-z0-9_\\-\\.]"
                    }
                }]);
                break;

            case 'password':
                res.send([{
                    "policyId": "required"
                }, {
                    "policyId": "not-empty"
                }, {
                    "policyId": "at-least-X-capitals",
                    "params": {
                        "numCaps": 1
                    }
                }, {
                    "policyId": "at-least-X-smalls",
                    "params": {
                        "numCaps": 1
                    }
                }, {
                    "policyId": "at-least-X-numbers",
                    "params": {
                        "numNums": 1
                    }
                }, {
                    "policyId": "minimum-length",
                    "params": {
                        "minLength": 8
                    }
                }, {
                    "policyId": "cannot-contain-others",
                    "params": {
                        "disallowedFields": "userName,firstName,lastName"
                    }
                }, {
                    "policyId": "re-auth-policy-agent",
                    "params": {
                        "exceptRoles": ["openidm-admin", "openidm-reg"]
                    }
                }, {
                    "policyId": "cannot-contain-characters",
                    "params": {
                        "forbiddenChars": ["!", "\"", "#", "$", "%", "^", "&", "'", "(", ")", "*", "+", ",", "/", "|", "\\", ":", ";", "<", ">", "?", "@", "=", "[", "]", "`", "~", "{", "}"]
                    }
                }]);
                break;
        }
    });

    app.get('/oss/fidm/sync/state', function(req, res) {

        var value = Math.floor(Math.random() * 10);
        var operState = ["init", "notConfigured", "disabled", "idle" ,"periodicSyncInProgress", "forcedSyncInProgress", "testSyncInProgress", "forcedDeleteInProgress"]
        if ( value < 8 ) {
            res.send( {
              "adminState" : "enabled",
              "operState" : operState[value-1],
              "progressReport" : ""
            });
        } else {
            res.status(403).send(
                {
                  "userMessage": "The User does not have permissions to perform this action.",
                  "httpStatusCode": 403,
                  "internalErrorCode": "FIDM-3-read",
                  "developerMessage": "com.ericsson.oss.itpf.sdk.security.accesscontrol.SecurityViolationException: access control decision: denied to invoke: read on resource: ext_idp_settings",
                  "time": "2020-01-29T18:54:27",
                  "links": [],
                  "errorData": null
                }
            );
        }
    });

        app.get('/oss/fidm/sync/report', function(req, res) {

        var value = Math.floor(Math.random() * 6);
        var action = ["periodicSync", "forcedSync", "testSync", "forcedDelete"];
        if ( value < 4 ) {
            res.send( {
              "action" : action[value-1]           
            });
        } else if (value == 5) {
           res.status(500).send(
                {
                  "userMessage": "InternalError",
                  "httpStatusCode": 500,
                  "internalErrorCode": "FIDM-3-read",
                  "developerMessage": "Internal Error",
                  "time": "2020-01-29T18:54:27",
                  "links": [],
                  "errorData": null
                }
            );
        } else {
            res.status(403).send(
                {
                  "userMessage": "The User does not have permissions to perform this action.",
                  "httpStatusCode": 403,
                  "internalErrorCode": "FIDM-3-read",
                  "developerMessage": "com.ericsson.oss.itpf.sdk.security.accesscontrol.SecurityViolationException: access control decision: denied to invoke: read on resource: ext_idp_settings",
                  "time": "2020-01-29T18:54:27",
                  "links": [],
                  "errorData": null
                }
            );
        }

    });

};
