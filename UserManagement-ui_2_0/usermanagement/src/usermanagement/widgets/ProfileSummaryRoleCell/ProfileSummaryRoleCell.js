define([
    'tablelib/Cell',
    'uit!./ProfileSummaryRoleCell.html'
], function (Cell, View) {
    'use strict';

    return Cell.extend({

        View: View,

        setValue: function(value) {
            this.view.getElement().find('.eaUsermanagement-ProfileSummaryRoleCell-name').setAttribute('id', "PROFILESUMMARY_ROLE_" + value);
            this.view.getElement().find('.eaUsermanagement-ProfileSummaryRoleCell-name').setText(value);
        }
    });
});