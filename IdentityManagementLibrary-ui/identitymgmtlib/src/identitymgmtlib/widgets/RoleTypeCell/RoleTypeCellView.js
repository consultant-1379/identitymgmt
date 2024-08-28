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
    "jscore/core",
    "text!./RoleTypeCell.html"
], function (core, template) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getTypeText: function() {
            return this.getElement().find('.eaRolemanagement-TypeCell-text');
        }
    });

});
