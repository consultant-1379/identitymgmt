define([
    "jscore/core",
    "template!./ConfirmationSummaryList.html",
    "styles!./ConfirmationSummaryList.less",
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
             this.getElement().find(".elIdentitymgmtlib-ConfirmationSummaryList-status-total-count").setText(text);
        },

        setSucceedCount: function(text){
            this.getElement().find(".elIdentitymgmtlib-ConfirmationSummaryList-status-succeed-count").setText(text);
        },

        setFailedCount: function(text){
            this.getElement().find(".elIdentitymgmtlib-ConfirmationSummaryList-status-failed-count").setText(text);
        },

        getStatusSucceedField: function(){
            return this.getElement().find(".elIdentitymgmtlib-ConfirmationSummaryList-status-succeed");
        },

        getStatusFailedField: function(){
            return this.getElement().find(".elIdentitymgmtlib-ConfirmationSummaryList-status-failed");
        },

        getStatusTotalField: function(){
            return this.getElement().find(".elIdentitymgmtlib-ConfirmationSummaryList-status-total");
        },

        getTableDiv: function(){
            return this.getElement().find(".elIdentitymgmtlib-ConfirmationSummaryList-table");
        },

        setInfoDiv: function(text){
            this.getElement().find(".elIdentitymgmtlib-ConfirmationSummaryList-info").setText(text);
        }

    });
});