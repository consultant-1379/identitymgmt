define([
    'test/bit/lib/Browser',
    'src/usermanagement/Dictionary'
], function(Browser, Dictionary) {

    var selector = {

        //////////////////////////////////////////////////////////////////////
        // USERMANAGEMENT
        //////////////////////////////////////////////////////////////////////
        usermanagement_buttonFilters: '.elLayouts-PanelActionBar-button_filters',
        usermanagement_buttonContextMenu: 'div.elLayouts-PanelActionBar-contextMenu > div.ebContextMenu',
        usermanagement_contextMenuItem: '.ebComponentList-item',
        notification_labelSuccess: '.ebNotification_color_green',
        notification_labelError: '.ebNotification_color_red',
        usermanagement_closeNotification: ".ebNotification-close",
        notification_summaryDialog: '.ebDialogBox-contentBlock_type_error',
        notification_summaryDialogTittle: '.ebDialogBox-contentBlock_type_error .ebDialogBox-content .ebDialogBox-primaryText',
        notification_summaryDialogOkButton: '.ebDialogBox .ebDialogBox-actionBlock .ebBtn_color_darkBlue',
        //////////////////////////////////////////////////////////////////////
        // USERMANAGEMENT - PROFILE SUMMARY
        //////////////////////////////////////////////////////////////////////
        profileSummaryHeader: 'h2.elLayouts-MultiSlidingPanels-rightHeader',
        profileSummaryTerminateSessionsButton: 'button.eaUsermanagement-ProfileSummary-terminatSessions-button',
        profileSummaryEditProfileLink: 'a.eaUsermanagement-ProfileSummary-editlink',
        rolesContainerInPS: '.eaUsermanagement-ProfileSummary-rolesContainer',
        odpProfilesContainerInPS: '.eaUsermanagement-ProfileSummary-odpProfilesContainer',
        rolesPS: '.eaUsermanagement-ProfileSummaryRoles',
        odpProfilesPS: '.eaUsermanagement-ProfileSummaryOdpProfiles',
        roleCellname: '.eaUsermanagement-ProfileSummaryRoleCell-name',
        roleNamePS: 'div#PROFILESUMMARY_ROLE_',
        ENMTargetGroup: '.eaUsermanagement-ProfileSummaryRoles-serviceTgs-value',
        odpProfilesRows: 'div.eaUsermanagement-ProfileSummary-odpProfilesContainer > div > div.elTablelib-Table > div.elTablelib-Table-wrapper.eb_scrollbar > table > tbody > tr',
        usernamePS: '.eaUsermanagement-ProfileSummary-username',
        profileAssignRoles:'div.eaUsermanagement-ProfileSummaryRoles-assignedRoles-label',
        profileAssignOdpProfiles:'h4.eaUsermanagement-ProfileSummaryOdpProfiles-assignedOdpProfiles-label',
        roleType: '.eaUsermanagement-ProfileSummaryRoles-RowContent',
        profileSummaryExitButton: 'div.elLayouts-MultiSlidingPanels-header-right > div > div > div > span',
        //////////////////////////////////////////////////////////////////////
        // USERMANAGEMENT - FILTER WIDGET
        //////////////////////////////////////////////////////////////////////
        //filter_panelPresent: '.elLayouts-MultiSlidingPanels_right',
        filter_panelPresent: '.eaFlyout_show',
        filter_inputSearchByUserName: '.eaIdentitymgmtlib-TextInputFilterPlugin-TextInput-username',
        filter_inputSearchByName: '.eaIdentitymgmtlib-TextInputFilterPlugin-TextInput-name',
        filter_inputSearchBySurname: '.eaIdentitymgmtlib-TextInputFilterPlugin-TextInput-surname',
        filter_inputSearchByDescription: '.eaIdentitymgmtlib-TextInputFilterPlugin-TextInput-description',
        filter_inputCredentialStatusLoggedWithin: '.elIdentitymgmtlib-loginFilterPlugin-listItem-loggedWithin-daysInput',

        getFilterStatusRadioButton: function(status) {
            return '.elIdentitymgmtlib-radioListFilterPlugin-listItem-' + status.trim().toLowerCase() + '-input'
        },

        getFilterAuthModeRadioButton: function(authMode) {
            return '.elIdentitymgmtlib-radioListFilterPlugin-listItem-' + authMode.trim().toLowerCase() + '-input'
        },

        getRadioLoginTime: function(status) {
            status = status.replace(status[0], status[0].toLowerCase());
            status = status.replace(/ /g, '');
            return '.elIdentitymgmtlib-loginFilterPlugin-listItem-' + status + '-input'
        },

        getRadioCredentials: function(status) {
            status = '' + status;
            status = status.replace(/,/g, '_');
            status = status.replace(/ /g, '_').toUpperCase();
            return '.elIdentitymgmtlib-checkListFilterPlugin-listItem-' + status + '-input'
        },

        getLogginedIn: function(status) {
            status = status.toLowerCase();
            if (status === 'yes') {
                status = 'true'
            } else if (status === "no") {
                status = 'false'
            } else {
                status = 'all';
            }
            return '.elIdentitymgmtlib-radioListFilterPlugin-listItem-' + status + '-input';
        },

        getFailedLogins: function(status) {
            return '.elIdentitymgmtlib-radioListFilterPlugin-listItem-' + status + '-input';
        },

        getExpandableList: function(row) {
            var tableRoles = '.eaUsermanagement-ProfileSummaryRoles .elTablelib-Table-table';
            var expandableRow='tr:nth-child('+ row + ')';
            return (tableRoles + ' '+ expandableRow + ' ' + '.eaUsermanagement-ProfileSummaryRoles-RowContent-list');
        },


        filter_checkboxStatusEnabled: '.elIdentitymgmtlib-radioListFilterPlugin-listItem-enabled-input',
        filter_checkboxStatusDisabled: '.elIdentitymgmtlib-radioListFilterPlugin-listItem-disabled-input',
        filter_checkboxAuthModeLocal: '.elIdentitymgmtlib-radioListFilterPlugin-listItem-local-input',
        filter_checkboxAuthModeRemote: '.elIdentitymgmtlib-radioListFilterPlugin-listItem-remote-input',
        filter_checkboxCredentialStatusNeverLoggedIn: '.eaUsermanagement-loginFilterPlugin-listItem-neverLoggedIn-input',
        filter_checkboxCredentialStatusLoggedWithin: '.eaUsermanagement-loginFilterPlugin-listItem-loggedWithin-input',
        filter_checkboxCredentialStatusActive: '.elIdentitymgmtlib-checkListFilterPlugin-listItem-ACTIVE-input',
        filter_checkboxCredentialStatusInactive: '.elIdentitymgmtlib-checkListFilterPlugin-listItem-INACTIVE-input',
        filter_checkboxCurrentlyLoggedInYes: '.elIdentitymgmtlib-radioListFilterPlugin-listItem-YES-input',
        filter_checkboxCurrentlyLoggedInNo: '.elIdentitymgmtlib-radioListFilterPlugin-listItem-NO-input',
        filter_NoRoleAssigned: '.elIdentitymgmtlib-RolesSelector-no_role',
        filter_roles_clear: '.elIdentitymgmtlib-RolesSelector-clear',

        filter_buttonApply: '.eaUsermanagement-FilterWidget-applyButton',
        filter_buttonClear: '.eaUsermanagement-FilterWidget-clearButton',
        filter_buttonClose: '.eaFlyout-panelCloseIcon',

        filter_buttonAccordion: '.ebAccordion-title',
        filter_AccordionElementPrefix: '.ebCheckbox-label-text-',

        filter_inputSearchByRoleName: '.elIdentitymgmtlib-cSearchCell-searchInput',

        ////////////////////////////////////////////////////////////////////////
        //USERMANAGEMENT - CONFIRMATION DIALOG
        ///////////////////////////////////////////////////////////////////////
        confirmation_dialog: '.ebDialogBox',

        confirmation_dialogInfo: '.elIdentitymgmtlib-ConfirmationSummaryList-info',
        confirmation_dialogStatusTotal: '.elIdentitymgmtlib-ConfirmationSummaryList-status-total-count',
        confirmation_dialogStatusActive: '.elIdentitymgmtlib-ConfirmationSummaryList-status-succeed-count',
        confirmation_dialogStatusInactive: '.elIdentitymgmtlib-ConfirmationSummaryList-status-failed-count',

        confirmation_dialogButtons: '.ebBtn',

        confirmation_dialogTableHeader: '.elIdentitymgmtlib-ConfirmationSummaryList-table .ebTable-headerText',
        confirmation_dialogTableRow: '.elIdentitymgmtlib-ConfirmationSummaryList-table .elTablelib-Table-body > .ebTableRow',

        ////////////////////////////////////////////////////////////////////////
        //USERMANAGEMENT - ACCESS DENIED
        ///////////////////////////////////////////////////////////////////////
        accessDenied_dialog: '.ebDialogBox',
        AccessDeniedOkButton: '.ebBtn'
    }

    return {

        //////////////////////////////////////////////////////////////////////
        // USERMANAGEMENT
        //////////////////////////////////////////////////////////////////////
        waitForRightLayout: function() {
            return Browser.waitForElement(selector.usermanagement_buttonFilters, 4000);
        },
        clickUsermanagementButtonFiltersIfPresent: function() {
            var _button = Browser.getElement(selector.usermanagement_buttonFilters);
            if (!_button) {
                return false;
            }
            _button.trigger('click');
            return true;
        },

        clickAndWaitForContextMenu: function() {
            var _button = Browser.getElementSafe(selector.usermanagement_buttonContextMenu);
            _button.trigger('click');
            return Browser.waitForElement(selector.usermanagement_contextMenuItem, 4000);
        },

        waitForFilterRolesNoRoleAssigned: function() {
            return Browser.waitForElement(selector.filter_NoRoleAssigned, 4000);
        },

        waitForFilterRolesClear: function() {
            return Browser.waitForElement(selector.filter_roles_clear, 4000);
        },

        clickCloseNotification: function() {
            var _button = Browser.getElementSafe(selector.usermanagement_closeNotification);
            _button.trigger('click');
            return Browser.waitForElementDisappeared(selector.usermanagement_closeNotification, 4000);

        },

        clickCloseProfileSummary: function() {
                    var _button = Browser.getElementSafe(selector.profileSummaryExitButton);
                    _button.trigger('click');
        },

        clickOkSummaryDialog: function() {
            var _button = Browser.getElementSafe(selector.notification_summaryDialogOkButton);
            _button.trigger('click');
            return Browser.waitForElementDisappeared(selector.notification_summaryDialogOkButton, 4000);
        },

        waitForSuccessNotification: function() {
            return Browser.waitForElement(selector.notification_labelSuccess, 3000);
        },

        waitForErrorNotification: function() {
            return Browser.waitForElement(selector.notification_labelError, 3000);
        },

        waitForSummaryDialog: function() {
            return Browser.waitForElement(selector.notification_summaryDialog, 3000);
        },

        waitForSummaryDialogText: function() {
            return Browser.waitForElement(selector.notification_summaryDialogTittle, 3000);
        },

        //////////////////////////////////////////////////////////////////////
        // USERMANAGEMENT - PROFILE SUMMARY
        //////////////////////////////////////////////////////////////////////
        waitForProfileSummary: function(timeout) {
            return Browser.waitForElement(selector.profileSummaryHeader, timeout);
        },

        waitForTerminateSessionsButton: function(timeout) {
            return Browser.waitForElement(selector.profileSummaryTerminateSessionsButton, timeout);
        },

        waitForEditProfileLink: function(timeout) {
            return Browser.waitForElement(selector.profileSummaryEditProfileLink, timeout);
        },

        checkIfEditProfileLinkIsNotVisible: function() {
            return Browser.waitForElementWithValue(selector.profileSummaryEditProfileLink, Dictionary.editProfile, 2000);
        },

        waitForLoadRoles: function(timeout) {
            return Browser.waitForElement(selector.rolesContainerInPS, 500);
        },

        waitForLoadOdpProfiles: function(timeout) {
            return Browser.waitForElement(selector.odpProfilesPS, 500);
        },

        waitForNoOdpProfiles: function(timeout) {
            return Browser.waitForElementDisappeared(selector.odpProfilesPS, 2000);
        },

        getRoleProfileSummary: function() {
            return Browser.waitForElement(selector.rolesPS, 500);
        },

        getOdpProfilesProfileSummary: function() {
            return Browser.waitForElement(selector.odpProfilesPS, 500);
        },

        getRoleNameProfileSummary: function(role) {
            return Browser.waitForElement(selector.roleNamePS + role + selector.roleCellname, 500);
        },

        getApplicationNameAndProfileNameProfileSummary: function(applicationName, profileName) {
            var rows = Browser.getElements(selector.odpProfilesRows);
            var rowId = rows.find(function (row) {
                return (row.children()[0].getText() === applicationName && row.children()[1].getText() === profileName);
            });
            expect(rowId).to.not.be.undefined;
            //return Browser.waitForElement(selector.odpProfilesPS, 500);
        },

        getProfileAssignRole: function() {
            return Browser.waitForElement(selector.profileAssignRoles, 500);
        },

        getProfileAssignOdpProfiles: function() {
            return Browser.waitForElement(selector.profileAssignOdpProfiles, 500);
        },

        getENMServiceGroupProfileSummary: function() {
            return Browser.waitForElement(selector.ENMTargetGroup, 500);
        },

        getUsernameInProfileSummary: function(role) {
            return Browser.waitForElement(selector.usernamePS, 500);
        },


        //////////////////////////////////////////////////////////////////////
        // USERMANAGEMENT - FILTER WIDGET
        //////////////////////////////////////////////////////////////////////

        verifyFilterPanelPresent: function() {
            return Browser.waitForElement(selector.filter_panelPresent, 4000);
        },

        clickFilterButtonApply: function() {
            return Browser.waitForElement(selector.filter_buttonApply, 4000);
        },

        clickFilterButtonClear: function() {
            return Browser.waitForElement(selector.filter_buttonClear, 4000);
        },

        clickFilterButtonClose: function() {
            return Browser.waitForElement(selector.filter_buttonClose, 4000);
        },

        expandRow: function(row) {
            var tableRoles = Browser.getElement('.eaUsermanagement-ProfileSummaryRoles .elTablelib-Table-table');
            var firstRowColumn=tableRoles.find('tr:nth-child('+ row + ') td:first-child');

            firstRowColumn.trigger('click');
        },


        tableRowContentList: function(row) {
           return Browser.waitForElement(selector.getExpandableList(row), 4000);
        },

        getRoleType: function(tableRowDetails) {
            return tableRowDetails.find("tr:nth-child(1) td:nth-child(2)");
        },

        getTGNumber: function(tableRowDetails) {
            var row = tableRowDetails.find("tr:nth-child(2)");
            if ( row !== undefined ) {
                return row.find("td:nth-child(2)");
            }
            return undefined;
        },

        filterInputSearchByUserName: function() {
            return Browser.waitForElement(selector.filter_inputSearchByUserName, 4000);
        },

        filterInputSearchByName: function() {
            return Browser.waitForElement(selector.filter_inputSearchByName, 4000);
        },

        filterInputSearchBySurname: function() {
            return Browser.waitForElement(selector.filter_inputSearchBySurname, 4000);
        },

        filterInputSearchByDescription: function() {
            return Browser.waitForElement(selector.filter_inputSearchByDescription, 4000);
        },

        getFilterUserName: function() {
            return this.filterInputSearchByUserName();
        },

        getFilterName: function() {
            return this.filterInputSearchByName();
        },

        getFilterSurname: function() {
            return this.filterInputSearchBySurname();
        },

        getFilterDescription: function() {
            return this.filterInputSearchByDescription();
        },

        filterInputSearchByLoggedWithin: function() {
            return Browser.waitForElement(selector.filter_inputCredentialStatusLoggedWithin, 4000);
        },

        setFilterLoggedWithinDays: function() {
            return this.filterInputSearchByLoggedWithin();
        },

        filterCheckboxStatusEnabled: function() {
            return Browser.getElementSafe(selector.filter_checkboxStatusEnabled);
        },

        waitForFilterStatus: function(status) {
            return Browser.waitForElement(selector.getFilterStatusRadioButton(status), 300);
        },

        clickFilterCheckboxStatusEnabled: function() {
            var checkbox = this.filterCheckboxStatusEnabled();
            checkbox.trigger('click');
        },

        filterCheckboxStatusDisabled: function() {
            return Browser.getElementSafe(selector.filter_checkboxStatusDisabled);
        },

        filterCheckboxStatusAll: function() {
            return Browser.getElementSafe(selector.filter_checkboxStatusAll);
        },

        clickFilterCheckboxStatusDisabled: function() {
            var checkbox = this.filterCheckboxStatusDisabled();
            checkbox.trigger('click');
        },

        filterCheckboxAuthModeLocal: function() {
            return Browser.getElementSafe(selector.filter_checkboxAuthModeLocal);
        },

        waitForFilterAuthMode: function(authMode) {
            return Browser.waitForElement(selector.getFilterAuthModeRadioButton(authMode), 300);
        },

        clickFilterCheckboxAuthModeLocal: function() {
            var checkbox = this.filterCheckboxAuthModeLocal();
            checkbox.trigger('click');
        },

        filterCheckboxAuthModeRemote: function() {
            return Browser.getElementSafe(selector.filter_checkboxAuthModeRemote);
        },

        clickFilterCheckboxAuthModeRemote: function() {
            var checkbox = this.filterCheckboxAuthModeRemote();
            checkbox.trigger('click');
        },


        waitForFilterLoginTimeRadioButton: function(status, timeout) {
            return Browser.waitForElement(selector.getRadioLoginTime(status), timeout || 300);
        },

        waitForFilterCredentialsRadioButton: function(status, timeout) {
            return Browser.waitForElement(selector.getRadioCredentials(status), timeout || 300);
        },

        waitForFilterPwdExpiredRadioButton: function(status, timeout) {
            return Browser.waitForElement(selector.getRadioCredentials(status), timeout || 300);
        },

        waitForFilterLogginedInRadioButton: function(status, timeout) {
            return Browser.waitForElement(selector.getLogginedIn(status), timeout || 300);
        },

        waitForFilterFailedLoginsRadioButton: function(status, timeout) {
            return Browser.waitForElement(selector.getFailedLogins(status), timeout || 300);
        },

        filterCheckboxCredentialStatusActive: function(_itemName) {
            return Browser.getElementSafe(selector.filter_checkboxCredentialStatusActive);
        },

        clickFilterCheckboxCredentialStatusActive: function() {
            var checkbox = this.filterCheckboxCredentialStatusActive();
            checkbox.trigger('click');
        },

        filterCheckboxCredentialStatusInactive: function(_itemName) {
            return Browser.getElementSafe(selector.filter_checkboxCredentialStatusInactive);
        },

        clickFilterCheckboxCredentialStatusInactive: function() {
            var checkbox = this.filterCheckboxCredentialStatusInactive();
            checkbox.trigger('click');
        },

        filterCheckboxCurrentlyLoggedInYes: function(_itemName) {
            return Browser.getElementSafe(selector.filter_checkboxCurrentlyLoggedInYes);
        },

        clickFilterCheckboxCurrentlyLoggedInYes: function() {
            var checkbox = this.filterCheckboxCurrentlyLoggedInYes();
            checkbox.trigger('click');
        },

        filterCheckboxCurrentlyLoggedInNo: function(_itemName) {
            return Browser.getElementSafe(selector.filter_checkboxCurrentlyLoggedInNo);
        },

        clickFilterCheckboxCurrentlyLoggedInNo: function() {
            var checkbox = this.filterCheckboxCurrentlyLoggedInNo();
            checkbox.trigger('click');
        },

        filterAccordionElement: function(_itemName) {
            return Browser.getElementSafe(selector.filter_AccordionElementPrefix + _itemName);
        },

        clickFilterAccordionElement: function(_itemName) {
            var _element = this.filterAccordionElement(_itemName);
            _element.trigger('click');
        },

        waitForFilterRoleName: function() {
            return Browser.waitForElement(selector.filter_inputSearchByRoleName, 500);
        },

        checkStatusFilterNotPresent: function() {
            if ( !Browser.getElement(selector.filter_checkboxStatusEnabled) &&
                 !Browser.getElement(selector.filter_checkboxStatusDisabled) &&
                 !Browser.getElement(selector.filter_checkboxStatusAll) ) {
                return true;
            }
            return false;
        },

        checkAuthModeFilterNotPresent: function() {
            if ( !Browser.getElement(selector.filter_checkboxAuthModeLocal) &&
                 !Browser.getElement(selector.filter_checkboxAuthModeRemote)) {
                return true;
            }
            return false;
        },

        checkGeneralFiltersNotPresent: function() {
            if ( !Browser.getElement(selector.filter_inputSearchByName) &&
                 !Browser.getElement(selector.filter_inputSearchBySurname) &&
                 !Browser.getElement(selector.filter_inputSearchByDescription) ) {
                return true;
            }
            return false;
        },

        ////////////////////////////////////////////////////////////////////////
        //USERMANAGEMENT - CONFIRMATION DIALOG
        ///////////////////////////////////////////////////////////////////////
        verifyConfirmationDeleteUsersDialogPresent: function() {
            if (Browser.getElement(selector.confirmation_dialog) == null) {
                throw new Error("Dialog box is not visible");
            }
        },

        verifyConfirmationDeleteUsersDialogInfo: function(_text) {
            var dialogInfoText = Browser.getElement(selector.confirmation_dialogInfo).getText();
            expect(dialogInfoText).to.equal(_text);
        },

        verifyConfirmationDeleteUsersDialogStatusTotal: function(_value) {
            var dialogStatusText = Browser.getElement(selector.confirmation_dialogStatusTotal).getText();
            expect(dialogStatusText).to.equal(_value);
        },

        verifyConfirmationDeleteUsersDialogStatusActive: function(_value) {
            var dialogStatusText = Browser.getElement(selector.confirmation_dialogStatusActive).getText();
            expect(dialogStatusText).to.equal(_value);
        },
        verifyConfirmationDeleteUsersDialogStatusInactive: function(_value) {
            var dialogStatusText = Browser.getElement(selector.confirmation_dialogStatusInactive).getText();
            expect(dialogStatusText).to.equal(_value);
        },

        confirmationDeleteUsersDialogButtons: function() {
            return Browser.getElements(selector.confirmation_dialogButtons);
        },

        verifyConfirmationDeleteUsersDialogTableHeader: function(_userHeader, _resultHeader) {
            var headers = Browser.getElements(selector.confirmation_dialogTableHeader);
            expect(headers.length).to.equal(2);
            expect(headers[0].getText()).to.equal(_userHeader);
            expect(headers[1].getText()).to.equal(_resultHeader);

        },

        dataForRow: function(_row, _numberOfColumns) {
            var _rowElement = Browser.getElement(selector.confirmation_dialogTableRow + ':nth-child(' + _row + ')');
            var _data = [];

            for (var _col = 1; _col <= _numberOfColumns; _col++) {
                _data.push(_rowElement.find('td:nth-child(' + _col + ')').getText());
            }
            //             console.log(JSON.stringify(_data.toString()));
            return _data;
        },
        waitForConfirmationDeleteUsersDialogStatusTotal: function(_timeout) {
            return Browser.waitForElement(selector.confirmation_dialogStatusTotal, _timeout);
        },
        waitForConfirmationDeleteUsersDialogStatusActive: function(_timeout) {
            return Browser.waitForElement(selector.confirmation_dialogStatusActive, _timeout);
        },
        waitForConfirmationDeleteUsersDialogStatusInactive: function(_timeout) {
            return Browser.waitForElement(selector.confirmation_dialogStatusInactive, _timeout);
        },

        ////////////////////////////////////////////////////////////////////////
        //USERMANAGEMENT - ACCESS DENIED
        ///////////////////////////////////////////////////////////////////////
        verifyAccessDeniedDialog: function() {
            if (Browser.getElement(selector.accessDenied_dialog) == null) {
                throw new Error("Dialog box is not visible");
            }
        },
        clickOkAccessDeniedDialogButton: function() {
            var okButton = Browser.getElement(selector.AccessDeniedOkButton);
            okButton.trigger('click');
        },

    };
});
