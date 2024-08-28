define([
    'tablelib/Cell',
    './CredentialStatusCellView',
    '../../Dictionary'
], function (Cell, View, Dictionary) {
    'use strict';
    
    return Cell.extend({

        View: View,

        setValue: function(value) {
            if (value === 'NEW') {
                this.view.getCaption().setText(Dictionary.filters.credentialStatus.new);
            } else if (value === 'ACTIVE') {
                this.view.getCaption().setText(Dictionary.filters.credentialStatus.active);
            } else if (value === 'INACTIVE') {
                this.view.getCaption().setText(Dictionary.filters.credentialStatus.inactive);
            } else if (value === 'DELETED') {
                this.view.getCaption().setText(Dictionary.filters.credentialStatus.deleted);
            } else if (value === 'NOT APPLICABLE') {
                this.view.getCaption().setText(Dictionary.filters.credentialStatus.not_applicable);
            }
        }
    });
});
