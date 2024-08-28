define([
    "jscore/core",
    "text!./DescriptionCell.html",
    "styles!./DescriptionCell.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle:function () {
            return style;
        },

        getDescriptionText: function() {
            return this.getElement().find('span');
        }
    });

});