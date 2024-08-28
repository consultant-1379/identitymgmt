define([
    'jscore/core',
    'test/bit/lib/Browser',
    './Model',
    'identitymgmtlib/Utils'
], function(core, Browser, Model, Utils) {

    var checkDefinedElement = function(element) {
        expect(element).not.to.equal(null);
        expect(element).not.to.equal(undefined);
    };

    //////////////////////////////////////////////////////////////////////
    // USERMANAGEMENT
    //////////////////////////////////////////////////////////////////////

    var clickUsermanagementButtonFilters = function(){
        return function clickUsermanagementButtonFilters(resolve, reject) {
            if (!Model.clickUsermanagementButtonFiltersIfPresent()) {
                Model.clickAndWaitForContextMenu().then(function(filterButton) {
                    filterButton.trigger('click');
                    resolve();
                }).catch(reject);
            } else {
                resolve();
            }
        }
    };

    var closeNotification = function(resolve, reject) {
        Model.clickCloseNotification().then(resolve, reject);
    };

    var clickOkSummaryDialog = function() {
        Model.clickOkSummaryDialog();
    };

    var clickCloseProfileSummary = function() {
            return function clickCloseProfileSummary(resolve, reject) {
                Model.clickCloseProfileSummary();
                resolve();
            }
    };

    var verifySuccessNotification = function(message) {
        return [
            function verifySuccessNotification(resolve, reject) {
                Model.waitForSuccessNotification().then(
                    function(notification) {
                        checkDefinedElement(notification);
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
                        checkDefinedElement(notification);
                        expect(notification.getText().trim()).to.equal(message);
                        resolve();
                    }).catch(reject);
            },
            closeNotification
        ]
    };



    var verifySummaryDialogText = function(message) {
        return [
            function verifySummaryDialogText(resolve, reject) {
                Model.waitForSummaryDialogText().then(
                    function(dialogBox) {
                        expect(dialogBox.getText().trim()).to.equal(message);
                        resolve();
                    }).catch(reject);
            },
            clickOkSummaryDialog
        ]
    };

    //////////////////////////////////////////////////////////////////////
    // USERMANAGEMENT - FILTER WIDGET ACTIONS
    //////////////////////////////////////////////////////////////////////

    var clickFilterButtonApply = function() {
        return function clickFilterButtonApply(resolve, reject) {
            Model.clickFilterButtonApply().then(function(element){
                var button = element;
                checkDefinedElement(button);
                button.trigger('click');
                resolve();
            }).catch(reject);
        }
    };


    var setFilterRoleName = function(_roleName) {
        return function setFilterRoleName(resolve, reject) {
            Model.waitForFilterRoleName().then(
                function(element) {
                    checkDefinedElement(element);
                    element.setValue(_roleName);
                    element.trigger('input');
                    resolve();
                }).catch(reject);
        }
    };

    var setFilterUserName = function(_name) {
        return function setFilterUserName(resolve, reject) {
            Model.getFilterUserName().then(function(element){
                checkDefinedElement(element);
                element.setValue(_name);
                resolve();
            }).catch(reject);
        };
    };

    var setFilterName = function(_name) {
        return function setFilterName(resolve, reject) {
            Model.getFilterName().then(function(element){
                checkDefinedElement(element);
                element.setValue(_name);
                resolve();
            }).catch(reject);
        };
    };

    var setFilterSurname = function(_name) {
        return function setFilterSurname(resolve, reject) {
            Model.getFilterSurname().then(function(element){
                checkDefinedElement(element);
                element.setValue(_name);
                resolve();
            }).catch(reject);
        };
    };

    var setFilterDescription = function(_name) {
        return function setFilterDescription(resolve, reject) {
            Model.getFilterDescription().then(function(element){
                checkDefinedElement(element);
                element.setValue(_name);
                resolve();
            }).catch(reject);
        };
    };

    var setFilterLoggedWithinDays = function(_text) {
        return function setFilterLoggedWithinDays(resolve, reject) {
            Model.setFilterLoggedWithinDays().then(function(element){
                checkDefinedElement(element);
                element.setValue(_text);
                resolve();
            }).catch(reject);
        };

    };

    var getFilterStatusRadioButton = function(status) {
        return Model.waitForFilterStatus(status);
    }

    var getFilterAuthModeRadioButton = function(authMode) {
        return Model.waitForFilterAuthMode(authMode);
    }

    var getFilterLoginTimeRadioButton = function(status) {
        return Model.waitForFilterLoginTimeRadioButton(status);
    }

    var clickFilterPwdExpiredRadioButton = function(status) {
        return function clickFilterPwdExpiredRadioButton(resolve, reject) {
            getFilterPwdExpiredRadioButton(status).then(
                function() {
                    expect(element).not.to.equal(undefined);
                    expect(element).not.to.equal(null);
                    element.trigger('click');
                    resolve();
                }).catch(reject);
        }
    };

    var verifyFilterPwdExpiredRadioButton = function(status) {
        return function clickFilterCheckboxPwdAgeExpired(resolve, reject) {
            getFilterPwdExpiredRadioButton(status).then(
                function() {
                    expect(element).not.to.equal(undefined);
                    expect(element).not.to.equal(null);
                    expect(element.getProperty('checked')).to.equal(checked);
                    resolve();
                }).catch(reject);
        }
    };

    var getFilterPwdExpiredRadioButton = function(status) {
        return new Model.waitForFilterPwdExpiredRadioButton(status);
    };

    var getFilterCredentialsRadioButton = function(status) {
        return Model.waitForFilterCredentialsRadioButton(status);
    }

    var getFilterFailedLoginsRadioButton = function(status) {
        return new Model.waitForFilterFailedLoginsRadioButton(status);
    }

    var clickFilterFailedLoginsRadioButton = function(status) {
        return function clickFilterFailedLoginsRadioButton(resolve, reject) {
            getFilterFailedLoginsRadioButton(status).then(
                function(element) {
                    checkDefinedElement(element);
                    element.trigger('click');
                    resolve();
                }).catch(reject);
        }
    }

    var verifyFilterFailedLoginsRadioButton = function(status, checked) {
        return function verifyFilterFailedLoginsRadioButton(resolve, reject) {
            getFilterFailedLoginsRadioButton(status).then(
                function(element) {
                    checkDefinedElement(element);
                    expect(element.getProperty('checked')).to.equal(checked);
                    resolve();
                }).catch(reject);
        }
    }

    var getFilterLogginedInRadioButton = function(status) {
        return new Model.waitForFilterLogginedInRadioButton(status);
    }

    var clickFilterLogginedInRadioButton = function(status) {
        return function clickFilterLogginedInRadioButton(resolve, reject) {
            getFilterLogginedInRadioButton(status).then(
                function(element) {
                    checkDefinedElement(element);
                    element.trigger('click');
                    resolve();
                }).catch(reject);
        }
    }

    var verifyFilterLogginedInRadioButton = function(status, checked) {
        return function verifyFilterLogginedInRadioButton(resolve, reject) {
            getFilterLogginedInRadioButton(status).then(
                function(element) {
                    checkDefinedElement(element);
                    expect(element.getProperty('checked')).to.equal(checked);
                    resolve();
                }).catch(reject);
        }
    }

    var clickFilterCredentialsRadioButton = function(status) {
        return function clickFilterCredentialsRadioButton(resolve, reject) {
            getFilterCredentialsRadioButton(status).then(
                function(element) {
                    checkDefinedElement(element);
                    element.trigger('click');
                    resolve();
                }).catch(reject);
        }
    }

    var verifyFilterCredentialsRadioButton = function(status, checked) {
        return function verifkFilterCredentialsRadioButton(resolve, reject) {
            getFilterCredentialsRadioButton(status).then(
                function(element) {
                    checkDefinedElement(element);
                    expect(element.getProperty('checked')).to.equal(checked);
                    resolve();
                }).catch(reject);
        }
    }


    var clickFilterStatusRadioButton = function(status) {
        return function clickFilterStatusRadioButton(resolve, reject) {
            getFilterStatusRadioButton(status).then(
                function(element) {
                    checkDefinedElement(element);
                    element.trigger('click');
                    resolve();
                }).catch(reject);
        }
    }
    
    var verifyFilterStatusRadioButton = function(status, checked) {
        return function verifyFilterStatusRadioButton(resolve, reject) {
            getFilterStatusRadioButton(status).then(
                function(element) {
                    checkDefinedElement(element);
                    expect(element.getProperty('checked')).to.equal(checked);
                    resolve();
                }).catch(reject);
        }
    }

    var clickFilterAuthModeRadioButton = function(authMode) {
        return function clickFilterAuthModeRadioButton(resolve, reject) {
            getFilterAuthModeRadioButton(authMode).then(
                function(element) {
                    checkDefinedElement(element);
                    element.trigger('click');
                    resolve();
                }).catch(reject);
        }
    }

    var verifyFilterAuthModeRadioButton = function(authMode, checked) {
        return function verifyFilterAuthModeRadioButton(resolve, reject) {
            getFilterAuthModeRadioButton(authMode).then(
                function(element) {
                    checkDefinedElement(element);
                    expect(element.getProperty('checked')).to.equal(checked);
                    resolve();
                }).catch(reject);
        }
    }

    var clickFilterLoginTime = function(status) {
        return function clickFilterLoginTime(resolve, reject) {
            getFilterLoginTimeRadioButton(status).then(
                function(element) {
                    checkDefinedElement(element);
                    element.trigger('click');
                    resolve();
                }).catch(reject);
        }
    }

    var verifyFilterLoginTime = function(status, checked) {
        return function waitForFilterLoginTime(resolve, reject) {
            getFilterLoginTimeRadioButton(status).then(
                function(element) {
                    checkDefinedElement(element);
                    expect(element.getProperty('checked')).to.equal(checked);
                    resolve();
                }).catch(reject);
        }
    }

    var clickFilterAccordionElement = function(_name) {
        return function clickFilterAccordionElement() {
            Model.clickFilterAccordionElement(_name);
        };
    };

    var clickFilterButtonClear = function() {
        return function clickFilterButtonClear(resolve, reject) {
            Model.clickFilterButtonClear().then(function(element){
                var button = element;
                checkDefinedElement(button);
                button.trigger('click');
                resolve();
            }).catch(reject);
        }
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

    var expandRow = function(row) {
        return function expandRow() {
            Model.expandRow(row);
        };
    };

    var checkRoleTypeAndTGNumber = function(row, type, tgNumber) {
        return function checkRoleTypeAndTGNumber(resolve, reject) {
             var expandableRow = row + 1;
             Model.tableRowContentList(expandableRow).then(function(tableRowDetails) {
                checkDefinedElement(tableRowDetails);

                var roleType =Model.getRoleType(tableRowDetails);
                checkDefinedElement(roleType);
                expect(roleType.getText().trim()).to.equal(type);

                var roleTGNumber =Model.getTGNumber(tableRowDetails);
                if ( tgNumber !== undefined ) {
                    checkDefinedElement(roleTGNumber);
                    expect(roleTGNumber.getText().trim().split(" ")[0]).to.equal(tgNumber);
                } else {
                    expect(roleTGNumber).to.be.undefined;
                }
                resolve();
            }).catch(reject);
        };
    };


     //////////////////////////////////////////////////////////////////////
    // USERMANAGEMENT - FILTER WIDGET VERIFICATIONS
    //////////////////////////////////////////////////////////////////////

    var verifyFilterPanelPresent = function() {
        return function verifyFilterPanelPresent(resolve, reject) {
            Model.verifyFilterPanelPresent().then(function(element){
                checkDefinedElement(element);
                resolve();
            }).catch(reject);
        };
    };

    var verifyFilterUserName = function(_text) {
        return function verifyFilterUserName(resolve, reject) {
            Model.filterInputSearchByUserName().then(function(element){
                checkDefinedElement(element);
                var _username = element.getValue();
                expect(_username).to.equal(_text);
                resolve();
            }).catch(reject);
        }
    };

    var verifyFilterName = function(_text) {
        return function verifyFilterName(resolve, reject) {
            Model.filterInputSearchByName().then(function(element){
                checkDefinedElement(element);
                var _name = element.getValue();
                expect(_name).to.equal(_text);
                resolve();
            }).catch(reject);
        }
    };

    var verifyFilterSurname = function(_text) {
        return function verifyFilterSurname(resolve, reject) {
            Model.filterInputSearchBySurname().then(function(element){
                checkDefinedElement(element);
                var _surname = element.getValue();
                expect(_surname).to.equal(_text);
                resolve();
            }).catch(reject);
        }
    };

    var verifyFilterDescription = function(_text) {
        return function verifyFilterDescription(resolve, reject) {
            Model.filterInputSearchByDescription().then(function(element){
                checkDefinedElement(element);
                var _name = element.getValue();
                expect(_name).to.equal(_text);
                resolve();
            }).catch(reject);
        }
    };

    var verifyFilterLoggedWithinDays = function(_text) {
        return function verifyFilterLoggedWithinDays(resolve, reject) {
            Model.filterInputSearchByLoggedWithin().then(function(element){
                checkDefinedElement(element);
                var _name = element.getValue();
                expect(_name).to.equal(_text);
                resolve();
            }).catch(reject);
        }
    };

    var verifyFilterCheckboxStatusDisabledChecked = function(_flag) {
        return function verifyFilterCheckboxStatusDisabledChecked() {
            var element = Model.filterCheckboxStatusDisabled();
            if (_flag === true) {
                expect(element.getProperty('checked')).to.equal(true)
            } else {
                expect(element.getProperty('checked')).to.equal(false)
            }
        }
    };

    var verifyFilterCheckboxCredentialStatusLoggedWithinChecked = function(_flag) {
        return function verifyFilterCheckboxCredentialStatusLoggedWithinChecked() {
            var element = Model.filterCheckboxCredentialStatusLoggedWithin();
            if (_flag === true) {
                expect(element.getProperty('checked')).to.equal(true)
            } else {
                expect(element.getProperty('checked')).to.equal(false)
            }
        }
    };

    var verifyFilterCheckboxCredentialStatusActive = function(_flag) {
        return function verifyFilterCheckboxCredentialStatusActive() {
            var element = Model.filterCheckboxCredentialStatusActive();
            if (_flag === true) {
                expect(element.getProperty('checked')).to.equal(true)
            } else {
                expect(element.getProperty('checked')).to.equal(false)
            }
        }
    };

    var verifyFilterCheckboxCredentialStatusInactive = function(_flag) {
        return function verifyFilterCheckboxCredentialStatusInactive() {
            var element = Model.filterCheckboxCredentialStatusInactive();
            if (_flag === true) {
                expect(element.getProperty('checked')).to.equal(true)
            } else {
                expect(element.getProperty('checked')).to.equal(false)
            }
        }
    };

    var verifyFilterCheckboxCurrentlyLoggedInYes = function(_flag) {
        return function verifyFilterCheckboxCurrentlyLoggedInYes() {
            var element = Model.filterCheckboxCurrentlyLoggedInYes();
            if (_flag === true) {
                expect(element.getProperty('checked')).to.equal(true)
            } else {
                expect(element.getProperty('checked')).to.equal(false)
            }
        }
    };

    var verifyFilterCheckboxCurrentlyLoggedInNo = function(_flag) {
        return function verifyFilterCheckboxCurrentlyLoggedInNo() {
            var element = Model.filterCheckboxCurrentlyLoggedInNo();
            if (_flag === true) {
                expect(element.getProperty('checked')).to.equal(true)
            } else {
                expect(element.getProperty('checked')).to.equal(false)
            }
        }
    };


    var clickFilterRolesNoRoleAssigned = function() {
        return function clickFilterRolesNoRoleAssigned(resolve, reject) {
            Model.waitForFilterRolesNoRoleAssigned().then(function(element) {
                checkDefinedElement(element);
                element.trigger('click');
                resolve();
            }).catch(reject);
        };
    };

    var clickFilterRolesClear = function() {
        return function clickFilterRolesClear(resolve, reject) {
            Model.waitForFilterRolesClear().then(function(element) {
                checkDefinedElement(element);
                element.trigger('click');
                resolve();
            }).catch(reject);
        };

    };

    var checkStatusFilterNotPresent = function() {
        return function checkStatusFilterNotPresent() {
            expect(Model.checkStatusFilterNotPresent()).to.equal(true);
        }
    };

    var checkAuthModeFilterNotPresent = function() {
        return function checkAuthModeFilterNotPresent() {
            expect(Model.checkAuthModeFilterNotPresent()).to.equal(true);
        }
    };

    var checkGeneralFiltersNotPresent = function() {
        return function checkGeneralFiltersNotPresent() {
            expect(Model.checkGeneralFiltersNotPresent()).to.equal(true);
        }
    };

    /////////////////////////////////////////////////////////////////////////
    //USER MANAGEMENT - PROFILE SUMMARY
    ////////////////////////////////////////////////////////////////////////

    var waitForProfileSummary = function() {
        return function waitForProfileSummary(resolve, reject) {
            Model.waitForProfileSummary(500)
                .then(function(element) {
                    expect(element.getText().trim()).to.equal("Profile Summary");
                    resolve();
                })
                .catch(reject);
        }

    };

    var waitForTerminateSessionsButton = function(){
        return function waitForTerminateSessionsButton(resolve, reject) {
            Model.waitForTerminateSessionsButton(500)
                .then(function(element) {
                    expect(element.getText().trim()).to.equal("Terminate Sessions");
                    resolve();
                })
                .catch(reject);
        }
    };

    var waitForEditProfileLink = function(){
        return function waitForEditProfileLink(resolve, reject) {
            Model.waitForEditProfileLink(500)
                .then(function(element) {
                    expect(element.getText().trim()).to.equal("Edit Profile");
                    resolve();
                })
                .catch(reject);
        }
    };

    var checkIfEditProfileLinkIsNotVisible = function() {
       return function checkIfEditProfileLinkIsNotVisible(resolve, reject) {
           Model.checkIfEditProfileLinkIsNotVisible().then(resolve).catch(reject);
       };
    };

    var waitForLoadRoles = function(){
        return function waitForLoadRoles(resolve, reject) {
            Model.waitForLoadRoles(500)
                .then(resolve)
                .catch(reject);
        }
    };

    var waitForLoadOdpProfiles = function(){
        return function waitForLoadOdpProfiles(resolve, reject) {
            Model.waitForLoadOdpProfiles(500)
                .then(resolve)
                .catch(reject);
        }
    };

    var checkRoleInProfileSummary = function(role) {
        return function checkRolesInProfileSummary(resolve, reject) {
            Model.getRoleProfileSummary(role)
                .then(resolve)
                .catch(reject);
        }
    };

    var checkOdpProfilesInProfileSummary = function() {
        return function checkOdpProfilesInProfileSummary(resolve, reject) {
            Model.getOdpProfilesProfileSummary()
                .then(resolve)
                .catch(reject);
        }
    };

    var checkNoOdpProfilesInProfileSummary = function() {
        return function checkOdpProfilesInProfileSummary(resolve, reject) {
            Model.waitForNoOdpProfiles()
                .then(resolve)
                .catch(reject);
        }
    };


    var checkRoleNameInProfileSummary = function(role) {
        return function checkRoleNameInProfileSummary(resolve, reject) {
            Model.getRoleNameProfileSummary(role)
                .then(resolve)
                .catch(reject);
        }
    };

    var checkApplicationNameAndProfileNameInProfileSummary = function(applicationName, profileName) {
        return function checkApplicationNameAndProfileNameInProfileSummary(resolve, reject) {
            Model.getApplicationNameAndProfileNameProfileSummary(applicationName, profileName);
            resolve();
        }
    };

    var checkProfileAssignRole = function(label) {
        return function checkProfileAssignRole(resolve, reject) {
            Model.getProfileAssignRole(label)
                .then(function(element) {
                    expect(element.getText().trim()).to.equal(label);
                    resolve();
                })
                .catch(reject);
        }
    };

    var checkProfileAssignOdpProfiles = function(label) {
        return function checkProfileAssignOdpProfiles(resolve, reject) {
            Model.getProfileAssignOdpProfiles(label)
                .then(function(element) {
                    expect(element.getText().trim()).to.equal(label);
                    resolve();
                })
                .catch(reject);
        }
    };



    var checkUsernameInProfileSummary = function(username) {
        return function checkUsernameInProfileSummary(resolve, reject) {
            Model.getUsernameInProfileSummary(username)
                .then(function(element) {
                    expect(element.getText().trim()).to.equal(username);
                    resolve();
                })
                .catch(reject);
        }
    };

    var checkENMTargetGroupsInProfileSummary = function(tgName) {
        return function checkENMTargetGroupsInProfileSummary(resolve, reject) {
            Model.getENMServiceGroupProfileSummary()
                .then(function(element) {
                    expect(element.getText().trim()).to.equal(tgName);
                    resolve();
                })
                .catch(reject);
        }
    };

    /////////////////////////////////////////////////////////////////////////
    //USER MANAGEMENT - DELETE USERS - CONFIRMATION DIALOG
    ////////////////////////////////////////////////////////////////////////
    var verifyConfirmationDeleteUsersDialogPresent = function() {
        return function verifyConfirmationDeleteUsersDialogPresent() {
            Model.verifyConfirmationDeleteUsersDialogPresent();
        }
    };

    var verifyConfirmationDeleteUsersDialogInfo = function(_text) {
        return function verifyConfirmationDeleteUsersDialogInfo() {
            Model.verifyConfirmationDeleteUsersDialogInfo(_text);
        }
    };

    var verifyConfirmationDeleteUsersDialogStatusTotal = function(_value) {
        return function verifyConfirmationDeleteUsersDialogStatusTotal() {
            Model.verifyConfirmationDeleteUsersDialogStatusTotal(_value);
        }
    };

    var verifyConfirmationDeleteUsersDialogStatusActive = function(_value) {
        return function verifyConfirmationDeleteUsersDialogStatusActive() {
            Model.verifyConfirmationDeleteUsersDialogStatusActive(_value);
        }
    };

    var verifyConfirmationDeleteUsersDialogStatusInactive = function(_value) {
        return function verifyConfirmationDeleteUsersDialogStatusInactive() {
            Model.verifyConfirmationDeleteUsersDialogStatusInactive(_value);
        }
    };

    var clickConfirmationDeleteUsersDialogButton = function(_buttonName) {
        return function clickConfirmationDeleteUsersDialogButton() {
            var _dialogButtons = Model.confirmationDeleteUsersDialogButtons();
            var _requestedButton;
            _dialogButtons.forEach(function(_button) {
                if (_button.getText() === _buttonName) {
                    _requestedButton = _button;
                }
            });

            if (_requestedButton) {
                _requestedButton.trigger("click");
            } else {
                throw "Confirmation Delete Users Dialog button not found: " + _buttonName;
            }
        };
    };

    var verifyConfirmationDeleteUsersDialogTableHeader = function(_userHeader, _resultHeader) {
        return function verifyConfirmationDeleteUsersDialogTableHeader() {
            Model.verifyConfirmationDeleteUsersDialogTableHeader(_userHeader, _resultHeader);
        };
    };

    var verifyConfirmationDeleteUsersDialogTableContents = function(_expectedData) {
        return function verifyConfirmationDeleteUsersDialogTableContents() {
            for (var _rowIndex = 0; _rowIndex < _expectedData.length; _rowIndex++) {
                var _realData = Model.dataForRow(_rowIndex + 1, _expectedData[_rowIndex].columns.length);

                for (var _columnIndex = 0; _columnIndex < _expectedData[_rowIndex].columns.length; _columnIndex++) {
                    expect(_realData[_columnIndex].trim()).to.equal(_expectedData[_rowIndex].columns[_columnIndex]);
                }
            }
        };
    };

    var waitForConfirmationDeleteUsersDialogStatusTotal = function(){
        return function waitForConfirmationDeleteUsersDialogStatusTotal(resolve, reject) {
            Model.waitForConfirmationDeleteUsersDialogStatusTotal(5000)
                .then(resolve)
                .catch(reject);
        }
    };

    var waitForConfirmationDeleteUsersDialogStatusActive = function(resolve, reject) {
        return function waitForConfirmationDeleteUsersDialogStatusActive(resolve, reject) {
            Model.waitForConfirmationDeleteUsersDialogStatusActive(5000)
                .then(resolve)
                .catch(reject);
        }
    };

    var waitForConfirmationDeleteUsersDialogStatusInactive = function(resolve, reject) {
        return function waitForConfirmationDeleteUsersDialogStatusInactive(resolve, reject) {
            Model.waitForConfirmationDeleteUsersDialogStatusInactive(5000)
                .then(resolve)
                .catch(reject);
        }
    };

    //////////////////USERMANAGEMENT - ACCESS DENIED////////////////////////////

    var verifyAccessDeniedDialogPresent = function() {
        return function verifyAccessDeniedDialogPresent() {
            Model.verifyAccessDeniedDialog();
        }
    };

    var clickOkAccessDeniedDialogButton = function() {
        return function clickOkAccessDeniedDialogButton() {
            Model.clickOkAccessDeniedDialogButton();
        }
    };


    var getSavedUserHash = function getSavedUserHash(userName) {
       return function() {
           Browser.gotoHash('usermanagement?savedUser=' + userName );
       };
    };







    //TODO: VERIFICATION OF ACCORDION IS NOT FINISHED DUE TO REMOVE FROM SCOPE

    // Steps.verifyFilterAccordionElementisChecked('system_enabled_1'),
    // Steps.verifyFilterAcordionElementisChecked('system_disabled_1'),
    // Steps.verifyFilterAcordionElementisChecked('system_nonassignable_1'),

    // var verifyFilterAccordionElementChecked = function(_name) {
    //     return function verifyFilterAccordionElementChecked() {
    //         var element = Model.filterAccordionElement(_name);

    //         console.log('verifyFilterAccordionElementisChecked');

    //         for (var prop in element) {
    //             console.log(element.getProperty('checked'));
    //         }

    //         // console.log(element.getProperty('checked'));

    //         // if ( element.getProperty('checked') ) {
    //         //     console.log("nice");
    //         // } else {
    //         //     console.log("nie");
    //         // }

    //     };
    // };

    return {

        // USERMANAGEMENT ACTIONS
        clickUsermanagementButtonFilters: clickUsermanagementButtonFilters,
        verifySuccessNotification: verifySuccessNotification,
        verifyErrorNotification: verifyErrorNotification,
        verifySummaryDialogText: verifySummaryDialogText,
        closeNotification: closeNotification,
        clickOkSummaryDialog: clickOkSummaryDialog,
        // USERMANAGEMENT - FILTER WIDGET ACTIONS
        verifyFilterPanelPresent: verifyFilterPanelPresent,
        setFilterUserName: setFilterUserName,
        setFilterName: setFilterName,
        setFilterSurname: setFilterSurname,
        setFilterDescription: setFilterDescription,
        setFilterLoggedWithinDays: setFilterLoggedWithinDays,

        //FILTER - STATUS
        clickFilterStatusRadioButton: clickFilterStatusRadioButton,
        verifyFilterStatusRadioButton: verifyFilterStatusRadioButton,

        //FILTER - AUTH MODE
        clickFilterAuthModeRadioButton: clickFilterAuthModeRadioButton,
        verifyFilterAuthModeRadioButton: verifyFilterAuthModeRadioButton,

        //FILTER - LOGIN
        clickFilterLoginTime: clickFilterLoginTime,
        verifyFilterLoginTime: verifyFilterLoginTime,

        //FILTER - FAILED LOGINS
        clickFilterFailedLoginsRadioButton: clickFilterFailedLoginsRadioButton,
        verifyFilterFailedLoginsRadioButton: verifyFilterFailedLoginsRadioButton,

        //FILTER - CREDENTIALS
        clickFilterCredentialsRadioButton: clickFilterCredentialsRadioButton,
        verifyFilterCredentialsRadioButton: verifyFilterCredentialsRadioButton,

        //FILTER - CURRENTLY LOGGINED
        clickFilterLogginedInRadioButton: clickFilterLogginedInRadioButton,
        verifyFilterLogginedInRadioButton: verifyFilterLogginedInRadioButton,

        //FILTER - PASSWORD EXPIRED
        clickFilterPwdExpiredRadioButton: clickFilterPwdExpiredRadioButton,
        verifyFilterPwdExpiredRadioButton: verifyFilterPwdExpiredRadioButton,

        clickFilterAccordionElement: clickFilterAccordionElement,
        clickFilterButtonApply: clickFilterButtonApply,
        clickFilterButtonClear: clickFilterButtonClear,
        clickFilterButtonClose: clickFilterButtonClose,
        expandRow: expandRow,
        checkRoleTypeAndTGNumber: checkRoleTypeAndTGNumber,

        // USERMANAGEMENT - PROFILE SUMMARY
        waitForLoadRoles: waitForLoadRoles,
        waitForLoadOdpProfiles: waitForLoadOdpProfiles,
        checkRoleInProfileSummary: checkRoleInProfileSummary,
        checkRoleNameInProfileSummary: checkRoleNameInProfileSummary,
        checkProfileAssignRole: checkProfileAssignRole,
        checkUsernameInProfileSummary: checkUsernameInProfileSummary,
        checkENMTargetGroupsInProfileSummary: checkENMTargetGroupsInProfileSummary,
        waitForProfileSummary: waitForProfileSummary,
        waitForTerminateSessionsButton: waitForTerminateSessionsButton,
        waitForEditProfileLink: waitForEditProfileLink,
        checkIfEditProfileLinkIsNotVisible: checkIfEditProfileLinkIsNotVisible,
        checkOdpProfilesInProfileSummary: checkOdpProfilesInProfileSummary,
        checkNoOdpProfilesInProfileSummary: checkNoOdpProfilesInProfileSummary,
        checkProfileAssignOdpProfiles: checkProfileAssignOdpProfiles,
        checkApplicationNameAndProfileNameInProfileSummary: checkApplicationNameAndProfileNameInProfileSummary,
        clickCloseProfileSummary: clickCloseProfileSummary,

        // USERMANAGEMENT - FILTER WIDGET VERIFICATIONS
        verifyFilterUserName: verifyFilterUserName,
        verifyFilterName: verifyFilterName,
        verifyFilterSurname: verifyFilterSurname,
        verifyFilterDescription: verifyFilterDescription,
        verifyFilterLoggedWithinDays: verifyFilterLoggedWithinDays,
        verifyFilterLoginTime: verifyFilterLoginTime,
        verifyFilterCheckboxCredentialStatusLoggedWithinChecked: verifyFilterCheckboxCredentialStatusLoggedWithinChecked,
        verifyFilterCheckboxCredentialStatusActive: verifyFilterCheckboxCredentialStatusActive,
        verifyFilterCheckboxCredentialStatusInactive: verifyFilterCheckboxCredentialStatusInactive,
        verifyFilterCheckboxCurrentlyLoggedInYes: verifyFilterCheckboxCurrentlyLoggedInYes,
        verifyFilterCheckboxCurrentlyLoggedInNo: verifyFilterCheckboxCurrentlyLoggedInNo,
        // verifyFilterAccordionElementChecked: verifyFilterAccordionElementChecked,
        clickFilterRolesNoRoleAssigned: clickFilterRolesNoRoleAssigned,
        clickFilterRolesClear: clickFilterRolesClear,
        setFilterRoleName: setFilterRoleName,
        checkStatusFilterNotPresent: checkStatusFilterNotPresent,
        checkAuthModeFilterNotPresent: checkAuthModeFilterNotPresent,
        checkGeneralFiltersNotPresent: checkGeneralFiltersNotPresent,

        //USER MANAGEMENT - DELETE USERS - CONFIRMATION DIALOG
        verifyConfirmationDeleteUsersDialogPresent: verifyConfirmationDeleteUsersDialogPresent,
        verifyConfirmationDeleteUsersDialogInfo: verifyConfirmationDeleteUsersDialogInfo,
        verifyConfirmationDeleteUsersDialogStatusTotal: verifyConfirmationDeleteUsersDialogStatusTotal,
        verifyConfirmationDeleteUsersDialogStatusActive: verifyConfirmationDeleteUsersDialogStatusActive,
        verifyConfirmationDeleteUsersDialogStatusInactive: verifyConfirmationDeleteUsersDialogStatusInactive,
        clickConfirmationDeleteUsersDialogButton: clickConfirmationDeleteUsersDialogButton,
        verifyConfirmationDeleteUsersDialogTableHeader: verifyConfirmationDeleteUsersDialogTableHeader,
        verifyConfirmationDeleteUsersDialogTableContents: verifyConfirmationDeleteUsersDialogTableContents,
        waitForConfirmationDeleteUsersDialogStatusTotal: waitForConfirmationDeleteUsersDialogStatusTotal,
        waitForConfirmationDeleteUsersDialogStatusActive: waitForConfirmationDeleteUsersDialogStatusActive,
        waitForConfirmationDeleteUsersDialogStatusInactive: waitForConfirmationDeleteUsersDialogStatusInactive,

        //USER MANAGEMENT - ACCESS DENIED
        verifyAccessDeniedDialogPresent: verifyAccessDeniedDialogPresent,
        clickOkAccessDeniedDialogButton: clickOkAccessDeniedDialogButton,
        getSavedUserHash: getSavedUserHash
    };
});
