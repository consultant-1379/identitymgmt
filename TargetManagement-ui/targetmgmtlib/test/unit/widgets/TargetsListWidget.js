define([
    'targetmgmtlib/widgets/TargetsListWidget',
    "i18n!targetmgmtlib/dictionary.json",
    'jscore/ext/utils/base/underscore',
    'tablelib/Row',
    'tablelib/Cell'
], function (TargetsListWidget, dictionary, underscore, Row, Cell ) {
    'use strict';

    describe('TargetsListWidget', function () {
        var sandbox;
        var targetsListWidget, constructorParameter;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        describe('TargetsListWidget (view action)', function () {
            var server;
            beforeEach(function () {
                server = sinon.fakeServer.create();
                server.respondWith(
                    "GET",
                    '/oss/idm/targetmanagement/targets?targetgroups=testTargetGroup',
                    [ 200,
                     {
                            "Content-Type": "application/json",
                            "Content-Length": 2
                      },
                      '[]']
                );
                constructorParameter = {
                    'targetGroup': "testTargetGroup",
                    'action': "view"
                }
                targetsListWidget = new TargetsListWidget(constructorParameter);
                server.respond();
            });
            afterEach(function() {
                server.restore();
            });

            it('should be defined', function () {
                expect(targetsListWidget).not.to.be.undefined;
            });

            it('should have correct properties', function () {
                var tableOptionsObject = targetsListWidget.getTableWidget().options;

               expect(tableOptionsObject.plugins.length).to.be.equal(4);
               expect(tableOptionsObject.columns.length).to.be.equal(2);
            });
        });

        describe('TargetsListWidget (edit action)', function () {
            var modelArray, server;

            beforeEach(function () {
                constructorParameter = {
                    'targetGroup': "testTargetGroup",
                    'action': "edit"
                }
                modelArray = [
                    {
                        name: 'target1',
                        targetTypeName: 'TYPE1'
                    },
                    {
                        name: 'target2',
                        targetTypeName: 'TYPE2'
                    },
                    {
                        name: 'target3',
                        targetTypeName: 'TYPE3'
                    },
                    {
                        name: 'target4',
                        targetTypeName: 'TYPE4'
                    },
                ];
                server = sinon.fakeServer.create();
                server.respondWith(
                    "GET",
                    '/oss/idm/targetmanagement/targets?targetgroups=testTargetGroup',
                    [ 200,
                      {
                            "Content-Type": "application/json",
                            "Content-Length": 2
                      },
                      JSON.stringify(modelArray)
                    ]
                );

                targetsListWidget = new TargetsListWidget(constructorParameter);

                server.respond();
            });


            it('should be defined', function () {
                targetsListWidget.table.getVirtualScrollBar = function () {
                    return {
                        getHeight: function () {
                            return 32;
                        }
                    }
                };
                expect(targetsListWidget).not.to.be.undefined;
            });

            it('should have correct properties', function () {
                targetsListWidget.table.getVirtualScrollBar = function () {
                    return {
                        getHeight: function () {
                            return 32;
                        }
                    }
                };

                var tableOptionsObject = targetsListWidget.getTableWidget().options;

                expect(tableOptionsObject.plugins.length).to.be.equal(6);
                expect(tableOptionsObject.columns.length).to.be.equal(2);
            });

            // describe('context menu event handling', function() {
            //     var firstSelectionModel, secondSelectionModel, firstSelection, secondSelection, eventStub;

            //     beforeEach(function() {
            //         firstSelectionModel = modelArray[3];
            //         secondSelectionModel = modelArray[0];

            //         firstSelection = new Row({
            //             table: targetsListWidget.getTableWidget(),
            //             model: firstSelectionModel
            //         });

            //         secondSelection = new Row({
            //             table: targetsListWidget.getTableWidget(),
            //             model: secondSelectionModel
            //         });

            //         eventStub = {
            //             preventDefault: function() {}
            //         };
            //     });

            //     it('should select one row', function() {
            //         var widgetTable = targetsListWidget.getTableWidget();
            //         widgetTable.trigger('rowevents:contextmenu', firstSelection, eventStub);

            //         var expectedSelectedRowsArray = [firstSelectionModel];
            //         var actualSelectedRowsArray = targetsListWidget.getSelectedRows();

            //         expect(actualSelectedRowsArray.length).to.be.equal(expectedSelectedRowsArray.length);
            //         for(var i in expectedSelectedRowsArray) {
            //             expect(actualSelectedRowsArray[i]).to.be.deep.equal(expectedSelectedRowsArray[i]);
            //         }
            //     });

            //     it('should select one row, unselect it and then select another one', function() {
            //         var widgetTable = targetsListWidget.getTableWidget();
            //         widgetTable.trigger('rowevents:contextmenu', firstSelection, eventStub);
            //         widgetTable.trigger('rowevents:contextmenu', secondSelection, eventStub);

            //         var expectedSelectedRowsArray = [secondSelectionModel];
            //         var actualSelectedRowsArray = targetsListWidget.getSelectedRows();

            //         expect(actualSelectedRowsArray.length).to.be.equal(expectedSelectedRowsArray.length);
            //         for(var i in expectedSelectedRowsArray) {
            //             expect(actualSelectedRowsArray[i]).to.be.deep.equal(expectedSelectedRowsArray[i]);
            //         }
            //     });
            // });

            // describe('getSelectedRows()', function() {
            //     var rowsToSelect;

            //     beforeEach(function () {
            //         rowsToSelect = [
            //             new Row({
            //                 table: targetsListWidget.getTableWidget(),
            //                 model: modelArray[3]
            //             }),
            //             new Row({
            //                 table: targetsListWidget.getTableWidget(),
            //                 model: modelArray[0]
            //             })
            //         ];
            //         sandbox.stub(rowsToSelect[0], 'getCells').returns([new Cell()]);
            //         sandbox.stub(rowsToSelect[1], 'getCells').returns([new Cell()]);
            //     });

            //     it('should return empty selection array', function() {
            //         expect(targetsListWidget.getSelectedRows()).to.be.deep.equal([]);
            //     });

            //     it('should return not empty selection array', function() {                    
            //         targetsListWidget.getTableWidget().trigger('check', [rowsToSelect[0]], true, {originalEvent: 'MouseEvent'});
            //         expect(targetsListWidget.getSelectedRows()).to.be.deep.equal([modelArray[3]]);

            //         targetsListWidget.getTableWidget().trigger('check', [rowsToSelect[0], rowsToSelect[1]]);
            //         expect(targetsListWidget.getSelectedRows()).to.be.deep.equal([modelArray[3], modelArray[0]]);
            //     });

            //     it('should clear selection after row delete', function() {
            //         targetsListWidget.getTableWidget().trigger('checkend', rowsToSelect);
            //         expect(targetsListWidget.getSelectedRows()).to.be.deep.equal([modelArray[3], modelArray[0]]);

            //         targetsListWidget.removeRowsFromTargetsTable([modelArray[3], modelArray[0]]);
            //         expect(targetsListWidget.getSelectedRows()).to.be.deep.equal([]);
            //     });
            // });

            // describe('addRowsToTargetsTable()', function () {
            //     var addRowSpy;
            //     var newTargetsToAddArray;

            //     beforeEach(function() {
            //         addRowSpy = sandbox.spy(targetsListWidget.getTableWidget(), 'addRow');
            //         newTargetsToAddArray = [
            //             {
            //                 name: 'target5',
            //                 targetTypeName: 'TYPE5'
            //             },
            //             {
            //                 name: 'target6',
            //                 targetTypeName: 'TYPE6'
            //             }
            //         ];
            //     });

            //     it('should return unchanged array', function () {
            //         targetsListWidget.addRowsToTargetsTable([]);

            //         var actualArray = targetsListWidget.getTableWidget().getTable().getData();
            //         var expectedArray = modelArray;

            //         expect(actualArray).to.be.deep.equal(expectedArray);
            //         expect(addRowSpy.callCount).to.equal(0);
            //     });

            //     it('should return changed array (add new values)', function () {
            //         var expectedArray = modelArray.concat(newTargetsToAddArray);
            //         targetsListWidget.addRowsToTargetsTable(newTargetsToAddArray);

            //         var actualArray = targetsListWidget.getTableWidget().getTable().getData();
            //         expect(actualArray).to.be.deep.equal(expectedArray);
            //         expect(addRowSpy.callCount).to.equal(2);
            //     });

            //     it('should return changed array (add duplicates)', function () {
            //         var targetsToAddArray = [
            //             modelArray[0],
            //             modelArray[3],
            //             newTargetsToAddArray[1],
            //             modelArray[2]
            //         ];
            //         var expectedArray = modelArray.concat([newTargetsToAddArray[1]]);

            //         targetsListWidget.addRowsToTargetsTable(targetsToAddArray);

            //         var actualArray = targetsListWidget.getTableWidget().getTable().getData();

            //         expect(actualArray).to.be.deep.equal(expectedArray);
            //         expect(addRowSpy.callCount).to.equal(1);
            //     });
            // });

            // describe('removeRowsFromTargetsTable()', function () {
            //     var removeRowSpy;

            //     beforeEach(function() {
            //         removeRowSpy = sandbox.spy(targetsListWidget.getTableWidget().getTable(), 'removeRow');
            //     });

            //     it('should return unchanged array', function () {
            //         targetsListWidget.removeRowsFromTargetsTable([]);

            //         var actualArray = targetsListWidget.getTableWidget().getTable().getData();
            //         var expectedArray = modelArray;

            //         expect(actualArray).to.be.deep.equal(expectedArray);
            //         expect(removeRowSpy.callCount).to.equal(0);
            //     });

            //     it('should return changed array', function () {
            //         var targetsToRemoveArray = [modelArray[3], modelArray[0]];
            //         targetsListWidget.getTableWidget().getTable().trigger('checkend',
            //             [
            //                 new Row({
            //                     table: targetsListWidget.getTableWidget().getTable(),
            //                     model: targetsToRemoveArray[0]
            //                 }),
            //                 new Row({
            //                     table: targetsListWidget.getTableWidget().getTable(),
            //                     model: targetsToRemoveArray[1]
            //                 })
            //             ]
            //         );

            //         targetsListWidget.removeRowsFromTargetsTable(targetsToRemoveArray);

            //         var actualArray = targetsListWidget.getTableWidget().getTable().getData();
            //         var targetNamesToRemove = targetsToRemoveArray.map(function (target) {
            //             return target.name;
            //         });
            //         var expectedArray = modelArray.filter(function (row) {
            //             return !(underscore.contains(targetNamesToRemove, row.name));
            //         });

            //         expect(actualArray).to.be.deep.equal(expectedArray);
            //         expect(removeRowSpy.callCount).to.equal(2);
            //     });
            // });
        });

        afterEach(function () {
            targetsListWidget.delete;
            sandbox.restore();
        });
    });
});
