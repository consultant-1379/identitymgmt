define([
    'jscore/core',
    'rolemgmtlib/regions/DisplayRole/DisplayRole',
    'rolemgmtlib/regions/ComAliasRoleList/ComAliasRoleList',
    'rolemgmtlib/widgets/CustomRoleDetails/CustomRoleDetails',
    'i18n!rolemgmtlib/dictionary.json'
], function (core, DisplayRole, ComRolesList, CustomRoleDetails, dictionary) {
    'use strict';

    describe('DisplayRole', function() {

        var sandbox, displayRole, mockContext, eventBusStub, fetchStub;
        var modelStub, modelBeforeModificationStub;

        it('DisplayRole should be defined', function() {
            expect(DisplayRole).not.to.be.undefined;
        });

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            fetchStub = sandbox.stub();
            modelStub = {
                fetch: fetchStub,
                getName: sandbox.stub().returns("mockName"),
                getDescription: sandbox.stub().returns("mockDescription"),
                getStatus: sandbox.stub().returns("DISABLED"),
                getType: sandbox.stub().returns('com'),
                getAttributes: sandbox.stub().returns({ roles: ["mockRole"] }),
                attributes: { roles: ["mockRole"] }
            }
            modelBeforeModificationStub = {
                setAttributes: sandbox.stub()
            };
            displayRole = new DisplayRole({
                model: modelStub,
                roleModelBeforeModification: modelBeforeModificationStub
            });

            eventBusStub = new core.EventBus();

            //Mock Context For Event Bus
            mockContext = new core.AppContext();
            mockContext.eventBus = eventBusStub;
            sandbox.stub(displayRole, 'getContext', function() {
                return mockContext;
            });
            sandbox.stub(displayRole, 'getEventBus', function() {
                return eventBusStub;
            });

            eventBusStub = {
                publish: sandbox.stub(),
                subscribe: sandbox.stub()
            };
        });

        afterEach(function(){
            displayRole.delete;
            sandbox.restore();
        });

        describe('onViewReady()', function() {
            var updateViewStub;
            beforeEach(function() {
                updateViewStub = sandbox.stub(displayRole, 'updateView');
                //don't call function, onViewRedy is called from constructor
            });

            it('should fetch data using model', function() {
                expect(fetchStub.calledOnce).to.equal(true);
            });

            it('should call updateView() on successfull fetch', function() {
                var onSuccessCallback = fetchStub.getCall(0).args[0].success;
                onSuccessCallback.call(displayRole);
                expect(updateViewStub.calledOnce).to.equal(true);
            });
        });

        describe('updateView()', function() {
            var showComRolesStub;
            var viewSetNameSpy, viewSetDescriptionSpy, viewSetStatusSpy, viewSetTypeSpy;
            beforeEach(function() {
                viewSetNameSpy = sandbox.spy(displayRole.view, 'setName');
                viewSetDescriptionSpy = sandbox.spy(displayRole.view, 'setDescription');
                viewSetStatusSpy = sandbox.spy(displayRole.view, 'setStatus');
                viewSetTypeSpy = sandbox.spy(displayRole.view, 'setType');

                showComRolesStub = sandbox.stub(displayRole, 'showComRoles');
            });

            var commonExpects = function() {
                expect(viewSetNameSpy.calledOnce).to.equal(true);
                expect(viewSetNameSpy.getCall(0).args[0]).to.equal('mockName');

                expect(viewSetDescriptionSpy.calledOnce).to.equal(true);
                expect(viewSetDescriptionSpy.getCall(0).args[0]).to.equal('mockDescription');

                expect(viewSetStatusSpy.calledOnce).to.equal(true);
                expect(viewSetStatusSpy.getCall(0).args[0]).to.equal(dictionary.roleForm.role_status_disabled);

                expect(modelStub.getName.calledOnce).to.equal(true);
                expect(modelStub.getDescription.calledOnce).to.equal(true);
                expect(modelStub.getStatus.calledOnce).to.equal(true);
            };

            it('should set view fields with values from model - com role', function() {
                displayRole.updateView();

                expect(showComRolesStub.callCount).to.equal(0);
                expect(eventBusStub.publish.callCount).to.equal(0);

                expect(viewSetTypeSpy.calledOnce).to.equal(true);
                expect(viewSetTypeSpy.getCall(0).args[0]).to.equal(dictionary.roleForm.com);

                expect(modelStub.getType.callCount).to.equal(5);
            });

            it('should set view fields with values from model - comalias', function() {
                modelStub.getType = sandbox.stub().returns('comalias');
                displayRole.updateView();

                expect(showComRolesStub.callCount).to.equal(1);
                expect(eventBusStub.publish.callCount).to.equal(0);

                expect(viewSetTypeSpy.calledOnce).to.equal(true);
                expect(viewSetTypeSpy.getCall(0).args[0]).to.equal(dictionary.roleForm.comalias);

                expect(modelStub.getType.callCount).to.equal(4);
            });

            it('should set view fields with values from model - cpp role', function() {
                modelStub.getType = sandbox.stub().returns('cpp');
                displayRole.updateView();

                expect(showComRolesStub.callCount).to.equal(0);
                expect(eventBusStub.publish.callCount).to.equal(0);

                expect(viewSetTypeSpy.calledOnce).to.equal(true);
                expect(viewSetTypeSpy.getCall(0).args[0]).to.equal(dictionary.roleForm.cpp);

                expect(modelStub.getType.callCount).to.equal(5);
            });

            it('should set view fields - application role', function() {
                modelStub.getType = sandbox.stub().returns('application');
                displayRole.updateView();

                expect(showComRolesStub.callCount).to.equal(0);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal("displayRole:hideEditButton");

                expect(viewSetTypeSpy.calledOnce).to.equal(true);
                expect(viewSetTypeSpy.getCall(0).args[0]).to.equal(dictionary.roleForm.system);

                expect(modelStub.getType.callCount).to.equal(4);
            });

            it('should set view fields - system role', function() {
                modelStub.getType = sandbox.stub().returns('system');
                displayRole.updateView();

                expect(showComRolesStub.callCount).to.equal(0);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal("displayRole:hideEditButton");

                expect(viewSetTypeSpy.calledOnce).to.equal(true);
                expect(viewSetTypeSpy.getCall(0).args[0]).to.equal(dictionary.roleForm.system);

                expect(modelStub.getType.callCount).to.equal(5);
            });

            it('should set view fields - custom role', function() {
                modelStub.getType = sandbox.stub().returns('custom');
                displayRole.updateView();

                expect(showComRolesStub.callCount).to.equal(0);

                expect(viewSetTypeSpy.calledOnce).to.equal(true);
                expect(viewSetTypeSpy.getCall(0).args[0]).to.equal(dictionary.roleForm.custom);

                expect(modelStub.getType.callCount).to.equal(5);
            });
        });

        describe('showComRoles()', function() {
            var startComRolesList;
            beforeEach(function() {
                startComRolesList = sandbox.stub(ComRolesList.prototype, 'start');
            });

            it('should create and start new comRolesList mock Action', function() {
                displayRole.options.action = 'mockAction';
                displayRole.showComRoles();

                expect(displayRole.comRolesList).not.to.be.undefined;
                expect(displayRole.comRolesList.options.action).to.equal('mockAction');
                expect(startComRolesList.calledOnce).to.equal(true);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal("comrolesTable:selectRoles");
            });

            it('should create and start new comRolesList create action', function() {
                displayRole.options.action = 'create';
                displayRole.showComRoles();

                expect(displayRole.comRolesList).not.to.be.undefined;
                expect(displayRole.comRolesList.options.action).to.equal('create');
                expect(startComRolesList.calledOnce).to.equal(true);
                expect(eventBusStub.publish.callCount).to.equal(0);
            });
        });

        describe('showCustomRoles()', function() {
            var attachCustomRolesList;
            beforeEach(function() {
                displayRole.options.action = "mockAction";
                attachCustomRolesList = sandbox.stub(CustomRoleDetails.prototype, 'attachTo');
                displayRole.showCustomRoles();
            });

            it('should attach customRoleDetails', function() {
                expect(displayRole.customRoleDetails).not.to.be.undefined;
                expect(attachCustomRolesList.calledOnce).to.equal(true);
                expect(displayRole.customRoleDetails.options.action).to.equal("mockAction");
            });
        });
    });
});
