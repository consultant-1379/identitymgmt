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
        this.trueValue = this.uielement.getAttribute('true-value');
        this.falseValue = this.uielement.getAttribute('false-value');
        this.doesUndefinedMeanFalse = this.uielement.getAttribute('undefined-means-false') === "true";
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
        if (this.model.getPrevious(this.modelAttribute) !== undefined || this.model.getPrevious(this.modelAttribute) !== null) {
            this.previousModifier = this.model.getPrevious(this.modelAttribute) ? this.trueValue : this.falseValue;
            if (this.uielement.hasModifier(this.previousModifier)) {
                this.uielement.removeModifier(this.previousModifier);
            }
        }
        if (this.doesUndefinedMeanFalse || typeof this.model.get(this.modelAttribute) !== "undefined") {
            this.modifier = this.model.get(this.modelAttribute) ? this.trueValue : this.falseValue;
            this.uielement.setModifier(this.modifier);
        }
    };

    return BooleanModifierBinder;
});