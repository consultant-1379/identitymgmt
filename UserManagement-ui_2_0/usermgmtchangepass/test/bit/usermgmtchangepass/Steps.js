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
            Browser.gotoHash('usermgmtchangepass/user/' + username);
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

     var inputIncorrectPasswordUnsupportedSpecialCharacters = function(inputText) {
            return function inputIncorrectPasswordUnsupportedSpecialCharacters(resolve, reject) {
                Model.fillInputFieldWithIncorrectPassword(inputText).then(resolve).catch(reject);
            };
     };


    var inputIncorrectRepeatPasswordValue = function(password, repeatPassword) {
        return function inputIncorrectRepeatPasswordValue(resolve, reject) {
            Model.fillInputFieldWithIncorrectRepeatPasswordValue(password, repeatPassword).then(resolve).catch(reject);
        };
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


    var verifyResetPasswordFlagDisable = function() {
        return function verifyResetPasswordFlagDisable() {
            var _resetPasswordFlag = Model.resetPasswordFlagSwitcherDisable();

            expect(_resetPasswordFlag).is.not.null;

        };
    };

    var clickResetPasswordFlag = function() {
        return function clickResetPasswordFlag(resolve, reject) {
           Model.getResetPasswordFlag().then(function(element){
                expect(element).not.to.equal(null);
                expect(element).not.to.equal(undefined);
                element.trigger('click');
                resolve();
           }).catch(reject);
        };
    };

    var verifySuccessNotification = function(message) {
        return [
            function verifySuccessNotification(resolve, reject) {
                Model.waitForSuccessNotification().then(
                    function(notification) {
                        expect(notification).not.to.equal(null);
                        expect(notification).not.to.equal(undefined);
                        expect(notification.getText().trim()).to.equal(message);
                        resolve();
                    }).catch(reject);
            },
            closeNotification
        ]
    };

    var verifyErrorNotification = function(message) {
        return [
            function verifyErrorNotification(resolve, reject) {
                Model.waitForErrorNotification().then(
                    function(notification) {
                        expect(notification).not.to.equal(null);
                        expect(notification).not.to.equal(undefined);
                        expect(notification.getText().trim()).to.equal(message);
                        resolve();
                    }).catch(reject);
            },
            closeNotification
        ]
    };

    var closeNotification = function(resolve, reject) {
        Model.clickCloseNotification().then(resolve, reject);
    };




    return {
        waitForPageIsLoaded: waitForPageIsLoaded,
        goToChangePassPageAndWaitForPageIsLoaded: goToChangePassPageAndWaitForPageIsLoaded,
        goToChangePassHash: goToChangePassHash,
        checkTitle: checkTitle,
        checkTopInfoText: checkTopInfoText,
        validatePasswordPolicyOnList: validatePasswordPolicyOnList,
        validatePasswordPolicies: validatePasswordPolicies,
        inputCorrectPassword: inputCorrectPassword,
        inputIncorrectPasswordToShort: inputIncorrectPasswordToShort,
        checkPasswordPoliciesAreValidatedCorrectly: checkPasswordPoliciesAreValidatedCorrectly,
        inputIncorrectPasswordToLong: inputIncorrectPasswordToLong,
        inputIncorrectPasswordNoMinimumLowercaseLetters: inputIncorrectPasswordNoMinimumLowercaseLetters,
        inputIncorrectPasswordNoMinimumUppercaseLetters: inputIncorrectPasswordNoMinimumUppercaseLetters,
        inputIncorrectPasswordNoMinimumDigits: inputIncorrectPasswordNoMinimumDigits,
        inputIncorrectPasswordOnlyDigits: inputIncorrectPasswordOnlyDigits,
        inputIncorrectPasswordOnlySpecialCharacters: inputIncorrectPasswordOnlySpecialCharacters,
        inputIncorrectPasswordUnsupportedSpecialCharacters: inputIncorrectPasswordUnsupportedSpecialCharacters,
        inputIncorrectRepeatPasswordValue: inputIncorrectRepeatPasswordValue,
        verifyResetPasswordFlag: verifyResetPasswordFlag,
        clickResetPasswordFlag: clickResetPasswordFlag,
        verifyResetPasswordFlagDisable: verifyResetPasswordFlagDisable,
        verifySuccessNotification: verifySuccessNotification,
        verifyErrorNotification: verifyErrorNotification,
        closeNotification: closeNotification
    };

});
