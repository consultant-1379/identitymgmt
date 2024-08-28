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
    'identitymgmtlib/mvp/binding',
    'uit!./selectBoxQueryRoleCell.html'
], function(Cell, binding, View) {

    return Cell.extend({

        View: View,
        setTooltip: function(model) {},

        setValue: function(model) {
            this.model = model;
            this.initBinding();
        },
        initBinding: function() {
            binding.bind(this.model, this.view, {
                "selected": "dropdown",
                "query": "selectBoxQueryRoleWidget"
            });
        }
    });
});
