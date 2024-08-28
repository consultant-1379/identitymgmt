define([
    'jscore/core',
    'jscore/ext/net',
    'jscore/ext/privateStore',
    'jscore/ext/utils/base/underscore',
    'container/api',
    'tablelib/Table',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/RowEvents',
    'tablelib/plugins/QuickFilter',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/VirtualSelection',
    'tablelib/plugins/VirtualScrolling',
    'widgets/InlineMessage',
    'identitymgmtlib/ErrorWidget',
    "./TargetsListWidgetView",
    'i18n!targetmgmtlib/dictionary.json',
    '../../model/DataService'
], function (core, net, PrivateStore, underscore, container, Table, ResizableHeader, RowEvents, QuickFilter, SortableHeader, VirtualSelection, VirtualScrolling, InlineMessage, ErrorWidget, View, Dictionary, dataService) {

    var _ = PrivateStore.create();

    function showLoader() {
        container.getEventBus().publish('container:loader');
    }

    function hideLoader() {
        container.getEventBus().publish('container:loader-hide');
    }

    return core.Widget.extend({
        view: function () {
            return new View({
                title: Dictionary.targetListWidget.title
            });
        },

        init: function (options) {
        },

        onDestroy: function () {
            core.Window.removeEventHandler(this.windowResizeEvtId);
        },

        onViewReady: function () {
            showLoader.call(this);
            this.sortAttribute = 'name';
            this.sortMode = 'asc';
            fetchData.call(this);
            this.windowResizeEvtId = core.Window.addEventHandler('resize', this.setFullHeight.bind(this));
        },

        setFullHeight: function () {
            var windowHeight = core.Window.getProperty('innerHeight'),
                element = this.getElement(),
                eltPosition = element.getPosition();

            element.setStyle({height: (windowHeight - eltPosition.top ) + 'px'});

            if (this.table) {
                this.table.redraw();
            }
        },

        updateTable: function() {
            this.view.getTableHeader().setText(Dictionary.targetListWidget.title + " (" + this.data.length + ")");
            if ( this.table ) {
                if (this.options.action === 'edit') {
                    this.table.uncheckAllIds();
                }

                if ( this.table.getVirtualScrollBar() ) {
                    this.table.getVirtualScrollBar().setPosition(0);
                }
                this.table.reload();
            }
        },


        setTable: function () {
            // Create table for the first time
            var columns = [{
                title: Dictionary.targetListWidget.column.target_name,
                attribute: 'name',
                filter: {
                    type: 'text',
                    options: {
                        submitOn: 'input',
                        submitDelay: 250,
                        placeholder: Dictionary.targetListWidget.typeToFilter
                    }
                },
                width: '800px',
                sortable: true,
                resizable: true
            }, {
                title: Dictionary.targetListWidget.column.target_type,
                attribute: 'targetTypeName',
                filter: {
                    type: 'text',
                    options: {
                        submitOn: 'input',
                        submitDelay: 250,
                        placeholder: Dictionary.targetListWidget.typeToFilter
                    }
                },
                width: '400px',
                sortable: true,
                resizable: true
            }];

            var plugins =   [ new SortableHeader(),
                              new ResizableHeader({showFillerColumn: false}) ,
                              new QuickFilter({visible: true}),
                              new VirtualScrolling( {
                                  totalRows: this.data.length,
                                  getData: this.getDataRequest.bind(this),
                                  redrawMode: VirtualScrolling.RedrawMode.SOFT
                                }) ];

            if (this.options.action === 'edit') {
                var sortAttribute = this.sortAttribute;
                var sortMode = this.sortMode;

                plugins.push(new VirtualSelection ({
                    bind: true,
                    checkboxes: true,
                    multiselect: true,
                    selectableRows: true,
                    getIds: function (start, end, success, error) {
                        dataService.getIds(start, end, sortAttribute, sortMode)
                            .then(success)
                            .catch(error);
                    },
                    getAllIds: function (success, error) {
                        dataService.getAllIds(sortAttribute, sortMode)
                            .then(success)
                            .catch(error);
                    }
                }));

                plugins.push(new RowEvents({
                    events: ['contextmenu']
                }));
            }

            this.table = new Table({
                unique_key: 'name',
                plugins: plugins,
                modifiers: [
                    {name: "striped"}
                ],
                columns: columns
            });

            this.infoMessage = new InlineMessage({
                header: Dictionary.targetListWidget.noData.header,
                description: Dictionary.targetListWidget.noData.message
            });


            this.table.setSortIcon( this.sortMode, this.sortAttribute );

            this.table.addEventHandler("sort", function (sortMode, attribute) {
                this.sortMode = sortMode;
                this.sortAttribute = attribute;

                // set scroll in the fake div to the top
                this.table.getVirtualScrollBar().setPosition(0);
                this.table.reload();
            }.bind(this));

            this.table.addEventHandler('rowevents:contextmenu', _contextMenuHandler.bind(this));
            this.table.addEventHandler('idcheckend', _checkend.bind(this));

            this.setFullHeight();

            this.table.addEventHandler('filter:change', this.onTableFilter.bind(this));

            // Attach table to DOM
            this.table.attachTo(this.view.getTableHolder());
        },

        onTableFilter: function (filters) {
            dataService.setFilter(filters);
            this.table.setTotalRows(dataService.getDataLength());
            this.table.reload();

            if (dataService.getDataLength() === 0) {
                this.infoMessage.attachTo(this.view.getMessageHolder());
                this.view.getMessageHolder().setStyle("text-align", "center");
                this.view.getMessageHolder().setStyle("padding", "5px");
            } else {
                this.infoMessage.detach();
            }
        },

        getDataRequest: function (index, length, callback) {
            // provide the service which sorting we expect
            // as well as the section of data to load
            var sortAttr = this.sortAttribute,
                sortMode = this.sortMode;

            dataService.loadData(index, length, sortAttr, sortMode)
                .then(function (response) {

                    var resData = response.data;

                    // Change message in annotated scroll bar
                    if (resData !== undefined && resData.length > 0 ) {

                        var start = "";
                        if ( resData[0] !== undefined  ) {
                            start = resData[0][sortAttr];
                        }

                        var end = "";
                        if ( resData[resData.length - 1] !== undefined ) {
                            end = resData[resData.length - 1][sortAttr];
                        }

                        if (typeof start === 'string') {
                            // truncate long text to the relevant part for usability
                            start = start.substr(0, 20);
                            end = end.substr(0, 20);
                        }

                        this.table.getVirtualScrollBar().setAnnotationText(start + ' - ' + end);
                    }

                    callback(resData);
                }.bind(this))
                .catch(showErrorNotificaton.bind(this));
        },

        getOriginalData: function() {
            return this.originalData;
        },

        getSelectedRows: function() {
            return _getCheckedRows.call(this);
        },

        getTableWidget: function() {
            return this.table;
        },

        addRowsToTargetsTable: function (targetsArrayToAdd) {
            this.targetsArrayToAdd = targetsArrayToAdd;
            _updateNewRows.call(this);
        },

        /**
         * Removes rows from Targets table on VIEW/EDIT target group page.
         *
         * @param targetsArrayToRemove array of objects representing Target entities attached to Target Group.
         * Each Target object in this array should contain at least one property: 'name'.
         */
        removeRowsFromTargetsTable: function (targetsArrayToRemove) {
            if(targetsArrayToRemove) {

                var targetNamesToRemove = targetsArrayToRemove
                    .map(function(targetObject) {
                        return targetObject.name;
                    });

                this.data = this.data.filter(function(rowObject) {
                    for (var i in targetNamesToRemove) {
                        if (targetNamesToRemove[i] === rowObject.name) {
                            return false;
                        }
                    }
                    return true;
                });

                this.table.setTotalRows(this.data.length);
                dataService.setData(this.data, false);
                this.updateTable();
            }
        }
    });

    function fetchData() {
        if (this.pageXhr) {
            this.pageXhr.abort();
        }

        this.pageXhr = net.ajax({
            url: '/oss/idm/targetmanagement/targets?targetgroups=' + this.options.targetGroup,
            dataType: 'json',
            success: function(response) {
                refreshTableData.call(this, response);
            }.bind(this),
            error: showErrorNotificaton.bind(this)
        });
    }

    function refreshTableData(response) {
        this.originalData = response;

        this.data = this.originalData.slice();
        dataService.setData(this.data, true);

        this.setTable();
        this.updateTable();

        this.trigger('pageload');
        hideLoader.call(this);
    }

    function showErrorNotificaton(msg) {
        new ErrorWidget({
            header: Dictionary.targetListWidget.fetch_targets_error_header,
            content: Dictionary.targetListWidget.fetch_targets_error_content
        }).attachTo(this.getElement());
        hideLoader.call(this);
    }

    function _updateNewRows() {
        if (this.targetsArrayToAdd) {
            var currentTargetNamesArray = this.data
                .map(function(row) {
                    return row.name;
                });

            var filterTargetsToAdd = this.targetsArrayToAdd
                .filter(function(targetToAdd) {
                    return !underscore.contains(currentTargetNamesArray, targetToAdd.name);
                });
                filterTargetsToAdd.forEach(function (target) {
                    this.data.push(target);
                }.bind(this));
        }

        this.table.setTotalRows(this.data.length);
        // Clean Filter and remove nodata info message (if present)
        this.table.setFilters({targetTypeName:"", name:""});
        this.infoMessage.detach();
        dataService.setData(this.data, true);
        this.updateTable();
    }

    function _contextMenuHandler(row, contextMenuEvent) {
        var currentlyCheckedRows = _getCheckedRows.call(this);

        var isCheckedRowSelected = underscore.contains(currentlyCheckedRows, row.getData());

        if(currentlyCheckedRows && currentlyCheckedRows.length > 0 && isCheckedRowSelected) {
            this.trigger('rowevents:contextmenu', currentlyCheckedRows, contextMenuEvent);
        } else {
            // Righ clik on a not checked row
            contextMenuEvent.preventDefault();

            this.table.unselectAllIds();
            this.table.addCheckedIds(row.getData().id);
        }
    }

    function _getCheckedRows() {
        return this.data.filter(function(rowObject) {
            return underscore.contains(this.table.getCheckedIds(), rowObject.id);
        }.bind(this));

    }

    function _checkend() {
        this.trigger("checkend", _getCheckedRows.call(this) );
    }

});
