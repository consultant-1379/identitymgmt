define(function() {
    'use strict';
    var sortedAsc = [{
        'itemId': 'AUser6',
        'columns': ['',
            'AUser6',
            'Disabled',
            'AUserName6',
            'AUserSurname6',
            'desc6',
            'Local',
            'AUser6@enm.com',
            'Not Applicable',
            '2014/11/25 18:33:00'
        ]
    }, {
        'itemId': 'KUser4',
        'columns': ['',
            'KUser4',
            'Disabled',
            'KUserName4',
            'KUserSurname4',
            'desc4',
            'Local',
            'KUser4@enm.com',
            'Not Applicable',
            '2015/01/25 18:33:00'
        ]
    }, {
        'itemId': 'FUser9',
        'columns': ['',
            'FUser9',
            'Enabled',
            'FUserName9',
            'FUserSurname9',
            'desc9',
            'Local',
            'FUser9@enm.com',
            'Not Applicable',
            '2015/04/25 19:33:00'
        ]
    }, {
        'itemId': 'TUser10',
        'columns': ['',
            'TUser10',
            'Disabled',
            'TUserName10',
            'TUserSurname10',
            'desc10',
            'Local',
            'TUser10@enm.com',
            'Not Applicable',
            '2015/06/06 19:33:00'
        ]
    }, {
        'itemId': 'AUser1',
        'columns': ['',
            'AUser1',
            'Enabled',
            'AUserName1',
            'AUserSurname1',
            'desc1',
            'Local',
            'AUser1@enm.com',
            'Not Applicable',
            '2015/11/25 18:33:00'
        ]
    }, {
        'itemId': 'PUser3',
        'columns': ['',
            'PUser3',
            'Enabled',
            'PUserName3',
            'PUserSurname3',
            'desc3',
            'Local',
            'PUser3@enm.com',
            'Not Applicable',
            '2015/11/26 18:33:00'
        ]
    }, {
        'itemId': 'OUser8',
        'columns': ['',
            'OUser8',
            'Disabled',
            'OUserName8',
            'OUserSurname8',
            'desc8',
            'Local',
            'OUser8@enm.com',
            'Not Applicable',
            '2015/11/30 18:33:00'
        ]
    }, {
        'itemId': 'MUser7',
        'columns': ['',
            'MUser7',
            'Enabled',
            'MUserName7',
            'MUserSurname7',
            'desc7',
            'Local',
            'MUser7@enm.com',
            'Not Applicable',
            '2015/12/25 18:33:00'
        ]
    }, {
        'itemId': 'DUser5',
        'columns': ['',
            'DUser5',
            'Enabled',
            'DUserName5',
            'DUserSurname5',
            'desc5',
            'Local',
            'DUser5@enm.com',
            'Not Applicable',
            '2016/02/18 18:33:00'
        ]
    }, {
        'itemId': 'ZUser2',
        'columns': ['',
            'ZUser2',
            'Disabled',
            'ZUserName2',
            'ZUserSurname2',
            'desc2',
            'Local',
            'ZUser2@enm.com',
            'Not Applicable',
            '2016/03/25 18:33:00'
        ]
    }];

    var sortedDesc = [{
        'itemId': 'ZUser2',
        'columns': ['',
            'ZUser2',
            'Disabled',
            'ZUserName2',
            'ZUserSurname2',
            'desc2',
            'Local',
            'ZUser2@enm.com',
            'Not Applicable',
            '2016/03/25 18:33:00'
        ]
    }, {
        'itemId': 'DUser5',
        'columns': ['',
            'DUser5',
            'Enabled',
            'DUserName5',
            'DUserSurname5',
            'desc5',
            'Local',
            'DUser5@enm.com',
            'Not Applicable',
            '2016/02/18 18:33:00'
        ]
    }, {
        'itemId': 'MUser7',
        'columns': ['',
            'MUser7',
            'Enabled',
            'MUserName7',
            'MUserSurname7',
            'desc7',
            'Local',
            'MUser7@enm.com',
            'Not Applicable',
            '2015/12/25 18:33:00'
        ]
    }, {
        'itemId': 'OUser8',
        'columns': ['',
            'OUser8',
            'Disabled',
            'OUserName8',
            'OUserSurname8',
            'desc8',
            'Local',
            'OUser8@enm.com',
            'Not Applicable',
            '2015/11/30 18:33:00'
        ]
    }, {
        'itemId': 'PUser3',
        'columns': ['',
            'PUser3',
            'Enabled',
            'PUserName3',
            'PUserSurname3',
            'desc3',
            'Local',
            'PUser3@enm.com',
            'Not Applicable',
            '2015/11/26 18:33:00'
        ]
    }, {
        'itemId': 'AUser1',
        'columns': ['',
            'AUser1',
            'Enabled',
            'AUserName1',
            'AUserSurname1',
            'desc1',
            'Local',
            'AUser1@enm.com',
            'Not Applicable',
            '2015/11/25 18:33:00'
        ]
    }, {
        'itemId': 'TUser10',
        'columns': ['',
            'TUser10',
            'Disabled',
            'TUserName10',
            'TUserSurname10',
            'desc10',
            'Local',
            'TUser10@enm.com',
            'Not Applicable',
            '2015/06/06 19:33:00'
        ]
    }, {
        'itemId': 'FUser9',
        'columns': ['',
            'FUser9',
            'Enabled',
            'FUserName9',
            'FUserSurname9',
            'desc9',
            'Local',
            'FUser9@enm.com',
            'Not Applicable',
            '2015/04/25 19:33:00'
        ]
    }, {
        'itemId': 'KUser4',
        'columns': ['',
            'KUser4',
            'Disabled',
            'KUserName4',
            'KUserSurname4',
            'desc4',
            'Local',
            'KUser4@enm.com',
            'Not Applicable',
            '2015/01/25 18:33:00'
        ]
    }, {
        'itemId': 'AUser6',
        'columns': ['',
            'AUser6',
            'Disabled',
            'AUserName6',
            'AUserSurname6',
            'desc6',
            'Local',
            'AUser6@enm.com',
            'Not Applicable',
            '2014/11/25 18:33:00'
        ]
    }];
    var users = {
        'sortedDesc': sortedDesc,
        'sortedAsc': sortedAsc
    };
    return users;

});
