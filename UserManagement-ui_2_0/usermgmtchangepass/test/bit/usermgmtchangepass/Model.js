define([
    'jscore/core',
    'test/bit/lib/Browser',
    'i18n!usermgmtchangepass/app.json',
    'i18n!identitymgmtlib/common.json'
], function(core, Browser, Dictionary, DictionaryLib) {

    var selector = {
        title: 'h1.elLayouts-TopSection-title',
        pageInProgressMarker: '.inprogress',
        pageLoadedMarker: '.loaded',
        errorMessage: '.eaUsermgmtlib-wValidationResultWidget-container-errorMessage',
        inputField: '.eaIdentitymgmtlib-wInputWidget-input',
        topInfoText1: 'span.eaUsermgmtchangepass-wUserMgmtChangePassWidget-mainContent-topInfoText1',
        topInfoTextUserName: 'span.eaUsermgmtchangepass-wUserMgmtChangePassWidget-mainContent-topInfoTextUserName',
        topInfoText2: 'span.eaUsermgmtchangepass-wUserMgmtChangePassWidget-mainContent-topInfoText2',
        passwordPolicies: '.eaUsermgmtlib-wPasswordPolicyContainer-policyField-policy',
        policyValidationLines: 'li.eaUsermgmtlib-wPasswordPolicyElement',
        greenIcon: '.ebIcon_simpleGreenTick',
        redIcon: '.ebIcon_close_red',
        getPolicyElement: function(policyName) {
            return '.eaUsermgmtlib-wPasswordPolicyElement-policyField-policy-text-' + policyName;
        },
        resetPasswordFlagStatus: 'div.eaIdentitymgmtlib-wCheckboxWidget-passwordResetFlag input.ebSwitcher-checkbox',
        resetPasswordFlag: 'div.eaIdentitymgmtlib-wCheckboxWidget-passwordResetFlag > div.ebSwitcher.eaIdentitymgmtlib-wCheckboxWidget.eaIdentitymgmtlib-wCheckboxWidget-checkbox',
        resetPasswordFlagDisabled: 'div.eaIdentitymgmtlib-wCheckboxWidget-passwordResetFlag > div.ebSwitcher.eaIdentitymgmtlib-wCheckboxWidget.eaIdentitymgmtlib-wCheckboxWidget-checkbox.ebSwitcher_disabled',
        notification_labelSuccess: '.ebNotification_color_green',
        notification_labelError: '.ebNotification_color_red',
        usermanagement_closeNotification: ".ebNotification-close"
    };



    setPassword: function setPassword(password) {
        Browser.getElements(selector.inputField)[0].setValue(password);
        Browser.getElements(selector.inputField)[0].trigger("input");
        Browser.getElements(selector.inputField)[1].setValue(password);
        Browser.getElements(selector.inputField)[1].trigger("input");
    };



    return {

        verifyPasswordPolicyAreDisplayed: function(policyName) {
            return Browser.getElement(selector.getPolicyElement(policyName));
        },
        
        getTitleElement: function(textTitle) {
            return Browser.waitForElementWithValue(selector.title, textTitle, 60000);
        },

        waitForPageInProgress: function(timeout) {
            return Browser.waitForElement(selector.pageInProgressMarker, timeout);
        },

        waitForPageLoaded: function(timeout) {
            return Browser.waitForElement(selector.title, timeout);
        },

        checkTopInfoText1: function() {
            return Browser.waitForElementWithValue(selector.topInfoText1, Dictionary.topInfoText1, 60000);
        },

        topInfoTextUserName: function(textUser) {
            return Browser.waitForElementWithValue(selector.topInfoTextUserName, textUser, 60000);
        },

        checkTopInfoText2: function() {
            return Browser.waitForElementWithValue(selector.topInfoText2, Dictionary.topInfoText2, 60000);
        },

        getTopInfoText: function(textUser) {
            return this.checkTopInfoText1() && this.checkTopInfoText1('"' + textUser + '"') && this.checkTopInfoText2();
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


        fillInputFieldWithCorrectPassword: function(inputText) {
            return setPassword(inputText);
        },

        fillInputFieldWithIncorrectPassword: function(inputText) {
            setPassword(inputText);
            return Browser.waitForElementWithValue(selector.errorMessage, "Passwords polices must be fulfilled", 60000);
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

        fillInputFieldWithIncorrectRepeatPasswordValue: function(password, repeatePassword) {
            Browser.getElements(selector.inputField)[0].setValue(password);
            Browser.getElements(selector.inputField)[0].trigger("input");
            Browser.getElements(selector.inputField)[1].setValue(repeatePassword);
            Browser.getElements(selector.inputField)[1].trigger("input");
            return Browser.waitForElementWithValue(selector.errorMessage, "Passwords must match", 6000);
        },

        getResetPasswordFlag: function() {
            return Browser.waitForElement(selector.resetPasswordFlag, 100);
        },
        getResetPasswordStatus: function() {
            return Browser.waitForElement(selector.resetPasswordFlagStatus, 100);
        },

        resetPasswordFlagSwitcherDisable: function(){
            return Browser.getElement(selector.resetPasswordFlagDisabled);
        },

        waitForSuccessNotification: function() {
            return Browser.waitForElement(selector.notification_labelSuccess, 3000);
        },

        waitForErrorNotification: function() {
            return Browser.waitForElement(selector.notification_labelError, 3000);
        },

        clickCloseNotification: function() {
            var _button = Browser.getElementSafe(selector.usermanagement_closeNotification);
            _button.trigger('click');
            return Browser.waitForElementDisappeared(selector.usermanagement_closeNotification, 4000);

        },



    };

});
