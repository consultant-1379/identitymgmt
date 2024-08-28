define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./inputwidget.html'
], function(core, PrivateStore, View) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            // set default type if not specified
            this.options.type = this.options.type || 'text';
            this.options.info = this.options.info || false;
            this.options.subclass = this.options.subclass || null;
            this.options.maxlength = this.options.maxlength || null;
            this.options.hidden = this.options.hidden || false;
            this.options.passwordEye = (this.options.type === 'password' && !this.options.hidden);
        },

        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            //-'+this.options.identifier
            _(this).input = this.view.getElement().find('.eaIdentitymgmtlib-wInputWidget-input');
            _(this).input.addEventHandler('input', function() {
                this.trigger('change', this.getValue());
            }.bind(this));

            if ( this.options.hidden ) {
                _(this).input.setModifier("hidden", "", "eaIdentitymgmtlib-wInputWidget-input");
            }

            _(this).eye = this.view.getElement().find('.eaIdentitymgmtlib-wInputWidget-eye');
            if ( _(this).eye ) {
                _(this).eye.setModifier("eye");
                this.hidePassword = true;
                _(this).eye.addEventHandler('click', function() {
                    this.showPassword();
                }.bind(this));
            }
        },

        showPassword: function() {
            if (this.hidePassword) {
                _(this).input.setAttribute('type','');
                _(this).eye.removeModifier("eye");
                _(this).eye.setModifier("eyeLine");
                this.hidePassword = false;
            } else {
                _(this).input.setAttribute('type','password');
                _(this).eye.removeModifier("eyeLine");
                _(this).eye.setModifier("eye");
                this.hidePassword = true;
            }
        },

        enable: function() {
            _(this).input.removeAttribute('disabled', 'disabled');
        },

        disable: function(options) {
            _(this).input.setAttribute('disabled', 'disabled');
            if (options.clear) {
                _(this).input.setValue('');
                _(this).input.trigger('input');
            }
        },

        setValue: function(value) {
            _(this).input.setValue(value);
        },

        getValue: function() {
            return _(this).input.getValue();
        },

        setValid: function() {
            _(this).input.removeModifier("borderColor_red", "", this.options.subclass);
        },

        setInvalid: function(result) {
            _(this).input.setModifier("borderColor_red", "", this.options.subclass);
            if ( _(this).input.getAttribute('type') !== 'password') {
                _(this).input.focus();
            }
        }

    });

});
