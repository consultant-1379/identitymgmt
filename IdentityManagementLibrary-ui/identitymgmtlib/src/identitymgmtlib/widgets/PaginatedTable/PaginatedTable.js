define([
    'jscore/core',
    'jscore/ext/net',
    'jscore/base/jquery',
    'jscore/ext/privateStore',
    'tablelib/Table',
    'tablelib/plugins/Selection',
    'tablelib/plugins/RowEvents',
    'tablelib/plugins/SmartTooltips',
    'tablelib/plugins/SortableHeader',
    'widgets/Pagination',
    'widgets/Tooltip',
    './PaginatedTableView',
    'identitymgmtlib/Utils',
    'identitymgmtlib/DataHandler',
    '../ErrorContainer/ErrorContainer',
    '../NoFilterResultContainer/NoFilterResultContainer',
    'i18n/number',
     'i18n!identitymgmtlib/common.json'
], function(core, net, jQuery, PrivateStore, Table, Selection, RowEvents, SmartTooltips, SortableHeader, Pagination, Tooltip, View, utils, DataHandler, ErrorContainer, NoFilterResultContainer, Number, CommonDictionary) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        View: View,

        /**
         * Initialise variables and the table.
         *
         * @method onViewReady
         */
        onViewReady: function() {
            _(this).UNIQUEID = this.options.uniqueID || 'id';
            _(this).checkedObj = {};
            _(this).selectedPage = _(this).selectedPage || this.options.pageNumber || 1;
            _(this).queryParams = {};
            _(this).headerInfo = _(this).headerInfo || this.options.headerInfo || '';
            _(this).pageSize = _(this).pageSize || this.options.pageSize || 10;
            _(this).sort = _(this).sort || this.options.sort || null;
            _(this).filter = _(this).filter || this.options.filter || null;
            _(this).urlParams = _(this).urlParams || this.options.urlParams || "";
            _(this).updateData = _(this).updateData || this.options.updateData || null;

            // set data handler
            if (this.options.dataHandler) {
                _(this).dataHandler = this.options.dataHandler;
            } else if (this.options.url) {
                _(this).dataHandler = new DataHandler({
                    uniqueID: this.options.uniqueID,
                    url: this.options.url,
                    updateData: _(this).updateData
                });
            } else {
                throw new Error('DataHandler or url must be specified');
            }

            // store handle sort marker if any column has sortable option
            _(this).handleSort = this.options && this.options.columns && this.options.columns.some(function(column) {
                return column.sortable === true;
            });

            var pluginsObject = {
                plugins: [
                    new RowEvents({
                        events: ['contextmenu']
                    }),
                    new Selection({
                        checkboxes: true,
                        selectableRows: true,
                        multiselect: true,
                        bind: true
                    }),
                    new SmartTooltips()

                ]
            };

            if (typeof this.options.plugins !== 'undefined') {
                //merge object will overwrite plugins set in this.options.plugins, we must concat them
                pluginsObject.plugins = pluginsObject.plugins.concat(this.options.plugins);
            }

            _(this).table = new Table(
                utils.mergeObjects(this.options, pluginsObject)
            );

            _(this).table.attachTo(this.view.getTableContainer());
            this.view.getTitle().setText(this.options.title);

            // Attach widgets if available
            if (this.options.widgets) {
                if (this.options.widgets.selectAllNotification) {
                    this.options.widgets.selectAllNotification.attachTo(this.view.getSelectAllNotificationWidget());
                }
                if (this.options.widgets.tableSettings) {
                    this.options.widgets.tableSettings.attachTo(this.view.getTableSettingsWidget());
                }
            }

            new Tooltip({
                parent: this.view.getRefreshBtn(),
                contentText: "Refresh"
            });

             // Sort handler
            _(this).table.addEventHandler('sort', function(order, attribute) {
                this.sort({
                    order: order,
                    attribute: attribute
                });
            }.bind(this));

            // Checked header
            _(this).table.addEventHandler('checkheader', function(row, checked) {

                var rowData, id;
                // Update data - only on current page
                for (var i = 0; i < _(this).table.getRows().length; i++) {
                    rowData = _(this).table.getRows()[i].getData();
                    id = rowData[_(this).UNIQUEID];
                    _(this).checkedObj[id] = rowData;
                }

                //Trigger event above
                this.trigger('checkheader', row, checked);
            }.bind(this));

            // Multiple check
            _(this).table.addEventHandler('checkend', function(rows) {
                var rowData, id;
                // clear all markers for all visible checkes
                _(this).table.getRows().forEach(function(row) {
                    rowData = row.getData();
                    id = rowData[_(this).UNIQUEID];
                    if (_(this).checkedObj[id]) {
                        delete _(this).checkedObj[id];
                    }
                }.bind(this));
                // ... and mark checked
                rows.forEach(function(row) {
                    rowData = row.getData();
                    id = rowData[_(this).UNIQUEID];
                    _(this).checkedObj[id] = rowData;
                }.bind(this));

                //Trigger event above
                this.trigger('checkend', this.getCheckedRows());

                // Update Selected Rows
                this.updateHeaderSelectedRows();
            }.bind(this));

            _(this).table.addEventHandler('rowevents:contextmenu', function(row, e) {
                var id = row.getData()[_(this).UNIQUEID];
                if (!e.originalEvent.ctrlKey && !_(this).checkedObj[id]) {
                    //Unselect all
                    _(this).checkedObj = {};
                    _(this).table.unselectAllRows();

                    //Select one row
                    this.checkRow(row);
                }

                this.trigger('rowevents:contextmenu', this.getCheckedRows(), e);
            }.bind(this));

            this.view.getSelectedClear().addEventHandler('click', function() {
                this.clearAll();
            }.bind(this));

            this.view.getFilteredClear().addEventHandler('click', function() {
                this.trigger('filtered:clear');
            }.bind(this));

           this.view.getRefreshBtn().addEventHandler('click', function() {
                this.refreshData();
           }.bind(this));

        },

        /**
         * Helper method for apps to fetch the underlying table widget.
         *
         * @method getTable
         * @return {Table} table
         */
        getTable: function() {
            return _(this).table;
        },

        /**
         * Fetches the data for the page and loads it.
         *
         * @method getPageData
         * @param {Integer} ole.log("response.size: " + response.length)agenumber
         * @param {Boolean} force
         * @return {Promise}
         */
        getPageData: function(pagenumber, force, forceXHR, history) {
            // show table loader
            this.showLoader();

            // Set hidden marker that page is loading (for TAF or BIT purposes)
            this.view.setLoadedMarkerLoading();

            // No point fetching the data again if the page number hasn't changed.
            // However, if we change the page size, or query params, the force option
            // allows us to bypass this check.
            if (pagenumber === _(this).selectedPage && !force) {
                this.hideLoader();
                return;
            }
            
            pagenumber = pagenumber || _(this).selectedPage;

            return _(this).dataHandler.getData({
                    force: forceXHR,
                    filter: _(this).filter,
                    sort: _(this).sort
                })
                .then(function(data) {
                    if (_(this).errorContainer) {
                        _(this).errorContainer.destroy();
                    }
                    this.view.showTableContainerHeader();
                    this.view.showTable();
                    onPageLoad.call(this, pagenumber, data, history);
                    // hide loader
                    this.hideLoader();
                    // Compute and set hidden marker that page is loaded (for TAF or BIT purposes)
                    var totalpage = 1;

                    if (_(this).noFilterResultContainer) {
                        _(this).noFilterResultContainer.destroy();
                    }

                    if (data && data.length > 0) {
                        totalpage = Math.ceil(data.length / _(this).queryParams.pagesize);

                    } else if (data && data.length === 0) {

                        _(this).noFilterResultContainer = new NoFilterResultContainer();
                        _(this).noFilterResultContainer.attachTo(this.getElement());
                        this.uncheckAllCheckboxes();
                    }
                    this.view.setLoadedMarkerDone(_(this).queryParams.pagenumber, _(this).queryParams.pagesize, totalpage);
                    return data;
                }.bind(this))
                .catch(function(response) {
                    this.view.hideTableContainerHeader();

                    if (response !== "abort") {
                        onPageLoad.call(this, pagenumber, []);
                    }
                    this.hideLoader();
                    if (_(this).errorContainer) {
                        _(this).errorContainer.destroy();
                    }
                    _(this).errorContainer = new ErrorContainer(response);
                    _(this).errorContainer.attachTo(this.getElement());

                    // _(this).table.destroy();
                    this.view.hideTable();
                }.bind(this));
        },

        /**
         * Reloads data from server.
         *
         * @method refreshData
         */
        refreshData: function() {
            if (_(this).handleSort) {
                _(this).table.setSortIcon(_(this).sort.order, _(this).sort.attribute);
            }
            this.getPageData(_(this).selectedPage, true, true);
        },

        /**
         * uncheck All Checkboxes.

         *
         * @method uncheckAllCheckboxes
         */
        uncheckAllCheckboxes: function() {
            var el = this.view.getTableContainer().find(".ebCheckbox");
            if ( el ) {
                el.setProperty("checked",false);
            }
        },

        /**
         * Sort data and refresh page.
         *
         * @method sort
         * @param {Object} sort
         * @param {Boolean} forceXHR
         */
        sort: function(sort, forceXHR) {
            if (_(this).handleSort) {
                _(this).sort = sort;
                _(this).table.setSortIcon(_(this).sort.order, _(this).sort.attribute);
            }
            this.getPageData(_(this).selectedPage, true, forceXHR, true);
        },

        /**
         * Filter data and refresh page.
         *
         * @method filter
         * @param {Object} filter
         * @param {Boolean} forceXHR
         */
        filter: function(filter, forceXHR) {
            _(this).filter = filter;
            this.clearAll();
            if (_(this).handleSort) {
                _(this).table.setSortIcon(_(this).sort.order, _(this).sort.attribute);
            }
            this.getPageData(1, true, forceXHR, true);
        },

        /**
         * Sets url params
         *
         * @method setUrlParams
         * @param {Object} urlParams
         */
        setUrlParams: function(urlParams) {
            _(this).urlParams = urlParams;
        },


        /**
         * Clears url params
         *
         * @method clearUrlParams
         */
        clearUrlParams: function() {
            _(this).urlParams = "";
        },


        /**
         * Reset filter data and refresh page.
         *
         * @method resetFilter
         * @param {Boolean} forceXHR
         */
        resetFilter: function(forceXHR) {
            _(this).filter = {};
            this.clearAll();
            if (_(this).handleSort) {
                _(this).table.setSortIcon(_(this).sort.order, _(this).sort.attribute);
            }
            this.getPageData(1, true, forceXHR, true);
        },

        /**
         * Changes the page size query parameter and fetches page data again.
         *
         * @method setPageSize
         * @param {Integer} size
         */
        setPageSize: function(size, forceXHR) {
            _(this).pageSize = size;
            if (_(this).handleSort) {
                _(this).table.setSortIcon(_(this).sort.order, _(this).sort.attribute);
            }
            this.getPageData(1, true, forceXHR, true);
        },

        /**
         * Get query parameters.
         *
         * @method getQueryParams
         */
        getQueryParams: function() {
            return _(this).queryParams;
        },

        /**
         * Set additional query parameters. Fetches the page data again.
         *
         * @method setQueryParams
         * @param {Object} params
         */
        setQueryParams: function(params, forceXHR) {
            _(this).queryParams = params;

            _(this).filter = params.filter ? params.filter : _(this).filter; // TODO: should be put outside pagintedTable
            _(this).sort = params.sort ? params.sort : _(this).sort;
            _(this).pageSize = (params.pagesize && parseInt(params.pagesize) > 0) ? parseInt(params.pagesize) : _(this).pageSize;
            _(this).selectedPage = (params.pagenumber && parseInt(params.pagenumber) > 0) ? parseInt(params.pagenumber) : _(this).selectedPage;
            if (_(this).handleSort) {
                _(this).table.setSortIcon(_(this).sort.order, _(this).sort.attribute);
            }
            this.getPageData(_(this).selectedPage, true, forceXHR);
        },

        setQueryParam: function(paramName, paramValue, forceXHR) {

            _(this).queryParams[paramName] = paramValue;

            switch (paramName) {
                case "sort":
                    _(this).sort = paramValue ? paramValue : _(this).sort;
                    break;
                case "filter":
                    _(this).filter = paramValue ? paramValue : _(this).filter;
                    break;
                case "pagesize":
                    _(this).pageSize = (paramValue && parseInt(paramValue) > 0) ? parseInt(paramValue) : _(this).pageSize;
                    break;
                case "pagenumber":
                    _(this).selectedPage = (paramValue && parseInt(paramValue) > 0) ? parseInt(paramValue) : _(this).selectedPage;
            }
            if (_(this).handleSort) {
                _(this).table.setSortIcon(_(this).sort.order, _(this).sort.attribute);
            }
            this.getPageData(_(this).selectedPage, true, forceXHR);
        },


        getCurrentPage:function(){
          return _(this).selectedPage;
        },

        /**
         * Checks all rows
         *
         * @method checkAll
         */
        checkAll: function() {
            var id;
            _(this).dataHandler.getProcessedData().forEach(function(rowData) {
                id = rowData[_(this).UNIQUEID];
                _(this).checkedObj[id] = rowData;
            }.bind(this));

            // Check all rows on current page
            _(this).table.checkRows(function() {
                return true;
            });
        },

        /**
         * Check row passed as parameter or do nothing if row is checked
         *
         * @method checkRow
         */
        checkRow: function(row) {
            var id = row.getData()[_(this).UNIQUEID];
            // Check row if row is not checked
            if (!(_(this).checkedObj[id])) {
                _(this).checkedObj[id] = row.getData();

                //Check row on current page
                _(this).table.checkRows(function(r) {
                    return r === row;
                });
            }
        },

        /**
         * Check row by uniqueId
         * It is slower than checkRow since it must iterate trough data
         * to find specific row object.
         * But its more easy to use since we need only uniqueId and not whe
         * whole row object.
         * Do nothing if row does not exist.
         *
         * @method checkRowByUniqueId
         * @param {String} response
         */
        checkRowByUniqueId: function(_requestedUniqueId) {
            if (!(_(this).checkedObj[_requestedUniqueId])) {
                var _row = this.getRowByUniqueId(_requestedUniqueId);
                if (_row) {
                    _(this).checkedObj[_requestedUniqueId] = _row.getData();
                    _(this).table.checkRows(function(r) {
                        return r === _row;
                    });
                }
            }
        },

        /**
         * Returns row which has specific unique id or undefined
         * if the object with specific uniqueId is not found.
         *
         * @method getRowByUniqueId
         * @param {String} response
         */
        getRowByUniqueId: function(_requestedUniqueId) {
            var _rowIndex;
            var _rowFound;
            for (_rowIndex = 0; _rowIndex < _(this).table.getRows().length; _rowIndex++) {
                var _currentRow = _(this).table.getRows()[_rowIndex];
                var _currentRowUniqueId = _currentRow.getData()[_(this).UNIQUEID];
                if (_currentRowUniqueId === _requestedUniqueId) {
                    _rowFound = _currentRow;
                    break;
                }
            }
            return _rowFound;
        },

        /**
         * Check all rows on curently displaying page
         *
         * @method checkAllOnCurrentPage
         */
        checkAllOnCurrentPage: function() {
            var rowData, id;
            _(this).table.getRows().forEach(function(row) {
                rowData = row.getData();
                id = rowData[_(this).UNIQUEID];
                _(this).checkedObj[id] = rowData;
            }.bind(this));

            // Check all rows on current page
            _(this).table.checkRows(function() {
                return true;
            });
        },

        /**
         * Clears all rows checks
         *
         * @method clearAll
         */
        clearAll: function() {

            // Clear all
            _(this).checkedObj = {};

            // Select previously checked rows
            _(this).table.uncheckAllRows();
            this.trigger('pageloaded', _(this).queryParams, history);
        },

        /**
         * Get rows on all pages
         *
         * @method getRows
         */
        getRows: function() {
            return _(this).dataHandler.getProcessedData();
        },

        /**
         * Get rows on current page
         *
         * @method getPageRows
         */
        getPageRows: function() {
            return _(this).table.getRows();
        },

        /**
         * Get checked rows
         *
         * @method getCheckedRows
         * @return {Array} checkedRows
         */
        getCheckedRows: function() {
            var checkedRows = Object.keys(_(this).checkedObj).map(function(key) {
                return _(this).checkedObj[key];
            }.bind(this));

            // sort objects
            if (_(this).sort) {
                var sort = _(this).sort;
                checkedRows.sort(function(e1, e2) {
                    if (e1[sort.attribute] && e2[sort.attribute]) {
                        return ((sort.order === 'asc') ? 1 : -1) * e1[sort.attribute].localeCompare(e2[sort.attribute]);
                    } else {
                        return 0;
                    }
                });
            }

            return checkedRows;
        },

        /**
         * Get checked rows on curren page
         *
         * @method getCheckedRows
         * @return {Array} checkedRows
         */
        getPageCheckedRows: function() {
            // TODO: use function from table/tablelib
            var rowData, id;
            return _(this).table.getRows().filter(function(row) {
                rowData = row.getData();
                id = rowData[_(this).UNIQUEID];
                return _(this).checkedObj[id];
            }.bind(this));
        },


        /**
         * Show loading icon in the center and hide table content
         *
         * @method showLoader
         */
        showLoader: function() {
            this.view.showLoader();
        },

        /**
         * Hide loading icon and show table content
         *
         * @method hideLoader
         */
        hideLoader: function() {
            this.view.hideLoader();
        },

        /**
         * Clears table markers
         *
         * @method clearMarkers
         */
        clearMarkers: function() {
            this.view.setLoadedMarkerClear();
        },

        /**
         * update table rows from Data Handlers
         *
         * @method updateCheckedRowsData
         */

         updateCheckedRowsData: function () {
             var id;

             _(this).dataHandler.getProcessedData().forEach(function(rowData) {
                id = rowData[_(this).UNIQUEID];
                if (_(this).checkedObj[id]) {
                    _(this).checkedObj[id] = rowData;
                }
            }.bind(this));
        },

        /**
         * update Header selected Rows
         *
         * @method updateHeaderSelectedRows
         */

         updateHeaderSelectedRows: function () {
            this.view.getSelectedClear().setText( CommonDictionary.tableHeader.clear );
            if ( this.getCheckedRows().length === 0 ) {
                this.view.getSelected().setText( CommonDictionary.tableHeader.selectedNone );

                this.view.getSelectedClear().setStyle({
                    'display': 'none'
                });
            } else {
                this.view.getSelected().setText(utils.printf(CommonDictionary.tableHeader.selected,
                                                             Number(this.getCheckedRows().length).format('0,0')));
                this.view.getSelectedClear().removeStyle('display');
            }
        },

        /**
         * update Header Filtered
         *
         * @method updateHeaderFiltered
         */

        updateHeaderFiltered: function () {
            this.view.getFilteredClear().setText( CommonDictionary.tableHeader.clear );
            if ( _(this).filter === undefined || _(this).filter === null || jQuery.isEmptyObject(_(this).filter )) {

                this.view.getFiltered().setText("");
                this.view.getSelectedSeparator().setStyle({
                    'display': 'none'
                });
                this.view.getFilteredClear().setStyle({
                    'display': 'none'
                });
            } else {
                this.view.getFiltered().setText( CommonDictionary.tableHeader.filtered);
                this.view.getSelectedSeparator().setStyle({
                    'display': 'inline-block'
                });
                this.view.getFilteredClear().removeStyle('display');
            }
        }
    });

    /**
     * Creates pagination widget according to total rows to display
     *
     * @method createPaginationWidget
     * @param  {Integer} totalDisplayedRows Sets total number of rows
     * @private
     */
    function createPaginationWidget(pagenumber, totalDisplayedRows) {
        // remove previous pagination widget if available
        if (this.pagination) {
            this.pagination.destroy();
        }

        // Don't show the pagination if there's less than the page size.
        if (totalDisplayedRows > _(this).pageSize) {
            this.pagination = new Pagination({
                pages: Math.ceil(totalDisplayedRows / _(this).pageSize),
                selectedPage: pagenumber
            });

            this.pagination.addEventHandler('pagechange', this.getPageData.bind(this));
            adjustPaginationWidth.call(this, totalDisplayedRows);
            this.pagination.attachTo(this.view.getPaginationWidget());

            this.view.getShowRowsSeparator().setStyle({
                'display': 'inline-block'
            });

        } else {
            this.view.getPaginationWidget().setStyle({
                'width': 0
            });

            this.view.getShowRowsSeparator().setStyle({
                'display': 'none'
            });
        }

        if (this.options.widgets && this.options.widgets.showRows) {
            this.options.widgets.showRows.attachTo(this.view.getShowRowsWidget());
        }
    }

    /**
     * Updates table header
     *
     * @method updateTableHeader
     * @param  {Integer} startIndex Start index to display
     * @param  {Integer} endIndex End index to display
     * @param  {Integer} pagenumber Current page number
     * @param  {Integer} totalDisplayedRows Sets total number of rows
     * @private
     */
    function updateTableHeader(startIndex, endIndex, pagenumber, totalDisplayedRows) {
        if (totalDisplayedRows > 0) {
            // Update header information
            this.view.getCount().setText(utils.printf(this.options.headerInfo,
                                                      Number(startIndex + 1 ).format('0,0'),
                                                      Number(endIndex).format('0,0'),
                                                      Number(totalDisplayedRows).format('0,0')));
        } else {
            // Clear header information
            this.view.getCount().setText('');
        }

        this.updateHeaderSelectedRows();
        this.updateHeaderFiltered();
    }

    /**
     * Updates query params for url
     *
     * @method updateQueryParams
     * @param  {Integer} pagenumber Current page number
     * @private
     */
    function updateQueryParams(pagenumber) {
        // store query params
        _(this).queryParams.pagenumber = pagenumber;
        _(this).queryParams.pagesize = _(this).pageSize;

        // filter
        if (_(this).filter === undefined || _(this).filter === null) {
            _(this).queryParams.filter = {};
//            delete(_(this).queryParams.filter);
        } else {
            _(this).queryParams.filter = _(this).filter;
        }

        if (_(this).handleSort) {
            // sort
            if (_(this).sort === undefined || _(this).sort === null) {
                delete(_(this).queryParams.sort);
            } else {
                _(this).queryParams.sort = _(this).sort;
            }
        }
    }

    /**
     * Updates show rows widget
     *
     * @method updateShowRowsWidget
     * @private
     */
    function updateShowRowsWidget() {
        // Update value of ShowRows widget
        if (this.options.widgets && this.options.widgets.showRows) {
            this.options.widgets.showRows.setValue(_(this).pageSize);
        }
    }

    /**
     * Updates rows checks
     *
     * @method updateRowsChecks
     * @private
     */
    function updateRowsChecks() {
        var rowData, id, _checkedObj = {};

        // Clear not existing checks in case of delete some elements
        _(this).dataHandler.getProcessedData().forEach(function(rowData) {
            id = rowData[_(this).UNIQUEID];
            if (_(this).checkedObj[id]) {
                _checkedObj[id] = _(this).checkedObj[id];
            }
        }.bind(this));

        // Overide checked object
        _(this).checkedObj = _checkedObj;

        // Unselect previously selected and visible rows
        _(this).table.uncheckAllRows();

        // Select visiblie rows
        _(this).table.checkRows(function(row) {
            rowData = row.getData();
            id = rowData[_(this).UNIQUEID];
            return _(this).checkedObj[id] !== undefined;
        }.bind(this));
    }

    /**
     * Creates the pagination widget and updates the table and header.
     *
     * @method onPageLoad
     * @param {Integer} pagenumber
     * @param {Object} response
     * @private
     */
    function onPageLoad(pagenumber, data, history) {
        // Update current page number
        _(this).selectedPage = pagenumber;

        var total = data.length;

        // If startIndex > number of users --> go to page 1
        if ( ((pagenumber-1) * _(this).pageSize) > total ) {
            pagenumber = 1;
        }

        var startIndex = (pagenumber - 1) * _(this).pageSize;
        var endIndex = Math.min((pagenumber) * _(this).pageSize, total);

        createPaginationWidget.call(this, pagenumber, total);

        // Fill table with sliced data
        _(this).table.setData(data.slice(startIndex, endIndex));

        updateTableHeader.call(this, startIndex, endIndex, pagenumber, total);
        updateQueryParams.call(this, pagenumber);
        updateShowRowsWidget.call(this);

        updateRowsChecks.call(this);

        // Trigger widget event
        this.trigger('pageloaded', _(this).queryParams, history);
    }

    function adjustPaginationWidth(total) {
        var pages =  (total/ _(this).pageSize ) +1 ;

        /* jshint validthis:true */
        var view = this.view,
            paginationHolder = view.getPaginationWidget(),
            footerWidth = view.getFooter().getProperty('offsetWidth');

        if (!pages || pages === 1 || footerWidth === 0) {
            paginationHolder.removeStyle('width');
            return;
        }

        // magic formula:
        // 500 (max pagination width)
        // 30 (pagination item width) * (page count + 2 (prev + page count + next) + (1px margin * pages) + holder margin)
        // 100 page size select
        var paginationBestWidth = Math.min(500, 30 * (pages + 2) + pages + 8),
            selectLabelWidth = view.getShowRowsWidget().getProperty('offsetWidth'),
            pageSelectWidth = selectLabelWidth + 100;

        if (paginationBestWidth + pageSelectWidth >= footerWidth) {
            paginationHolder.setStyle({
                'width': '100%'
            });
        } else {
            paginationHolder.setStyle({
                'width': paginationBestWidth + 'px'
            });
        }
    }

});
