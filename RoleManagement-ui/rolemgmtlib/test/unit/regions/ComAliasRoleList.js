define([
    'jscore/core',
    'rolemgmtlib/regions/ComAliasRoleList/ComAliasRoleList',
    'identitymgmtlib/RoleMgmtTable',
    'i18n!rolemgmtlib/dictionary.json'
], function (core, ComAliasRoleList, RoleMgmtTable, dictionary) {
    'use strict';

    describe('ComAliasRoleList', function() {

        var sandbox, comAliasRoleList, roleMgmtTable, mockContext, eventBusStub;

        it('ComAliasRoleList should be defined', function () {
            expect(ComAliasRoleList).not.to.be.undefined;
        });

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            comAliasRoleList = new ComAliasRoleList();

            eventBusStub = new core.EventBus();

            //Mock Context For Event Bus
            mockContext = new core.AppContext();
            mockContext.eventBus = eventBusStub;
            sandbox.stub(comAliasRoleList, 'getContext', function() {
                return mockContext;
            });
            sandbox.stub(comAliasRoleList, 'getEventBus', function() {
                return eventBusStub;
            });

            eventBusStub = {
                publish: function () {},
                subscribe: function() {}
            };
        });

        afterEach(function(){
            comAliasRoleList.delete;
            sandbox.restore();
        });

        describe('onStart()', function() {
            it('should call refresh', function () {
                var refreshSpy = sandbox.spy(comAliasRoleList, 'refresh');
                comAliasRoleList.onStart();
                expect(refreshSpy.calledOnce).to.equal(true);
            });

            it('should destroy table if already created', function(){
                var widgetStub = {
                    destroy: function() {}
                };
                comAliasRoleList.table = widgetStub;
                var destroySpy = sandbox.spy(widgetStub, "destroy");
                comAliasRoleList.onStart();
                expect(destroySpy.calledOnce).to.equal(true);
            });
        });

        describe('refresh()', function() {
            it('should call createTable', function () {
                var createTableSpy = sandbox.spy(comAliasRoleList, 'createTable');
                comAliasRoleList.refresh();
                expect(createTableSpy.calledOnce).to.equal(true);
            });
        });

        describe('onStop()', function() {
            it('should destroy widget', function () {

                var widgetStub = {
                    destroy: function() {}
                };
                comAliasRoleList.table = widgetStub;
                var destroySpy = sandbox.spy(widgetStub, 'destroy');
                comAliasRoleList.onStop();
                expect(destroySpy.calledOnce).to.equal(true);
            });
        });

        describe('createTable()', function() {
            var addPageLoadedHandlerSpy, addFilterHandlerSpy, addRowSelectionHandlerSpy, attachTableSpy;
            beforeEach(function() {
                addPageLoadedHandlerSpy = sandbox.spy(comAliasRoleList, 'addPageLoadedHandler');
                addRowSelectionHandlerSpy = sandbox.spy(comAliasRoleList, 'addRowSelectionHandler');
                attachTableSpy = sandbox.spy(comAliasRoleList, 'attachTable');
                comAliasRoleList.createTable();
            });

            it('table should be created', function() {
                expect(comAliasRoleList.table).not.to.be.undefined;
            });

            it('pageLoaded event handler should be added when creating table', function() {
                expect(addPageLoadedHandlerSpy.calledOnce).to.equal(true);
            });

            it('rowSelection event handler should be added when creating table', function() {
                expect(addRowSelectionHandlerSpy.calledOnce).to.equal(true);
            });

            it('table should be attached when creating table', function() {
                expect(attachTableSpy.calledOnce).to.equal(true);
            });
        });

        describe('addPageLoadedHandler()', function() {
            var roleMgmtTableStub, addEventHandlerSpy;
            beforeEach(function() {
                roleMgmtTableStub = { addEventHandler: function() {} };
                addEventHandlerSpy = sandbox.spy(roleMgmtTableStub, 'addEventHandler');
                comAliasRoleList.table = roleMgmtTableStub;

                comAliasRoleList.addPageLoadedHandler();
            });

            it('page load handler should be added', function() {
                expect(addEventHandlerSpy.calledOnce).to.equal(true);
                expect(addEventHandlerSpy.getCall(0).args[0]).to.equal('pageload');
            });
        });

        describe('selectRows()', function() {
            var tableStub, roleMgmtTableStub, selectRowsSpy, optionsMock;
            beforeEach(function() {
                roleMgmtTableStub = {selectRows: sandbox.stub()};
                comAliasRoleList.table = roleMgmtTableStub;
            });

            it('should select row on table when selectedItemsReceivedFlag false while role create', function() {
                optionsMock = { action: 'create' };
                comAliasRoleList.selectRows(['mockData']);
                expect(roleMgmtTableStub.selectRows.calledOnce).to.equal(true);
                expect(roleMgmtTableStub.selectRows.getCall(0).args[0]).to.deep.equal(['mockData']);
            });
        });

        describe('attachTable()', function() {
            var widgetStub, tableStub;
            var getTableSpy, attachToSpy;
            beforeEach(function() {

                widgetStub = {
                    getTable: function() {},
                    attachTo: function() {}
                };

                getTableSpy = sandbox.spy(widgetStub, 'getTable');
                attachToSpy = sandbox.spy(widgetStub, 'attachTo');

                comAliasRoleList.table = widgetStub;
                comAliasRoleList.attachTable();
            });

            it('table should be attached', function() {
                expect(attachToSpy.calledOnce).to.equal(true);
                expect(attachToSpy.getCall(0).args[0]).not.to.be.undefined;
            });
        });

        describe('addRowSelectionHandler()', function() {
            var widgetStub, tableStub;
            var getTableSpy, addEventHandlerSpy;
            beforeEach(function() {

                widgetStub = { getTable: function() {
                    return tableStub;
                }};

                tableStub = { addEventHandler: function() {} };

                getTableSpy = sandbox.spy(widgetStub, 'getTable');
                addEventHandlerSpy = sandbox.spy(tableStub, 'addEventHandler');

                comAliasRoleList.table = widgetStub;
                comAliasRoleList.addRowSelectionHandler();
            });

            it('event handler should be added', function() {
                expect(getTableSpy.calledOnce).to.equal(true);
                expect(addEventHandlerSpy.calledOnce).to.equal(true);
                expect(addEventHandlerSpy.getCall(0).args[0]).to.equal("rowselectend");
            });
        });

        describe('addRolesToModel()', function() {
            var publishSpy;
            beforeEach(function() {
                sandbox.stub(comAliasRoleList, 'getSelectedRolesName').returns(['role1','role2']);
                publishSpy = sandbox.spy(eventBusStub, 'publish');
                comAliasRoleList.addRolesToModel();
            });

            it('should publish selected roles by eventBus', function() {
                expect(comAliasRoleList.getEventBus.callCount).to.equal(1);
                expect(publishSpy.calledOnce).to.equal(true);
            });

            it('should publish selected roles with correct arguments', function() {
                expect(publishSpy.calledWithExactly("comAliasRoleList:addComRoles", ['role1','role2'])).to.equal(true);
            });
        });

        describe('getSelectedRolesName()', function() {
            var tableStub, rowsMock;
            var getSelectedRowsDataSpy;
            var returnedValue;
            beforeEach(function() {
                rowsMock = [
                    {
                        id: 1,
                        name: 'role1',
                        description: 'role1Desc'
                    },
                    {   id: 2,
                        name: 'role2',
                        description: 'role2Desc'
                    }
                ];

                tableStub = {
                    getSelectedRowsData: function() {
                        return rowsMock;
                    }
                };

                comAliasRoleList.table = tableStub;
                getSelectedRowsDataSpy = sandbox.spy(tableStub, 'getSelectedRowsData');
                returnedValue = comAliasRoleList.getSelectedRolesName();
            });

            it('should return only selected roles names', function() {
                expect(getSelectedRowsDataSpy.calledOnce).to.equal(true);
                expect(returnedValue).to.deep.equal(['role1', 'role2']);
            });
        });

        describe('onRolesToSelectReceived()', function() {
            var roleItems, result, selectRowsStub;
            beforeEach(function() {
                roleItems = [
                    {name: "mockRole1", description: "mockDescription1"},
                    {name: "mockRole2", description: "mockDescription2"},
                    {name: "mockRole3", description: "mockDescription3"}
                ];
                comAliasRoleList.selectedItemsReceivedFlag = false;
                selectRowsStub = sandbox.stub(comAliasRoleList, 'selectOrDisplayRoles');
                var result = comAliasRoleList.onRolesToSelectReceived(roleItems);
            });

            it('should return selected roles names', function() {
                expect(comAliasRoleList.selectedItems).to.deep.equal(["mockRole1", "mockRole2", "mockRole3"]);
            });

            it('should set received flag to true', function() {
                expect(comAliasRoleList.selectedItemsReceivedFlag).to.equal(true);
            });

            it('should call selectRoles', function () {
                expect(selectRowsStub.calledOnce).to.equal(true);
            });
        });

        describe('displayOnlySelectedRows', function() {
            var persistOnlyMatchingRowsSpy, removeEventHandlerSpy, updateCounterSpy, getTableSpy;
            beforeEach(function() {
                comAliasRoleList.table = new RoleMgmtTable();
                comAliasRoleList.table.setData([{name: 'dataItem1'}]);
                persistOnlyMatchingRowsSpy = sandbox.spy(comAliasRoleList.table, 'persistOnlyMatchingRows');
                removeEventHandlerSpy = sandbox.spy(comAliasRoleList.table, 'removeEventHandler');
            });

            it('should select nothing when flags are incorrect', function() {
                comAliasRoleList.dataLoadedFlag = true;
                comAliasRoleList.selectedItemsReceivedFlag = false;
                comAliasRoleList.displayOnlySelectedRows(["mockParam"]);

                expect(removeEventHandlerSpy.callCount).to.equal(0);
                expect(persistOnlyMatchingRowsSpy.callCount).to.equal(0);
            });

            it('should select nothing when param is undefined', function() {
                comAliasRoleList.dataLoadedFlag = true;
                comAliasRoleList.selectedItemsReceivedFlag = true;
                comAliasRoleList.displayOnlySelectedRows();

                expect(removeEventHandlerSpy.calledOnce).to.equal(false);
                expect(persistOnlyMatchingRowsSpy.callCount).to.equal(0);
            });

            it('should select roles', function() {
                comAliasRoleList.dataLoadedFlag = true;
                comAliasRoleList.selectedItemsReceivedFlag = true;
                comAliasRoleList.table.setData([
                    {
                        name: "mockRole1"
                    },
                    {
                        name: "roleThatShouldNotBeSelected"
                    }
                ]);
                comAliasRoleList.displayOnlySelectedRows(["mockRole1"]);
                expect(removeEventHandlerSpy.calledOnce).to.equal(true);
                expect(persistOnlyMatchingRowsSpy.callCount).to.equal(1);
                expect(comAliasRoleList.table.getTable().getData()).to.deep.equal([{name: "mockRole1"}]);
            });
        });
    });
});