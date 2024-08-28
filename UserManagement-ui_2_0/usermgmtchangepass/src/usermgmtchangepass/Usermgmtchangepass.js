define([
    'jscore/core',
    'jscore/ext/privateStore',
    'i18n!identitymgmtlib/common.json',
    'uit!./usermgmtchangepass.html',
    './regions/mainregion/MainRegion',
    'usermgmtchangepass/model/UserMgmtChangePassModel',
    'jscore/ext/locationController',
    'usermgmtlib/model/PasswordPoliciesCollection',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'identitymgmtlib/AccessControlService',
    'usermgmtlib/services/UserManagementService',
    'identitymgmtlib/Utils',
    'layouts/TopSection',
    'layouts/MultiSlidingPanels',
    'container/api',
    './Dictionary'
], function(core, PrivateStore, DictionaryIdentitmgmt, View, MainRegion, UserMgmtChangePassModel, LocationController, PasswordPoliciesCollection, responseHandler, AccessControlService, UserManagementService, utils, TopSection, MultiSlidingPanels, container, Dictionary) {


    var _ = PrivateStore.create();

    var getActions = function(valid) {
        return [{
            name: DictionaryIdentitmgmt.save,
            type: 'button',
            disabled: !valid,
            color: 'blue',
            action: function() {
                this.getEventBus().publish('usermgmtchangepass:save');
            }.bind(this)
        },{
            name: DictionaryIdentitmgmt.cancel,
            type: 'button',
            action: function() {
               this.getEventBus().publish('usermgmtchangepass:cancel');
               this.goBack();
            }.bind(this)
        }];
    };


    function showLoader() {
        container.getEventBus().publish('container:loader');
    }

    function hideLoader() {
        container.getEventBus().publish('container:loader-hide');
    }

    return core.App.extend({

        View: View,

        goBack: function() {
                window.location.href = "/#usermanagement";
        },

        performOnStart: function() {
            _(this).locationController = new LocationController({
                namespace: this.options.namespace,
                autoUrlDecode: false
            });

            //workaround
            this.options.breadcrumb.splice(1, 0, {
                "name": "User Management",
                "url": "#usermanagement"
            });
            _(this).locationController.addLocationListener(this.onLocationChange.bind(this));

            this.addEventHandlers();
            this.onResume();
        },

        onStart: function() {
            AccessControlService.isAppAvailable('user_management').then(function() {
                UserManagementService.getEnforceUserHardeningState().then( function(euh) {
                    this.enforcedUserHardening = euh;
                    this.performOnStart();
                }.bind(this),
                function(response) {
                    this.enforcedUserHardening = false;
                    this.performOnStart();
                }.bind(this));
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
            // subscribe for save action
            this.getEventBus().subscribe('usermgmtchangepass:save', function() {
                showLoader();
                _(this).model.save({
                    success: function(model, response, options) {
                        hideLoader();
                        responseHandler.setNotificationSuccess({ response: "success_password_change" });
                        this.goBack();
                    }.bind(this),
                    error: function(model, response, validationFailed) {
                        // show message only when it is not a validation
                        hideLoader();
                        if (!validationFailed) {
                            if(response.getResponseJSON().httpStatusCode === 404 && response.getResponseJSON().internalErrorCode === 'UIDM-4-4'){
                                responseHandler.setNotification({ response: response,
                                    values: [_(this).model.get('username')]
                                });
                            } else {
                                responseHandler.setNotification({ response: response });
                            }
                        }
                        this.goBack();
                    }.bind(this)
                });

            }.bind(this));
        },

        performOnResume: function() {
            _(this).locationController.start();

            if (this.passwordPoliciesCollection) {
                this.passwordPoliciesCollection.clearTicks();
            }
        },
        onResume: function() {

            if (this.topSection) {
                this.topSection.destroy();
            }

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
        },

        onPause: function() {
            if (_(this).locationController) {
                _(this).locationController.stop();
            }
        },

        passwordPoliciesCollection: new PasswordPoliciesCollection(), //becouse on any location change, the model is creating, policies has to stay unchanged

        onLocationChange: function(hash) {

            // crate new model
            _(this).model = new UserMgmtChangePassModel();

            // replace // with /
            hash = hash.replace(/\/$/, "").split("/");

            _(this).model.set('username', hash[1]);

            //check if user exist
            _(this).model.getUser({
                success: function(data) {},
                error: function(message, response, validationFailed) {
                    responseHandler.setNotificationError({
                        response: response,
                        values: [hash[1]]
                    });
                    this.goBack();
                }.bind(this)
            });

            _(this).model.passwordPoliciesCollection = this.passwordPoliciesCollection;
            this.renderApp(_(this).model);
        },


        renderApp: function(model) {
            this.topSection = new TopSection({
                context: this.getContext(),
                title: Dictionary.title,
                breadcrumb: this.options.breadcrumb,
                defaultActions: getActions.call(this,false)
            });
            this.topSection.attachTo(this.view.getElement());
            this.topSection.setContent(
                new MultiSlidingPanels({
                    context: this.getContext(),
                    showLabel: true,
                    main: {
                        content: new MainRegion({
                            context: this.getContext(),
                            model: model,
                            enforcedUserHardening: this.enforcedUserHardening
                        })
                    }
                })
            );

            model.addEventHandler('valid', function() {
            // show disabled button
                this.getEventBus().publish('topsection:defaultactions', getActions.call(this,true));
            }.bind(this));

            model.addEventHandler('invalid', function() {
                //show enabled button
                this.getEventBus().publish('topsection:defaultactions', getActions.call(this,false));
            }.bind(this));
        }
    });

});
