define([
    'jscore/core',
    'userrole/UserRole',
    'rolemgmtlib/model/RoleModel',
    'identitymgmtlib/Utils',
    'layouts/TopSection',
    'jscore/ext/locationController',
    "i18n!userrole/dictionary.json",
    'identitymgmtlib/AccessControlService'
], function (core, UserRole, RoleModel, Utils, TopSection, LocationController, Dictionary, AccessControlService) {
    'use strict';

    describe('UserRole', function () {
        var sandbox, userRole, getContextStub, getEventBusStub, mockContext, mockAppResponse, lcSetLocationSpy, eventBusStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            var server = sandbox.useFakeServer();


            mockAppResponse = [{
              "id":"role_management",
              "name":"Role Management",
              "shortInfo":"Role Management is a web based application that allows the Security Administrator to manage all ENM System roles, COM roles, COM role aliases, Task Profile roles and Custom roles.",
              "acronym":"RM",
              "favorite":"false",
              "resources":null,
              "hidden":false,
              "roles":"",
              "targetUri":"https://enmapache.athtem.eei.ericsson.se/#rolemanagement",
              "uri":"/rest/apps/web/role_management" }
            ];
            server.respondWith("POST", '/rest/apps', [200, { "Content-Type": "application/json", }, JSON.stringify(mockAppResponse)]);
            userRole = new UserRole();
            userRole.options.breadcrumb = [{}, {children: []}];
            lcSetLocationSpy = sandbox.spy(LocationController.prototype, 'setLocation');
            userRole.lc = new LocationController();

            eventBusStub = {
                publish: function () {},
                subscribe: function() {}
            };
            mockContext = { eventBus: eventBusStub };
            getContextStub = sandbox.stub(userRole, 'getContext').returns(mockContext);
            getEventBusStub = sandbox.stub(userRole, 'getEventBus').returns(eventBusStub);
        });

        afterEach(function() {
            userRole.delete;
            sandbox.restore();
        });

        var mockRole = {};

        it('UserRole should be defined', function () {
            expect(UserRole).not.to.be.undefined;
        });

        describe('onBeforeLeave()', function (){
            beforeEach(function() {
                userRole.saved = false;
                userRole.roleModel = new RoleModel({
                    name: "tmpName",
                    description: "tmpDescription",
                    state: "ENABLED",
                    type: "justTmpType"
                });
                userRole.roleModelBeforeModification = new RoleModel(userRole.roleModel.getAttributes());

            });
            it('should return \'undefined\' when confirmation dialog should not appear', function () {
                expect(userRole.onBeforeLeave()).to.be.undefined;
            });

            it('should return \'undefined\' when model is changed and also saved', function () {
                userRole.saved = true;
                userRole.roleModelBeforeModification.setName("SOMERANDOMNAME523465");
                expect(userRole.onBeforeLeave()).to.be.undefined;
            });

            it('should return confirmat dialog box text when model is changed and not saved', function () {
                userRole.roleModelBeforeModification.setName("SOMERANDOMNAME523465");
                expect(userRole.onBeforeLeave()).to.equal(Dictionary.confirmNav);
            });
        });

        describe('addRoles()', function() {
            it('should add roles to model', function() {
                var mockModel = { addRoles: function(data) {}};
                userRole.roleModel = mockModel;
                var roleModelSpy = sandbox.spy(mockModel, 'addRoles');
                var mockData = ['role1', 'role2'];
                userRole.addRoles(mockData);
                expect(roleModelSpy.calledOnce).to.equal(true);
                expect(roleModelSpy.calledWith(mockData)).to.equal(true);
            });
        });

        describe('onResume()', function() {
            it('should set saved to false', function() {
                userRole.saved = true;
                userRole.onResume();
                expect(userRole.saved).to.equal(false);
            });
        });

        describe('triggerGoto()', function(){
            it('should set location to goto using location controller', function(){
                userRole.goto = 'example_hash';
                userRole.triggerGoto();
                expect(lcSetLocationSpy.calledWith(userRole.goto));
            });
        });

        describe('getDefaultActions()', function(){
          it('should return array containing default actions', function(){
            var defaultActions = userRole.getDefaultActions();
            expect(defaultActions.length).to.equal(2);
            expect(defaultActions[0].name).to.equal(Dictionary.save);
            expect(defaultActions[1].name).to.equal(Dictionary.cancel);
            expect(defaultActions[0].type).to.equal('button');
            expect(defaultActions[1].type).to.equal('button');
            expect(defaultActions[0].color).to.equal('darkBlue');
            expect(defaultActions[0]).to.have.property('action');
            expect(defaultActions[1]).to.have.property('action');
          });
        });

        describe('onLocationChange()', function() {
          var parseHashStub, attachToSpy, setContentSpy, mockParseHash, hashPassed;
          var createTopSectionSpy, topSectionMock, modelMock;
          beforeEach(function(){
            parseHashStub = sandbox.stub(Utils, 'parseHash');
            createTopSectionSpy = sandbox.stub(userRole, 'createTopSection');
            topSectionMock = { attachTo: function(){}, setContent: function(){}, destroy: function(){} };
            userRole.topSection = topSectionMock;
            attachToSpy = sandbox.spy(topSectionMock, 'attachTo');
            setContentSpy = sandbox.spy(topSectionMock, 'setContent');
            modelMock = sandbox.stub(RoleModel.prototype, 'fetch');
          });

          it('parsedUrl has empty hash and goto is not set', function() {
            hashPassed = "";
            mockParseHash = {
                hash: "",
                query: { goto: "" }
            };
            parseHashStub.returns(mockParseHash);
            userRole.onLocationChange(hashPassed);

            expect(parseHashStub.calledOnce).to.equal(true);
            expect(userRole.goto).to.equal("rolemanagement");
            expect(userRole.action).to.equal("create");
            expect(userRole.roleModel).not.to.be.undefined;
            expect(userRole.roleModel.id).to.be.undefined;
            expect(userRole.form).not.to.be.undefined;
            expect(userRole.form.options.action).to.equal("create");
            expect(userRole.form.options.hash).to.equal("");
            expect(userRole.form.options.model).to.equal(userRole.roleModel);
            expect(userRole.form.options.context).to.equal(userRole.getContext());
            expect(createTopSectionSpy.calledOnce).to.equal(true);
            expect(createTopSectionSpy.calledWith(userRole.action));
            expect(attachToSpy.calledOnce).to.equal(true);
            expect(setContentSpy.calledOnce).to.equal(true);
          });

          it('should create roleForm when hash is edit', function() {
            hashPassed = "edit/operator";
            mockParseHash = {
              hash: hashPassed,
              query: {goto: ""}
            };
            parseHashStub.returns(mockParseHash);
            userRole.onLocationChange(hashPassed);

            expect(parseHashStub.calledOnce).to.equal(true);
            expect(userRole.goto).to.equal("rolemanagement");
            expect(userRole.action).to.equal("edit");
            expect(userRole.roleModel).not.to.be.undefined;
            expect(userRole.roleModel.id).to.equal("operator");
            expect(userRole.form).not.to.be.undefined;
            expect(userRole.form.options.action).to.equal("edit");
            expect(userRole.form.options.hash).to.equal("edit");
            expect(userRole.form.options.model).to.equal(userRole.roleModel);
            expect(userRole.form.options.context).to.equal(userRole.getContext());
            expect(createTopSectionSpy.calledOnce).to.equal(true);
            expect(createTopSectionSpy.calledWith(userRole.action));
            expect(attachToSpy.calledOnce).to.equal(true);
            expect(setContentSpy.calledOnce).to.equal(true);
          });

          it('parsedUrl has "create" in hash and goto is not set', function(){
            hashPassed = "create";
            mockParseHash = {
              hash: hashPassed,
              query: {goto: ""}
            };
            parseHashStub.returns(mockParseHash);
            userRole.onLocationChange(hashPassed);

            expect(parseHashStub.calledOnce).to.equal(true);
            expect(userRole.goto).to.equal("rolemanagement");
            expect(userRole.action).to.equal("create");
            expect(userRole.roleModel).not.to.be.undefined;
            expect(userRole.roleModel.id).to.be.undefined;
            expect(userRole.form).not.to.be.undefined;
            expect(userRole.form.options.action).to.equal("create");
            expect(userRole.form.options.hash).to.equal("create");
            expect(userRole.form.options.model).to.equal(userRole.roleModel);
            expect(userRole.form.options.context).to.equal(userRole.getContext());
            expect(createTopSectionSpy.calledOnce).to.equal(true);
            expect(createTopSectionSpy.calledWith(userRole.action));
            expect(attachToSpy.calledOnce).to.equal(true);
            expect(setContentSpy.calledOnce).to.equal(true);
          });
          it('parsedUrl has "operator" in hash and goto is not set', function(){
            hashPassed = "operator";
            mockParseHash = {
              hash: hashPassed,
              query: {goto: ""}
            };
            parseHashStub.returns(mockParseHash);
            userRole.onLocationChange(hashPassed);

            expect(parseHashStub.calledOnce).to.equal(true);
            expect(userRole.goto).to.equal("rolemanagement");
            expect(userRole.action).to.equal("display");
            expect(userRole.roleName).to.equal("operator");
            expect(userRole.roleModel).not.to.be.undefined;
            expect(userRole.roleModel.id).to.equal("operator");
            expect(userRole.form).not.to.be.undefined;
            expect(userRole.form.options.action).to.equal("display");
            expect(userRole.form.options.hash).to.equal("operator");
            expect(userRole.form.options.context).to.equal(userRole.getContext());
            expect(createTopSectionSpy.calledOnce).to.equal(true);
            expect(createTopSectionSpy.calledWith(userRole.action));
            expect(attachToSpy.calledOnce).to.equal(true);
            expect(setContentSpy.calledOnce).to.equal(true);
          });
        });


        describe('createTopSection()', function() {
            var topSectionBefore, setContentSpy, getDefaultActionsSpy, destroySpy;
            beforeEach(function() {
                topSectionBefore = new TopSection({context: mockContext});
                setContentSpy = sandbox.spy(TopSection.prototype, 'setContent');
                destroySpy = sandbox.stub(TopSection.prototype, 'destroy');
                getDefaultActionsSpy = sandbox.spy(userRole, 'getDefaultActions');
            });

            it('topSection already exists', function() {
                userRole.topSection = topSectionBefore;
                userRole.createTopSection("create");
                expect(destroySpy.calledOnce).to.be.equal(true);
                expect(userRole.topSection).not.to.equal(topSectionBefore);
                expect(userRole.topSection.options.title).to.equal(Dictionary.headers["create"]);
            });

            it('topSection does not exist', function() {
                userRole.createTopSection("edit");
                expect(destroySpy.calledOnce).to.be.equal(false);
                expect(userRole.topSection).not.to.equal(topSectionBefore);
                expect(userRole.topSection.options.title).to.equal(Dictionary.headers["edit"]);
            });
        });

        describe('saveAction()', function() {
            var errorInfoSpy, validateStub, server, roleModel, publishSpy, saveSpy, roleModelStub, formShowErrorsStub;
            beforeEach(function() {
                publishSpy = sandbox.spy(eventBusStub, 'publish');
                roleModel = new RoleModel();
                userRole.roleModel = roleModel;
                saveSpy = sandbox.spy(roleModel, 'save');
                validateStub = sandbox.stub(roleModel, 'validate');
                userRole.saved = false;
                userRole.goto = "mockLocation";
                server = sinon.fakeServer.create();
                formShowErrorsStub = {
                    showErrors: function(){}
                };
                sandbox.spy(formShowErrorsStub,'showErrors');
                userRole.form = formShowErrorsStub;
            });

            afterEach(function() {
                validateStub.reset();
                validateStub.restore();
                server.restore();
            });

            it('save when model is not valid', function() {
                validateStub.returns({valid: false});
                userRole.saveAction();

                expect(publishSpy.calledOnce).to.equal(true);
                expect(publishSpy.calledWith("model:update")).to.equal(true);
                expect(validateStub.calledOnce).to.equal(true);
                expect(saveSpy.calledOnce).to.equal(false);
                expect(userRole.notification).to.be.undefined;
                expect(userRole.saved).to.equal(false);
                validateStub.restore();
            });

            it('save when model is valid', function() {
                server.respondWith("POST", '/oss/idm/rolemanagement/roles', [201, { "Content-Type": "application/json", "Content-Length": 2  }, '{"id":11,"name":"po","description":"popo","type":"com","status":"DISABLED"}']);
                validateStub.returns({valid: true});
                userRole.saveAction();
                server.respond();

                expect(publishSpy.calledOnce).to.equal(true);
                expect(publishSpy.calledWith("model:update")).to.equal(true);
                expect(validateStub.calledOnce).to.equal(true);
                expect(saveSpy.calledOnce).to.equal(true);
                expect(userRole.notification).not.to.be.undefined;
                expect(userRole.saved).to.equal(true);

            });
            it('handle correctly statusCode 422 returned from server', function(){
              server.respondWith("POST", '/oss/idm/rolemanagement/roles', [422, { "Content-Type": "application/json", "Content-Length": 2  }, '{"userMessage": "This name already exists", "httpStatusCode": 422}']);
              validateStub.returns({valid: true});
              userRole.saveAction();
              server.respond();

              expect(publishSpy.calledOnce).to.equal(true);
              expect(publishSpy.calledWith("model:update")).to.equal(true);
              expect(validateStub.calledOnce).to.equal(true);
              expect(saveSpy.calledOnce).to.equal(true);
              expect(userRole.saved).to.equal(false);
            });

        });

        describe('onStart()', function() {
            var addLocationListenerSpy, bindOnLocationChangeSpy, subscribeSpy, lcStartSpy, addRoles, onLocationChange;
            beforeEach(function() {
                addLocationListenerSpy = sandbox.spy(LocationController.prototype, 'addLocationListener');
                lcStartSpy = sandbox.spy(LocationController.prototype, 'start');
                subscribeSpy = sandbox.spy(eventBusStub, 'subscribe');
                onLocationChange = { bind: function() {} };
                addRoles = { bind: function() {} };
                userRole.onLocationChange = onLocationChange;
                userRole.addRoles = addRoles;
                bindOnLocationChangeSpy = sandbox.spy(onLocationChange, 'bind');

                userRole.options.namespace = "mockNamespace";

                userRole.onStart();
            });

            it('should create location controller', function() {
                expect(userRole.lc).not.to.be.undefined;
                expect(addLocationListenerSpy.calledOnce).to.equal(true);
                expect(lcStartSpy.calledOnce).to.equal(true);
                expect(subscribeSpy.calledTwice).to.equal(true);
                expect(subscribeSpy.firstCall.args[0]).to.equal("comAliasRoleList:addComRoles");
                expect(subscribeSpy.secondCall.args[0]).to.equal("displayRole:hideEditButton");
                expect(userRole.saved).to.equal(false);
            });
        });

        describe('hideEditButtonOnDisplayPage()', function() {
            var publishSpy;
            beforeEach(function() {
                publishSpy = sandbox.spy(eventBusStub, 'publish');
                userRole.hideEditButtonOnDisplayPage();
            });

            it('should send event to topsection', function() {
                expect(publishSpy.calledOnce).to.equal(true);
                expect(publishSpy.firstCall.args[0]).to.equal("topsection:contextactions");
            });
        });
    });
});
