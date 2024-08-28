define([
    'jscore/core'
], function(core) {

    /**
     * Binder for Widgets
     * @param {Object} options {
     *     uielement - uielement
     *     model - model
     *     modelAttribute - attribute of model
     * }
     */
    var WidgetBinder = function(options) {
        this.uielement = options.uielement;
        this.model = options.model;
        this.modelAttribute = options.modelAttribute;
    };

    /**
     * Binds model with view
     */
    WidgetBinder.prototype.bind = function() {
        addValueHandlers.call(this);
        addValidationHandlers.call(this);
        addViewHandler.call(this);
    };

    /**
     * Adds handlers for model value updates
     */
    var addValueHandlers = function() {
        if (this.uielement.setValue && this.uielement.getValue) {
            this.model.setEditable(this.modelAttribute);
            this.model.on("change:" + this.modelAttribute, function(model, value) {
                if (this.uielement.getValue() !== value) {
                    this.uielement.setValue(value);
                }
            }.bind(this));
            this.uielement.setValue(this.model.getAttribute(this.modelAttribute));
        } else if (this.uielement.setValue) {
            this.model.on("change:" + this.modelAttribute, function(model, value) {
                this.uielement.setValue(value);
            }.bind(this));
            this.uielement.setValue(this.model.getAttribute(this.modelAttribute));
        }
    };

    /**
     * Adds handlers for validation results
     */
    var addValidationHandlers = function() {
        if (this.uielement.setInvalid) {
            this.model.on("invalid:" + this.modelAttribute, function(result) {
                this.uielement.setInvalid(result, this.modelAttribute);
            }.bind(this));
        }

        if (this.uielement.setValid) {
            this.model.on("valid:" + this.modelAttribute, function(result) {
                this.uielement.setValid(result, this.modelAttribute);
            }.bind(this));
        }
    };

    /**
     * Adds handlers for view value updates
     */
    var addViewHandler = function() {
        this.uielement.addEventHandler("change", function(value) {
            
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(function() {
                this.model.setTouched(this.modelAttribute);
                this.model.setAttribute(this.modelAttribute, value);
            }.bind(this), this.uielement.options.debounce || 0);

        }.bind(this));
    };

    return WidgetBinder;
});
