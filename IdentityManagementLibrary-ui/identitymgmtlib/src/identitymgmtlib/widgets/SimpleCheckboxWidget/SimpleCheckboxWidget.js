define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./simplecheckboxwidget.html'
], function(core, PrivateStore, View) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            this.options.type = this.options.type || 'checkbox';
            _(this).enabled = true;

            this.options.subclass = this.options.subclass || null;
        },

        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            _(this).input = this.view.getElement().find('.eaIdentitymgmtlib-wSimpleCheckboxWidget-input');
            _(this).input.addEventHandler('click', function() {
                if(_(this).enabled) {
                    this.trigger('change', this.getValue());
                }
            }.bind(this));
        },

        setValue: function(value) {
            _(this).input.setProperty('checked', value);
        },

        getValue: function() {
            return (_(this).input.getProperty('checked')) ? true : false ;
        },

        enable: function() {
            _(this).input.removeAttribute('disabled');
            _(this).enabled = true;
        },

        disable: function(options) {
            if (options.clear) {
                _(this).input.setValue(false);
                _(this).input.trigger('click');
            }
            _(this).input.setAttribute('disabled','disabled');
            _(this).enabled = false;
        },

        addOnClick: function(method) {
            _(this).input.setAttribute('onclick', method);
        },

        isEnabled: function() {
            return _(this).enabled;
        }

    });

});
