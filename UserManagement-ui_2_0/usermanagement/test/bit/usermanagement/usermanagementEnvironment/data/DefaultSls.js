define(function() {
    'use strict';

    return [{
        'user': "securityadminuser",
        'status': 'ACTIVE'
    }, {
        'user': "securityuser",
        'status': 'INACTIVE'
    }, {
        'user': "user_enabled_already_logged_1",
        'status': 'ACTIVE'
    }, {
        'user': "user_enabled_already_logged_2",
        'status': 'INACTIVE'
    }, {
        'user': "user_disabled_already_logged_1",
        'status': 'NEW'
    }, {
        'user': "user_disabled_already_logged_2",
        'status': 'DELETED'
    }, {
        'user': "user_enabled_never_logged_1",
        'status': 'REISSUE'
    }];
});
