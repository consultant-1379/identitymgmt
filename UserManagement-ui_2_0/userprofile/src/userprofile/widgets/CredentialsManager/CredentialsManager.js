define([
    'jscore/core',
    'jscore/ext/privateStore',
    'container/api',
    '../../Dictionary',
    'uit!./CredentialsManager.html',
    'widgets/InfoPopup',
    'widgets/Button',
    'identitymgmtlib/mvp/binding',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler'
], function(core, PrivateStore, container, Dictionary, View, InfoPopup, Button, binding, responseHandler) {


    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            _(this).model = options.model;

            _(this).model.forceValidEvents = true;

            _(this).model.set('credentialsFormat', this.credentialsFormats.value.value, { silent: true });

            this.buttonWidgetSubmit = new Button({
                caption: Dictionary.credentialsForm.submitButton,
                enabled: false,
                modifiers: [{ name: 'eaUserprofile-CredentialsManager-formContainer-actionsContainer-submit' }, { name: 'color_blue' }]
            });
            this.buttonWidgetCancel = new Button({
                caption: Dictionary.credentialsForm.cancelButton,
                modifiers: [{ name: 'eaUserprofile-CredentialsManager-formContainer-actionsContainer-cancel' }]
            });

        },

        credentialsFormats: {
            value: {
                name: "PKCS #12",
                value: "PKCS12",
                title: 'PKCS #12'
            },
            items: [{
                name: "PKCS #12",
                value: "PKCS12",
                title: 'PKCS #12'
            }, {
                name: "XML",
                value: "XML",
                title: 'XML'
            }]
        },


        view: function() {
            return new View({
                i18n: Dictionary,
                passwordPoliciesWidget: {
                    collection: _(this).model.passwordPoliciesCollection
                },
                inputFields: [{
                   id: 'PKIEntityPassword',
                   name: Dictionary.credentialsForm.entityPasswordLabel,
                   required: true,
                   type: 'password',
                   info: true,
                   validator: 'PKIValidation'
                }, {
                   id: 'credentialsFormat',
                   name: Dictionary.credentialsForm.credentialsFormatLabel,
                   type: 'select',
                   items: {
                   selectBoxOptions: this.credentialsFormats
                   },
                   selectWidget: true
                }, {
                    id: 'newPassword',
                    name: Dictionary.credentialsForm.passwordLabel,
                    required: true,
                    type: 'password',
                    debounce: 300

                }, {
                    id: 'repeatNewPassword',
                    name: Dictionary.credentialsForm.confirmPasswordLabel,
                    required: true,
                    type: 'password',
                    validator: 'passwordValidation',
                    debounce: 300
                }]
            });
        },

        onViewReady: function() {

            this.addEventHandlers();

            this.infoPopup = new InfoPopup({
                content: Dictionary.credentialsForm.entityPasswordTooltipContent,
                corner: "topRight"
            });
            this.infoPopup.attachTo(this.view.getElement().find('.eaIdentitymgmtlib-infoIconHolder-PKIEntityPassword'));
            this.view.getElement().find('.eaUsermgmtlib-wPasswordPolicyContainer').setModifier("policyFieldShorder");

            this.getViewElement('-actionsContainer-submit').setModifier('disabled');

            this.buttonWidgetSubmit.attachTo(this.getViewElement('-actionsContainer-submit'));
            this.buttonWidgetCancel.attachTo(this.getViewElement('-actionsContainer-cancel'));

            _(this).model.addEventHandler('change:credentialsFormat', function(collection) {
                this.buttonWidgetSubmit.disable();
                _(this).model.passwordPoliciesCollection.clearTicks();
                if (collection.get('credentialsFormat') === 'XML') {
                    this.view.findById("newPassword").disable({ clear: true });
                    this.view.findById("repeatNewPassword").disable({ clear: true });
                } else {
                    this.view.findById("newPassword").enable();
                    this.view.findById("repeatNewPassword").enable();
                }
            }.bind(this));

            binding.bind(_(this).model, this.view, {
                'credentialsFormat': ['credentialsFormat'],
                'PKIEntityPassword': ['PKIEntityPassword', 'PKIValidation'],
                'newPassword': ['newPassword', 'passwordValidation', 'passwordPolicy'],
                'repeatNewPassword': ['repeatNewPassword']

            });

            _(this).model.passwordPoliciesCollection.clearTicks();
        },

        addEventHandlers: function() {

            _(this).model.addEventHandler('valid', function() {
                this.buttonWidgetSubmit.enable();
            }.bind(this));

            _(this).model.addEventHandler('invalid', function() {
                this.buttonWidgetSubmit.disable();
            }.bind(this));

            this.buttonWidgetCancel.addEventHandler('click', function() {
                container.getEventBus().publish('flyout:hide');
            }.bind(this));

            this.buttonWidgetSubmit.addEventHandler('click', function() {
                this.trigger('loader-show');
                var credentialData = {
                    credentialsFormat: _(this).model.get('credentialsFormat'),
                    entityPassword: _(this).model.get('PKIEntityPassword'),
                    keyStorePassword: _(this).model.get('newPassword'),
                    user: _(this).model.get('username')
                };
                _(this).model.save(credentialData, {
                    success: function() {
                        this.trigger('loader-hide');
                        this.hideFlyout();
                        responseHandler.setNotificationSuccess({ response: Dictionary.credentialsForm.credentialsGetSuccess });
                    }.bind(this),
                    error: function() {
                        this.trigger('loader-hide');
                        this.hideFlyout();
                        responseHandler.setNotificationError({ response: Dictionary.credentialsForm.entityValidationError });
                    }.bind(this)
                });
            }.bind(this));
        },

        showFlyout: function() {
            container.getEventBus().publish('flyout:show', {
                header: Dictionary.credentialsForm.credentialsHeader,
                content: this,
                width: "524px"
            });
        },

        hideFlyout: function() {
            container.getEventBus().publish('flyout:hide');
        },

        getViewElement: function(classNamePostfix) {
            return this.view.getElement().find(".eaUserprofile-CredentialsManager-formContainer" + classNamePostfix);
        }

    });
});
