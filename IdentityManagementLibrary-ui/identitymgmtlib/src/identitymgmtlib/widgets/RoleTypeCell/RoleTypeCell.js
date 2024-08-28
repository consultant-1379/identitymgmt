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
    "./RoleTypeCellView",
    'i18n!identitymgmtlib/common.json'
], function (Cell, View, Dictionary) {

    return Cell.extend({

        View: View,

        setValue : function(type) {
            switch (type.toLowerCase()) {
            case 'com':
                this.view.getTypeText().setText(Dictionary.typeCell.RoleTypeCom);
                break;
            case 'comalias':
                this.view.getTypeText().setText(Dictionary.typeCell.RoleTypeAlias);
                break;
            case 'custom':
                this.view.getTypeText().setText(Dictionary.typeCell.RoleTypeCustom);
                break;
            case 'application':
            case 'system':
                this.view.getTypeText().setText(Dictionary.typeCell.RoleTypeSystem);
                break;
            case 'cpp':
                this.view.getTypeText().setText(Dictionary.typeCell.RoleTypeCpp);
                break;
            }
        }

    });

});
