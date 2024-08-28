define([
    'jscore/core',
    'container/api',
    'jscore/ext/privateStore',
    'widgets/Breadcrumb',
    'uit!./userprofile.html',
    'layouts/TopSection',
    'layouts/MultiSlidingPanels',
    './Dictionary',
    'jscore/ext/locationController',
    'usermgmtlib/model/RegularUserProfileModel',
    './regions/mainregion/MainRegion',
    'usermgmtlib/services/UserManagementService',
    'identitymgmtlib/SystemTime',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    './widgets/CredentialsManager/CredentialsManager',
    'usermgmtlib/model/PasswordPoliciesCollection',
    'userprofile/model/UserprofileCredentialsModel',
    'identitymgmtlib/services/TimeService',
    'identitymgmtlib/Utils'
], function(core, container, PrivateStore, Breadcrumb, View, TopSection, MultiSlidingPanels, Dictionary, LocationController, RegularUserProfileModel, MainRegion, service, systemTime, responseHandler, CredentialsManager, PasswordPoliciesCollection, UserProfileCredentialsModel, TimeService, utils) {

    var _ = PrivateStore.create();

    function goBack() {
        window.location.href = "/#userprofile";
    }

    function showLoader() {
        container.getEventBus().publish('container:loader');
    }

    function hideLoader() {
        container.getEventBus().publish('container:loader-hide');
    }

    function getActions() {
        return {
            separator: {
                type: 'separator'
            },
            changePasswordByUser: {
                name: Dictionary.editPassword,
                type: 'button',
                action: function() {
                    window.location.href = "/#userprofilechangepass";
                }.bind(this)
            },
            editData: {
                name: Dictionary.editData,
                type: 'button',
                action: function() {
                    window.location.hash = "userprofile/edit";
                }.bind(this)
            },
            getCredentials: {
                name: Dictionary.credentials,
                type: 'button',
                action: function() {
                    this.createCredentialRegion();
                }.bind(this)
            },
            save: {
                name: Dictionary.save,
                type: 'button',
                color: 'blue',
                action: function() {
                    if (_(this)._isDuringSave !== true) {
                        _(this)._isDuringSave = true;
                        this.getEventBus().publish('userprofile:save');
                    }
                }.bind(this)
            },
            cancel: {
                name: Dictionary.cancel,
                type: 'button',
                action: function() {
                    this.getEventBus().publish('userprofile:cancel');
                    goBack();
                }.bind(this)
            }
        };
    }


    return core.App.extend({
        View: View,

        initActions: function() {
            _(this).actions = getActions.call(this);
            this.isFederatedUser = false;
        },

        onStart: function() {
            TimeService.getServerTime()
                .then(function(data) {
                    systemTime.updateTimezone(data.serverLocation);
                    this.onResume();
                }.bind(this), function() {
                    this.onResume();
                }.bind(this));


            this.initActions();

            _(this).locationController = new LocationController({
                namespace: this.options.namespace,
                autoUrlDecode: false
            });


            _(this).locationController.addLocationListener(this.onLocationChange.bind(this));

            this.addEventHandlers();

            this.onResume();

        },

        addEventHandlers: function() {
            // subsribe for save action
            this.getEventBus().subscribe('userprofile:save', function() {
                showLoader();

                if (!_(this).model.isAdmin) {
                    _(this).model.modifiables.forEach(function(modifiable) {
                        if (!modifiable.enabled) {
                            if (modifiable.name === "personals") {
                                _(this).model.notSync.push('name');
                                _(this).model.notSync.push('surname');
                            }
                            if (modifiable.name === "email") {
                                _(this).model.notSync.push('email');
                            }
                        }
                    }.bind(this));
                }

                _(this).model.save({}, {
                    success: function(model, response, options) {
                        if ( _(this).model.mode === "edit" ) {
                            responseHandler.setNotificationSuccess({ response: "success_update_user" });
                        } else {
                            responseHandler.setNotificationSuccess({ response: "success_create_user" });
                        }
                        this.getEventBus().publish('userprofile:done');
                        hideLoader();
                        goBack();
                    }.bind(this),
                    error: function(model, response, validationFailed) {
                        _(this)._isDuringSave = false;
                        // show message only when it is not a validation
                        hideLoader();
                        if (!validationFailed) {
                            responseHandler.setNotification({ response: response });
                        }
                    }.bind(this)
                });
            }.bind(this));
        },

        renderView: function(model) {
            this.renderApp('view', model);
        },

        renderEdit: function(model) {
            this.renderApp('edit', model);
        },

        setPersonalsAndEmail: function(user) {
            if (!_(this).model.modifiables[0].enabled) {
                _(this).model.set('name', user.name);
                _(this).model.set('surname', user.surname);
            }
            if (!_(this).model.modifiables[1].enabled) {
                _(this).model.set('email', user.email);
            }
        },

        onLocationChange: function(hash) {
            service.getLoggedUsername().then(function(user) {
                _(this).loggedUser = user.username;

                _(this)._isDuringSave = false;
                _(this).model = new RegularUserProfileModel();
                hash = hash.replace(/\/$/, "").split("/");
                if (hash.length === 1 && hash[0] === "edit") {
                    _(this).model.mode = hash[0];
                }
                this.fillProfile();
            }.bind(this)).catch(function() {
                responseHandler.setNotificationError({ response: "user_does_not_exist" });
                goBack();
            });

        },

        fillProfile: function() {
            service.getUserInfo(_(this).loggedUser).then(function(user) {
                this.isFederatedUser = (user.authMode === "federated");

                service.getUserPrivileges(user.username)
                    .then(function(roles) {
                        _(this).model.roles = roles;

                        service.getModifiables().then(function(modifiables) {
                            _(this).model.modifiables = modifiables;
                        }.bind(this))
                        .catch(function(xhr) {
                            responseHandler.setNotificationError({ response: xhr });
                            goBack();
                        }).then(function() {
                            _(this).model.set('username', user.username);
                            _(this).model.fetch({
                                success: function() {
                                    this.setPersonalsAndEmail(user);
                                    if ( _(this).model.mode === "edit" && !this.isFederatedUser ) {
                                        this.renderEdit(_(this).model);
                                    } else {
                                        _(this).model.set('previousLogin', this.formatTime(user.previousLogin));
                                        _(this).model.set('status', user.status === 'enabled' ? Dictionary.enabled : Dictionary.disabled);
                                        _(this).model.set('boolType', user.status === 'enabled');
                                        this.renderView(_(this).model);
                                        if ( this.isFederatedUser ) {
                                            this.getEventBus().publish('topsection:defaultactions', this.getContextActions('view'));
                                        }
                                    }
                                }.bind(this),
                                error: function() {
                                    responseHandler.setNotificationError({ response: "user_does_not_exist" });
                                    goBack();
                                }.bind(this)
                            });
                        }.bind(this));
                }.bind(this)).catch(function() {
                    responseHandler.setNotificationError({ response: "user_does_not_exist" });
                    goBack();
                });
            }.bind(this)).catch(function() {
                responseHandler.setNotificationError({ response: "user_does_not_exist" });
                goBack();
            });
        },

        onResume: function() {
            if (_(this).locationController) {
                _(this).locationController.start();
            }
        },

        onPause: function() {
            _(this).locationController.stop();
        },

        getContextActions: function(type) {
            var actions = [];
            if ( this.isFederatedUser ) {
                actions.push(
                    _(this).actions.changePasswordByUser,
                    _(this).actions.getCredentials
                );
            } else {
                if (type === 'view') {
                    actions.push(
                        _(this).actions.changePasswordByUser,
                        _(this).actions.editData,
                        _(this).actions.getCredentials
                    );
                } else if (type === 'edit') {
                    actions.push(
                        _(this).actions.save,
                        _(this).actions.cancel,
                        _(this).actions.separator
                    );
                }
            }
            return actions;
        },

        renderApp: function(type, model) {
            if (this.layout) {
                this.layout.destroy();
            }
            this.layout = new TopSection({
                context: this.getContext(),
                title: type === 'edit' ? Dictionary.userprofile.edit_user_profile : Dictionary.userprofile.view_user_profile,
                defaultActions: this.getContextActions(type),
                breadcrumb: utils.removeChildAppsFromBreadcrumb(this.options.breadcrumb)
            });
            this.layout.attachTo(this.view.getElement());
            this.layout.setContent(
                new MultiSlidingPanels({
                    context: this.getContext(),
                    showLabel: true,
                    main: {
                        label: this.options.properties.title,
                        content: new MainRegion({
                            context: this.getContext(),
                            type: type,
                            model: model,
                            federatedUserView: this.isFederatedUser
                        })
                    }
                })
            );
        },

        formatTime: function(value) {
            var text = (value === undefined || value === null) ? Dictionary.neverLoggedIn : systemTime.formatTimestampWithTimezone(value);
            return text;
        },

        passwordPoliciesCollection: new PasswordPoliciesCollection(),
        createCredentialRegion: function(mode) {

            var options = {
                model: new UserProfileCredentialsModel(),
            };

            options.model.passwordPoliciesCollection = this.passwordPoliciesCollection;

            options.model.set('username', _(this).model.get('username'), { silent: true });
            this.credentialsManager = new CredentialsManager(options);

            this.credentialsManager.addEventHandler('loader-show', function() {
                container.getEventBus().publish('container:loader');
            }.bind(this));

            this.credentialsManager.addEventHandler('loader-hide', function() {
                container.getEventBus().publish('container:loader-hide');
            }.bind(this));

            this.credentialsManager.showFlyout();
        }
    });
});
