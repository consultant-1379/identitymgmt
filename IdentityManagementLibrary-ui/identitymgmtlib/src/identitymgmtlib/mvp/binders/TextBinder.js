define([
    'jscore/core',
    'jscore/ext/binding'
], function(core, binding) {

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
    var TextBinder = function(options) {
        this.uielement = options.uielement;
        this.model = options.model;
        this.modelAttribute = options.modelAttribute;
    };

    /**
     * Binds view with model on "change" event, and updates view with current model attribute value
     */
    TextBinder.prototype.bind = function() {
        binding.bind(this.model, this.modelAttribute, this.uielement, 'text');
    };

    return TextBinder;
});