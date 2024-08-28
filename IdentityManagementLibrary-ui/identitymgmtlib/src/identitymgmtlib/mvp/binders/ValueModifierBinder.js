define([
    'jscore/core'
], function(core) {

    /**
     * Binder for value-modfier bind type
     * @param {Object} options {
     *     uielement - uielement
     *     model - model
     *     modelAttribute - attribute of model
     *     trueValue - modifier value for true
     *     falseValue - modifier value for false
     * }
     */
    var ValueModifierBinder = function(options) {
        this.uielement = options.uielement;
        this.model = options.model;
        this.modelAttribute = options.modelAttribute;
        this.modifier = null;
        this.previousModifier = null;
    };

    /**
     * Binds view with model on "change" event, and updates view with current model attribute value
     */
    ValueModifierBinder.prototype.bind = function() {
        this.model.on("change:" + this.modelAttribute, doBind.bind(this));
        doBind.call(this);
    };

    /**
     * Binds view with model
     */
    var doBind = function() {
        if (this.model.getPrevious(this.modelAttribute) !== undefined || this.model.getPrevious(this.modelAttribute) !== null) {
            this.previousModifier = this.uielement.getAttribute(this.model.getPrevious(this.modelAttribute) + '-value');
            if (this.uielement.hasModifier(this.previousModifier)) {
                this.uielement.removeModifier(this.previousModifier);
            }
        }
        this.modifier = this.uielement.getAttribute(this.model.getAttribute(this.modelAttribute) + '-value');
        this.uielement.setModifier(this.modifier);
    };

    return ValueModifierBinder;
});
