/*global define*/
define([
    'jscore/core',
    'template!./_tableSettingsForm.hbs',
    'styles!./_tableSettingsForm.less',
    'i18n!identitymgmtlib/common.json'
], function (core, template, styles,Dictionary) {
    'use strict';

    var __prefix = '.elIdentitymgmtlib-wTableSettingsForm';

    return core.View.extend({

        getTemplate: function () {
            return template(Dictionary);
        },

        getStyle: function () {
            return styles;
        },

        getContent: function () {
            return this.getElement().find(__prefix + '-content');
        },

        getApply: function () {
            return this.getElement().find(__prefix + '-apply');
        },

        getCancel: function () {
            return this.getElement().find(__prefix + '-cancel');
        }
    });
});
