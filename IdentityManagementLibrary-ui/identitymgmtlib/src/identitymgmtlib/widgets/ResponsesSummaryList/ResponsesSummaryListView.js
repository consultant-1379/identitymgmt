define([
    "jscore/core",
    "template!./ResponsesSummaryList.html",
    "styles!./ResponsesSummaryList.less",
    "i18n!identitymgmtlib/common.json",
    "identitymgmtlib/Utils"
], function (core, template, style, dictionary, Utils) {

    return core.View.extend({

        getTemplate: function() {
            return template(Utils.mergeObjects(dictionary, this.options.data));
        },
        getStyle: function () {
            return style;
        },

        setTotalCount: function(text){
             this.getElement().find(".elIdentitymgmtlib-ResponsesSummaryList-status-total-count").setText(text);
        },

        setSuccededCount: function(text){
            this.getElement().find(".elIdentitymgmtlib-ResponsesSummaryList-status-succeded-count").setText(text);
        },

        setFailedCount: function(text){
            this.getElement().find(".elIdentitymgmtlib-ResponsesSummaryList-status-failed-count").setText(text);
        },

        getStatusSuccededField: function(){
            return this.getElement().find(".elIdentitymgmtlib-ResponsesSummaryList-status-succeded");
        },

        getStatusFaileddField: function(){
            return this.getElement().find(".elIdentitymgmtlib-ResponsesSummaryList-status-failed");
        },

        getStatusTotalField: function(){
            return this.getElement().find(".elIdentitymgmtlib-ResponsesSummaryList-status-total");
        },

        getTableDiv: function(){
            return this.getElement().find(".elIdentitymgmtlib-ResponsesSummaryList-table");
        },

        hideStatusSuccededField: function(){
            this.getStatusSuccededField().setStyle("display", "none");
        },

        hidetatusFaileddField: function(){
            this.getStatusFaileddField().setStyle("display", "none");
        },

        hideStatusTotalField: function(){
            this.getStatusTotalField().setStyle("display", "none");
        }
    });
});