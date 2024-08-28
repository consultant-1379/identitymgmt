define([
    'jscore/core',
    'template!./_tableSettings.hbs',
    'styles!./_tableSettings.less'
], function (core, template, styles) {
    'use strict';

    var __prefix = '.elIdentitymgmtlib-wTableSettings';

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return styles;
        },

        getTableSettingsBtn: function () {
            return this.getElement().find(__prefix + '-settingsButton');
        },

        getTable: function () {
            return this.getElement().find(__prefix + '-table');
        }
    });
});
