define([
    'jscore/core',
    'text!./TargetMgmtRegion.html'
], function(core, template) {
    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getTable: function() {
            return this.getElement().find('.eaTargetmanagement-TargetMgmtRegion-table');
        }
    });
});