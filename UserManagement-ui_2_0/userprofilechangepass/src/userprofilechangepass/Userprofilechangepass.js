define([
    'jscore/core',
    'jscore/ext/privateStore',
    './Dictionary',
    'widgets/Breadcrumb',
    'uit!./userprofilechangepass.html',
    './regions/mainregion/MainRegion',
    'userprofilechangepass/model/UserProfileChangePassModel',
    'jscore/ext/locationController',
    'usermgmtlib/model/PasswordPoliciesCollection',
    'layouts/TopSection',
    'layouts/MultiSlidingPanels',
    'container/api',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler'
], function(core, PrivateStore, Dictionary, Breadcrumb, View, MainRegion, UserProfileChangePassModel, LocationController, PasswordPoliciesCollection, TopSection, MultiSlidingPanels, container, responseHandler) {


    var _ = PrivateStore.create();

    function goBack() {
        window.history.back();
    }

    function showLoader() {
        container.getEventBus().publish('container:loader');
    }

    function hideLoader() {
        container.getEventBus().publish('container:loader-hide');
    }

    var getActions = function(valid) {
        return [{
            name: Dictionary.save,
            type: 'button',
            disabled: !valid,
            color: 'blue',
            action: function() {
                this.getEventBus().publish('userprofilechangepass:save');
            }.bind(this)
        },{
            name: Dictionary.cancel,
            type: 'button',
            action: function() {
                this.getEventBus().publish('userprofilechangepass:cancel');
               goBack();
            }.bind(this)
        }];
    };

    return core.App.extend({

        View: View,

        addEventHandlers: function() {
            // subscribe for save action
            this.getEventBus().subscribe('userprofilechangepass:save', function() {
                _(this).model.save({
                    success: function(model, response, options) {
                        this.notification = responseHandler.setNotificationSuccess({ response: "success_password_change" });
                        this.notificationId = this.notification.addEventHandler('close', function() {
                            this.notification.removeEventHandler('close', this.notificationId);
                            goBack();
                        }.bind(this));
                    }.bind(this),
                    error: function(model, response, validationFailed) {
                        // show message only when it is not a validation
                        if (!validationFailed) {
                            responseHandler.setNotification({ response: response });
                        }
                    }.bind(this)
                });

            }.bind(this));
        },

        onStart: function() {

            _(this).locationController = new LocationController({
                namespace: this.options.namespace,
                autoUrlDecode: false
            });

            _(this).locationController.addLocationListener(this.onLocationChange.bind(this));

            this.addEventHandlers();
            this.onResume();
        },

        onResume: function() {
            if(this.topSection) {
                this.topSection.destroy();
            }
            _(this).locationController.start();
            if (this.passwordPoliciesCollection) {
                this.passwordPoliciesCollection.clearTicks();
            }
        },

        onPause: function() {
            _(this).locationController.stop();
        },

        passwordPoliciesCollection: new PasswordPoliciesCollection(), //because on any location change, the model is creating, policies has to stay unchanged

        onLocationChange: function(hash) {
            // crate new model
            _(this).model = new UserProfileChangePassModel();
            
            hash = hash.replace(/\/$/, "").split("/");

            _(this).model.getUser().then(function(results) {
                _(this).model.set('username', results.username);
                _(this).model.passwordPoliciesCollection = this.passwordPoliciesCollection;
                this.renderApp(_(this).model);
            }.bind(this), function(results) {
                reject(results.response);
            });

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
                            model: model
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
