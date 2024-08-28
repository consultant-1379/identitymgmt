define([
    'jscore/core',
    "i18n!rolemanagement/app.json",
    'rolemanagement/regions/RoleMgmtRegion',
    'identitymgmtlib/PaginatedTable',
    'identitymgmtlib/ParamsLocationController',
    'identitymgmtlib/widgets/ShowRows',
    'identitymgmtlib/widgets/TableSelectionInfoWidget',
    'rolemanagement/ActionsManager',
], function(core, Dictionary, RoleMgmtRegion, PaginatedTable, ParamsLocationController, ShowRows, TableSelectionInfoWidget, ActionsManager) {
    'use strict';

    describe('RoleMgmtRegion', function() {

        it('should be defined', function() {
            expect(RoleMgmtRegion).not.to.be.undefined;
        });

        var sandbox, roleMgmtRegion, eventBusStub, mockContext;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            eventBusStub = new core.EventBus();
            sandbox.spy(eventBusStub, 'subscribe');
            sandbox.spy(eventBusStub, 'publish');

            mockContext = new core.AppContext();
            mockContext.eventBus = eventBusStub;

            var locationController = new ParamsLocationController({
                namespace: 'mockNamespace'
            });

            roleMgmtRegion = new RoleMgmtRegion({
                context: mockContext,
                locationController: locationController
            });

            sandbox.stub(roleMgmtRegion, 'getContext').returns(mockContext);
            sandbox.stub(roleMgmtRegion, 'getEventBus').returns(eventBusStub);
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onStart()', function() {
            var setupTableSpy;
            beforeEach(function() {
                setupTableSpy = sandbox.stub(roleMgmtRegion, 'setupTable');
                roleMgmtRegion.onStart();
            });

            it('should call setupTable()', function() {
                expect(setupTableSpy.calledOnce).to.equal(true);
            });
        });

        describe('setupTable()', function() {

            beforeEach(function() {
                sandbox.stub(PaginatedTable.prototype, 'init');
                sandbox.stub(PaginatedTable.prototype, 'attachTo');
                sandbox.stub(ShowRows.prototype, 'init');
                sandbox.stub(ShowRows.prototype, 'configure');
                sandbox.spy(TableSelectionInfoWidget.prototype, 'init');
                sandbox.stub(TableSelectionInfoWidget.prototype, 'configure');
                sandbox.stub(roleMgmtRegion, 'addEventHandlers');
            });

            it('should add event handlers and attach widget when paginatedTable exists', function() {
                roleMgmtRegion.paginatedTable = new PaginatedTable({
                    url: 'fakeUrl'
                });
                roleMgmtRegion.setupTable();

                expect(roleMgmtRegion.addEventHandlers.calledOnce).to.equal(true);
                expect(PaginatedTable.prototype.attachTo.calledOnce).to.equal(true);
                expect(PaginatedTable.prototype.attachTo.getCall(0).args[0]).to.deep.equal(roleMgmtRegion.view.getTable());
            });

            it('should create paginatedTable', function() {
                roleMgmtRegion.setupTable();

                expect(roleMgmtRegion.paginatedTable).not.to.be.undefined;
                expect(roleMgmtRegion.addEventHandlers.calledOnce).to.equal(true);
                expect(PaginatedTable.prototype.attachTo.calledOnce).to.equal(true);
                expect(PaginatedTable.prototype.attachTo.getCall(0).args[0]).to.deep.equal(roleMgmtRegion.view.getTable());
            });

            it('should attach ShowRows and TableSelectionInfo widgets to paginatedTable', function() {
                roleMgmtRegion.setupTable();
                expect(PaginatedTable.prototype.init.calledOnce).to.equal(true);
                expect(PaginatedTable.prototype.init.getCall(0).args[0].widgets.showRows).not.to.be.undefined;
                expect(PaginatedTable.prototype.init.getCall(0).args[0].widgets.selectAllNotification).not.to.be.undefined;
            });

            it('should correctly initialise paginatedTable ShowRows widget', function() {
                roleMgmtRegion.setupTable();
                expect(ShowRows.prototype.init.calledOnce).to.equal(true);
                expect(ShowRows.prototype.init.getCall(0).args[0]).to.equal(undefined);
            });

            it('should correctly configure paginatedTable ShowRows widget', function() {
                roleMgmtRegion.setupTable();
                expect(ShowRows.prototype.configure.calledOnce).to.equal(true);
                expect(ShowRows.prototype.configure.getCall(0).args[0]).to.deep.equal({
                    paginatedTable: roleMgmtRegion.paginatedTable
                });
            });

            it('should correctly initialise paginatedTable TableSelectionInfo widget', function() {
                roleMgmtRegion.setupTable();
                expect(TableSelectionInfoWidget.prototype.init.calledOnce).to.equal(true);
                expect(TableSelectionInfoWidget.prototype.init.getCall(0).args[0].icon).to.equal('ebIcon ebIcon_dialogInfo');
                expect(TableSelectionInfoWidget.prototype.init.getCall(0).args[0].itemSingularPredicate).to.equal(Dictionary.tableSelectionInfoWidget.roleSingularPredicate);
                expect(TableSelectionInfoWidget.prototype.init.getCall(0).args[0].itemPluralPredicate).to.equal(Dictionary.tableSelectionInfoWidget.rolePluralPredicate);
            });

            it('should correctly configure paginatedTable TableSelectionInfo widget', function() {
                roleMgmtRegion.setupTable();
                expect(TableSelectionInfoWidget.prototype.configure.calledOnce).to.equal(true);
                expect(TableSelectionInfoWidget.prototype.configure.getCall(0).args[0]).to.deep.equal({
                    paginatedTable: roleMgmtRegion.paginatedTable
                });
            });

        });

        describe('getTable()', function() {
            it('should return paginated table element', function() {
                var mockTable = {
                    mockTable: "mocktable"
                };
                roleMgmtRegion.paginatedTable = mockTable;
                var result = roleMgmtRegion.getTable();

                expect(result).to.deep.equal(mockTable);
            });
        });

        describe('addEventHandlers()', function() {

            beforeEach(function() {
                sandbox.stub(PaginatedTable.prototype, 'addEventHandler');
                sandbox.stub(PaginatedTable.prototype, 'filter');
                sandbox.stub(PaginatedTable.prototype, 'refreshData');
                sandbox.stub(PaginatedTable.prototype, 'resetFilter');
                sandbox.stub(PaginatedTable.prototype, 'setQueryParam');

                sandbox.stub(roleMgmtRegion.options.locationController, 'addParameterListener');
                sandbox.stub(roleMgmtRegion.options.locationController, 'setParameter');
                sandbox.stub(roleMgmtRegion, 'triggerContextActions');

                roleMgmtRegion.paginatedTable = new PaginatedTable({
                    url: 'fakeUrl'
                });
                sandbox.stub(roleMgmtRegion.paginatedTable, 'getCheckedRows').returns('getCheckedRowsMockResult');

                roleMgmtRegion.addEventHandlers();

            });

            /////////////////////////////////////////////////////////////////////////////
            // SUBSCRIBE FOR EVENT BUS EVENTS
            /////////////////////////////////////////////////////////////////////////////

            describe('eventBus eventHandlers', function() {

                it('should subscribe for mainregion:refreshdata event', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'mainregion:refreshdata');
                    expect(callbackRef).to.be.function;
                });

                it('callback() for mainregion:refreshdata, should refreshData if paginatedTable defined', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'mainregion:refreshdata');
                    expect(callbackRef).to.be.function;
                    callbackRef.call(roleMgmtRegion);
                    expect(PaginatedTable.prototype.refreshData.callCount).to.equal(1);
                });

                it('callback() for mainregion:refreshdata, should not refreshData if paginatedTable not defined', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'mainregion:refreshdata');
                    expect(callbackRef).to.be.function;
                    roleMgmtRegion.paginatedTable = undefined;
                    callbackRef.call(roleMgmtRegion);
                    expect(PaginatedTable.prototype.refreshData.callCount).to.equal(0);
                });

                it('should subscribe for mainregion:filter event', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'mainregion:filter');
                    expect(callbackRef).to.be.function;
                });

                it('callback() for mainregion:filter, should filter data if pagination table defined', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'mainregion:filter');
                    callbackRef.call(roleMgmtRegion, 'mockArg');
                    expect(PaginatedTable.prototype.filter.callCount).to.equal(1);
                    expect(PaginatedTable.prototype.filter.getCall(0).args[0]).to.equal('mockArg');
                });

                it('callback() for mainregion:filter, should not filter data if pagination table not defined', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'mainregion:filter');
                    roleMgmtRegion.paginatedTable = undefined;
                    callbackRef.call(roleMgmtRegion, 'mockArg');
                    expect(PaginatedTable.prototype.filter.callCount).to.equal(0);
                });

                it('should subscribe for mainregion:resetfilter event', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'mainregion:filter');
                    expect(callbackRef).to.be.function;
                });

                it('callback() for mainregion:resetfilter, should reset filter if pagination table defined', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'mainregion:resetfilter');
                    callbackRef.call(roleMgmtRegion);
                    expect(PaginatedTable.prototype.resetFilter.callCount).to.equal(1);
                });

                it('callback() for mainregion:resetfilter, should not reset filter if pagination table not defined', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'mainregion:resetfilter');
                    roleMgmtRegion.paginatedTable = undefined;
                    callbackRef.call(roleMgmtRegion);
                    expect(PaginatedTable.prototype.resetFilter.callCount).to.equal(0);
                });

                it('should subscribe for layouts:rightpanel:beforechange event', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, "layouts:rightpanel:beforechange");
                    expect(callbackRef).to.be.function;
                });

                it('callback() for layouts:rightpanel:beforechange, should triggerContextActions for summary when not visible', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'layouts:rightpanel:beforechange');
                    callbackRef.call(roleMgmtRegion, false, 'summary');
                    expect(roleMgmtRegion.triggerContextActions.callCount).to.equal(1);
                });

                it('callback() for layouts:rightpanel:beforechange, should triggerContextActions for not summary when visible', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'layouts:rightpanel:beforechange');
                    callbackRef.call(roleMgmtRegion, true, 'notRoleRummary');
                    expect(roleMgmtRegion.triggerContextActions.callCount).to.equal(1);
                });

                it('callback() for layouts:rightpanel:beforechange, should not triggerContextActions for summary when visible', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'layouts:rightpanel:beforechange');
                    callbackRef.call(roleMgmtRegion, true, 'summary');
                    expect(roleMgmtRegion.triggerContextActions.callCount).to.equal(0);
                });

                it('callback() for layouts:rightpanel:beforechange, should not triggerContextActions for not summary when not visible', function() {
                    var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'layouts:rightpanel:beforechange');
                    callbackRef.call(roleMgmtRegion, false, 'notRoleRummary');
                    expect(roleMgmtRegion.triggerContextActions.callCount).to.equal(0);
                });
            });

            /////////////////////////////////////////////////////////////////////////////
            // SUBSCRIBE FOR LOCATION CONTROLLER PARAMETERS
            /////////////////////////////////////////////////////////////////////////////

            describe('locationController parameter listeners ', function() {

                it('should subscribe for locationController filter parameter', function() {
                    var callbackRef = getCallbackForEvent(roleMgmtRegion.options.locationController.addParameterListener, 'filter');
                    expect(callbackRef).to.be.function;
                });

                it('callback() for locationController filter parameter, should publish filters:updatevalues event', function() {
                    var callbackRef = getCallbackForEvent(roleMgmtRegion.options.locationController.addParameterListener, 'filter');
                    callbackRef.call(roleMgmtRegion, 'mockFilterValue');
                    expect(eventBusStub.publish.callCount).to.equal(1);
                    expect(eventBusStub.publish.getCall(0).args[0]).to.equal('filters:updatevalues');
                    expect(eventBusStub.publish.getCall(0).args[1]).to.equal('mockFilterValue');
                });

                it('callback() for locationController filter parameter, should set paginatedTable query params', function() {
                    var callbackRef = getCallbackForEvent(roleMgmtRegion.options.locationController.addParameterListener, 'filter');
                    callbackRef.call(roleMgmtRegion, 'mockFilterValue');
                    expect(roleMgmtRegion.paginatedTable.setQueryParam.callCount).to.equal(1);
                    expect(PaginatedTable.prototype.setQueryParam.getCall(0).args[0]).to.equal('filter');
                    expect(PaginatedTable.prototype.setQueryParam.getCall(0).args[1]).to.equal('mockFilterValue');
                });

                it('should subscribe for locationController pagesize parameter', function() {
                    var callbackRef = getCallbackForEvent(roleMgmtRegion.options.locationController.addParameterListener, 'pagesize');
                    expect(callbackRef).to.be.function;
                });

                it('callback() for locationController pagesize parameter, should set paginatedTable query params when paginated table defined', function() {
                    var callbackRef = getCallbackForEvent(roleMgmtRegion.options.locationController.addParameterListener, 'pagesize');
                    callbackRef.call(roleMgmtRegion, 'mockFilterValue');
                    expect(PaginatedTable.prototype.setQueryParam.callCount).to.equal(1);
                    expect(PaginatedTable.prototype.setQueryParam.getCall(0).args[0]).to.equal('pagesize');
                    expect(PaginatedTable.prototype.setQueryParam.getCall(0).args[1]).to.equal('mockFilterValue');
                });

                it('callback() for locationController pagesize parameter, should not set paginatedTable query params when paginated table not defined', function() {
                    var callbackRef = getCallbackForEvent(roleMgmtRegion.options.locationController.addParameterListener, 'pagesize');
                    roleMgmtRegion.paginatedTable = undefined;
                    callbackRef.call(roleMgmtRegion, 'mockFilterValue');
                    expect(PaginatedTable.prototype.setQueryParam.callCount).to.equal(0);
                });

                it('should subscribe for locationController pagenumber parameter', function() {
                    var callbackRef = getCallbackForEvent(roleMgmtRegion.options.locationController.addParameterListener, 'pagenumber');
                    expect(callbackRef).to.be.function;
                });

                it('callback() for locationController pagenumber parameter, should set paginatedTable query params when paginated table defined', function() {
                    var callbackRef = getCallbackForEvent(roleMgmtRegion.options.locationController.addParameterListener, 'pagenumber');
                    callbackRef.call(roleMgmtRegion, 'mockFilterValue');
                    expect(PaginatedTable.prototype.setQueryParam.callCount).to.equal(1);
                    expect(PaginatedTable.prototype.setQueryParam.getCall(0).args[0]).to.equal('pagenumber');
                    expect(PaginatedTable.prototype.setQueryParam.getCall(0).args[1]).to.equal('mockFilterValue');
                });

                it('callback() for locationController pagenumber parameter, should not set paginatedTable query params when paginated table not defined', function() {
                    var callbackRef = getCallbackForEvent(roleMgmtRegion.options.locationController.addParameterListener, 'pagenumber');
                    roleMgmtRegion.paginatedTable = undefined;
                    callbackRef.call(roleMgmtRegion, 'mockFilterValue');
                    expect(PaginatedTable.prototype.setQueryParam.callCount).to.equal(0);
                });
            });

            /////////////////////////////////////////////////////////////////////////////
            // SUBSCRIBE FOR PAGINATION TABLE EVENTS
            /////////////////////////////////////////////////////////////////////////////

            describe('paginatedTable eventHandlers', function() {

                var mockQueryParams, mockContextMenuEvents;

                beforeEach(function() {
                    mockQueryParams = {
                        mockParam1: 'mockParam1Value',
                        mockParam2: 'mockParam2Value'
                    };

                    mockContextMenuEvents = {
                        preventDefault: sandbox.stub()
                    };
                });

                it('should subscribe for paginatedTable pageloaded event', function() {
                    var callbackRef = getCallbackForEvent(PaginatedTable.prototype.addEventHandler, 'pageloaded');
                    expect(callbackRef).to.be.function;
                });

                it('callback() for paginatedTable pageloaded event, should trigger context actions', function() {
                    var callbackRef = getCallbackForEvent(PaginatedTable.prototype.addEventHandler, 'pageloaded');
                    callbackRef.call(roleMgmtRegion, mockQueryParams);
                    expect(roleMgmtRegion.triggerContextActions.getCall(0).args[0]).to.equal('getCheckedRowsMockResult');
                });

                it('callback() for paginatedTable pageloaded event, should set location controller parameter for each queryParam', function() {
                    var callbackRef = getCallbackForEvent(PaginatedTable.prototype.addEventHandler, 'pageloaded');
                    callbackRef.call(roleMgmtRegion, mockQueryParams);
                    expect(roleMgmtRegion.options.locationController.setParameter.callCount).to.equal(2);
                    expect(roleMgmtRegion.options.locationController.setParameter.getCall(0).args[0]).to.equal('mockParam1');
                    expect(roleMgmtRegion.options.locationController.setParameter.getCall(0).args[1]).to.equal('mockParam1Value');
                    expect(roleMgmtRegion.options.locationController.setParameter.getCall(0).args[2]).to.equal(true);
                    expect(roleMgmtRegion.options.locationController.setParameter.getCall(1).args[0]).to.equal('mockParam2');
                    expect(roleMgmtRegion.options.locationController.setParameter.getCall(1).args[1]).to.equal('mockParam2Value');
                    expect(roleMgmtRegion.options.locationController.setParameter.getCall(1).args[2]).to.equal(true);
                });

                it('callback() for paginatedTable pageloaded event, should publish rolemgmt:checkedRows event', function() {
                    var callbackRef = getCallbackForEvent(PaginatedTable.prototype.addEventHandler, 'pageloaded');
                    callbackRef.call(roleMgmtRegion, mockQueryParams);
                    expect(eventBusStub.publish.callCount).to.equal(1);
                    expect(eventBusStub.publish.getCall(0).args[0]).to.equal('rolemgmt:checkedRows');
                    expect(eventBusStub.publish.getCall(0).args[1]).to.equal('getCheckedRowsMockResult');
                });

                it('should subscribe for paginatedTable rowevents:contextmenu event', function() {
                    var callbackRef = getCallbackForEvent(PaginatedTable.prototype.addEventHandler, 'rowevents:contextmenu');
                    expect(callbackRef).to.be.function;
                });

                it('callback() for paginatedTable rowevents:contextmenu event, should publish rolemgmt:checkedRows when some rows selected', function() {
                    var callbackRef = getCallbackForEvent(PaginatedTable.prototype.addEventHandler, 'rowevents:contextmenu');
                    sandbox.stub(ActionsManager, 'getContextActions').returns(['mockItem1', 'mockItem2']);
                    callbackRef.call(roleMgmtRegion, 'mockRows', mockContextMenuEvents);

                    //TODO: expect container.getEventBus().publish contextmenu:show
                    expect(mockContextMenuEvents.preventDefault.callCount).to.equal(0);
                });

                it('callback() for paginatedTable rowevents:contextmenu event, should preventDefault events  when no rows selected', function() {
                    var callbackRef = getCallbackForEvent(PaginatedTable.prototype.addEventHandler, 'rowevents:contextmenu');
                    sandbox.stub(ActionsManager, 'getContextActions').returns([]);
                    callbackRef.call(roleMgmtRegion, 'mockRows', mockContextMenuEvents);
                    expect(mockContextMenuEvents.preventDefault.callCount).to.equal(1);
                });

                it('should subscribe for paginatedTable checkend event', function() {
                    var callbackRef = getCallbackForEvent(PaginatedTable.prototype.addEventHandler, 'checkend');
                    expect(callbackRef).to.be.function;
                });

                it('callback() for paginatedTable checkend event, should trigger context actions', function() {
                    var callbackRef = getCallbackForEvent(PaginatedTable.prototype.addEventHandler, 'checkend');
                    callbackRef.call(roleMgmtRegion, 'mockCheckedRows');
                    expect(roleMgmtRegion.triggerContextActions.callCount).to.equal(1);
                });

                it('callback() for paginatedTable checkend event, should trigger rolemgmt:checkedRows event', function() {
                    var callbackRef = getCallbackForEvent(PaginatedTable.prototype.addEventHandler, 'checkend');
                    callbackRef.call(roleMgmtRegion, 'mockCheckedRows');
                    expect(eventBusStub.publish.callCount).to.equal(1);
                    expect(eventBusStub.publish.getCall(0).args[0]).to.equal('rolemgmt:checkedRows');
                    expect(eventBusStub.publish.getCall(0).args[1]).to.equal('mockCheckedRows');
                });
            });
        });

        describe('triggerContextActions()', function() {
            var contextActions, mockCheckedRows;
            beforeEach(function() {
                mockCheckedRows = [{
                    type: "com"
                }];
                contextActions = ActionsManager.getContextActions(mockCheckedRows);
                sandbox.spy(ActionsManager, 'getContextActions');
            });

            it('should publish leavecontext event when parameter is undefined', function() {
                roleMgmtRegion.triggerContextActions();

                expect(eventBusStub.publish.neverCalledWith('topsection:contextactions', contextActions)).to.equal(true);
                expect(eventBusStub.publish.calledOnce).to.equal(true);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal("topsection:leavecontext");
            });

            it('should publish leavecontext event when parameter is empty array', function() {
                roleMgmtRegion.triggerContextActions([]);

                expect(eventBusStub.publish.neverCalledWith('topsection:contextactions', contextActions)).to.equal(true);
                expect(eventBusStub.publish.calledOnce).to.equal(true);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal("topsection:leavecontext");
            });

            it('should publish event with actions object', function() {
                roleMgmtRegion.triggerContextActions(mockCheckedRows);

                expect(eventBusStub.publish.neverCalledWith('topsection:leavecontext')).to.equal(true);
                expect(eventBusStub.publish.calledOnce).to.equal(true);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal("topsection:contextactions");
                expect(eventBusStub.publish.getCall(0).args[1].length).to.equal(contextActions.length);
            });
        });
    });

    /*  INFO: function must be in following format:
        handlerFunction("eventName", function )

        USAGE EXAMPLE:
        getCallbackForEvent(eventBusStub.subscribe, 'refresh')
        getCallbackForEvent(eventBusStub.publish, 'actions:create')
    */
    function getCallbackForEvent(eventSpy, eventName) {
        var callbackRef;
        for (var i = 0; i < eventSpy.callCount; i++) {
            if (eventSpy.getCall(i).args[0] === eventName) {
                callbackRef = eventSpy.getCall(i).args[1];
                break;
            }
        }
        return callbackRef;
    }
});