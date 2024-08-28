define([
    'jscore/core',
    'template!./containerWidget.html',
    "styles!./containerWidget.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        },

        getRoleFormWrapper: function(){
            return this.getElement().find(".eaRolemgmtlib-containerWidget-roleFormWrapper");
        },

        getDetailsWrapper: function(){
            return this.getElement().find(".eaRolemgmtlib-containerWidget-detailsWrapper");
        }
    });
});
