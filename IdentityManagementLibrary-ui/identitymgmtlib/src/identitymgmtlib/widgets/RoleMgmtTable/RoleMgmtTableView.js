define([
    "jscore/core",
    "text!./RoleMgmtTable.html",
    "styles!./RoleMgmtTable.less"
], function (core, template, style) {
    
    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getTitle: function() {
            return this.getElement().find(".elIdentitymgmtlib-RoleMgmtTable-title");
        },

        getSelectedCaption: function() {
            return this.getElement().find(".elIdentitymgmtlib-RoleMgmtTable-selectedCaption");
        },

        getCounter: function() {
            return this.getElement().find(".elIdentitymgmtlib-RoleMgmtTable-counter");
        },

        getSelectedCounter: function() {
            return this.getElement().find(".elIdentitymgmtlib-RoleMgmtTable-selectedCounter");
        },

        getWidget: function() {
            return this.getElement().find(".elIdentitymgmtlib-RoleMgmtTable-widget");
        }

    });

});