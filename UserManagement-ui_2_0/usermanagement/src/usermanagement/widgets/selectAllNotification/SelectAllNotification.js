/*
 The SelectAll widget allows the user to select all or clear all rows in the table.
 Events :
    selectAllLink - Triggered when all rows in table are selected by user input
    clearAllLink - Triggered when all rows in table are unselected by user input

 The following options are mandatory : collectionSize, selectedRows, paginationTotalPages, allRowsSelectedOnCurrentPage

 The following options are accepted:
    label (Optional): a string used to set the notification text.
    icon (Optional): a string used to define an icon to show.
    selectAll (Optional): a string used to define the selectAll link text.
    clearAll (Optional): a string used to define the clearAll link text.
 */

define([
    'jscore/core',
    './SelectAllNotificationView',
    '../../Dictionary',
    'identitymgmtlib/Utils'
], function(core, View, Dictionary, utils) {
    'use strict';
    return core.Widget.extend({
        view: null,
        allRowsSelectedOnAllPages: false,
        paginatedTable: null,

        init: function() {
            this.view =  new View(this.options);
        },

        onViewReady: function(){
            if((this.selectedRows >= 1) && (this.paginationTotalPages >= 1)) {
                this.view.showUsersSelectedMsg();
            } else {
                this.view.hideUsersSelectedMsg();
            }
        },

        configure: function(options) {
            if (options.paginatedTable) {
                this.paginatedTable = options.paginatedTable;
            }

            this.addEventHandlers();
        },

        addEventHandlers: function() {

            // Setup paginated table notification to update widget
            this.paginatedTable.addEventHandler('pageloaded', this.update.bind(this));
            this.paginatedTable.addEventHandler('checkheader', this.update.bind(this));
            this.paginatedTable.addEventHandler('checkend', this.update.bind(this));
            this.paginatedTable.addEventHandler('check', this.update.bind(this));

            //event handler for action select all checkboxes in table
        	this.view.getSelectAllOnAllPage().addEventHandler('click', function(){
        		this.paginatedTable.checkAll();
                this.update();
                this.show();
        	}.bind(this));
        	
            //event handler for action select all checkboxes on current page in table
        	this.view.getSelectAllOnCurrentPage().addEventHandler('click', function(){
        		this.paginatedTable.checkAllOnCurrentPage();
                this.show();
        	}.bind(this));

            //event handler for action clear selected checkboxes in table
            this.view.getClearAll().addEventHandler('click', function(){
            	this.paginatedTable.clearAll();
                //TODO: it not work;/ - only second click
                this.hide();
            }.bind(this));
            
        },

        hide: function() {
            this.view.hideUsersSelectedMsg();
        },

        show: function() {
            this.view.showUsersSelectedMsg();
        },

        update: function() {
            
            var pageRowsNumber = this.paginatedTable.getPageRows().length;
            var rowsNumber = this.paginatedTable.getRows().length;
            var checkedRowsNumber = this.paginatedTable.getCheckedRows().length;
            var checkedPageRowsNumber = this.paginatedTable.getPageCheckedRows().length;

            if (checkedRowsNumber > 0) {
                this.setText(rowsNumber, pageRowsNumber, checkedRowsNumber, checkedPageRowsNumber);
                this.show();
            } else {
                this.hide();
            }
        },
        
        setText: function(rowsNumber, pageRowsNumber, checkedRowsNumber, checkedPageRowsNumber) {
        	
        	var selecteRowsInfo;
        	var actionLabel;

            // Display number of selected rows
            if(checkedRowsNumber > 1) {
            	selecteRowsInfo = utils.printf(Dictionary.usersSelected, checkedRowsNumber);
            	if(checkedRowsNumber === rowsNumber) {
            		selecteRowsInfo = utils.printf(Dictionary.allSelected, selecteRowsInfo);
                }
            } else if(checkedRowsNumber === 1) {
            	selecteRowsInfo = utils.printf(Dictionary.userSelected, checkedRowsNumber);
            }
            this.view.setSelectedRowsInfo(selecteRowsInfo);	

            // Add links according to number of rows
            if(checkedPageRowsNumber < pageRowsNumber) {
            	//select all on current page
            	actionLabel = Dictionary.selectOnCurrentPages;
            	this.view.setSelectAllOnCurrentPage(actionLabel);
            	this.view.setSelectAllOnAllPage('');
            	this.view.setClearAll('');
            } else if(checkedRowsNumber === rowsNumber) {
            	//clear all
            	actionLabel = Dictionary.clearSelection;
            	this.view.setSelectAllOnCurrentPage('');
            	this.view.setSelectAllOnAllPage('');
            	this.view.setClearAll(actionLabel);
            	
            } else {
            	//select all on all pages
            	actionLabel = utils.printf(Dictionary.selectOnAllPages, rowsNumber);
            	this.view.setSelectAllOnCurrentPage('');
            	this.view.setSelectAllOnAllPage(actionLabel);
            	this.view.setClearAll('');
            }
        }
    });
});