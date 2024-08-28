define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./ResultsTableWidget.html',
    '../../../Dictionary',
    'tablelib/Table',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/SmartTooltips',
    'usermgmtlib/cells/ResultsTableCell',
    'identitymgmtlib/Utils'
], function(core, PrivateStore, View, Dictionary, Table, SortableHeader, SmartTooltips, ResultsTableCell, Utils) {

    var _ = PrivateStore.create();

    function getResultMessage(response) {
        if (response.success) {
            return {
                success: true,
                message: Dictionary.successful
            };
        } else {
            var responseJSON = response.xhr.getResponseJSON();
            var errorMessage = Utils.getErrorMessage(responseJSON.httpStatusCode, responseJSON.internalErrorCode);
            errorMessage = Utils.printf(errorMessage.internalErrorCodeMessage, response.userData.username);
            return {
                success: false,
                message: errorMessage ? errorMessage : Utils.getErrorMessage(responseJSON.httpStatusCode || '0').defaultHttpMessage
            };
        }
    }
    return core.Widget.extend({

        init: function(options) {
            this.model = options.model;
            this.data = this.parseDataForTable(options.responses);
        },

        View: function() {
            return new View({
                Dictionary: Dictionary,
            });
        },

        parseDataForTable: function(responses) {
            return responses.map(function(response) {
                return {
                    userData: this.model.get('usersToUpdate')[response.rowValue],
                    success: response.success,
                    xhr: response.xhr
                };
            }.bind(this));
        },

        addTableEventHandlers: function(resultTableData) {
            this.table.addEventHandler("sort", function(sortMode, sortAttr) {
                sortMode = sortMode === "asc" ? -1 : 1;
                resultTableData.sort(function(a, b) {
                    if (a[sortAttr].message !== undefined) {
                        if (a[sortAttr].message < b[sortAttr].message) {
                            return 1 * sortMode;
                        } else if (a[sortAttr].message > b[sortAttr].message) {
                            return -1 * sortMode;
                        }
                    } else {
                        if (a[sortAttr] < b[sortAttr]) {
                            return 1 * sortMode;
                        } else if (a[sortAttr] > b[sortAttr]) {
                            return -1 * sortMode;
                        }
                    }

                });
                this.table.setData(resultTableData);
            }.bind(this));
        },

        setupTable: function(resultTableData) {

            this.table = new Table({
                plugins: [
                    new SortableHeader(),
                    new SmartTooltips()
                ],
                data: resultTableData,
                columns: [{
                    title: Dictionary.username,
                    attribute: "username",
                    sortable: true
                }, {
                    title: Dictionary.name,
                    attribute: "name",
                    sortable: true
                }, {
                    title: Dictionary.surname,
                    attribute: "surname",
                    sortable: true
                }, {
                    title: Dictionary.result,
                    attribute: "result",
                    sortable: true,
                    cellType: ResultsTableCell
                }]
            });

            this.addTableEventHandlers(resultTableData);
        },

        onViewReady: function() {

            var resultTableData = [];
            var resultSuccessCount = 0;
            this.data.forEach(function(response) {
                resultTableData.push({
                    username: response.userData.username,
                    name: response.userData.name,
                    surname: response.userData.surname,
                    result: getResultMessage(response)
                });
                if (response.success) {
                    resultSuccessCount++;
                }
            });


            this.setupTable(resultTableData);

            this.table.attachTo(this.getElement().find('.eaUsersgroupedit-wResultsTableWidget-table'));
            this.setTopResultsBarNumbers(resultTableData.length, resultSuccessCount);
        },


        setTopResultsBarNumbers: function(total, resultSuccessCount) {
            var failedCount = total - resultSuccessCount;
            this.getElement().find('.eaUsersgroupedit-wResultsTableWidget-topResultsBar-total').setText(Utils.printf(Dictionary.applyStep.total, total ));
            this.getElement().find('.eaUsersgroupedit-wResultsTableWidget-topResultsBar-successful-text').setText(Utils.printf(Dictionary.applyStep.successful, resultSuccessCount));
            this.getElement().find('.eaUsersgroupedit-wResultsTableWidget-topResultsBar-failed-text').setText(Utils.printf(Dictionary.applyStep.failed, failedCount ));
        }
    });
});
