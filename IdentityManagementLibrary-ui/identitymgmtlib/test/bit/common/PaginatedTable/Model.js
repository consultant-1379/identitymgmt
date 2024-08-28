define([
    'test/bit/lib/Browser'
], function(Browser) {

    // IMPROVEMENTS:
    // Consider change of getting some elments
    // See methods showRows and waitForShowRowsChange
    // After change pagination size, widget value do not immediatelly change the value
    // So change to 10 from 50 and verification if it is 10, gives assertion error

    var paginatedTable_prefix = { //WARNING! this names has to have spacebar at the end
        usermanagement: '.eaUsermanagement-MainRegion ',
        usermanagement_filters: '.eaFlyout-panelContents ',
        rolemanagement: '.eaRolemanagement-RoleMgmtRegion ',
        targetgroupmanagement: '.eaTargetmanagement-TargetMgmtRegion ',
        default: ""
    };

    var _timeout = {
        short: 100,
        medium: 500,
        long: 1000
    };

    var selector = {

        //////////////////////////////////////////////////////////////////////
        // PAGINATED TABLE
        //////////////////////////////////////////////////////////////////////
        pageInProgressMarker: function() {
            var region = paginatedTable_prefix[Browser.regionName || "default"] || "";
            return region + '.elIdentitymgmtlib-PaginatedTable-markers_loaded_inprogress';
        },
        pageLoadedMarker: function() {
            var region = paginatedTable_prefix[Browser.regionName || "default"] || "";
            return region + '.elIdentitymgmtlib-PaginatedTable-markers_loaded_done';
        },
        tableHeaderRow: function() {
            var region = paginatedTable_prefix[Browser.regionName || "default"] || "";
            return region + '.elTablelib-Table-header > .ebTableRow';
        },
        tableHeaderCheckBox: function() {
            var region = paginatedTable_prefix[Browser.regionName || "default"] || "";
            return region + '.elTablelib-Table-header  .ebTableRow  .ebCheckbox';
        },
        tableHeaderColumn: function() {
            var region = paginatedTable_prefix[Browser.regionName || "default"] || "";
            return region + '.elTablelib-Table-header > .ebTableRow > th';
        },
        tableRow: function() {
            var region = paginatedTable_prefix[Browser.regionName || "default"] || "";
            return region + '.elTablelib-Table-body > .ebTableRow'
        },
        tableRowItemCheckbox: 'input.ebCheckbox',
        tableRowItemNameColumn: function() {
            var region = paginatedTable_prefix[Browser.regionName || "default"] || "";
            return region + '.elTablelib-Table-body  .ebTableRow > td:nth-child(2)';
        },
        tableColumn2: 'td:nth-child(2)',
        paginationCurrentPage: '.ebPagination-entryAnchor_current',
        nextPageButton: '.ebPagination-nextAnchor',
        header: function() {
            var region = paginatedTable_prefix[Browser.regionName || "default"] || "";
            return region + '.elIdentitymgmtlib-PaginatedTable-count';
        },
        tableColumnNumber: function(_numberOfColumns) {
            return 'td:nth-child(' + _numberOfColumns + ')';
        },

        //////////////////////////////////////////////////////////////////////
        // PAGINATED TABLE - SHOW ROWS WIDGET
        //////////////////////////////////////////////////////////////////////
        showRows: function() {
            return paginatedTable_prefix[Browser.regionName] + ' .ebSelect-value';
        },
        selectedRow: '.ebComponentList .ebComponentList-item_focused',

        showRowsElements: '.ebComponentList .ebComponentList-item',

        //////////////////////////////////////////////////////////////////////
        // PAGINATED TABLE - SELECTION INFO WIDGET
        //////////////////////////////////////////////////////////////////////
        tableSelectionInfo_Show_True: '.elIdentitymgmtlib-wSelectedMessage-innerWrapper_show_true',
        tableSelectionInfo_Show_False: '.elIdentitymgmtlib-wSelectedMessage-innerWrapper_show_false',
        tableSelectionInfo_Text: '.elIdentitymgmtlib-wSelectedMessage-content-selectedRowsInfo',
        tableSelectionInfo_Link_selectAllOnCurrentPageLink: '.elIdentitymgmtlib-wSelectedMessage-content-selectAllOnCurrentPage',
        tableSelectionInfo_Link_SelectAllOnAllPage: '.elIdentitymgmtlib-wSelectedMessage-content-selectAllOnAllPage',
        tableSelectionInfo_Link_clearAll: '.elIdentitymgmtlib-wSelectedMessage-content-clearAll',

        ////////////////////////////////////////////////////////////////////
        // PAGINATED TABLE  - SORTING COLUMN
        ///////////////////////////////////////////////////////////////////
        tableSortingUp: '.ebTable-headerSort .ebSort-arrow_up',
        tableSortingDown: '.ebTable-headerSort .ebSort-arrow_down',

        /////////////////////////////////////////////////////////////////
        //PAGINATED TABLE - FILTERS CONTENT
        ///////////////////////////////////////////////////////////////
        selectListButton: '.ebSelect-iconHolder',
        selectListValue: '.ebSelect-value',
        contentSelectList: '.ebComponentList-item',
        noDataMessage: '.ebInlineMessage',
        noDataMessageTitle: '.ebInlineMessage-header',
        noDataMessageInfo: '.ebInlineMessage-description'


    };

    return {

        //////////////////////////////////////////////////////////////////////
        // PAGINATED TABLE
        //////////////////////////////////////////////////////////////////////

        waitForTableHeaderCheckBox: function() {
            return Browser.waitForElement(selector.tableHeaderCheckBox(), _timeout.medium);
        },

        tableColumnsName: function() {
            return Browser.getElements(selector.tableHeaderColumn());
        },

        tableColumnsName: function(_text) {
            return Browser.getElements(selector.tableHeaderColumn());
        },

        tableRows: function() { //Table with whole row data
            return Browser.getElements(selector.tableRow());
        },

        tableRowsItemNames: function(row) { //Table with items name only
            return Browser.getElements(selector.tableRowItemNameColumn());
        },

        selectRow: function(row) {
            var rowElement = Browser.getElement(selector.tableRow() + ':nth-child(' + row + ')');
            var checkbox = rowElement.find(selector.tableRowItemCheckbox);
            if (!checkbox.getProperty('checked')) {
                checkbox.trigger('click');
            }
        },

        unselectRow: function(row) {
            var rowElement = Browser.getElement(selector.tableRow() + ':nth-child(' + row + ')');
            var checkbox = rowElement.find(selector.tableRowItemCheckbox);
            if (checkbox.getProperty('checked')) {
                checkbox.trigger('click');
            }
        },

        rowSelectedForItem: function(_item) {
            var _rows = this.tableRows();
            var _rowChecked;
            _rows.some(function(_row) {
                var _itemName = _row.find(selector.tableColumn2).getText().trim();
                if (_itemName === _item) {
                    var _checkBox = _row.find(selector.tableRowItemCheckbox);
                    _rowChecked = _checkBox.getProperty('checked');
                    return true;
                }
                return false;
            });
            if (_rowChecked === undefined) {
                throw new Error('Model.rowSelectedForItem - row not found for item: ' + _item);
            }
            return _rowChecked;
        },

        dataForRow: function(_row, _numberOfColumns) {
            var _rowElement = Browser.getElement(selector.tableRow() + ':nth-child(' + _row + ')');
            var _data = [];

            for (var _col = 1; _col < _numberOfColumns + 1; _col++) {
                _data.push(_rowElement.find('td:nth-child(' + _col + ')').getText());
            }
            return _data;
        },

        verifyPage: function(nr) {
            var page = Browser.getElement(selector.paginationCurrentPage).getText();
            page = parseInt(page);
            expect(nr).to.equal(page);
        },

        waitForTableDataIsLoaded: function(timeout) {
            return Browser.waitForElement(selector.pageLoadedMarker(), timeout || _timeout.short);
        },

        waitForTableDataRefreshAfterPaginationChangeTo: function(_rows, _timeout) {
            return Browser.waitForElementWithAttributeValue(selector.pageLoadedMarker(), 'rows', _rows.toString(), _timeout);
        },

        nextPageButton: function() {
            return Browser.waitForElement(selector.nextPageButton, _timeout.short);
        },

        waitTimeForHeader: function(timeout) {
            return Browser.waitForElement(selector.header(), timeout || _timeout.short);
        },

        //////////////////////////////////////////////////////////////////////
        // PAGINATED TABLE - SHOW ROWS WIDGET
        //////////////////////////////////////////////////////////////////////

        showRows: function(timeout) {
            return Browser.waitForElement(selector.showRows(), timeout || _timeout.short);
        },

        waitForShowRowsChange: function(_rows) {
            //INFO: Changing pagination using ShowRows widget, changes pagination table view,
            //then widget value really changes, so we need wait some time for refresh
            //this timeout do not increase this step to 10000, but only set timeout
            return Browser.waitForElementWithValue(selector.showRows(), _rows.toString(), 10000);
        },

        waitForShowRowsSelectBoxButton: function(timeout) {
            return Browser.waitForElement(selector.showRows(), timeout || _timeout.short);
        },

        waitForShowRowsSelected: function(timeout){
            return Browser.waitForElement(selector.selectedRow, timeout || _timeout.short);
        },

        waitForShowRowsSelectBoxOption: function(rows, timeout) {
            var index;
            switch (rows) {
               case 10:
                   index = 1;
                   break;
               case 20:
                   index = 2;
                   break;
               case 50:
                   index = 3;
                   break;
               case 100:
                   index = 4;
                   break;
               case 500:
                   index = 5;
                   break;
               default:
                   throw new Error('Rows number ' + rows + ' is not valid.');
            }
            return Browser.waitForElement(selector.showRowsElements + ':nth-child(' + index + ')', timeout || _timeout.short);
        },


        setContextRegion: function(regionName) {
            Browser.regionName = regionName;
        },
        //////////////////////////////////////////////////////////////////////
        // PAGINATED TABLE - SELECTION INFO WIDGET
        //////////////////////////////////////////////////////////////////////

        tableSelectionInfo_Show_True: function() {
            return Browser.getElement(selector.tableSelectionInfo_Show_True);
        },

        tableSelectionInfo_Show_False: function() {
            return Browser.getElement(selector.tableSelectionInfo_Show_False);
        },

        tableSelectionInfo_Text: function() {
            return Browser.waitForElement(selector.tableSelectionInfo_Text, _timeout.medium);
        },

        tableSelectionInfo_Link_selectAllOnCurrentPageLink: function() {
            return Browser.waitForElement(selector.tableSelectionInfo_Link_selectAllOnCurrentPageLink,  _timeout.medium);
        },

        tableSelectionInfo_Link_SelectAllOnAllPage: function() {
            return Browser.waitForElement(selector.tableSelectionInfo_Link_SelectAllOnAllPage, _timeout.medium);
        },

        tableSelectionInfo_Link_clearAll: function() {
            return Browser.waitForElement(selector.tableSelectionInfo_Link_clearAll, _timeout.medium);
        },

        //////////////////////////////////////////////////////////////////////
        // PAGINATED TABLE - SORTED TABLE
        //////////////////////////////////////////////////////////////////////

        tableSortButtonAscInColumn: function(columnName) {
            var _rowHeader = this.tableColumnsName();
            var _sortingButton;
            _rowHeader.some(function(_row) {
                if (_row.getText().trim() === columnName) {
                    _sortingButton = _row.find(selector.tableSortingUp);
                    return true;
                }

            });
            return _sortingButton;
        },

        tableSortButtonDescInColumn: function(columnName) {
            var _rowHeader = this.tableColumnsName();
            var _sortingButton;
            _rowHeader.some(function(_row) {
                if (_row.getText().trim() === columnName) {
                    _sortingButton = _row.find(selector.tableSortingDown);
                    return true;
                }

            });
            return _sortingButton;
        },
        //////////////////////////////////////////////////////////////////////
        //PAGINATED TABLE - VERIFY CONTENT
        //////////////////////////////////////////////////////////////////////

        rowSelectedForItemInColumn: function(selectedRoles, columnNumber) {
            var _rows = this.tableRows();
            var _rowChecked;
            _rows.some(function(_row) {
                var _itemName = _row.find(selector.tableColumnNumber(columnNumber)).getText().trim();
                if (_itemName === selectedRoles.trim()) {
                    var _checkBox = _row.find(selector.tableRowItemCheckbox);
                    _rowChecked = _checkBox.getProperty('checked');
                    return true;
                }
                return false;
            });
            if (_rowChecked === undefined) {
                throw new Error('Model.rowSelectedForItemInColumn - row not found for item: ' + selectedRoles);
            }
            return _rowChecked;
        },


        clickSelectListInTableInRowWithName: function(name, columnNumber, assigned) {
            var _rows = this.tableRows();
            var _queryRole;
            var _selectButton;
            _rows.some(function(_row) {
                var _itemName = _row.find(selector.tableColumnNumber(columnNumber)).getText();
                if (_itemName === name) {
                    var _checkBox = _row.find(selector.tableRowItemCheckbox);
                    if (!_checkBox.getProperty('checked')) {
                        _checkBox.trigger('click');
                    }
                    _selectButton = _row.find(selector.selectListButton);
                    _selectButton.trigger('click');
                    return true;
                }
                return false;
            });
            if (_selectButton === undefined) {
                throw new Error('Model.clickSelectListInTableInRowWithName - row not found for item: ' + name);
            }

            _queryRole = Browser.getElements(selector.contentSelectList);

            _queryRole.forEach(function(query) {
                if (assigned && query.getText().trim() === '=') {
                    query.trigger('click');
                } else if (!assigned && query.getText().trim() === '!=') {
                    query.trigger('click');
                }
            });
            if (_queryRole === undefined) {
                throw new Error('Model.clickSelectListInTableInRowWithName - not found select list');
            }
        },

        clickItemInColumn: function(roleName, columnNumber) {
            var _rows = this.tableRows();

            var _checkbox = _rows.some(function(_row) {
                var _itemName = _row.find(selector.tableColumnNumber(columnNumber)).getText().trim();
                if (_itemName === roleName.trim()) {
                    var _checkBox = _row.find(selector.tableRowItemCheckbox).trigger('click');
                    return true;
                }
                return false;
            });

            if (_checkbox === undefined) {
                throw new Error('Model.clickItemInColumn - row not found for item: ' + roleName);
            }
            return _checkbox;

        },

        selectedListInTableInRowWithName: function(name, columnNumber) {
            var _rows = this.tableRows();
            var _selectButton;
            _rows.some(function(_row) {
                var _itemName = _row.find(selector.tableColumnNumber(columnNumber)).getText();
                if (_itemName === name) {
                    var _checkBox = _row.find(selector.tableRowItemCheckbox);
                    if(!_checkBox.getProperty('checked')){
                        throw new Error('Model.selectedListInTableInRowWithName - row not found checked item: ' + name);
                    }
                    else {
                        _selectButton = _row.find(selector.selectListValue);
                        return true;
                    }
                    return false;
                }
                return false;
            });

            if (_selectButton === undefined) {
                throw new Error('Model.clickSelectListInTableInRowWithName - row not found selectList in item ' + name);
            }
            return _selectButton;
        },

        colorFilterSelectedByName: function(name, columnNumber) {
            var _rows = this.tableRows();
            var _colorColumn;
            _rows.some(function(_row) {
                var _itemName = _row.find(selector.tableColumnNumber(columnNumber)).getText();
                if (_itemName === name) {
                    var _checkBox = _row.find(selector.tableRowItemCheckbox);
                    if(!_checkBox.getProperty('checked')){
                        throw new Error('Model.selectedListInTableInRowWithName - row not found checked item: ' + name);
                    } else {
                        _colorColumn = _row.find(selector.tableColumnNumber(1)).getStyle("backgroundColor");
                        return true;
                    }
                    return false;
                }
                return false;
            });
            if (_colorColumn === undefined) {
                throw new Error('Model.clickSelectListInTableInRowWithName - row not found selectList in item ' + name);
            }
            return _colorColumn;
        },

        noDataMessageIsVisible: function() {
            var dialogMessage = Browser.getElement(selector.noDataMessage);
            if(dialogMessage !== null || dialogMessage !== undefined) {
                return true;
            }else {
                return false;
            }
        },

        noDataMessageContent: function(type) {
            if(type === 'title'){
                return Browser.getElement(selector.noDataMessageTitle).getText().trim();
            } else if(type === 'info') {
                return Browser.getElement(selector.noDataMessageInfo).getText().trim();
            } else {
                throw new Error('NoDataMessage content is not found');
            }
        }
    };
});
