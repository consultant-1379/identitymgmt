define([
    'jscore/core',
    'template!./SelectAllNotification.html',
    "styles!./SelectAllNotification.less"
], function (core, template, style) {

    return core.View.extend({

        showModifier: "show",

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        },

        getSelectedUsersMessage: function () {
            return this.getElement().find(".eaUsermanagement-wSelectedUsersMessage-innerWrapper");
        },
        showUsersSelectedMsg : function() {
            this.setModifier(this.getSelectedUsersMessage(),this.showModifier,"true");
        },
        hideUsersSelectedMsg : function() {
            this.setModifier(this.getSelectedUsersMessage(),this.showModifier,"false");
        },

        setModifier : function(element, modifier, status){
            if(element.hasModifier(modifier)){
                element.removeModifier(modifier);
            }
            element.setModifier(modifier,status);
        },
        
        getSelectedRowsInfo: function() {
        	return this.getElement().find(".eaUsermanagement-wSelectedUsersMessage-content-selectedRowsInfo");
        },
        
        setSelectedRowsInfo: function(text) {
        	this.getSelectedRowsInfo().setText(text);
        },
        
        getSelectAllOnCurrentPage: function () {
            return this.getElement().find(".eaUsermanagement-wSelectedUsersMessage-content-selectAllOnCurrentPage");
        },
        
        setSelectAllOnCurrentPage: function(text) {
        	this.getSelectAllOnCurrentPage().setText(text);
        },
        
        getSelectAllOnAllPage: function () {
            return this.getElement().find(".eaUsermanagement-wSelectedUsersMessage-content-selectAllOnAllPage");
        },
        
        setSelectAllOnAllPage: function(text) {
        	this.getSelectAllOnAllPage().setText(text);
        },
        
        getClearAll: function () {
            return this.getElement().find(".eaUsermanagement-wSelectedUsersMessage-content-clearAll");
        },
        
        setClearAll: function(text) {
        	this.getClearAll().setText(text);
        },
        
        
    });
});
