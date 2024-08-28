define([
    'jscore/core',
    './Model',
    'identitymgmtlib/Utils'
], function(core, Model, Utils) {

    var getModifyRolesCheckbox = function() {
       return Model.waitForModifyRolesCheckbox(500);
    };

   var getRolesSelectBoxButton = function() {
       return Model.waitForRolesSelectBoxButton(500);
   };

   var getSelectBoxOption = function(optionName, timeout) {
       return Model.waitForRolesSelectBoxOption(optionName, timeout || 500);
   };

   var getRolesTableWidget = function() {
       return Model.waitForRolesTableWidget(500);
   };

   var getAllRolesCount = function() {
       return Model.waitForAllRolesCount(500);
   };

   var getAssignedRolesCount = function() {
       return Model.waitForAssignedRolesCount(500);
   };

   var getRoleTickButton = function(roleName, timeout) {
       return Model.waitForRoleTickButton(roleName, timeout || 500);
   };

   var getTargetGroupButton = function(roleName, timeout) {
       return Model.waitForTargetGroupButton(roleName, timeout || 500);
   };

   var selectOptionInRolesSelectBox = function(optionName) {
       return function(resolve, reject) {
           getRolesSelectBoxButton(500).then(function(element) {
                   var selectBox = element;
                   checkDefinedElement(selectBox);
                   selectBox.trigger('click');
                   getSelectBoxOption(optionName, 500).then(function(element) {
                       var optionDiv = element;
                       checkDefinedElement(optionDiv);
                       optionDiv.trigger('click');
                       resolve();
                   }).catch(reject)
               })
               .catch(reject);
       }
   };

   var clickRoleTickButton = function(roleName) {
       return function(resolve, reject) {
           getRoleTickButton(roleName, 500).then(function(element) {
                   var button = element;
                   checkDefinedElement(button);
                   button.trigger('click');
                   resolve();
               })
               .catch(reject);
       }
   };

   var verifyAssignedRolesCount = function(value) {
       return function(resolve, reject) {
           getAssignedRolesCount().then(function(element) {
                   var span = element;
                   checkDefinedElement(span);
                   var text = span.getText();
                   verifyResultsValue(span, value);
                   resolve();
               })
               .catch(reject);
       }
   };

   var verifyAllRolesCount = function(value) {
       return function(resolve, reject) {
           getAllRolesCount().then(function(element) {
                   var span = element;
                   checkDefinedElement(span);
                   var text = span.getText();
                   verifyResultsValue(span, value);
                   resolve();
               })
               .catch(reject);
       }
   };


    var checkRolesTableVisibility = function(visible) {
       return function(resolve, reject) {
           getRolesTableWidget().then(function(element) {
                   var table = element;
                   checkDefinedElement(table);
                   var hidden = table.getAttribute('class').indexOf('_hide') > -1;
                   expect(hidden).to.equal(!visible);
                   resolve();
              })
             .catch(reject);
      }
    };

    var clickRolesCheckbox = function() {
        return function(resolve, reject) {
            getModifyRolesCheckbox().then(function(element) {
                  var checkbox = element;
                  checkDefinedElement(checkbox);
                  checkbox.trigger('click');
                  resolve();
              })
              .catch(reject);
        }
    };

    var checkRolesSelectBoxStatus = function(disabled) {
        return function(resolve, reject) {
            getRolesSelectBoxButton().then(function(element) {
                  var button = element;
                  checkDefinedElement(button);
                  var hasDisabledClass = button.getAttribute('disabled');
                  expect(hasDisabledClass).to.equal(disabled === 'disabled' ? 'disabled' : undefined);
                  resolve();
              })
              .catch(reject);
        }
    };

    var checkDefinedElement = function(element) {
        expect(element).not.to.equal(null);
        expect(element).not.to.equal(undefined);
    };

    var getSummaryMessages = function() {
        return Model.waitForSummaryMessages(500);
    };

    var getNextButton = function() {
        return Model.waitForNextButton(500);
    };

    var getFinishButton = function() {
        return Model.waitForFinishButton(500);
    };

    var getPreviousButton = function() {
        return Model.waitForPreviousButton(500);
    };

    var getModifyStatusCheckbox = function() {
        return Model.waitForModifyStatusCheckbox(500);
    };

    var getModifyDescriptionCheckbox = function() {
        return Model.waitForModifyDescriptionCheckbox(500);
    };

    var getStatusSwitcher = function() {
        return Model.waitForStatusSwitcher(1500);
    };
    var getDescriptionTextArea = function() {
        return Model.waitForDescriptionTextArea(1500);
    };
    var getTotalCount = function() {
        return Model.waitForTotalCount(500);
    };

    var getSuccessCount = function() {
        return Model.waitForSuccessCount(500);
    };

    var getFailureCount = function() {
        return Model.waitForFailureCount(500);
    };

    var getResultTable = function() {
        return Model.waitForResultTable(500);
    };

    var getAllRoleLink = function() {
        return Model.waitForAllRolesLink(500);
    };

    var getNoneRoleLink = function() {
        return Model.waitForNoneRolesLink(500);
    };

    var getPwdAgeingArea = function() {
      return Model.waitForPwdAgeingArea(500);
    };

    var getModifyPwdAgeingCheckbox = function() {
        return Model.waitForModifyPwdAgeingCheckbox(500);
    };

    var getAuthModeDropdown = function() {
      return Model.waitForAuthModeDropdown(500);
    };

    var getModifyAuthModeCheckbox = function() {
        return Model.waitForModifyAuthModeCheckbox(500);
    };


    var verifyTableData = function(data) {
        return function(resolve, reject) {
            getResultTable().then(function(element) {
                    var table = element;
                    checkDefinedElement(table);
                    var rows = element.findAll('.ebTableRow');
                    rows.forEach(function(row, index) {
                        if (index !== 0) {
                            var cells = row.findAll('td');
                            var username = cells[0].getText().trim();
                            var result = cells[3].find('span').getText().trim();
                            var userExist = data.some(function(user) {
                                if (user.username === username) {
                                    expect(result).to.equal(user.success ? 'Successful' : Utils.getErrorMessage('0').defaultHttpMessage);
                                    return true;
                                } else {
                                    return false;
                                }
                            })
                            expect(userExist).to.equal(true);
                        }
                    })
                    resolve();
                })
                .catch(reject);
        }
    };

    var checkNextButtonState = function(disabled) {
        return function(resolve, reject) {
            getNextButton().then(function(element) {
                    var button = element;
                    checkDefinedElement(button);
                    expect(button.getAttribute('disabled')).to.equal(disabled === 'disabled' ? 'disabled' : undefined);
                    resolve();
                })
                .catch(reject);
        }
    };

    var checkFinishButtonState = function(disabled) {
        return function(resolve, reject) {
            getFinishButton().then(function(element) {
                    var button = element;
                    checkDefinedElement(button);
                    expect(button.getAttribute('disabled')).to.equal(disabled === 'disabled' ? 'disabled' : undefined);
                    resolve();
                })
                .catch(reject);
        }
    };

    var checkSummaryMessage = function(options, exist) {
        exist = typeof exist === 'boolean' ? exist : true;
        var value = options.value || '';
        var message = options.message;
        var iconClass = options.icon;
        var messageWithValue = Utils.printf(message,value);
        return function() {
            var elements = getSummaryMessages();
            checkDefinedElement(elements);
            var messageIndex;
            var messageExist = elements.some(function(element, index) {
                messageIndex = index;
                return element.getText().trim().indexOf(messageWithValue.trim()) > -1
            });
            expect(messageExist).to.equal(exist);
            //if message not exist test will stop here and will not check the icon
            if (exist) {
                var icon = elements[messageIndex].find('i');

                var hasIcon = icon.getAttribute('class').indexOf(iconClass) > -1;
                expect(hasIcon).to.equal(true);
            }
        }
    };

    var verifyResultsValue = function(element, value) {
        value = '(' + value + ')';
        checkDefinedElement(element);
        var elementValue = element.getText().trim();
        expect(elementValue.indexOf(value) > -1).to.equal(true);
    }

    var verifyTotalCount = function(value) {
        return function(resolve, reject) {
            getTotalCount().then(function(element) {
                    verifyResultsValue(element, value);
                    resolve();
                })
                .catch(reject);
        }
    };

    var verifySuccessCount = function(value) {
        return function(resolve, reject) {
            getSuccessCount().then(function(element) {
                    verifyResultsValue(element, value);
                    resolve();
                })
                .catch(reject);
        }
    };

    var verifyFailureCount = function(value) {
        return function(resolve, reject) {
            getFailureCount().then(function(element) {
                    verifyResultsValue(element, value);
                    resolve();
                })
                .catch(reject);
        }
    };

    var checkStatusSwitcherStatus = function(disabled) {
        return function(resolve, reject) {
            getStatusSwitcher().then(function(element) {
                    var container = element;
                    checkDefinedElement(container);
                    var hasDisabledClass = container.getAttribute('class').indexOf('ebSwitcher_disabled') > -1;
                    expect(hasDisabledClass).to.equal(disabled === 'disabled' ? true : false);
                    resolve();
                })
                .catch(reject);
        }
    };

    var checkDescriptionStatus = function(disabled) {
        return function(resolve, reject) {
            getDescriptionTextArea().then(function(element) {
                    //var container = element;
                    var container = element.find('.ebInput');
                    checkDefinedElement(container);
                    var hasDisabledClass = container.getAttribute('disabled') ? true : false ;
                    expect(hasDisabledClass).to.equal(disabled === 'disabled' ? true : false);
                    resolve();
                })
                .catch(reject);
        }
    };

    var clickStatusSwitcher = function(state) {
        return function(resolve, reject) {
            getStatusSwitcher().then(function(element) {
                    var switcher = element.find('.ebSwitcher-body');
                    checkDefinedElement(switcher);
                    switcher.trigger('click');
                    resolve();
                })
                .catch(reject);
        }
    };

    var fillDescription = function(description) {
        return function(resolve, reject) {
            getDescriptionTextArea().then(function(element) {
                    var textArea = element.find('.ebInput');
                    checkDefinedElement(textArea);
                    textArea.setText(description);
                    textArea.trigger('input');
                    resolve();
                })
                .catch(reject);
        }
    };

    var clickModifyStatusCheckbox = function() {
        return function(resolve, reject) {
            getModifyStatusCheckbox().then(function(element) {
                    var checkbox = element;
                    checkDefinedElement(checkbox);
                    checkbox.trigger('click');
                    resolve();
                })
                .catch(reject);
        }
    };

    var clickModifyDescriptionCheckbox = function() {
        return function(resolve, reject) {
            getModifyDescriptionCheckbox().then(function(element) {
                    var checkbox = element;
                    checkDefinedElement(checkbox);
                    checkbox.trigger('click');
                    resolve();
                })
                .catch(reject);
        }
    };

    var clickNextButton = function() {
        return function(resolve, reject) {
            getNextButton().then(function(element) {
                    var button = element;
                    checkDefinedElement(button);
                    button.trigger('click');
                    resolve();
                })
                .catch(reject);
        }
    };

    var clickPreviousButton = function() {
        return function(resolve, reject) {
            getPreviousButton().then(function(element) {
                    var button = element;
                    checkDefinedElement(button);
                    button.trigger('click');
                    resolve();
                })
                .catch(reject);
        }
    };

    var checkTargetGroupButtonEnabled = function(roleName,enabled) {
        return function(resolve, reject) {
           getTargetGroupButton(roleName, 500).then(function(element) {
                   checkDefinedElement(element);

                   var button = element.find('.ebBtn');
                   var hasDisabledClass = button.getAttribute('disabled');
                   expect(hasDisabledClass).to.equal(enabled ? undefined : 'disabled');
                   resolve();
               })
               .catch(reject);
       }
    };

    var clickAllRolesLink = function() {
        return function(resolve, reject) {
            getAllRoleLink().then(function(element) {
                var button = element;
                checkDefinedElement(button);
                button.trigger('click');
                resolve();
            })
            .catch(reject);
        }
    };

    var clickNoneRolesLink = function() {
        return function(resolve, reject) {
            getNoneRoleLink().then(function(element) {
                var button = element;
                checkDefinedElement(button);
                button.trigger('click');
                resolve();
            })
            .catch(reject);
        }
    };

    var checkPwdAgeingStatus = function(disabled) {
      return function(resolve, reject) {
        getPwdAgeingArea().then(function(element) {
          //var container = element;
          var container = element.find('.ebRadioBtn');
          checkDefinedElement(container);
          var hasDisabledClass = container.getAttribute('disabled') ? true : false ;
          expect(hasDisabledClass).to.equal(disabled === 'disabled' ? true : false);
          resolve();
        })
        .catch(reject);
        }
    };

    var clickModifyPwdAgeingCheckbox = function() {
        return function(resolve, reject) {
            getModifyPwdAgeingCheckbox().then(function(element) {
                    var checkbox = element;
                    checkDefinedElement(checkbox);
                    checkbox.trigger('click');
                    resolve();
                })
                .catch(reject);
        }
    };

    var checkAuthModeStatus = function(disabled) {
      return function(resolve, reject) {
          getAuthModeDropdown().then(function(element) {
            var container = element;
            checkDefinedElement(container);
            var hasDisabledClass = container.getAttribute('class').indexOf('ebDropdown_disabled') > -1;
            expect(hasDisabledClass).to.equal(disabled === 'disabled' ? true : false);
            resolve();
        })
        .catch(reject);
        }
    };


    var clickModifyAuthModeCheckbox = function() {
        return function(resolve, reject) {
            getModifyAuthModeCheckbox().then(function(element) {
                    var checkbox = element;
                    checkDefinedElement(checkbox);
                    checkbox.trigger('click');
                    resolve();
                })
                .catch(reject);
        }
    };



    return {
        checkNextButtonState: checkNextButtonState,
        checkFinishButtonState: checkFinishButtonState,
        clickNextButton: clickNextButton,
        clickPreviousButton: clickPreviousButton,
        clickModifyStatusCheckbox: clickModifyStatusCheckbox,
        clickModifyDescriptionCheckbox: clickModifyDescriptionCheckbox,
        checkStatusSwitcherStatus: checkStatusSwitcherStatus,
        checkDescriptionStatus: checkDescriptionStatus,
        clickStatusSwitcher: clickStatusSwitcher,
        fillDescription: fillDescription,
        checkSummaryMessage: checkSummaryMessage,
        verifyTotalCount: verifyTotalCount,
        verifySuccessCount: verifySuccessCount,
        verifyFailureCount: verifyFailureCount,
        verifyTableData: verifyTableData,
        clickRolesCheckbox: clickRolesCheckbox,
        checkRolesSelectBoxStatus: checkRolesSelectBoxStatus,
        checkRolesTableVisibility: checkRolesTableVisibility,
        verifyAllRolesCount: verifyAllRolesCount,
        verifyAssignedRolesCount: verifyAssignedRolesCount,
        checkTargetGroupButtonEnabled:checkTargetGroupButtonEnabled,
        clickRoleTickButton: clickRoleTickButton,
        selectOptionInRolesSelectBox: selectOptionInRolesSelectBox,
        clickAllRolesLink: clickAllRolesLink,
        clickNoneRolesLink: clickNoneRolesLink,
        checkPwdAgeingStatus: checkPwdAgeingStatus,
        clickModifyPwdAgeingCheckbox: clickModifyPwdAgeingCheckbox,
        checkAuthModeStatus: checkAuthModeStatus,
        clickModifyAuthModeCheckbox: clickModifyAuthModeCheckbox
    };

});
