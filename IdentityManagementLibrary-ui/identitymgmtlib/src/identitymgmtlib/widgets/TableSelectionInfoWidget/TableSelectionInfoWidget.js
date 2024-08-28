/** 
 * The TableSelectionInfoWidget is PaginatedTable widget that shows a small "cloud pop-up" with info about
 * selected items in the table and additionally provides options to select or clear all items on current
 * or in the whole table.
 *
 * Following actions can be shown on TableSelectionInfo pop-up:
 *    selectAllLink - Selects all rows in table, link appears when:
 *                    * all rows on current page were selected
 *    clearAllLink  - Clear all selection in the table, link appears when:
 *                    * not all rows are selected on the current page
 *                    * all rows in table were selected
 *    selectAllOnCurrentPage - Selects all rows on current page
 *                    * (handler is prepared, but link is not shown in current logic)
 *
 * @options
 *     {String} icon (Optional): a string used to define an icon to show.
 *     {String} itemSingularPredicate (optional): customised slogan for one item, default: Item
 *     {String} itemPluralPredicate (optional): customised slogan for many items, default: Items
 *
 * ### Example
 *
 *      var tableSelectionInfo = new TableSelectionInfo({
 *          icon: 'ebIcon ebIcon_dialogInfo',
 *          itemSingularPredicate: 'Role',
 *          itemPluralPredicate:   'Roles'
 *      });
 *
 *      this.paginatedTable = new PaginatedTable({
 *          title: Dictionary.roles,
 *          :
 *          widgets: {
 *              selectAllNotification: tableSelectionInfo
 *          },
 *          url: '/oss/idm/rolemanagement/roles',
 *          columns: [
 *          :
 *          ]
 *      });
 *
 *      tableSelectionInfo.configure({
 *          paginatedTable: this.paginatedTable
 *      });
 *
 * @extends Widget
 **/

define([
    'jscore/core',
    './TableSelectionInfoWidgetView',
    'i18n!identitymgmtlib/common.json',
    'identitymgmtlib/Utils'
], function(core, View, Dictionary, utils) {
    'use strict';
    return core.Widget.extend({
        view: null,
        paginatedTable: null,

        init: function() {
            this.view = new View(this.options);
            this.itemSingularPredicate = this.options.itemSingularPredicate || Dictionary.tableSelectionInfoWidget.defaultItemSingularPredicate;
            this.itemPluralPredicate = this.options.itemPluralPredicate || Dictionary.tableSelectionInfoWidget.defaultItemPluralPredicate;
        },

        onViewReady: function() {
            this.view.hideSelectedMsg();
        },

        configure: function(options) {
            if (options && options.paginatedTable) {
                this.paginatedTable = options.paginatedTable;
            }
            this.addEventHandlers();
        },

        addEventHandlers: function() {

            this.paginatedTable.addEventHandler('pageloaded', this.update.bind(this));
            this.paginatedTable.addEventHandler('checkheader', this.update.bind(this));
            this.paginatedTable.addEventHandler('checkend', this.update.bind(this));
            this.paginatedTable.addEventHandler('check', this.update.bind(this));

            this.view.getSelectAllOnAllPage().addEventHandler('click', function() {
                this.paginatedTable.checkAll();
                this.paginatedTable.refreshData();
                this.update();

            }.bind(this));

            this.view.getSelectAllOnCurrentPage().addEventHandler('click', function() {
                this.paginatedTable.checkAllOnCurrentPage();
                this.view.showSelectedMsg();
            }.bind(this));

            this.view.getClearAll().addEventHandler('click', function() {
                this.paginatedTable.clearAll();
                this.view.hideSelectedMsg();
            }.bind(this));

        },

        update: function() {

            var tableRowsNumber = this.paginatedTable.getRows().length;
            var tablePaginationSetting = this.paginatedTable.getPageRows().length;
            var checkedRowsNumber = this.paginatedTable.getCheckedRows().length;
            var checkedPageRowsNumber = this.paginatedTable.getPageCheckedRows().length;

            // Show text only when select all items of the page
            if (checkedRowsNumber > 0  && checkedPageRowsNumber === tablePaginationSetting ) {
                this.setText(tableRowsNumber, tablePaginationSetting, checkedRowsNumber, checkedPageRowsNumber);
                this.view.showSelectedMsg();
            } else {
                this.view.hideSelectedMsg();
            }
        },

        setText: function(tableRowsNumber, tablePaginationSetting, checkedRowsNumber, checkedPageRowsNumber) {

            var selecteRowsInfo = "";
            var actionLabel = "";
            var isAllRowsOnCurrentPageSelected = checkedPageRowsNumber === tablePaginationSetting;
            var isAllItemsInAllPagesSelected = checkedRowsNumber === tableRowsNumber;

            if (checkedRowsNumber > 1) {
                if (isAllItemsInAllPagesSelected) {
                    selecteRowsInfo = utils.printf(Dictionary.tableSelectionInfoWidget.allItemsSelected, checkedRowsNumber, this.itemPluralPredicate);
                } else {
                    selecteRowsInfo = utils.printf(Dictionary.tableSelectionInfoWidget.itemsSelected, checkedRowsNumber, this.itemPluralPredicate);
                }
            } else if (checkedRowsNumber === 1) {
                selecteRowsInfo = utils.printf(Dictionary.tableSelectionInfoWidget.itemSelected, checkedRowsNumber, this.itemSingularPredicate);
            }
            this.view.setSelectedRowsInfo(selecteRowsInfo);
            this.view.setSelectAllOnCurrentPage('');

            if (isAllRowsOnCurrentPageSelected) {
                if (isAllItemsInAllPagesSelected) {
                    actionLabel = Dictionary.tableSelectionInfoWidget.clearSelection;
                    this.view.setSelectAllOnAllPage('');
                    this.view.setClearAll(actionLabel);
                } else {
                    actionLabel = utils.printf(Dictionary.tableSelectionInfoWidget.selectOnAllPages, tableRowsNumber);
                    this.view.setSelectAllOnAllPage(actionLabel);
                    this.view.setClearAll('');
                }
            } else {
                actionLabel = Dictionary.tableSelectionInfoWidget.clearSelection;
                this.view.setSelectAllOnAllPage('');
                this.view.setClearAll(actionLabel);
            }
        }
    });
});