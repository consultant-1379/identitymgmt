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
    'test/bit/lib/Browser'
], function(core, Browser) {

    var selector = {
        title: '.elLayouts-TopSection-title',
        pageInProgressMarker: '.inprogress',
        pageLoadedMarker: '.loaded',
        inputField: '.eaIdentitymgmtlib-wInputWidget-input',
        errorMessage: '.eaUsermgmtlib-wValidationResultWidget-container-errorMessage',
        greenIcon: '.ebIcon_simpleGreenTick',
        redIcon: '.ebIcon_close_red',
        policyValidationLines: 'li.eaUsermgmtlib-wPasswordPolicyElement',
        statusButton: 'div.eaIdentitymgmtlib-wCheckboxWidget-status > div.ebSwitcher.eaIdentitymgmtlib-wCheckboxWidget.eaIdentitymgmtlib-wCheckboxWidget-checkbox',
        authModeSelectBox: 'div.eaIdentitymgmtlib-wSelectBoxWidget- > button',
        authModeSelectValue: 'div.ebComponentList-item',
        passwordPolicies: '.eaUsermgmtlib-wPasswordPolicyContainer-policyField-policy',
        saveButton: '.elLayouts-ActionBarButton',
        usernameText: '.eaUsermgmtprofile-wUserDetailsEditWidget-details-userDetails-span',
        description: '.eaIdentitymgmtlib-wTextareaWidget-textarea',
        roleTypeCellText: '.eaRolemanagement-TypeCell-text',
        rolesTableHeaderText: '.ebTable-headerText',
        filterRoleInput: '.elTablelib-QuickFilter-text',
        resetPasswordFlag: 'div.eaIdentitymgmtlib-wCheckboxWidget-passwordResetFlag > div.ebSwitcher.eaIdentitymgmtlib-wCheckboxWidget.eaIdentitymgmtlib-wCheckboxWidget-checkbox',
        resetPasswordFlagStatus: 'div.eaIdentitymgmtlib-wCheckboxWidget-passwordResetFlag input.ebSwitcher-checkbox',
        resetPasswordFlagDisabled: 'div.eaIdentitymgmtlib-wCheckboxWidget-passwordResetFlag > div.ebSwitcher.eaIdentitymgmtlib-wCheckboxWidget.eaIdentitymgmtlib-wCheckboxWidget-checkbox.ebSwitcher_disabled',
        administratorRoleSelect: "#TD_TG_ASSIGN_ICON_ADMINISTRATOR > button",
        createUserPopUp: 'div.ebNotification_color_green',
        errorUserPopUp: '.elWidgets-Notification-label',
        ticked_role: function(role) {
            return 'td#TD_TG_ASSIGN_ICON_' + role + ' > button > i.eaUsermgmtlib-cCheckboxIconCell-ebIcon_tick_green';
        },
        select_specific_role: function(role){
            return '#TD_TG_ASSIGN_ICON_' + role + ' > button';
        },
        getPolicyElement: function(policyName) {
            return '.eaUsermgmtlib-wPasswordPolicyElement-policyField-policy-text-' + policyName;
        },
        passwordAgeingInputText: ".eaUsermgmtlib-wUserMgmtCustomPwd-wInputWidget-input",
        passwordAgeingCheckBox: ".eaUsermgmtlib-wUserMgmtCustomPwd-wSimpleCheckboxWidget-input",
        passwordAgeingRadioButtonFalse: ".eaUsermgmtlib-wUserMgmtCustomPwd-wRadioButtonWidget-input-false",
        passwordAgeingRadioButtonTrue: ".eaUsermgmtlib-wUserMgmtCustomPwd-wRadioButtonWidget-input-true",

        filterRoleButton: '.elTablelib-QuickFilter-field button.ebSelect-header',
        filterRoleList: '.ebComponentList-item',
        checkboxSelector: 'input.ebCheckbox'

    };

    setPassword: function setPassword(password) {
        Browser.getElements(selector.inputField)[6].setValue(password);
        Browser.getElements(selector.inputField)[6].trigger("input");
        Browser.getElements(selector.inputField)[7].setValue(password);
        Browser.getElements(selector.inputField)[7].trigger("input");
    };

    return {

        getTitleElement: function(textTitle) {
            return Browser.waitForElementWithValue(selector.title, textTitle, 60000);
        },

        verifyPasswordPolicyAreDisplayed: function(policyName) {
            return Browser.getElement(selector.getPolicyElement(policyName));
        },

        checkRolesTableHeaderExists: function(headerName) {
            var tableHeaders = Browser.getElements(selector.rolesTableHeaderText);
            for (var i = 0; i < tableHeaders.length; i++) {
                if (tableHeaders[i].getText() === headerName)
                    return true;
            }
            throw new Error("Required table header does not exist");
        },

        checkRoleTypeCellExists: function(cellText) {
            var roleTypeCells = Browser.getElements(selector.roleTypeCellText);
            for (var i = 0; i < roleTypeCells.length; i++) {
                if (roleTypeCells[i].getText() == cellText)
                    return true;
            }
            throw new Error("Required Role Type does not exist");
        },

        waitForPageInProgress: function(timeout) {
            return Browser.waitForElement(selector.pageInProgressMarker, timeout);
        },
        waitForSuccessToast: function(timeout) {
            return Browser.waitForElement(selector.createUserPopUp, timeout);
        },
        verifyErrorToast: function(label, timeout) {
            return Browser.waitForElementsWithValue(selector.errorUserPopUp, label, timeout);
        },

        waitForPageLoaded: function(timeout) {
            return Browser.waitForElement(selector.administratorRoleSelect, timeout);
        },

        waitForFilterRoleInput: function() {
            return Browser.waitForElement(selector.filterRoleInput, 1000);
        },

        verifyRoleSelected: function(role) {
            return Browser.waitForElement(selector.ticked_role(role), 1000);
        },

        fillInputFieldWithCorrectUsername: function(inputText) {
            Browser.getElements(selector.inputField)[0].setValue(inputText);
            Browser.getElements(selector.inputField)[0].trigger("input");

            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 0, "", 6000);
        },

        fillInputFieldWithIncorrectUsername: function(inputText, expectedDisplayedForbiddenCharacters) {
            Browser.getElements(selector.inputField)[0].setValue(inputText);
            Browser.getElements(selector.inputField)[0].trigger("input");

            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 0, "Use only: a-z, A-Z, 0-9, _, -, .", 6000);
        },

        fillTextFieldWithCorrectUsername: function(usernameText) {
            if (Browser.getElement(selector.usernameText).getText() != usernameText)
                throw new Error("Text with username is not correct");
        },

        verifyPasswordPolicies: function verifyPasswordPolicies(rowsThatShouldBeMarkedWithRedCrosses) {
            var i;
            for (i = 0; i < 5; i++) {
                if (rowsThatShouldBeMarkedWithRedCrosses.indexOf(i) !== -1) {
                    if (typeof(Browser.getElements(selector.policyValidationLines)[i].find(selector.redIcon)) === "undefined") {
                        //console.log(Browser.getElements(selector.policyValidationLines)[i].getNative().innerHTML);
                        throw new Error("Row number " + (i + 1) + " in Password Policies should be marked as invalid (red cross)");
                    }
                } else {
                    if (typeof(Browser.getElements(selector.policyValidationLines)[i].find(selector.greenIcon)) === "undefined") {
                        //console.log(Browser.getElements(selector.policyValidationLines)[i].getNative().innerHTML);
                        throw new Error("Line number " + (i + 1) + " should be marked as valid (green tick)");
                    }
                }
            }
        },

        fillInputFieldWithCorrectPassword: function(inputText) {
            setPassword(inputText);
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 1, "", 6000);
        },

        fillInputFieldWithIncorrectPassword: function(inputText) {
            setPassword(inputText);
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 4, "Passwords polices must be fulfilled", 6000);
        },

        fillInputFieldWithIncorrectRepeatPasswordValue: function(password, repeatePassword) {
            Browser.getElements(selector.inputField)[6].setValue(password);
            Browser.getElements(selector.inputField)[6].trigger("input");
            Browser.getElements(selector.inputField)[7].setValue(repeatePassword);
            Browser.getElements(selector.inputField)[7].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 4, "Passwords must match", 6000);
        },

        fillInputFieldWithDifferentCharactersInName: function(inputText) {
            Browser.getElements(selector.inputField)[1].setValue(inputText);
            Browser.getElements(selector.inputField)[1].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 0, "", 6000);
        },

        fillInputFieldWithDifferentCharactersInNameEdit: function(inputText) {
            Browser.getElements(selector.inputField)[0].setValue(inputText);
            Browser.getElements(selector.inputField)[0].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 0, "", 6000);
        },

        fillInputFieldWithDifferentCharactersInSurname: function(inputText, mode) {
            var indexElementForm = mode === 'editUser' ? 1 : 2;
            Browser.getElements(selector.inputField)[indexElementForm].setValue(inputText);
            Browser.getElements(selector.inputField)[indexElementForm].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 0, "", 6000);
        },

        fillInputFieldWithEmptyName: function() {
            Browser.getElements(selector.inputField)[1].setValue("");
            Browser.getElements(selector.inputField)[1].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 0, "Name must be specified", 6000);
        },

        fillInputFieldWithProperEmailAddress: function(inputText) {
            Browser.getElements(selector.inputField)[3].setValue(inputText);
            Browser.getElements(selector.inputField)[3].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 2, "", 6000);
        },

        inputProperDescription: function(inputText) {
            Browser.getElement(selector.description).setText(inputText);
            Browser.getElement(selector.description).trigger("input");
        },


        fillInputFieldWithProperEmailAddressEdit: function(inputText) {
            Browser.getElements(selector.inputField)[2].setValue(inputText);
            Browser.getElements(selector.inputField)[2].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 2, "", 6000);
        },


        fillInputFieldWithIncorrectEmailAddress: function(inputText) {
            Browser.getElements(selector.inputField)[3].setValue(inputText);
            Browser.getElements(selector.inputField)[3].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 3, "Invalid email address", 6000);
        },


        fillInputFieldWithIncorrectEmailAddressEdit: function(inputText) {
            Browser.getElements(selector.inputField)[2].setValue(inputText);
            Browser.getElements(selector.inputField)[2].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 2, "Invalid email address", 6000);
        },

        fillInputFieldWithPwdMaxAgeEdit: function(inputText) {
            if(Browser.getElements(selector.passwordAgeingInputText).length == 2) {
                Browser.getElements(selector.passwordAgeingInputText)[0].setValue(inputText);
                Browser.getElements(selector.passwordAgeingInputText)[0].trigger("input");
                return Browser.waitForIndexedElementWithValue(selector.errorMessage, 0, "", 6000);
            }
        },

        fillInputFieldWithPwdExpireWarningEdit: function(inputText) {
            if(Browser.getElements(selector.passwordAgeingInputText).length == 2) {
                Browser.getElements(selector.passwordAgeingInputText)[1].setValue(inputText);
                Browser.getElements(selector.passwordAgeingInputText)[1].trigger("input");
                return Browser.waitForIndexedElementWithValue(selector.errorMessage, 1, "", 6000);
            }
        },

        clickEnablePasswordAgeing: function() {
            Browser.getElement(selector.passwordAgeingCheckBox).trigger("click");
        },

        waitForEnablePasswordAgeing: function() {
            return Browser.waitForElement(selector.passwordAgeingCheckBox, 500);
        },

        selectPwdAgeingSystemSettings: function() {
            Browser.getElement(selector.passwordAgeingRadioButtonFalse).trigger("click");
        },

        selectPwdAgeingCustomized: function() {
            Browser.getElement(selector.passwordAgeingRadioButtonTrue).trigger("click");
        },

        enableStatus: function() {
            Browser.getElement(selector.statusButton).trigger("click");
        },

        disableStatus: function() {
            Browser.getElement(selector.statusButton).trigger("click");
        },

        setAuthMode: function(value) {
            Browser.getElement(selector.authModeSelectBox).trigger("click");
            var elements = Browser.getElements(selector.authModeSelectValue);
            elements.forEach(function(el) {
                if (el.getText() === value) {
                    el.trigger('mousemove');
                    el.trigger('click');
                }
            }.bind(this));

        },

        checkAuthMode: function(value) {
            var element = Browser.getElement(selector.authModeSelectBox);
            if (element.getText().trim() !== value) {
                throw new Error("AuthMode not selected " + value);
            }
        },

        getResetPasswordStatus: function() {
            return Browser.waitForElement(selector.resetPasswordFlagStatus, 100);
        },

        clickResetPasswordFlag: function() {
            Browser.getElement(selector.resetPasswordFlag).trigger("click");
        },

        clickFilterRoleButton: function(index) {
            var _queryRoleButton;

            _queryRoleButton = Browser.getElements(selector.filterRoleButton);
            if ( _queryRoleButton.length > index ) {
                _queryRoleButton[index].trigger('click');
            } else {
                throw new Error('Model.clickFilterRoleButton index out of range');
            }
        },

        clickFilterRoleListItem: function(itemName) {
            var _queryRole;

            _queryRole = Browser.getElements(selector.filterRoleList);
            _queryRole.forEach(function(query) {
                if (query.getText().trim() === itemName ) {
                    query.trigger('click');
                }
            });

            if (_queryRole === undefined) {
                throw new Error('Model.clickFilterRoleListItem - not found ' + itemName + ' in select list');
            }
        },

        clickFilterRoleCheckBoxListItem: function(value) {
            var _queryRole;

            _queryRole = Browser.getElements(selector.checkboxSelector);
            _queryRole.forEach(function(query) {
                if (query.getValue() === value ) {
                    query.trigger('click');
                }
            });
        },

        resetPasswordFlagSwitcherDisable: function(){
            return Browser.getElement(selector.resetPasswordFlagDisabled);
        },

        verifyPasswordPoliciesAreCorrectlyDisplayed: function() {
            var passwordPolicies = Browser.getElements(selector.passwordPolicies);
            for (var i = 0; i < 5; i++) {
                var policy = passwordPolicies[i].getText();
                if (policy.indexOf("The maximum length of password is") !== -1) {
                    if (policy.indexOf("32") === -1) {
                        throw new Error("Maximum length of password was expected to be 32");
                    }
                } else if (policy.indexOf("The minimum length of password is") !== -1) {
                    if (policy.indexOf("8") === -1) {
                        throw new Error("The minimum length of password was expected to be 8");
                    }
                } else if (policy.indexOf("The minimum lowercase letter(s) is") !== -1) {
                    if (policy.indexOf("1") === -1) {
                        throw new Error("The minimum lowercase letter(s) was expected to be 1");
                    }
                } else if (policy.indexOf("The minimum uppercase letter(s) is") !== -1) {
                    if (policy.indexOf("1") === -1) {
                        throw new Error("The maximum uppercase letter(s) was expected to be 1");
                    }
                } else if (policy.indexOf("The minimum digit(s) is") !== -1) {
                    if (policy.indexOf("1") === -1) {
                        throw new Error("The minimum digit(s) was expected to be 1");
                    }
                } else {
                    throw new Error("There is problem with displaying password policies");
                }
            }
        },

        clickRole : function(RoleName){
            Browser.getElement(selector.select_specific_role(RoleName)).trigger("click");
        },

        clickSaveButton: function() {
            Browser.getElement(selector.saveButton).trigger("click");
        },

        verifyErrorMessageUsernameMustBeSpecified: function() {
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 0, "Username required", 6000);
        },

        verifyErrorMessagePasswordAndRepeatPasswordMustBeSpecified: function() {
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 4, "Password and Repeat Password required", 6000);
        },

        verifyErrorMessageNameMustBeSpecified: function(mode) {
            var indexElementForm = mode === 'editUser' ? 0 : 1;
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, indexElementForm, "Name required", 6000);
        },

        verifyErrorMessageSurnameMustBeSpecified: function(mode) {
            var indexElementForm = mode === 'editUser' ? 1 : 2;
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, indexElementForm, "Surname required", 6000);
        },

        verifyErrorMessageEmailAddressMustBeSpecified: function(mode) {
            var indexElementForm = mode === 'editUser' ? 2 : 3;
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, indexElementForm, "Email address required", 6000);
        }

    };

});
