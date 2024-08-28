define([
    'jscore/core',
    'identitymgmtlib/ErrorWidget',
    'targetmgmtlib/model/TargetgroupModel',
    'targetmgmtlib/widgets/TargetgroupForm/TargetgroupForm',
    'targetmgmtlib/widgets/TargetgroupForm/TargetgroupFormView',
    'targetmgmtlib/widgets/TargetsListWidget',
    "i18n!targetmgmtlib/dictionary.json",
    'identitymgmtlib/Utils'
], function (core, ErrorWidget, TargetgroupModel, TargetgroupForm, TargetgroupFormView, TargetsListWidget, dictionary, Utils) {
    'use strict';

    describe('TargetgroupForm', function () {
        var sandbox, targetGroupForm, eventBusStub, mockContext, targetGroupModel;

        it('TagetgroupForm should be defined', function() {
            expect(TargetgroupForm).not.to.be.undefined;
        });

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            eventBusStub = {
                publish: sandbox.stub(),
                subscribe: sandbox.stub(),
                unsubscribe: sandbox.stub()
            };
            mockContext = { eventBus: eventBusStub };
            targetGroupModel = new TargetgroupModel({id: "mockModel"});
            sandbox.stub(targetGroupModel, 'fetch');
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('view', function() {

            describe('initialise view for create case', function() {
                beforeEach(function() {
                    targetGroupForm = new TargetgroupForm({
                        action: 'create',
                        targetGroup: 'mockCreateTargetGroup',
                        model: targetGroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                });

                it('should collectly initialise view data', function() {
                    expect(targetGroupForm.view.mode.create).to.equal(true);
                    expect(targetGroupForm.view.mode.view).to.equal(undefined);
                    expect(targetGroupForm.view.mode.edit).to.equal(undefined);
                    expect(targetGroupForm.view.targetGroup).to.equal('mockCreateTargetGroup');
                });
            });

            describe('initialise view for view case', function() {
                beforeEach(function() {
                    targetGroupForm  = new TargetgroupForm({
                        action: 'view',
                        targetGroup: 'mockViewTargetGroup',
                        model: targetGroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                });

                it('should collectly initialise view data', function() {
                    expect(targetGroupForm.view.mode.create).to.equal(undefined);
                    expect(targetGroupForm.view.mode.view).to.equal(true);
                    expect(targetGroupForm.view.mode.edit).to.equal(undefined);
                    expect(targetGroupForm.view.targetGroup).to.equal('mockViewTargetGroup');
                });
            });

            describe('initialise view for edit case', function() {
                beforeEach(function() {
                    targetGroupForm  = new TargetgroupForm({
                        action: 'edit',
                        targetGroup: 'mockEditTargetGroup',
                        model: targetGroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                });

                it('should collectly initialise view data', function() {
                    expect(targetGroupForm.view.mode.create).to.equal(undefined);
                    expect(targetGroupForm.view.mode.view).to.equal(undefined);
                    expect(targetGroupForm.view.mode.edit).to.equal(true);
                    expect(targetGroupForm.view.targetGroup).to.equal('mockEditTargetGroup');
                });
            });
        });

        describe('onStart()', function() {

            describe('initialise form for create case', function() {
                beforeEach(function() {
                    targetGroupForm  = new TargetgroupForm({
                        action: 'create',
                        targetGroup: 'mockCreateTargetGroup',
                        model: targetGroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                });

                it('should subscribe to required events', function() {
                    expect(eventBusStub.subscribe.calledTwice).to.equal(true);
                    expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal("model:update");
                    expect(eventBusStub.subscribe.getCall(1).args[0]).to.equal("model:hasErrors");
                });

                it('should not fetch model', function() {
                    expect(targetGroupModel.fetch.callCount).to.equal(0);
                });
                it('should not create targetsListTable', function() {
                   expect(targetGroupForm.targetsTableWidget).to.be.null;
                });
            });

            describe('initialise view for view case', function() {
                beforeEach(function() {
                    targetGroupForm  = new TargetgroupForm({
                        action: 'view',
                        targetGroup: 'mockViewTargetGroup',
                        model: targetGroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                });

                it('should subscribe to required events', function() {
                    expect(eventBusStub.subscribe.calledTwice).to.equal(true);
                    expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal("model:update");
                    expect(eventBusStub.subscribe.getCall(1).args[0]).to.equal("model:hasErrors");
                });

                it('should fetch model', function() {
                    expect(targetGroupModel.fetch.callCount).to.equal(1);
                });
               it('should create targetsListTable', function() {
                   expect(targetGroupForm.targetsTableWidget).not.to.be.null;
               });
            });

            describe('initialise view for edit case', function() {
                beforeEach(function() {
                    targetGroupForm  = new TargetgroupForm({
                        action: 'edit',
                        targetGroup: 'mockEditTargetGroup',
                        model: targetGroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                });

                it('should subscribe to required events', function() {
                    expect(eventBusStub.subscribe.calledTwice).to.equal(true);
                    expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal("model:update");
                    expect(eventBusStub.subscribe.getCall(1).args[0]).to.equal("model:hasErrors");
                });

                it('should fetch model', function() {
                    expect(targetGroupModel.fetch.callCount).to.equal(1);
                });
               it('should create targetsListTable', function() {
                   expect(targetGroupForm.targetsTableWidget).not.to.be.null;
               });
            });

            describe('not initialise view for unexpected action case', function() {
                beforeEach(function() {
                    targetGroupForm  = new TargetgroupForm({
                        action: 'mockUnexpectedAction',
                        targetGroup: 'mockEditTargetGroup',
                        model: targetGroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                });

                it('should subscribe to required events', function() {
                    expect(eventBusStub.subscribe.calledTwice).to.equal(true);
                    expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal("model:update");
                    expect(eventBusStub.subscribe.getCall(1).args[0]).to.equal("model:hasErrors");
                });

                it('should not fetch model', function() {
                    expect(targetGroupModel.fetch.callCount).to.equal(0);
                });
               it('should not create targetsListTable', function() {
                   expect(targetGroupForm.targetsTableWidget).to.be.null;
               });
            });
        });

        describe('onStop()', function() {

            describe('initialise view for create case', function() {
                beforeEach(function() {
                    targetGroupForm = new TargetgroupForm({
                        action: 'create',
                        targetGroup: 'mockCreateTargetGroup',
                        model: targetGroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                    targetGroupForm.modelUpdateSubscriptionId = 'mockModelUpdateSubscriptionId';
                    targetGroupForm.modelErrorSubscriptionId = 'mockModelErrorSubscriptionId';
                    targetGroupForm.destroy();
                });

                it('should unsubscribe from model:update event', function() {
                    expect(eventBusStub.unsubscribe.callCount).to.equal(3);
                    expect(eventBusStub.unsubscribe.getCall(0).args[0]).to.equal('model:update');
                    expect(eventBusStub.unsubscribe.getCall(0).args[1]).to.equal('mockModelUpdateSubscriptionId');
                });

                it('should unsubscribe from model:hasErrors event', function() {
                    expect(eventBusStub.unsubscribe.callCount).to.equal(3);
                    expect(eventBusStub.unsubscribe.getCall(1).args[0]).to.equal('model:hasErrors');
                    expect(eventBusStub.unsubscribe.getCall(1).args[1]).to.equal('mockModelErrorSubscriptionId');
                });
            });
        });

        describe('createTargetsListTableWidget()', function() {
            beforeEach(function() {

                targetGroupForm  = new TargetgroupForm({
                    action: 'mockTargetGroupAction',
                    targetGroup: 'mockTargetGroup',
                    model: targetGroupModel,
                    context: mockContext,
                    eventBus: eventBusStub
                });
                sandbox.spy(TargetsListWidget.prototype, 'init');
                sandbox.spy(TargetsListWidget.prototype, 'attachTo');
                sandbox.spy(targetGroupForm.view, 'getTargetsListTableElement');
                targetGroupForm.createTargetsListTableWidget();
            });

            it('should initialise TargetsListWidget with action', function() {
                expect(TargetsListWidget.prototype.init.getCall(0).args[0].action).to.equal('mockTargetGroupAction');
            });

            it('should initialise TargetsListWidget with targetGroup', function() {
                expect(TargetsListWidget.prototype.init.getCall(0).args[0].targetGroup).to.equal('mockTargetGroup');
            });

            it('should attach TargetsListWidget to element in view', function() {
                expect(TargetsListWidget.prototype.attachTo.callCount).to.equal(1);
                expect(targetGroupForm.view.getTargetsListTableElement.callCount).to.equal(1);
            });
        });

        describe('showErrors()', function() {
            var errors;
            beforeEach(function() {
                targetGroupForm.view.setNameValid = sandbox.stub();
                targetGroupForm.view.setNameInvalid = sandbox.stub();
                targetGroupForm.view.setDescriptionValid = sandbox.stub();
                targetGroupForm.view.setDescriptionInvalid = sandbox.stub();
                targetGroupForm.options.action = 'create';
            });

            describe('showErrors() for create action', function() {
                var errors;
                beforeEach(function() {
                    targetGroupForm.view.setNameValid = sandbox.stub();
                    targetGroupForm.view.setNameInvalid = sandbox.stub();
                    targetGroupForm.view.setDescriptionValid = sandbox.stub();
                    targetGroupForm.view.setDescriptionInvalid = sandbox.stub();
                    targetGroupForm.options.action = 'create';
                });

                it('should set name and description valid', function() {
                    errors = {};
                    targetGroupForm.showErrors(errors);
                    expect(targetGroupForm.view.setNameValid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setNameInvalid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setDescriptionValid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescriptionInvalid.callCount).to.equal(0);
                });

                it('should set name error', function() {
                    errors = {
                        name: "nameErrorContent"
                    };
                    targetGroupForm.showErrors(errors);
                    expect(targetGroupForm.view.setNameValid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setNameInvalid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setNameInvalid.getCall(0).args[0]).to.equal("nameErrorContent");
                    expect(targetGroupForm.view.setDescriptionValid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescriptionInvalid.callCount).to.equal(0);
                });

                it('should set description error', function() {
                    errors = {
                        description: "descriptionErrorContent"
                    };
                    targetGroupForm.showErrors(errors);
                    expect(targetGroupForm.view.setNameValid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setNameInvalid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setDescriptionValid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setDescriptionInvalid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescriptionInvalid.getCall(0).args[0]).to.equal("descriptionErrorContent");
                });

                it('should set name and description error', function() {
                    errors = {
                        name: "nameErrorContent",
                        description: "descriptionErrorContent"
                    };
                    targetGroupForm.showErrors(errors);
                    expect(targetGroupForm.view.setNameValid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setNameInvalid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setNameInvalid.getCall(0).args[0]).to.equal("nameErrorContent");
                    expect(targetGroupForm.view.setDescriptionValid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setDescriptionInvalid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescriptionInvalid.getCall(0).args[0]).to.equal("descriptionErrorContent");
                });
            });

            describe('showErrors() for edit action', function() {
                var errors;
                beforeEach(function() {
                    targetGroupForm.view.setNameValid = sandbox.stub();
                    targetGroupForm.view.setNameInvalid = sandbox.stub();
                    targetGroupForm.view.setDescriptionValid = sandbox.stub();
                    targetGroupForm.view.setDescriptionInvalid = sandbox.stub();
                    targetGroupForm.options.action = 'edit';
                });

                it('should description valid', function() {
                    errors = {};
                    targetGroupForm.showErrors(errors);
                    expect(targetGroupForm.view.setNameValid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setNameInvalid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setDescriptionValid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescriptionInvalid.callCount).to.equal(0);
                });

                it('should not set name error', function() {
                    errors = {
                        name: "nameErrorContent"
                    };
                    targetGroupForm.showErrors(errors);
                    expect(targetGroupForm.view.setNameValid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setNameInvalid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setDescriptionValid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescriptionInvalid.callCount).to.equal(0);
                });

                it('should set description error', function() {
                    errors = {
                        description: "descriptionErrorContent"
                    };
                    targetGroupForm.showErrors(errors);
                    expect(targetGroupForm.view.setNameValid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setNameInvalid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setDescriptionValid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setDescriptionInvalid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescriptionInvalid.getCall(0).args[0]).to.equal("descriptionErrorContent");
                });

                it('should set only description error', function() {
                    errors = {
                        name: "nameErrorContent",
                        description: "descriptionErrorContent"
                    };
                    targetGroupForm.showErrors(errors);
                    expect(targetGroupForm.view.setNameValid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setNameInvalid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setDescriptionValid.callCount).to.equal(0);
                    expect(targetGroupForm.view.setDescriptionInvalid.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescriptionInvalid.getCall(0).args[0]).to.equal("descriptionErrorContent");
                });
            });

        });

        describe('fetchModel()', function() {

            //TODO: fetch model test uses GET all TGs REST workaround
            //need to be updated then specidic target group REST will be implemented

            var server, targetgroupModel;
            beforeEach(function() {
                targetgroupModel = new TargetgroupModel();
                sandbox.spy(targetgroupModel, 'fetch');
                server = sinon.fakeServer.create();
                sandbox.spy(ErrorWidget.prototype, 'init');
                sandbox.spy(ErrorWidget.prototype, 'attachTo');
            });

            afterEach(function() {
                server.restore();
            });

            it('should execute fetchModel function on TargetgroupModel', function() {
                server.respondWith(
                    "GET",
                    '/oss/idm/targetgroupmanagement/targetgroups',
                     [
                        200,
                        {
                            "Content-Type": "application/json",
                            "Content-Length": 2
                        },
                        '[{"name":"ALL","description":"Target group for ALL elements","category":null},'+
                         '{"name":"NONE","description":"Target group for NONE elements","category":null},'+
                         '{"name":"mockTargetGroup","description":"mockTargetGroup description","category":null}]'
                    ]
                );

                targetGroupForm  = new TargetgroupForm({
                    action: 'view',
                    targetGroup: 'mockTargetGroup',
                    model: targetgroupModel,
                    context: mockContext,
                    eventBus: eventBusStub
                });
                sandbox.stub(targetGroupForm, 'updateView');
                server.respond();
                expect(targetgroupModel.fetch.callCount).to.equal(1);
            });

            it('should updateView on success server response', function() {
                server.respondWith(
                    "GET",
                    '/oss/idm/targetgroupmanagement/targetgroups',
                     [
                        200,
                        {
                            "Content-Type": "application/json",
                            "Content-Length": 2
                        },
                        '[{"name":"ALL","description":"Target group for ALL elements","category":null},'+
                         '{"name":"NONE","description":"Target group for NONE elements","category":null},'+
                         '{"name":"mockTargetGroup","description":"mockTargetGroup description","category":null}]'
                    ]
                );
                targetGroupForm  = new TargetgroupForm({
                    action: 'view',
                    targetGroup: 'mockTargetGroup',
                    model: targetgroupModel,
                    context: mockContext,
                    eventBus: eventBusStub
                });
                sandbox.stub(targetGroupForm, 'updateView');
                server.respond();
                expect(targetGroupForm.updateView.callCount).to.equal(1);
            });

            it('should show ErrorWidget on error response', function() {
                server.respondWith(
                    "GET",
                    '/oss/idm/targetgroupmanagement/targetgroups',
                     [
                        404,
                        {
                            "Content-Type": "application/json",
                            "Content-Length": 2
                        },
                        '{"userMessage":"mock.",'+
                         '"httpStatusCode":404,'+
                         '"internalErrorCode":"1.999",'+
                         '"developerMessage":"mock",'+
                         '"time":"2016-01-19T11:00:17"}'
                    ]
                );
                targetGroupForm  = new TargetgroupForm({
                    action: 'view',
                    targetGroup: 'mockTargetGroup',
                    model: targetgroupModel,
                    context: mockContext,
                    eventBus: eventBusStub
                });
                sandbox.stub(targetGroupForm, 'updateView');
                server.respond();
                expect(targetGroupForm.updateView.callCount).to.equal(0);
                expect(ErrorWidget.prototype.init.callCount).to.equal(2);
                expect(ErrorWidget.prototype.init.getCall(0).args[0].header).to.equal(dictionary.targetgroupForm.fetch_target_group_failed);
                expect(ErrorWidget.prototype.init.getCall(0).args[0].content).to.equal(Utils.getErrorMessage(404).defaultHttpMessage);
                expect(ErrorWidget.prototype.attachTo.callCount).to.equal(2);
            });
        });

        describe('updateModel()', function() {
            var modelStub;
            beforeEach(function() {
                modelStub = {
                    setName: sandbox.stub(),
                    setDescription: sandbox.stub()
                };
                targetGroupForm.options.model = modelStub;

                targetGroupForm.view.getName = sandbox.stub();
                targetGroupForm.view.getDescription = sandbox.stub();

            });

            describe('updateModel for create action', function() {

                beforeEach(function() {
                    targetGroupForm.options.action = 'create';
                    targetGroupForm.updateModel();
                });

                it('should set model attributes', function() {
                    expect(targetGroupForm.view.getName.callCount).to.equal(1);
                    expect(targetGroupForm.view.getDescription.calledOnce).to.equal(true);
                    expect(modelStub.setName.calledOnce).to.equal(true);
                    expect(modelStub.setDescription.calledOnce).to.equal(true);
                });
            });

            describe('updateModel for view action', function() {

                beforeEach(function() {
                    targetGroupForm.options.action = 'view';
                    targetGroupForm.updateModel();
                });

                it('should set model attributes', function() {
                    expect(targetGroupForm.view.getName.callCount).to.equal(0);
                    expect(targetGroupForm.view.getDescription.calledOnce).to.equal(true);
                    expect(modelStub.setName.calledOnce).to.equal(true);
                    expect(modelStub.setDescription.calledOnce).to.equal(true);
                });
            });

            describe('updateModel for edit action', function() {

                beforeEach(function() {
                    targetGroupForm.options.action = 'edit';
                    targetGroupForm.updateModel();
                });

                it('should set model attributes', function() {
                    expect(targetGroupForm.view.getName.callCount).to.equal(0);
                    expect(targetGroupForm.view.getDescription.calledOnce).to.equal(true);
                    expect(modelStub.setName.calledOnce).to.equal(true);
                    expect(modelStub.setDescription.calledOnce).to.equal(true);
                });
            });
        });

        describe('updateView()', function() {
            var targetgroupModel;

            describe('updateView for create case', function() {
                beforeEach(function() {

                    targetgroupModel = new TargetgroupModel();
                    targetGroupForm  = new TargetgroupForm({
                        action: 'create',
                        targetGroup: 'mockCreateTargetGroup',
                        model: targetgroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                    sandbox.stub(targetgroupModel, 'getName');
                    sandbox.stub(targetgroupModel, 'getDescription');
                    sandbox.stub(targetGroupForm.view, 'setName');
                    sandbox.stub(targetGroupForm.view, 'setDescription');
                    targetGroupForm.updateView();
                });

                it('should update name form model', function() {
                    expect(targetgroupModel.getName.callCount).to.equal(1);
                    expect(targetGroupForm.view.setName.callCount).to.equal(1);
                });

                it('should update description form model', function() {
                    expect(targetgroupModel.getDescription.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescription.callCount).to.equal(1);
                });
            });

            describe('updateView for view case', function() {
                beforeEach(function() {

                    targetgroupModel = new TargetgroupModel();
                    sandbox.stub(targetgroupModel, 'getName');
                    sandbox.stub(targetgroupModel, 'getDescription');
                    sandbox.stub(targetgroupModel, 'fetch');
                    targetGroupForm  = new TargetgroupForm({
                        action: 'view',
                        targetGroup: 'mockCreateTargetGroup',
                        model: targetgroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                    sandbox.stub(targetGroupForm.view, 'setName');
                    sandbox.stub(targetGroupForm.view, 'setDescription');
                });

                it('should not update name form model', function() {
                    targetGroupForm.updateView();
                    expect(targetgroupModel.getName.callCount).to.equal(1);
                    expect(targetGroupForm.view.setName.callCount).to.equal(0);
                });

                it('should update description form model', function() {
                    targetGroupForm.updateView();
                    expect(targetgroupModel.getDescription.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescription.callCount).to.equal(1);
                });
            });

            describe('updateView for edit case', function() {
                beforeEach(function() {

                    targetgroupModel = new TargetgroupModel();
                    sandbox.stub(targetgroupModel, 'getName');
                    sandbox.stub(targetgroupModel, 'getDescription');
                    sandbox.stub(targetgroupModel, 'fetch');
                    targetGroupForm  = new TargetgroupForm({
                        action: 'edit',
                        targetGroup: 'mockCreateTargetGroup',
                        model: targetgroupModel,
                        context: mockContext,
                        eventBus: eventBusStub
                    });
                    sandbox.stub(targetGroupForm.view, 'setName');
                    sandbox.stub(targetGroupForm.view, 'setDescription');
                    targetGroupForm.updateView();
                });

                it('should not update name form model', function() {
                    expect(targetgroupModel.getName.callCount).to.equal(0);
                    expect(targetGroupForm.view.setName.callCount).to.equal(0);
                });

                it('should update description form model', function() {
                    expect(targetgroupModel.getDescription.callCount).to.equal(1);
                    expect(targetGroupForm.view.setDescription.callCount).to.equal(1);
                });
            });

        });
    });
});