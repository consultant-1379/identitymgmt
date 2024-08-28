define([
    'jscore/core',
    'jscore/ext/net',
    'jscore/ext/privateStore',
    'jscore/ext/utils/base/underscore',
    'i18n!identitymgmtlib/common.json',
    'identitymgmtlib/DataHandler',
    'usermgmtlib/services/UserManagementService'
], function(core, net, PrivateStore, underscore, Dictionary, DataHandler, service) {
    'use strict';

    var _ = PrivateStore.create();

    var getCredentialStatusesHashTable = function(response) {
        var output = {};
        response.forEach(function(sls) {
            output[sls.user] = {
                credentialStatus: sls.status
            };
        }.bind(this));
        return output;
    };

    var partsToFetch = {
        users: {
            fetchData: function(resolve, reject) {
                if (!_(this).fetched.users) {
                    service.getUsers(this.federated).then(function(data) {
                        if (this.federated ) {
                            data = data.filter(function getFederatedUsers(user) {
                                          return user.authMode === "federated";
                                        });
                        } else {
                            data = data.filter(function getNotFederatedUsers(user) {
                                          return user.authMode !== "federated";
                                        });
                        }

                        //needed to filter which user has expired password or not
                        data.forEach(function(user) {
                            user.expirationData={
                                passwordAgeing: user.passwordAgeing,
                                passwordChangeTime: user.passwordChangeTime
                            };

                            // Translate attributes
                            if ( user.passwordResetFlag === true) {
                                user.passwordResetFlagColumn = Dictionary.yes;
                            } else if (user.passwordResetFlag === false) {
                                user.passwordResetFlagColumn = Dictionary.no;
                            }


                            if ( user.status === true || user.status === 'enabled' ) {
                                user.statusColumn = Dictionary.enabled;
                            } else if (user.status === false || user.status === 'disabled' ) {
                                user.statusColumn = Dictionary.disabled;
                            }

                            if( user.passwordAgeing !== null && user.passwordAgeing !== undefined && user.passwordAgeing.customizedPasswordAgeingEnable) {
                                if(user.passwordAgeing.passwordAgeingEnable) {
                                    user.passwordAgeingColumn = Dictionary.enabled;
                                } else {
                                    user.passwordAgeingColumn = Dictionary.disabled;
                                }
                            } else {
                                user.passwordAgeingColumn= Dictionary.filters.passwordAgeing.system;
                            }

                        }.bind(this));
                        _(this).fetched.users = true;
                        _(this).data = data;
                        resolve(_(this).data);
                    }.bind(this), reject);
                } else {
                    resolve(_(this).data);
                }
            }
        },

        sls: {
            fetchData: function(resolve, reject) {
                service.getSls().then(function(data) {
                    _(this).fetched.sls = true;
                    resolve({
                        default: {
                            credentialStatus: Dictionary.filters.credentialStatus.names.not_applicable //TODO: use dictionary names instead of backend names
                        },
                        value: getCredentialStatusesHashTable.call(this, data)
                    });
                }.bind(this), reject);
            }
        },

        roles: {
            fetchData: function(resolve, reject) {
                service.getPrivileges().then(function(data) {

                    var privileges = data.reduce(function(o, privilege) {
                        o[privilege.user] = o[privilege.user] || {};
                        o[privilege.user][privilege.role] = o[privilege.user][privilege.role] || [];
                        o[privilege.user][privilege.role].push(privilege.targetGroup);
                        return o;
                    }, {});

                    // map privileges to have array of roles instead of hash table
                    var output = {};
                    for (var user in privileges) {
                        var _roles = [];
                        for (var role in privileges[user]) {
                            _roles.push(role);
                        }
                        output[user] = {
                            roles: _roles
                        };
                    }

                    _(this).fetched.roles = true;
                    resolve({
                        default: {
                            roles: []
                        },
                        value: output
                    });
                }.bind(this), reject);
            }
        },

        privileges: {
            fetchData: function(resolve, reject) {
                service.getPrivileges().then(function(data) {
                    var privileges = data.reduce(function(o, privilege) {
                        o[privilege.user] = o[privilege.user] || {};
                        o[privilege.user][privilege.role] = o[privilege.user][privilege.role] || [];
                        o[privilege.user][privilege.role].push(privilege.targetGroup);
                        return o;
                    }, {});

                    // map privileges to have array of roles instead of hash table
                    var output = {};
                    for (var user in privileges) {
                        var _privileges = [];
                        for (var role in privileges[user]) {
                            for (var tg in privileges[user][role]) {
                                _privileges.push({
                                    role: role,
                                    targetGroup: privileges[user][role][tg]
                                });
                            }
                        }
                        output[user] = {
                            privileges: _privileges
                        };
                    }

                    _(this).fetched.privileges = true;
                    resolve({
                        default: {
                            privileges: []
                        },
                        value: output
                    });

                }.bind(this), reject);
            }
        },

        sessions: {
            fetchData: function(resolve, reject) {
                service.getSessions().then(function(data) {

                    for (var user in data) {
                        data[user] = {

                            currentlyLoggedIn: data[user] > 0 ? "true" : "false",
                            numberOfSessions: data[user]
                        };
                    }

                    _(this).fetched.sessions = true;
                    resolve({
                        default: {
                            currentlyLoggedIn: "false",
                            numberOfSessions: 0
                        },
                        value: data
                    });

                }.bind(this), reject);
            }
        }
    };


    return DataHandler.extend({

        init: function(options) {
            _(this).fetched = {};
        },

        fetchData: function(query) {

            query = query || {};

            // clear markers
            if (query.force === true) {
                _(this).fetched = {};
            }

            // set default
            var toFetch = ['users'];

            if (!_(this).fetched.sls && !query.group) {
                toFetch.push('sls');
            }

            if (!_(this).fetched.roles && query.filter && query.filter.roles) {
                toFetch.push('roles');
            }

            if ((!_(this).fetched.privileges && query.export) || query.group) {
                toFetch.push('privileges');
            }

            if (query.filter && (query.filter.currentlyLoggedIn || query.filter.numberOfSessions)) {
                toFetch.push('sessions');
            }

            // convert parts to fetch to promises
            var promisesToFetch = toFetch.map(function(id) {
                return new Promise(partsToFetch[id].fetchData.bind(this));
            }.bind(this));

            return new Promise(function(resolve, reject) {

                Promise.all(promisesToFetch).then(function(responses) {

                    // get first element - users
                    query.data = responses[0];

                    // remove first element - users
                    responses.splice(0, 1);

                    // save on response.lookup a copy of the keys in lowercase
                    responses.forEach(function(response) {
                                    var theKeys = [];
                                    if ( response.value ) {
                                        theKeys = Object.getOwnPropertyNames(response.value);
                                    }
                        response.lookup = {};
                        theKeys.forEach(function(key) {
                            response.lookup[key.toLowerCase()] = key;
                        });
                    });

                    // merge rest elements if available
                    responses.forEach(function(response) {
                        query.data.forEach(function(user) {
                            var key = response.lookup[user.username.toLowerCase()];
                                        if ( !key ) {
                                                key = user.username;
                                        }
                            underscore.extend(user, response.default, response.value[key] );
                        }.bind(this));
                    }.bind(this));

                    _(this).previousQuery = query; // underscore.clone(query);

                    resolve(query);

                }.bind(this)).catch(reject);

            }.bind(this));
        }
    });
});
