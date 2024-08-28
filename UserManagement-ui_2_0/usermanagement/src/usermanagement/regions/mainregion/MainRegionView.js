define([
    'jscore/core',
    'template!./MainRegion.html',
    '../../Dictionary'
], function (core, template,Dictionary) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template(Dictionary);
        },

        getSummary: function() {
            return this.getElement().find('.summary');
        },

        getTable: function() {
            return this.getElement().find('.table');
        },

        getNotification: function() {
            return this.getElement().find('.notification');
        }

    });

});