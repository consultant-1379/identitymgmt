define([
    "jscore/core",
    "text!./ConfirmationStatusCell.html",
    "styles!./ConfirmationStatusCell.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle:function () {
            return style;
        },

        getStatusText: function() {
            return this.getElement().find('.elIdentitymgmtlib-ConfirmationStatusCell-text');
        }
    });

});