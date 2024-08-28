define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./textareawidget.html'
], function(core, PrivateStore, View) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            // set default type if not specified
            this.options.info = this.options.info || false;
            this.options.subclass = this.options.subclass || null;
            this.options.maxlength = this.options.maxlength || 255;
        },

        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            //-'+this.options.identifier
            _(this).input = this.view.getElement().find('.eaIdentitymgmtlib-wTextareaWidget-textarea');
            _(this).input.addEventHandler('input', function() {
                this.trigger('change', this.getValue());
            }.bind(this));
        },

        enable: function() {
            _(this).input.removeAttribute('disabled', 'disabled');
        },

        disable: function(options) {
            if (options.clear) {
                _(this).input.setText('');
                _(this).input.trigger('input');
            }
            _(this).input.setAttribute('disabled', 'disabled');
        },

        setValue: function(value) {
            _(this).input.setText(value);
        },

        getValue: function() {
            return _(this).input.getValue();
        },

        setValid: function() {
            _(this).input.removeModifier("borderColor_red");
        },

        setInvalid: function(result) {
            _(this).input.setModifier("borderColor_red");
            _(this).input.focus();
        }

    });

});
