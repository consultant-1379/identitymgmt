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
    'test/bit/lib/Browser',
    './Model',
    './environment/data/RestForCreateUserPasswordResetFlagFalse'
], function(core, Browser, Model, RestForCreateUserPasswordResetFlagFalse) {

    var mode;

    var setMode = function(_mode) {
        mode = _mode;
    };

    var waitForPageIsLoaded = function waitForPageIsLoaded(resolve, reject) {
        Model.waitForPageLoaded(600)
            .then(resolve)
            .catch(reject);
    };

    var waitForResponseOfCreateUser = function waitForResponseOfCreateUser(resolve, reject) {
        return function waitForResponseOfCreateUser(resolve, reject) {
            Model.waitForSuccessToast(500)
                .then(resolve)
                .catch(reject);
        };
    };

    var waitForSpecificPageIsLoaded = function(page, rows) {
        return function waitForSpecificPageIsLoaded(resolve, reject) {
            Model.waitForSpecificPageLoaded(page, rows, 500)
                .then(resolve)
                .catch(reject);
        };
    };

    var restSpy = function(rest) {
        return function() {
            for (i = 0; i < rest.callCount; ++i) {
                if (rest.getCall(i).calledWithMatch({ url: '/oss/idm/usermanagement/users' })) {
                    expect(rest.getCall(i)
                        .calledWithMatch({
                            type: 'POST',
                            data: JSON.stringify(RestForCreateUserPasswordResetFlagFalse[0])
                        })).to.equal(true);
                }
            }
        };
    };

    var goToHash = function goToHash() {
        Browser.gotoHash('usermgmtprofile/create');
    };

    var goToEditHash = function goToHash(username) {
        return function() {
            Browser.gotoHash('usermgmtprofile/edit/' + username);
        }
    };

    var validatePasswordPolicyOnList = function(policyName, exist, policyText) {
        return function validatePasswordPolicyOnList() {
            var policyElement = Model.verifyPasswordPolicyAreDisplayed(policyName, exist);
            if (exist) {
                expect(policyElement.getText().trim()).to.equal(policyText.trim());
            } else {
                expect(policyElement).to.equal(null);
            }
        };
    };

    var goToDuplicateHash = function goToHash(username) {
        return function() {
            Browser.gotoHash('usermgmtprofile/duplicate/' + username);
        }
    };

    var gotToCreatePage = [
        goToHash
    ];

    var goToEditPage = function(username) {
        return [
            goToEditHash(username)
        ];
    };

    var goToDuplicatePage = function(username) {
        return [
            goToDuplicateHash(username)
        ];
    };

    var goToCreatePageAndWaitForPageIsLoaded = [
        goToHash,
        waitForPageIsLoaded
    ];

    var goToEditPageAndWaitForPageIsLoaded = function(username) {
        return [
            goToEditHash(username),
            waitForPageIsLoaded
        ];
    };

    var goToDuplicatePageAndWaitForPageIsLoaded = function(username) {
        return [
            goToDuplicateHash(username),
            waitForPageIsLoaded
        ];
    };

    var checkTitle = function(textTitle) {
        return function checkTitle(resolve, reject) {
            Model.getTitleElement(textTitle).then(resolve).catch(reject);
        };
    };

    var inputCorrectUsername = function(inputText) {
        return function inputCorrectUsername(resolve, reject) {
            Model.fillInputFieldWithCorrectUsername(inputText).then(resolve).catch(reject);
        };
    };

    var textCorrectUsername = function(usernameText) {
        return function textCorrectUsername() {
            Model.fillTextFieldWithCorrectUsername(usernameText);
        };
    };


    var checkUsernameInUsernameField = function(username) {
        return function waitForUsernameField(resolve, reject) {
            Model.waitForUsernameField().then(
                function(element) {
                    expect(element.getText().trim()).to.equal(username);
                    resolve();
                }).catch(reject);
        }
    };

    var inputIncorrectUsername = function(inputText, expectedDisplayedForbiddenCharacters) {
        return function inputIncorrectUsername(resolve, reject) {
            Model.fillInputFieldWithIncorrectUsername(inputText, expectedDisplayedForbiddenCharacters).then(resolve).catch(reject);
        };
    };

    var inputCorrectPassword = function(inputText) {
        return function inputCorrectPassword(resolve, reject) {
            Model.fillInputFieldWithCorrectPassword(inputText).then(resolve).catch(reject);
        };
    };

    var inputIncorrectPasswordToShort = function(inputText) {
        return function inputIncorrectPasswordToShort(resolve, reject) {
            Model.fillInputFieldWithIncorrectPassword(inputText).then(resolve).catch(reject);
        };
    };

    var inputIncorrectPasswordToLong = function(inputText) {
        return function inputIncorrectPasswordToLong(resolve, reject) {
            Model.fillInputFieldWithIncorrectPassword(inputText).then(resolve).catch(reject);
        };
    };

    var inputIncorrectPasswordNoMinimumLowercaseLetters = function(inputText) {
        return function inputIncorrectPasswordNoMinimumLowercaseLetters(resolve, reject) {
            Model.fillInputFieldWithIncorrectPassword(inputText).then(resolve).catch(reject);
        };
    };

    var inputIncorrectPasswordNoMinimumUppercaseLetters = function(inputText) {
        return function inputIncorrectPasswordNoMinimumUppercaseLetters(resolve, reject) {
            Model.fillInputFieldWithIncorrectPassword(inputText).then(resolve).catch(reject);
        };
    };

    var inputIncorrectPasswordNoMinimumDigits = function(inputText) {
        return function inputIncorrectPasswordNoMinimumDigits(resolve, reject) {
            Model.fillInputFieldWithIncorrectPassword(inputText).then(resolve).catch(reject);
        };
    };

    var inputIncorrectPasswordOnlyDigits = function(inputText) {
        return function inputIncorrectPasswordOnlyDigits(resolve, reject) {
            Model.fillInputFieldWithIncorrectPassword(inputText).then(resolve).catch(reject);
        };
    };

    var inputIncorrectPasswordOnlySpecialCharacters = function(inputText) {
        return function inputIncorrectPasswordOnlySpecialCharacters(resolve, reject) {
            Model.fillInputFieldWithIncorrectPassword(inputText).then(resolve).catch(reject);
        };
    };

    var inputIncorrectRepeatPasswordValue = function(password, repeatPassword) {
        return function inputIncorrectRepeatPasswordValue(resolve, reject) {
            Model.fillInputFieldWithIncorrectRepeatPasswordValue(password, repeatPassword).then(resolve).catch(reject);
        };
    };

    var inputDifferentCharactersInNameField = function(inputText) {
        return function inputDifferentCharactersInNameField(resolve, reject) {
            if (mode === "editUser") {
                Model.fillInputFieldWithDifferentCharactersInNameEdit(inputText).then(resolve).catch(reject);
            } else {
                Model.fillInputFieldWithDifferentCharactersInName(inputText).then(resolve).catch(reject);
            }
        };
    };

    var inputDifferentCharactersInSurnameField = function(inputText) {
        return function inputDifferentCharactersInSurnameField(resolve, reject) {
            Model.fillInputFieldWithDifferentCharactersInSurname(inputText, mode).then(resolve).catch(reject);
        };
    };

    var deleteNameFromField = function() {
        return function deleteNameFromField(resolve, reject) {
            Model.fillInputFieldWithEmptyName().then(resolve).catch(reject);
        };
    };

    var inputProperEmailAddress = function(inputText) {
        return function inputProperEmailAddress(resolve, reject) {
            if (mode === "editUser") {
                Model.fillInputFieldWithProperEmailAddressEdit(inputText).then(resolve).catch(reject);
            } else {
                Model.fillInputFieldWithProperEmailAddress(inputText).then(resolve).catch(reject);
            }
        };
    };

    var inputProperDescription = function(inputText) {
        return function inputProperDescription() {
                Model.inputProperDescription(inputText);
        };
    };

    var inputIncorrectEmailAddress = function(inputText) {
        return function inputIncorrectEmailAddress(resolve, reject) {
            if (mode === "editUser") {
                Model.fillInputFieldWithIncorrectEmailAddressEdit(inputText).then(resolve).catch(reject);
            } else {
                Model.fillInputFieldWithIncorrectEmailAddress(inputText).then(resolve).catch(reject);
            }
        };
    };

    var clickStatusButtonEnabled = function() {
        return function clickStatusButtonEnabled() {
            Model.enableStatus();
        };
    };

    var clickStatusButtonDisabled = function() {
        return function clickStatusButtonDisabled() {
            Model.disableStatus();
        };
    };

    var clickAuthModeSelectBox = function(value) {
        return function clickAuthModeSelectBox() {
            Model.setAuthMode(value);
        };
    };

    var checkAuthModeSelected = function(value) {
        return function checkAuthModeSelected() {
            Model.checkAuthMode(value);
        };
    };

    var clickRole = function(RoleName) {
        return function clickRole() {
            Model.clickRole(RoleName);
        }
    };

    var clickFilterRoleButton = function(index) {
        return function clickFilterRoleButton() {
            Model.clickFilterRoleButton(index);
        }
    };

    var clickFilterRoleListItem = function(item) {
        return function clickFilterRoleListItem() {
            Model.clickFilterRoleListItem(item);
        }
    };

    var clickFilterRoleCheckBoxListItem = function(index) {
        return function clickFilterRoleCheckBoxListItem() {
            Model.clickFilterRoleCheckBoxListItem(index);
        }
    };

    var verifyResetPasswordFlag = function(status) {
        return function verifyResetPasswordFlag(resolve, reject) {
            Model.getResetPasswordStatus().then(function(element){
                var statusButton;
                if(status === 'disabled'){
                    statusButton = false;
                }else {
                    statusButton = true;
                }
                expect(element).not.to.equal(null);
                expect(element).not.to.equal(undefined);
                expect(element.getProperty('checked')).to.equal(statusButton);
                resolve();
            }).catch(reject);
        };
    };

    var clickResetPasswordFlag = function() {
        return function clickResetPasswordFlag() {
            Model.clickResetPasswordFlag();
        };
    };

    var verifyResetPasswordFlagDisable = function() {
        return function verifyResetPasswordFlagDisable() {
            var _resetPasswordFlag = Model.resetPasswordFlagSwitcherDisable();

            expect(_resetPasswordFlag).is.not.null;

        };
    };

    var validatePasswordPolicies = function() {
        return function validatePasswordPolicies() {
            Model.verifyPasswordPoliciesAreCorrectlyDisplayed();
        };
    };

    var filterRole = function(role) {
        return function filterRoleInput(resolve, reject) {
            Model.waitForFilterRoleInput().then(
                function(element) {
                    element.setValue('^' + role);
                    element.trigger('input');
                    resolve();
                }).catch(reject);
        }
    };


    var verifyRoleSelected = function(role) {

        return [filterRole(role),
            function verifyRoleSelected(resolve, reject) {
                Model.verifyRoleSelected(role).then(
                    function(element) {
                        expect(element).not.to.undefined;
                        expect(element).not.to.null;
                        resolve();
                    }).catch(reject);
            }
        ]
    };

    var validateClickSaveButton = function() {
        return function validateClickSaveButton() {
            Model.clickSaveButton();
        };
    };

    var checkErrorMessageUsernameMustBeSpecified = function() {
        return function checkErrorMessageUsernameMustBeSpecified(resolve, reject) {
            Model.verifyErrorMessageUsernameMustBeSpecified().then(resolve).catch(reject);
        };
    };

    var checkErrorMessagePasswordAndRepeatPasswordMustBeSpecified = function() {
        return function checkErrorMessagePasswordAndRepeatPasswordMustBeSpecified(resolve, reject) {
            Model.verifyErrorMessagePasswordAndRepeatPasswordMustBeSpecified().then(resolve).catch(reject);
        };
    };

    var checkErrorMessageNameMustBeSpecified = function() {
        return function checkErrorMessageNameMustBeSpecified(resolve, reject) {
            Model.verifyErrorMessageNameMustBeSpecified(mode).then(resolve).catch(reject);
        };
    };

    var checkErrorMessageSurnameMustBeSpecified = function() {
        return function checkErrorMessageSurnameMustBeSpecified(resolve, reject) {
            Model.verifyErrorMessageSurnameMustBeSpecified(mode).then(resolve).catch(reject);
        };
    };

//    var checkErrorMessageEmailAddressMustBeSpecified = function() {
//        return function checkErrorMessageEmailAddressMustBeSpecified(resolve, reject) {
//            Model.verifyErrorMessageEmailAddressMustBeSpecified(mode).then(resolve).catch(reject);
//        };
//    };

    var checkPasswordPoliciesAreValidatedCorrectly = function(rowsThatShouldBeMarkedWithRedCrosses) {
        return function checkPasswordPoliciesAreValidatedCorrectly() {
            Model.verifyPasswordPolicies(rowsThatShouldBeMarkedWithRedCrosses);
        };
    };

    var checkRolesTableHeaderExists = function(headerName) {
        return function checkRolesTableHeaderExists() {
            Model.checkRolesTableHeaderExists(headerName);
        };
    };

    var checkRoleTypeCellExists = function(cellText) {
        return function checkRoleTypeCellExists() {
            Model.checkRoleTypeCellExists(cellText);
        };
    };

    var selectPwdAgeingSystemSettings = function() {
        return function selectPwdAgeingSystemSettings() {
            Model.selectPwdAgeingSystemSettings();
        };
    };

    var selectPwdAgeingCustomized = function() {
        return function selectPwdAgeingCustomized() {
            Model.selectPwdAgeingCustomized();
        };
    };

    var clickEnablePasswordAgeing = function() {
        return function clickEnablePasswordAgeing() {
            Model.clickEnablePasswordAgeing();
        };
    };

    var checkEnablePasswordAgeingIsDisabled = function() {
        return function checkEnablePasswordAgeingIsDisabled(resolve, reject) {
            Model.waitForEnablePasswordAgeing().then(function(element) {
                expect(element.getProperty('disabled')).to.equal(true);
                resolve();
            }).catch(reject);
        };
    };

    var fillInputFieldWithPwdMaxAgeEdit = function(inputText) {
        return function fillInputFieldWithPwdMaxAgeEdit() {
            Model.fillInputFieldWithPwdMaxAgeEdit(inputText);
        };
    };

    var fillInputFieldWithPwdExpireWarningEdit = function(inputText) {
        return function fillInputFieldWithPwdExpireWarningEdit() {
            Model.fillInputFieldWithPwdExpireWarningEdit(inputText);
        };
    };

    var verifyErrorNotificationText = function(_text) {
       return function verifyErrorNotificationText(resolve, reject) {
           Model.verifyErrorToast(_text, 1000).then(function(element) {
               expect(element).not.to.equal(null);
               expect(element).not.to.equal(undefined);
               resolve();
           }).catch(reject);
       }
    };


    return {
        setMode: setMode,
        checkTitle: checkTitle,
        filterRole: filterRole,
        checkUsernameInUsernameField: checkUsernameInUsernameField,
        verifyRoleSelected: verifyRoleSelected,
        gotToCreatePage: gotToCreatePage,
        goToEditPage: goToEditPage,
        goToDuplicatePage: goToDuplicatePage,
        goToCreatePageAndWaitForPageIsLoaded: goToCreatePageAndWaitForPageIsLoaded,
        goToEditPageAndWaitForPageIsLoaded: goToEditPageAndWaitForPageIsLoaded,
        goToDuplicatePageAndWaitForPageIsLoaded: goToDuplicatePageAndWaitForPageIsLoaded,
        inputCorrectUsername: inputCorrectUsername,
        textCorrectUsername: textCorrectUsername,
        inputIncorrectUsername: inputIncorrectUsername,
        validatePasswordPolicyOnList: validatePasswordPolicyOnList,
        inputCorrectPassword: inputCorrectPassword,
        inputIncorrectPasswordToShort: inputIncorrectPasswordToShort,
        inputIncorrectPasswordToLong: inputIncorrectPasswordToLong,
        inputIncorrectPasswordNoMinimumLowercaseLetters: inputIncorrectPasswordNoMinimumLowercaseLetters,
        inputIncorrectPasswordNoMinimumUppercaseLetters: inputIncorrectPasswordNoMinimumUppercaseLetters,
        inputIncorrectPasswordNoMinimumDigits: inputIncorrectPasswordNoMinimumDigits,
        inputIncorrectPasswordOnlyDigits: inputIncorrectPasswordOnlyDigits,
        inputIncorrectPasswordOnlySpecialCharacters: inputIncorrectPasswordOnlySpecialCharacters,
        inputIncorrectRepeatPasswordValue: inputIncorrectRepeatPasswordValue,
        inputDifferentCharactersInNameField: inputDifferentCharactersInNameField,
        inputDifferentCharactersInSurnameField: inputDifferentCharactersInSurnameField,
        deleteNameFromField: deleteNameFromField,
        inputProperEmailAddress: inputProperEmailAddress,
        inputIncorrectEmailAddress: inputIncorrectEmailAddress,
        clickStatusButtonEnabled: clickStatusButtonEnabled,
        clickStatusButtonDisabled: clickStatusButtonDisabled,
        clickAuthModeSelectBox: clickAuthModeSelectBox,
        checkAuthModeSelected: checkAuthModeSelected,
        clickResetPasswordFlag: clickResetPasswordFlag,
        clickRole: clickRole,
        validatePasswordPolicies: validatePasswordPolicies,
        validateClickSaveButton: validateClickSaveButton,
        checkErrorMessageUsernameMustBeSpecified: checkErrorMessageUsernameMustBeSpecified,
        checkErrorMessagePasswordAndRepeatPasswordMustBeSpecified: checkErrorMessagePasswordAndRepeatPasswordMustBeSpecified,
        checkErrorMessageNameMustBeSpecified: checkErrorMessageNameMustBeSpecified,
        checkErrorMessageSurnameMustBeSpecified: checkErrorMessageSurnameMustBeSpecified,
//        checkErrorMessageEmailAddressMustBeSpecified: checkErrorMessageEmailAddressMustBeSpecified,
        checkPasswordPoliciesAreValidatedCorrectly: checkPasswordPoliciesAreValidatedCorrectly,
        checkRolesTableHeaderExists: checkRolesTableHeaderExists,
        checkRoleTypeCellExists: checkRoleTypeCellExists,
        checkRoleTypeCellExists: checkRoleTypeCellExists,
        restSpy: restSpy,
        waitForResponseOfCreateUser: waitForResponseOfCreateUser,
        inputProperDescription: inputProperDescription,
        selectPwdAgeingSystemSettings: selectPwdAgeingSystemSettings,
        selectPwdAgeingCustomized: selectPwdAgeingCustomized,
        clickEnablePasswordAgeing: clickEnablePasswordAgeing,
        fillInputFieldWithPwdMaxAgeEdit: fillInputFieldWithPwdMaxAgeEdit,
        fillInputFieldWithPwdExpireWarningEdit: fillInputFieldWithPwdExpireWarningEdit,
        verifyErrorNotificationText: verifyErrorNotificationText,
        checkEnablePasswordAgeingIsDisabled: checkEnablePasswordAgeingIsDisabled,
        verifyResetPasswordFlag: verifyResetPasswordFlag,
        verifyResetPasswordFlagDisable: verifyResetPasswordFlagDisable,
        clickFilterRoleButton: clickFilterRoleButton,
        clickFilterRoleListItem: clickFilterRoleListItem,
        clickFilterRoleCheckBoxListItem: clickFilterRoleCheckBoxListItem
    };

});
