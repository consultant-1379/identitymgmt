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
            'authMode': 'local',
            'email': 'user_00' + i + '@enm.com',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0
        });
    }

    for (var i = 10; i < 100; i++) {
        users.push({
            'username': 'user_0' + i,
            'password': '********',
            'status': 'disabled',
            'name': 'name_0' + i,
            'surname': 'surname_0' + i,
            'description': 'any text' + i,
            'authMode': 'local',
            'email': 'user_0' + i + '@enm.com',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0
        });
    }

    for (var i = 100; i < 149; i++) {
        users.push({
            'username': 'user_' + i,
            'password': '********',
            'status': 'enabled',
            'name': 'name_' + i,
            'surname': 'surname_' + i,
            'description': 'any text' + i,
            'authMode': 'local',
            'email': 'user_' + i + '@enm.com',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0
        });
    }
    return users;
});