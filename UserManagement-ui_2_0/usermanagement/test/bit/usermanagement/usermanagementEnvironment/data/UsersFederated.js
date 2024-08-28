define(function() {
    'use strict';

    var users = [];

    users.push({
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
        'failedLogins': 0
    });

    for (var i = 0; i < 10; i++) {
        users.push({
            'username': 'user_00' + i,
            'password': '********',
            'status': 'enabled',
            'name': 'name_00' + i,
            'surname': 'surname_00' + i,
            'description': 'any text' + i,
            'authMode': 'federated',
            'email': 'user_00' + i + '@enm.com',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0
        });
    }
    return users;
});