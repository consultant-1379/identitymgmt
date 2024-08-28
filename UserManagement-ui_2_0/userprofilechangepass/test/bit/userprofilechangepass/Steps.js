define([
    'jscore/core',
    'test/bit/lib/Browser',
    './Model'
], function(core, Browser, Model) {


    var waitForPageIsLoaded = function waitForPageIsLoaded(resolve, reject) {
        Model.waitForPageLoaded(500)
            .then(resolve)
            .catch(reject);
    };

    var goToChangePassPageAndWaitForPageIsLoaded = function(username) {
        return [
            goToChangePassHash(username),
            waitForPageIsLoaded
        ];
    };


    var validatePasswordPolicyOnList = function(policyName, policyText) {
        return function validatePasswordPolicyOnList() {
            var policyElement = Model.verifyPasswordPolicyAreDisplayed(policyName);
            expect(policyElement.getText().trim()).to.equal(policyText.trim());
        };
    };

    var goToChangePassHash = function goToHash(username) {
        return function() {
            Browser.gotoHash('userprofilechangepass');
        };
    };

    var checkTopInfoText = function(textUser) {
        return function checkTopInfoText(resolve, reject) {
            Model.getTopInfoText(textUser).then(resolve).catch(reject);
        };
    };


    var checkTitle = function(textTitle) {
        return function checkTitle(resolve, reject) {
            Model.getTitleElement(textTitle).then(resolve).catch(reject);
        };
    };


    var checkValidationMessage = function(message, validatorType) {
        return function checkValidationMessage(resolve, reject) {
            Model.getValidationElement(validatorType).then(function(element) {
                expect(message.trim()).to.equal(element.getText().trim());
                resolve();
            }).catch(reject);
        };
    };
    var clickSaveButton = function(message) {
        return function clickSaveButton(resolve, reject) {
            Model.waitForSaveButton().then(function(element) {
                expect(element).not.to.equal(null);
                expect(element).not.to.equal(undefined);
                element.trigger('click');
                resolve();
            }).catch(reject);
        };
    }

    var validatePasswordPolicies = function() {
        return function validatePasswordPolicies() {
            Model.verifyPasswordPoliciesAreCorrectlyDisplayed();
        };
    };


    var inputCorrectPassword = function(inputText) {
        return function inputCorrectPassword() {
            Model.fillInputFieldWithCorrectPassword(inputText);
        };
    };

    var inputIncorrectPasswordToShort = function(inputText) {
        return function inputIncorrectPasswordToShort(resolve, reject) {
            Model.fillInputFieldWithIncorrectPassword(inputText).then(resolve).catch(reject);
        };
    };

    var checkPasswordPoliciesAreValidatedCorrectly = function(rowsThatShouldBeMarkedWithRedCrosses) {
        return function checkPasswordPoliciesAreValidatedCorrectly() {
            Model.verifyPasswordPolicies(rowsThatShouldBeMarkedWithRedCrosses);
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

     var inputIncorrectPasswordUnsupportedSpecialCharacters = function(inputText) {
         return function inputIncorrectPasswordUnsupportedSpecialCharacters(resolve, reject) {
            Model.fillInputFieldWithIncorrectPassword(inputText).then(resolve).catch(reject);
            };
         };


    var inputEmptyOldPassword = function(password) {
        return function inputEmptyOldPassword(resolve, reject) {
            Model.fillInputEmptyOldPasswordValue(password).then(resolve).catch(reject);
        };
    };

    return {
        waitForPageIsLoaded: waitForPageIsLoaded,
        goToChangePassPageAndWaitForPageIsLoaded: goToChangePassPageAndWaitForPageIsLoaded,
        goToChangePassHash: goToChangePassHash,
        checkTitle: checkTitle,
        checkTopInfoText: checkTopInfoText,
        checkValidationMessage: checkValidationMessage,
        validatePasswordPolicies: validatePasswordPolicies,
        inputCorrectPassword: inputCorrectPassword,
        clickSaveButton: clickSaveButton,
        validatePasswordPolicyOnList: validatePasswordPolicyOnList,
        inputIncorrectPasswordToShort: inputIncorrectPasswordToShort,
        checkPasswordPoliciesAreValidatedCorrectly: checkPasswordPoliciesAreValidatedCorrectly,
        inputIncorrectPasswordToLong: inputIncorrectPasswordToLong,
        inputIncorrectPasswordNoMinimumLowercaseLetters: inputIncorrectPasswordNoMinimumLowercaseLetters,
        inputIncorrectPasswordNoMinimumUppercaseLetters: inputIncorrectPasswordNoMinimumUppercaseLetters,
        inputIncorrectPasswordNoMinimumDigits: inputIncorrectPasswordNoMinimumDigits,
        inputIncorrectPasswordOnlyDigits: inputIncorrectPasswordOnlyDigits,
        inputIncorrectPasswordOnlySpecialCharacters: inputIncorrectPasswordOnlySpecialCharacters,
        inputIncorrectRepeatPasswordValue: inputIncorrectRepeatPasswordValue,
        inputEmptyOldPassword: inputEmptyOldPassword,
        inputIncorrectPasswordUnsupportedSpecialCharacters:inputIncorrectPasswordUnsupportedSpecialCharacters
    };

});
