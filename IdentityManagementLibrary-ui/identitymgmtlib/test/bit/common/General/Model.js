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
    'identitymgmtlib/Utils'
], function(Browser, Utils) {
    var _defaultTimeout = 500;
    var _shortTimeout = 1000;
    var _mediumTimeout = 5000;
    var _largeTimeout = 10000;

    var selector = {

        //////////////////////////////////////////////////////////////////////
        // GENERAL PURPOSE
        //////////////////////////////////////////////////////////////////////
        dialogButton: '.ebDialog .ebBtn',
        button: '.ebBtn',
        paragraph: 'p',

        title: '.elLayouts-TopSection-title',
        topSectionButtons: '.ebBtn.elLayouts-ActionBarButton',

        //////////////////////////////////////////////////////////////////////
        // NOTIFICATION WIDGET
        //////////////////////////////////////////////////////////////////////
        notiffication: '.ebNotification',
        greennotiffication: '.ebNotification_color_green',
        notifficationLabel: '.ebNotification-label',
        greenNotifficationLabel: '.ebNotification_color_green .ebNotification-label',
        notifficationClose: '.ebNotification-close',
        greenNotifficationClose: '.ebNotification_color_green .ebNotification-close',

        //////////////////////////////////////////////////////////////////////
        // DIALOG WIDGET
        //////////////////////////////////////////////////////////////////////
        dialog: '.ebDialog',
        dialogPrimaryText: '.ebDialogBox-primaryText',
        dialogSecondaryText: '.ebDialogBox-secondaryText',

        //////////////////////////////////////////////////////////////////////
        // DIALOG WIDGET
        //////////////////////////////////////////////////////////////////////

        errorWidgetMarker: '.eaTargetmgmtlib-targetgroupForm-content-error',
        errorWidgetHeader: '.eaIdentitymgmtlib-errorWidget-header',
        errorWidgetContent: '.eaIdentitymgmtlib-errorWidget-content',

        //////////////////////////////////////////////////////////////////////
        // FILTER PANEL
        //////////////////////////////////////////////////////////////////////
        buttonFilters: '.elLayouts-PanelActionBar-button_filters',
        buttonContextMenu: 'div.elLayouts-PanelActionBar-contextMenu > div.ebContextMenu',
        contextMenuItem: '.ebComponentList-item',
        filter_panelPresent: '.eaFlyout_show',
        filter_buttonClose: '.eaFlyout-panelCloseIcon',

        //////////////////////////////////////////////////////////////////////
        // SUMMARY PANEL
        //////////////////////////////////////////////////////////////////////
        buttonSummary: '.elLayouts-PanelActionBar-button_summary'

    };

    return {

        //////////////////////////////////////////////////////////////////////
        // GENERAL PURPOSE
        //////////////////////////////////////////////////////////////////////

        waitForPageLoaded: function(timeout) {
            return Browser.waitForElement(selector.pageLoadedMarker, timeout);
        },

        waitForTitleElement: function(timeout) {
            return Browser.waitForElement(selector.title, timeout);
        },

        waitForPageTopSectionTitle: function(_title) {
            return Browser.waitForElement(selector.title, _shortTimeout);
        },

        verifyLocationHash: function(_hash) {
            expect(window.location.hash).to.equal(_hash);
        },

        verifyLocationHashPage: function(_hash) {
            var hashParsed = Utils.parseHash(window.location.hash);
            expect(hashParsed.hash).to.equal(_hash);
        },

        topSectionButtons: function() {
            return Browser.getElements(selector.topSectionButtons);
        },

        //INFO: Negative verification of dialog box or notification can break test flow
        //preventing from closing them in test body
        restoreBrowser: function() {

            // var notifficationClose = Browser.getElement(selector.notifficationClose);
            // if (notifficationClose) {
            //     notifficationClose.trigger('click');
            // }
            var els = Browser.getElements(selector.notifficationClose);
            for(var el in els) {
                if (els[el]) {
                    els[el].trigger('click');
                }
            };
            

            var button = Browser.getElement(selector.dialog);
            if (button) {
                button = button.find(selector.button);
                if (button) {
                    button.trigger('click');
                }
            }
        },

        //////////////////////////////////////////////////////////////////////
        // NOTIFICATION WIDGET
        //////////////////////////////////////////////////////////////////////

        waitForNotification: function(_timeout) {
            return Browser.waitForElement(selector.notiffication, _timeout); //Returns promise
        },

        waitForSuccessNotification: function(_timeout) {
            return Browser.waitForElement(selector.greennotiffication, _timeout); //Returns promise
        },

        verifyNotificationText: function(_text) {
            return Browser.waitForElement(selector.notifficationLabel, _shortTimeout); //Returns promise
        },

        verifySuccessNotificationText: function(_text) {
            return Browser.waitForElement(selector.greenNotifficationLabel, _shortTimeout); //Returns promise
        },

        clickNotificationClose: function() {
            return Browser.waitForElement(selector.notifficationClose, _shortTimeout);
        },

        clickSuccessNotificationClose: function() {
            return Browser.waitForElement(selector.greenNotifficationClose, _shortTimeout);
        },

        //////////////////////////////////////////////////////////////////////
        // DIALOG WIDGET
        //////////////////////////////////////////////////////////////////////

        waitForDialog: function(_timeout) {
            return Browser.waitForElement(selector.dialog, _timeout || _mediumTimeout);
        },

        waitForDialogDisappear: function(_timeout) {
            return Browser.waitForElementDisappeared(selector.dialog, _timeout || _mediumTimeout);
        },

        waitForDialogPrimaryText: function(_timeout) {
            return Browser.waitForElement(selector.dialogPrimaryText, _timeout || _mediumTimeout);
        },

        waitForDialogSecondaryText: function(_timeout) {
            return Browser.waitForElement(selector.dialogSecondaryText, _timeout || _mediumTimeout);
        },

        getDialogButtons: function(_timeout) {
            return Browser.getElements(selector.dialogButton);
        },

        //////////////////////////////////////////////////////////////////////
        // ERROR WIDGET
        //////////////////////////////////////////////////////////////////////

        waitForErrorWidget: function(timeout) {
            return Browser.waitForElement(selector.errorWidgetMarker, timeout);
        },

        errorWidgetHeader: function() {
            return Browser.getElement(selector.errorWidgetHeader);
        },

        errorWidgetContent: function() {
            return Browser.getElement(selector.errorWidgetContent);
        },

        clickButtonFiltersIfPresent: function() {
            var _button = Browser.getElement(selector.buttonFilters);
            if (!_button) {
                return false;
            }
            _button.trigger('click');
            return true;
        },

        clickButtonSummaryIfPresent: function() {
            var _button = Browser.getElement(selector.buttonSummary);
            if (!_button) {
                return false;
            }
            _button.trigger('click');
            return true;
        },

        clickAndWaitForContextMenu: function() {
            var _button = Browser.getElementSafe(selector.buttonContextMenu);
            _button.trigger('click');
            return Browser.waitForElement(selector.contextMenuItem, 4000);
        },

        verifyFilterPanelPresent: function() {
            return Browser.waitForElement(selector.filter_panelPresent, 4000);
        },

        clickFilterButtonClose: function() {
            return Browser.waitForElement(selector.filter_buttonClose, 4000);
        }

    };
});
