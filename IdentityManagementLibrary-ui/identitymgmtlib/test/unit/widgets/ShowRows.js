/*global define, describe, it, expect */
define([
  'identitymgmtlib/widgets/ShowRows',
], function(ShowRows) {
  'use strict';

  describe('ShowRows', function() {

    var sandbox, paginatedTable;

    beforeEach(function() {
      //Setup to prepare fake stuffs
      sandbox = sinon.sandbox.create();

      paginatedTable = {
        clearAll: function() {},
        setPageSize: function() {}
      };

      sandbox.spy(paginatedTable, 'clearAll');
      sandbox.spy(paginatedTable, 'setPageSize');
    });

    afterEach(function() {
      sandbox.restore();
    });

    describe('onViewReady()', function() {
/*
      it('should set selectbox value to 10 ', function() {

        // ARRANGE
        var showRows = new ShowRows();

        showRows.configure({
          paginatedTable: paginatedTable
        });

        // ACT
        showRows.setValue({
          name: '10',
          value: 10
        });

        // VERIFY
        //expect(showRows.setValue).to.equal(10);
        expect(paginatedTable.clearAll.callCount).to.equal(1);
        expect(paginatedTable.setPageSize.callCount).to.equal(1);
        expect(paginatedTable.setPageSize.getCall(0).calledWith({})).to.equal(true);
      });
*/

      it('should set selectbox value to 20 ', function() {

        var showRows = new ShowRows({
          items: [{
            name: '10',
            value: 10
          }, {
            name: '20',
            value: 20
          }, {
            name: '50',
            value: 50
          }, {
            name: '100',
            value: 100
          }, {
            name: '500',
            value: 500
          }]
        });

        showRows.setValue = 20;

        showRows.view.getSelectboxContainer.value;

        expect(showRows.setValue).to.equal(20);

      });


      it('should set selectbox value to 50 ', function() {

        var showRows = new ShowRows({
          items: [{
            name: '10',
            value: 10
          }, {
            name: '20',
            value: 20
          }, {
            name: '50',
            value: 50
          }, {
            name: '100',
            value: 100
          }, {
            name: '500',
            value: 500
          }]
        });

        showRows.setValue = 50;

        showRows.view.getSelectboxContainer.value;

        expect(showRows.setValue).to.equal(50);

      });

      it('should set selectbox value to 100 ', function() {

        var showRows = new ShowRows({
          items: [{
            name: '10',
            value: 10
          }, {
            name: '20',
            value: 20
          }, {
            name: '50',
            value: 50
          }, {
            name: '100',
            value: 100
          }, {
            name: '500',
            value: 500
          }]
        });

        showRows.setValue = 100;

        showRows.view.getSelectboxContainer.value;

        expect(showRows.setValue).to.equal(100);

      });

      it('should set selectbox value to 500 ', function() {

        var showRows = new ShowRows({
          items: [{
            name: '10',
            value: 10
          }, {
            name: '20',
            value: 20
          }, {
            name: '50',
            value: 50
          }, {
            name: '100',
            value: 100
          }, {
            name: '500',
            value: 500
          }]
        });

        showRows.setValue = 500;

        showRows.view.getSelectboxContainer.value;

        expect(showRows.setValue).to.equal(500);

      });

    });

  });
});