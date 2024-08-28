define([
    'jscore/core',
    'template!./errorWidget.html',
    "styles!./errorWidget.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        },

        setHeader: function(text){
            this.getElement().find(".eaIdentitymgmtlib-errorWidget-header").setText(text);
        },

        setContent: function(text){
            this.getElement().find(".eaIdentitymgmtlib-errorWidget-content").setText(text);
        }
    });
});
