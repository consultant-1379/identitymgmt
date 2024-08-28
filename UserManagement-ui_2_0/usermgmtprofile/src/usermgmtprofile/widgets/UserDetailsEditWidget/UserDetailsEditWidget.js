define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./UserDetailsEditWidget.html',
    'identitymgmtlib/mvp/binding',
    '../../Dictionary',
], function (core, PrivateStore, View, binding, Dictionary) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function() {
            _(this).model = this.options.model;
        },

        view: function() {
            return new View({
                passwordAgeingWidget: {
                    model: _(this).model
                },
                Dictionary: Dictionary,
                inputFields: [{
                    id: 'name',
                    name: Dictionary.name,
                    required: true,
                    validator: 'nameValidation',
                    editable:false,
                    maxlength: 64
                }, {
                    id: 'surname',
                    name: Dictionary.surname,
                    required: true,
                    validator: 'surnameValidation',
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
                }]
            });
        },

        onViewReady: function() {
            binding.bind(_(this).model, this.view, {
                'username': ['username'],
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
