define(function() {
    'use strict';

    return [
        {
            "allowDataModification": [{
                    "name": "personals",
                    "enabled": true
                }, {
                    "name": "email",
                    "enabled": true
                }
            ]
        }, {
            "allowDataModification": [{
                    "name": "personals",
                    "enabled": false
                }, {
                    "name": "email",
                    "enabled": false
                }
            ]
        }
    ];
});


