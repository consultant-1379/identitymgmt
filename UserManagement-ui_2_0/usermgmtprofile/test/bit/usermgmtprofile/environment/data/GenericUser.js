define(function() {
    'use strict';

    return function(username, authMode, passwordResetFlag) {

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
            'passwordResetFlag': (passwordResetFlag && passwordResetFlag === true)? true : false,
            'passwordAgeing' : {
                'customizedPasswordAgeingEnable': false,
                'passwordAgeingEnable': false,
                'pwdMaxAge': '',
                'pwdExpireWarning': '',
                'graceLoginCount': '0'
            }
        };
    };

});