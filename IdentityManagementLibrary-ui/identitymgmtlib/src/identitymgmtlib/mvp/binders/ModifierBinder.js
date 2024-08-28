define([
    'jscore/core'
], function(core) {

    /**
     * Binder for boolean-modfier bind type
     * @param {Object} options {
     *     uielement - uielement
     *     model - model
     *     modelAttribute - attribute of model
     *     trueValue - modifier value for true
     *     falseValue - modifier value for false
     * }
     */
    var BooleanModifierBinder = function(options) {
        this.uielement = options.uielement;
        this.model = options.model;
        this.modelAttribute = options.modelAttribute;
        this.modifier = null;
        this.previousModifier = null;
    };

    /**
     * Binds view with model on "change" event, and updates view with current model attribute value
     */
    BooleanModifierBinder.prototype.bind = function() {
        this.model.on("change:" + this.modelAttribute, doBind.bind(this));
        doBind.call(this);
    };

    /**
     * Binds view with model
     */
    var doBind = function() {
        if (this.model.getPrevious(this.modelAttribute)) {
            this.uielement.removeModifier(this.model.getPrevious(this.modelAttribute));
        }
        this.uielement.setModifier(this.model.get(this.modelAttribute));
    };

    return BooleanModifierBinder;
});