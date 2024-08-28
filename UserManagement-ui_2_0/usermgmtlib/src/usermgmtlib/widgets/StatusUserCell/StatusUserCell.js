define([
    'tablelib/Cell',
    './StatusUserCellView',
    '../../Dictionary'
], function (Cell, View, Dictionary) {
    'use strict';

    return Cell.extend({

        View: View,

        setValue: function(value) {
            if (value === true || value === Dictionary.enabled) {
                this.view.getIcon().setModifier('simpleGreenTick');
            } else if (value === false || value === Dictionary.disabled) {
                this.view.getIcon().setModifier('close', 'red');
            }
            this.view.getCaption().setText(value);
        }
    });
});