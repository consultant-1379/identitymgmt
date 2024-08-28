define([
    'jscore/core',
    'template!./ProfileSummaryRoles.html',
    'styles!./ProfileSummaryRoles.less',
    '../../Dictionary'
], function (core, template, styles, Dictionary) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template(Dictionary);
        },

        getStyle: function () {
            return styles;
        },

        getRolesTable: function() {
            return this.getElement().find(".eaUsermanagement-ProfileSummaryRoles");
        },

        getCaption: function() {
            return this.getElement().find(".eaUsermanagement-ProfileSummaryRoles-assignedRoles-label");
        },

        getServiceTgs: function() {
            return this.getElement().find(".eaUsermanagement-ProfileSummaryRoles-serviceTgs-value");
        },

        getListServiceTgs: function() {
            return this.getElement().find(".eaUsermanagement-ProfileSummaryRoles-serviceTgs-view");
        }

    });

});