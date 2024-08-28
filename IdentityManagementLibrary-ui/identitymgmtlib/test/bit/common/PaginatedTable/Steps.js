define([
    'jscore/core',
    './Model',
    'identitymgmtlib/Utils',
    'test/bit/lib/Browser'
], function(core, Model, Utils, Browser) {


 /*PROVAPROVAPROVAPROVA*/
 /*PROVAPROVAPROVAPROVA*/
 /*PROVAPROVAPROVAPROVA*/
 /*PROVAPROVAPROVAPROVA*/
 /*PROVAPROVAPROVAPROVA*/

    var checkDefinedElement = function(element) {
        expect(element).not.to.equal(null);
        expect(element).not.to.equal(undefined);
    };
    //////////////////////////////////////////////////////////////////////
    // PAGINATED TABLE ACTIONS
    //////////////////////////////////////////////////////////////////////

    var sleep = function(timeout) {
        return function sleep(resolve) {
            setTimeout(resolve, timeout);
        };
    };
    var goToHash = function goToHash() {
       return function() {
           Browser.gotoHash('usermanagement');
       };
    };

    var waitForEventsPropagation = function() {
        return function waitForEventsPropagation(resolve) {
            setTimeout(resolve, 50);
        };
    };

    var waitForTableDataIsLoaded = function(){
        return function waitForTableDataIsLoaded(resolve, reject) {
            Model.waitForTableDataIsLoaded(2000)
                .then(resolve)
                .catch(reject);
        }
    };

    var waitForTableDataRefreshAfterPaginationChangeTo = function(_rows) {
        return function waitForTableDataRefreshAfterPaginationChangeTo(resolve, reject) {
            Model.waitForTableDataRefreshAfterPaginationChangeTo(_rows, 3000)
                .then(resolve)
                .catch(reject);
        };
    };

    var toggleTableHeaderCheckBox = function(){
        return function toggleTableHeaderCheckBox(resolve, reject) {
            Model.waitForTableHeaderCheckBox().then(function(element){
                var rowElement = element;
                checkDefinedElement(rowElement);
                rowElement.trigger('click');
                resolve();
            }).catch(reject);
        }
    };

    var selectRow = function(_row) {
        return function selectRow() {
            Model.selectRow(_row);
        };
    };

    var unselectRow = function(_row) {
        return function unselectRow() {
            Model.unselectRow(_row);
        };
    };

    var gotoNextPage = function() {
        return [
            function gotoNextPage(resolve, reject) {
                Model.nextPageButton().then(function(element){
                    checkDefinedElement(element);
                    element.trigger('click');
                    resolve();
                }).catch(reject);
            },
            waitForTableDataIsLoaded()
        ];
    };

    var convertNameColumnToNumberColumn = function(_text) {
        return function convertNameColumnToNumberColumn() {
            var isItemFound = -1;
            var columnNumber = 0;
            Model.tableColumnsName().forEach(function(item) {
                if (item.getText().trim() === _text) {
                    isItemFound = columnNumber;
                }
                columnNumber += 1;
            });

            if (isItemFound < 0) { //Meaningfull error info
                expect('').to.equal(_text);
            }
            return isItemFound;
        };
    };

    var setContextRegion = function(regionName) {
        return function setContextRegion() {
            Model.setContextRegion(regionName)
        };
    };

    //////////////////////////////////////////////////////////////////////
    // PAGINATED TABLE VERIFICATIONS
    //////////////////////////////////////////////////////////////////////

    var verifyTableLength = function(_value) {
        return function verifyTableLength() {
            expect(Model.tableRows().length).to.equal(_value);
        };
    };

    var verifyTableContainItem = function(_text) {
        return function verifyTableContainItem() {
            var isItemFound = false;

            Model.tableRowsItemNames().forEach(function(item) {
                if (item.getText() === _text) {
                    isItemFound = true;
                    return;
                }
            });

            if (!isItemFound) { //Meaningfull error info
                expect('').to.equal(_text);
            }
        };
    };


    var verifyTableDoesNotContainItem = function(_text) {
        return function verifyTableContainItem() {
            var isItemFound = false;

            Model.tableRowsItemNames().forEach(function(item) {
                if (item.getText() === _text) {
                    isItemFound = true;
                    return;
                }
            });

            if (isItemFound) { //Meaningfull error info
                //Promis 'catch' handle exceptions or unfulfilled expects, we can use both
                throw "Table contain redundant item: " + _text;
            }
        };
    };

    var verifyRowSelectedForItem = function(_item) {
        return function verifyRowSelectedForItem() {
            if (!Model.rowSelectedForItem(_item)) {
                throw "Row not selected for item: " + _item;
            }
        };
    };

    var verifyRowNotSelectedForItem = function(_item) {
        return function verifyRowNotSelectedForItem() {
            if (Model.rowSelectedForItem(_item)) {
                throw "Row selected for item: " + _item;
            }
        };
    };

    var verifyPage = function(nr) {
        return function verifyPage() {
            Model.verifyPage(nr);
        };
    };

    var verifyTableContents = function(_expectedData, _fromIndex, _toIndex) {
        return function verifyTableContents() {
            for (var _rowIndex = _fromIndex; _rowIndex < _toIndex + 1; _rowIndex++) {
                var _realData = Model.dataForRow(_rowIndex + 1 - _fromIndex, _expectedData[_rowIndex].columns.length);

                for (var _columnIndex = 0; _columnIndex < _expectedData[_rowIndex].columns.length; _columnIndex++) {
                    var _realDataValue = _realData[_columnIndex].trim();
                    var _expectedDataValue = _expectedData[_rowIndex].columns[_columnIndex];

                    if ( isNaN(Date.parse(_expectedDataValue)) ) {
                        expect(_realDataValue).to.equal(_expectedDataValue);
                    } else {
                        var newRealData = _realDataValue.replace(/-/g, '/');
//                        expect(Date.parse(newRealData)).to.equal(Date.parse(_expectedDataValue));
                    }
                }
            }
        };
    };

    var verifyTableContentsForSortedData = function(options) {
        return function verifyTableContentsForSortedData() {
            var _expectedData = options.user;
            var _sortMode = options.sortMode === 'asc' ? 1 : -1;
            var _numberColumn = this.convertNameColumnToNumberColumn(options.column)();
            var _fromIndex = options.from;
            var _toIndex = options.to;

//            _expectedData.sort(function(a, b) {
//                if (a.columns[1].toLowerCase() > b.columns[1].toLowerCase()) {
//                    return 1 * _sortMode;
//                } else if (a.columns[1].toLowerCase() < b.columns[1].toLowerCase()) {
//                    return -1 * _sortMode;
//                } else {
//                    return 0;
//                }
//            })

            var _sortedData = _expectedData.sort(function(a, b) {
                if (a.columns[_numberColumn].toLowerCase() > b.columns[_numberColumn].toLowerCase()) {
                    return 1 * _sortMode;
                } else if (a.columns[_numberColumn].toLowerCase() < b.columns[_numberColumn].toLowerCase()) {
                    return -1 * _sortMode;
                } else {
                    return 0;
                }
            }).slice();


            for (var _rowIndex = _fromIndex; _rowIndex < _toIndex + 1; _rowIndex++) {

                var _realData = Model.dataForRow(_rowIndex + 1 - _fromIndex, _sortedData[_rowIndex].columns.length);

                for (var _columnIndex = 0; _columnIndex < _sortedData[_rowIndex].columns.length; _columnIndex++) {
                    var _realDataValue = _realData[_columnIndex].trim();
                    var _sortedDataValue = _sortedData[_rowIndex].columns[_columnIndex];

                    if ( isNaN(Date.parse(_sortedDataValue)) ) {
                        expect(_realDataValue).to.equal(_sortedDataValue);
                    } else {
//                        expect(Date.parse(_realDataValue.replace(/-/g, '/'))).to.equal(Date.parse(_sortedDataValue));
                    }
                }
            }
        }.bind(this);
    };

    var getHeader = function(timeout){
        return Model.waitTimeForHeader(timeout || 500);
    };

    var verifyHeader = function(_expectedHeader) {
        return function verifyHeader(resolve, reject) {
            getHeader(1000).then(function(element){
                var header = element;
                checkDefinedElement(header);
                expect(header.getText()).to.equal(_expectedHeader);
                resolve();
            })
            .catch(reject);
        }
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

            if (!isItemFound) { //Meaningfull error info
                expect('').to.equal(_text);
            }
        };
    };


    //////////////////////////////////////////////////////////////////////
    // PAGINATED TABLE - SHOW ROWS WIDGET ACTIONS
    //////////////////////////////////////////////////////////////////////
    var getShowRows = function(timeout) {
        return Model.waitForShowRowsSelectBoxButton(timeout || 500);
    };

    var getShowRowsOption = function(optionName, timeout) {
        return Model.waitForShowRowsSelectBoxOption(optionName, timeout || 500);
    };
    var getShowRowsSelected = function(timeout) {
        return Model.waitForShowRowsSelected(timeout || 500);
    };



    var selectShowRows = function(_rows) {
        return function selectShowRows(resolve, reject) {
            getShowRows(1000).then(function(element){
                var selectBox = element;
                checkDefinedElement(selectBox);
                selectBox.trigger('click');
                getShowRowsOption(_rows, 1500).then(function(element){
                    var optionDiv = element;
                    checkDefinedElement(optionDiv);
                    optionDiv.trigger('click');
                    resolve();
                }).catch(reject);
                resolve();
            })
            .catch(reject);
        }
    };

    //////////////////////////////////////////////////////////////////////
    // PAGINATED TABLE - SELECTION INFO WIDGET VERIFICATIONS
    //////////////////////////////////////////////////////////////////////
    var getShowRows  = function() {
        return Model.showRows(500);
    };
    var verifyShowRowsValue = function(_value) {
        return function verifyShowRowsValue(resolve, reject) {
            getShowRows().then(function(element){
                var selectBox = element;
                checkDefinedElement(selectBox);
                expect(selectBox.getText().trim()).to.include(_value);
                resolve();
            })
            .catch(reject);
        };
    };

    //////////////////////////////////////////////////////////////////////
    // PAGINATED TABLE - SELECTION INFO WIDGET ACTIONS
    //////////////////////////////////////////////////////////////////////

    var clickTableSelectionInfo_Link_SelectAllOnAllPage = function() {
        return function clickTableSelectionInfo_Link_SelectAllOnAllPage(resolve,reject) {
            Model.tableSelectionInfo_Link_SelectAllOnAllPage().then(function(element){
                var link = element;
                checkDefinedElement(link);
                link.trigger('click');
                resolve();
            }).catch(reject);
        };
    };

    var clickTableSelectionInfo_Link_clearAll = function() {
        return function clickTableSelectionInfo_Link_clearAll(resolve,reject) {
            Model.tableSelectionInfo_Link_clearAll().then(function(element){
                var link = element;
                checkDefinedElement(link);
                link.trigger('click');
                resolve();
            }).catch(reject);
        };
    };

    //////////////////////////////////////////////////////////////////////
    // PAGINATED TABLE - SELECTION INFO WIDGET VERIFICATIONS
    //////////////////////////////////////////////////////////////////////

    var verifyTableSelectionInfo_Visible = function(_isVisible) {
        return function verifyTableSelectionInfo_Visible() {
            var showTrueVisible = ((Model.tableSelectionInfo_Show_True() !== null) && (Model.tableSelectionInfo_Show_True() !== undefined));
            var showFalseVisible = ((Model.tableSelectionInfo_Show_False() !== null) && (Model.tableSelectionInfo_Show_False() !== undefined));

            if (_isVisible) {
                expect(showTrueVisible).to.equal(true);
                expect(showFalseVisible).to.not.equal(true);
            } else {
                expect(showFalseVisible).to.equal(true);
                expect(showTrueVisible).to.not.equal(true);
            }
        };
    };

    var verifyTableSelectionInfo_Text = function(_text) {
        return function verifyTableSelectionInfo_Text(resolve, reject) {
            Model.tableSelectionInfo_Text().then(function(element){
                checkDefinedElement(element);
                expect(element.getText().trim()).to.include(_text);
                resolve();
            }).catch(reject);
        };
    };

    var verifyTableSelectionInfo_Link_selectAllOnCurrentPageLink = function(_text) {
        return function verifyTableSelectionInfo_Link_selectAllOnCurrentPageLink(resolve, reject) {
            Model.tableSelectionInfo_Link_selectAllOnCurrentPageLink().then(function(element){
                checkDefinedElement(element);
                expect(element.getText().trim()).to.include(_text);
                resolve();
            }).catch(reject);
        };
    };

    var verifyTableSelectionInfo_Link_SelectAllOnAllPage = function(_text) {
        return function verifyTableSelectionInfo_Link_SelectAllOnAllPage(resolve,reject) {
            Model.tableSelectionInfo_Link_SelectAllOnAllPage().then(function(element){
                var link = element;
                checkDefinedElement(link);
                expect(link.getText()).to.include(_text);
                resolve();
            }).catch(reject);
        };
    };

    var verifyTableSelectionInfo_Link_clearAll = function(_text) {
        return function verifyTableSelectionInfo_Link_clearAll(resolve,reject) {
            Model.tableSelectionInfo_Link_clearAll().then(function(element){
                var link = element;
                checkDefinedElement(link);
                expect(link.getText()).to.include(_text);
                resolve();
            }).catch(reject);
        };
    };

    // PAGINATED TABLE - SORTED TABLE

    var sortTableByColumnName = function(_columnName) {
        return function sortTableByColumnName() {
                Model.tableSortButtonDescInColumn(_columnName).trigger('click');
        };
    };

    //PAGINATED TABLE - VERIFY CONTENT
    var verifyFilterSelectedByName = function(selectedRoles, columnNumber) {
        return function verifyFilterSelectedByName() {
            if (!Model.rowSelectedForItemInColumn(selectedRoles, columnNumber)) {
                throw "Row not selected for item: " + selectedRoles + " in column " + columnNumber;
            }
        };
    };

    var verifyAllRolesSelected = function(selectedRoles, columnNumber, selected) {
        return function verifyAllRolesSelected() {
            selectedRoles.forEach(function(role) {
                var checkboxSelected = Model.rowSelectedForItemInColumn(role.name, columnNumber);
                if (checkboxSelected !== selected || checkboxSelected === undefined) {
                    throw "Row not selected for item: " + role.name + " in column " + columnNumber;
                } 
            });
        };
    };

    var verifyAllRolesNoAssignedSelected = function(selectedRoles, columnNumber) {
        return function verifyAllRolesNoAssignedSelected() {
            selectedRoles.forEach(function(role) {
                var noAssignedSelection = Model.selectedListInTableInRowWithName(role.name, columnNumber);
                if(noAssignedSelection.getText().trim() !== '!=' || noAssignedSelection == undefined){
                     throw "Row elected for item: " + role.name + " in column " + columnNumber + "has different status than  !=" ;
                }
            });
        };
    };

    var clickSelectListInTableInRowWithName = function(name, columnNumber, assigned) {
        return function clickSelectListInTableInRowWithName() {
            Model.clickSelectListInTableInRowWithName(name, columnNumber, assigned);
        }
    };

    var getFilterTable = function() {
        return Model.tableRows();
    };

    var clickFilterSelectedByName = function(roleName, columnNumber) {
        return function clickFilterSelectedByName() {
            var rows = getFilterTable();
            checkDefinedElement(rows);
            var resultExist = rows.some(function(row, index) {

                var cells = row.findAll('td');
                var checkbox = row.find('input.ebCheckbox');
                var result = cells[columnNumber-1].getText().trim();
                checkDefinedElement(checkbox);
                checkDefinedElement(result);
                if( result === roleName) {
                    checkbox.trigger('click');
                    return true;
                }else{
                    false;
                    }
            });
            if( !resultExist ) {
                 throw "Row not selected for item: " + roleName + " in column " + columnNumber;
            }
        }

    };

    var verifySelectedListInTableInRowWithName = function(name, columnNumber, assignedText) {
        return function verifySelectedListInTableInRowWithName() {
            expect(Model.selectedListInTableInRowWithName(name, columnNumber).getText().trim()).to.include(assignedText);
        };
    };

    var verifyColorFilterSelectedByName = function(name, columnNumber, colorCode) {
        return function verifyColorFilterSelectedByName() {
            expect(Model.colorFilterSelectedByName(name, columnNumber).trim()).to.include(colorCode);
        };
    };

    var verifyNoDataMessageIsVisible = function() {
        return function verifyNoDataMessageIsVisible() {
            expect(Model.noDataMessageIsVisible()).to.equal(true);
        };
    };

    var verifyNoDataMessageContent = function(content) {
        return function verifyNoDataMessageContent() {
           expect(Model.noDataMessageContent('title')).to.equal(content.title);
           expect(Model.noDataMessageContent('info')).to.equal(content.info);
        };
    };

    return {

        // PAGINATED TABLE ACTIONS
        sleep: sleep,
        waitForEventsPropagation: waitForEventsPropagation,
        waitForTableDataIsLoaded: waitForTableDataIsLoaded,
        waitForTableDataRefreshAfterPaginationChangeTo: waitForTableDataRefreshAfterPaginationChangeTo,
        toggleTableHeaderCheckBox: toggleTableHeaderCheckBox,
        selectRow: selectRow,
        unselectRow: unselectRow,
        gotoNextPage: gotoNextPage,
        convertNameColumnToNumberColumn: convertNameColumnToNumberColumn,

        // PAGINATED TABLE VERIFICATIONS
        verifyTableLength: verifyTableLength,
        verifyTableContainItem: verifyTableContainItem,
        verifyTableDoesNotContainItem: verifyTableDoesNotContainItem,
        verifyPage: verifyPage,
        verifyRowSelectedForItem: verifyRowSelectedForItem,
        verifyRowNotSelectedForItem: verifyRowNotSelectedForItem,
        verifyTableContents: verifyTableContents,
        verifyTableContentsForSortedData: verifyTableContentsForSortedData,
        verifyHeader: verifyHeader,
        verifyTableColumnsName: verifyTableColumnsName,

        // PAGINATED TABLE - SHOW ROWS WIDGET ACTIONS
        selectShowRows: selectShowRows,

        // PAGINATED TABLE - SHOW ROWS WIDGET VERIFICATIONS
        verifyShowRowsValue: verifyShowRowsValue,

        // PAGINATED TABLE - SELECTION INFO WIDGET ACTIONS
        clickTableSelectionInfo_Link_SelectAllOnAllPage: clickTableSelectionInfo_Link_SelectAllOnAllPage,
        clickTableSelectionInfo_Link_clearAll: clickTableSelectionInfo_Link_clearAll,

        // PAGINATED TABLE - SELECTION INFO WIDGET VERIFICATIONS
        verifyTableSelectionInfo_Visible: verifyTableSelectionInfo_Visible,
        verifyTableSelectionInfo_Text: verifyTableSelectionInfo_Text,
        verifyTableSelectionInfo_Link_selectAllOnCurrentPageLink: verifyTableSelectionInfo_Link_selectAllOnCurrentPageLink,
        verifyTableSelectionInfo_Link_SelectAllOnAllPage: verifyTableSelectionInfo_Link_SelectAllOnAllPage,
        verifyTableSelectionInfo_Link_clearAll: verifyTableSelectionInfo_Link_clearAll,

        // PAGINATED TABLE - SORTED TABLE

        sortTableByColumnName: sortTableByColumnName,

        // PAGINATED TABLE - CONFIG

        setContextRegion: setContextRegion,

        //PAGINATED TABLE - VERIFY CONTENT
        verifyFilterSelectedByName: verifyFilterSelectedByName,
        clickSelectListInTableInRowWithName: clickSelectListInTableInRowWithName,
        clickFilterSelectedByName: clickFilterSelectedByName,
        verifyAllRolesSelected: verifyAllRolesSelected,
        verifySelectedListInTableInRowWithName:verifySelectedListInTableInRowWithName,
        verifyColorFilterSelectedByName: verifyColorFilterSelectedByName,
        verifyAllRolesNoAssignedSelected: verifyAllRolesNoAssignedSelected,
        verifyNoDataMessageIsVisible: verifyNoDataMessageIsVisible,
        verifyNoDataMessageContent: verifyNoDataMessageContent,

        goToHash: goToHash
    };
});
