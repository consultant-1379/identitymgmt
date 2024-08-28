define([
    'jscore/core'
], function(core) {

    /**
     * Binder for checkbox input bind type
     * @param {Object} options {
     *     uielement - uielement
     *     model - model
     *     modelAttribute - attribute of model
     * }
     */
    var CheckboxBinder = function(options) {
        this.uielement = options.uielement;
        this.model = options.model;
        this.modelAttribute = options.modelAttribute;
    };

    /**
     * Binds view with model on "change" event, and updates view with current model attribute value
     */
    CheckboxBinder.prototype.bind = function() {
        this.model.on("change:" + this.modelAttribute, doBind.bind(this));
        doBind.call(this);
        addViewHandler.call(this);
    };

    /**
    * Adds handlers for view value updates
    */
    var addViewHandler = function() {
        this.uielement.addEventHandler("change", function() {
            this.model.setTouched(this.modelAttribute);
            this.model.setAttribute(this.modelAttribute, this.uielement.getProperty('checked'));
        }.bind(this));
    };

    /**
     * Binds view with model
     */
    var doBind = function() {
        this.uielement.setProperty('checked', this.model.get(this.modelAttribute));
    };

    return CheckboxBinder;
});