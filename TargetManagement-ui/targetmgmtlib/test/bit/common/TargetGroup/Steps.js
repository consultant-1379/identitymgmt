define([
    'jscore/core',
    'scopingpanel/ScopingPanel',
    'test/bit/lib/Browser',
    './Model'
], function(core, ScopingPanel, Browser, Model) {

    var checkDefinedElement = function(element) {
        expect(element).not.to.equal(null);
        expect(element).not.to.equal(undefined);
    };

    var sleep = function(timeout) {
        return function sleep(resolve) {
            setTimeout(resolve, timeout);
        };
    };

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

    var onResume = function(_app) {
        return function onResume() {
            Model.onResume(_app);
        };
    };

    var saveCreateTargetGroup = function() {
        return function saveCreateTargetGroup() {
            Model.saveCreateTargetGroup();
        };
    };

    var clickOnCancelButton = function() {
        return function clickOnCancelButton() {
            Model.clickOnCancelButton();
        };
    };

    var getNameValidatorError = function(_text) {
        return Model.getNameValidatorField(_text,10000);
        };

    var verifyNameError = function(_text) {
        return function(resolve, reject) {
            getNameValidatorError(_text).then(function(element) {
                expect(element).not.to.equal(null);
                expect(element).not.to.equal(undefined);
                expect(element.getText().trim()).to.equal(_text);
                resolve();
            })
            .catch(reject);
        }
    };

    var verifyTargets = function(_targetName) {
        return function(resolve, reject) {
            Model.verifyTargets(_targetName).then(function(element) {
                resolve();
            }).catch(reject);
        }
    };

    var verifyInlineMessage = function(_message) {
        return function(resolve, reject) {
            Model.verifyInlineMessage(_message).then(function(element) {
                resolve();
            }).catch(reject);
        }
    };

    var putFilterTargetName = function(_targetname) {
        return function putFilterTargetName() {
            Model.putFilterTargetName(_targetname);
        };
    };

    var putFilterTargetType = function(_targettype) {
        return function putFilterTargetType() {
            Model.putFilterTargetType(_targettype);
        };
    };

    var getDescriptionValidatorError = function(_text) {
        return Model.getDescriptionValidatorField(_text,10000);
        };

    var verifyDescriptionError = function(_text) {
        return function(resolve, reject) {
            getDescriptionValidatorError(_text).then(function(element) {
                expect(element).not.to.equal(null);
                expect(element).not.to.equal(undefined);
                expect(element.getText().trim()).to.equal(_text);
                resolve();
            })
        .catch(reject);
        }
    };

    var getFilterTable = function() {
        return Model.tableRows();
    };

    var clickFilterSelectedByName = function(targetName, columnNumber) {
        return function clickFilterSelectedByName() {
            var rows = getFilterTable();
            checkDefinedElement(rows);
            var resultExist = rows.some(function(row, index) {

                var cells = row.findAll('td');
                var checkbox = row.find('input.ebCheckbox');
                var result = cells[columnNumber-1].getText().trim();
                checkDefinedElement(checkbox);
                checkDefinedElement(result);
                if( result === targetName) {
                    checkbox.trigger('click');
                    return true;
                }else{
                    false;
                    }
            });
            if( !resultExist ) {
                 throw "Row not selected for item: " + targetName + " in column " + columnNumber;
            }
        }

    };

    var clickOnRemoveButton = function() {
        return function clickOnRemoveButton() {
            Model.clickOnRemoveButton();
        };
    };

    var verifyTargetsNotInList = function(targetName, columnNumber) {
        return function verifyTargetsNotInList() {
            var rows = getFilterTable();
            checkDefinedElement(rows);
            var resultExist = rows.some(function(row) {
            var cells = row.findAll('td');
            var result = cells[columnNumber-1].getText().trim();
                if( result === targetName) {
                    return false;
                }else{
                    true;
                    }
            });

        }

    };

    var loadTopologyData = function(eventBus, topologyData) {
        return function loadAddTopologyData() {
            eventBus.publish(ScopingPanel.events.SELECT, topologyData);
        };
    };

    return {
        sleep: sleep,

        //FORM DATA/ACTIONS
        setName: setName,
        setDescription: setDescription,
        onResume: onResume,
        saveCreateTargetGroup: saveCreateTargetGroup,
        clickOnCancelButton: clickOnCancelButton,
        clickFilterSelectedByName: clickFilterSelectedByName,
        clickOnRemoveButton: clickOnRemoveButton,
        putFilterTargetName: putFilterTargetName,
        putFilterTargetType: putFilterTargetType,
        loadTopologyData: loadTopologyData,


        //VALIDATOR ACTIONS
        verifyNameValidatorError: verifyNameError,
        verifyDescriptionValidatorError: verifyDescriptionError,
        verifyTargets: verifyTargets,
        verifyTargetsNotInList: verifyTargetsNotInList,
        verifyInlineMessage: verifyInlineMessage
    };
});
