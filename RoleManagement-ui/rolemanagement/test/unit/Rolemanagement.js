/*global define, describe, it, expect */
define([
    'jscore/core',
    'identitymgmtlib/ParamsLocationController',
    'rolemanagement/Rolemanagement',
    'rolemanagement/ActionsManager',
    'rolemanagement/regions/RoleMgmtRegion',
    'layouts/TopSection',
    'identitymgmtlib/AccessControlService',
    'identitymgmtlib/Utils',
], function(core, ParamsLocationController, Rolemanagement, ActionsManager, RoleMgmtRegion, TopSection, accessControlService, utils) {
    'use strict';

    describe('Rolemanagement', function() {

        it('Role management should be defined', function() {
            expect(Rolemanagement).not.to.be.undefined;
        });

        var sandbox, rolemgmt, eventBusStub, mockContext, roleMgmtRegionStub, locationControllerStub;
        var mockAppResponse, server;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            var server = sandbox.useFakeServer();

            mockAppResponse = [{
                "id": "role_management",
                "name": "Role Management",
                "shortInfo": "Role Management is a web based application that allows the Security Administrator to manage all ENM System roles, COM roles, COM role aliases, Task Profile roles and Custom roles.",
                "acronym": "RM",
                "favorite": "false",
                "resources": null,
                "hidden": false,
                "roles": "",
                "targetUri": "https://enmapache.athtem.eei.ericsson.se/#rolemanagement",
                "uri": "/rest/apps/web/role_management"
            }];

            server.respondWith("POST", '/rest/apps', [200, {
                    "Content-Type": "application/json",
                },
                JSON.stringify(mockAppResponse)
            ]);

            rolemgmt = new Rolemanagement({
                namespace: 'mockNameSpace',
                properties: {
                    title: "mockTitle"
                },
                roleMgmtRegion: {
                    options: {
                        locationController: {
                            getParameter: sandbox.stub(),
                            start: sandbox.stub(),
                            stop: sandbox.stub()
                        }
                    }
                }
            });
            rolemgmt.options.breadcrumb = [{}, {children: []}];
            locationControllerStub = new ParamsLocationController({
                namespace: 'mockNameSpace'
            });

            eventBusStub = new core.EventBus();
            sandbox.spy(eventBusStub, 'subscribe');
            sandbox.spy(eventBusStub, 'publish');

            mockContext = new core.AppContext();
            mockContext.eventBus = eventBusStub;

            sandbox.stub(rolemgmt, 'getContext').returns(mockContext);
            sandbox.stub(rolemgmt, 'getEventBus').returns(eventBusStub);

            rolemgmt.locationController = locationControllerStub;

        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onStart()', function() {

            it('Should initialize main page correctly', function() {
                sandbox.stub(accessControlService, 'isAppAvailable');
                sandbox.spy(rolemgmt, 'onStart');
                expect(rolemgmt.onStart.callCount).to.equal(0);

                rolemgmt.onStart();

                expect(rolemgmt.onStart.callCount).to.equal(1);
                expect(accessControlService.isAppAvailable.callCount).to.equal(1);

            });
        });

        describe('onResume()', function() {
            beforeEach(function() {
                roleMgmtRegionStub = new RoleMgmtRegion({
                    locationController: locationControllerStub,
                    context: mockContext
                });
                rolemgmt.roleMgmtRegion = roleMgmtRegionStub;

                sandbox.spy(locationControllerStub, 'start');
                sandbox.stub(accessControlService, 'isAppAvailable');
            });

            it('should call start location controller', function() {
                rolemgmt.onResume();
                expect(locationControllerStub.start.calledOnce).to.equal(true);
            });

            it('should check app availabiity', function() {
                rolemgmt.onResume();
                expect(accessControlService.isAppAvailable.calledOnce).to.equal(true);
            })
        });

        describe('onPause()', function() {
            beforeEach(function() {
                roleMgmtRegionStub = new RoleMgmtRegion({
                    locationController: locationControllerStub,
                    context: mockContext
                });
                rolemgmt.roleMgmtRegion = roleMgmtRegionStub;
            });

            it('should stop location controller', function() {
                sandbox.stub(locationControllerStub, 'stop');
                rolemgmt.onPause();

                expect(locationControllerStub.stop.calledOnce).to.equal(true);
            });
        });

        describe('configureLocationController', function() {

            it('should create locationController', function() {
                rolemgmt.onStart();
                expect(rolemgmt.locationController).not.to.be.undefined;
            });

            it('should initialize locationController with proper parameters', function() {
                sandbox.spy(ParamsLocationController.prototype, 'init');
                rolemgmt.options.namespace = "testNamespace";
                rolemgmt.onStart();
                expect(rolemgmt.locationController.init.calledOnce).to.equal(true);
                expect(rolemgmt.locationController.init.calledWith("testNamespace"));
            });
        });

        describe('addEventHandlers()', function() {

            beforeEach(function() {
                sandbox.spy(rolemgmt, 'addEventHandlers');
                sandbox.stub(rolemgmt, 'createAction');
                sandbox.stub(rolemgmt, 'onResume');
                sandbox.stub(rolemgmt, 'addFilteredClearEventHandler');
            });

            it('should add event handlers', function() {
                rolemgmt.addEventHandlers();
                expect(rolemgmt.addEventHandlers.calledOnce).to.equal(true);
            });

            it('should subscribe to actions:create event', function() {
                rolemgmt.addEventHandlers();
                var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'actions:create');
                expect(callbackRef).to.be.function;
            });

            it('should execute proper handler for actions:create event', function() {
                rolemgmt.addEventHandlers();
                var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'actions:create');
                callbackRef.call(rolemgmt);
                expect(rolemgmt.createAction.callCount).to.equal(1);
            });

            it('should subscribe to refresh event', function() {
                rolemgmt.addEventHandlers();
                var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'refresh');
                expect(callbackRef).to.be.function;
            });

            it('should execute proper handler for refresh event', function() {
                rolemgmt.addEventHandlers();
                var callbackRef = getCallbackForEvent(eventBusStub.subscribe, 'refresh');
                callbackRef.call(rolemgmt);
                expect(rolemgmt.onResume.callCount).to.equal(1);
            });
        });

        describe('createAction()', function() {

            beforeEach(function() {
                sandbox.spy(rolemgmt.locationController, 'setNamespaceLocation');
            });

            it('should redirect to create role page', function() {
                rolemgmt.createAction();
                expect(rolemgmt.locationController.setNamespaceLocation.callCount).to.equal(1);
                expect(window.location.hash).to.equal("#mockNameSpace/userrole/create");
            });
        });

    });

    /*  INFO: function must be in following format"
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
