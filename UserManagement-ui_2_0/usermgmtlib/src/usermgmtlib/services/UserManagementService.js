define([
    'jscore/core',
    'jscore/ext/net',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'jscore/base/jquery'
], function(core, net, responseHandler, jquery) {

    var RESTusers = "/oss/idm/usermanagement/users/";
    var RESTsso = "/oss/sso/utilities/users/";

    return {
        authorize: function(app) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/rest/apps',
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        var appIds = data.map(function(app) {
                            return app.id;
                        });
                        if (appIds.indexOf(app) > -1) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    },
                    error: function() {
                        reject(false);
                    }
                });
            });
        },

        getModifiables: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/oss/idm/config/usersettings',
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        resolve(data.allowDataModification);
                    },
                    error: function(error, xhr) {
                        reject(xhr);
                    }
                });
            });
        },

        getPasswordValidationResult: function(data) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: RESTusers + "validate/password",
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: resolve,
                    error: function(message, xhr) {

                        var responseJSON;

                        try {
                            responseJSON = xhr.getResponseJSON();
                        } catch (err) {
                            console.log('Error: ', err);
                        }

                        responseHandler.setNotification({ response: xhr });

                        reject({
                            message: message,
                            response: responseJSON || ""
                        });
                    }
                });
            });
        },

        setForcePasswordChange: function(user, resetFlagValue) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: RESTusers + user + "/forcepasswordchange",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify({
                        forceChangePassword: resetFlagValue.toString().toUpperCase()
                    }),
                    success: function(message, xhr) {
                        resolve({
                            xhr: xhr,
                            rowValue: user,
                            singleNotification: {
                                messageId: ( resetFlagValue === true ) ? 'success_force_password_change' : 'success_unforce_password_change',
                                mode: 'success'
                            }
                        });
                    },
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            rowValue: user
                        });
                    }
                });
            });
        },

        setEnableDisableUser: function(user, status) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: RESTusers + user,
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify({
                        username: user,
                        status: status
                    }),
                    success: function(message, xhr) {
                        resolve({
                            xhr: xhr,
                            rowValue: user,
                            singleNotification: {
                                messageId: ( status === 'enabled' ) ? 'success_enable_user_change' : 'success_disable_user_change',
                                mode: 'success'
                            }
                        });
                    },
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            rowValue: user
                        });
                    }
                });
            });
        },

        setTerminateSessions: function(user) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: RESTsso + user,
                    type: "DELETE",
                    contentType: "application/json",
                    success: function(message, xhr) {
                        resolve({
                            xhr: xhr,
                            rowValue: user,
                            singleNotification: {
                                messageId: 'success_terminate_sessions',
                                mode: 'success'
                            }
                        });
                    },
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            rowValue: user
                        });
                    }
                });
            });
        },

        getAllTargetGroups: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/idm/targetgroupmanagement/targetgroups",
                    type: "GET",
                    dataType: "json",
                    success: resolve,
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'TG'
                        });
                    }
                });
            });
        },

        getRoles: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/idm/rolemanagement/roles",
                    type: "GET",
                    dataType: "json",
                    success: resolve,
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'ROLES'
                        });
                    }
                });
            });
        },

        /*
        GET logged username
         */
        getLoggedUsername: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/editprofile",
                    type: "GET",
                    dataType: "json",
                    success: function(data) {
                        resolve(data);
                    }.bind(this),
                    error: reject
                });
            });
        },

        /*
        GET user data
         */
        getUserInfo: function(username) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/idm/usermanagement/users/"+username,
                    type: "GET",
                    dataType: "json",
                    success: function(data) {
                        resolve(data);
                    }.bind(this),
                    error: reject
                });
            });
        },

        getUsers: function(federated) {
            var urlToUse;
            if ( federated ) {
                urlToUse = "/oss/idm/usermanagement/users?federated=" + federated.toString();
            } else {
                urlToUse = "/oss/idm/usermanagement/users";
            }
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: urlToUse,
                    type: "GET",
                    dataType: "json",
                    success: resolve,
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'USERS'
                        });
                    }
                });
            });
        },

        setUser: function(userData, resolve) {
            return  net.ajax({
                    url: "/oss/idm/usermanagement/users/" + userData.username,
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(userData),
                    success: function() {
                        resolve({
                            success: true,
                            rowValue: userData.username
                        });
                    },
                    error: function(message, xhr) {
                        resolve({
                            xhr: xhr,
                            rowValue: userData.username
                        });
                    }
                });
        },


        modifyBatchUser: function(userData, userName, resolve) {
            return  net.ajax({
                    url: "/oss/idm/usermanagement/batchusermodify",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(userData),
                    success: function() {
                        resolve({
                            success: true,
                            rowValue: userName
                        });
                    },
                    error: function(message, xhr) {
                        resolve({
                            xhr: xhr,
                            rowValue: userName
                        });
                    }
                });
        },

        getSls: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/sls/users",
                    type: "GET",
                    dataType: "json",
                    success: resolve,
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'SLS'
                        });
                    }
                });
            });
        },

        getPrivileges: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/idm/usermanagement/privileges",
                    type: "GET",
                    dataType: "json",
                    success: resolve,
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'PRIVILEGES'
                        });
                    }
                });
            });
        },

        getSessions: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/sso/utilities/users",
                    type: "GET",
                    dataType: "json",
                    success: function(data) {
                        resolve(data.users);
                    }.bind(this),
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'SESSIONS'
                        });
                    }
                });
            });
        },

        getUserPrivileges: function(username) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/oss/idm/usermanagement/users/' + username + '/privileges',
                    dataType: 'json',
                    success: resolve,
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'USER_PRIVILEGES'
                        });
                    }
                });
            });
        },

        getActingUserPrivileges: function(username) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/oss/idm/usermanagement/users/' + username + '/privileges?role.status=ENABLED,DISABLED_ASSIGNMENT',
                    dataType: 'json',
                    success: resolve,
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'ENABLED_USER_PRIVILEGES'
                        });
                    }
                });
            });
        },

        /*
         DELETE User
         */
        requestDeleteUser: function(user) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: RESTusers + user,
                    type: "DELETE",
                    contentType: "application/json",
                    success: function(message, xhr) {
                        resolve({
                            xhr: xhr,
                            rowValue: user,
                            singleNotification: {
                                messageId: 'success_delete_user',
                                mode: 'success'
                            }
                        });
                    },
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            rowValue: user
                        });
                    }
                });
            });
        },


        /*
         Revoke certificate for a single User
         */
        requestRevokeCertificate: function(user) {
            return new Promise(function(resolve, reject) {
                var xhr = net.ajax({
                    url: "/oss/sls/credentials/users/" + user + "/nodetypes",
                    type: 'DELETE',
                    contentType: "application/json",
                    success: function(message, xhr) {
                        resolve({
                            xhr: xhr,
                            rowValue: user,
                            singleNotification: {
                                messageId: 'certificateRevokeSuccess',
                                mode: 'success'
                            }
                        });
                    },
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            rowValue: user
                        });
                    }
                });
            });
        },

        /*
        GET list of logged in users
         */
        checkUserSessions: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/sso/utilities/users",
                    type: "GET",
                    dataType: "application/json",
                    success: function(data) {
                        resolve(data);
                    }.bind(this),
                    error: reject
                });
            });
        },

        /*
         * Upload XML file with users profiles
         */
        uploadUsersFile: function(formData, onError) {
            return net.ajax({
                url: "/oss/idm/usermanagement/importUsers?action=uploadFile",
                type: "POST",
                contentType: false,
                processData: false,
                dataType: "json",
                data: formData,
                error: onError
            });
        },

        /*
         * Start import
         */
        startImportUsers: function(data) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/idm/usermanagement/importUsers?action=startImport",
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: resolve,
                    error: reject
                });
            });
        },

        /*
         * View import report
         */
        getImportReport: function(data) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/idm/usermanagement/importUsers?action=getReport",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: resolve,
                    error: reject
                });
            });
        },

        /*
         * Start import file analysis
         */
        startImportAnalysis: function(data) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/idm/usermanagement/importUsers?action=startAnalysis",
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: resolve,
                    error: reject
                });
            });
        },

        /*
         * Check import status
         */
        checkImportStatus: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/idm/usermanagement/checkStatus",
                    type: "POST",
                    dataType: "json",
                    success: resolve,
                    error: reject
                });
            });
        },

        /*
         * Get User Credentials in profile user (XML)
         */
        getUserCredentialsXml: function(credentialData) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/sls/credentials",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(credentialData),
                    success: resolve,
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'USER_CREDENTIALS'
                        });
                    }
                });
            });
        },

        /*
         * Get User Credentials in profile user (PKCS#12)
         */
        getUserCredentialsPkcs12: function(credentialData) {
            return new Promise(function(resolve, reject) {
                jquery.ajax({
                    url: "/oss/sls/credentials",
                    type: 'POST',
                    mimeType: 'text/plain; charset=x-user-defined',
                    contentType: 'application/json',
                    cache: false,
                    data: JSON.stringify(credentialData),
                    success: function(result){
                        var resultBinary = new Uint8Array(result.length);
                        for (var i = 0; i < result.length; i++) {
                            resultBinary[i] += result.charCodeAt(i) & 0xFF;
                        }
                        resolve(resultBinary);
                    },
                    error: function(xhr, message) {
                        reject({
                            xhr: xhr,
                            requestFor: 'USER_CREDENTIALS'
                        });
                    }
                });
            });
        },

        /*
         * Get User Credentials in profile user (PKCS#12)
         */
        getEnforceUserHardeningState: function() {
            return new Promise(function(resolve, reject) {
                jquery.ajax({
                    url: "/oss/idm/usermanagement/enforceduserhardening",
                    type: "GET",
                    dataType: "json",                    
                    success: function(data) {
                        resolve(data.enforcedUserHardening);
                    }.bind(this),
                    error: function(xhr, message) {
                        reject({
                            xhr: xhr,
                            requestFor: 'ENFORCED_USER_HARDENING'
                        });
                    }
                });
            });
        },

        /*
         * Get state of federated identity synchronization
         */
         getFederatedState: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/fidm/sync/state",
                    type: "GET",
                    dataType: "json",
                    success: resolve,
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'FEDERATED_STATE'
                        });
                    }
                });
            });
        },


         /* Get last sync report of federated identity synchronization
         */
         getFederatedReport: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/fidm/sync/report",
                    type: "GET",
                    dataType: "json",
                    success: resolve,
                    error: function(message, xhr) {
                        reject({
                            xhr: xhr,
                            requestFor: 'FEDERATED_LAST_REPORT'
                        });
                    }
                });
            });
        },

         /* Get ODP Profiles configuration
         */
         getOdpProfiles: function() {

            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/idm/usermanagement/odpprofiles",
                    type: "GET",
                    dataType: "json",
                    success: resolve,
                    error: function(message, xhr) {
                        if (message === 'Not Found') {
                          resolve([]);
                        } else {
                          reject({
                              xhr: xhr,
                             requestFor: 'ODP_PROFILES'
                          });
                        }
                    }
                });
            });
        }
    };
});
