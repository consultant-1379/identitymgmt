define([
    'jscore/core',
    'template!./CompareForm.html',
    "styles!./CompareForm.less",
    "i18n!rolemgmtlib/dictionary.json"
], function(core, template, style, dictionary) {

    return core.View.extend({

        getTemplate: function() {
            return template(dictionary);
        },

        getStyle: function() {
            return style;
        },

        getRoleNameElement: function(number) {
            return this.getElement().find('.eaRolemgmtlib-roleCompare-roleName' + number);
        },

        getStatusFormElement: function(number) {
            return this.getElement().find('.eaRolemgmtlib-roleCompare-table-status' + number);
        },

        getDescriptionFormElement: function(number) {
            return this.getElement().find('.eaRolemgmtlib-roleCompare-table-description' + number);
        },

        getActionFormElement: function(number) {
            return this.getElement().find('.eaRolemgmtlib-roleCompare-table-actions' + number);
        },

        setRoleName: function(name, number) {
            return this.getRoleNameElement(number).setText(name);
        },

        setStatus: function(name, number) {
            return this.getStatusFormElement(number).setText(name);
        },

        setDescription: function(name, number) {
            return this.getDescriptionFormElement(number).setText(name);
        },

        setAction: function(name, number) {
            return this.getActionFormElement(number).setValue(name);
        },

        getAction: function(number) {
            return this.getActionFormElement(number);
        }
    });
});