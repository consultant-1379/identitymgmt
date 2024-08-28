define([
    'jscore/core',
    './ConfirmationSummaryListView',
    'identitymgmtlib/Utils',
    'tablelib/Table',
    'tablelib/plugins/SortableHeader',
    'i18n!identitymgmtlib/common.json',
    'identitymgmtlib/ConfirmationStatusCell'
], function (core, View, Utils, Table, SortableHeader, Dictionary, ConfirmationStatusCell) {

    return core.Widget.extend({

        View: View,

        onViewReady: function (options) {
            var elementsArray = options.elementsArray;
            var resultTableData = [];
            var succeedCount = 0;
            elementsArray.forEach(function (element) {
                var elementName = element.key;

                resultTableData.push({
                    elementName: elementName,
                    result: element.text
                });

                if (element.status) {
                    succeedCount++;
                }


            }.bind(this));
            //this.options.statuses[0] - inactive
            this.view.setInfoDiv(options.info);
            this.view.setTotalCount(elementsArray.length);

            this.view.setFailedCount(this.options.statuses[0] + " (" + (elementsArray.length - succeedCount) + ")");
            this.view.setSucceedCount(this.options.statuses[1] + " (" + succeedCount + ")");

            var table = this.createResultTable(resultTableData, options);
            table.attachTo(this.view.getTableDiv());
        },

        createResultTable: function (data) {
            var options = this.options;
            var columnsDefinition = [
                {
                    title: options.elementNameColumnHeader,
                    attribute: "elementName",
                    sortable: true,
                },
                {
                    title: Dictionary.confirmationSummaryList.resultHeader,
                    attribute: "result",
                    sortable: true
                }
            ];

            //if (this.options.displayResponseStatusIcons) {
            columnsDefinition[1].cellType = ConfirmationStatusCell;
            //}

            var table = new Table({

                plugins: [
                    new SortableHeader()
                ],
                data: data,
                columns: columnsDefinition
            });

            table.addEventHandler("sort", function (sortMode, sortAttr) {
                sortMode = sortMode === "asc" ? -1 : 1;
                data.sort(function (a, b) {
                    if (a[sortAttr] < b[sortAttr]) {
                        return 1 * sortMode;
                    } else if (a[sortAttr] > b[sortAttr]) {
                        return -1 * sortMode;
                    } else {
                        return 0;
                    }
                });

                table.setData(data);
            });
            return table;
        }
    });

});