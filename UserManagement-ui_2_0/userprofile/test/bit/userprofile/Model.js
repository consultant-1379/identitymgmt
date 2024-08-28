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
  'i18n!userprofile/app.json',
  'i18n!usermgmtlib/app.json',
  'i18n!identitymgmtlib/common.json',
], function(core, Browser, Dictionary, DictionaryMgmtLib, DictionaryLib) {

    var prefix_selector='.eaUserprofile';
    var selector = {
        title: '.elLayouts-TopSection-title',
        pageInProgressMarker: '.inprogress',
        pageLoadedMarker: '.loaded',



        actionButton: '.ebBtn',
        rolesHeader: prefix_selector + '-rMainRegion-rolesHeader',
        generalInformationHeader: prefix_selector + '-rMainRegion h2',
        detailsHeader: prefix_selector + '-rMainRegion h3',
        roles: prefix_selector + '-wUserProfilePrivilegesWidget p',
        usernameHeader: prefix_selector + '-wUserProfileEditWidget-details-userDetails-label',
        username: prefix_selector + '-wUserProfileEditWidget-details-userDetails-span',
        inputField: '.eaIdentitymgmtlib-wInputWidget-input',
        errorMessage: '.eaUsermgmtlib-wValidationResultWidget-container-errorMessage',
        fieldsHeader: prefix_selector + '-wUserProfileEditWidget-details-label',
        rolesGreenTick: prefix_selector + '-wUserProfilePrivilegesWidget.ebIcon_simpleGreenTick',

        greenIcon: '.ebIcon_tick',
        redIcon: '.ebIcon_error',
        userProfileLabels : prefix_selector + '-wUserProfileViewWidget-details-userDetails-label',
        usernameText: prefix_selector + '-wUserProfileViewWidget-details-userDetails-span-username',
        nameText: prefix_selector + '-wUserProfileViewWidget-details-userDetails-span-name',
        surnameText: prefix_selector + '-wUserProfileViewWidget-details-userDetails-span-surname',
        descriptionText: prefix_selector + '-wUserProfileViewWidget-details-userDetails-span-description',
        emailText: prefix_selector + '-wUserProfileViewWidget-details-userDetails-span-email',
        statusText: prefix_selector + '-wUserProfileViewWidget-details-userDetails-span-status',
        prevLoginText: prefix_selector + '-wUserProfileViewWidget-details-userDetails-span-previousLogin'
    };

    return {

        getTitleElement: function(textTitle) {
          return Browser.waitForElementWithValue(selector.title, textTitle, 2000);
        },

        checkIfButtonIsVisible: function(buttonName, Index) {
          return Browser.waitForIndexedElementWithValue(selector.actionButton,Index , buttonName, 2000);
        },

        checkIfButtonIsNotVisible: function(buttonName, Index) {
          return Browser.waitForNotAvailableIndexedElementWithValue(selector.actionButton,Index , buttonName, 2000);
        },

        waitForPageInProgress: function(timeout) {
          return Browser.waitForElement(selector.pageInProgressMarker, timeout);
        },

        checkIfGeneralInformationHeaderIsVisible: function() {
          return Browser.waitForElementWithValue(selector.generalInformationHeader, Dictionary.userprofile.general_information, 2000);
        },

        checkIfDetailsHeaderIsVisible: function() {
          return Browser.waitForElementWithValue(selector.detailsHeader, Dictionary.userprofile.details, 2000);
        },

        checkIfRolesHeaderIsVisible: function() {
          return Browser.waitForElementWithValue(selector.rolesHeader, Dictionary.userprofile.edit_user_profile_roles_header, 2000);
        },

        checkIfUserRolesHeaderIsVisible: function() {
            return Browser.waitForElementWithValue(selector.rolesHeader, Dictionary.userprofile.view_user_roles_header, 2000);
        },

        checkIfExpectedRolesAreVisible: function(expectedRoles) {
            var roles = Browser.getElements(selector.roles);
            for(var i=0; i < expectedRoles.length; i++) {
                if(roles[i].getText().indexOf(expectedRoles[i]) === -1) {
                    throw new Error("Expected Role is not Displayed");
                }
            }
        },

        checkIfExpectedNamesOfLabelsAreVisible: function(expectedNamesOfLabels) {
            var labels = Browser.getElements(selector.userProfileLabels);
            for(var i=0; i<expectedNamesOfLabels.length; ++i) {
                if(labels[i].getText().indexOf(expectedNamesOfLabels[i]) == -1){
                    throw new Error("Expected Label is not Displayed: displayed - " + labels[i].getText() + " expected - " + expectedNamesOfLabels[i] );
                }
            }
        },

        checkIfUserNameIsVisible: function(userName) {
            if(Browser.getElement(selector.usernameText).getText().indexOf(userName) == -1){
                throw new Error('Expected User Name is not Displayed');
            }
        },

        checkINameIsVisible: function(name) {
            if(Browser.getElement(selector.nameText).getText().indexOf(name) == -1){
                throw new Error('Expected Name is not Displayed');
            }
        },
        checkIfSurnameIsVisible: function(surname) {
            if(Browser.getElement(selector.surnameText).getText().indexOf(surname) == -1){
                throw new Error('Expected Surname is not Displayed');
            }
        },
        getDescription: function(timeout) {
            return Browser.waitForElement(selector.descriptionText, timeout);
        },
        checkIfEmailIsVisible: function(email) {
            if(Browser.getElement(selector.emailText).getText().indexOf(email) == -1){
                throw new Error('Expected Email is not Displayed');
            }
        },
        checkIfStatusIsVisible: function(status) {
            if(Browser.getElement(selector.statusText).getText().indexOf(status) == -1){
                throw new Error('Expected Status is not Displayed');
            }
        },

        checkIfEditUsernameHeaderIsVisible: function() {
            return Browser.waitForElementWithValue(selector.usernameHeader, Dictionary.userProfileTable.username, 2000);
        },

        checkIfNotModifiableFieldIsVisible: function(id) {
            return Browser.waitForElement("#" + id, 2000);
        },

        checkIfEditUsernameIsVisible: function(username) {
            return Browser.waitForElementWithValue(selector.username, username, 2000);
        },

        checkIfEditNameHeaderIsVisible: function() {
            return Browser.waitForIndexedElementWithValue(selector.fieldsHeader, 0, Dictionary.userProfileTable.name, 2000);
        },

        inputDifferentCharactersInNameField: function(name) {
            Browser.getElements(selector.inputField)[0].setValue(name);
            Browser.getElements(selector.inputField)[0].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 0, "", 6000);
        },

        checkIfEditSurnameHeaderIsVisible: function() {
            return Browser.waitForIndexedElementWithValue(selector.fieldsHeader, 1, Dictionary.userProfileTable.surname, 2000);
        },

        checkIfEditEmailHeaderIsVisible: function() {
            return Browser.waitForIndexedElementWithValue(selector.fieldsHeader, 2, Dictionary.userProfileTable.email, 2000);
        },

        inputDifferentCharactersInSurnameField: function(surname) {
            Browser.getElements(selector.inputField)[1].setValue(surname);
            Browser.getElements(selector.inputField)[1].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 1, "", 6000);
        },

        inputFieldWithCorrectEmailAddress: function(inputText) {
            Browser.getElements(selector.inputField)[2].setValue(inputText);
            Browser.getElements(selector.inputField)[2].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 2, "", 6000);
        },

        inputFieldWithIncorrectEmailAddress: function(inputText) {
            Browser.getElements(selector.inputField)[2].setValue(inputText);
            Browser.getElements(selector.inputField)[2].trigger("input");
            return Browser.waitForIndexedElementWithValue(selector.errorMessage, 2, Dictionary.errorMessages.invalidEmail, 6000);
        },

        clickSave: function() {
            Browser.getElements(selector.actionButton)[0].trigger("click");
        },

        verifyEditErrorMessage: function(index, errorMessage) {
           return Browser.waitForIndexedElementWithValue(selector.errorMessage, index, errorMessage, 6000);
        },

        waitForPageLoaded: function(timeout) {
        return Browser.waitForElement(selector.title, timeout);
        },

    };
});