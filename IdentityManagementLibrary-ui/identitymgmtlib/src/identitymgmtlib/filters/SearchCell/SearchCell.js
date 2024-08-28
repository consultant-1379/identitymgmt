/*******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************/

define([
    "tablelib/Cell",
    'uit!./searchCell.html',
    'identitymgmtlib/mvp/binding',
    'i18n!identitymgmtlib/common.json'
], function(Cell, View, binding, Dictionary) {

    return Cell.extend({

        View: View,
        setTooltip: function(model) {},

        setValue: function() {

            this.searchInput = this.getElement().find('.elIdentitymgmtlib-cSearchCell-searchInput');

            this.searchInput.addEventHandler('input', function(value) {
                this.getTable().trigger('search', this.searchInput.getValue());
            }.bind(this));
        },

        onViewReady: function () {
            this.getElement().find('.elIdentitymgmtlib-cSearchCell-searchInput').setAttribute('placeholder', Dictionary.filters.roles.placeholder);
        }
    });

});
