define(function() {
    'use strict';

    return function(username, authMode) {

        return {
            'username': username,
            'password': '********',
            'status': 'enabled',
            'name': 'name_' + username,
            'surname': 'surname_' + username,
            'email': username + '@enm.com',
            'previousLogin': null,
            'lastLogin': '20151125183300+0000',
            'failedLogins': 0,
            'authMode': authMode,
            'passwordAgeing' : {
                'customizedPasswordAgeingEnable': true,
                'passwordAgeingEnable': true,
                'pwdMaxAge': '90',
                'pwdExpireWarning': '7',
                'graceLoginCount': '0'
            }
        };
    };

});