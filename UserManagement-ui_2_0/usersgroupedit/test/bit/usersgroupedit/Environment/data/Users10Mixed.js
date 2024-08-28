define(function() {
    'use strict';

    var users = [];

    users.push({
        'username': 'administrator',
        'password': '********',
        'status': 'enabled',
        'name': 'security',
        'surname': 'admin',
        'description': null,
        'email': 'security@administrator.com',
        'previousLogin': null,
        'lastLogin': '20151125183300+0000',
        'failedLogins': 0
    });

    for (var i = 0; i < 5; i++) {
        users.push({
            'username': 'user_' + i,
            'password': '********',
            'status': 'enabled',
            'name': 'name_00' + i,
            'surname': 'surname_00' + i,
            'description': '',
            'email': 'user_00' + i + '@enm.com',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0
        });
    }

    for (var i = 5; i < 10; i++) {
        users.push({
            'username': 'user_' + i,
            'password': '********',
            'status': 'enabled',
            'name': 'name_00' + i,
            'surname': 'surname_00' + i,
            'description': 'description10',
            'email': 'user_00' + i + '@enm.com',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0
        });
    }
    return users;

});