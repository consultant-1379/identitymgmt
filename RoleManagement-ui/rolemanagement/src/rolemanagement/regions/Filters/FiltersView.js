/*global define */
define([
    'jscore/core',
    'template!./Filters.html',
    'styles!./Filters.less'
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

        getFilterApplyButtonContainer: function() {
            return this.getElement().find('.eaRolemanagement-Filters-applyFilterButton');
        },

        getFilterClearButtonContainer: function() {
            return this.getElement().find('.eaRolemanagement-Filters-clearFilterButton');
        },

        getFilterCancelButtonContainer: function() {
            return this.getElement().find('.eaRolemanagement-Filters-cancelFilterButton');
        },

        getFilterSearchInput: function() {
            return this.getElement().find('.eaRolemanagement-Filters-searchInput');
        },

        getRoleStatusListContainer: function() {
            return this.getElement().find('.eaRolemanagement-Filters-roleStatusList');
        },

        getRoleTypeListContainer: function() {
            return this.getElement().find('.eaRolemanagement-Filters-roleTypeList');
        },

        setModifier: function(element, modifier, status) {
            if (element.hasModifier(modifier)) {
                element.removeModifier(modifier);
            }
            element.setModifier(modifier, status);
        }
    });
});