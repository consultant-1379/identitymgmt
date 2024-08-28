define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./UsernameList.html',
    '../../../Dictionary',
    'tablelib/Table',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/SecondHeader',
    'identitymgmtlib/FilterByStringHeaderCell'
], function (core, PrivateStore, View, Dictionary, Table, SortableHeader, SecondHeader, FilterByStringHeaderCell) {
    'use strict';

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function (options) {
            _(this).options = options;
            this.view = new View(_(this).options);
        },

        onViewReady: function() {
            _(this).table = _createTable(_(this).options.usernames);
            _(this).table.attachTo(this.getTableContainer());
        },

        setData: function(data) {
            data = data || {};
            var usernames = data.usernames || [];

            _(this).table.destroy();
            _(this).table = _createTable(usernames);
            _(this).table.attachTo(this.getTableContainer());
            this.getLabel().setText(data.label);
        },

        getTableContainer: function() {
            return this.view.findById('tableContainer');
        },

        getLabel: function() {
            return this.view.findById('label');
        }
    });

    function _createTable(data) {
        data = data || [];
        var tableData = [];

        data.forEach(function(element) {
            tableData.push({
                name: element
            });
        });

        var columnsDefinition = [
            {
                title: Dictionary.importAnalysis.username,
                attribute: "name",
                sortable: true,
                secondHeaderCellType: FilterByStringHeaderCell
            }
        ];

        var table = new Table({
            plugins: [
                new SortableHeader(),
                new SecondHeader()
            ],
            data: tableData,
            columns: columnsDefinition
        });

        table.addEventHandler("sort", function(sortMode, sortAttr) {
            sortMode = sortMode === "asc" ? -1 : 1;
            tableData.sort(function(a, b) {
                if (a[sortAttr].toLowerCase() < b[sortAttr].toLowerCase()) {
                    return 1 * sortMode;
                } else if (a[sortAttr].toLowerCase() > b[sortAttr].toLowerCase()) {
                    return -1 * sortMode;
                } else {
                    return 0;
                }
            });
            table.setData(tableData);
        });

        table.addEventHandler("filter", function(attribute, value, comparator) {
            var filteredData = tableData.filter(function(element) {
                switch (comparator) {
                    case "=":
                        return element[attribute].search(new RegExp(value, "i")) !== -1;
                    case "!=":
                        return element[attribute].search(new RegExp(value, "i")) === -1;
                }
            });
            table.setData(filteredData);
        });
        return table;
    }

});