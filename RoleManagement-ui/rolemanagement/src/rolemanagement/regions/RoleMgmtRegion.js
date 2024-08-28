/*******************************************************************************
  * COPYRIGHT Ericsson 2016
  *
  * The copyright to the computer program(s) herein is the property of
  * Ericsson Inc. The programs may be used and/or copied only with written
  * permission from Ericsson Inc. or in accordance with the terms and
  * conditions stipulated in the agreement/contract under which the
  * program(s) have been supplied.
*******************************************************************************/

define([
    'container/api',
    'jscore/core',
    'identitymgmtlib/PaginatedTable',
    'identitymgmtlib/widgets/ShowRows',
    'identitymgmtlib/widgets/TableSelectionInfoWidget',
    'identitymgmtlib/Utils',
    'tablelib/plugins/Selection',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/StickyScrollbar',
    '../widgets/StatusCell/StatusCell',
    'identitymgmtlib/widgets/RoleTypeCell/RoleTypeCell',
    '../Utils',
    '../Dictionary',
    '../ActionsManager',
    'jscore/ext/net',
    './RoleMgmtRegionView',
    '../widgets/DescriptionCell/DescriptionCell'
], function(container, core, PaginatedTable, ShowRows, TableSelectionInfo, Utils, Selection, SortableHeader, ResizableHeader, StickyScrollbar, StatusCell, RoleTypeCell, RoleUtils, Dictionary, ActionsManager, net, View, DescriptionCell) {

    var addField = function() {
        return function addField(query) {
            query.data.forEach(function(role) {
                role.typeColumn = Utils.type2String(role.type);
                role.statusColumn = RoleUtils.status2String(role.status);
            });
        };
    };

    return core.Region.extend({

        View: View,

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

                var tableSelectionInfo = new TableSelectionInfo({
                    icon: 'ebIcon ebIcon_dialogInfo',
                    itemSingularPredicate: Dictionary.tableSelectionInfoWidget.roleSingularPredicate,
                    itemPluralPredicate: Dictionary.tableSelectionInfoWidget.rolePluralPredicate
                });

                // Create widgets
                var showRows = new ShowRows();

                // Create the paginated table using the widget from the "commonlib".
                this.paginatedTable = new PaginatedTable({
                    title: Dictionary.roles,
                    headerInfo: Dictionary.tableHeaderInformation,
                    uniqueID: 'name',
                    pageSize: this.options.locationController.getParameter("pagesize") || 10,
                    pageNumber: this.options.locationController.getParameter("pagenumber") || 1,
                    filter: this.options.locationController.getParameter("filter") || null,
                    widgets: {
                        showRows: showRows,
                        selectAllNotification: tableSelectionInfo
                    },
                    url: '/oss/idm/rolemanagement/roles',
                    updateData: addField.call(this),
                    columns: [{
                        title: Dictionary.roleMgmt.RoleNameHeader,
                        attribute: 'name',
                        width: '350px',
                        resizable: true,
                        sortable: true
                    }, {
                        title: Dictionary.roleMgmt.RoleTypeHeader,
                        attribute: 'typeColumn',
                        width: '150px',
                        resizable: true,
                        sortable: true,
                    }, {
                        title: Dictionary.roleMgmt.RoleDescriptionHeader,
                        attribute: 'description',
                        width: '700px',
                        resizable: true,
                        sortable: true,
                    }, {
                        title: Dictionary.roleMgmt.RoleStatusHeader,
                        attribute: 'statusColumn',
                        width: '150px',
                        resizable: true,
                        sortable: true,
                        cellType: StatusCell
                    }],
                    sort: {
                        attribute: 'name',
                        order: 'asc'
                    },
                    plugins: [
                        new SortableHeader(),
                        new StickyScrollbar(),
                        new ResizableHeader()
                    ]
                });

                // Configure widgets
                showRows.configure({
                    paginatedTable: this.paginatedTable
                });

                tableSelectionInfo.configure({
                    paginatedTable: this.paginatedTable
                });
            }

            // Add listeners for owning widgets
            this.addEventHandlers();

            this.paginatedTable.attachTo(this.view.getTable());
        },

        getTable: function() {
            return this.paginatedTable;
        },

        addEventHandlers: function() {
            container.getEventBus().subscribe("userrole:roleupdated", function(_updatedRoleName) {
                this.updatedRoleUniqueId = _updatedRoleName;
            }.bind(this));

            this.getEventBus().subscribe('mainregion:refreshdata', function() {
                if (this.paginatedTable) {
                    this.paginatedTable.refreshData();
                }
            }.bind(this));

            this.getEventBus().subscribe('mainregion:filter', function(criteria) {
                if (this.paginatedTable) {
                    this.paginatedTable.filter(criteria);
                }
            }.bind(this));

            this.getEventBus().subscribe('mainregion:resetfilter', function() {
                if (this.paginatedTable) {
                    this.paginatedTable.resetFilter();
                }
                this.options.locationController.removeParameter("filter");
            }.bind(this));

            this.getEventBus().subscribe('layouts:rightpanel:beforechange', function(visible, regionValue) {
                if (regionValue === 'summary' && !visible) {
                    this.triggerContextActions(this.paginatedTable.getCheckedRows());
                } else if (regionValue !== 'summary' && visible) {
                    this.triggerContextActions(this.paginatedTable.getCheckedRows());
                }
            }.bind(this));

            this.options.locationController.addParameterListener("filter", function(filter) {
                this.getEventBus().publish("filters:updatevalues", filter);
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
                if (this.updatedRoleUniqueId) {
                    this.paginatedTable.checkRowByUniqueId(this.updatedRoleUniqueId);
                    this.updatedRoleUniqueId = undefined;
                }

                this.triggerContextActions(this.paginatedTable.getCheckedRows()); //Refresh top section after delete
                Object.keys(queryParams).forEach(function (key) {
                    this.options.locationController.setParameter(key, queryParams[key], true);
                }.bind(this));
                this.getEventBus().publish('rolemgmt:checkedRows', this.paginatedTable.getCheckedRows());


            }.bind(this));

            //EventHandler for ContextMenu
            this.paginatedTable.addEventHandler('rowevents:contextmenu', function (rows, e) {
                // Don't show menu if actions list is empty
                var menuItems = ActionsManager.getContextActions(rows);
                if(menuItems.length > 0 ) {
                    container.getEventBus().publish('contextmenu:show', e, menuItems);
                } else {
                    e.preventDefault();
                }
            }.bind(this));

            this.paginatedTable.addEventHandler('checkend', function(checkedRows) {
                this.triggerContextActions(checkedRows);
                this.getEventBus().publish('rolemgmt:checkedRows', checkedRows);
            }.bind(this));

        },

        /**
         * Figures out what actions to show on row select.
         *
         * @method triggerContextActions
         * @param {Array<Row>} checkedRows
         */
        triggerContextActions: function(checkedRows) {
            if ((checkedRows && checkedRows.length > 0) || ActionsManager.isRoleSummaryVisible()) {
                var actions = ActionsManager.getContextActions(checkedRows);
                this.getEventBus().publish('topsection:contextactions', actions);
            } else {
                this.getEventBus().publish('topsection:leavecontext');
            }
        }
    });
});
