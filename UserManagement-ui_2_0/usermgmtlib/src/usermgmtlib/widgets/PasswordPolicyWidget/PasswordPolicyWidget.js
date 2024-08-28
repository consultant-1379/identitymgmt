define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./passwordPolicyWidget.html',
    '../../Dictionary',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/widgets/PasswordPolicyElement',
    'identitymgmtlib/mvp/binding'
], function(core, PrivateStore, View, Dictionary, UserManagementService, PasswordPolicyElement, binding) {

    //TODO: manage the timeout and sent policies request after 300ms when user stop typeing password
    var _ = PrivateStore.create();

    return core.Widget.extend({
        policyWidgets: {},
        init: function(options) {
            this.PasswordPoliciesCollection = options.collection;
        },

        view: function() {
            return new View({
                Dictionary: Dictionary
            });
        },

        onViewReady: function() {
            this.PasswordPoliciesCollection.fetch({
                success: function() {
                    this.PasswordPoliciesCollection.each(function(model) {
                        this.attachPolicyWidget(model);
                    }.bind(this));
                }.bind(this)
            });
        },

        getPolicyWidget: function(model) {

            if (!this.policyWidgets[model.get('name')]) {
                var policy = new PasswordPolicyElement({
                    model: model
                });
                this.policyWidgets[model.get('name')] = policy;
            }

            return this.policyWidgets[model.get('name')];
        },


        attachPolicyWidget: function(model) {
            this.getPolicyWidget(model).attachTo(this.view.getElement().find('.eaUsermgmtlib-wPasswordPolicyContainer-list'));
        },

        updatePolicyWidgets: function() {
            var toDetach = [];
            var toAttach = [];

            var policies = this.PasswordPoliciesCollection.toJSON();

            for (var name in this.policyWidgets) {

                var detach = false;

                for (var i = 0; i < policies.length; i++) {
                    if (policies[i].name === name) {
                        detach = true;
                        // break; //this break crash phantom and it is sad
                    }
                }

                if (!detach) {
                    toDetach.push(name);
                }
            }

            toAttach = policies.filter(function(policy) {
                return this.policyWidgets[policy.name] ? false : true;
            }.bind(this));

            toAttach = toAttach.map(function(policy) {
                return policy.name;
            });

            toDetach.forEach(function(policyName) {
                this.policyWidgets[policyName].detach();
                delete this.policyWidgets[policyName];
            }.bind(this));

            toAttach.forEach(function(policyName) {
                this.attachPolicyWidget(this.PasswordPoliciesCollection.getModel(policyName));
            }.bind(this));
        },

        setValid: function() {
            this.updatePolicyWidgets();
        },

        setInvalid: function(result) {
            this.updatePolicyWidgets();
        }
    });
});
