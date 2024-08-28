/*global define */
define([
    'jscore/core',
    'template!./AssignTGFlyout.html',
    'styles!./AssignTGFlyout.less'
], function (core, template, styles) {
    // 'use strict';

    return core.View.extend({

        showModifier: 'show',

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return styles;
        },

        getInfoPopupContainer: function () {
            return this.getElement().find(".eaUsermgmtlib-wAssignTGFlyout-infoPopupContainer");
        },

        getRoleNameLabel: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-Label');
        },

        getRoleNameContainer: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-RoleName');
        },

        getApplyButton: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-ButtonApply');
        },

        getCancelButton: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-ButtonCancel');
        },

        getListContainer: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-ListContainer');
        },

        getTgAllRadio: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-RadioButtonAssignAll');
        },

        getTgNoneRadio: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-RadioButtonAssignNone');
        },

        getManualTgRadio: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-RadioButtonAssignManually');
        },

        getErrorMessageBox: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-role-error-message');
        },

        getErrorBox: function () {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-role-error');
        },

        getInlineMessageHolder: function() {
            return this.getElement().find('.eaUsermgmtlib-wAssignTGFlyout-Content-inlineMessageHolder');
        }
    });
});
