define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./UserDetailsCreateWidget.html',
    'identitymgmtlib/mvp/binding',
    '../../Dictionary'
], function(core, PrivateStore, View, binding, Dictionary) {

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
                passwordAgeingWidget: {
                    model: _(this).model
                },
                Dictionary: Dictionary,
                inputFields: [{
                    id: 'username',
                    name: Dictionary.username,
                    required: true,
                    validator: 'usernameValidation',
                    debounce: 300,
                    maxlength: 32
                }, {
                    id: 'name',
                    name: Dictionary.name,
                    required: true,
                    validator: 'nameValidation',
                    debounce: 300,
                    maxlength: 64
                }, {
                    id: 'surname',
                    name: Dictionary.surname,
                    required: true,
                    validator: 'surnameValidation',
                    debounce: 300,
                    maxlength: 64
                }, {
                    id: 'email',
                    name: Dictionary.emailAddress,
                    required: false,
                    validator: 'emailValidation',
                    maxlength: 255
                }, {
                    id: 'status',
                    name: Dictionary.status,
                    type: 'checkbox',
                    checkbox: true,
                    onLabel: Dictionary.enabled,
                    offLabel: Dictionary.disabled,
                    onValue: 'enabled',
                    offValue: 'disabled'
                }, {
                    id: 'description',
                    name: Dictionary.description,
                    type: 'textarea',
                    textarea: true
                }, {
                    id: 'autocompletation_off_text',
                    name: "",
                    required: false,
                    hidden: true
                }, {
                    id: 'autocompletation_off_password',
                    name: "",
                    required: false,
                    type: 'password',
                    hidden: true
                }],
                inputPasswordFields: [{
                    id: 'authMode',
                    name: Dictionary.authMode,
                    type: 'selectbox',
                    selectBox: true,
                    sbOptions: {
                    selectBoxOptions: {
                        value: {
                            name: Dictionary.local,
                            value: 'local',
                            title: Dictionary.local
                        },
                        items: [{
                            name: Dictionary.local,
                            value: 'local',
                            title: Dictionary.local
                        }, {
                            name: Dictionary.remote,
                            value: 'remote',
                            title: Dictionary.remote
                        }]
                    }}
                }, {
                    id: 'password',
                    name: Dictionary.password,
                    required: true,
                    type: 'password',
                    debounce: 300
                }, {
                    id: 'passwordConfirm',
                    name: Dictionary.repeatPassword,
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
                    status: (this.options.enforcedUserHardening  && this.options.enforcedUserHardening === true)?"disabled":"enabled"
                }],
                infoPopup: {
                    content: Dictionary.usernamePolicy.infoPopup
                }
            });
        },

        onViewReady: function() {

            binding.bind(_(this).model, this.view, {
                'username': ['username', 'usernameValidation'],
                'password': ['password', 'passwordValidation', 'passwordPolicy'],
                'passwordConfirm': ['passwordConfirm'],
                'passwordResetFlag': 'passwordResetFlag',
                'name': ['name', 'nameValidation'],
                'surname': ['surname', 'surnameValidation'],
                'email': ['email', 'emailValidation'],
                'status': 'status',
                'description': ['description'],
                'passwordAgeing': 'passwordAgeing',
                'authMode': 'authMode'
            });
        }
    });

});
