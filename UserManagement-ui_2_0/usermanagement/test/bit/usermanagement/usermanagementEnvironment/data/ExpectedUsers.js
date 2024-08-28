define(function() {
    'use strict';

    var users = [];

    users.push({
        'itemId': 'administrator',
        'columns': ['',
            'administrator',
            'Enabled',
            'security',
            'admin',
            'any text',
            'Local',
            'security@administrator.com',
            'Not Applicable',
            '11/25/2015, 18:33:00 GMT'
        ]
    });

    for (var i = 0; i < 10; i++) {
        users.push({
            'itemId': 'user_00' + i,
            'columns': ['',
                'user_00' + i,
                'Enabled',
                'name_00' + i,
                'surname_00' + i,
                'any text' + i,
                'Local',
                'user_00' + i + '@enm.com',
                'Not Applicable',
                '11/25/2015, 18:33:00 GMT'
            ]
        });
    }

    for (var i = 10; i < 100; i++) {
        users.push({
            'itemId': 'user_0' + i,
            'columns': ['',
                'user_0' + i,
                'Disabled',
                'name_0' + i,
                'surname_0' + i,
                'any text' + i,
                'Local',
                'user_0' + i + '@enm.com',
                'Not Applicable',
                '11/25/2015, 18:33:00 GMT'
            ]
        });
    }

    for (var i = 100; i < 149; i++) {
        users.push({
            'itemId': 'user_' + i,
            'columns': ['',
                'user_' + i,
                'Enabled',
                'name_' + i,
                'surname_' + i,
                'any text' + i,
                'Local',
                'user_' + i + '@enm.com',
                'Not Applicable',
                '11/25/2015, 18:33:00 GMT'
            ]
        });
    }

    return users;

});
