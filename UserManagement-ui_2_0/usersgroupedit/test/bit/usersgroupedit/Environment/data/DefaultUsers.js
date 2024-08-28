define(function() {
    'use strict';

    return [{
        'username': 'administrator',
        'password': '********',
        'status': 'enabled',
        'name': 'security',
        'surname': 'admin',
        'description': null,
        'email': 'security@administrator.com',
        'previousLogin': null,
        'lastLogin': '20151125183300+0000',
        'failedLogins': 0,
        'authMode' : 'local'
    }, {
        'username': 'operatornotsecurityadmin',
        'password': '********',
        'status': 'enabled',
        'name': 'operator',
        'surname': 'nosecurityprivileges',
        'description': null,
        'email': 'operator@nousermanagement.com',
        'previousLogin': null,
        'lastLogin': '20151125183300+0000',
        'failedLogins': 0,
        'authMode' : 'local'
    }, {
        'username': 'securityadminuser',
        'password': '********',
        'status': 'enabled',
        'name': 'security',
        'surname': 'admin',
        'description': null,
        'email': 'securityadminuser@ericsson.com',
        'previousLogin': null,
        'authMode' : 'local'
    }, {
        'username': 'securityuser',
        'password': '********',
        'status': 'enabled',
        'name': 'securityuser',
        'surname': 'securityuserprivileges',
        'description': null,
        'email': 'securityuser@nousermanagement.com',
        'previousLogin': null,
        'lastLogin': '20150825183300+0000',
        'failedLogins': 0,
        'authMode' : 'local'
    }];

});