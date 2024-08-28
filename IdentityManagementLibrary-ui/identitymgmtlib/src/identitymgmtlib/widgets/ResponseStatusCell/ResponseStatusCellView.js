define([
    "jscore/core",
    "text!./ResponseStatusCell.html",
    "styles!./ResponseStatusCell.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle:function () {
            return style;
        },

        getStatusIcon: function() {
            return this.getElement().find('.elIdentitymgmtlib-ResponseStatusCell-icon');
        },

        getStatusText: function() {
            return this.getElement().find('.elIdentitymgmtlib-ResponseStatusCell-text');
        }
    });

});