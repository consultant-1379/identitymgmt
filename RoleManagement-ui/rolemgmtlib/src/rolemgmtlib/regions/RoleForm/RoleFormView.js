define([
    'jscore/core',
    'template!./roleForm.html',
    "styles!./roleForm.less",
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
            return this.getElement().find('.eaRolemgmtlib-roleForm-comRolesList');
        },

        getCustomRolesDetailsFormElement: function() {
            return this.getElement().find('.eaRolemgmtlib-roleForm-customRolesDetails');
        },

        getNameWrapperElement: function() {
            return this.getElement().find('.eaRolemgmtlib-roleForm-nameWrapper');
        },

        getNameElement: function() {
            return this.getElement().find('.eaRolemgmtlib-roleForm-name');
        },

        getNameStatusElement: function() {
          return this.getNameWrapperElement().find('.ebInput-status');
        },

        getName: function () {
            return this.getNameElement().getValue();
        },

        getDescriptionWrapperElement: function() {
            return this.getElement().find('.eaRolemgmtlib-roleForm-descriptionWrapper');
        },

        getDescriptionElement: function() {
            return this.getElement().find('.eaRolemgmtlib-roleForm-description');
        },

        getDescriptionStatusElement: function() {
          return this.getDescriptionWrapperElement().find('.ebInput-status');
        },

        getDescription: function () {
            return this.getDescriptionElement().getValue();
        },


        getStatusElement: function() {
            return this.getElement().findAll('input[type=radio]');
        },

        getStatus: function () {
            return this.getElement().find("input[name=roleStatus]:checked").getValue();
        },

        getDisabledRadioBox: function () {
            return this.getElement().find("input[value=DISABLED]");
        },

        getTypeWrapperElement: function() {
            return this.getElement().find('.eaRolemgmtlib-roleForm-typeWrapper');
        },

        getTypeElement: function() {
            return this.getElement().find('.eaRolemgmtlib-roleForm-typeWrapper');
        },

        getTypeStatusElement: function() {
          return this.getTypeWrapperElement().find('.ebInput-status');
        },

        getType: function() {
          return this.getTypeElement().getValue();
        },


        setName: function (name) {
            return this.getNameElement().setValue(name);
        },

        setDescription: function (description) {
            return this.getDescriptionElement().setValue(description);
        },

        setStatus: function (status) {
            var radioButtons = this.getStatusElement();
            for (var i =0; i<radioButtons.length ; i++){
                if (radioButtons[i].getValue() === status){
                    radioButtons[i].setProperty('checked', true);
                }
            }
        },

        setType: function(type){
          return this.getTypeElement().setValue(type);
        },

        getTypeSelectionWrapper: function() {
            return this.getElement().find('.eaRolemgmtlib-roleForm-typeWrapper');
        },

        setNameInvalid: function(message){
            this.setInputInvalid(this.getNameElement(),this.getNameStatusElement() ,message);
        },

        setNameValid: function(){
            this.setInputValid(this.getNameElement(), this.getNameStatusElement());
        },

        setDescriptionInvalid: function(message){
            this.setTextareaInvalid(this.getDescriptionElement(),this.getDescriptionStatusElement(), message);
        },

        setDescriptionValid: function(){
            this.setTextareaValid(this.getDescriptionElement(), this.getDescriptionStatusElement());
        },

        setTypeInvalid: function(message){
            this.setInputInvalid(this.getTypeWrapperElement(),this.getTypeStatusElement(), message);
        },

        setTypeValid: function(){
            this.setInputValid(this.getTypeWrapperElement(), this.getTypeStatusElement());
        },

        setInputValid: function(element, statusElement){
            element.setModifier('borderColor', '', 'ebInput');
            statusElement.removeModifier('error','','ebInput-status');
            statusElement.setModifier('ok','','ebInput-status');
            statusElement.setStyle('display', 'none');
        },

        setInputInvalid: function(element, statusElement, message){
            element.setModifier('borderColor', 'red', 'ebInput');
            statusElement.find(".ebInput-statusError").setText(message);
            statusElement.removeModifier('ok','','ebInput-status');
            statusElement.setModifier('error','','ebInput-status');
            statusElement.setStyle('display', 'block');
            element.focus();
        },

        setTextareaValid: function(element, statusElement){
            element.setModifier('borderColor', '', 'eaRolemgmtlib-textarea');
            statusElement.removeModifier('error','','ebInput-status');
            statusElement.setModifier('ok','','ebInput-status');
            statusElement.setStyle('display', 'none');
        },

        setTextareaInvalid: function(element, statusElement, message){
            element.setModifier('borderColor', 'red', 'eaRolemgmtlib-textarea');
            statusElement.find(".ebInput-statusError").setText(message);
            statusElement.removeModifier('ok','','ebInput-status');
            statusElement.setModifier('error','','ebInput-status');
            statusElement.setStyle('display', 'block');
            element.focus();
        },

        setHeader: function(header){
            this.getElement().find(".eaRolemgmtlib-roleForm-header").setText(header);
        },

        getErrorMessageBox: function () {
            return this.getElement().find('.elIdentitymgmtlib-RoleMgmtTable-error-message');
        },

        getErrorBox: function () {
            return this.getElement().find('.elIdentitymgmtlib-RoleMgmtTable-error');
        },

        updateFromModel: function(model){
          this.setName(model.getName());
          this.setDescription(model.getDescription());
          this.setStatus(model.getStatus());
          this.setType(model.getType());
        }
    });


});
