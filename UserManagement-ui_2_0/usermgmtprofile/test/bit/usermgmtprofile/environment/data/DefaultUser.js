define(function() {
    'use strict';

    return {
        'username': 'administrator',
        'password': '********',
        'status': 'enabled',
        'name': 'security',
        'surname': 'admin',
        'email': 'security@administrator.com',
        'previousLogin': null,
        'lastLogin': '20151125183300+0000',
        'failedLogins': 0,
        'passwordResetFlag': true,
        'passwordAgeing' : {
            'customizedPasswordAgeingEnable': false,
            'passwordAgeingEnable': false,
            'pwdMaxAge': '',
            'pwdExpireWarning':'',
            'graceLoginCount': '0'
        }
    };
});