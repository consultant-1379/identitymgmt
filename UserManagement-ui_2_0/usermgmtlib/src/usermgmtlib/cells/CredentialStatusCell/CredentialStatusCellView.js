define([   
    'jscore/core',
    'text!./CredentialStatusCell.html',
    'styles!./CredentialStatusCell.less'
], function (core, template, style) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getCaption: function() {
            return this.getElement().find('span');
        }

    });

});