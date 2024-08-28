define([
    'jscore/core',
    'uit!./validationresultwidget.html'
], function(core, View) {

    return core.Widget.extend({

        init: function(options) {
            if ( this.options.reduced ) {
                this.options.subclass = "ebInput-statusError eaUsermgmtlib-wValidationResultWidget-container-errorMessagesize_reduced";
            } else {
                this.options.subclass = "ebInput-statusError eaUsermgmtlib-wValidationResultWidget-container-errorMessagesize_full";
            }
         },

        view: function() {
            return new View(this.options);
        },

        setValid: function() {
            this.view.getElement().find('.eaUsermgmtlib-wValidationResultWidget-container').removeModifier("show");
            this.view.getElement().find('.eaUsermgmtlib-wValidationResultWidget-container-status').removeModifier("error");
            this.view.getElement().find('.eaUsermgmtlib-wValidationResultWidget-container-errorMessage').setText("");
        },

        setInvalid: function(result) {
            this.view.getElement().find('.eaUsermgmtlib-wValidationResultWidget-container').setModifier("show");
            this.view.getElement().find('.eaUsermgmtlib-wValidationResultWidget-container-status').setModifier("error");
            this.view.getElement().find('.eaUsermgmtlib-wValidationResultWidget-container-errorMessage').setText(result.message);
        }

    });

});
