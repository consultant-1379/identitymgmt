define([
    'tablelib/Cell',
    'identitymgmtlib/SystemTime',
    '../../Dictionary'
], function(Cell, systemTime, Dictionary) {
    'use strict';

    var DateCell = Cell.extend({

        setValue: function(value) {
            var text = (value === undefined || value === null) ? Dictionary.neverLoggedIn : systemTime.formatTimestampWithTimezone(value);
            this.getElement().setText(text);
        }

    });

    return DateCell;
});