/*global define */
define([
    'jscore/core',
    'template!./UnassignTGFlyout.html',
    'styles!./UnassignTGFlyout.less'
], function (core, template, styles) {

    return core.View.extend({

        showModifier: 'show',

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return styles;
        },

        getRoleNameContainer: function () {
            return this.getElement().find('.eaUsermgmtlib-wUnassignTGFlyout-RoleName');
        },

        getRoleNameLabel: function () {
            return this.getElement().find('.eaUsermgmtlib-wUnassignTGFlyout-Label');
        },

        getApplyButton: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-ButtonApply');
        },

        getCancelButton: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-ButtonCancel');
        },

        getListContainer: function () {
            return this.getElement().find('.eaUsermgmtlib-wUnassignTGFlyout-ListContainer');
        },

        getErrorMessageBox: function () {
            return this.getElement().find('.eaUsermgmtlib-wUnassignTGFlyout-role-error-message');
        },

        getErrorBox: function () {
            return this.getElement().find('.eaUsermgmtlib-wUnassignTGFlyout-role-error');
        }

    });
});
