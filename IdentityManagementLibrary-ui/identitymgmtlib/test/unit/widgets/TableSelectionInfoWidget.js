define([
    'i18n!identitymgmtlib/common.json',
    'identitymgmtlib/PaginatedTable',
    'identitymgmtlib/Utils',
    'identitymgmtlib/widgets/TableSelectionInfoWidget'
], function (Dictionary, PaginatedTable, Utils, TableSelectionInfoWidget) {

    describe('TableSelectionInfoWidget', function () {

        var sandbox, tableSelectionInfoWidget, paginatedTableStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            tableSelectionInfoWidget = new TableSelectionInfoWidget({
                icon: 'ebIcon ebIcon_dialogInfo',
                itemSingularPredicate: 'mockCustomItemSingularPredicate',
                itemPluralPredicate: 'mockCustomItemPluralPredicate'
            });

            paginatedTableStub = new PaginatedTable({
                url: 'fakeUrl'
            });

        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('init()', function () {

            it('should initialise custom view', function() {
                expect(tableSelectionInfoWidget.view).not.to.be.undefined;
            });

            it('should set default item predicates if no custom defined', function() {
                tableSelectionInfoWidget = new TableSelectionInfoWidget({
                    icon: 'ebIcon ebIcon_dialogInfo',
                });
                expect(tableSelectionInfoWidget.itemSingularPredicate).to.equal(Dictionary.tableSelectionInfoWidget.defaultItemSingularPredicate);
                expect(tableSelectionInfoWidget.itemPluralPredicate).to.equal(Dictionary.tableSelectionInfoWidget.defaultItemPluralPredicate);
            });

            it('should set custom item predicates if provided', function() {
                expect(tableSelectionInfoWidget.itemSingularPredicate).to.equal('mockCustomItemSingularPredicate');
                expect(tableSelectionInfoWidget.itemPluralPredicate).to.equal('mockCustomItemPluralPredicate');
            });
        });

        describe('onViewReady()', function () {

            beforeEach(function() {
                sandbox.stub(tableSelectionInfoWidget.view, 'hideSelectedMsg');
                tableSelectionInfoWidget.onViewReady();
            });

            it('should hide widget on its startup', function() {
                expect(tableSelectionInfoWidget.view.hideSelectedMsg.callCount).to.equal(1);
            });
        });

        describe('configure()', function () {

            beforeEach(function() {
                sandbox.stub(tableSelectionInfoWidget, 'addEventHandlers');
            });

            it('should set pagination table if provided', function() {
                tableSelectionInfoWidget.configure({
                    paginatedTable: 'mockPaginatedTable'
                });
                expect(tableSelectionInfoWidget.paginatedTable).to.equal('mockPaginatedTable');
            });

            it('should not set pagination table if not provided', function() {
                tableSelectionInfoWidget.configure();
                expect(tableSelectionInfoWidget.paginatedTable).to.equal(null);
            });

            it('should perform adding of event handlers', function() {
                tableSelectionInfoWidget.configure();
                expect(tableSelectionInfoWidget.addEventHandlers.callCount).to.equal(1);
            });
        });

        describe('addEventHandlers()', function () {

            var getSelectAllOnAllPageResultStub, getSelectAllOnCurrentPageResultStub, getClearAllResultStub;

            beforeEach(function() {

                sandbox.spy(paginatedTableStub, 'addEventHandler');
                sandbox.spy(paginatedTableStub, 'checkAll');
                sandbox.spy(paginatedTableStub, 'checkAllOnCurrentPage');
                sandbox.spy(paginatedTableStub, 'clearAll');

                sandbox.stub(tableSelectionInfoWidget, 'update');
                sandbox.stub(tableSelectionInfoWidget.view, 'showSelectedMsg');
                sandbox.stub(tableSelectionInfoWidget.view, 'hideSelectedMsg');

                tableSelectionInfoWidget.paginatedTable = paginatedTableStub;
                tableSelectionInfoWidget.addEventHandlers();
            });

            it('callback() paginatedTable pageloaded event should update view', function() {
                tableSelectionInfoWidget.paginatedTable.trigger('pageloaded');
                expect(tableSelectionInfoWidget.update.callCount).to.equal(1);
            });

            it('callback() paginatedTable checkheader event should update view', function() {
                tableSelectionInfoWidget.paginatedTable.trigger('pageloaded');
                expect(tableSelectionInfoWidget.update.callCount).to.equal(1);
            });

            it('callback() paginatedTable checkend event should update view', function() {
                tableSelectionInfoWidget.paginatedTable.trigger('checkend');
                expect(tableSelectionInfoWidget.update.callCount).to.equal(1);
            });

            it('callback() paginatedTable check event should update view', function() {
                tableSelectionInfoWidget.paginatedTable.trigger('check');
                expect(tableSelectionInfoWidget.update.callCount).to.equal(1);
            });

            it('callback() click on SelectAllOnAllPage link should check all items on paginated table', function() {
                tableSelectionInfoWidget.view.getSelectAllOnAllPage().trigger('click');
                expect(tableSelectionInfoWidget.paginatedTable.checkAll.callCount).to.equal(1);
            });

            it('callback() click on SelectAllOnAllPage link should update info widget view', function() {
                tableSelectionInfoWidget.view.getSelectAllOnAllPage().trigger('click');
                expect(tableSelectionInfoWidget.update.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.hideSelectedMsg.callCount).to.equal(0);
            });

            it('callback() click on SelectAllOnCurrentPage link should check all items on current page', function() {
                tableSelectionInfoWidget.view.getSelectAllOnCurrentPage().trigger('click');
                expect(tableSelectionInfoWidget.paginatedTable.checkAllOnCurrentPage.callCount).to.equal(1);
            });

            it('callback() click on SelectAllOnCurrentPage link should update info widget view', function() {
                tableSelectionInfoWidget.view.getSelectAllOnCurrentPage().trigger('click');
                expect(tableSelectionInfoWidget.view.showSelectedMsg.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.update.callCount).to.equal(0);
                expect(tableSelectionInfoWidget.view.hideSelectedMsg.callCount).to.equal(0);
            });

            it('callback() click on ClearAll link should check all items on current page', function() {
                tableSelectionInfoWidget.view.getClearAll().trigger('click');
                expect(tableSelectionInfoWidget.paginatedTable.clearAll.callCount).to.equal(1);
            });

            it('callback() click on ClearAll link should update info widget view', function() {
                tableSelectionInfoWidget.view.getClearAll().trigger('click');
                expect(tableSelectionInfoWidget.view.showSelectedMsg.callCount).to.equal(0);
                expect(tableSelectionInfoWidget.update.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.hideSelectedMsg.callCount).to.equal(1);
            });
        });

        describe('update()', function () {

            beforeEach(function() {
                sandbox.stub(tableSelectionInfoWidget, 'setText');
                sandbox.stub(tableSelectionInfoWidget.view, 'showSelectedMsg');
                sandbox.stub(tableSelectionInfoWidget.view, 'hideSelectedMsg');
            });

//            it('should show and update TableSelectionInfoWidget if some rows selected', function() {
//
//                sandbox.stub(paginatedTableStub, 'getRows').returns({length: 'mockTableRowsNumberLength'});
//                sandbox.stub(paginatedTableStub, 'getPageRows').returns({length: 'mockTablePaginationSettingLength'});
//                sandbox.stub(paginatedTableStub, 'getCheckedRows').returns({length: 1});
//                sandbox.stub(paginatedTableStub, 'getPageCheckedRows').returns({length: 1});
//
//                tableSelectionInfoWidget.paginatedTable = paginatedTableStub;
//                tableSelectionInfoWidget.update();
//
//                expect(tableSelectionInfoWidget.setText.callCount).to.equal(1);
//                expect(tableSelectionInfoWidget.view.showSelectedMsg.callCount).to.equal(1);
//                expect(tableSelectionInfoWidget.view.hideSelectedMsg.callCount).to.equal(0);
//                expect(tableSelectionInfoWidget.setText.getCall(0).args[0]).to.equal('mockTableRowsNumberLength');
//                expect(tableSelectionInfoWidget.setText.getCall(0).args[1]).to.equal('mockTablePaginationSettingLength');
//                expect(tableSelectionInfoWidget.setText.getCall(0).args[2]).to.equal(1);
//                expect(tableSelectionInfoWidget.setText.getCall(0).args[3]).to.equal(1);
//            });

            it('should hide TableSelectionInfoWidget if no rows selected', function() {
                sandbox.stub(paginatedTableStub, 'getRows').returns({length: 'mockTableRowsNumberLength'});
                sandbox.stub(paginatedTableStub, 'getPageRows').returns({length: 'mockTablePaginationSettingLength'});
                sandbox.stub(paginatedTableStub, 'getCheckedRows').returns({length: 0});
                sandbox.stub(paginatedTableStub, 'getPageCheckedRows').returns({length: 'mockCheckedPageRowsNumberLength'});

                tableSelectionInfoWidget.paginatedTable = paginatedTableStub;
                tableSelectionInfoWidget.update();

                expect(tableSelectionInfoWidget.setText.callCount).to.equal(0);;
                expect(tableSelectionInfoWidget.view.showSelectedMsg.callCount).to.equal(0);
                expect(tableSelectionInfoWidget.view.hideSelectedMsg.callCount).to.equal(1);
            });
        });

        describe('setText()', function () {

            var tableRowsNumber;
            var tablePaginationSetting;
            var checkedRowsNumber;
            var checkedPageRowsNumber;

            var expectedSelecteRowsInfo;
            var expectedSetSelectAllOnCurrentPageInfo;
            var expectedSelectAllOnAllPageInfo;
            var expectedClearAllInfo;

            beforeEach(function() {
                sandbox.stub(tableSelectionInfoWidget.view, 'setSelectedRowsInfo');
                sandbox.stub(tableSelectionInfoWidget.view, 'setSelectAllOnCurrentPage');
                sandbox.stub(tableSelectionInfoWidget.view, 'setSelectAllOnAllPage');
                sandbox.stub(tableSelectionInfoWidget.view, 'setClearAll');
            });

            it('should set proper info when all rows in the table are selected', function() {

                tableRowsNumber = 99;
                tablePaginationSetting = 20;
                checkedRowsNumber = 99;
                checkedPageRowsNumber = 20;
                tableSelectionInfoWidget.setText(tableRowsNumber,tablePaginationSetting,checkedRowsNumber,checkedPageRowsNumber);

                expect(tableSelectionInfoWidget.view.setSelectedRowsInfo.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setSelectAllOnCurrentPage.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setSelectAllOnAllPage.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setClearAll.callCount).to.equal(1);

                expectedSelecteRowsInfo = Utils.printf(Dictionary.tableSelectionInfoWidget.allItemsSelected, checkedRowsNumber, 'mockCustomItemPluralPredicate');
                expectedSetSelectAllOnCurrentPageInfo = '';
                expectedSelectAllOnAllPageInfo = '';
                expectedClearAllInfo = Dictionary.tableSelectionInfoWidget.clearSelection;

                expect(tableSelectionInfoWidget.view.setSelectedRowsInfo.getCall(0).args[0]).to.equal(expectedSelecteRowsInfo);
                expect(tableSelectionInfoWidget.view.setSelectAllOnCurrentPage.getCall(0).args[0]).to.equal(expectedSetSelectAllOnCurrentPageInfo);
                expect(tableSelectionInfoWidget.view.setSelectAllOnAllPage.getCall(0).args[0]).to.equal(expectedSelectAllOnAllPageInfo);
                expect(tableSelectionInfoWidget.view.setClearAll.getCall(0).args[0]).to.equal(expectedClearAllInfo);
            });

            it('should set proper info when all rows on the page are selected, but not all in the table', function() {

                tableRowsNumber = 99;
                tablePaginationSetting = 20;
                checkedRowsNumber = 30;
                checkedPageRowsNumber = 20;

                tableSelectionInfoWidget.setText(tableRowsNumber,tablePaginationSetting,checkedRowsNumber,checkedPageRowsNumber);

                expect(tableSelectionInfoWidget.view.setSelectedRowsInfo.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setSelectAllOnCurrentPage.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setSelectAllOnAllPage.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setClearAll.callCount).to.equal(1);

                expectedSelecteRowsInfo = Utils.printf(Dictionary.tableSelectionInfoWidget.itemsSelected, checkedRowsNumber, 'mockCustomItemPluralPredicate');
                expectedSetSelectAllOnCurrentPageInfo = '';
                expectedSelectAllOnAllPageInfo = Utils.printf(Dictionary.tableSelectionInfoWidget.selectOnAllPages, tableRowsNumber);
                expectedClearAllInfo = '';

                expect(tableSelectionInfoWidget.view.setSelectedRowsInfo.getCall(0).args[0]).to.equal(expectedSelecteRowsInfo);
                expect(tableSelectionInfoWidget.view.setSelectAllOnCurrentPage.getCall(0).args[0]).to.equal(expectedSetSelectAllOnCurrentPageInfo);
                expect(tableSelectionInfoWidget.view.setSelectAllOnAllPage.getCall(0).args[0]).to.equal(expectedSelectAllOnAllPageInfo);
                expect(tableSelectionInfoWidget.view.setClearAll.getCall(0).args[0]).to.equal(expectedClearAllInfo);

            });

            it('should set proper info when not all rows on the page are selected', function() {

                tableRowsNumber = 99;
                tablePaginationSetting = 20;
                checkedRowsNumber = 30;
                checkedPageRowsNumber = 15;
                tableSelectionInfoWidget.setText(tableRowsNumber,tablePaginationSetting,checkedRowsNumber,checkedPageRowsNumber);

                expect(tableSelectionInfoWidget.view.setSelectedRowsInfo.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setSelectAllOnCurrentPage.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setSelectAllOnAllPage.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setClearAll.callCount).to.equal(1);

                expectedSelecteRowsInfo = Utils.printf(Dictionary.tableSelectionInfoWidget.itemsSelected, checkedRowsNumber, 'mockCustomItemPluralPredicate');
                expectedSetSelectAllOnCurrentPageInfo = '';
                expectedSelectAllOnAllPageInfo = '';
                expectedClearAllInfo = Dictionary.tableSelectionInfoWidget.clearSelection;

                expect(tableSelectionInfoWidget.view.setSelectedRowsInfo.getCall(0).args[0]).to.equal(expectedSelecteRowsInfo);
                expect(tableSelectionInfoWidget.view.setSelectAllOnCurrentPage.getCall(0).args[0]).to.equal(expectedSetSelectAllOnCurrentPageInfo);
                expect(tableSelectionInfoWidget.view.setSelectAllOnAllPage.getCall(0).args[0]).to.equal(expectedSelectAllOnAllPageInfo);
                expect(tableSelectionInfoWidget.view.setClearAll.getCall(0).args[0]).to.equal(expectedClearAllInfo);
            });

            it('should set proper info when only one row in the table is selected', function() {

                tableRowsNumber = 99;
                tablePaginationSetting = 20;
                checkedRowsNumber = 1;
                checkedPageRowsNumber = 0;
                tableSelectionInfoWidget.setText(tableRowsNumber,tablePaginationSetting,checkedRowsNumber,checkedPageRowsNumber);

                expect(tableSelectionInfoWidget.view.setSelectedRowsInfo.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setSelectAllOnCurrentPage.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setSelectAllOnAllPage.callCount).to.equal(1);
                expect(tableSelectionInfoWidget.view.setClearAll.callCount).to.equal(1);

                expectedSelecteRowsInfo = Utils.printf(Dictionary.tableSelectionInfoWidget.itemSelected, checkedRowsNumber, 'mockCustomItemSingularPredicate');
                expectedSetSelectAllOnCurrentPageInfo = '';
                expectedSelectAllOnAllPageInfo = '';
                expectedClearAllInfo = Dictionary.tableSelectionInfoWidget.clearSelection;

                expect(tableSelectionInfoWidget.view.setSelectedRowsInfo.getCall(0).args[0]).to.equal(expectedSelecteRowsInfo);
                expect(tableSelectionInfoWidget.view.setSelectAllOnCurrentPage.getCall(0).args[0]).to.equal(expectedSetSelectAllOnCurrentPageInfo);
                expect(tableSelectionInfoWidget.view.setSelectAllOnAllPage.getCall(0).args[0]).to.equal(expectedSelectAllOnAllPageInfo);
                expect(tableSelectionInfoWidget.view.setClearAll.getCall(0).args[0]).to.equal(expectedClearAllInfo);
            });
        });
    });
});