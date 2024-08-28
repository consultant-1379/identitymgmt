define([
    "jscore/core",
    "text!./FilterByStringHeaderCell.html",
    "styles!./FilterByStringHeaderCell.less"
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return styles;
        },

        getInput: function() {
            return this.getElement().find("input");
        },

        getDiv: function() {
            return this.getElement().find("div > div");
        }

    });

});