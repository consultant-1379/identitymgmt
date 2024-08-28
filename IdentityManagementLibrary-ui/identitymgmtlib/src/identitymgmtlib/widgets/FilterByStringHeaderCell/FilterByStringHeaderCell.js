define([
    'tablelib/Cell',
    'identitymgmtlib/FilterByStringOptions',
    './FilterByStringHeaderCellView'
], function (Cell, FilterOptions, View ) {

    return Cell.extend({

        View: View,

        onViewReady: function() {

            this.input = this.view.getInput();
            this.input.addEventHandler("input", sendFilterEvent.bind(this));

            // Filter options will provide us the dropdown with our comparator operations
            this.filteroptions = new FilterOptions();
            this.filteroptions.attachTo(this.view.getDiv());
            this.filteroptions.addEventHandler("change", sendFilterEvent.bind(this));
        },

        setValue: function() {
            // We don't want the default implementation to override our template
        }

    });

    function sendFilterEvent() {
        var attr = this.getColumnDefinition().attribute;
        var val = this.input.getValue();
        var comparator = this.filteroptions.getValue();
        this.getTable().trigger("filter", attr, val, comparator);
    }
});