define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./checkboxwidget.html'
], function(core, PrivateStore, View) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            this.onValue = this.options.onValue || true;
            this.offValue = this.options.offValue || false;
            this.status = this.options.status || "enabled";
        },

        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            _(this).input = this.view.findById('switcher');
            _(this).input.addEventHandler('change', function() {
                this.trigger('change', this.getValue());
            }.bind(this));
            if (this.status === "disabled") {this.disable(this.options);}
        },

        setValue: function(value) {
            _(this).input.setValue(value === this.onValue);
        },

        getValue: function() {
            return _(this).input.getValue() ? this.onValue : this.offValue;
        },

        enable: function() {
            this.view.findById('switcher').enable();
        },

        disable: function(options) {
            this.view.findById('switcher').disable();
            if (options.clear) {
                _(this).input.setValue(this.offValue);
                _(this).input.trigger('change');
            }
        }
    });
});
