define(function () {
    'use strict';

    var roles = [];


    for (var i = 0; i < 10; i++) {
        roles.push({
            'itemId': 'role_00' + i,
            'columns': ['', 'role_00' + i, 'ENM System Role', 'mock description','Disabled']
        });
    }

    for (var i = 10; i < 100; i++) {
        roles.push({
            'itemId': 'role_0' + i,
            'columns': ['', 'role_0' + i, 'ENM System Role', 'mock description','Disabled']
        });
    }

    for (var i = 100; i < 150; i++) {
        roles.push({
            'itemId': 'role_' + i,
            'columns': ['', 'role_' + i, 'ENM System Role', 'mock description','Disabled']
        });
    }

    return roles;

});
