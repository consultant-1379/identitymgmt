/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 -----------------------------------------------------------------------------*/
define([
    'jscore/core',
    'jscore/ext/privateStore',
    'container/api',
    'layouts/TopSection',
    'layouts/MultiSlidingPanels',
    'uit!./usermgmtprofile.html',
    './regions/mainregion/MainRegion',
    'usermgmtlib/model/UserProfileModel',
    'usermgmtlib/model/RolePrivilegesModel',
    'usermgmtlib/model/RolePrivilegesCollection',
    './Dictionary',
    'jscore/ext/locationController',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/widgets/ConfirmationDeleteUsersDialog/ConfirmationDeleteUsersDialog',
    'usermgmtlib/model/PasswordPoliciesCollection',
    'identitymgmtlib/AccessControlService',
    'jscore/ext/utils/base/underscore',
    'identitymgmtlib/Utils'
], function(core, PrivateStore, container, TopSection, MultiSlidingPanels, View, MainRegion, UserProfileModel, RolePrivilegesModel, RolePrivilegesCollection, Dictionary, LocationController, responseHandler, UserManagementService, ConfirmationDeleteUsersDialog, PasswordPoliciesCollection, AccessControlService, underscore, utils) {

    var _ = PrivateStore.create();

    function getActions(action) {
        return {
            separator: {
                type: 'separator'
            },
            saveUserProfile: {
                name: Dictionary.save,
                type: 'button',
                color: 'darkBlue',
                action: function() {
                    if (_(this)._isDuringSave !== true) {
                        _(this)._isDuringSave = true;
                        this.getEventBus().publish('usermgmtprofile:save');
                    }
                }.bind(this)
            },
            cancelUserProfile: {
                name: Dictionary.cancel,
                type: 'button',
                action: function() {
                    this.getEventBus().publish('usermgmtprofile:cancel');
                    this.goBack();
                }.bind(this)
            },
            changePasswordByAdmin: {
                name: Dictionary.editPassword,
                type: 'button',
                action: function() {
                    this.getEventBus().publish('action:changePasswordByAdmin', this.getUsernameOfEditingUser());
                }.bind(this)
            },
            deleteUser: {
                name: Dictionary.delete,
                type: 'button',
                icon: 'delete',
                action: function() {
                    this.getEventBus().publish('action:deleteUsers', this.getUsernameOfEditingUser());
                }.bind(this)
            },
            forcePasswordChange: {
                name: Dictionary.forcePasswordChange,
                type: 'button',
                action: function() {
                    this.getEventBus().publish('action:forcePasswordChange', this.getModelOfEditingUser());
                }.bind(this)
            },
            disablePasswordChange: {
                name: Dictionary.disablePasswordChange,
                type: 'button',
                action: function() {
                    this.getEventBus().publish('action:forcePasswordChange', this.getModelOfEditingUser());
                }.bind(this)
            },
            terminateSessions: {
                name: Dictionary.terminateSessions,
                type: 'button',
                action: function() {
                    this.getEventBus().publish('action:terminateSessions', this.getUsernameOfEditingUser());
                }.bind(this)
            },
            duplicate: {
                name: Dictionary.duplicate,
                type: 'button',
                icon: 'duplicate',
                action: function() {
                    this.getEventBus().publish('action:duplicateUser', this.getUsernameOfEditingUser());
                }.bind(this)
            }
        };
    }

    function showLoader() {
        container.getEventBus().publish('container:loader');
    }

    function hideLoader() {
        container.getEventBus().publish('container:loader-hide');
    }

    return core.App.extend({

        View: View,

        goBack: function(savedUsername) {
            if ( savedUsername ) {
                window.location.href = "#usermanagement?savedUser=" + savedUsername;
            } else {
                window.location.href = "#usermanagement";
            }
        },

        getUsernameOfEditingUser: function() {
            return _(this).model.get('username');
        },

        getModelOfEditingUser: function() {
            return _(this).model;
        },

        initActions: function() {
            _(this).actions = getActions.call(this);
        },

        performOnStart: function() {
            _(this)._isDuringSave = false;
            this.initActions();

            _(this).locationController = new LocationController({
                namespace: this.options.namespace,
                autoUrlDecode: false
            });
            _(this).locationController.addLocationListener(this.onLocationChange.bind(this));

            this.addEventHandlers();
            this.onResume();
        },

        onStart: function() {
            AccessControlService.isAppAvailable('user_management').then(function() {
                    this.performOnStart();
                }.bind(this),
                function(response) {
                    if (response.getStatus && response.getStatus() !== 401) {
                        responseHandler.setNotificationError({ response: '' + response.getStatus() });
                    } else {
                        responseHandler.showAccessDeniedDialog();
                    }
                }.bind(this));
        },

        addEventHandlers: function() {

            //TORF-179295
            //Create User Role Page not giving Authorisation alert when user without access roles logon to ENM
            container.getEventBus().subscribe('reload-force', function() {
                _(this).model = null;
            }.bind(this));

            // subsribe for save action
            this.getEventBus().subscribe('usermgmtprofile:save', function() {
                showLoader();

                if ( _(this).model.passwordPoliciesCollection ) {
                    _(this).model.passwordPoliciesCollection.validate({'isPasswordsChanged' : true})
                    .then(function() {
                        this.saveUser();
                    }.bind(this))
                    .catch(function() {
                        this.saveUser();
                    }.bind(this));
                } else {
                    this.saveUser();
                }
            }.bind(this));


            this.getEventBus().subscribe('action:changePasswordByAdmin', this.changePasswordByAdmin.bind(this));
            this.getEventBus().subscribe('action:deleteUsers', this.showConfirmationDeleteUsersDialog.bind(this));
            this.getEventBus().subscribe('action:forcePasswordChange', this.forcePasswordShowResult.bind(this));
            this.getEventBus().subscribe('action:terminateSessions', this.terminateSessionsShowResult.bind(this));
            this.getEventBus().subscribe('action:duplicateUser', this.duplicateUser.bind(this));
        },

        saveUser: function() {
            _(this).model.save({}, {
                success: function(model, response, options) {
                    this.getEventBus().publish('usermgmtprofile:done');
                    hideLoader();
                    if ( _(this).model.mode === "edit" ) {
                        responseHandler.setNotificationSuccess({ response: "success_update_user" });
                        this.goBack();
                    } else {
                        responseHandler.setNotificationSuccess({ response: "success_create_user" });
                        this.goBack(_(this).model.get('username'));
                    }
                }.bind(this),
                error: function(model, response, validationFailed) {
                    _(this)._isDuringSave = false;
                    // show message only when it is not a validation
                    hideLoader();

                    if (!validationFailed) {
                        responseHandler.setNotification({ response: response });
                    } else if ( model.dump.privileges.length === 0 ) {
                        responseHandler.setNotification({ response: "roles_no_assigned" });
                    }
                }.bind(this)
            });
        },

        forcePasswordShowResult: function(model) {
            var username  = model.get('username');
            var passwordResetFlag  = model.get('passwordResetFlag');
            showLoader();
            UserManagementService.setForcePasswordChange(username, !passwordResetFlag )
                .then(function(data) {
                        hideLoader();
                        responseHandler.setNotificationSuccess({ response: data });
                        _(this).model.set('passwordResetFlag', !passwordResetFlag);
                        this.getEventBus().publish('topsection:defaultactions', this.getContextActions('edit', _(this).model, this.enforcedUserHardening));
                    }.bind(this),
                    function(data) {
                        hideLoader();
                        responseHandler.setNotificationError({
                            response: data,
                            dialog: true,
                            operation: 'forcePasswordChange'
                        });
                    });
        },

        terminateSessionsShowResult: function(username) {
            showLoader();
            UserManagementService.setTerminateSessions(username)
                .then(function(data) {
                        hideLoader();
                        responseHandler.setNotificationSuccess({ response: data });
                    },
                    function(data) {
                        hideLoader();
                        responseHandler.setNotificationError({ response: data });
                    });
        },

        performOnResume: function() {
            _(this).locationController.start();
            if (this.passwordPoliciesCollection) {
                this.passwordPoliciesCollection.clearTicks();
            }
        },

        onResume: function() {
            if (this.layout) {
                this.layout.destroy();
            }
            showLoader();
            AccessControlService.isAppAvailable('user_management').then(function() {
                    this.performOnResume();
                }.bind(this),
                function(response) {
                    if (response.getStatus && response.getStatus() !== 401) {
                        responseHandler.setNotificationError({ response: '' + response.getStatus() });
                    } else {
                        responseHandler.showAccessDeniedDialog();
                    }
                }.bind(this));
            UserManagementService.getEnforceUserHardeningState()
                .then(function(data) {
                        this.enforcedUserHardening = data;
                    }.bind(this),
                    function(data) {
                        this.enforcedUserHardening = false;
                    }.bind(this));

            this.odpProfiles = [];
            UserManagementService.getOdpProfiles()
                .then(function(data) {
                        this.odpProfiles = data;
                    }.bind(this),
                    function(response) {
                        if (response.xhr && response.xhr.getStatus ) {
                            // Display Error
                            responseHandler.setNotificationError({ response: "invalid_odp_profiles" });
                        }
                    }.bind(this));
        },

        onPause: function() {
            core.Window.removeEventHandler('focus');
            _(this)._isDuringSave = false;
            if (_(this).locationController) {
                _(this).locationController.stop();
            }
        },

        onBeforeLeave: function() {
            if (_(this).model && _(this).model.hasChanged()) {
                return Dictionary.confirmNav;
            } else {
                return false;
            }
        },

        passwordPoliciesCollection: new PasswordPoliciesCollection(), //because on any location change, the model is creating, policies has to stay unchanged

        onLocationChange: function(hash) {
            hash = hash || '';
            if (this.layout) {
                this.layout.destroy();
            }
            _(this)._isDuringSave = false;
            // crate new model
            _(this).model = new UserProfileModel();

            core.Window.addEventHandler('focus', function() {
                setTimeout(function() {
                    //refresh roles in model after focus browser tab, roles are binded to table
                    _(this).model.get('privileges').fetch();
                }.bind(this), 50);
            }.bind(this));
            // test hash to get proper action
            hash = hash.replace(/\/$/, "").split("/");
            var mode = hash[0],
                username = hash[1];
            _(this).model.mode = mode;
            if (mode === "create" && !username) {
                hideLoader();
                _(this).model.passwordPoliciesCollection = this.passwordPoliciesCollection;
                _(this).model.get('privileges').fetch({
                    success: function() {
                        this.renderCreate(_(this).model);
                        hideLoader();
                    }.bind(this),
                    error: function(response) {
                        responseHandler.setNotification({ response: response[1] });
                    }
                });
            } else if (mode === "edit" && username) {

                _(this).model.set('username', hash[1]);
                _(this).model.fetch({
                    success: function() {
                        hideLoader();
                        this.renderEdit(_(this).model);
                        _(this).model.get('privileges').fetch({
                            success: function() {
                                _(this).model.dump = _(this).model.toJSON();
                            }.bind(this),
                            remove: {
                                ASSIGNED: false
                            },
                            error: function(response) {
                                responseHandler.setNotification({ response: response[1] });
                            }.bind(this)
                        });
                    }.bind(this),
                    error: function() {
                        hideLoader();
                        _(this).model.dump = _(this).model.toJSON();
                        responseHandler.setNotificationError({ response: "user_does_not_exist" });
                        this.goBack();
                    }.bind(this)
                });
            } else if (mode === "duplicate" && username) {
                _(this).model.passwordPoliciesCollection = this.passwordPoliciesCollection;
                var modelToDuplicate = new UserProfileModel();

                modelToDuplicate.set('username', hash[1]);
                modelToDuplicate.fetch({
                    success: function() {
                        hideLoader();
                        _(this).model.set('authMode', modelToDuplicate.get('authMode'));
                        _(this).model.set('passwordAgeing', modelToDuplicate.get('passwordAgeing'));
                        _(this).model.set('odpProfiles', modelToDuplicate.get('odpProfiles'));
                        _(this).model.get('privileges').setModels(modelToDuplicate.get('privileges').toJSON());
                        _(this).model.get('privileges').fetch({
                            success: function() {
                                this.renderCreate(_(this).model);
                                _(this).model.dump = _(this).model.toJSON();
                            }.bind(this),
                            remove: {
                                ASSIGNED: true
                            },
                            error: function() {
                                responseHandler.setNotificationError({ response: "user_does_not_exist" });
                            }.bind(this)
                        });
                    }.bind(this),
                    error: function() {
                        hideLoader();
                        responseHandler.setNotificationError({ response: "user_does_not_exist" });
                        this.goBack();
                    }.bind(this)
                });
            } else {
                // default behaviour
                _(this).model.passwordPoliciesCollection = this.passwordPoliciesCollection;
                _(this).model.get('privileges').fetch({
                    success: function() {
                        hideLoader();
                    }.bind(this),
                    error: function(response) {
                        responseHandler.setNotification({ response: response[1] });
                    }
                });
                this.renderCreate(_(this).model);
            }
        },

        renderApp: function(type, model) {
            this.layout = new TopSection({
                context: this.getContext(),
                title: type === 'edit' ? Dictionary.usermgmtprofile.edit_user_profile : Dictionary.usermgmtprofile.create_user_profile,
                defaultActions: this.getContextActions(type, model, this.enforcedUserHardening),
                breadcrumb: utils.removeChildAppsFromBreadcrumb(this.options.breadcrumb)
            });
            this.layout.attachTo(this.view.getElement());
            this.mainRegion = new MainRegion({
                                  context: this.getContext(),
                                  type: type,
                                  model: model,
                                  enforcedUserHardening : this.enforcedUserHardening,
                                  odpProfiles: this.odpProfiles || []
                              });

            this.layout.setContent(
                new MultiSlidingPanels({
                    context: this.getContext(),
                    showLabel: true,
                    main: {
                        label: this.options.properties.title,
                        content: this.mainRegion
                    }
                })
            );
        },

        getContextActions: function(type, model, enforcedUserHardening) {

            var actions = [];

            actions.push(
                _(this).actions.saveUserProfile,
                _(this).actions.cancelUserProfile
            );

            if (type === 'edit') {
                if ( model.get('passwordResetFlag') === false ) {
                    actions.push(
                        _(this).actions.separator,
                        _(this).actions.changePasswordByAdmin,
                        _(this).actions.duplicate,
                        _(this).actions.deleteUser,
                        _(this).actions.separator,
                        _(this).actions.terminateSessions,
                        _(this).actions.forcePasswordChange
                    );
                } else {
                    actions.push(
                        _(this).actions.separator,
                        _(this).actions.changePasswordByAdmin,
                        _(this).actions.duplicate,
                        _(this).actions.deleteUser,
                        _(this).actions.separator,
                        _(this).actions.terminateSessions);
                    if (enforcedUserHardening === false) {
                        actions.push(_(this).actions.disablePasswordChange);
                    }
                }
            }

            return actions;
        },
        renderCreate: function(model) {
            this.renderApp('create', model);
        },

        renderEdit: function(model) {
            this.renderApp('edit', model);
        },

        showConfirmationDeleteUsersDialog: function(username) {
            showLoader();
            var confirmationDeleteUsersDialog = new ConfirmationDeleteUsersDialog();
            confirmationDeleteUsersDialog.showConfirmationDeleteUsersDialog([{ 'username': username }]);
            confirmationDeleteUsersDialog.addEventHandler('showLoader', function() {
                showLoader();
            });
            confirmationDeleteUsersDialog.addEventHandler('hideLoader', function() {
                hideLoader();
            });
            //after delete user
            confirmationDeleteUsersDialog.addEventHandler('deletedUsers', function(success) {
                if (success) {
                    this.goBack();
                }
            }.bind(this));
        },

        changePasswordByAdmin: function(username) {
            window.location.hash = "usermgmtchangepass/user/" + username;
        },

        duplicateUser: function(username) {
            window.location.hash = "usermanagement/usermgmtprofile/duplicate/" + username;
        }

    });

});
