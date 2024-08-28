define([
    "tablelib/Cell",
    'uit!./checkboxiconcell.html',
    'identitymgmtlib/mvp/binding'
], function(Cell, View, binding) {

    var setOneModifier = function(icon, modifierToSet) {
        var modifiers = ['tick_grey', 'tick_green', 'error'];
        modifiers.forEach(function(modifier) {
            if (icon.hasModifier(modifier)) {
                icon.removeModifier(modifier);
            }
        });
        icon.setModifier(modifierToSet);
    };

    var updateIcon = function(model) {
        var icon = this.view.getElement().find('.eaUsermgmtlib-cCheckboxIconCell-ebIcon');
        if (model.get('assigned')) {
            setOneModifier.call(this, icon, 'tick_green');
        } else {
            setOneModifier.call(this, icon, 'tick_grey');
        }
    };

    return Cell.extend({

        View: View,

        setValue: function(model) {

            //for TAF Test XPATH
            this.view.getElement().setAttribute('id', "TD_TG_ASSIGN_ICON_" + model.get('name'));

            // udpate icon handler
            model.addEventHandler('change:assigned', function() {
                updateIcon.call(this, model);
            }.bind(this));
            updateIcon.call(this, model);

            // click icon handler
            this.view.getElement().find('.eaUsermgmtlib-cCheckboxIconCellButton').addEventHandler('click', function() {
                model.setAttribute('assigned', model.getAttribute('assigned') ? false : true);
                // TODO: setTouched shuold be handled in auto way
                model.setTouched('assigned');
            }.bind(this));

        }
    });
});