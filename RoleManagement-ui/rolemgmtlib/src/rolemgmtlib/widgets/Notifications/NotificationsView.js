define([
    "jscore/core",
    "text!./notifications.html",
    "styles!./notifications.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle:function () {
            return style;
        },

        getNotificationHolder: function(){
            return this.getElement().find(".eaRolemgmtlib-notif-notifHolder");
        }
    });

});