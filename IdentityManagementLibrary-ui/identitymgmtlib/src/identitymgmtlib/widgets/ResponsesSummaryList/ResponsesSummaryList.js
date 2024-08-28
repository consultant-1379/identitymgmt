define([
    'jscore/core',
    './ResponsesSummaryListView',
    'identitymgmtlib/Utils',
    'tablelib/Table',
    'tablelib/plugins/SortableHeader',
    'i18n!identitymgmtlib/common.json',
    'identitymgmtlib/ResponseStatusCell'
], function (core, View, Utils, Table, SortableHeader, Dictionary, ResponseStatusCell) {

    return core.Widget.extend({

        View: View,

        onViewReady: function (options) {
            var statusArray = options.data; // Each element of 'statusArray' is an Array!: [0] Element Name [1] Http response code or http response object
            var successCounter = 0;
            var resultTableData = [];

            statusArray.forEach(function (singleStatusArray) {
                var resultRowContent,
                    elementName = singleStatusArray[0],
                    statusCode = (singleStatusArray[1] === 204) ? 200 : singleStatusArray[1],
                    errorMessage = Utils.getErrorMessage(statusCode, singleStatusArray[2]),
                    errorData=singleStatusArray[3],
                    responseMessage = errorMessage.internalErrorCodeMessage || errorMessage.defaultHttpMessage;
                if (this.options.displayResponseStatusIcons) {
                    resultRowContent = {
                        success: isSuccess(statusCode),
                        message: Utils.printf(responseMessage, elementName, errorData)
                    };
                } else {
                    resultRowContent = Utils.printf(responseMessage, elementName, errorData);
                }

                if (isSuccess(statusCode)) {
                    successCounter++;
                }
                resultTableData.push({
                    elementName: elementName,
                    result: resultRowContent
                });
            }.bind(this));

            if (successCounter === 0 || options.hideStatusCounters) {
                this.view.hideStatusSuccededField();
                this.view.hidetatusFaileddField();
            }
            if (options.hideStatusCounters) {
                this.view.hideStatusTotalField();
            }

            var failedCounter = statusArray.length - successCounter;

            this.view.setTotalCount(statusArray.length);
            this.view.setSuccededCount(successCounter);
            this.view.setFailedCount(failedCounter);

            var table = this.createResultTable(resultTableData, options);
            table.attachTo(this.view.getTableDiv());
        },

        createResultTable: function (data) {
            var options = this.options;
            var columnsDefinition = [
                {
                    title: options.elementNameColumnHeader,
                    attribute: "elementName",
                    sortable: true
                },
                {
                    title: Dictionary.responsesSummaryList.resultHeader,
                    attribute: "result",
                    sortable: true
                }
            ];

            if (this.options.displayResponseStatusIcons) {
                columnsDefinition[1].cellType = ResponseStatusCell;
            }

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

    function isSuccess(statusCode) {
        return statusCode === 200 || statusCode === 204;
    }
});