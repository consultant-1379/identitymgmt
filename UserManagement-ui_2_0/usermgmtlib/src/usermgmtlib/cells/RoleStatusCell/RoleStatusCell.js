define([
    'tablelib/Cell',
    './RoleStatusCellView',
    '../../Dictionary'
], function (Cell, View, Dictionary) {
    'use strict';
    
    return Cell.extend({

        View: View,

        setValue: function(value) {
            if (value === true || value === 'ENABLED') {
                this.view.getCaption().setText(Dictionary.enabled);
            } else if (value === false || value === 'DISABLED') {
                this.view.getCaption().setText(Dictionary.disabled);
            } else if (value === false || value === 'DISABLED_ASSIGNMENT') {
                this.view.getCaption().setText(Dictionary.notAssignable);
            }
        }
    });
});