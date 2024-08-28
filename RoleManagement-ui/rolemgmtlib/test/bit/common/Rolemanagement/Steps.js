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
    'jscore/core',
    './Model',
    'identitymgmtlib/Utils'
], function(core, Model, Utils) {

    //////////////////////////////////////////////////////////////////////
    // ROLEMANAGEMENT
    //////////////////////////////////////////////////////////////////////

    var clickRolemanagementButtonFilters = function() {
        Model.clickRolemanagementButtonFilters();
    };

    //////////////////////////////////////////////////////////////////////
    // ROLEMANAGEMENT - FILTER WIDGET ACTIONS
    //////////////////////////////////////////////////////////////////////

    var setFilterRoleName = function(_name) {
        return function setFilterRoleName() {
            Model.setFilterRoleName(_name);
        };
    };

    var applyFilterRoleNameByEnterKey = function(_name) {
        return function applyFilterRoleNameByEnterKey() {
            Model.applyFilterRoleNameByEnterKey();
        };
    };

    var clickFilterCheckboxStatusEnabled = function() {
        Model.clickFilterCheckboxStatusEnabled();
    };

    var clickFilterCheckboxStatusDisabled = function() {
        Model.clickFilterCheckboxStatusDisabled();
    };

    var clickFilterCheckboxStatusNonassignable = function() {
        Model.clickFilterCheckboxStatusNonassignable();
    };

    var clickFilterCheckboxRoleTypeCom = function() {
        Model.clickFilterCheckboxRoleTypeCom();
    };

    var clickFilterCheckboxRoleTypeCpp = function() {
        Model.clickFilterCheckboxRoleTypeCpp();
    };

    var clickFilterCheckboxRoleTypeComAlias = function() {
        Model.clickFilterCheckboxRoleTypeComAlias();
    };

    var clickFilterCheckboxRoleTypeCustom = function() {
        Model.clickFilterCheckboxRoleTypeCustom();
    };

    var clickFilterCheckboxRoleTypeSystem = function() {
        Model.clickFilterCheckboxRoleTypeSystem();
    };

    var clickFilterButtonApply = function() {
        Model.clickFilterButtonApply();
    };

    var clickFilterButtonClear = function() {
        Model.clickFilterButtonClear();
    };

    //////////////////////////////////////////////////////////////////////
    // ROLEMANAGEMENT - FILTER WIDGET VERIFICATIONS
    //////////////////////////////////////////////////////////////////////

    var verifyFilterPanelPresent = function() {
        return function verifyFilterPanelPresent() {
            Model.verifyFilterPanelPresent();
        };
    };

    var verifyFilterRoleNameHasParameterValue = function(){
        return function verifyFilterRoleNameHasParameterValue(){
            Model.verifyFilterRoleNameHasParameterValue();
        };
    };

    var verifyFilterCheckboxStatusEnabledChecked = function() {
        return function verifyFilterCheckboxStatusEnabledChecked() {
            Model.verifyFilterCheckboxStatusEnabledChecked();
        };
    };

    var verifyFilterCheckboxStatusDisabledChecked = function() {
        return function verifyFilterCheckboxStatusDisabledChecked() {
            Model.verifyFilterCheckboxStatusDisabledChecked();
        };
    };

    var verifyFilterCheckboxRoleTypeComChecked = function() {
        return function verifyFilterCheckboxRoleTypeComChecked() {
            Model.verifyFilterCheckboxRoleTypeComChecked();
        };
    };

    var verifyFilterCheckboxRoleTypeCppChecked = function() {
        return function verifyFilterCheckboxRoleTypeCppChecked() {
            Model.verifyFilterCheckboxRoleTypeCppChecked();
        };
    };

    var verifyFilterCheckboxRoleTypeComAliasChecked = function() {
        return function verifyFilterCheckboxRoleTypeComAliasChecked() {
            Model.verifyFilterCheckboxRoleTypeComAliasChecked();
        };
    };

    var verifyFilterCheckboxRoleTypeCustomChecked = function() {
        return function verifyFilterCheckboxStatusNonassignableChecked() {
            Model.verifyFilterCheckboxStatusNonassignableChecked();
        };
    };

    var verifyFilterCheckboxStatusNonassignableChecked = function() {
        return function verifyFilterCheckboxStatusNonassignableChecked() {
            Model.verifyFilterCheckboxStatusNonassignableChecked();
        };
    };

    var verifyFilterCheckboxRoleTypeSystemChecked = function() {
        return function verifyFilterCheckboxRoleTypeSystemChecked() {
            Model.verifyFilterCheckboxRoleTypeSystemChecked();
        };
    };


    //////////////////////////////////////////////////////////////////////
    // ROLEMANAGEMENT - SUMMARY PANEL
    //////////////////////////////////////////////////////////////////////

    var verifyRoleSummaryPanelVisibility = function() {
        return function verifyRoleSummaryPanelVisibility() {
            Model.verifyRoleSummaryPanelVisibility();
        };
    };

    var verifyRoleSummaryPanelInvisibility = function() {
        return function verifyRoleSummaryPanelInvisibility() {
            Model.verifyRoleSummaryPanelInvisibility();
        };
    };

    var verifyRoleSummaryField = function(_field, _name) {
        return function verifyRoleSummaryField() {
            Model.verifyRoleSummaryField(_field, _name);
        };
    };

    var verifyComRoleLabel = function(_name) {
        return function verifyComRoleLabel() {
            Model.verifyComRoleLabel(_name);
        };
    };
    var verifyComRoleAccordionInvisibility = function() {
        return function verifyComRoleAccordionInvisibility() {
            Model.verifyComRoleAccordionInvisibility();
        };
    };

    var verifyNumberOfCapabilities = function(_nr) {
        return function verifyNumberOfCapabilities() {
            Model.verifyNumberOfCapabilities(_nr);
        };
    };

    var verifyVisibilityDetailsLink = function() {
        return function verifyVisibilityDetailsLink() {
            Model.verifyVisibilityDetailsLink();
        };
    };

    var verifyComRoleAccordionClosed = function() {
        return function verifyComRoleAccordionClosed() {
            Model.verifyComRoleAccordionClosed();
        };
    };

    var clickComRoleAccordion = function() {
        return function clickComRoleAccordion() {
            Model.clickComRoleAccordion();
        };
    };


    return {

        // ROLEMANAGEMENT ACTIONS
        clickRolemanagementButtonFilters: clickRolemanagementButtonFilters,

        // ROLEMANAGEMENT - FILTER WIDGET ACTIONS
        verifyFilterPanelPresent: verifyFilterPanelPresent,
        verifyFilterRoleNameHasParameterValue: verifyFilterRoleNameHasParameterValue,
        verifyFilterCheckboxStatusEnabledChecked: verifyFilterCheckboxStatusEnabledChecked,
        verifyFilterCheckboxStatusDisabledChecked: verifyFilterCheckboxStatusDisabledChecked,
        verifyFilterCheckboxStatusNonassignableChecked: verifyFilterCheckboxStatusNonassignableChecked,
        verifyFilterCheckboxRoleTypeComChecked: verifyFilterCheckboxRoleTypeComChecked,
        verifyFilterCheckboxRoleTypeCppChecked: verifyFilterCheckboxRoleTypeCppChecked,
        verifyFilterCheckboxRoleTypeComAliasChecked: verifyFilterCheckboxRoleTypeComAliasChecked,
        verifyFilterCheckboxRoleTypeCustomChecked: verifyFilterCheckboxRoleTypeCustomChecked,
        verifyFilterCheckboxRoleTypeSystemChecked: verifyFilterCheckboxRoleTypeSystemChecked,
        setFilterRoleName: setFilterRoleName,
        clickFilterCheckboxStatusEnabled: clickFilterCheckboxStatusEnabled,
        clickFilterCheckboxStatusDisabled: clickFilterCheckboxStatusDisabled,
        clickFilterCheckboxStatusNonassignable: clickFilterCheckboxStatusNonassignable,
        clickFilterCheckboxRoleTypeCom: clickFilterCheckboxRoleTypeCom,
        clickFilterCheckboxRoleTypeCpp: clickFilterCheckboxRoleTypeCpp,
        clickFilterCheckboxRoleTypeComAlias: clickFilterCheckboxRoleTypeComAlias,
        clickFilterCheckboxRoleTypeCustom: clickFilterCheckboxRoleTypeCustom,
        clickFilterCheckboxRoleTypeSystem: clickFilterCheckboxRoleTypeSystem,
        clickFilterButtonApply: clickFilterButtonApply,
        clickFilterButtonClear: clickFilterButtonClear,

        // ROLEMANAGEMENT - SUMMARY PANEL
        verifyRoleSummaryPanelVisibility: verifyRoleSummaryPanelVisibility,
        verifyRoleSummaryPanelInvisibility: verifyRoleSummaryPanelInvisibility,
        verifyRoleSummaryField: verifyRoleSummaryField,
        verifyVisibilityDetailsLink: verifyVisibilityDetailsLink,
        verifyNumberOfCapabilities: verifyNumberOfCapabilities,
        verifyComRoleAccordionInvisibility: verifyComRoleAccordionInvisibility,
        verifyComRoleAccordionClosed: verifyComRoleAccordionClosed,
        verifyComRoleLabel: verifyComRoleLabel,
        clickComRoleAccordion: clickComRoleAccordion
    };
});
