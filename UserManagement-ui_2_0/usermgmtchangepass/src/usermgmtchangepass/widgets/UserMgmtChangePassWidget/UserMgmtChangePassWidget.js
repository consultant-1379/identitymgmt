define([
    'jscore/core',
    'container/api',
    'jscore/ext/privateStore',
    'uit!./usermgmtchangepasswidget.html',
    '../../Dictionary',
    'identitymgmtlib/mvp/binding',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    "widgets/Button"
], function(core, container, PrivateStore, View, Dictionary, binding, responseHandler, Button) {

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
                }, {
                    id: 'passwordResetFlag',
                    name: Dictionary.forcePasswordChange,
                    type: 'checkbox',
                    checkbox: true,
                    onLabel: Dictionary.On,
                    offLabel: Dictionary.Off,
                    status: (this.options.enforcedUserHardening && this.options.enforcedUserHardening === true)?"disabled":"enabled"
                }]
            });
        },


        onViewReady: function() {

            this.setInfoTest();

            binding.bind(_(this).model, this.view, {
                'password': ['password', 'passwordValidation', 'passwordPolicy'],
                'passwordConfirm': ['passwordConfirm'],
                'passwordResetFlag': 'passwordResetFlag'
            });

        },

        setInfoTest: function() {
            this.getViewElement('-mainContent-topInfoText1').setText(Dictionary.topInfoText1);
            this.getViewElement('-mainContent-topInfoTextUserName').setText('"' + this.options.model.get('username') + '"');
            this.getViewElement('-mainContent-topInfoText2').setText(Dictionary.topInfoText2);
        },


        getViewElement: function(classNamePostfix) {
            return this.view.getElement().find(".eaUsermgmtchangepass-wUserMgmtChangePassWidget" + classNamePostfix);
        }

    });
});
