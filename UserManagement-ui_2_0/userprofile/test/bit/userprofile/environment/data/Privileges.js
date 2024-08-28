 define(function() {
   'use strict';
   
    return {
        "admin": [{
            "user":"administrator",
            "role":"ADMINISTRATOR",
            "targetGroup":"ALL"
            },{
            "user":"administrator",
            "role":"SECURITY_ADMIN",
            "targetGroup":"ALL"
        }],
        "regular_user": [{
            "user":"regular_user",
            "role":"REGULAR_USER",
            "targetGroup":"TG1"
        }],
         "federated_user": [{
            "user":"federated_user",
            "role":"FEDERATED_USER",
            "targetGroup":"TG1"
        }]
	};
});