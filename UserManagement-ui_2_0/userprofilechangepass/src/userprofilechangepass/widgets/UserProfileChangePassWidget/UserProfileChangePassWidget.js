define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./userprofilechangepasswidget.html',
    '../../Dictionary',
    'identitymgmtlib/mvp/binding',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    "widgets/Button"
], function(core, PrivateStore, View, Dictionary, binding, responseHandler, Button) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function() {
            _(this).model = this.options.model;
        },

        view: function() {
            return new View({
                passwordPoliciesWidget: {
                    collection: _(this).model.passwordPoliciesCollection
                },
                i18n: Dictionary,
                inputFields: [{
                    id: 'oldpassword',
                    name: Dictionary.currentPassword,
                    required: true,
                    type: 'password',
                    validator: 'oldpasswordValidation'
                }, {
                    id: 'password',
                    name: Dictionary.newPassword,
                    required: true,
                    type: 'password',
                    debounce: 300
                }, {
                    id: 'passwordConfirm',
                    name: Dictionary.repeatNewPassword,
                    required: true,
                    validator: 'passwordValidation',
                    type: 'password',
                    debounce: 300
                }]
            });
        },


        onViewReady: function() {

            this.setInfoTest();

            binding.bind(_(this).model, this.view, {
                'oldPassword': ['oldpassword', 'oldpasswordValidation'],
                'password': ['password', 'passwordValidation', 'passwordPolicy'],
                'passwordConfirm': ['passwordConfirm']
            });
        },

        setInfoTest: function() {
            this.getViewElement('-mainContent-topInfoText1').setText(Dictionary.topInfoText1);
            this.getViewElement('-mainContent-topInfoTextUserName').setText('"' + this.options.model.get('username') + '"');
            this.getViewElement('-mainContent-topInfoText2').setText(Dictionary.topInfoText2);
        },


        getViewElement: function(classNamePostfix) {
            return this.view.getElement().find(".eaUserprofilechangepass-wUserProfileChangePassWidget" + classNamePostfix);
        }


    });
});
