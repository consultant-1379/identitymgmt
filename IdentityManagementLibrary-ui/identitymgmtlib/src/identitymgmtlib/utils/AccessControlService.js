define([
    'jscore/core',
    'jscore/ext/net'
], function(core, net) {

    return {
        isAppAvailable: function(app, callback) {
            var resource = "wrongIdentityManagementApp";
            if ( app === "user_management" || app === "usermanagement" ) {
                resource = "user_mgmt";
            } else if ( app === "role_management" || app === "rolemanagement" ) {
                resource = "role_mgmt";
            } else if ( app === "target_management" || app === "targetmanagement" ) {
                resource = "target_group_mgmt";
            }

            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/oss/uiaccesscontrol/resources/'+resource+"/actions",
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        if (callback) {
                            callback(true);
                        }
                        resolve(data);
                    },
                    error: function(message, xhr) {
                        net.ajax({
                            url: '/rest/apps',
                            type: 'GET',
                            dataType: 'json',
                            success: function(data) {
                                var appIds = data.map(function(app) {
                                    return app.id;
                                });
                                if (appIds.indexOf(app) > -1) {
                                    if (callback) { callback(true); }
                                    resolve(data);
                                } else {
                                    if (callback) { callback(false); }
                                    reject(data);
                                }
                            },
                            error: function(message, xhr) {
                                if (callback) { callback(false); }
                                reject(xhr);
                            }
                        });
                    }
                });
            });
        }
    };
});
