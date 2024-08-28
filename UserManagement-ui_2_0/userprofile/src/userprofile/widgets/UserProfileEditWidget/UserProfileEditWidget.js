define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./UserProfileEditWidget.html',
    'identitymgmtlib/mvp/binding',
    '../../Dictionary',
], function (core, PrivateStore, View, binding, Dictionary) {
    'use strict';

    var _ = PrivateStore.create();
    var _modifiables = {};
    var _isSecAdmin = false;

    return core.Widget.extend({

        init: function() {
            _(this).model = this.options.model;
            _isSecAdmin = this.checkPrivileges();
            this.mapModifiables();
        },

        View: function() {
            return new View({
                Dictionary: Dictionary,
                inputFields: [{
                    id: 'name',
                    name: Dictionary.userProfileTable.name,
                    required: true,
                    validator: 'nameValidation',
                    editable: _isSecAdmin ? true : _modifiables.name

                }, {
                    id: 'surname',
                    name: Dictionary.userProfileTable.surname,
                    required: true,
                    validator: 'surnameValidation',
                    editable: _isSecAdmin ? true :_modifiables.surname
                }, {
                    id: 'email',
                    name: Dictionary.userProfileTable.email,
                    required: false,
                    validator: 'emailValidation',
                    editable: _isSecAdmin ? true :_modifiables.email
                }]
            });
        },

        checkPrivileges: function() {
           _(this).model.isAdmin = _(this).model.roles.some(function(roles) {
               return roles.role === "SECURITY_ADMIN";
           }.bind(this));

           return _(this).model.isAdmin;
        },

        mapModifiables: function() {
             var mods = _(this).model.modifiables;
             _modifiables.name = mods[0].enabled;
             _modifiables.surname = mods[0].enabled;
             _modifiables.email = mods[1].enabled;
        },

        onViewReady: function() {

            binding.bind(_(this).model, this.view, {
                'username': ['username'],
                'name': ['name', 'nameValidation'],
                'surname': ['surname', 'surnameValidation'],
                'email': ['email', 'emailValidation']
            });
        }
    });

});