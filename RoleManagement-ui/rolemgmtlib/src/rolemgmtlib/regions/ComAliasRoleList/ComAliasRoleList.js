define([
    'jscore/core',
    'jscore/ext/net',
    'identitymgmtlib/FilterByStringHeaderCell',
    'identitymgmtlib/RoleMgmtTable',
    'tablelib/plugins/Selection',
    'tablelib/plugins/StickyHeader',
    'tablelib/plugins/SecondHeader',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/ResizableHeader',
    'i18n!rolemgmtlib/dictionary.json',
    './ComAliasRoleListView'
], function (core, net, FilterByStringHeaderCell, Table, Selection, StickyHeader, SecondHeader, SortableHeader, ResizableHeader, Dictionary, View ) {

    var filters = {};

    return core.Region.extend({

        View: View,

        onStart: function() {
            this.dataLoadedFlag = false;
            this.selectedItemsReceivedFlag = false;
            if(this.table) {
                this.table.destroy();
            }
            this.isEditable = this.options.action === 'display' ? false : true;
            this.refresh();
            this.getEventBus().subscribe("comrolesTable:selectRoles", this.onRolesToSelectReceived.bind(this));
        },

        refresh: function() {
            this.createTable();
        },

        onStop: function() {
            this.table.destroy();
        },

        createTable: function() {
            this.table = new Table({
                title: Dictionary.comAliasDetails.table_title,
                url: '/oss/idm/rolemanagement/roles',
                defaultFilter: function(element) { return element.type==='com'; },
                fetchErrorHeader: Dictionary.comAliasDetails.fetch_error_header,
                fetchErrorContent: Dictionary.comAliasDetails.fetch_error_content,
                selectedCaption: Dictionary.comAliasDetails.selected_caption,
                unique_key: 'name',
                tooltips: true,
                plugins: [
                    new Selection({
                        checkboxes: this.isEditable,
                        selectableRows: this.isEditable,
                        multiselect: this.isEditable,
                        bind: this.isEditable
                    }),
                    new ResizableHeader(),
                    new StickyHeader({
                        topOffset: 32
                    }),
                    new SecondHeader(),
                    new SortableHeader()
                ],
                columns: [
                    {
                        title: Dictionary.comAliasDetails.name_column_header,
                        attribute: "name",
                        secondHeaderCellType: FilterByStringHeaderCell,
                        sortable: true,
                        resizable: true,
                        width: "300px"
                    },
                    {
                        title: Dictionary.comAliasDetails.description_column_header,
                        attribute: "description",
                        secondHeaderCellType: FilterByStringHeaderCell,
                        resizable: true,
                        sortable: true
                    }
                ]
            });

            this.addPageLoadedHandler();
            this.addRowSelectionHandler();
            this.attachTable();
        },

        addPageLoadedHandler: function() {
            if( ! this.isEditable) {
                this.tableHandlerId = this.table.addEventHandler('pageload', function() {
                    this.dataLoadedFlag = true;
                    this.displayOnlySelectedRows(this.selectedItems);
                }.bind(this));
            }
        },

        displayOnlySelectedRows: function(itemsToSelect) {
            if(this.dataLoadedFlag && this.selectedItemsReceivedFlag){
                if(itemsToSelect) {
                    this.table.removeEventHandler('pageload', this.tableHandlerId);
                    this.table.persistOnlyMatchingRows(function(dataItem) {
                        for (var i = 0; i < itemsToSelect.length; ++i) {
                            if (dataItem.name === itemsToSelect[i]) {
                                return true;
                            }
                        }
                    });
                }
            }
        },

        selectRows: function(itemsToSelect) {
            this.table.selectRows(itemsToSelect);
        },

        attachTable: function() {
            this.table.attachTo(this.view.getTable());
        },

        addRowSelectionHandler: function() {
            this.table.getTable().addEventHandler("rowselectend", this.addRolesToModel.bind(this));
        },

        addRolesToModel: function () {
            this.getEventBus().publish("comAliasRoleList:addComRoles", this.getSelectedRolesName());
            this.selectedItems = this.getSelectedRolesName();
        },

        getSelectedRolesName: function() {
            var roles =  this.table.getSelectedRowsData().map(function(row) {
                return row.name;
            });
            return roles;
        },

        onRolesToSelectReceived: function(roleObjects) {
            if(roleObjects) {
                this.selectedObjects = roleObjects;
                this.selectedItems = roleObjects.map(function(role) {
                    return role.name;
                });
                this.selectedItemsReceivedFlag = true;

                this.selectOrDisplayRoles();
            }
        },

        selectOrDisplayRoles: function() {
            if(this.isEditable) {
                this.selectRows(this.selectedObjects);
            } else {
                this.displayOnlySelectedRows(this.selectedItems);
            }
        }
    });
});
