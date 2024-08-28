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
    'test/bit/lib/Browser'
], function(Browser) {

    var selector = {

        //////////////////////////////////////////////////////////////////////
        // ROLEMANAGEMENT
        //////////////////////////////////////////////////////////////////////
        rolemanagement_buttonFilters: '.elLayouts-PanelActionBar-button_filter',

        //////////////////////////////////////////////////////////////////////
        // ROLEMANAGEMENT - SUMMARY PANEL
        //////////////////////////////////////////////////////////////////////
        roleSummaryPanel: '.elLayouts-MultiSlidingPanels_right',
        roleSummaryField: '.eaRolemanagement-RoleSummary-',
        roleSummaryComRoles: '.roleSummaryComRoleAccordion',
        roleSummaryComRoleAccordion: '.ebAccordion-title',
        roleSummaryComRoleLabel: '.ebList-item',
        detailsLink: '.eaRolemanagement-RoleSummary-RoleDetailsLink',
        roleSummaryCapabilities: '.eaRolemanagement-RoleSummary-Capabilities-Info',
        roleSummaryComRoleArrow: '.ebAccordion-button > .ebIcon_upArrow_10px',

        //////////////////////////////////////////////////////////////////////
        // ROLEMANAGEMENT - FILTER WIDGET
        //////////////////////////////////////////////////////////////////////
        filter_panelPresent: '.elLayouts-MultiSlidingPanels_right',
        filter_searchInput: '.eaRolemanagement-Filters-searchInput',
        filter_checkboxStatusEnabled: '.elIdentitymgmtlib-checklist-listItem-ENABLED-input',
        filter_checkboxStatusDisabled: '.elIdentitymgmtlib-checklist-listItem-DISABLED-input',
        filter_checkboxStatusNonassignable: '.elIdentitymgmtlib-checklist-listItem-DISABLED_ASSIGNMENT-input',
        filter_checkboxRoleTypeCom: '.elIdentitymgmtlib-checklist-listItem-com-input',
        filter_checkboxRoleTypeCpp: '.elIdentitymgmtlib-checklist-listItem-cpp-input',
        filter_checkboxRoleTypeComAlias: '.elIdentitymgmtlib-checklist-listItem-comalias-input',
        filter_checkboxRoleTypeCustom: '.elIdentitymgmtlib-checklist-listItem-custom-input',
        filter_checkboxRoleTypeSystem: '.elIdentitymgmtlib-checklist-listItem-system-input',
        filter_buttonApply: '.eaRolemanagement-Filters-applyFilterButton',
        filter_buttonClear: '.eaRolemanagement-Filters-clearFilterButton'
    };

    return {

        //////////////////////////////////////////////////////////////////////
        // ROLEMANAGEMENT
        //////////////////////////////////////////////////////////////////////

        clickRolemanagementButtonFilters: function() {
            var button = Browser.getElement(selector.rolemanagement_buttonFilters);
            button.trigger('click');
        },

        //////////////////////////////////////////////////////////////////////
        // ROLEMANAGEMENT - SUMMARY PANEL
        //////////////////////////////////////////////////////////////////////
        verifyRoleSummaryPanelVisibility: function(){
            if(Browser.getElement(selector.roleSummaryPanel) === null)
                throw new Error("Summary Panel is not visible");
        },

        verifyRoleSummaryPanelInvisibility: function(){
            if(Browser.getElement(selector.roleSummaryPanel) !== null)
                throw new Error("Summary Panel should not be visible");
        },

        verifyVisibilityDetailsLink: function(){
            if(Browser.getElement(selector.detailsLink) === null)
                throw new Error("Details link should be visible");
        },

        verifyComRoleAccordionInvisibility: function() {
            if(Browser.getElement(selector.roleSummaryComRoles) !== null)
                throw new Error("Com Role Accordion should not be visible");
        },

        verifyNumberOfCapabilities: function(_nr) {
            var _capabilitiesText = "(" + _nr + ") Capabilities assigned to this role.";
            if (_capabilitiesText !== Browser.getElement(selector.roleSummaryCapabilities).getText() ) {
                throw new Error("Wrong number of capabilities ");
            }
        },

        verifyRoleSummaryField: function(_field, _name) {
            var roleSummaryField = Browser.getElement(selector.roleSummaryField + _field).getText();
            if(_name !== roleSummaryField){
                throw new Error("Wrong value in summary panel for " + _field);
            }
        },

        clickComRoleAccordion: function() {
            var button = Browser.getElement(selector.roleSummaryComRoleAccordion);
            button.trigger('click');
        },

        verifyComRoleAccordionClosed: function() {
            var _roleSummaryCOMRoleArrow = Browser.getElement(selector.roleSummaryComRoleArrow);
            if (_roleSummaryCOMRoleArrow !== null)
                throw new Error("Com Roles should be invisible by default");
        },

        verifyComRoleLabel: function(_name) {
            var _roleSummaryCOMRoleName = Browser.getElements(selector.roleSummaryComRoleLabel);
            var flag;
            _roleSummaryCOMRoleName.forEach(function(_comRole) {
                if (_comRole.getText().trim() === _name) {
                    flag = _comRole;
                }
            });
            if(flag === undefined){
                throw new Error("Wrong COM Role name " );
            }
        },

        //////////////////////////////////////////////////////////////////////
        // ROLEMANAGEMENT - FILTER WIDGET
        //////////////////////////////////////////////////////////////////////

        verifyFilterPanelPresent: function(){
            if(Browser.getElement(selector.filter_panelPresent) === null)
                throw new Error("Filter Panel is not visible");
        },

        setFilterRoleName: function(_name) {
            var name = Browser.getElement(selector.filter_searchInput);
            name.setValue(_name);
        },

        applyFilterRoleNameByEnterKey: function() {
            var searchInputElement = Browser.getElement(selector.filter_searchInput);
            searchInputElement.trigger('keydown', {
                originalEvent: {
                    code: 'Enter'
                }
            });
        },

        verifyFilterRoleNameHasParameterValue: function(){
            if(Browser.getElement(selector.filter_searchInput).getValue() === "")
                throw new Error("Role Name does not have value");
        },

        verifyFilterCheckboxStatusEnabledChecked: function(){
            var statusEnabled = Browser.getElement(selector.filter_checkboxStatusEnabled);
            var isChecked = statusEnabled.getProperty('checked');
            expect(isChecked).to.equal(true);
        },

        verifyFilterCheckboxStatusDisabledChecked: function(){
            var statusDisabled = Browser.getElement(selector.filter_checkboxStatusDisabled);
            var isChecked = statusDisabled.getProperty('checked');
            expect(isChecked).to.equal(true);
        },

        verifyFilterCheckboxStatusNonassignableChecked: function(){
            var statusNonassignable = Browser.getElement(selector.filter_checkboxStatusNonassignable);
            var isChecked = statusNonassignable.getProperty('checked');
            expect(isChecked).to.equal(true);
        },

        verifyFilterCheckboxRoleTypeComChecked: function(){
            var roleTypeCom = Browser.getElement(selector.filter_checkboxRoleTypeCom);
            var isChecked = roleTypeCom.getProperty('checked');
            expect(isChecked).to.equal(true);
        },

        verifyFilterCheckboxRoleTypeCppChecked: function(){
            var roleTypeCpp = Browser.getElement(selector.filter_checkboxRoleTypeCpp);
            var isChecked = roleTypeCpp.getProperty('checked');
            expect(isChecked).to.equal(true);
        },

        verifyFilterCheckboxRoleTypeComAliasChecked: function(){
            var roleTypeComAlias = Browser.getElement(selector.filter_checkboxRoleTypeComAlias);
            var isChecked = roleTypeComAlias.getProperty('checked');
            expect(isChecked).to.equal(true);
        },

        verifyFilterCheckboxRoleTypeCustomChecked: function(){
            var roleTypeCustom = Browser.getElement(selector.filter_checkboxRoleTypeCustom);
            var isChecked = roleTypeCustom.getProperty('checked');
            expect(isChecked).to.equal(true);
        },

        verifyFilterCheckboxRoleTypeSystemChecked: function(){
            var roleTypeSystem = Browser.getElement(selector.filter_checkboxRoleTypeSystem);
            var isChecked = roleTypeSystem.getProperty('checked');
            expect(isChecked).to.equal(true);
        },

        clickFilterCheckboxStatusEnabled: function() {
            var checkbox = Browser.getElement(selector.filter_checkboxStatusEnabled);
            checkbox.trigger('click');
        },

        clickFilterCheckboxStatusDisabled: function() {
            var checkbox = Browser.getElement(selector.filter_checkboxStatusDisabled);
            checkbox.trigger('click');
        },

        clickFilterCheckboxStatusNonassignable: function() {
            var checkbox = Browser.getElement(selector.filter_checkboxStatusNonassignable);
            checkbox.trigger('click');
        },

        clickFilterCheckboxRoleTypeCom: function() {
            var checkbox = Browser.getElement(selector.filter_checkboxRoleTypeCom);
            checkbox.trigger('click');
        },

        clickFilterCheckboxRoleTypeCpp: function() {
            var checkbox = Browser.getElement(selector.filter_checkboxRoleTypeCpp);
            checkbox.trigger('click');
        },

        clickFilterCheckboxRoleTypeComAlias: function() {
            var checkbox = Browser.getElement(selector.filter_checkboxRoleTypeComAlias);
            checkbox.trigger('click');
        },

        clickFilterCheckboxRoleTypeCustom: function() {
            var checkbox = Browser.getElement(selector.filter_checkboxRoleTypeCustom);
            checkbox.trigger('click');
        },

        clickFilterCheckboxRoleTypeSystem: function() {
            var checkbox = Browser.getElement(selector.filter_checkboxRoleTypeSystem);
            checkbox.trigger('click');
        },

        clickFilterButtonApply: function() {
            var button = Browser.getElement(selector.filter_buttonApply);
            button.trigger('click');
        },

        clickFilterButtonClear: function() {
            var button = Browser.getElement(selector.filter_buttonClear);
            button.trigger('click');
        }
    };
});
