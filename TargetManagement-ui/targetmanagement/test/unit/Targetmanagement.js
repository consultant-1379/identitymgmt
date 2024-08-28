/*global define, describe, it, expect */
define([
    'jscore/core',
    'identitymgmtlib/ParamsLocationController',
    'identitymgmtlib/Utils',
    'identitymgmtlib/widgets/ResponsesSummaryDialog',
    'layouts/TopSection',
    'targetmanagement/Targetmanagement',
    'targetmanagement/regions/TargetMgmtRegion',
    'targetmanagement/ActionsManager',
    'targetmanagement/widgets/FilterWidget/FilterWidget',
    'widgets/Dialog',
    'i18n!targetmanagement/app.json'
], function (core, ParamsLocationController, Utils, ResponsesSummaryDialog, TopSection, Targetmanagement, TargetMgmtRegion, ActionsManager, FilterWidget, Dialog, Dictionary) {
    'use strict';

    describe('Targetmanagement', function () {

        it('Targetmanagement should be defined', function () {
            expect(Targetmanagement).not.to.be.undefined;
        });

        //VARS
        var sandbox, targetmanagement, initSpy;

        //STUBS, SPYS
        var eventBusStub, locationControllerStub, targetMgmtRegionStub;

        //MOCKS
        var mockContext, mockBreadCrumb, mockAppResponse;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            var server = sandbox.useFakeServer();
            sandbox.stub(Dialog.prototype, 'show'); //Prevent attaching dialog during unit tests in UI mode

            mockBreadCrumb = [{
                name: 'mockBreadCrumbLevel',
                url: '#mockBreadCrumbUrl'
            }];

            mockAppResponse = [{
                "id": "targetmanagement",
                "name": "Target Group Management",
                "shortInfo": "Target Group Management application allows users to perform operations on a Target Group",
                "acronym": "TGM",
                "favorite": "false",
                "resources": null,
                "hidden": false,
                "roles": "",
                "targetUri": "https://enmapache.athtem.eei.ericsson.se/#targetmanagement",
                "uri": "/rest/apps/web/targetmanagement"
              }];

            server.respondWith("POST", '/rest/apps', [200, { "Content-Type": "application/json", }, JSON.stringify(mockAppResponse)]);

            targetmanagement = new Targetmanagement({
                namespace: "mockNameSpace",
                breadcrumb: mockBreadCrumb,
                properties: { title: "mockTitle" }
            });

            eventBusStub = new core.EventBus();
            sandbox.spy(eventBusStub, 'subscribe');

            mockContext = new core.AppContext();
            mockContext.eventBus = eventBusStub;

            targetMgmtRegionStub = new TargetMgmtRegion({context: mockContext});
            sandbox.stub(targetMgmtRegionStub, 'refreshDataNeeded');
            targetmanagement.targetMgmtRegion = targetMgmtRegionStub;

            sandbox.stub(targetmanagement, 'getContext', function() {
                return mockContext;
            });

            sandbox.spy(targetmanagement, 'onStart');
            sandbox.stub(targetmanagement, 'getEventBus').returns(eventBusStub);

            locationControllerStub = new ParamsLocationController({
                namespace: 'targetmanagement'
            });

            sandbox.spy(locationControllerStub, 'start');
            sandbox.spy(locationControllerStub, 'stop');
            sandbox.spy(locationControllerStub, 'setNamespaceLocation');
            targetmanagement.locationController = locationControllerStub;

        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onStart()', function() {

            beforeEach(function() {
                sandbox.spy(ActionsManager, 'setContext');
                sandbox.spy(TopSection.prototype, 'init');
                sandbox.spy(TopSection.prototype, 'setContent');
                sandbox.spy(TopSection.prototype, 'attachTo');
                sandbox.spy(TargetMgmtRegion.prototype, 'init');
                sandbox.stub(targetmanagement, 'addEventHandlers');
                sandbox.stub(targetmanagement, 'addActionsEventHandlers');

                targetmanagement.onStart();
            });

            it('Should set context in ActionsManager', function() {
                expect(ActionsManager.setContext.callCount).to.equal(1);
            });

            it('Should provide TopSection with context', function() {
                expect(TopSection.prototype.init.callCount).to.equal(1);
                expect(TopSection.prototype.init.getCall(0).args[0].context).to.deep.equal(mockContext);
            });

            it('Should provide TopSection with breadcrumb', function() {
                expect(TopSection.prototype.init.getCall(0).args[0].breadcrumb).to.deep.equal(mockBreadCrumb);
                expect(TopSection.prototype.init.getCall(0).args[0].breadcrumb[0].name).to.equal('mockBreadCrumbLevel');
                expect(TopSection.prototype.init.getCall(0).args[0].breadcrumb[0].url).to.equal('#mockBreadCrumbUrl');
            });

            it('Should provide TopSection with title', function() {
                expect(TopSection.prototype.init.getCall(0).args[0].title).to.equal( "mockTitle");
            });


            it('Should provide TopSection with defaultActions', function() {
                expect(TopSection.prototype.init.getCall(0).args[0].defaultActions).to.deep.equal(ActionsManager.getDefaultActions());
            });

            it('should create multisliding panels', function(){
                expect(targetmanagement.multiSlidingPanels).not.to.be.undefined;
            });

            it('Should provide TopSection with content', function() {
                expect(TopSection.prototype.init.callCount).to.equal(1);
            });

            it('Should attach TopSection to main app', function() {
                expect(TopSection.prototype.attachTo.callCount).to.equal(1);
            });

            it('Should provide TargetMgmtRegion with context', function() {
                expect(TargetMgmtRegion.prototype.init.callCount).to.equal(1);
                expect(TargetMgmtRegion.prototype.init.getCall(0).args[0].context).to.deep.equal(mockContext);
            });

            it('Should define this.filterWidget', function() {
                expect(targetmanagement.filterWidget).to.be.defined;
            });
        });

        describe('onResume()', function() {

            beforeEach(function() {
                targetmanagement.onResume();
            });

            it('Should refresh region data', function() {
                expect(targetMgmtRegionStub.refreshDataNeeded.callCount).to.equal(1);
            });

            it('Should start location controller', function() {
                expect(locationControllerStub.start.callCount).to.equal(1);
            });
        });

        describe('onPause()', function() {

            beforeEach(function() {
                targetmanagement.onPause();
            });

            it('Should stop the location controller', function() {
                expect(locationControllerStub.stop.callCount).to.equal(1);
            });
        });

        describe('addEventHandlers()', function() {

            beforeEach(function() {
                sandbox.stub(targetmanagement, 'onResume');
                sandbox.stub(targetmanagement, 'addFilteredClearEventHandler');
                targetmanagement.addEventHandlers();
            });

            it('Should subscribe for refresh event ', function() {
                expect(eventBusStub.subscribe.callCount).to.equal(2);
                expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal('refresh');
            });

            describe('callback() refresh event', function() {

                var callbackRef;

                beforeEach(function() {
                    callbackRef = eventBusStub.subscribe.getCall(0).args[1];
                    callbackRef.call(targetmanagement);
                });

                it('Should execute onResume', function() {
                    expect(targetmanagement.onResume.callCount).to.equal(1);
                });
            });
        });

        describe('addActionsEventHandlers()', function() {

            function getAllSubscribeTopics(subscribeStubObject) {
                var subscribeTopics = [];
                var subscribeCallCount = subscribeStubObject.callCount;
                for(var callNumber = 0; callNumber < subscribeCallCount; ++callNumber) {
                    subscribeTopics.push(subscribeStubObject.getCall(callNumber).args[0]);
                }
                return subscribeTopics;
            }

            beforeEach(function() {
                sandbox.stub(targetmanagement, 'createAction');
                targetmanagement.addActionsEventHandlers();
            });

            it('Should subscribe fo actions:create event', function() {
                expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal('actions:create');
            });

            it('Should set handler to createAction', function() {
                var handlerReference = eventBusStub.subscribe.getCall(0).args[1];
                handlerReference();
                expect(targetmanagement.createAction.callCount).to.equal(1);
            });

            it('should subscribe to edit action', function() {
                var topics = getAllSubscribeTopics(eventBusStub.subscribe);
                expect(topics).to.include('actions:edit');
            });
        });

        describe('createAction()', function() {

            beforeEach(function() {
                targetmanagement.createAction();
            });

            it('Should refresh region data', function() {
                var locationHash = '#targetmanagement/targetgroup/create';
                expect(window.location.hash).to.equal(locationHash);
            });
        });

        describe('deleteAction()', function() {
            var TMock, initStub;
            beforeEach(function() {
                TMock = [{
                    name: "TestName"
                }];
                initStub = sandbox.stub(Dialog.prototype, 'init');
            });

            it('should create new delete dialog', function() {
                targetmanagement.deleteAction(TMock);

                expect(targetmanagement.deleteTG.toDelete.length).to.equal(1);
                expect(targetmanagement.deleteTG.toDelete[0]).to.equal('TestName');
                expect(initStub.calledOnce).to.equal(true);
                expect(initStub.getCall(0).args[0].header).to.equal(Dictionary.deleteTargetGroups.confirmDialog.deleteTgHeader);
                expect(initStub.getCall(0).args[0].content).to.equal(Dictionary.deleteTargetGroups.confirmDialog.deleteTgContent);
                expect(initStub.getCall(0).args[0].buttons.length).to.equal(2);
                expect(initStub.getCall(0).args[0].buttons[0].caption).to.equal(Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm);
                expect(initStub.getCall(0).args[0].buttons[1].caption).to.equal(Dictionary.deleteTargetGroups.confirmDialog.deleteTgCancel);
                expect(initStub.getCall(0).args[0].type).to.equal('warning');
                expect(initStub.getCall(0).args[0].visible).to.equal(true);
            });
        });

        describe('editAction', function() {
            it('should set location to edit page', function() {
                var mockTgName = 'mockTg';
                targetmanagement.editAction(mockTgName);
                var locationHash = '#targetmanagement/targetgroup/edit/' + mockTgName;
                expect(window.location.hash).to.equal(locationHash);
            });
        });

        describe('deleteTargetGroupsViaREST()', function() {
            var server, deleteTgOnSuccessHandlerProducerStub, deleteTGArrayMock, bindStub, deleteTgOnErrorHandlerProducerStub;
            beforeEach(function() {
                server = sinon.fakeServer.create();
                deleteTGArrayMock = {
                    toDelete: ["testRole"],
                    deleted: []
                };
                bindStub = sandbox.stub();
                targetmanagement.deleteTG = deleteTGArrayMock;
                deleteTgOnSuccessHandlerProducerStub = sandbox.stub(targetmanagement, 'deleteTgOnSuccessHandlerProducer').returns({
                    bind: bindStub
                });
                deleteTgOnErrorHandlerProducerStub = sandbox.stub(targetmanagement, 'deleteTgOnErrorHandlerProducer').returns({
                    bind: bindStub
                });
            });

            afterEach(function() {
                server.restore();
            });

            it('should delete TG with success response', function() {
                server.respondWith("DELETE", '/oss/idm/targetgroupmanagement/targetgroups', [204, {
                    "Content-Type": "application/json",
                    "Content-Length": 2
                }, '{""}']);
                targetmanagement.deleteTargetGroupsViaREST();

                expect(targetmanagement.deleteTG.toDelete.length).to.equal(1);
                expect(deleteTgOnSuccessHandlerProducerStub.calledOnce).to.equal(true);
                expect(deleteTgOnErrorHandlerProducerStub.calledOnce).to.equal(true);
                expect(bindStub.calledTwice).to.equal(true);
            });

            it('should delete TG with error response', function() {
                server.respondWith("DELETE", '/oss/idm/targetgroupmanagement/targetgroups', [404, {
                    "Content-Type": "application/json",
                    "Content-Length": 2
                }, '{""}']);
                targetmanagement.deleteTargetGroupsViaREST();

                expect(targetmanagement.deleteTG.toDelete.length).to.equal(1);
                expect(deleteTgOnSuccessHandlerProducerStub.calledOnce).to.equal(true);
                expect(deleteTgOnErrorHandlerProducerStub.calledOnce).to.equal(true);
                expect(bindStub.calledTwice).to.equal(true);
            });
        });

        describe("deleteTgOnSuccessHandlerProducer(targetGroup)", function() {
            var deleteTgOnSuccessHandlerFunction, xhrMock, getStatusStub, pushSpy, refreshTableSpy, deleteTGArrayMock, getResponseTextStub;

            beforeEach(function() {
                deleteTgOnSuccessHandlerFunction = targetmanagement.deleteTgOnSuccessHandlerProducer("testTG1");
                getStatusStub = sandbox.stub().returns("200");
                getResponseTextStub = sandbox.stub().returns("");
                xhrMock = {
                    getStatus: getStatusStub,
                    getResponseText: getResponseTextStub
                };
                refreshTableSpy = sandbox.spy(targetmanagement, 'refreshTable');

                deleteTGArrayMock = {
                    toDelete: [],
                    deleted: []
                };
                targetmanagement.deleteTG = deleteTGArrayMock;
                pushSpy = sandbox.spy(deleteTGArrayMock.deleted, 'push');
            });

            it("Should return function", function() {
                expect(deleteTgOnSuccessHandlerFunction).to.be.function;
            });

            it("Should add one element to deleted array and refresh table", function() {
                deleteTgOnSuccessHandlerFunction.call(targetmanagement, "", xhrMock);

                expect(pushSpy.calledOnce).to.equal(true);
                expect(targetmanagement.deleteTG.deleted.length).to.equal(1);
                expect(targetmanagement.deleteTG.deleted[0][0]).to.equal("testTG1");
                expect(targetmanagement.deleteTG.deleted[0][1]).to.equal("200");
                expect(targetmanagement.deleteTG.deleted[0][2]).to.equal(undefined);
                expect(targetmanagement.deletedTgSuccessCounter).to.equal(1);
                expect(refreshTableSpy.calledOnce).to.equal(true);
                expect(getStatusStub.calledOnce).to.equal(true);
            });
        });

        describe("deleteTgOnErrorHandlerProducer(targetGroup)", function() {
            var deleteTgOnErrorHandlerFunction, xhrMock, getStatusStub, pushSpy, refreshTableSpy, deleteTGArrayMock,getResponseTextStub;

            beforeEach(function() {
                deleteTgOnErrorHandlerFunction = targetmanagement.deleteTgOnErrorHandlerProducer("testTGErr");
                getStatusStub = sandbox.stub().returns("404");
                getResponseTextStub = sandbox.stub().returns("{\"internalErrorCode\": \"Some error 404\",\"httpStatusCode\": 404}");
                xhrMock = {
                    getStatus: getStatusStub,
                    getResponseText: getResponseTextStub
                };
                refreshTableSpy = sandbox.spy(targetmanagement, 'refreshTable');

                deleteTGArrayMock = {
                    toDelete: [],
                    deleted: []
                };
                targetmanagement.deleteTG = deleteTGArrayMock;
                pushSpy = sandbox.spy(deleteTGArrayMock.deleted, 'push');
            });

            it("Should return function", function() {
                expect(deleteTgOnErrorHandlerFunction).to.be.function;
            });

            it("Should add one element to deleted array and refresh table", function() {
                deleteTgOnErrorHandlerFunction.call(targetmanagement, "Some error 404", xhrMock);

                expect(pushSpy.calledOnce).to.equal(true);
                expect(targetmanagement.deleteTG.deleted.length).to.equal(1);
                expect(targetmanagement.deleteTG.deleted[0][0]).to.equal("testTGErr");
                expect(targetmanagement.deleteTG.deleted[0][1]).to.equal("404");
                expect(targetmanagement.deleteTG.deleted[0][2]).to.equal("Some error 404");
                expect(targetmanagement.deletedTgSuccessCounter).to.equal(0);
                expect(refreshTableSpy.calledOnce).to.equal(true);
                expect(getStatusStub.calledOnce).to.equal(true);
            });
        });

        describe("refreshTable()", function() {

            beforeEach(function() {
                sandbox.stub(eventBusStub, 'publish');
            });

            describe("When toDelete and deleted arrays size are different", function() {

                beforeEach(function() {
                    targetmanagement.deleteTG.toDelete = ["testTG1", "testTG2"];
                    targetmanagement.deleteTG.deleted = ["testTG1"];
                    targetmanagement.refreshTable();
                });

                it("Calls getEventBus() function", function() {
                    expect(targetmanagement.getEventBus.calledOnce).to.equal(false);
                });

                it("Calls publish() function with proper parameters", function() {
                    expect(eventBusStub.publish.calledWith('mainregion:refreshdata')).to.equal(false);
                });
            });

            describe("When toDelete and deleted arrays size are equal", function() {
                var showNotificationStub, isAllDeletedOkStub;
                beforeEach(function() {
                    targetmanagement.deleteTG.toDelete = ["testTG1", "testTG2"];
                    targetmanagement.deleteTG.deleted = ["testTG1", "testTG2"];
                    showNotificationStub = sandbox.stub(targetmanagement, 'showNotification');
                    sandbox.stub(targetmanagement, 'deletedTargetGroupsSummaryResultDialog');
                });

                it("Calls getEventBus() function", function() {
                    targetmanagement.refreshTable();
                    expect(targetmanagement.getEventBus.calledOnce).to.equal(true);
                });

                it("Calls publish() function with proper parameters", function() {
                    targetmanagement.refreshTable();
                    expect(eventBusStub.publish.calledWith('mainregion:refreshdata'));
                });

                it('should call show notification if all roles were deleted successfully', function() {
                    targetmanagement.deletedTgSuccessCounter = 2;
                    targetmanagement.refreshTable();
                    expect(showNotificationStub.calledOnce).to.equal(true);
                    expect(targetmanagement.deletedTargetGroupsSummaryResultDialog.callCount).to.equal(0);
                });

                it('should not show notification when not all roles were deleted successfully', function() {
                    targetmanagement.deletedTgSuccessCounter = 1;
                    targetmanagement.refreshTable();
                    expect(showNotificationStub.callCount).to.equal(0);
                    expect(targetmanagement.deletedTargetGroupsSummaryResultDialog.callCount).to.equal(1);
                });
            });
        });

        describe('deletedTargetGroupsSummaryResultDialog()', function() {
            var deleted; //targetmanagement.deleteTG.deleted
            var deletedTgSuccessCounter; //targetmanagement.deletedTgSuccessCounter
            beforeEach(function() {
                deleted = [];
                sandbox.stub(ResponsesSummaryDialog.prototype, 'init');
                deleted.push(["mockTG1", 404]);
            });

            describe('Initialise when successCounter is one', function() {
                beforeEach(function() {
                    deleted.push(["mockTG2", 204]);
                    deletedTgSuccessCounter = 1;
                    targetmanagement.deletedTargetGroupsSummaryResultDialog(deleted, deletedTgSuccessCounter);
                });

                it('Should instantiate one ResponsesSummaryDialog', function() {
                    expect(ResponsesSummaryDialog.prototype.init.callCount).to.equal(1);
                });

                it('Should correctly initialise data array', function() {
                    expect(ResponsesSummaryDialog.prototype.init.getCall(0).args[0].data).to.deep.equal(deleted);
                });

                it('Should correctly initialise error codes', function() {
                    expect(ResponsesSummaryDialog.prototype.init.getCall(0).args[0].errorCodes).to.deep.equal(Dictionary.errorCodes);
                });

                it('Should correctly initialise error success counter', function() {
                    expect(ResponsesSummaryDialog.prototype.init.getCall(0).args[0].successCounter).to.equal(deletedTgSuccessCounter);
                });

                it('Should correctly initialise error header', function() {
                    expect(ResponsesSummaryDialog.prototype.init.getCall(0).args[0].header).to.equal(Dictionary.deleteTargetGroups.response.DeleteResults);
                });
            });

            describe('Initialise when successCounter is zero', function() {
                beforeEach(function() {
                    deleted.push(["mockTG2", 404]);
                    deletedTgSuccessCounter = 0;
                    targetmanagement.deletedTargetGroupsSummaryResultDialog(deleted, deletedTgSuccessCounter);
                });

                it('Should correctly initialise error header', function() {
                    expect(ResponsesSummaryDialog.prototype.init.getCall(0).args[0].header).to.equal(Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup);
                });
            });

        });

        describe('showNotification()', function() {
            var createNotificationStub;
            beforeEach(function() {
                createNotificationStub = sandbox.stub(targetmanagement, 'createNotification');
            });

            it('should do nothing when deleted TGs count is 0', function() {
                targetmanagement.deleteTG.deleted = [];
                targetmanagement.showNotification();
                expect(createNotificationStub.callCount).to.equal(0);
            });

            it('should do nothing when deleted TGs count is 1', function() {
                targetmanagement.deleteTG.deleted = ["item1"];
                targetmanagement.showNotification();
                expect(createNotificationStub.callCount).to.equal(1);
                expect(createNotificationStub.getCall(0).args[0]).to.equal(
                    Dictionary.deleteTargetGroups.notifications.deletedTargetGroup);
            });

            it('should do nothing when deleted TGs count is 2', function() {
                targetmanagement.deleteTG.deleted = ["item1", "item2"];
                targetmanagement.showNotification();
                expect(createNotificationStub.callCount).to.equal(1);
                expect(createNotificationStub.getCall(0).args[0]).to.equal(
                    Dictionary.deleteTargetGroups.notifications.deletedTargetGroups + targetmanagement.deleteTG.deleted.length);
            });
        });

        describe('createNotification()', function() {
            var options;
            beforeEach(function() {
                targetmanagement.createNotification("mockLabel");
                options = targetmanagement.notification.options;
            });

            it('should set notifications options', function() {
                expect(options.label).to.equal("mockLabel");
                expect(options.color).to.equal("green");
                expect(options.icon).to.equal("tick");
                expect(options.showCloseButton).to.equal(true);
                expect(options.showAsGlobalToast).to.equal(true);
                expect(options.autoDismiss).to.equal(true);

            });
        });
    });
});
