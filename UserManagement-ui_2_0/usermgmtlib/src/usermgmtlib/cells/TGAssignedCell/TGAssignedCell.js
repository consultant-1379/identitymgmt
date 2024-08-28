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
    'uit!./tgassignedcell.html',
    'identitymgmtlib/mvp/binding',
    '../../Dictionary'
], function(Cell, View, binding, Dictionary) {

    var assignedTgsValue;

    var setAssignedTgsValue = function(model) {

        if(isSystemOrApplicationOrCustomRole(model.get('type'))) {
            assignedTgsValue = Dictionary.roleTable.notApplicable;
        } else {
            if (!model.get('tgs')) {
                assignedTgsValue = 'NONE';
            } else if (isThereOnlyOneTG(model.get('tgs')) && isTGNamedAllOrNone(model.get('tgs')[0])) {
                assignedTgsValue = model.get('tgs')[0];
            } else {
                //if TG name is not 'NONE' or 'ALL'
                assignedTgsValue = model.get('tgs').length;
            }
        }
    };

    var setViewElementAssignedTgs = function() {
        this.view.getElement().find(".eaUsermgmtlib-cTGAssignedCell-tgs").setText(assignedTgsValue);
    };

    var setViewElementAssignedTgsTooltip = function() {
        this.view.getElement().find(".eaUsermgmtlib-cTGAssignedCell-tgs").setAttribute("title", assignedTgsValue);
    };

    var isSystemOrApplicationOrCustomRole = function(roleType) {
        return roleType === 'system' || roleType === 'application' || roleType === 'custom';
    };

    var isTGNamedAllOrNone = function(targetGroupName) {
        return (targetGroupName === 'ALL' || targetGroupName === 'NONE');
    };

    var isThereOnlyOneTG = function(targetGroupArray) {
        return targetGroupArray.length === 1;
    };

    return Cell.extend({

        View: View,

        setTooltip: function(model) {
            setAssignedTgsValue.call(this, model);
            this.getElement().setAttribute("title", assignedTgsValue);
        },

        setValue: function(model) {

            //for TAF Test XPATH
            this.view.getElement().setAttribute('id', "TD_TG_ASSIGN_NUMBER_" + model.get("name"));

            binding.bind(model, this.view, {
                "assigned": "tgs"
            });

            model.addEventHandler("change:tgs", function() {
                setAssignedTgsValue.call(this, model);
                setViewElementAssignedTgs.call(this);
            }.bind(this));

            //set assigned Tgs cells after open page
            setAssignedTgsValue.call(this, model);
            setViewElementAssignedTgs.call(this);
        }

    });

});
