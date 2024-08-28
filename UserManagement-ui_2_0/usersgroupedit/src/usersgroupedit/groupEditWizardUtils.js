define([
], function() {

    var constants = {
        'DETAILS': 0,
        'ROLES': 1,
        'AUTHENTICATION': 2,
        'SUMMARY': 3,
        'APPLY': 4
    };

    return {
        enableStep: function(wizard, step, enabled) {
            if(wizard._steps && wizard._steps[step] ) {
                wizard._steps[step].header.setEnabled(enabled);
            }
        },

        enableAuthenticationStep: function(wizard) {
            this.enableStep(wizard, constants.AUTHENTICATION, true);
        },

        enableSummaryStep: function(wizard, model) {
            this.enableStep(wizard, constants.SUMMARY, model.isChangedModel());
        },

        goToApplyStep: function(wizard) {
            wizard.setStep(constants.APPLY);
        }
    };


});
