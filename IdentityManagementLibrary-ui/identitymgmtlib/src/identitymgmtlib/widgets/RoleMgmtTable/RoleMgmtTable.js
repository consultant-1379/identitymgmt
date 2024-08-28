/**
 * Table with default sorting and filtering algorithms. Rows selection is persistent
 * (rows remain selected when filtering or sorting is applied). Table provides API methods
 * to filter or sort rows, but these actions can be also triggered by events (filter and sort, accordingly).
 *
 * ### Options
 *  [===
 *    @options
 *      all options supported by base table from tableLib
 *      Note that if 'url' option is not defined table will not try to fetch data. You can insert data by using addRow method or setData method. If you add data before fetch is finished your data will be overwritten by fetched one.
 *      {string} selectedCaption: text that will be displayed before selected items counter. If null selected items counter will not be displayed.
 *      {string or Array<String>} unique_key: name of table data parameter that is its unique identifier. In some cases more than one property makes item unique. That values should then be passed as array. If undefined selection will not work properly.
 *  ===]
 *
 *  ### Events table is subsribed to:
 *  [===
 *    checkend ({Array<Row>} rows) - receiving this event updates selected items registry and selected items counter (if it's enabled)
 *    filter ({Object} filterCriteria) - receiving this event filters the table and refreshes data. If same object is received twice, data is filtered only once.
 *    sort ({Object} sortCriteria) - receiving this event sorts the table and refreshes data. If same object is received twice, data is sorted only once.
 *  ===]
 */
define([
    'jscore/core',
    './RoleMgmtTableView',
    'tablelib/Table',
    'jscore/ext/net',
    'identitymgmtlib/ErrorWidget',
    'jscore/ext/privateStore',
    'identitymgmtlib/Utils',
    'jscore/ext/utils/base/underscore'
], function(core, View, Table, net, ErrorWidget, PrivateStore, Utils, underscore) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        SORT: {
            ASCENDING: 1,
            DESCENDING: - 1
        },

        View: View,

        onViewReady: function() {
            _(this).table = new Table(this.options);
            initializeView.call(this);
            initializeVariables.call(this);
            fetchDataIfNeeded.call(this);
            attachWidgetIfNeeded.call(this);
            addEventHandlers.call(this);
        },

        /**
         * Select rows in table. Note that this functions does not deselect previously selected items.
         * @param {Array<Object>} rowsData
         * @returns {undefined}
         */
        selectRows: function(rowsData) {
            if(Array.isArray(rowsData)) {
                addToSelection.call(this, rowsData);
                if(isDataReady.call(this)) {
                    refreshTableData.call(this);
                }
            }
        },

        /**
         * Removes from table all items that does not match callback (filterFunction).
         * Callback is applied to all table data, even if it's ivisible due to filter.
         * @param {function} filterFunction, used as Array.filter callback, must return true or false.
         * @returns {undefined}
         */
        persistOnlyMatchingRows: function(filterFunction) {
            if(underscore.isFunction(filterFunction)) {
                _(this).baseData = _(this).baseData.filter(filterFunction);
                refreshTableData.call(this);
            }
        },

        getTable: function() {
            return _(this).table;
        },

        /**
         * Filter object passed as argument is applied immediately.
         * If filter object is same as already applied nothing is done.
         * @param {Object} filter object, must be in following format:
         * {
         *      attribute: 'table column name',
         *      value: 'rows values will be compared against this value',
         *      comparator: 'supported comarators are = (partial match), !=, == (full match)'
         * }
         * @returns {undefined}
         */
        filterData: function(filter) {
            _(this).filterCriteria = filter;
            refreshTableData.call(this);
        },

        resetFilter: function() {
            _(this).filterCriteria = {};
            refreshTableData.call(this);
        },

        /**
         * Sorting using passed sort object will be applied immediately.
         * If sort object is same as already applied nothing is done.
         * @param {Object} sort object, must be in following format:
         * {
         *      key: 'table column name',
         *      order: '1 for ascending, -1 for descending, roleMgmtTable.SORT object can be used',
         * }
         * @returns {undefined}
         */
        sortData: function(sort) {
            _(this).sortCriteria = sort;
            refreshTableData.call(this);
        },

        resetSort: function() {
            _(this).sortCriteria = {};
            refreshTableData.call(this);
        },

        /**
         * @returns {Array<Object>} Array of objects contained in table that are currently selected.
         * Note that this function returns all selected items, even if they're hidden due to filter.
         */
        getSelectedRowsData: function() {
            return _(this).selectedItems.toArray();
        },

        setData: function(data) {
            _(this).baseData = data;
            _(this).isDataReady = true;
            updateDataInTable.call(this, data);
        },

        addRow: function(data, index) {
            _(this).baseData.push(data);
            _(this).table.addRow(data, index);
            updateCounter.call(this);
        },

        removeRow: function(index) {
            var tableRows = _(this).table.getRows();
            if(index >= 0 && index < tableRows.length) {
                var rowData = tableRows[index].getData();
                _(this).baseData = underscore.without(_(this).baseData, rowData);
                _(this).table.removeRow(index);
                updateCounter.call(this);
            }
        }
    });

    function isDataReady() {
        return _(this).isDataReady;
    }

    function addToSelection(rows) {
        rows.forEach(function(row) {
            _(this).selectedItems.push(row);
        }.bind(this));
    }

    function addFilterEventHandler() {
        _(this).table.addEventHandler('filter', function (attribute, value, comparator) {
            if (value === "") {
                delete _(this).filterCriteria[attribute];
            } else {
                _(this).filterCriteria[attribute] = {
                    value: value,
                    comparator: comparator
                };
            }
            refreshTableData.call(this);
        }.bind(this));
    }

    function addSelectionHandlers() {
        _(this).table.addEventHandler('rowselectend', updateSelectedItems.bind(this));
    }

    function updateSelectedItems(rows) {
        if (isTableFiltered.call(this)) {
            var newRows = rows.map(function (row) {
                return row.getData();
            });

            var selectionDiff = getSelectionDifference.call(this, _(this).actuallySelected, newRows);
            selectionDiff.addedItems.forEach(function (dataItem) {
                _(this).selectedItems.push(dataItem);
            }.bind(this));

            selectionDiff.removedItems.forEach(function (dataItem) {
                _(this).selectedItems.remove(dataItem);
            }.bind(this));
        } else {
            _(this).selectedItems.clear();
            rows.forEach(function (row) {
                _(this).selectedItems.push(row.getData());
            }.bind(this));
        }
        _(this).actuallySelected = _(this).selectedItems.getSelectedForDataSubset(_(this).table.getData());
        if(isSelectedCounterEnabled.call(this)) {
            updateSelectedCounter.call(this);
        }
    }

    function isTableFiltered() {
        return (Object.keys(_(this).filterCriteria).length > 0);
    }

    function updateCounter() {
        this.view.getCounter().setText(_(this).table.getRows().length);
    }

    function isSelectedCounterEnabled() {
        return this.options.selectedCaption !== undefined;
    }

    function updateSelectedCounter() {
        var numberOfSelectedItems = _(this).selectedItems.getSelectedCount();
        if(numberOfSelectedItems !== 0) {
            showSelectedItemsInfo.call(this, numberOfSelectedItems);
        } else {
            hideSelectedItemsInfo.call(this);
        }
    }

    function showSelectedItemsInfo(numberOfSelectedItems) {
        this.view.getSelectedCaption().removeModifier('hide');
        this.view.getSelectedCounter().removeModifier('hide');
        this.view.getSelectedCounter().setText('(' + numberOfSelectedItems + ')');
    }

    function hideSelectedItemsInfo() {
        this.view.getSelectedCaption().setModifier('hide');
        this.view.getSelectedCounter().setModifier('hide');
    }

    function initializeView() {
        this.fetchErrorHeader = this.options.fetchErrorHeader;
        _(this).table.attachTo(this.getElement());
        this.view.getTitle().setText(this.options.title);
        if(isSelectedCounterEnabled.call(this)) {
            this.view.getSelectedCaption().setText(this.options.selectedCaption);
            hideSelectedItemsInfo.call(this);
        }
    }

    function initializeVariables() {
        _(this).isDataReady = false;
        _(this).baseData = [];
        _(this).sortCriteria = this.options.sort ? this.options.sort : {};
        _(this).defaultFilter = this.options.defaultFilter ? this.options.defaultFilter : function () {
            return true;
        };
        _(this).filterCriteria = this.options.filter ? this.options.filter : {};

        _(this).UNIQUE_KEY = this.options.unique_key;
        if (_(this).UNIQUE_KEY === undefined) {
            console.log('Unique key is not defined, selection will not work');
        }
        _(this).selectedItems = new SelectionRegistry(_(this).UNIQUE_KEY);
    }

    function showErrorNotificaton(msg) {
        if (this.options.fetchErrorHeader) {
            if (!this.options.fetchErrorContent) {
                this.options.fetchErrorContent = msg;
            }
            new ErrorWidget({
                header: this.fetchErrorHeader,
                content: this.options.fetchErrorContent
            }).attachTo(this.getElement());
        }
    }

    function fetchDataIfNeeded() {
        if (!_(this).isDataReady) {
            if (_(this).pageXhr) {
                _(this).pageXhr.abort();
            }
            if(this.options.url) {
                _(this).pageXhr = net.ajax({
                    url: this.options.url,
                    dataType: 'json',
                    success: function(response) {
                        applyDefaultFilter.call(this, response);
                        _(this).isDataReady = true;
                    }.bind(this),
                    error: showErrorNotificaton.bind(this)
                });
            }
        } else {
            refreshTableData.call(this);
        }
    }

    function applyDefaultFilter(response) {
        _(this).baseData = response.filter(_(this).defaultFilter);
        refreshTableData.call(this);
    }

    function getSelectionDifference(oldSelection, newSelection) {
        return {
            removedItems: underscore.difference(oldSelection, newSelection),
            addedItems: underscore.difference(newSelection, oldSelection)
        };
    }

    function performDataSort(data) {
        var sortedData;
        if (_(this).sortCriteria.key && _(this).sortCriteria.order) {
            sortedData = data.sort(function(e1, e2) {
                return _(this).sortCriteria.order * e1[_(this).sortCriteria.key].localeCompare(e2[_(this).sortCriteria.key]);
            }.bind(this));
        } else {
            sortedData = data;
        }
        updateDataInTable.call(this, data);
        _(this).previousSortCriteria = underscore.clone(_(this).sortCriteria);
        return sortedData;
    }

    function refreshTableData() {
        var data = getActualTableData.call(this);

        if (hasFilterCriteriaChanged.call(this)) {
            data = performDataFiltering.call(this, _(this).baseData);
        }

        if(hasSortOrderChanged.call(this)) {
            data = performDataSort.call(this, data);
        }

        updateDataInTable.call(this, data);

        _(this).actuallySelected = _(this).selectedItems.getSelectedForDataSubset(data);

        performSelectionUpdate.call(this);

        this.trigger('pageload');
    }

    function getActualTableData() {
        var data;
        if (isTableFiltered.call(this) && _(this).filteredData) {
            data = _(this).filteredData;
        } else {
            data = _(this).baseData;
        }
        return data;
    }

    function updateDataInTable(data) {
        _(this).table.setData(data);
        updateCounter.call(this);
    }

    function hasFilterCriteriaChanged() {
        return !Utils.equals(_(this).filterCriteria, _(this).previousFilterCriteria);
    }

    function hasSortOrderChanged() {
        return !Utils.equals(_(this).sortCriteria, _(this).previousSortCriteria);
    }

    function addEventHandlers() {
        addSortEventHandler.call(this);
        addFilterEventHandler.call(this);
        addSelectionHandlers.call(this);
    }

    function attachWidgetIfNeeded() {
        if (this.options.widget) {
            this.options.widget.attachTo(this.view.getWidget());
        }
    }

    function performDataFiltering(data) {
        if(isFilterCriteriaCorrect.call(this)) {
            var filteredData = data.filter(function(dataItem) {
                for (var tableColumnName in _(this).filterCriteria) {
                    if(_(this).filterCriteria[tableColumnName].value !== '') {
                        if (dataItem[tableColumnName]) {
                            var resultForElement = shouldElementBeVisible.call(this, dataItem, tableColumnName);
                            if(resultForElement === false) {
                                return resultForElement;
                            }
                        }
                    }
                }
                return true;

            }.bind(this));
            _(this).previousFilterCriteria = underscore.clone(_(this).filterCriteria);
            _(this).filteredData = filteredData;
            return filteredData;
        } else {
            return data;
        }
    }

    function isFilterCriteriaCorrect() {
        if(_(this).filterCriteria) {
            return doesAllFieldsHasValueAndComparatorKeys.call(this);
        } else {
            return false;
        }
    }

    function doesAllFieldsHasValueAndComparatorKeys() {
        return underscore.values(_(this).filterCriteria).every(hasValueAndComparatorKeys);
    }

    function hasValueAndComparatorKeys(filterFieldValue) {
        return filterFieldValue.hasOwnProperty('value') && filterFieldValue.hasOwnProperty('comparator');
    }

    function shouldElementBeVisible(dataItem, tableColumnName) {
        switch (_(this).filterCriteria[tableColumnName].comparator) {
            case '=':
                if (dataItem[tableColumnName].toLowerCase().indexOf(_(this).filterCriteria[tableColumnName].value.toLowerCase()) === -1) {
                    return false;
                }
                break;
            case '!=':
                if (dataItem[tableColumnName].toLowerCase().indexOf(_(this).filterCriteria[tableColumnName].value.toLowerCase()) > -1) {
                    return false;
                }
                break;
            case '==':
                if (dataItem[tableColumnName].toLowerCase() !== _(this).filterCriteria[tableColumnName].value.toLowerCase()) {
                    return false;
                }
                break;
        }
    }

    function addSortEventHandler() {
        _(this).table.addEventHandler('sort', function (order, attribute) {
            var orderValue = getSortOrderValue(order);
            if(!orderValue) {
                return;
            }
            _(this).sortCriteria = {
                order: orderValue,
                key: attribute
            };
            refreshTableData.call(this);
        }.bind(this));
    }

    function getSortOrderValue(orderString) {
        switch (orderString) {
            case 'asc':
                return 1;
            case 'desc':
                return -1;
            default:
                return;
        }
    }

    function performSelectionUpdate() {
        if(_(this).selectedItems.getSelectedCount() > 0) {
            _(this).table.selectRows(function(row) {
                var rowData = row.getData();
                if(_(this).selectedItems.isSelected(rowData)) {
                    return true;
                } else {
                    return false;
                }
            }.bind(this));
        }
    }
    /**
     * Set of selected objects that is persistent and not dependent on actual table items.
     * It allows to maintain selection even if all of table items are hidden due to filtering.
     *
     * Sets key is string value of item specified as uniqueKeyElements.
     * If key is complex (more than one element values of complex key is joined using underscore character.
     *
     * @param {string or Array<string>} uniqueKeyElements
     * string value if key consists of only one value (eg. id)
     * or array of strings if key consists of more than one element (eg. resource-action pair)
     */
    function SelectionRegistry(uniqueKeyElements) {
        var KEY_ELEMENTS_DELIMITER = '_';
        var itemsToSelect = {};
        var keyElements = uniqueKeyElements;
        var uniqueKey = parseUniqueKey(uniqueKeyElements);

        return {
            push: function(rowData) {
                var key = getKeyForData(rowData);
                itemsToSelect[key] = rowData;
            },

            remove: function(rowData) {
                delete itemsToSelect[getKeyForData(rowData)];
            },

            clear: function() {
                itemsToSelect = {};
            },

            /**
             * Get array of actually selected objects.
             * Note that this is not only key for such object but full object that is stored in table.
             * @returns {Array<Object>}
             */
            toArray: function() {
                var res = Object.keys(itemsToSelect).map(function(selectedRowKey) {
                    var item = itemsToSelect[selectedRowKey];
                    return item;
                });
                return res;
            },

            /**
             * @returns {Array<string>} returns array of key elements. In case of simple (one element) key one-element array is returned.
             */
            getKeyElements: function() {
                if(this._isCompositeKey()) {
                    return uniqueKey.split(KEY_ELEMENTS_DELIMITER);
                } else {
                    return [uniqueKey];
                }
            },

            getSelectedCount: function() {
                return Object.keys(itemsToSelect).length;
            },

            /**
             * Function searches in private registry which objects from parameter array is selected and returns only these selected.
             * @param {Array<Object>} dataSubset
             * @returns {Array<Object>}
             */
            getSelectedForDataSubset: function(dataSubset) {
                return dataSubset.filter(function(dataItem) {
                    return this.isSelected(dataItem);
                }.bind(this));
            },

            isSelected: function(rowData) {
                return (getKeyForData(rowData) in itemsToSelect);
            }
        };

        function isCompositeKey(uniqueKeyParam) {
            if(uniqueKeyParam) {
                return (uniqueKeyParam instanceof Array);
            } else {
                return (uniqueKey instanceof Array);
            }
        }

        function getKeyForData(rowData) {
            var key;
            if(isCompositeKey()) {
                var rowKey = [];
                keyElements.forEach(function(keyElement) {
                    rowKey.push(rowData[keyElement]);
                });
                key = rowKey.join(KEY_ELEMENTS_DELIMITER);
            } else {
                 key = rowData[uniqueKey];
            }
            return key;
        }

        function parseUniqueKey(uniqueKey) {
            var res;
            if(isCompositeKey()) {
                res = uniqueKey.join(KEY_ELEMENTS_DELIMITER);
            } else {
                res = uniqueKey;
            }
            return res;
        }
    }
});
