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
    'jscore/core',
    './Model'
], function(core, Model) {

    var setName = function(_name) {
        return function setName() {
            Model.setName(_name);
        };
    };

    var setDescription = function(_description) {
        return function setDescription() {
            Model.setDescription(_description);
        };
    };

    var setRoleType = function(_text) {
        return function setRoleType() {
            Model.setRoleType(_text);
        };
    };

    var setStatus = function(_status) {
        return function setStatus() {
            var _statusOptions = Model.statusOptions();
            _statusOptions.some(function(_statusOption){
                if(_statusOption.getAttribute("value") === _status){
                    _statusOption.trigger("click");
                }
            });
        };
    };

    var selectComRole = function() {
        Model.selectComRole();
    };

    var selectTaskProfileRole = function() {
        Model.selectTaskProfileRole();
    };

    var selectCapability = function() {
        Model.selectCapability();
    };

    var clickSaveButton = function() {
        Model.clickSaveButton();
    };

    var clickRoleTypeSelection = function() {
        Model.clickRoleTypeSelection();
    };

    var clickRoleTypeSelectionOption = function(_selectOption) {
        return function clickRoleTypeSelectionOption() {
            var _selectionOptions = Model.roleTypeItems();
            var _selectionOption;
            _selectionOptions.some(function(_type){
                if(_type.getText() === _selectOption){
                    _selectionOption = _type;
                    return true;
                }
                return false;
            });

            if( _selectionOption ){
                _selectionOption.trigger("click");
            } else {
                throw "Role type not found: "+ _selectOption;
            }
        };
    };

    var clickTab = function(_selectTab) {
        return function clickTab() {
            var _selectTabs = Model.tabItems();
            var _selectionTab;
            _selectTabs.some(function(_tab){
                if(_tab.getText() === _selectTab){
                    _selectionTab = _tab;
                    return true;
                }
                return false;
            });

            if( _selectionTab ){
                _selectionTab.trigger("click");
            } else {
                throw "Tab not found: "+ _selectTab;
            }
        };
    };

    var verifyCreateErrors = function() {
        Model.verifyCreateErrors();
    };

    var verifyCreateErrorByText = function(_message) {
        return function verifyCreateErrorByText() {
            var errors = Model.getErrors();
            var result;
            errors.some(function(_error) {
                console.log(_error.getText().trim());
                if(_error.getText().trim() === _message) {
                    result = true;
                    return true;
                }
                return false;
            });

            if(!result){
                throw "Error Message: /" + _message + "/ is not found";
            }
        };
    };

    var verifyRolesAreVisible = function() {
        Model.verifyRolesAreVisible();
    };

    var verifyTaskProfilesAreVisible = function() {
        Model.verifyTaskProfilesAreVisible();
    };

    var verifyCapabilitiesAreVisible = function() {
        Model.verifyCapabilitiesAreVisible();
    };

    var verifyNamePlaceholderText = function() {
        Model.verifyNamePlaceholderText();
    };

    var verifyDescriptionPlaceholderText = function() {
        Model.verifyDescriptionPlaceholderText();
    };

    var verifyDefaultRoleTypeValue = function() {
        Model.verifyDefaultRoleTypeValue();
    };

    var verifyEditNameValue = function(_name) {
        return function verifyEditNameValue() {
            Model.verifyEditNameValue(_name);
        };
    };

    var verifyEditDescriptionValue = function(_description) {
        return function verifyEditDescriptionValue() {
            Model.verifyEditDescriptionValue(_description);
        };
    };

    var verifyIsRoleTypeFieldDisabled = function() {
        Model.verifyIsRoleTypeFieldDisabled();
    };

    var verifyStatusFieldValue = function(_status) {
        return function verifyStatusFieldValue() {
            var _statusOptions = Model.statusOptions();
            _statusOptions.some(function(_statusOption){
                if(_statusOption.getAttribute("value") === _status && _statusOption.getProperty("checked") === true){
                    return true;
                }
                throw "Status not checked: "+ _status;

            });
        };
    };

    var waitForRoleTypeValue = function(_role) {
        return function waitForRoleTypeValue(resolve, reject) {
            Model.waitForRoleTypeValue(_role, 3000)
                .then(resolve)
                .catch(reject);
        };
    };

    var waitForCapabilitiesValue = function(_capabilities) {
        return function waitForCapabilitiesValue(resolve, reject) {
            Model.waitForCapabilitiesValue(_capabilities, 3000)
                .then(resolve)
                .catch(reject);
        };
    };

    var waitForComRolesAreLoaded = function waitForComRolesAreLoaded(resolve, reject) {
        Model.waitForComRolesAreLoaded(2000)
            .then(resolve)
            .catch(reject);
    };

    var waitForTaskProfileRolesAreLoaded = function waitForTaskProfileRolesAreLoaded(resolve, reject) {
        Model.waitForTaskProfileRolesAreLoaded(2000)
            .then(resolve)
            .catch(reject);
    };

    var verifyTableColumnsName = function(_text) {
        return function verifyTableColumnsName() {
            var isItemFound = false;
            Model.tableColumnsName().forEach(function(item) {
                if (item.getText().trim() === _text) {
                    isItemFound = true;
                    return;
                }
            });
            if (!isItemFound) {
                expect('').to.equal(_text);
            }
        };
    };


    var verifyTitleCapabilitiesIsVisible = function() {
        return function verifyTitleCapabilitiesIsVisible() {
            Model.verifyTitleCapabilitiesIsVisible();
        }
    };
    var verifyCounterCapabilitiesIsVisible = function() {
        return function verifyCounterCapabilitiesIsVisible() {
            Model.verifyCounterCapabilitiesIsVisible();
        }
    };
    var verifyTitleRolesIsVisible = function() {
        return function verifyTitleRolesIsVisible() {
            Model.verifyTitleRolesIsVisible();
        }
    };
    var verifyTitleTaskProfilesIsVisible = function() {
        return function verifyTitleTaskProfilesIsVisible() {
            Model.verifyTitleTaskProfilesIsVisible();
        }
    };
    var verifyCounterRolesIsVisible = function() {
        return function verifyCounterRolesIsVisible() {
            Model.verifyCounterRolesIsVisible();
        }
    };
    var verifyCounterTaskProfilesIsVisible = function() {
        return function verifyCounterTaskProfilesIsVisible() {
            Model.verifyCounterTaskProfilesIsVisible();
        }
    };
    var verifyRoleTypeSelectionIsVisible = function() {
        return function verifyRoleTypeSelectionIsVisible() {
            Model.verifyRoleTypeSelectionIsVisible();
        }
    };
    var verifyRoleTypeSelectionOptionIsVisible = function() {
        return function verifyRoleTypeSelectionOptionIsVisible() {
            Model.verifyRoleTypeSelectionOptionIsVisible();
        }
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

    var clickErrorNotificationClose = function() {
       return function clickErrorNotificationClose(resolve, reject) {
           Model.clickNotificationClose().then(function(element){
                expect(element).not.to.equal(null);
                expect(element).not.to.equal(undefined);
                element.trigger('click');
                resolve();
            }).catch(reject);
       }
    };


    return {

        //FORM DATA/ACTIONS
        setName: setName,
        setDescription: setDescription,
        setRoleType: setRoleType,
        setStatus: setStatus,
        clickSaveButton: clickSaveButton,
        clickRoleTypeSelection: clickRoleTypeSelection,
        clickRoleTypeSelectionOption: clickRoleTypeSelectionOption,
        clickTab: clickTab,
        selectComRole: selectComRole,
        selectTaskProfileRole: selectTaskProfileRole,
        selectCapability: selectCapability,
        waitForComRolesAreLoaded: waitForComRolesAreLoaded,
        waitForTaskProfileRolesAreLoaded: waitForTaskProfileRolesAreLoaded,
        waitForRoleTypeValue: waitForRoleTypeValue,
        waitForCapabilitiesValue: waitForCapabilitiesValue,

        //FORM VERIFICATIONS
        verifyNamePlaceholderText: verifyNamePlaceholderText,
        verifyDescriptionPlaceholderText: verifyDescriptionPlaceholderText,
        verifyDefaultRoleTypeValue: verifyDefaultRoleTypeValue,
        verifyCapabilitiesAreVisible: verifyCapabilitiesAreVisible,
        verifyRolesAreVisible: verifyRolesAreVisible,
        verifyTaskProfilesAreVisible: verifyTaskProfilesAreVisible,
        verifyEditNameValue: verifyEditNameValue,
        verifyEditDescriptionValue: verifyEditDescriptionValue,
        verifyStatusFieldValue: verifyStatusFieldValue,
        verifyIsRoleTypeFieldDisabled: verifyIsRoleTypeFieldDisabled,
        verifyCreateErrors: verifyCreateErrors,
        verifyCreateErrorByText: verifyCreateErrorByText,
        verifyTableColumnsName: verifyTableColumnsName,


        verifyTitleCapabilitiesIsVisible: verifyTitleCapabilitiesIsVisible,
        verifyCounterCapabilitiesIsVisible: verifyCounterCapabilitiesIsVisible,
        verifyTitleRolesIsVisible: verifyTitleRolesIsVisible,
        verifyTitleTaskProfilesIsVisible: verifyTitleTaskProfilesIsVisible,
        verifyCounterRolesIsVisible: verifyCounterRolesIsVisible,
        verifyCounterTaskProfilesIsVisible: verifyCounterTaskProfilesIsVisible,
        verifyRoleTypeSelectionIsVisible: verifyRoleTypeSelectionIsVisible,
        verifyRoleTypeSelectionOptionIsVisible: verifyRoleTypeSelectionOptionIsVisible,

        verifyErrorNotificationText: verifyErrorNotificationText,
        clickErrorNotificationClose: clickErrorNotificationClose


    };

});
