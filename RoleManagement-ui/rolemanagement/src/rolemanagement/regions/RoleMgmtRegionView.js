define([
    'jscore/core',
    'text!./RoleMgmtRegion.html'
], function(core, template) {
    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getTable: function() {
            return this.getElement().find('.eaRolemanagement-RoleMgmtRegion-table');
        }
    });
});