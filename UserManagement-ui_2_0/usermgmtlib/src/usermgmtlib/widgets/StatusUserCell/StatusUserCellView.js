define([   
    'jscore/core',
    'text!./StatusUserCell.html',
    'styles!./StatusUserCell.less'
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
        },

        getIcon: function(){
            return this.getElement().find('i');
        }

    });

});