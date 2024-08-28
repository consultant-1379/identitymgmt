define([
    'jscore/core',
    'test/bit/lib/Browser',
    './Model',
     'i18n!userprofile/app.json'
], function(core, Browser, Model, Dictionary) {


    var waitForPageIsLoaded = function waitForPageIsLoaded(resolve, reject) {
        Model.waitForPageLoaded(500)
            .then(resolve)
            .catch(reject);
    };

    var checkTitle = function(textTitle) {
        return function checkTitle(resolve, reject) {
            Model.getTitleElement(textTitle).then(resolve).catch(reject);
        };
    };

    var checkIfNotModifiableFieldIsVisible = function(id, text) {
        return function checkVisibility(resolve,reject) {
            Model.checkIfNotModifiableFieldIsVisible(id).then(function(element) {
                (text === element.getText())? resolve(element):reject(element);
            }).catch(reject);
        };
    };

    //User Profile VIEW//

    var goToUserProfileViewPageAndWaitForPageIsLoaded = function() {
       return [
           goToViewHash(),
           waitForPageIsLoaded
       ];
    };

    var goToViewHash = function goToHash() {
       return function() {
           Browser.gotoHash('userprofile');
       };
    };

    var checkEditPasswordButton = function() {
       return function checkEditPasswordButton(resolve, reject) {
           Model.checkIfButtonIsVisible(Dictionary.editPassword, 0).then(resolve).catch(reject);
       };
    };

    var checkEditDataButton = function() {
       return function checkEditDataButton(resolve, reject) {
           Model.checkIfButtonIsVisible(Dictionary.editData, 1).then(resolve).catch(reject);
       };
    };

    var checkEditDataButtonNotAvailable = function() {
       return function checkEditDataButton(resolve, reject) {
           Model.checkIfButtonIsNotVisible(Dictionary.editData, 1).then(resolve).catch(reject);
       };
    };

    var checkGetCredentialsButton = function(federated) {
       return function checkGetCredentialsButton(resolve, reject) {
           if ( federated ) {
                Model.checkIfButtonIsVisible(Dictionary.credentials, 1).then(resolve).catch(reject);
           } else {
                Model.checkIfButtonIsVisible(Dictionary.credentials, 2).then(resolve).catch(reject);
           }
       };
    };

    var checkUserRolesHeader = function() {
       return function checkUserRolesHeader(resolve, reject) {
           Model.checkIfUserRolesHeaderIsVisible().then(resolve).catch(reject);
       };
    };

    var checkDisplayedNamesOfLabels = function(expectedNamesOfLabels){
       return function checkDisplayedNamesOfLabels() {
           Model.checkIfExpectedNamesOfLabelsAreVisible(expectedNamesOfLabels);
       };
    };
    var checkDisplayedUserName = function(userName) {
       return function checkDisplayedUserName() {
           Model.checkIfUserNameIsVisible(userName);
       };
    };

    var checkDisplayedName = function(name) {
       return function checkDisplayedName() {
           Model.checkINameIsVisible(name);
       };
    };

    var checkDisplayedSurname = function(surname) {
       return function checkDisplayedSurname() {
           Model.checkIfSurnameIsVisible(surname);
       };
    };

    var checkDisplayedDescription = function checkDisplayedDescription(description) {
        return function(resolve,reject){
           Model.getDescription(500)
               .then(function(element){
                   var elementValue = element.getText().trim();
                   expect(elementValue).to.equal(description);
                   resolve();
               })
           .catch(reject);
        }
    };

    var checkDisplayedEmail = function(email) {
       return function checkDisplayedEmail() {
           Model.checkIfEmailIsVisible(email);
       };
    };

    var checkDisplayedStatus = function(status) {
       return function checkDisplayedStatus() {
           Model.checkIfStatusIsVisible(status);
       };
    };


    //User Profile EDIT//

    var goToUserProfileEditPageAndWaitForPageIsLoaded = function() {
        return [
           goToEditHash(),
           waitForPageIsLoaded
        ];
    };

    var goToEditHash = function goToHash() {
        return function() {
           Browser.gotoHash('userprofile/edit');
        };
    };

    var checkSaveButton = function() {
        return function checkSaveButton(resolve, reject) {
           Model.checkIfButtonIsVisible(Dictionary.save, 0).then(resolve).catch(reject);
        };
    };

    var checkCancelButton = function() {
        return function checkCancelButton(resolve, reject) {
           Model.checkIfButtonIsVisible(Dictionary.cancel, 1).then(resolve).catch(reject);
        };
    };

    var checkGeneralInformationHeader = function() {
        return function checkGeneralInformationHeader(resolve, reject) {
           Model.checkIfGeneralInformationHeaderIsVisible().then(resolve).catch(reject);
        };
    };

    var checkDetailsHeader = function() {
        return function checkDetailsHeader(resolve, reject) {
           Model.checkIfDetailsHeaderIsVisible().then(resolve).catch(reject);
        };
    };

    var checkRolesHeader = function() {
        return function checkRolesHeader(resolve, reject) {
           Model.checkIfRolesHeaderIsVisible().then(resolve).catch(reject);
        };
    };

    var checkDisplayedRoles = function(expectedDisplayedRoles) {
        return function checkDisplayedRoles() {
           Model.checkIfExpectedRolesAreVisible(expectedDisplayedRoles);
        };
    };

    var checkUsernameHeaderIsDisplayed = function() {
        return function checkUsernameHeaderIsDisplayed(resolve, reject) {
            Model.checkIfEditUsernameHeaderIsVisible().then(resolve).catch(reject);
        };
    };

    var checkUsernameIsDisplayed = function(username) {
        return function checkUsernameIsDisplayed(resolve, reject) {
            Model.checkIfEditUsernameIsVisible(username).then(resolve).catch(reject);
        };
    };

    var checkNameHeaderIsDisplayed = function() {
        return function checkNameHeaderIsDisplayed(resolve, reject) {
            Model.checkIfEditNameHeaderIsVisible().then(resolve).catch(reject);
        };
    };

    var checkDifferentCharactersInNameField = function(name) {
        return function checkDifferentCharactersInNameField(resolve, reject) {
            Model.inputDifferentCharactersInNameField(name).then(resolve).catch(reject);
        };
    };

    var checkSurnameHeaderIsDisplayed = function() {
        return function checkSurnameHeaderIsDisplayed(resolve, reject) {
            Model.checkIfEditSurnameHeaderIsVisible().then(resolve).catch(reject);
        };
    };

    var checkDifferentCharactersInSurnameField = function(surname) {
        return function checkDifferentCharactersInSurnameField(resolve, reject) {
            Model.inputDifferentCharactersInSurnameField(surname).then(resolve).catch(reject);
        };
    };

    var checkEmailHeaderIsDisplayed = function() {
        return function checkEmailHeaderIsDisplayed(resolve, reject) {
            Model.checkIfEditEmailHeaderIsVisible().then(resolve).catch(reject);
        };
    };

    var inputCorrectEmailAddress = function(inputText) {
        return function inputCorrectEmailAddress(resolve, reject) {
            Model.inputFieldWithCorrectEmailAddress(inputText).then(resolve).catch(reject);
        };
    };

    var inputIncorrectEmailAddress = function(inputText) {
        return function inputIncorrectEmailAddress(resolve, reject) {
            Model.inputFieldWithIncorrectEmailAddress(inputText).then(resolve).catch(reject);
        };
    };

    var clickSaveButton = function() {
        return function inputIncorrectEmailAddress() {
            Model.clickSave();
        };
    };

    var checkErrorMessage = function(index, errorMessage) {
        return function checkNameMustBeSpecifiedError(resolve, reject) {
            Model.verifyEditErrorMessage(index, errorMessage).then(resolve).catch(reject);
        };
    };

    return {
        waitForPageIsLoaded: waitForPageIsLoaded,
        goToUserProfileEditPageAndWaitForPageIsLoaded: goToUserProfileEditPageAndWaitForPageIsLoaded,
        goToUserProfileViewPageAndWaitForPageIsLoaded: goToUserProfileViewPageAndWaitForPageIsLoaded,
        goToEditHash: goToEditHash,
        goToViewHash: goToViewHash,
        checkTitle: checkTitle,
        checkSaveButton: checkSaveButton,
        checkCancelButton: checkCancelButton,
        checkGeneralInformationHeader: checkGeneralInformationHeader,
        checkDetailsHeader: checkDetailsHeader,
        checkRolesHeader: checkRolesHeader,
        checkDisplayedRoles: checkDisplayedRoles,
        checkEditPasswordButton: checkEditPasswordButton,
        checkEditDataButton: checkEditDataButton,
        checkEditDataButtonNotAvailable: checkEditDataButtonNotAvailable,
        checkGetCredentialsButton: checkGetCredentialsButton,
        checkUserRolesHeader: checkUserRolesHeader,
        checkDisplayedNamesOfLabels: checkDisplayedNamesOfLabels,
        checkDisplayedUserName: checkDisplayedUserName,
        checkDisplayedName: checkDisplayedName,
        checkDisplayedSurname: checkDisplayedSurname,
        checkDisplayedDescription: checkDisplayedDescription,
        checkDisplayedEmail: checkDisplayedEmail,
        checkDisplayedStatus: checkDisplayedStatus,
        checkUsernameHeaderIsDisplayed: checkUsernameHeaderIsDisplayed,
        checkUsernameIsDisplayed: checkUsernameIsDisplayed,
        checkDifferentCharactersInNameField: checkDifferentCharactersInNameField,
        checkDifferentCharactersInSurnameField: checkDifferentCharactersInSurnameField,
        checkNameHeaderIsDisplayed: checkNameHeaderIsDisplayed,
        checkSurnameHeaderIsDisplayed: checkSurnameHeaderIsDisplayed,
        checkEmailHeaderIsDisplayed: checkEmailHeaderIsDisplayed,
        inputCorrectEmailAddress: inputCorrectEmailAddress,
        inputIncorrectEmailAddress: inputIncorrectEmailAddress,
        clickSaveButton: clickSaveButton,
        checkErrorMessage: checkErrorMessage,
        checkIfNotModifiableFieldIsVisible: checkIfNotModifiableFieldIsVisible
    };

});
