define([
    'jscore/core',
    'uit!./passwordPolicyElement.html',
    '../../Dictionary',
    'identitymgmtlib/mvp/binding',
    'jscore/ext/privateStore'
], function(core, View, Dictionary, binding, PrivateStore) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            _(this).model = options.model;
            _(this).name = _(this).model.get('name');
            _(this).valid = _(this).model.get('valid');
            _(this).tickId = 'eaUsermgmtlib-wPasswordPolicyElement-policyField-policy-tick-' + _(this).name;
            _(this).valueId = 'eaUsermgmtlib-wPasswordPolicyElement-policyField-policy-value-' + _(this).name;
        },

        view: function() {
            return new View({
                text: Dictionary.passwordPolicies[_(this).name],
                policyName: _(this).name,
                tickId: _(this).tickId,
                valueId: _(this).valueId,
                details: _(this).name === 'minimumSpecialChars' ? Dictionary.passwordPolicies.list_of_special_char : ''
            });
        },

        onViewReady: function() {
            binding.bind(_(this).model, this.view, {
                "value": _(this).valueId,
                "valid": "" + _(this).tickId
            });
        }
    });
});
