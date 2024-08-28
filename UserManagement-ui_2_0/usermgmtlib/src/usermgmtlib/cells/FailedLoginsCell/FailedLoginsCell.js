define([
    'tablelib/Cell',
    './FailedLoginsCellView',
    '../../Dictionary'
], function (Cell, View, Dictionary) {
    'use strict';
    
    return Cell.extend({

        View: View,

        setValue: function(value) {
            if (value === 0) {
                this.view.getCaption().setValue(null);
                this.view.getCaption().setText(null);
            } else {
                this.view.getCaption().setValue(value);
                this.view.getCaption().setText(value);
            }
        }
    });
});