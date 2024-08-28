/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 -----------------------------------------------------------------------------*/

define([
    'test/bit/lib/Browser',
    'i18n!rolemgmtlib/dictionary.json'
], function(Browser, Dictionary) {
    var _shortTimeout = 1000;

    var selector = {

        nameInput: '.eaRolemgmtlib-roleForm-name',
        descriptionInput: '.eaRolemgmtlib-roleForm-description',
        roleTypeWrapper: '.ebSelect-header',
        roleTypeWrapperValue: '.ebSelect-value',
        roleTypeItems: '.ebComponentList-item',

        saveButton: '.ebBtn_color_darkBlue',
        tableRows: '.ebTableRow > .elTablelib-CheckboxCell',
        tableHeaderColumn: '.elTablelib-Table-header > .ebTableRow > th',
        tabItems: '.ebTabs-tabItem',
        statusOptions: '.ebRadioBtn',

        statusError: '.ebInput-statusError',


        counter: '.elIdentitymgmtlib-RoleMgmtTable-counter',
        title: '.elIdentitymgmtlib-RoleMgmtTable-title',

        errorUserPopUp: '.elWidgets-Notification-label',
        notificationClose: '.ebNotification-close'

    };

    return {

        setName: function(_name) {
            var name = Browser.getElement(selector.nameInput);
            name.setValue(_name);
        },

        setDescription: function(_description) {
            var description = Browser.getElement(selector.descriptionInput);
            description.setText(_description);
        },

        verifyIsRoleTypeFieldDisabled: function() {
            var roleTypeWrapper = Browser.getElement(selector.roleTypeWrapper);
            if (roleTypeWrapper.getProperty("disabled") !== true){
                throw new Error("Role Type field is not disabled");
            }
        },

        verifyNamePlaceholderText: function() {
            var element = Browser.getElement(selector.nameInput);
            if (element.getAttribute("placeholder") !== Dictionary.roleForm.name_placeholder) {
                throw new Error("Name input placeholder text different than expected:" + element.getAttribute("placeholder"));
            }
        },

        verifyDescriptionPlaceholderText: function() {
            var element = Browser.getElement(selector.descriptionInput);
            if (element.getAttribute("placeholder") !== Dictionary.roleForm.description_placeholder) {
                throw new Error("Description input placeholder text different than expected:" + element.getAttribute("placeholder"));
            }
        },

        verifyDefaultRoleTypeValue: function() {
            var element = Browser.getElement(selector.roleTypeWrapperValue);
            if (element.getText() !== Dictionary.roleForm.type_not_selected) {
                throw new Error("Role Type default value different than expected:" + element.getText());
            }
        },

        waitForComRolesAreLoaded: function(timeout) {
            return Browser.waitForElement(selector.tableRows, timeout);
        },

        waitForTaskProfileRolesAreLoaded: function(timeout) {
            return Browser.waitForElement(selector.tableRows, timeout);
        },

        waitForCapabilitiesValue: function(_capabilities, timeout) {
            return Browser.waitForElementWithValue(selector.counter, _capabilities.toString(), timeout);
        },

        waitForRoleTypeValue: function(_role, _timeout) {
            return Browser.waitForElementWithValue(selector.roleTypeWrapperValue, _role.toString(), _timeout);
        },

        verifyRolesAreVisible: function() {
            var elements = Browser.getElements(selector.tableRows);
            if (elements.length === 0) {
                throw new Error("Number of visible COM Roles: "+ elements.length);
            }
        },

        verifyTaskProfilesAreVisible: function() {
            var elements = Browser.getElements(selector.tableRows);
            if (elements.length === 0) {
                throw new Error("Number of visible Task Profile Roles: "+ elements.length);
            }
        },

        verifyCapabilitiesAreVisible: function() {
            var elements = Browser.getElements(selector.tableRows);
            if (elements.length === 0) {
                throw new Error("Number of visible Capabilities: "+ elements.length);
            }
        },

        verifyEditNameValue: function(_name) {
            var nameInput = Browser.getElement(selector.nameInput);
            if (nameInput.getValue() !== _name) {
                throw new Error("Name input text different than expected:" + nameInput.getValue());
            }
        },

        verifyEditDescriptionValue: function(_description) {
            var descriptionInput = Browser.getElement(selector.descriptionInput);
            if (descriptionInput.getValue() !== _description) {
                throw new Error("Description input text different than expected:" + descriptionInput.getValue());
            }
        },

        verifyCreateErrors: function() {
            var errors = Browser.getElements(selector.statusError);
            if (errors[0].getText() !== Dictionary.roleModel.name_not_match_pattern) {
                throw new Error("Name input text different than expected");
            }
            if (errors[1].getText() !== Dictionary.roleModel.description_empty) {
                throw new Error("Description input text different than expected");
            }
            if (errors[2].getText() !== Dictionary.roleModel.type_not_selected) {
                throw new Error("Role Type different than expected");
            }
        },

        getErrors: function() {
            return Browser.getElements(selector.statusError);
        },

        clickSaveButton: function() {
            var saveBtn = Browser.getElement(selector.saveButton);
            saveBtn.trigger("click");
        },

        clickRoleTypeSelection: function() {
            var _typeSelection = Browser.getElement(selector.roleTypeWrapper);
            _typeSelection.trigger('click');
        },

        roleTypeItems: function() {
            return Browser.getElements(selector.roleTypeItems);
        },

        statusOptions: function() {
            return Browser.getElements(selector.statusOptions);
        },

        tabItems: function() {
            return Browser.getElements(selector.tabItems);
        },

        selectComRole: function() {
            var _comRoleCheckbox = Browser.getElement(selector.tableRows);
            _comRoleCheckbox.trigger('click');
        },

        selectTaskProfileRole: function() {
            var _taskProfileRoleCheckbox = Browser.getElement(selector.tableRows);
            _taskProfileRoleCheckbox.trigger('click');
        },

        selectCapability: function() {
            var _capabilityCheckbox = Browser.getElement(selector.tableRows);
            _capabilityCheckbox.trigger('click');
        },

        tableColumnsName: function(_text) {
            return Browser.getElements(selector.tableHeaderColumn);
        },

        //verify table in create/edit role


        verifyTitleCapabilitiesIsVisible: function() {
            var elements = Browser.getElements(selector.title);
            if (elements === null) {
                throw new Error("Title of Capabilities table is not visible");
            }
        },
        verifyTitleRolesIsVisible: function() {
            var elements = Browser.getElements(selector.title);
            if (elements === null) {
                throw new Error("Title of Roles table is not visible");
            }
        },

        verifyTitleTaskProfilesIsVisible: function() {
            var elements = Browser.getElements(selector.title);
            if (elements === null) {
                throw new Error("Title of TaskProfiles table is not visible");
            }
        },

        verifyCounterCapabilitiesIsVisible: function() {
            var elements = Browser.getElements(selector.counter);
            if (elements === null) {
                throw new Error("Counter of Capabilities table is not visible");
            }
        },
        verifyCounterRolesIsVisible: function() {
            var elements = Browser.getElements(selector.counter);
            if (elements === null) {
                throw new Error("Counter of Roles table is not visible");
            }
        },

        verifyCounterTaskProfilesIsVisible: function() {
            var elements = Browser.getElements(selector.counter);
            if (elements === null) {
                throw new Error("Counter of Task Profiles table is not visible");
            }
        },

        verifyRoleTypeSelectionIsVisible: function() {
            var selectionButton = Browser.getElement(selector.roleTypeWrapper);
            if (selectionButton === null) {
                throw new Error("Role Type selection option is not visible");
            }
        },

        verifyRoleTypeSelectionOptionIsVisible: function() {
            var elementList =  Browser.getElements(selector.roleTypeItems);
            if (elementList === null) {
                throw new Error("Role Type selection option is not visible");
            }
        },

        verifyErrorToast: function(label, timeout) {
            return Browser.waitForElementsWithValue(selector.errorUserPopUp, label, timeout);
        },

        clickNotificationClose: function() {
            return Browser.waitForElement(selector.notificationClose, _shortTimeout);
        }


    };
});
