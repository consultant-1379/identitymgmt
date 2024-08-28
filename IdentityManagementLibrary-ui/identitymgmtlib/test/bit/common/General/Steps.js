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
    './Model',
    'identitymgmtlib/Utils',
    'test/bit/lib/Browser'
], function(core, Model, Utils, Browser) {

    //////////////////////////////////////////////////////////////////////
    // GENERAL PURPOSE ACTIONS
    //////////////////////////////////////////////////////////////////////

    var sleep = function(timeout) {
        return function sleep(resolve) {
            setTimeout(resolve, timeout);
        };
    };

    var checkDefinedElement = function(element) {
        expect(element).not.to.equal(null);
        expect(element).not.to.equal(undefined);
    };

    var waitForPageIsLoaded = function waitForPageIsLoaded(resolve, reject) {
        Model.waitForPageLoaded(500)
            .then(resolve)
            .catch(reject);
    };

    var changeLocationHash = function(_hash) {
        return function changeLocationHash() {
            window.location.hash = _hash;
        };
    };

    var changeLocationHashParameter = function(_parameter, _value) {
        return function changeLocationHashParameter() {

            //If we remove this, potential error will occur in further steps
            verifyLocationHashParameterPresent(_parameter)();

            var _parsedHash = Utils.parseHash(window.location.hash);
            var currentParamValue = _parameter + '=' + _parsedHash.query[_parameter];

            var newHash = window.location.hash;
            newHash = newHash.replace(currentParamValue, _parameter + '=' + _value);
            window.location.hash = newHash;
        };
    };

    var clickTopSectionButton = function(_buttonName) {
        return function clickTopSectionButton() {
            var _topSectionButtons = Model.topSectionButtons();
            var _requestedButton;
            _topSectionButtons.forEach(function(_button) {
                if (_button.getText().trim() === _buttonName.trim()) {
                    _requestedButton = _button;
                }
            });

            if (_requestedButton) {
                _requestedButton.trigger("click");
            } else {
                throw "Top section button not found: " + _buttonName;
            }
        };
    };

    var verifyTopSectionButton = function(_buttonName) {
        return function verifyTopSectionButton() {
            var _topSectionButtons = Model.topSectionButtons();
            var _requestedButton;
            _topSectionButtons.forEach(function(_button) {
                if (_button.getText() === _buttonName) {
                    _requestedButton = _button;
                }
            });

            if (_requestedButton) {
                return true;
            } else {
                throw "Top section button not found: " + _buttonName;
            }
        };
    };


    var verifyTopSectionButtonNotVisible = function(_buttonName) {
        return function verifyTopSectionButton() {
            var _topSectionButtons = Model.topSectionButtons();
            var _requestedButton;
            _topSectionButtons.forEach(function(_button) {
                if (_button.getText() === _buttonName) {
                    _requestedButton = _button;
                }
            });

            if (_requestedButton) {
                throw "Top section button was found: " + _buttonName;
            } else {
                return true;
            }
        };
    };

    var verifyTopSectionButtonEnabled = function(_buttonName) {
        return function verifyTopSectionButtonEnabled() {
            var _topSectionButtons = Model.topSectionButtons();
            var _requestedButton;
            _topSectionButtons.forEach(function(_button) {
                if (_button.getText() === _buttonName) {
                    _requestedButton = _button;
                }
            });

            if (_requestedButton) {
                expect(_requestedButton.getProperty('disabled')).to.equal(false);
            } else {
                throw "Top section button not found: " + _buttonName;
            }
        };
    };

    var verifyTopSectionButtonDisabled = function(_buttonName) {
        return function verifyTopSectionButtonDisabled() {
            var _topSectionButtons = Model.topSectionButtons();
            var _requestedButton;
            _topSectionButtons.forEach(function(_button) {
                if (_button.getText() === _buttonName) {
                    _requestedButton = _button;
                }
            });

            if (_requestedButton) {
                expect(_requestedButton.getProperty('disabled')).to.equal(true);
            } else {
                throw "Top section button not found: " + _buttonName;
            }
        };
    };

    var restoreBrowser = function() {
        Model.restoreBrowser();
    };

    //////////////////////////////////////////////////////////////////////
    // GENERAL PURPOSE VERIFICATIONS
    //////////////////////////////////////////////////////////////////////

    var verifyTopSectionTitle = function(_title) {
        return function verifyTopSectionTitle(resolve, reject) {
            Model.waitForPageTopSectionTitle().then(
                function(element) {
                    expect(element.getText().trim()).to.equal(_title.trim());
                    resolve();
                }).catch(reject);
        }
    };

    var verifyLocationHash = function(_hash) {
        return function verifyLocationHash() {
            Model.verifyLocationHash(_hash);
        };
    };

    var verifyLocationHashParameterPresent = function(_parameter) {
        return function verifyLocationHashParameterPresent() {
            expect(window.location.hash).to.contain(_parameter + '=');
        };
    };

    var verifyLocationHashParameterAbsent = function(_parameter) {
        return function verifyLocationHashParameterAbsent() {
            expect(window.location.hash).to.not.contain(_parameter + '=');
        };
    };

    var verifyLocationHashHasParameterValue = function(_parameter, _value) {
        return function verifyLocationHashHasParameterValue() {
            expect(window.location.hash).to.contain(_parameter + '=' + encodeURIComponent(_value));
        };
    };

    var verifyLocationHashPage = function(_hash) {
        return function verifyLocationHashPage() {
            Model.verifyLocationHashPage(_hash);
        };
    };

    //////////////////////////////////////////////////////////////////////
    // NOTIFICATION ACTIONS
    //////////////////////////////////////////////////////////////////////

    var waitForNotification = function(){
       return function waitForNotification(resolve, reject) { //INFO: Guess if async base on method signature
           Model.waitForNotification(2000)
               .then(resolve)
               .catch(reject);
       }
    };

    var waitForSuccessNotification = function() {
        return function waitForSuccessNotification(resolve, reject) { //INFO: Guess if async base on method signature
           Model.waitForSuccessNotification(2000)
               .then(resolve)
               .catch(reject);
       }
    };

    var verifyNotificationText = function(_text) {
       return function verifyNotificationText(resolve, reject) {
           Model.verifyNotificationText().then(function(element) {
               expect(element).not.to.equal(null);
               expect(element).not.to.equal(undefined);
               expect(element.getText().trim()).to.equal(_text);
               resolve();
           }).catch(reject);
       }
    };
    var verifySuccessNotificationText = function(_text) {
       return function verifySuccessNotificationText(resolve, reject) {
           Model.verifySuccessNotificationText().then(function(element) {
               expect(element).not.to.equal(null);
               expect(element).not.to.equal(undefined);
               expect(element.getText().trim()).to.equal(_text);
               resolve();
           }).catch(reject);
       }
    };

    var clickNotificationClose = function() {
        return function clickNotificationClose(resolve, reject) {
            Model.clickNotificationClose().then(function(element){
                expect(element).not.to.equal(null);
                expect(element).not.to.equal(undefined);
                element.trigger('click');
                resolve();
            }).catch(reject);
        }
    };
    var clickSuccessNotificationClose = function() {
        return function clickSuccessNotificationClose(resolve, reject){
            Model.clickSuccessNotificationClose().then(function(element){
                expect(element).not.to.equal(null);
                expect(element).not.to.equal(undefined);
                element.trigger('click');
                resolve();
            }).catch(reject);
        }
    };

    //////////////////////////////////////////////////////////////////////
    // DIALOG ACTIONS
    //////////////////////////////////////////////////////////////////////

    var waitForDialog = function(){
        return function waitForDialog(resolve, reject) {
            Model.waitForDialog(7000)
                    .then(resolve)
                    .catch(reject);
        }
    };

    var waitForDialogDisappear = function(){
        return function waitForDialogDisappear(resolve, reject) {
            Model.waitForDialogDisappear(5000)
                    .then(resolve)
                    .catch(reject);
        }
    };


    var waitForDialogPrimaryText = function(){
        return function waitForDialogPrimaryText(resolve, reject) {
            Model.waitForDialogPrimaryText(5000)
                .then(resolve)
                .catch(reject);
        }
    };

    var waitForDialogSecondaryText = function(){
        return function waitForDialogSecondaryText(resolve, reject) {
            Model.waitForDialogSecondaryText(5000)
                .then(resolve)
                .catch(reject);
        }
    };

    var verifyDialogPrimaryText = function(_text) {
        return function waitForDialogPrimaryText(resolve, reject) {
            Model.waitForDialogPrimaryText(5000).then(function(element) {
                expect(element).not.to.equal(null);
                expect(element).not.to.equal(undefined);
                expect(element.getText().trim()).to.equal(_text);
                resolve();
            }).catch(reject);
        }
    };

    var verifyDialogSecondaryText = function(_text) {
        return function waitForDialogSecondaryText(resolve, reject) {
            Model.waitForDialogSecondaryText(5000).then(function(element) {
                expect(element).not.to.equal(null);
                expect(element).not.to.equal(undefined);
                expect(element.getText().trim()).to.equal(_text);
                resolve();
            }).catch(reject);
        }
    };

    var clickDialogButton = function(_text) {
        return function() {
            var elements = Model.getDialogButtons();
            var availableButtons = " ";
            var buttonExists = elements.some(function(element) {
                availableButtons += element.getText() + " ";
                if (_text.toLowerCase() === element.getText().trim().toLowerCase()) {
                    expect(element).not.to.equal(null);
                    expect(element).not.to.equal(undefined);
                    element.trigger('click');
                    return true;
                }
            });

            if (!buttonExists) {
                throw 'Button: "' + _text + '" NOT FOUND! ' + 'Available buttons: ' + availableButtons;
            }
        }
    };

    //////////////////////////////////////////////////////////////////////
    // ERROR WIDGET
    //////////////////////////////////////////////////////////////////////

    var waitForErrorWidget = function waitForErrorWidget(resolve, reject) {
        Model.waitForErrorWidget(500)
            .then(resolve)
            .catch(reject);
    };

    var verifyErrorWidgetHeader = function(_text) {
        return function verifyErrorWidgetHeader() {
            expect(Model.errorWidgetHeader().getText()).to.equal(_text);
        };
    };

    var verifyErrorWidgetContent = function(_text) {
        return function verifyErrorWidgetContent() {
            expect(Model.errorWidgetContent().getText()).to.equal(_text);
        };
    };

    var clickButtonFilters = function(){
        return function clickButtonFilters(resolve, reject) {
            if (!Model.clickButtonFiltersIfPresent()) {
                Model.clickAndWaitForContextMenu().then(function(filterButton) {
                    filterButton.trigger('click');
                    resolve();
                }).catch(reject);
            } else {
                resolve();
            }
        }
    };

    var clickButtonSummary = function(){
        return function clickButtonSummary(resolve, reject) {
            if (!Model.clickButtonSummaryIfPresent()) {
                Model.clickAndWaitForContextMenu().then(function(summaryButton) {
                    summaryButton.trigger('click');
                    resolve();
                }).catch(reject);
            } else {
                resolve();
            }
        }
    };

    var verifyFilterPanelPresent = function() {
        return function verifyFilterPanelPresent(resolve, reject) {
            Model.verifyFilterPanelPresent().then(function(element){
                checkDefinedElement(element);
                resolve();
            }).catch(reject);
        };
    };

    var clickFilterButtonClose = function() {
        return function clickFilterButtonClose(resolve, reject) {
            Model.clickFilterButtonClose().then(function(element){
                var button = element;
                checkDefinedElement(button);
                button.trigger('click');
                resolve();
            }).catch(reject);
        }
    };


    return {

        // GENERAL PURPOSE ACTIONS
        sleep: sleep,
        waitForPageIsLoaded: waitForPageIsLoaded,
        changeLocationHash: changeLocationHash,
        changeLocationHashParameter: changeLocationHashParameter,
        clickTopSectionButton: clickTopSectionButton,
        verifyTopSectionButtonEnabled: verifyTopSectionButtonEnabled,
        verifyTopSectionButtonDisabled: verifyTopSectionButtonDisabled,
        restoreBrowser: restoreBrowser,

        // GENERAL PURPOSE VERIFICATIONS
        verifyLocationHash: verifyLocationHash,
        verifyTopSectionTitle: verifyTopSectionTitle,
        verifyLocationHashParameterPresent: verifyLocationHashParameterPresent,
        verifyLocationHashParameterAbsent: verifyLocationHashParameterAbsent,
        verifyLocationHashHasParameterValue: verifyLocationHashHasParameterValue,
        verifyLocationHashPage: verifyLocationHashPage,
        verifyTopSectionButton: verifyTopSectionButton,
        verifyTopSectionButtonNotVisible: verifyTopSectionButtonNotVisible,

        // NOTIFFICATION ACTIONS
        waitForNotification: waitForNotification,
        waitForSuccessNotification: waitForSuccessNotification,
        verifyNotificationText: verifyNotificationText,
        verifySuccessNotificationText: verifySuccessNotificationText,
        clickNotificationClose: clickNotificationClose,
        clickSuccessNotificationClose: clickSuccessNotificationClose,

        //FILTER PANEL
        clickButtonFilters: clickButtonFilters,
        verifyFilterPanelPresent: verifyFilterPanelPresent,
        clickFilterButtonClose: clickFilterButtonClose,

        //SUMMARY PANEL
        clickButtonSummary: clickButtonSummary,

        // DIALOG ACTIONS
        waitForDialog: waitForDialog,
        waitForDialogDisappear: waitForDialogDisappear,
        verifyDialogPrimaryText: verifyDialogPrimaryText,
        verifyDialogSecondaryText: verifyDialogSecondaryText,
        clickDialogButton: clickDialogButton,
        waitForDialogPrimaryText: waitForDialogPrimaryText,
        waitForDialogSecondaryText: waitForDialogSecondaryText,


        // ERROR WIDGET
        waitForErrorWidget: waitForErrorWidget,
        verifyErrorWidgetHeader: verifyErrorWidgetHeader,
        verifyErrorWidgetContent: verifyErrorWidgetContent
    };
});
