define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./UserProfileViewWidget.html',
    'identitymgmtlib/mvp/binding',
    '../../Dictionary',
], function(core, PrivateStore, View, binding, Dictionary){

    var _ = PrivateStore.create();

    return core.Widget.extend({
        init: function() {
            _(this).model = this.options.model;
            _(this).isFederated = (this.options.federated === true);
        },

        view: function() {
            if ( _(this).isFederated ) {
                return new View({
                    Dictionary: Dictionary,
                    rows: [{
                        key: "username",
                        label: Dictionary.userProfileTable.username
                    }, {
                        key: "status",
                        showTick: true,
                        label: Dictionary.userProfileTable.status
                    }, {
                        key: "previousLogin",
                        label: Dictionary.userProfileTable.login
                    }]
                });
            } else {
                return new View({
                    Dictionary: Dictionary,
                    rows: [{
                        key: "username",
                        label: Dictionary.userProfileTable.username
                    }, {
                        key: "name",
                        label: Dictionary.userProfileTable.name
                    }, {
                        key: "surname",
                        label: Dictionary.userProfileTable.surname
                    }, {
                        key: "description",
                        label: Dictionary.userProfileTable.description
                    }, {
                        key: "email",
                        label: Dictionary.userProfileTable.email
                    }, {
                        key: "status",
                        showTick: true,
                        label: Dictionary.userProfileTable.status
                    }, {
                        key: "previousLogin",
                        label: Dictionary.userProfileTable.login
                    }]
                });
            }
        },

        onViewReady: function() {
            binding.bind(_(this).model, this.view, {
                'username': ['username'],
                'name': ['name'],
                'surname': ['surname'],
                'description': ['description'],
                'email': ['email'],
                'status': 'status',
                'previousLogin': 'previousLogin'
            });
            if(_(this).model.get('boolType')){
                this.view.getElement().find('i').setModifier('tick');
            }else{
                this.view.getElement().find('i').setModifier('error');
            }

        }
    });

});

