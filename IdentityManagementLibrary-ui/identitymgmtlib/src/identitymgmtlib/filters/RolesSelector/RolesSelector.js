define([
    'jscore/core',
    'uit!./rolesSelector.html',
    'i18n!identitymgmtlib/common.json',
], function(core, View, Dictionary) {

    return core.Widget.extend({
        init: function(options) {
            this.view = new View({
                no_role: Dictionary.filters.roles.not_role_assigned,
                clear: Dictionary.filters.roles.clear
            });
        },

        onViewReady: function() {
            this.getElement().find('.elIdentitymgmtlib-RolesSelector-no_role').addEventHandler('click', this.trigger.bind(this, 'no_role'));
            this.getElement().find('.elIdentitymgmtlib-RolesSelector-clear').addEventHandler('click', this.trigger.bind(this, 'clear'));
        }
    });
});
