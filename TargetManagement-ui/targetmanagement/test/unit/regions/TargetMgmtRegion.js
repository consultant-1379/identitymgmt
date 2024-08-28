/*------------------------------------------------------------------------------
 *******************************************************************************
  * COPYRIGHT Ericsson 2016
  *
  * The copyright to the computer program(s) herein is the property of
  * Ericsson Inc. The programs may be used and/or copied only with written
  * permission from Ericsson Inc. or in accordance with the terms and
  * conditions stipulated in the agreement/contract under which the
  * program(s) have been supplied.
  *******************************************************************************
 -----------------------------------------------------------------------------*/
define([
    'targetmanagement/regions/TargetMgmtRegion',
    'identitymgmtlib/PaginatedTable',
    'identitymgmtlib/widgets/ShowRows',
    'targetmanagement/ActionsManager',
    'i18n!targetmanagement/app.json',
    'widgets/Dialog'
], function (TargetMgmtRegion, PaginatedTable, ShowRows, ActionsManager, Dictionary, Dialog) {
    'use strict';

    describe('TargetMgmtRegion', function () {

        it('TargetMgmtRegion should be defined', function () {
            expect(TargetMgmtRegion).not.to.be.undefined;
        });

        var eventBusStub, paginatedTableStub, contextStub, paramLocationStub, filterWidgetStub,
        targetMgmtRegion, sandbox;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            sandbox.stub(Dialog.prototype, 'show'); //Prevent attaching dialog during unit tests in UI mode

            eventBusStub = {
                publish: sandbox.stub(),
                subscribe: sandbox.stub()
            }

            paramLocationStub = {
                addParameterListener: sandbox.stub(),
                getParameter: sandbox.stub(),
                getParameters: sandbox.stub(),
                setParameter: sandbox.stub()
            }

            filterWidgetStub = {
                addEventHandler: sandbox.stub()
            }

            contextStub = {
                eventBus: eventBusStub,
                locationController: paramLocationStub,
                filterWidget: filterWidgetStub
            }

            sandbox.stub(TargetMgmtRegion.prototype, 'getContext', function() {
                return contextStub;
            });

            sandbox.stub(TargetMgmtRegion.prototype, 'getEventBus', function() {
                return eventBusStub;
            });

            targetMgmtRegion = new TargetMgmtRegion(contextStub);
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onStart()', function() {
            var setupTableStub;
            beforeEach(function() {
                setupTableStub = sandbox.stub(TargetMgmtRegion.prototype, 'setupTable');
                targetMgmtRegion.onStart();
            });

            it('should call setupTable()', function() {
                expect(setupTableStub.calledOnce).to.equal(true);
            });
        });

        describe('setupTable()', function() {
            var showRowsStub, addEventHandlersStub, attachTableStub, paginatedTableStub;
            beforeEach(function() {

                showRowsStub = sandbox.stub(ShowRows.prototype, 'configure');
                attachTableStub = sandbox.stub(PaginatedTable.prototype, 'attachTo');
                addEventHandlersStub = sandbox.stub(TargetMgmtRegion.prototype, 'addEventHandlers');
                targetMgmtRegion.forceXHR = undefined;
            });

            it('should not create and setup table when table exists', function() {
                var mockTable = {attachTo: sandbox.stub(), refreshData: sandbox.stub() };
                targetMgmtRegion.paginatedTable = mockTable;
                targetMgmtRegion.setupTable();

                expect(targetMgmtRegion.paginatedTable).to.equal(mockTable);
                expect(showRowsStub.callCount).to.equal(0);
                expect(targetMgmtRegion.forceXHR).to.be.undefined;

                expect(addEventHandlersStub.calledOnce).to.equal(true);
                expect(targetMgmtRegion.paginatedTable.attachTo.calledOnce).to.equal(true);
            });

            it('should create and setup table', function() {
                targetMgmtRegion.setupTable();

                expect(targetMgmtRegion.paginatedTable).to.be.PaginatedTable;
                expect(showRowsStub.calledOnce).to.equal(true);
                expect(targetMgmtRegion.forceXHR).to.equal(false);


                expect(addEventHandlersStub.calledOnce).to.equal(true);
                expect(targetMgmtRegion.paginatedTable.attachTo.calledOnce).to.equal(true);

            });

            it('should check created table options', function() {
                targetMgmtRegion.setupTable();
                var opt = targetMgmtRegion.paginatedTable.options;

                expect(opt.title).to.equal(Dictionary.targetGroups);
                expect(opt.url).to.equal('/oss/idm/targetgroupmanagement/targetgroups');
                expect(opt.headerInfo).to.equal(Dictionary.tableHeaderInformation);
                expect(opt.uniqueID).to.equal('name');
                expect(opt.widgets).to.have.property('showRows');
                expect(opt.columns.length).to.equal(2);
                expect(opt.columns[0].title).to.equal(Dictionary.targetMgmt.targetNameHeader);
                expect(opt.columns[0].attribute).to.equal('name');
                expect(opt.columns[0].width).to.equal('200px');
                expect(opt.columns[1].title).to.equal(Dictionary.targetMgmt.targetDescriptionHeader);
                expect(opt.columns[1].attribute).to.equal('description');
//                expect(opt.columns[1].width).to.equal('800px');
                expect(opt.sort.attribute).to.equal('name');
                expect(opt.sort.order).to.equal('asc');
            });
        });

        describe('getTable()', function() {
            it('should return table', function() {
                targetMgmtRegion.paginatedTable = "mockTable";
                expect(targetMgmtRegion.getTable()).to.equal("mockTable");
            });
        });

        describe('refreshDataNeeded()', function() {
            it('should set forceXHR to true', function() {
                targetMgmtRegion.forceXHR = undefined;
                targetMgmtRegion.refreshDataNeeded();

                expect(targetMgmtRegion.forceXHR).to.equal(true);
            });
        });

        describe('addEventHandlers()', function() {
            var tableAddEventHandlerStub, triggerContextActionsStub, mockParams;
            var filterStub, refreshDataStub, resetFilterStub, setQueryParamsStub;
            var getContextActionsStub;
            beforeEach(function() {
                mockParams = {
                    filter: "filterObject",
                    pagesize: 20
                }
                tableAddEventHandlerStub = sandbox.stub(PaginatedTable.prototype, 'addEventHandler');

                filterStub = sandbox.stub(PaginatedTable.prototype, 'filter');
                refreshDataStub = sandbox.stub(PaginatedTable.prototype, 'refreshData');
                resetFilterStub = sandbox.stub(PaginatedTable.prototype, 'resetFilter');
                setQueryParamsStub = sandbox.stub(PaginatedTable.prototype, 'setQueryParams');
                triggerContextActionsStub = sandbox.stub(targetMgmtRegion, 'triggerContextActions');

                targetMgmtRegion.paginatedTable = new PaginatedTable({
                    url: 'fakeUrl'
                });
                targetMgmtRegion.forceXHR = false;
                targetMgmtRegion.addEventHandlers();

            });

            it('should subscribe to mainregion:refreshdata event', function() {
                expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal("mainregion:refreshdata");
                var callback = eventBusStub.subscribe.getCall(0).args[1];
                expect(callback).to.be.function;
                callback.call(targetMgmtRegion);
                expect(refreshDataStub.calledOnce).to.equal(true);
            });

            it('should pageloaded event handler to paginatedTable', function() {
                expect(tableAddEventHandlerStub.getCall(0).args[0]).to.equal("pageloaded");
                var callback = tableAddEventHandlerStub.getCall(0).args[1];

                expect(callback).to.be.function;
                callback.call(targetMgmtRegion, mockParams);
                expect(triggerContextActionsStub.calledOnce).to.equal(true);
            });

            it('should add checkend event handler', function() {
                expect(tableAddEventHandlerStub.getCall(1).args[0]).to.equal("checkend");
                var callback = tableAddEventHandlerStub.getCall(1).args[1];
                expect(callback).to.be.function;
                callback.call(targetMgmtRegion, mockParams);
                expect(triggerContextActionsStub.calledOnce).to.equal(true);
                expect(triggerContextActionsStub.getCall(0).args[0]).to.deep.equal(mockParams)
            });
        });

        describe('triggerContextActions()', function() {
            var actionsManagerSpy, contextActions, mockCheckedRows;
            beforeEach(function() {
                mockCheckedRows = [{name: "mockTarget"}];
                contextActions = ActionsManager.getContextActions(mockCheckedRows);
                actionsManagerSpy = sandbox.spy(ActionsManager, 'getContextActions');
            });

            it('should publish leavecontext event when parameter is undefined', function() {
                targetMgmtRegion.triggerContextActions();

                expect(eventBusStub.publish.neverCalledWith('topsection:contextactions', contextActions)).to.equal(true);
                expect(eventBusStub.publish.calledOnce).to.equal(true);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal("topsection:leavecontext");
            });

            it('should publish leavecontext event when parameter is empty array', function() {
                targetMgmtRegion.triggerContextActions([]);

                expect(eventBusStub.publish.neverCalledWith('topsection:contextactions', contextActions)).to.equal(true);
                expect(eventBusStub.publish.calledOnce).to.equal(true);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal("topsection:leavecontext");
            });

            it('should publish event with actions object', function() {
                targetMgmtRegion.triggerContextActions(mockCheckedRows);

                expect(eventBusStub.publish.neverCalledWith('topsection:leavecontext')).to.equal(true);
                expect(eventBusStub.publish.calledOnce).to.equal(true);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal("topsection:contextactions");

                for(var i = 0; i < contextActions.length; i++) {
                    var contextAction = contextActions[i];
                    var eventBusContextAction = eventBusStub.publish.getCall(0).args[1][i];

                    // Every context action, which declaration contains function instead of plain object attributes, should be handled in this way.
                    if(contextAction.hasOwnProperty("name") && contextAction.name !== Dictionary.actions.createTargetGroup) {
                        // Explanation: chai's deep equal assertion implementation probably checks function references
                        // instead of their definitions - that's why we can not use to.deep.equal on entire contextAction array
                        for (var attributeName in contextAction){
                            if(typeof contextAction[attributeName] == 'function') {
                                expect(contextAction[attributeName].toString()).to.equal(eventBusContextAction[attributeName].toString());
                            } else {
                                expect(contextAction[attributeName]).to.equal(eventBusContextAction[attributeName]);
                            }
                        }
                    } else {
                        expect(eventBusContextAction).to.deep.equal(contextAction);
                    }
                }
            });
        });
    });
});
