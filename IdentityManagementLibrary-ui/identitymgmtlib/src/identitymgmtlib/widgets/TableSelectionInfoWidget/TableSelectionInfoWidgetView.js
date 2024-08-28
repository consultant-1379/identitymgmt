define([
    'jscore/core',
    'template!./TableSelectionInfoWidget.html',
    "styles!./TableSelectionInfoWidget.less"
], function (core, template, style) {

    return core.View.extend({

        showModifier: "show",

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        },

        getSelectedMessage: function () {
            return this.getElement().find(".elIdentitymgmtlib-wSelectedMessage-innerWrapper");
        },

        showSelectedMsg : function() {
            this.setModifier(this.getSelectedMessage(),this.showModifier,"true");
        },

        hideSelectedMsg : function() {
            this.setModifier(this.getSelectedMessage(),this.showModifier,"false");
        },

        setModifier : function(element, modifier, status){
            if(element.hasModifier(modifier)){
                element.removeModifier(modifier);
            }
            element.setModifier(modifier,status);
        },

        getSelectedRowsInfo: function() {
            return this.getElement().find(".elIdentitymgmtlib-wSelectedMessage-content-selectedRowsInfo");
        },

        setSelectedRowsInfo: function(text) {
            this.getSelectedRowsInfo().setText(text);
        },

        getSelectAllOnCurrentPage: function () {
            return this.getElement().find(".elIdentitymgmtlib-wSelectedMessage-content-selectAllOnCurrentPage");
        },

        setSelectAllOnCurrentPage: function(text) {
            this.getSelectAllOnCurrentPage().setText(text);
        },

        getSelectAllOnAllPage: function () {
            return this.getElement().find(".elIdentitymgmtlib-wSelectedMessage-content-selectAllOnAllPage");
        },

        setSelectAllOnAllPage: function(text) {
            this.getSelectAllOnAllPage().setText(text);
        },

        getClearAll: function () {
            return this.getElement().find(".elIdentitymgmtlib-wSelectedMessage-content-clearAll");
        },

        setClearAll: function(text) {
            this.getClearAll().setText(text);
        }
    });
});
