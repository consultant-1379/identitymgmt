define([
    "tablelib/Cell",
    'uit!./profilenamescombocell.html',
     '../../Dictionary',
     'widgets/SelectBox'
], function(Cell, View, Dictionary, SelectBox) {
    return Cell.extend({

        View: View,
        setValue: function(profile) {
            this.model = profile;
            var selectBoxEl = this.view.getElement().find('.eaUsermgmtlib-cProfileNamesComboCell');

            var defaultValue = {
                name: Dictionary.odpDefaultProfile,
                value: 1,
                title: Dictionary.odpDefaultProfileDescription
            };

            var itemsValues = [defaultValue];
            profile.items.forEach(function (item, index) {
                var itemValue = {   name: item.name,
                                    value: index + 2,
                                    title: item.description
                                };
                itemsValues.push( itemValue );

                if ( profile.name && profile.name.toLowerCase() === item.name.toLowerCase() ) {
                    defaultValue = itemValue;
                }
            });

            this.odpWidget = new SelectBox({
                value: defaultValue,
                items: itemsValues
            });
            this.odpWidget.attachTo(selectBoxEl);
            this.odpWidget.addEventHandler('change', this.triggerChange.bind(this));
        },

        triggerChange: function() {
            this.model.name = this.odpWidget.getValue().name;
            if ( this.getTable() ) {
                this.getTable().trigger('changed');
            }
        }
    });
});