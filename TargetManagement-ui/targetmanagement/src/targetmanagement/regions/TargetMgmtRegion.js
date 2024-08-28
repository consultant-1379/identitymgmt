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
    'jscore/ext/net',
    'identitymgmtlib/PaginatedTable',
    'identitymgmtlib/widgets/ShowRows',
    'tablelib/plugins/Selection',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/StickyScrollbar',
    './TargetMgmtRegionView',
    '../ActionsManager',
    'i18n!targetmanagement/app.json'
], function(core, net, PaginatedTable, ShowRows, Selection, SortableHeader, ResizableHeader, StickyScrollbar, View, ActionsManager, Dictionary) {

    return core.Region.extend({

        View: View,
        queryParams : {},

        /**
         * Starts the content.
         *
         * @method onStart
         */
        onStart: function() {
            this.setupTable();
        },

        /**
         * All table setup code.
         *
         * @method setupTable
         */
        setupTable: function() {
            // If the table already exists no need to recreate it.
            // Instead forcefully fetch page one again. This prevent flickering.
            if (!this.paginatedTable) {
                var urlParam;
                // Create widgets
                var showRows = new ShowRows();

                // Create the paginated table using the widget from the "commonlib".
                this.paginatedTable = new PaginatedTable({
                    title: Dictionary.targetGroups,
                    url: '/oss/idm/targetgroupmanagement/targetgroups',
                    headerInfo: Dictionary.tableHeaderInformation,
                    uniqueID: 'name',
                    pageSize: this.options.locationController.getParameter("pagesize") || 10,
                    pageNumber: this.options.locationController.getParameter("pagenumber") || 1,
                    filter: this.options.locationController.getParameter("filter") || null,
                    widgets: {
                        showRows: showRows
                    },
                    columns: [{
                        title: Dictionary.targetMgmt.targetNameHeader,
                        attribute: 'name',
                        width: '200px',
                        resizable: true,
                        sortable: true

                    }, {
                        title: Dictionary.targetMgmt.targetDescriptionHeader,
                        attribute: 'description',
                        width: '800px',
                        resizable: true,
                        sortable: true

                    }],
                    sort: {
                        attribute: 'name',
                        order: 'asc'
                    },
                    plugins: [
                        new SortableHeader(),
                        new ResizableHeader({showFillerColumn: false}),
                        new StickyScrollbar()
                    ]
                });

                this.paginatedTable.setQueryParam("filter", this.options.locationController.getParameter("filter"));

                // Configure widgets
                showRows.configure({
                    paginatedTable: this.paginatedTable
                });

                // Set force data reload from server to false
                this.forceXHR = false;
            }

            // Add listeners for owning widgets
            this.addEventHandlers();

            this.paginatedTable.attachTo(this.view.getTable());
            this.paginatedTable.refreshData();
        },

        getTable: function() {
            return this.paginatedTable;
        },

        refreshDataNeeded: function() {
            this.forceXHR = true;
        },

        addEventHandlers: function() {
            this.options.filterWidget.addEventHandler('filter:apply', function (filter) {
//                this.paginatedTable.setQueryParam("filter", filter);
                this.paginatedTable.filter(filter, false);
                this.options.locationController.setParameter("filter", filter);
            }.bind(this));

            this.options.filterWidget.addEventHandler('filter:clear', function () {
                this.paginatedTable.resetFilter(false);
                this.options.locationController.removeParameter('filter');
            }.bind(this));

            this.options.filterWidget.addEventHandler('filter:cancel', function () {
                this.paginatedTable.resetFilter(false);
                this.options.locationController.removeParameter('filter');
            }.bind(this));

            this.getEventBus().subscribe('mainregion:refreshdata', function() {
                this.paginatedTable.getPageData(); // TODO: what for, and why not in if statementg?
                if (this.paginatedTable) {
                    this.paginatedTable.refreshData();
                }
            }.bind(this));

           this.options.locationController.addParameterListener("filter", function(filter) {
                this.options.filterWidget.setFilterValues(filter);
                this.paginatedTable.setQueryParam("filter", filter);
            }.bind(this));

            this.options.locationController.addParameterListener("pagesize", function(pagesize) {
                if (this.paginatedTable) {
                    this.paginatedTable.setQueryParam("pagesize", pagesize);
                }
            }.bind(this));

            this.options.locationController.addParameterListener("pagenumber", function(pagenumber) {
                if (this.paginatedTable) {
                    this.paginatedTable.setQueryParam("pagenumber", pagenumber);
                }
            }.bind(this));

            this.paginatedTable.addEventHandler('pageloaded', function(queryParams) {
                Object.keys(queryParams).forEach(function (key) {
                    this.options.locationController.setParameter(key, queryParams[key], true);
                }.bind(this));
                this.triggerContextActions(this.paginatedTable.getCheckedRows());
            }.bind(this));

            //EventHandler for ContextMenu
            this.paginatedTable.addEventHandler('checkend', function(checkedRows) {
                this.triggerContextActions(checkedRows);
            }.bind(this));

        },

        /**
         * Figures out what actions to show on row select.
         *
         * @method triggerContextActions
         * @param {Array<Row>} checkedRows
         */
        triggerContextActions: function(checkedRows) {
            if (checkedRows && checkedRows.length > 0) {
                var actions = ActionsManager.getContextActions(checkedRows);
                this.getEventBus().publish('topsection:contextactions', actions);
            } else {
                this.getEventBus().publish('topsection:leavecontext');
            }
        },

        resetFilter: function() {
            this.paginatedTable.clearUrlParams();
            this.paginatedTable.resetFilter(true);
            this.paginatedTable.refreshData();
        }

    });

});
