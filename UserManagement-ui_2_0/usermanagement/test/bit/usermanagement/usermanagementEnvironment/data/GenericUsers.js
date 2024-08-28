define(function() {
    'use strict';

    return function(numberGenericOfUsers) {

        var users = [];

        for (var i = 0; i < numberGenericOfUsers; i++) {
            users.push({
                'username': 'user_' + i,
                'password': '********',
                'status': 'enabled',
                'name': 'name_' + i,
                'surname': 'surname_' + 1,
                'description': 'any text',
                'email': 'user_' + i + '@enm.com',
                'previousLogin': null,
                'lastLogin': '20151125183300+0000',
                'failedLogins': 0
            });
        }

        return users;
    };

});