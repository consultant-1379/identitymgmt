/*global define, describe, it, expect */
define([
   'identitymgmtlib/RoleMgmtTable',
   'identitymgmtlib/ErrorWidget',
   'tablelib/plugins/Selection'
], function (RoleMgmtTable, ErrorWidget, Selection) {
    'use strict';

    describe('RoleMgmtTable', function() {
        var sandbox;
        var roleMgmtTable;

        var emptyObject = {};
        var emptyArray = [];
        var ascendingSort;
        var descendingSort;
        var roleMgmtTableOptions;
        var filterForData1 = createFilterObject('data', 'data1', '=');
        var positiveFilterData0 = createFilterObject('data', 'data0', '=');
        var negativeFilterData0 = createFilterObject('data', 'data0', '!=');
        var filterThatMatchesNothing = createFilterObject('data', 'non-existent-data', '=');

        var testData = [
            {
                id: 0,
                data: 'data0'
            },
            {
                id: 1,
                data: 'data1'
            }
        ];

        var onlyData0Element = [testData[0]];
        var onlyData1Element = [testData[1]];

        var mockDataSortedAscending = testData;
        var mockDataSortedDescending = [testData[1], testData[0]];

        var MockRow = function (rowData) {
            var data = rowData;
            return {
                getData: function () {
                    return data;
                }
            };
        };

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            testData = [
                {
                    id: 0,
                    data: 'data0'
                },
                {
                    id: 1,
                    data: 'data1'
                }
            ];

            roleMgmtTableOptions = {
                selectedCaption: 'Selected',
                plugins: [
                    new Selection({
                        checkboxes: true,
                        selectableRows: true,
                        multiselect: true,
                        bind: true
                    })
                ],
                columns: [
                    {
                        attribute: "id",
                        sortable: true
                    },
                    {
                        attribute: "data",
                        sortable: true
                    }
                ]
            };
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('RoleMgmtTable should be defined', function () {
            expect(RoleMgmtTable).not.to.be.undefined;
        });

        describe('RoleMgmtTable: API', function () {
            beforeEach(function() {
                roleMgmtTableOptions.unique_key = 'id',
                roleMgmtTable = new RoleMgmtTable(roleMgmtTableOptions);

                ascendingSort = createSortObject('data', roleMgmtTable.SORT.ASCENDING);
                descendingSort = createSortObject('data', roleMgmtTable.SORT.DESCENDING);
            });

            describe('getTable', function() {
                it('should return instance of Table', function() {
                    expect(roleMgmtTable.getTable()).to.be.Table;
                });
            });

            describe('setData', function() {
                it('should setData', function() {
                    roleMgmtTable.setData(testData);
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should set empty array as data', function() {
                    roleMgmtTable.setData([]);
                    expectThatTableDataIsDeepEqualTo([]);
                });

                it('should update table items counter', function() {
                    roleMgmtTable.setData(testData);
                    expectTableItemsCounterToEqual(toString(testData.length));
                });
            });

            describe('persistOnlyMatchingRows', function() {
                var callbackMatchingEverything = function() {
                    return true;
                };
                var persistOnlyItemWithIdEqualTo1 = function(dataItem) {
                    return dataItem.id === 1;
                };

                it('should remove items with id different to 1', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.persistOnlyMatchingRows(persistOnlyItemWithIdEqualTo1);
                    expectThatTableDataIsDeepEqualTo(onlyData1Element);
                });

                it('should do nothing when callback matches nothing', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.persistOnlyMatchingRows(callbackMatchingEverything);
                    expectThatTableDataIsDeepEqualTo(testData);
                    expectTableItemsCounterToEqual(toString(testData.length));
                });

                it('should do nothing when there are no items in table', function() {
                    roleMgmtTable.setData(emptyArray);
                    roleMgmtTable.persistOnlyMatchingRows(persistOnlyItemWithIdEqualTo1);
                    expectThatTableDataIsDeepEqualTo(emptyArray);
                });

                it('should do nothing when callback is not function', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.persistOnlyMatchingRows(emptyObject);
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should do nothing when no callback is passed to function', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.persistOnlyMatchingRows();
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should update table items counter after removing rows', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.persistOnlyMatchingRows(persistOnlyItemWithIdEqualTo1);
                    expectTableItemsCounterToEqual(toString(onlyData1Element.length));
                });
            });

            describe('addRow', function() {
                var rowToAdd = {
                    id: 2,
                    data: 'data2'
                };

                var expectedRowsAfterAddingAtFirstPosition = [
                    rowToAdd,
                    testData[0],
                    testData[1]
                ];

                var expectedRowsAfterAddingAtLastPosition = [
                    testData[0],
                    testData[1],
                    rowToAdd
                ];

                it('should add row to table at first position', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.addRow(rowToAdd, 0);
                    expectThatTableDataIsDeepEqualTo(expectedRowsAfterAddingAtFirstPosition);
                });

                it('should add row to table and update items counter', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.addRow(rowToAdd, 0);
                    expectTableItemsCounterToEqual(toString(expectedRowsAfterAddingAtLastPosition.length));
                });

                it('should add row to table at last position', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.addRow(rowToAdd, 2);
                    expectThatTableDataIsDeepEqualTo(expectedRowsAfterAddingAtLastPosition);
                });
            });

            describe('removeRow', function () {
                var firstRowIndex = 0;
                var secondRowIndex = 1;
                var negativeRowIndex = -1;
                var nonExistentRowIndex = testData.length + 50;

                it('should remove first row', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.removeRow(firstRowIndex);
                    expectThatTableDataIsDeepEqualTo(onlyData1Element);
                });

                it('should remove second row', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.removeRow(secondRowIndex);
                    expectThatTableDataIsDeepEqualTo(onlyData0Element);
                });

                it('should do nothing when trying to remove row with negative index', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.removeRow(negativeRowIndex);
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should do nothing when trying to remove row with index grater than number of rows', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.removeRow(nonExistentRowIndex);
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should remove first row and update items counter', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.removeRow(firstRowIndex);
                    expectTableItemsCounterToEqual(toString(onlyData1Element.length));
                });
            });

            describe('selectRows', function() {
                var rowsDataToSelectNotInTable = [
                    {
                        id: 99,
                        data: 'data99'
                    }
                ];

                it('should select row that is in table', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(onlyData0Element);
                    var selectedRowsData = roleMgmtTable.getTable().getSelectedRows()
                            .map(getDataFromRow);
                    expect(selectedRowsData).to.deep.equal(onlyData0Element);
                });

                it('should do nothing when trying to select row that is not in table', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(rowsDataToSelectNotInTable);
                    var selectedRowsData = roleMgmtTable.getTable().getSelectedRows()
                            .map(getDataFromRow);
                    expect(selectedRowsData).to.deep.equal(emptyArray);
                });

                it('should do nothing if no value is passed as parameter', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows();
                    var selectedRowsData = roleMgmtTable.getTable().getSelectedRows()
                            .map(getDataFromRow);
                    expect(selectedRowsData).to.deep.equal(emptyArray);
                });

                it('should do nothing if parameter is something else than array (e.g. object)', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(emptyObject);
                    var selectedRowsData = roleMgmtTable.getTable().getSelectedRows()
                            .map(getDataFromRow);
                    expect(selectedRowsData).to.deep.equal(emptyArray);
                });

                it('should select row and leave items counter unmodified', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(onlyData0Element);
                    expectTableItemsCounterToEqual(toString(testData.length));
                });
            });

            describe('getSelectedRowsData', function() {
                it('should return selected data objects array', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(onlyData0Element);
                    expect(roleMgmtTable.getSelectedRowsData()).to.deep.equal(onlyData0Element);
                });

                it('should return empty array if no rows are selected', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(emptyArray);
                    expect(roleMgmtTable.getSelectedRowsData()).to.deep.equal(emptyArray);
                });

                it('should return selected data from filtered table', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(onlyData0Element);
                    roleMgmtTable.filterData(filterForData1);
                    expect(roleMgmtTable.getSelectedRowsData()).to.deep.equal(onlyData0Element);
                });

                it('should return selected row data from sorted table', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(onlyData0Element);
                    roleMgmtTable.sortData(ascendingSort);
                    expect(roleMgmtTable.getSelectedRowsData()).to.deep.equal(onlyData0Element);
                });
            });

            describe('filterData', function() {
                var incorrectFilterObject = {
                    incorrectField: 'mockValue'
                };

                it('should filter out one row using positive filter', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.filterData(positiveFilterData0);
                    expectThatTableDataIsDeepEqualTo(onlyData0Element);
                });

                it('should filter out one row using negative filter', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.filterData(negativeFilterData0);
                    expectThatTableDataIsDeepEqualTo(onlyData1Element);
                });

                it('should leave empty table when no row matches filter', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.filterData(filterThatMatchesNothing);
                    expectThatTableDataIsDeepEqualTo(emptyArray);
                });

                it('should do nothing when filter object doesnt contain necessary fields', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.filterData(incorrectFilterObject);
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should filter out one row and update items counter', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.filterData(positiveFilterData0);
                    expectTableItemsCounterToEqual(toString(onlyData0Element.length));
                });

                it('should filter out all rows and then modify filter to leave only one row', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.filterData(filterThatMatchesNothing);
                    roleMgmtTable.filterData(positiveFilterData0);
                    expectThatTableDataIsDeepEqualTo(onlyData0Element);
                });
            });

            describe('resetFilter', function() {
                it('should filter out one row and then reset filter', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.filterData(positiveFilterData0);
                    roleMgmtTable.resetFilter();
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should reset counter to previous state after filter reset', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.filterData(positiveFilterData0);
                    roleMgmtTable.resetFilter();
                    expectTableItemsCounterToEqual(toString(testData.length));
                });

                it('should do nothing when reseting not set filter', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.resetFilter();
                    expectTableItemsCounterToEqual(toString(testData.length));
                });
            });

            describe('resetSort', function () {

                it('should filter out one row and then reset sorting', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.sortData(ascendingSort);
                    roleMgmtTable.resetSort();
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should not modify counter when reseting sorting', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.sortData(ascendingSort);
                    roleMgmtTable.resetSort();
                    expectTableItemsCounterToEqual(toString(testData.length));
                });

                it('should do nothing when reseting not set sorting', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.resetSort();
                    expectThatTableDataIsDeepEqualTo(testData);
                    expectTableItemsCounterToEqual(toString(testData.length));
                });
            });

            describe('sortData', function() {
                var incorrectSortObject = { incorrectKey: 'incorrectValue' };

                it('should sort rows ascending', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.sortData(ascendingSort);
                    expectThatTableDataIsDeepEqualTo(mockDataSortedAscending);
                });

                it('should sort rows descending', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.sortData(descendingSort);
                    expectThatTableDataIsDeepEqualTo(mockDataSortedDescending);
                });

                it('should do nothing when no sort criteria object is passed', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.sortData();
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should do nothing when sort object doesnt contain necessary fields', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.sortData(incorrectSortObject);
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should not modify table items counter when sorting', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.sortData(descendingSort);
                    expectTableItemsCounterToEqual(toString(testData.length));
                });

                it('should not modify items selection when sorting', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(testData);
                    roleMgmtTable.sortData(descendingSort);
                    expectThatFollowingElementsAreSelectedIgnoreOrder(testData);
                });

                it('should sort filtered data', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.filterData(negativeFilterData0);
                    roleMgmtTable.sortData(descendingSort);
                    expectThatTableDataIsDeepEqualTo(onlyData1Element);
                });
            });

            describe('Trigerred events', function() {
                var triggerSpy;
                beforeEach(function() {
                    triggerSpy = sandbox.spy(roleMgmtTable, 'trigger');
                });

                it('should trigger "pageload" event after data sorting is completed', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.sortData(descendingSort);
                    expectOnlyPageloadEventWasTriggeredIn(triggerSpy);
                });

                it('should trigger "pageload" event after data filtering is completed', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.filterData(positiveFilterData0);
                    expectOnlyPageloadEventWasTriggeredIn(triggerSpy);
                });
            });

            describe('Filter event', function() {
                it('should filter data in table - positive filter', function() {
                    roleMgmtTable.setData(testData);
                    triggerFilterEventOnDataColumn('data0', '=');
                    expectThatTableDataIsDeepEqualTo(onlyData0Element);
                });

                it('should filter data in table - negative filter', function () {
                    roleMgmtTable.setData(testData);
                    triggerFilterEventOnDataColumn('data0', '!=');
                    expectThatTableDataIsDeepEqualTo(onlyData1Element);
                });

                it('should keep selection when items are filtered', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(testData);
                    triggerFilterEventOnDataColumn('non-existent-data', '=');
                    expectThatFollowingElementsAreSelectedIgnoreOrder(testData);
                });

                it('should keep selection when all items are filtered out', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(testData);
                    triggerFilterEventOnDataColumn('non-existent-data', '=');
                    expectThatFollowingElementsAreSelectedIgnoreOrder(testData);
                    expectThatTableDataIsDeepEqualTo(emptyArray);
                });

                it('should reset filter when value is empty string', function() {
                    roleMgmtTable.setData(testData);
                    triggerFilterEventOnDataColumn('data0', '=');
                    triggerFilterEventOnDataColumn('', '=');
                    expectThatTableDataIsDeepEqualTo(testData);
                });

                it('should reset filter when value is empty string and keep selection', function () {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(onlyData0Element);
                    triggerFilterEventOnDataColumn('data0', '=');
                    triggerFilterEventOnDataColumn('', '=');
                    expectThatTableDataIsDeepEqualTo(testData);
                    expectThatFollowingElementsAreSelectedIgnoreOrder(onlyData0Element);
                });
            });

            describe('Sort event', function() {
                it('should sort data in table - ascending sort', function() {
                    roleMgmtTable.setData(testData);
                    triggerSortEventOnDataColumn('asc');
                    expectThatTableDataIsDeepEqualTo(mockDataSortedAscending);
                });

                it('should sort data in table - descending sort', function() {
                    roleMgmtTable.setData(testData);
                    triggerSortEventOnDataColumn('desc');
                    expectThatTableDataIsDeepEqualTo(mockDataSortedAscending);
                });

                it('should do nothing when sort order is incorrect', function() {
                    roleMgmtTable.setData(testData);
                    triggerSortEventOnDataColumn('incorrect_order');
                    expectThatTableDataIsDeepEqualTo(testData);
                });
            });

            describe('Checkend event', function(){
                it('should update selected items list on checkend event', function() {
                    roleMgmtTable.setData(testData);
                    triggerCheckendEventFor(onlyData0Element);
                    expectThatFollowingElementsAreSelectedIgnoreOrder(onlyData0Element);
                    expectTableSelectedItemsCounterToEqual(toString(onlyData0Element.length));
                });

                it('should update selected item when filtering is on', function() {
                    roleMgmtTable.setData(testData);
                    roleMgmtTable.selectRows(onlyData1Element);
                    roleMgmtTable.filterData(createFilterObject('data', 'data0', '='));
                    triggerCheckendEventFor(onlyData0Element);
                    expectThatFollowingElementsAreSelectedIgnoreOrder(testData);
                    expectTableSelectedItemsCounterToEqual(toString(testData.length));
                });

                it('should select and deselect items', function() {
                    roleMgmtTable.setData(testData);
                    triggerCheckendEventFor(onlyData0Element);
                    triggerCheckendEventFor([]);
                    expectThatFollowingElementsAreSelectedIgnoreOrder(emptyArray);
                });

                it('should select one item, filter and deselect this item', function() {
                    roleMgmtTable.setData(testData);
                    triggerCheckendEventFor(onlyData0Element);
                    roleMgmtTable.filterData(createFilterObject('data', 'data0', '='));
                    triggerCheckendEventFor([]);
                    expectThatFollowingElementsAreSelectedIgnoreOrder(emptyArray);
                });

                it('should select one item, filter it out and check if it is still selected', function() {
                    roleMgmtTable.setData(testData);
                    triggerCheckendEventFor(onlyData1Element);
                    roleMgmtTable.filterData(createFilterObject('data', 'data0', '='));
                    expectThatFollowingElementsAreSelectedIgnoreOrder(onlyData1Element);
                });

                it('one row should be selected after selecting all items, filtering out one item and deselect all', function() {
                    roleMgmtTable.setData(testData);
                    triggerCheckendEventFor(testData);
                    roleMgmtTable.filterData(createFilterObject('data', 'data0', '='));
                    triggerCheckendEventFor([]);
                    expectThatFollowingElementsAreSelectedIgnoreOrder(onlyData1Element);
                });
            });
        });

        describe('RoleMgmtTable: fetch data', function () {

            var fakeServer;
            var errorWidgetAttachToSpy;
            var filterLeavingOnlyMockData1 = function (dataItem) {
                return dataItem.id === 1;
            };
            var stringifiedMockData = JSON.stringify(testData);

            beforeEach(function () {
                roleMgmtTableOptions.unique_key = 'id',
                roleMgmtTableOptions.url = '/fakeUrlToGetMockRoles';

                fakeServer = sinon.fakeServer.create();
                errorWidgetAttachToSpy = sandbox.spy(ErrorWidget.prototype, 'attachTo');
            });

            afterEach(function () {
                fakeServer.restore();
                sandbox.restore();
            });

            it('should fetch data and put it into table', function () {
                fakeServer.respondWith("GET", "/fakeUrlToGetMockRoles",
                    [200, {"Content-Type": "application/json"}, stringifiedMockData]);

                roleMgmtTable = new RoleMgmtTable(roleMgmtTableOptions);

                fakeServer.respond();
                expectThatTableDataIsDeepEqualTo(testData);
            });

            it('should apply default filter if defined', function () {
                fakeServer.respondWith("GET", "/fakeUrlToGetMockRoles",
                        [200, {"Content-Type": "application/json"}, stringifiedMockData]);

                roleMgmtTableOptions.defaultFilter = filterLeavingOnlyMockData1;
                roleMgmtTable = new RoleMgmtTable(roleMgmtTableOptions);

                fakeServer.respond();
                expectThatTableDataIsDeepEqualTo(onlyData1Element);
            });

            it('should show error notification when server returns error and fetchErrorHeader option is set', function () {
                fakeServer.respondWith("GET", "/fakeUrlToGetMockRoles",
                        [404, {"Content-Type": "application/json"}, '']);

                roleMgmtTableOptions.fetchErrorHeader = "mock error header";
                roleMgmtTable = new RoleMgmtTable(roleMgmtTableOptions);

                fakeServer.respond();

                expect(errorWidgetAttachToSpy.callCount).to.equal(1);
            });

            it('should not show error notification when server returns error and fetchErrorHeader option is not set', function () {
                fakeServer.respondWith("GET", "/fakeUrlToGetMockRoles",
                        [404, {"Content-Type": "application/json"}, '']);

                roleMgmtTable = new RoleMgmtTable(roleMgmtTableOptions);

                fakeServer.respond();

                expect(errorWidgetAttachToSpy.callCount).to.equal(0);
            });

            it('should be possible to add row before data is fetched', function() {
                fakeServer = sinon.fakeServer.create({
                    autoRespondAfter : 50
                });
                fakeServer.respondWith("GET", "/fakeUrlToGetMockRoles",
                        [200, {"Content-Type": "application/json"}, stringifiedMockData]);

                var rowToAdd = {
                    id: 2,
                    data: 'data2'
                };

                roleMgmtTable = new RoleMgmtTable(roleMgmtTableOptions);
                roleMgmtTable.addRow(rowToAdd, 0);
                expectThatTableDataIsDeepEqualTo([rowToAdd]);
                fakeServer.respond();
                expectThatTableDataIsDeepEqualTo(testData);
            });
        });

        describe('RoleMgmtTable: composite key', function() {
            beforeEach(function() {
                roleMgmtTableOptions.unique_key = ['data', 'id'];
                roleMgmtTable = new RoleMgmtTable(roleMgmtTableOptions);
            });

            var incorrectFilterObject = {
                incorrectField: 'mockValue'
            };

            it('should filter out one row using positive filter', function () {
                roleMgmtTable.setData(testData);
                roleMgmtTable.filterData(positiveFilterData0);
                expectThatTableDataIsDeepEqualTo(onlyData0Element);
            });

            it('should filter out one row using negative filter', function () {
                roleMgmtTable.setData(testData);
                roleMgmtTable.filterData(negativeFilterData0);
                expectThatTableDataIsDeepEqualTo(onlyData1Element);
            });

            it('should leave empty table when no row matches filter', function () {
                roleMgmtTable.setData(testData);
                roleMgmtTable.filterData(filterThatMatchesNothing);
                expectThatTableDataIsDeepEqualTo(emptyArray);
            });

            it('should do nothing when filter object doesnt contain necessary fields', function () {
                roleMgmtTable.setData(testData);
                roleMgmtTable.filterData(incorrectFilterObject);
                expectThatTableDataIsDeepEqualTo(testData);
            });

            it('should filter out one row and update items counter', function () {
                roleMgmtTable.setData(testData);
                roleMgmtTable.filterData(positiveFilterData0);
                expectTableItemsCounterToEqual(toString(onlyData0Element.length));
            });

            it('should return selected data from filtered table', function () {
                roleMgmtTable.setData(testData);
                roleMgmtTable.selectRows(onlyData0Element);
                roleMgmtTable.filterData(filterForData1);
                expect(roleMgmtTable.getSelectedRowsData()).to.deep.equal(onlyData0Element);
            });
        });

        function triggerCheckendEventFor(rowDataArray) {
            var rowsArray = [];
            if (rowDataArray !== []) {
                rowsArray = rowDataArray.map(function (rowDataItem) {
                    return new MockRow(rowDataItem);
                });
            }
            roleMgmtTable.getTable().trigger('rowselectend', rowsArray);
        }

        function triggerSortEventOnDataColumn(order) {
            roleMgmtTable.getTable().trigger('sort', 'data', order);
        }

        function triggerFilterEventOnDataColumn(filterValue, comparator) {
            roleMgmtTable.getTable().trigger('filter', 'data', filterValue, comparator);
        }

        function expectOnlyPageloadEventWasTriggeredIn(triggerSpy) {
            expect(triggerSpy.callCount).to.equal(1);
            expect(triggerSpy.getCall(0).args[0]).to.equal('pageload');
        }

        function expectThatFollowingElementsAreSelectedIgnoreOrder(expectedDataArray) {
            if (expectedDataArray === []) {
                roleMgmtTable.getSelectedRowsData().to.deep.equal(expectedDataArray);
            }
            for (var i = 0; i < expectedDataArray.length; ++i) {
                expect(roleMgmtTable.getSelectedRowsData().map(function (item) {
                    return item.id;
                })).to.include(expectedDataArray[i].id);
            }
        }

        function expectThatTableDataIsDeepEqualTo(expectedDataArray) {
            expect(roleMgmtTable.getTable().getData()).to.deep.equal(expectedDataArray);
        }

        function getDataFromRow(row) {
            return row.getData();
        }

        function expectTableItemsCounterToEqual(itemsCount) {
            expect(roleMgmtTable.view.getCounter().getText()).to.equal(itemsCount);
        }

        function expectTableSelectedItemsCounterToEqual(selectedItemsCount) {
            expect(roleMgmtTable.view.getSelectedCounter().getText()).to.equal('(' + selectedItemsCount + ')');
        }
    });

    function toString(valueToBeConverted) {
        return '' + valueToBeConverted;
    }

    function createFilterObject(dataFieldName, value, comparator) {
        var filterObject = {};
        filterObject[dataFieldName] = {
            value: value,
            comparator: comparator
        };
        return filterObject;
    }

    function createSortObject(dataFieldName, sortOrder) {
        return {
            key: dataFieldName,
            order: sortOrder
        };
    }
});
