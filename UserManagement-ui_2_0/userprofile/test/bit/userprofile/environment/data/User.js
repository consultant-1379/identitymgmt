define(function() {
    'use strict';

    return [
       {
            'username': 'administrator',
            'password': '********',
            'status': 'enabled',
            'name': 'security',
            'surname': 'admin',
            'description': 'Any description',
            'email': 'security@administrator.com',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0,
            'roles': 'SECURITY_ADMIN'
        }, {
            'username': 'regular_user',
            'password': '********',
            'status': 'enabled',
            'name': 'regular',
            'surname': 'user',
            'description': 'Any description',
            'email': 'regular_user@regular.user',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0,
            'roles': 'REGULAR_USER'
           }, {
            'username': 'federated_user',
            'password': '********',
            'status': 'enabled',
            'name': 'federated',
            'surname': 'user',
            'authMode': "federated",
            'description': 'Any description',
            'email': 'regular_user@federated.user',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0,
            'roles': 'FEDERATED_USER'
           }
       ];
   });