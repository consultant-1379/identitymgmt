define(function() {
    'use strict';

    return [{
        'username': 'administrator',
        'password': '********',
        'status': 'enabled',
        'name': 'security',
        'surname': 'admin',
        'description': 'any text',
        'authMode': 'local',
        'email': 'security@administrator.com',
        'previousLogin': null,
        'lastLogin': '20151125183300+0000',
        'failedLogins': 0,
        'passwordResetFlag': false,
        'odpProfiles': [
            {
                'applicationName': 'amos',
                'profileName': 'amosprofile1'
            },{
                'applicationName': 'em',
                'profileName': 'emprofile2'

            }
        ]
    }, {
        'username': 'operatornotsecurityadmin',
        'password': '********',
        'status': 'enabled',
        'name': 'operator',
        'surname': 'nosecurityprivileges',
        'description': 'any text',
        'authMode': 'local',
        'email': 'operator@nousermanagement.com',
        'previousLogin': null,
        'lastLogin': '20151125183300+0000',
        'failedLogins': 0,
        'passwordResetFlag': false,
        'odpProfiles': []
    }, {
        'username': 'securityadminuser',
        'password': '********',
        'status': 'enabled',
        'name': 'security',
        'surname': 'admin',
        'description': 'any text',
        'authMode': 'local',
        'email': 'securityadminuser@ericsson.com',
        'previousLogin': null,
        'failedLogins': 0,
        'passwordResetFlag': false,
        'odpProfiles': [
            {
                 'applicationName': 'em',
                 'profileName': 'emprofile1'
            }
        ]
    }, {
        'username': 'securityuser',
        'password': '********',
        'status': 'enabled',
        'name': 'securityuser',
        'surname': 'securityuserprivileges',
        'description': 'any text',
        'authMode': 'local',
        'email': 'securityuser@nousermanagement.com',
        'previousLogin': null,
        'lastLogin': '20150825183300+0000',
        'failedLogins': 0,
        'passwordResetFlag': true
    }];

});