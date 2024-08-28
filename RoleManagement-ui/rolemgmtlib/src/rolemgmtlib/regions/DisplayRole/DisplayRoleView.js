define([
    'jscore/core',
    'template!./displayRole.html',
    "styles!./displayRole.less",
    "i18n!rolemgmtlib/dictionary.json"
], function (core, template, style, dictionary) {

    return core.View.extend({


        getTemplate: function () {
            return template(dictionary);
        },

        getStyle: function () {
            return style;
        },

        getRolesListFormElement: function() {
            return this.getElement().find('.eaRolemgmtlib-displayRole-comRolesList');
        },

        getCustomRoleDetailfFormElement: function() {
            return this.getElement().find('.eaRolemgmtlib-displayRole-customRolesDetails');
        },

        getNameElement: function() {
            return this.getElement().find('.eaRolemgmtlib-displayRole-header');
        },

        getName: function () {
            return this.getNameElement().getValue();
        },

        getDescriptionElement: function() {
            return this.getElement().find('.eaRolemgmtlib-displayRole-description');
        },

        getDescription: function () {
            return this.getDescriptionElement().getValue();
        },

        getStatusElement: function() {
            return this.getElement().find('.eaRolemgmtlib-displayRole-status');
        },

        getStatus: function () {
            return this.getStatusElement().getValue();
        },

        getTypeElement: function() {
            return this.getElement().find('.eaRolemgmtlib-displayRole-type');
        },

        getType: function() {
          return this.getTypeElement().getValue();
        },

        setName: function (name) {
            return this.getNameElement().setText(name);
        },

        setDescription: function (description) {
            return this.getDescriptionElement().setText(description);
        },

        setStatus: function (status) {
            return this.getStatusElement().setText(status);
        },

        setType: function(type){
          return this.getTypeElement().setText(type);
        },

        updateFromModel: function(model){
          this.setName(model.getName());
          this.setDescription(model.getDescription());
          this.setStatus(model.getStatus());
          this.setType(model.getType());
        }
    });


});
