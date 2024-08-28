/*global define, describe, it, expect */
define([
    'jscore/core',
    'identitymgmtlib/ParamsLocationController',
    'targetgroup/Targetgroup',
    'targetmgmtlib/model/TargetgroupModel',
    'targetmgmtlib/widgets/TargetgroupForm',
    'identitymgmtlib/AccessControlService',
    'identitymgmtlib/Utils',
    "i18n!targetgroup/app.json",
    'layouts/TopSection',
    'widgets/Notification',
    'jscore/ext/utils/base/underscore',
    'targetgroup/TargetgroupActionsManager',
    'widgets/Dialog'
], function (core, LocationController, Targetgroup, TargetgroupModel, TargetgroupForm, AccessControlService, Utils, Dictionary, TopSection, Notification, Underscore, ActionManager, ErrorDialog) {
    'use strict';

    describe('Targetgroup', function () {
      var sandbox, targetgroup, eventBusStub, mockContext, mockAppResponse, mockBreadCrumb;
        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            var server = sandbox.useFakeServer();

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

            server.respondWith("POST", '/rest/apps', [200, {
                "Content-Type": "application/json",
            }, JSON.stringify(mockAppResponse)]);

            eventBusStub = new core.EventBus();
            sandbox.spy(eventBusStub, 'subscribe');
            sandbox.spy(eventBusStub, 'publish');

            mockContext = new core.AppContext();
            mockContext.eventBus = eventBusStub;

            targetgroup = new Targetgroup({
                namespace: 'mockNameSpace',
                breadcrumb: mockBreadCrumb,
                properties: { title: "mockTitle" },

            });
            targetgroup.locationController = new LocationController({
                namespace: "targetgroup",
                autoUrlDecode: false
            });

            sandbox.stub(targetgroup, 'getContext').returns(mockContext);
            sandbox.stub(targetgroup, 'getEventBus').returns(eventBusStub);

            mockBreadCrumb = [{
                name: 'mockBreadCrumbLevel',
                url: '#mockBreadCrumbUrl'
            }];
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('Targetgroup should be defined', function() {
            expect(Targetgroup).not.to.be.undefined;
        });

        describe('onStart()', function() {

            beforeEach(function() {
                sandbox.spy(AccessControlService, 'isAppAvailable');
                sandbox.spy(LocationController.prototype, 'init');
                sandbox.spy(LocationController.prototype, 'start');
                sandbox.spy(LocationController.prototype, 'addLocationListener');
                targetgroup.onStart();
            });

            it('should check acces to application', function() {
                expect(AccessControlService.isAppAvailable.calledOnce).to.equal(true);
            });

            it('should create location controller with proper parameters', function() {
                //FIXME: fix for work in progress
                // expect(LocationController.prototype.init.calledOnce).to.equal(true);
                // expect(LocationController.prototype.init.getCall(0).args[0].namespace).to.equal('mockNameSpace');
                // expect(LocationController.prototype.init.getCall(0).args[0].autoUrlDecode).to.equal(false);
            });

            it('should add location listener', function() {
                //FIXME: fix for work in progress
                // expect(LocationController.prototype.addLocationListener.calledOnce).to.equal(true);
            });

            it('should start location controller', function() {
                expect(LocationController.prototype.start.calledOnce).to.equal(true);
            });

            it('should set formDataSavedSuccessfully flag to true', function() {
                expect(targetgroup.formDataSavedSuccessfully).to.equal(true);
            });

            it('should init nameBeforeModiffication flag to false', function() {
                expect(targetgroup.targetgroupModelBeforeModification.getName()).to.equal("");
            });

            it('should init formDataSavedSuccessfully flag to false', function() {
                expect(targetgroup.targetgroupModelBeforeModification.getDescription()).to.equal("");
            });
        });

        describe('onLocationChange()', function() {

            var previousformRegion, targetGroupModel;

            beforeEach(function() {
                targetGroupModel = new TargetgroupModel();
                sandbox.stub(targetGroupModel, 'fetch');

                previousformRegion = new TargetgroupForm({
                    action: 'edit',
                    targetGroup: 'mockTartgetGroup',
                    model: targetGroupModel,
                    context: 'mockContext',
                    eventBus: eventBusStub
                });

                sandbox.spy(targetgroup, 'parseAction');
                sandbox.spy(targetgroup, 'createTopSection');
                sandbox.spy(TargetgroupForm.prototype, 'init');
                sandbox.spy(TopSection.prototype, 'init');
                sandbox.spy(TopSection.prototype, 'setContent');
                sandbox.spy(TopSection.prototype, 'attachTo');

                targetgroup.onStart();
            });

            describe('valid create action', function() {
                beforeEach(function() {
                    targetgroup.onLocationChange('create');
                });

                it('should parse action', function() {
                    expect(targetgroup.parseAction.calledOnce).to.equal(true);
                });

                it('should create empty model', function() {
                    expect(targetgroup.targetgroupModel.getId()).to.be.undefined;
                });

                it('should create targetGroupFrom', function() {
                    expect(TargetgroupForm.prototype.init.callCount).to.equal(1);
                    expect(TargetgroupForm.prototype.init.getCall(0).args[0].action).to.equal('create');
                    expect(TargetgroupForm.prototype.init.getCall(0).args[0].targetGroup).to.equal(null);
                });

                it('should create TopSection', function() {
                    expect(targetgroup.createTopSection.callCount).to.equal(1);
                });

                it('should provide TopSection with content', function() {
                    expect(TopSection.prototype.setContent.callCount).to.equal(1);
                });

                it('should attach TopSection to main app', function() {
                    expect(TopSection.prototype.attachTo.callCount).to.equal(1);
                });
            });

            describe('valid view action', function() {
                var previousformRegionStub;
                beforeEach(function() {
                    targetgroup.formRegion = previousformRegion;
                    sandbox.stub(previousformRegion, 'destroy');

                    targetgroup.onLocationChange('view/mockTargetGroup1');
                });

                it('should create model with id', function() {
                    expect(targetgroup.targetgroupModel.getId()).to.equal('mockTargetGroup1');
                });

                it('should create targetGroupFrom', function() {
                    expect(TargetgroupForm.prototype.init.callCount).to.equal(1);
                    expect(TargetgroupForm.prototype.init.getCall(0).args[0].action).to.equal('view');
                    expect(TargetgroupForm.prototype.init.getCall(0).args[0].targetGroup).to.equal('mockTargetGroup1');
                });

                it('should create model with id', function() {
                    expect(targetgroup.targetgroupModel.getId()).to.equal('mockTargetGroup1');
                });

                it('should stop old region if present', function() {
                    expect(previousformRegion.destroy.callCount).to.equal(1);
                });
            });

            describe('valid edit action', function() {
                beforeEach(function() {
                    targetgroup.onLocationChange('edit/mockTargetGroup2');
                });

                it('should create model with id', function() {
                    expect(targetgroup.targetgroupModel.getId()).to.equal('mockTargetGroup2');
                });

                it('should create targetGroupFrom', function() {
                    expect(TargetgroupForm.prototype.init.calledOnce).to.equal(true);
                    expect(TargetgroupForm.prototype.init.getCall(0).args[0].action).to.equal('edit');
                    expect(TargetgroupForm.prototype.init.getCall(0).args[0].targetGroup).to.equal('mockTargetGroup2');
                });
            });

            describe('should stop processing in case invalid actions', function() {

                it('should stop on invalid action: invalidAction', function() {
                    targetgroup.onLocationChange('invalidAction');
                    expect(targetgroup.targetgroupModel).to.equal(null);
                });

                it('should stop on invalid action: invalidAction/validTarget', function() {
                    targetgroup.onLocationChange('invalidAction/validTarget');
                    expect(targetgroup.targetgroupModel).to.equal(null);
                });

                it('should stop on invalid action: create/validTarget', function() {
                    targetgroup.onLocationChange('create/validTarget');
                    expect(targetgroup.targetgroupModel).to.equal(null);
                });
            });

        });

        describe('parseAction()', function() {

            beforeEach(function() {
                targetgroup.onStart();
            });

            it("should parse action: create", function() {
                var parsedUrl = Utils.parseHash('create');
                targetgroup.parseAction(parsedUrl);
                expect(targetgroup.action).to.equal('create');
                expect(targetgroup.targetGroup).to.equal(null);
            });

            it("should parse empty action as create", function() {
                var parsedUrl = Utils.parseHash('');
                targetgroup.parseAction(parsedUrl);
                expect(targetgroup.action).to.equal('create');
                expect(targetgroup.targetGroup).to.equal(null);
            });

            it("should parse action: create/", function() {
                var parsedUrl = Utils.parseHash('create');
                targetgroup.parseAction(parsedUrl);
                expect(targetgroup.action).to.equal('create');
                expect(targetgroup.targetGroup).to.equal(null);
            });

            it("should parse action: view/mockTargetGroup", function() {
                var parsedUrl = Utils.parseHash('view/mockTargetGroup');
                targetgroup.parseAction(parsedUrl);
                expect(targetgroup.action).to.equal('view');
                expect(targetgroup.targetGroup).to.equal('mockTargetGroup');
            });

            it("should parse action: edit/mockTargetGroup/", function() {
                var parsedUrl = Utils.parseHash('edit/mockTargetGroup/');
                targetgroup.parseAction(parsedUrl);
                expect(targetgroup.action).to.equal('edit');
                expect(targetgroup.targetGroup).to.equal('mockTargetGroup');
            });

            it("should parse action: invalidAction/mockTargetGroup/", function() {
                var parsedUrl = Utils.parseHash('invalidAction/mockTargetGroup/');
                targetgroup.parseAction(parsedUrl);
                expect(targetgroup.action).to.equal('invalidAction');
                expect(targetgroup.targetGroup).to.equal('mockTargetGroup');
            });

            it("should parse action: view/mockTargetGroup/mockNotImportant", function() {
                var parsedUrl = Utils.parseHash('view/mockTargetGroup/mockNotImportant');
                targetgroup.parseAction(parsedUrl);
                expect(targetgroup.action).to.equal('view');
                expect(targetgroup.targetGroup).to.equal('mockTargetGroup');
            });

            it("should validate create action when targetGroup is null", function() {
                var parsedUrl = Utils.parseHash('create');
                targetgroup.targetGroup = null;
                expect(targetgroup.parseAction(parsedUrl)).to.equal(true);
            });

            it("should validate create action when targetGroup is empy", function() {
               var parsedUrl = Utils.parseHash('create');
               targetgroup.targetGroup = '';
               expect(targetgroup.parseAction(parsedUrl)).to.equal(true);
            });

            it("should refuse create action when targetGroup is not empy", function() {
                var parsedUrl = Utils.parseHash('create');
                targetgroup.targetGroup = 'mockNonEmpty';
                expect(targetgroup.parseAction(parsedUrl)).to.equal(false);
            });

            it("should validate view action and its target group", function() {
                var parsedUrl = Utils.parseHash('view/mockTargetGroup');
                expect(targetgroup.parseAction(parsedUrl)).to.equal(true);
            });

            it("should refuse view action when target group is empty or null", function() {
                var parsedUrl = Utils.parseHash('view/');
                expect(targetgroup.parseAction(parsedUrl)).to.equal(false);
                parsedUrl = Utils.parseHash('view');
                expect(targetgroup.parseAction(parsedUrl)).to.equal(false);
            });

            it("should validate edit action and its target group", function() {
                var parsedUrl = Utils.parseHash('edit/mockTargetGroup');
                expect(targetgroup.parseAction(parsedUrl)).to.equal(true);
            });

            it("should refuse edit action when target group is empty or null", function() {
                var parsedUrl = Utils.parseHash('edit/');
                expect(targetgroup.parseAction(parsedUrl)).to.equal(false);
                parsedUrl = Utils.parseHash('edit');
                expect(targetgroup.parseAction(parsedUrl)).to.equal(false);
            });
        });

        describe('onResume()', function() {
            beforeEach(function() {
                sandbox.spy(AccessControlService, 'isAppAvailable');
                targetgroup.onResume();
            });

            it('should check acces to application', function() {
                expect(AccessControlService.isAppAvailable.calledOnce).to.equal(true);
            });

            it("should set addingNeTargetsInProgress flag to false", function() {
                targetgroup.onResume();
                expect(targetgroup.addingNeTargetsInProgress).to.equal(false);
            });

            it("should reset formDataSavedSuccessfully flag to true if not in progress of adding Targets", function() {
                targetgroup.addingNeTargetsInProgress = false;
                targetgroup.onResume();
                expect(targetgroup.formDataSavedSuccessfully).to.equal(true);
            });
        });

        describe('createTopSection()', function() {

            beforeEach(function() {
                sandbox.spy(TopSection.prototype, 'init');
                sandbox.spy(TopSection.prototype, 'destroy');
                sandbox.stub(targetgroup, 'getDefaultActionButtons').returns([{type: 'separator'}]);
            });

            it('should destroy old TopSection', function() {
                targetgroup['topSection'] = new TopSection({
                    context: mockContext
                });
                targetgroup.createTopSection("create");
                expect(TopSection.prototype.destroy.callCount).to.be.equal(1);
            });

            it('should provide TopSection with title', function() {
                targetgroup.createTopSection("create");
                expect(TopSection.prototype.init.getCall(0).args[0].title).to.equal(Dictionary.headers["create"]);
            });

            it('Should provide TopSection with breadcrumb', function() {
                targetgroup.createTopSection("view");
                expect(TopSection.prototype.init.getCall(0).args[0].breadcrumb).to.deep.equal(mockBreadCrumb);
                expect(TopSection.prototype.init.getCall(0).args[0].breadcrumb[0].name).to.equal('mockBreadCrumbLevel');
                expect(TopSection.prototype.init.getCall(0).args[0].breadcrumb[0].url).to.equal('#mockBreadCrumbUrl');
            });

            it('should provide TopSection with context', function() {
                targetgroup.createTopSection("create");
                expect(TopSection.prototype.init.getCall(0).args[0].context).to.deep.equal(mockContext);
            });

            it('Should provide TopSection with defaultActions', function() {
                targetgroup.createTopSection("create");
                expect(TopSection.prototype.init.getCall(0).args[0].defaultActions).to.deep.equal([{type: 'separator'}]);
            });
        });

        describe('cancelAction()', function() {
            it('should change location to targetgroup.goto', function() {
                targetgroup.goto = "example_hash";
                targetgroup.cancelAction();

                expect(window.location.hash).to.equal("#example_hash");
            });
        });

        describe('editAction()', function() {
            it('should set locationController namespace to "edit/anyName" ', function() {
                sandbox.spy(LocationController.prototype, 'setNamespaceLocation');
                targetgroup.targetGroup = "anyName";
                targetgroup.editAction();

                expect(LocationController.prototype.setNamespaceLocation.calledOnce).to.equal(true);
                expect(LocationController.prototype.setNamespaceLocation.getCall(0).args[0]).to.equal('edit/anyName');
            });
        });

        describe('onBeforeLeave()', function() {

            beforeEach(function() {
                targetgroup.onStart();
                targetgroup.targetgroupModel = new TargetgroupModel();
                targetgroup.targetgroupModelBeforeModification = new TargetgroupModel();
            });

            it('leave page normally when we quit from view mode', function() {
                targetgroup.action = 'view';
                var event = {target: 'targetmanagement'};
                expect(targetgroup.onBeforeLeave(event)).to.equal(undefined);
            });

            it('should trigger confirmation dialogue if previous save was unsuccesfull', function() {
                targetgroup.action = 'create';
                targetgroup.formDataSavedSuccessfully = false;
                var event = {target: 'targetmanagement'};
                expect(targetgroup.onBeforeLeave(event)).to.equal(Dictionary.confirmNav);
            });

            it('should not trigger confirmation dialogue during adding targets', function() {
                targetgroup.action = 'create';
                targetgroup.formDataSavedSuccessfully = false; //Show dialogue condition
                targetgroup.addingNeTargetsInProgress = true;  //Dont show any way, NE actions
                var event = {target: 'targetmanagement'};
                expect(targetgroup.onBeforeLeave(event)).to.equal(undefined);
            });

            it('should trigger confirmation dialogue if name changed', function() {
                targetgroup.action = 'create';
                targetgroup.targetgroupModelBeforeModification.setName("mockBeforeChange");
                targetgroup.targetgroupModel.setName("mockAfterChange");
                var event = {target: 'targetmanagement'};
                expect(targetgroup.onBeforeLeave(event)).to.equal(Dictionary.confirmNav);
            });

            it('should trigger confirmation dialogue if description changed', function() {
                targetgroup.action = 'create';
                targetgroup.targetgroupModelBeforeModification.setDescription("mockBeforeChange");
                targetgroup.targetgroupModel.setDescription("mockAfterChange");
                var event = {target: 'targetmanagement'};
                expect(targetgroup.onBeforeLeave(event)).to.equal(Dictionary.confirmNav);
            });

            it('should trigger confirmation dialogue if target removed', function() {
                targetgroup.action = 'edit';
                targetgroup.rowsToDelete.push("mockBeforeChange");
                var event = {target: 'targetmanagement'};
                expect(targetgroup.onBeforeLeave(event)).to.equal(Dictionary.confirmNav);
            });

            it('should trigger confirmation dialogue if target added', function() {
                targetgroup.action = 'edit';
                targetgroup.targetsToAdd.push("mockBeforeChange");
                var event = {target: 'targetmanagement'};
                expect(targetgroup.onBeforeLeave(event)).to.equal(Dictionary.confirmNav);
            });

            it('should not trigger confirmation dialogue during adding targets', function() {
                targetgroup.action = 'edit';
                targetgroup.formDataSavedSuccessfully = false; //Show dialogue condition
                targetgroup.addingNeTargetsInProgress = true;  //Dont show any way, NE actions
                var event = {target: 'networkexplorer'};
                expect(targetgroup.onBeforeLeave(event)).to.equal(undefined);
            });
        });

        describe('getDefaultActionButtons(action, tgName)', function() {
            var returnValue;
            it('should return ActionManager.getDefaultActionsForCreate() when action = create and tgName = anyName', function() {
                returnValue = targetgroup.getDefaultActionButtons('create', 'anyName');
                expect(Underscore.isEqual(returnValue, ActionManager.getDefaultActionsForCreate())).to.equal(true);
            });

               //TODO: Underscore will not work here, spy on ActionManager and check invocation instead
//            it('should return ActionManager.getDefaultActionsForView(true) when action = view and tgName = ALL or tgName = NONE', function() {
//                returnValue = targetgroup.getDefaultActionButtons('view', 'ALL');
//                expect(Underscore.isEqual(returnValue, ActionManager.getDefaultActionsForView(true))).to.equal(true);
//                returnValue = targetgroup.getDefaultActionButtons('view', 'NONE');
//                expect(Underscore.isEqual(returnValue, ActionManager.getDefaultActionsForView(true))).to.equal(true);
//            });
//
//            it('should return ActionManager.getDefaultActionsForView(false); when action = view and tgName = anyName', function() {
//                returnValue = targetgroup.getDefaultActionButtons('view', 'anyName');
//                expect(Underscore.isEqual(returnValue, ActionManager.getDefaultActionsForView(false))).to.equal(true);
//            });

            it('should return ActionManager.getDefaultActionsForEdit(); when action = edit and tgName = anyName', function() {
                returnValue = targetgroup.getDefaultActionButtons('edit', 'anyName');
                expect(Underscore.isEqual(returnValue, ActionManager.getDefaultActionsForEdit())).to.equal(true);
            });
        });

        describe('contextActionsForEdit()', function() {
            it('should trigger topsection:contextactions when checkedRows = ["anyRole"]', function() {
                targetgroup.contextActionsForEdit(["anyRole"]);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('topsection:contextactions');
            });
            it('should trigger topsection:contextactions when checkedRows = [1,2,3,4, "manyRoles"]', function() {
                targetgroup.contextActionsForEdit([1,2,3,4, "manyRoles"]);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('topsection:contextactions');
            });
            it('should trigger topsection:leavecontext when checkedRows = []', function() {
                targetgroup.contextActionsForEdit([]);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('topsection:leavecontext');
            });
        });

        describe('contextMenuActionsForEdit()', function() {
             // TODO: stub formRegion.targetsTableWidget.getSelectedRows() to return appropriate rows
//            it('should trigger contextmenu:show when checkedRows = ["anyRole"]', function() {
//                targetgroup.ActionsManager.a(["anyRole"]);
//                expect(eventBusStub.publish.callCount).to.equal(1);
//                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('contextmenu:show');
//            });
//            it('should trigger contextmenu:show when checkedRows = [1,2,3,4, "manyRoles"]', function() {
//                targetgroup.contextMenuActionsForEdit([1,2,3,4, "manyRoles"]);
//                expect(eventBusStub.publish.callCount).to.equal(1);
//                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('contextmenu:show');
//            });
//            it('should trigger no actions when checkedRows = []', function() {
//                targetgroup.contextMenuActionsForEdit([]);
//                expect(eventBusStub.publish.callCount).to.equal(0);
//            });
        });
    });
});
