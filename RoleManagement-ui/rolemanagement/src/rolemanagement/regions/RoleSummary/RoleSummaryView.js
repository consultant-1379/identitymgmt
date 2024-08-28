/*global define */
define([
    'jscore/core',
    'template!./RoleSummary.html',
    'styles!./RoleSummary.less'
], function(core, template, styles) {
    // 'use strict';

    return core.View.extend({

        showModifier: 'show',

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return styles;
        },

        getRoleNameContainer: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-Name');
        },

        getRoleDescriptionContainer: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-Description');
        },

        getRoleTypeContainer: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-Type');
        },

        getRoleStatusContainer: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-Status');
        },

        getRoleSummaryContent: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-Content');
        },

        getRoleSummaryStatusIcon: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-StatusIcon');
        },

        getRolesListContainer: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-RolesList');
        },

        getCapabilitiesContainer: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-Capabilities');
        },

        getCapabilitiesInfo: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-Capabilities-Info');
        },

        getRoleDetailsLinkWrapper: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-RoleDetailsLinkWrapper');
        },

        setModifier: function(element, modifier, status) {
            if (element.hasModifier(modifier)) {
                element.removeModifier(modifier);
            }
            element.setModifier(modifier, status);
        },

        getRoleDetailsLink: function() {
            return this.getElement().find('.eaRolemanagement-RoleSummary-RoleDetailsLink');
        },

        setRoleDetailLink: function(href) {
            this.getRoleDetailsLink().setAttribute('href', href);
        }
    });
});
