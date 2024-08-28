define(function() {
    'use strict';
    var roles = [];

    for (var i = 0; i < 10; i++) {
        roles.push({
            "type": "application",
            "name": "role_00" + i,
            "description": "mock description",
            "status": "DISABLED"
        });
    }

    for (var i = 10; i < 100; i++) {
        roles.push({
            "type": "application",
            "name": "role_0" + i,
            "description": "mock description",
            "status": "DISABLED"
        });
    }

    for (var i = 100; i < 150; i++) {
        roles.push({
            "type": "application",
            "name": "role_" + i,
            "description": "mock description",
            "status": "DISABLED"
        });
    }
    return roles;



});