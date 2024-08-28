define([
    'jscore/core',
    'template!./targetgroupForm.html',
    "styles!./targetgroupForm.less",
    'i18n!identitymgmtlib/common.json',
    "i18n!targetmgmtlib/dictionary.json"
], function (core, template, style, commonDictionary, dictionary) {

    return core.View.extend({

        mode: {},

        init: function(options) {
            //Always one action will be true and rest undefined
            this.mode.create = options.action.create;
            this.mode.view = options.action.view;
            this.mode.edit = options.action.edit;
            this.targetGroup = options.targetGroup;
        },

        getTemplate: function () {
            return template(
                {
                    dictionary: dictionary,
                    commonDictionary: commonDictionary,
                    mode : this.mode,
                    targetGroup : this.targetGroup,
                },{
                    helpers: {
                        "or": function (v1, v2) {
                            return v1 || v2;
                        }
                    }
                }
            );
        },

        getStyle: function () {
            return style;
        },

        getTargetGroupFormContentErrorElement: function() {
            return this.getElement().find('.eaTargetmgmtlib-targetgroupForm-content-error');
        },

        getNameWrapperElement: function() {
            return this.getElement().find('.eaTargetmgmtlib-targetgroupForm-nameWrapper');
        },

        getNameElement: function() {
            return this.getElement().find('.eaTargetmgmtlib-targetgroupForm-name');
        },

        getNameStatusElement: function() {
          return this.getNameWrapperElement().find('.ebInput-status');
        },

        getName: function () {
            return this.getNameElement().getValue();
        },

        getDescriptionWrapperElement: function() {
            return this.getElement().find('.eaTargetmgmtlib-targetgroupForm-descriptionWrapper');
        },

        getTargetGroupFormEntryElement: function() {
            return this.getElement().find('.eaTargetmgmtlib-targetgroupForm-entry');
        },


        getDescriptionElement: function() {
            return this.getElement().find('.eaTargetmgmtlib-targetgroupForm-description');
        },

        getDescriptionStatusElement: function() {
          return this.getDescriptionWrapperElement().find('.ebInput-status');
        },

        getDescription: function () {
            return this.getDescriptionElement().getValue();

        },

        getTargetsListTableElement: function () {
            return this.getElement().find('.eaTargetmgmtlib-targetgroupForm-targetsListWrapper');
        },

        getTopologyDataElement: function () {
            return this.getElement().find('.eaTargetmgmtlib-targetgroupForm-topologyDataWidgetWrapper');
        },

        setName: function (name) {
            return this.getNameElement().setValue(name);
        },

        setDescription: function (description) {
            return this.getDescriptionElement().setText(description);
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
            element.setModifier('borderColor', '', 'eaTargetmgmtlib-textarea');
            statusElement.removeModifier('error','','ebInput-status');
            statusElement.setModifier('ok','','ebInput-status');
            statusElement.setStyle('display', 'none');
        },

        setTextareaInvalid: function(element, statusElement, message){
            element.setModifier('borderColor', 'red', 'eaTargetmgmtlib-textarea');
            statusElement.find(".ebInput-statusError").setText(message);
            statusElement.removeModifier('ok','','ebInput-status');
            statusElement.setModifier('error','','ebInput-status');
            statusElement.setStyle('display', 'block');
            element.focus();
        },

        setHeader: function(header){
            this.getElement().find(".eaTargetmgmtlib-targetgroupForm-header").setText(header);
            this.getElement().find(".eaTargetmgmtlib-targetgroupForm-header").setColor('red');


        },

        // updateFromModel: function(model){
        //   this.setName(model.getName());
        //   this.setDescription(model.getDescription());
        //   this.setStatus(model.getStatus());
        //   this.setType(model.getType());
        // }
    });


});
