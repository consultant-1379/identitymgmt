define([
    'tablelib/Cell',
    './AuthModeCellView',
    '../../Dictionary'
], function (Cell, View, Dictionary) {
    'use strict';

    return Cell.extend({
        View: View,

        setValue: function(value) {
            if (value === 'local') {
                this.view.getCaption().setText(Dictionary.local);
            } else if ( value === 'remote') {
                this.view.getCaption().setText(Dictionary.remote);
            } else if ( value === 'federated') {
                this.view.getCaption().setText(Dictionary.federated);
            }
        }
    });
});
