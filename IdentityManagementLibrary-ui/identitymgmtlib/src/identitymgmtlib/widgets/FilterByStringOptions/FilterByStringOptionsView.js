define([
    "jscore/core",
    "text!./FilterByStringOptions.html",
    "styles!./FilterByStringOptions.less"
], function(core, template, style) {

    return core.View.extend( {

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        setSelected: function(value) {
            this.getElement().setText(value);
        },

        getSelected: function() {
            return this.getElement().getText();
        }

    });

});