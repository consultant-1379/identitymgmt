define([
    "jscore/core",
    "text!./StatusCell.html",
    "styles!./StatusCell.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle:function () {
            return style;
        },

        getStatusIcon: function() {
            return this.getElement().find('i');
        },

        getStatusText: function() {
            return this.getElement().find('span');
        }
    });

});