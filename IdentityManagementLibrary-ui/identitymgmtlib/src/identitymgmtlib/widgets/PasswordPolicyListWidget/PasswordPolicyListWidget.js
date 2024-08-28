define([
    'jscore/core',
    './PasswordPolicyListWidgetView',
    'jscore/ext/net'
    ], function (core, View, net){	

       return core.Widget.extend({

            view: function() {
                return new View(this.options);
            },

            updatePolicy: function(policyId, valid){
                return this.view.setValidityOfPolicy(policyId, valid);
            }
    });
});
