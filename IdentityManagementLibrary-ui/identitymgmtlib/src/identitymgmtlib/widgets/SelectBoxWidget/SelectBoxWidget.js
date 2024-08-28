define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./selectBoxWidget.html'
], function(core, PrivateStore, View) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            _(this).selectBoxOptions = options.selectBoxOptions;
        },

        view: function() {
            return new View({ options: _(this).selectBoxOptions });
        },

        onViewReady: function() {

            _(this).selectBox = this.view.findById('selectBox');

            _(this).selectBox.addEventHandler('change', function() {
                this.trigger('change', _(this).selectBox.getValue().value);
            }.bind(this));
        },

        getValue: function() {
            return _(this).selectBox.getValue().value;
        },

        setValue: function(value) {
            if (value !== undefined) {
            var myItem = _(this).selectBoxOptions.items.find(function(item) {
                return item.value === value;
            }.bind(this));

            _(this).selectBox.setValue(myItem);
            }
        }
    });
});
