define([
    'jscore/core',
    'uit!./rolesListFilterPlugin.html',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/Selection',
    'tablelib/plugins/ColorBand',
    'tablelib/plugins/SmartTooltips',
    'tablelib/plugins/StickyScrollbar',
    'identitymgmtlib/filters/FilterPlugin',
    'identitymgmtlib/model/RolesListFilterCollection',
    'identitymgmtlib/model/RolesListFilterModel',
    'jscore/ext/privateStore',
    "i18n!identitymgmtlib/common.json",
    'tablelib/plugins/SecondHeader',
    'identitymgmtlib/widgets/TableSelectionInfoWidget',
    'identitymgmtlib/widgets/ShowRows',
    'identitymgmtlib/filters/SelectBoxQueryRoleCell/SelectBoxQueryRoleCell',
    'identitymgmtlib/filters/SearchCell/SearchCell'
], function(core, View, SortableHeader, Selection, ColorBand, SmartTooltips, StickyScrollbar, FilterPlugin, RolesListFilterCollection, RolesListFilterModel, PrivateStore, Dictionary, SecondHeader, TableSelectionInfoWidget, ShowRows, SelectBoxQueryRoleCell, SearchCell) {

    var _ = PrivateStore.create();

    var displayData = function(params) {

        _(this).sort = (params && params.sort) || _(this).sort || {
            order: 'asc',
            attribute: 'name'
        };

        _(this).filter = (params && params.filter) || _(this).filter || {
            pattern: params.filter.pattern,
            attribute: params.filter.attribute,
        };

        _(this).rolesListFilterCollection.sort(_(this).sort.attribute, _(this).sort.order);


        var data = _(this).rolesListFilterCollection
            .searchMap(_(this).filter.pattern, [_(this).filter.attribute])
            .toJSONwithModels();


        this.table.setData(data);

        refreshCheckboxTicks.call(this);
    };

    function refreshCheckboxTicks() {
        this.table.uncheckAllRows();
        this.table.checkRows(function(row) {
            return row.getData().model.getAttribute('selected');
        });
    }

    function _selectRoles(options) {

        var query = typeof options.query === 'boolean' ? options.query : true;
        var selected = typeof options.selected === 'boolean' ? options.selected : true;
        var toAssign = options.toAssign || null;

        _(this).rolesListFilterCollection.each(function(roleFilterModel) {
            if (toAssign) {
                toAssign.forEach(function(roleAssigned) {
                    if (roleAssigned === roleFilterModel.get("name")) {
                        roleFilterModel.set("selected", selected);
                        roleFilterModel.set("query", query);
                        return;
                    }
                });
            } else {
                roleFilterModel.set("selected", selected);
                roleFilterModel.set("query", query);
            }
        });
        refreshCheckboxTicks.call(this);
        updateColorBands.call(this);
    }

    function _setValues(update) {
        var rolesAssignedArray = (update && update.assigned) || this.defaultValue.assigned;
        var rolesNotAssignedArray = (update && update.not_assigned) || this.defaultValue.not_assigned;

        _selectRoles.call(this, { toAssign: rolesAssignedArray, query: true });
        _selectRoles.call(this, { toAssign: rolesNotAssignedArray, query: false });
    }

    function updateColorBands() {
        this.table.updateColorBands();
    }

    function handleColorBands() {
        _(this).rolesListFilterCollection.each(function(roleFilterModel) {
            roleFilterModel.addEventHandler('change:query', function() {
                updateColorBands.call(this);
            }.bind(this));
        }.bind(this));


    }
    return FilterPlugin.extend({
        updateValue: function(query) {
            if (query && query[this.name]) {
                this.clear();
                _setValues.call(this, query[this.name]);
            } else {
                this.clear();
            }
        },
        init: function(options) {
            FilterPlugin.prototype.init.call(this, options);
            _(this).rolesListFilterCollection = new RolesListFilterCollection();

            _(this).rolesListFilterCollection.fetch({
                success: function(models) {

                    //must be before _setValues
                    handleColorBands.call(this);

                    if (this.defaultValue !== undefined) {
                        _setValues.call(this);
                    }

                }.bind(this)
            });
        },

        addEventHandlers: function() {

            _(this).rolesListFilterCollection.addEventHandler('fetched', function() {
                displayData.call(this, {
                    sort: {
                        attribute: 'name',
                        order: 'asc'
                    },
                    filter: {
                        attribute: 'name',
                        pattern: new RegExp("", 'i')
                    }
                });
            }.bind(this));


            this.table.addEventHandler('check', function(row, selected) {
                row.getData().model.setAttribute('selected', selected);
                updateColorBands.call(this);
            }.bind(this));

            this.view.findById('RolesSelector').addEventHandler('clear', function(row, selected) {
                this.clear.call(this);
            }.bind(this));

            this.view.findById('RolesSelector').addEventHandler('no_role', function(row, selected) {
                _selectRoles.call(this, { query: false, selected: true });
            }.bind(this));

            this.table.addEventHandler('checkheader', function(row, selected) {
                _(this).rolesListFilterCollection.each(function(roleFilterModel) {
                    roleFilterModel.setAttribute('selected', selected);
                });
                updateColorBands.call(this);
            }.bind(this));

            this.table.addEventHandler('search', function(value) {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(function() {
                    displayData.call(this, {
                        filter: {
                            attribute: 'name',
                            pattern: new RegExp(value || "", 'i')
                        }
                    });
                }.bind(this), 300);
            }.bind(this));
        },

        onViewReady: function() {
            this.table = this.view.findById('rolesListFilterTable');
            this.addEventHandlers.call(this);
        },

        clear: function() {
            _selectRoles.call(this, { query: true, selected: false });
        },
        getData: function() {
            var filterCriteria = [];
            var filterAssignedCriteria = [];
            var filterNotAssignedCriteria = [];

            _(this).rolesListFilterCollection.each(function(roleFilterModel) {
                if (roleFilterModel.get('selected')) {
                    var roleName = roleFilterModel.get('name');
                    if (roleFilterModel.get('query')) {
                        filterAssignedCriteria.push(roleName);
                    } else {
                        filterNotAssignedCriteria.push(roleName);
                    }
                }
            }.bind(this));

            //in case not selected role(s)
            if (!filterAssignedCriteria.length && !filterNotAssignedCriteria.length) return;

            filterCriteria[this.name] = {
                assigned: filterAssignedCriteria,
                not_assigned: filterNotAssignedCriteria
            };

            return filterCriteria;

        },

        view: function() {
            var showRows = new ShowRows();

            return new View({
                tableOptions: {
                    modifiers: [{
                        name: 'striped'
                    }],
                    widgets: {
                        showRows: showRows
                    },
                    plugins: [
                        new SortableHeader(),
                        new SmartTooltips(),
                        new Selection({ checkboxes: true }),
                        new ColorBand({
                            color: function(row) {
                                if (row.getData().model.getAttribute('selected')) {
                                    return row.getData().model.getAttribute('query') ? "#86BC25" : "#9C9C9C";
                                } else {
                                    return;
                                }
                            }.bind(this)
                        }),
                        new StickyScrollbar(),
                        new SecondHeader()
                    ],

                    columns: [{
                        attribute: 'model',
                        cellType: SelectBoxQueryRoleCell,
                        width: '65px',
                        sortable: false,
                    }, {
                        title: Dictionary.roleTable.columns.name,
                        attribute: 'name',
                        secondHeaderCellType: SearchCell
                    }]
                }
            });
        }
    });
});
