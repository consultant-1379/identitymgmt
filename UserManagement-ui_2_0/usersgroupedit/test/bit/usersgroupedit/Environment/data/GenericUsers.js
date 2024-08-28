define(function() {
    'use strict';

    return function(numberGenericOfUsers, options) {

        var users = [];
        options = options || {};
        users.push({
            'username': 'administrator',
            'password': '********',
            'status': options.status || 'enabled',
            'name': 'sec',
            'surname': 'admin',
            'description': options.description || null,
            'email': 'sec_admin@enm.com',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0,
            'authMode' : 'local'
        });
        for (var i = 0; i < numberGenericOfUsers; i++) {
            users.push({
                'username': 'user_' + i,
                'password': '********',
                'status': options.status || (i % 2 ? 'enabled' : 'disabled'),
                'name': 'name_' + i,
                'surname': 'surname_' + i,
                'description': options.description || null,
                'email': 'user_' + i + '@enm.com',
                'previousLogin': null,
                'lastLogin': '20151125183300+0000',
                'failedLogins': 0,
                'authMode' : 'local'
            });
        }

        return users;
    };

});
