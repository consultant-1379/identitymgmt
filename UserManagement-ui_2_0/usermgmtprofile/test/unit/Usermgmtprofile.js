/*global define, describe, it, expect */
define([
    'usermgmtprofile/Usermgmtprofile',
    'jscore/core',
    'usermgmtprofile/Dictionary',
    'jscore/ext/locationController',
    'identitymgmtlib/mvp/binding',
    'usermgmtprofile/widgets/RoleAssignTableWidget/RoleAssignTableWidget',
    'usermgmtprofile/regions/mainregion/MainRegion',
    'usermgmtlib/model/UserProfileModel',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/widgets/ConfirmationDeleteUsersDialog/ConfirmationDeleteUsersDialog',
    'identitymgmtlib/AccessControlService',
    'usermgmtlib/widgets/PasswordPolicyWidget/PasswordPolicyWidget',
    'usermgmtlib/widgets/CustomPasswordAgeingWidget/CustomPasswordAgeingWidget',
    'layouts/TopSection',
    'identitymgmtlib/Utils'
], function(Usermgmtprofile, core, Dictionary, LocationController, binding, RoleAssignTableWidget, MainRegion, UserProfileModel, UserManagementService, ConfirmationDeleteUsersDialog, AccessControlService, PasswordPolicyWidget, CustomPasswordAgeingWidget, TopSection, utils) {
    'use strict';

    describe('Usermgmtprofile', function() {
        var sandbox, eventBusStub, username, context, usermgmtprofile, locationController, locationControllerStub, viewStub, options, userProfileModel, server;
        beforeEach(function() {
            username = "SomeUser";
            sandbox = sinon.sandbox.create();
            eventBusStub = new core.EventBus();
            context = new core.AppContext();

            eventBusStub = {
                subscribe: function() {},
                publish: function() {}
            };

            viewStub = {
                getElement: function() {}
            };

            var modelStub = {
                "username" : "SomeUser",
                "passwordResetFlag" : true
            };

            options = {
                namespace: "",
                breadcrumb: "",
                properties: {
                    title: ""
                },
                model: {
                    get: function(key) {
                       return modelStub[key];
                    }
                }
            };


            sandbox.spy(viewStub, 'getElement');
            sandbox.stub(utils,'removeChildAppsFromBreadcrumb');
            usermgmtprofile = new Usermgmtprofile(options);
            usermgmtprofile.view = viewStub;
            usermgmtprofile.model = new UserProfileModel();

            context.eventBus = eventBusStub;
            sandbox.stub(usermgmtprofile, 'getContext', function() {
                return context;
            });
            sandbox.spy(eventBusStub, 'subscribe');
            sandbox.spy(eventBusStub, 'publish');
            sandbox.spy(usermgmtprofile, 'getEventBus');
            // sandbox.spy(usermgmtprofile, 'duplicateUser');

            locationControllerStub = {
                addLocationListener: function() {},
                start: function() {},
                stop: function() {}
            };


            sandbox.stub(locationControllerStub, 'addLocationListener');
            sandbox.stub(locationControllerStub, 'start');
            sandbox.stub(locationControllerStub, 'stop');

            usermgmtprofile.locationController = locationControllerStub;

            sandbox.stub(binding, 'bind');


            userProfileModel = new UserProfileModel();
            sandbox.spy(userProfileModel, 'save');
            sandbox.spy(userProfileModel, 'fetch');
            sandbox.spy(userProfileModel, 'set');

            sandbox.stub(MainRegion.prototype, 'onStart');
            sandbox.stub(RoleAssignTableWidget.prototype, 'init');
            sandbox.stub(RoleAssignTableWidget.prototype, 'onViewReady');

            var response = [{
                'id': 'user_management',
                'name': 'User Management',
                'shortInfo': 'User Management is a web based application that allows the Security Administrator to create, delete users and provide them access to ENM tools.',
                'acronym': null,
                'favorite': 'false',
                'resources': null,
                'hidden': false,
                'roles': '',
                'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#usermanagement',
                'uri': '/rest/apps/web/user_management'
            }];

            server = sandbox.useFakeServer();

            //for acces deny
            server.respondWith('GET', '/rest/apps', [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify(response)
            ]);

        });

        afterEach(function() {
            sandbox.restore();
        });

        it('Usermgmtprofile should be defined', function() {
            expect(Usermgmtprofile).not.to.be.undefined;
        });

        describe('performOnStart()', function() {
            beforeEach(function() {
                sandbox.stub(usermgmtprofile, 'onLocationChange');
                sandbox.spy(usermgmtprofile, 'addEventHandlers');
                sandbox.spy(usermgmtprofile, 'onResume');
                sandbox.spy(usermgmtprofile, 'initActions');

                usermgmtprofile.performOnStart();

            });
            it('Should initialize location controller', function() {
                expect(usermgmtprofile.locationController).not.to.be.null;
                expect(usermgmtprofile.locationController).not.to.be.undefined;
            });
            it('Should call addEventHandlers function', function() {
                expect(usermgmtprofile.addEventHandlers.callCount).to.equal(1);
            });

            it('Should call onResume function', function() {
                expect(usermgmtprofile.onResume.calledOnce).to.equal(true);
            });

            it('Should call init actions function', function() {
                expect(usermgmtprofile.initActions.callCount).to.equal(1);
            });
        });

        describe('onStart()', function() {
            beforeEach(function() {
                sandbox.stub(usermgmtprofile, 'onLocationChange');
                sandbox.spy(AccessControlService, 'isAppAvailable');
            });
            it('Should control service to prevent setting access for unauthorized user', function() {
                usermgmtprofile.onStart();
                expect(AccessControlService.isAppAvailable.callCount).to.equal(1);
            });
        });

        describe('addEventHandlers()', function() {
            beforeEach(function() {
                sandbox.stub(usermgmtprofile, 'onLocationChange');
                usermgmtprofile.addEventHandlers();
            });

            it('Should call subscribe on save action for user profile editor', function() {
                expect(usermgmtprofile.getEventBus.callCount).to.equal(6);
                expect(eventBusStub.subscribe.callCount).to.equal(6);
                expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal('usermgmtprofile:save');

                var output = eventBusStub.subscribe.getCall(0).args[1];
                expect(output).to.be.function;
            });

            it('Should call subscribe on change password by administrator', function() {
                expect(usermgmtprofile.getEventBus.callCount).to.equal(6);
                expect(eventBusStub.subscribe.callCount).to.equal(6);
                expect(eventBusStub.subscribe.getCall(1).args[0]).to.equal('action:changePasswordByAdmin');
            });

            it('Should call subscribe on delete action', function() {
                expect(usermgmtprofile.getEventBus.callCount).to.equal(6);
                expect(eventBusStub.subscribe.callCount).to.equal(6);
                expect(eventBusStub.subscribe.getCall(2).args[0]).to.equal('action:deleteUsers');
            });

            it('Should call subscribe on forcePasswordChange action', function() {
                expect(usermgmtprofile.getEventBus.callCount).to.equal(6);
                expect(eventBusStub.subscribe.callCount).to.equal(6);
                expect(eventBusStub.subscribe.getCall(3).args[0]).to.equal('action:forcePasswordChange');
            });

            it('Should call subscribe on terminateSessions action', function() {
                expect(usermgmtprofile.getEventBus.callCount).to.equal(6);
                expect(eventBusStub.subscribe.callCount).to.equal(6);
                expect(eventBusStub.subscribe.getCall(4).args[0]).to.equal('action:terminateSessions');
            });

            it('Should call subscribe on duplicate user action', function() {
                expect(usermgmtprofile.getEventBus.callCount).to.equal(6);
                expect(eventBusStub.subscribe.callCount).to.equal(6);
                expect(eventBusStub.subscribe.getCall(5).args[0]).to.equal('action:duplicateUser');
            });
        });

        describe('forcePasswordShowResult()', function() {
            beforeEach(function() {

                sandbox.stub(usermgmtprofile, 'onLocationChange');
                sandbox.spy(usermgmtprofile, 'forcePasswordShowResult');
                sandbox.stub(usermgmtprofile, 'getUsernameOfEditingUser', function() {
                    return username;
                });

            });


            it('Should call forcePasswordShowResult success', function() {
                var service = sandbox.stub(UserManagementService, 'setForcePasswordChange', function() {
                    return new Promise(function(resolve, reject) {
                        resolve("default_success");
                    })
                });
                usermgmtprofile.forcePasswordShowResult(options.model);
                expect(usermgmtprofile.forcePasswordShowResult.callCount).to.equal(1);
                expect(service.getCall(0).args[0]).to.equal(username);
            });

            it('Should call forcePasswordShowResult error', function() {
                var service = sandbox.stub(UserManagementService, 'setForcePasswordChange', function() {
                    return new Promise(function(resolve, reject) {
                        reject("default_success");
                    })
                });

                usermgmtprofile.forcePasswordShowResult(options.model);
                expect(usermgmtprofile.forcePasswordShowResult.callCount).to.equal(1);
                expect(service.getCall(0).args[0]).to.equal(username);
            });

        });

        describe('terminateSessionsShowResult()', function() {
            beforeEach(function() {
                sandbox.stub(usermgmtprofile, 'onLocationChange');
                sandbox.spy(usermgmtprofile, 'terminateSessionsShowResult');
                sandbox.stub(usermgmtprofile, 'getUsernameOfEditingUser', function() {
                    return username;
                });
            });

            it('Should call terminateSessionsShowResult() success', function() {
                var service = sandbox.stub(UserManagementService, 'setTerminateSessions', function() {
                    return new Promise(function(resolve, reject) {
                        resolve("default_success");
                    })
                });

                usermgmtprofile.terminateSessionsShowResult(username);
                expect(usermgmtprofile.terminateSessionsShowResult.callCount).to.equal(1);
                expect(service.getCall(0).args[0]).to.equal(username);
            });

            it('Should call terminateSessionsShowResult() error', function() {
                var service = sandbox.stub(UserManagementService, 'setTerminateSessions', function() {
                    return new Promise(function(resolve, reject) {
                        reject("default_success");
                    })
                });
                var name;
                usermgmtprofile.terminateSessionsShowResult(username);
                expect(usermgmtprofile.terminateSessionsShowResult.callCount).to.equal(1);
                expect(service.getCall(0).args[0]).to.equal(username);
            });

        });
        describe('performOnResume()', function() {
            beforeEach(function() {
                sandbox.stub(usermgmtprofile, 'onLocationChange');
            });
            it('Should clear ticks when passwordPoliciesCollection is not null', function() {
                sandbox.spy(usermgmtprofile.passwordPoliciesCollection, 'clearTicks');
                usermgmtprofile.performOnStart();
                usermgmtprofile.performOnResume();

                expect(usermgmtprofile.passwordPoliciesCollection.clearTicks.callCount).to.equal(1);

            });

        });
        describe('renderApp()', function() {

            beforeEach(function() {
                sandbox.spy(usermgmtprofile, 'onLocationChange');
                sandbox.stub(PasswordPolicyWidget.prototype, 'init');
                sandbox.stub(PasswordPolicyWidget.prototype, 'onViewReady');
                sandbox.stub(CustomPasswordAgeingWidget.prototype, 'init');
                sandbox.stub(CustomPasswordAgeingWidget.prototype, 'onViewReady');
                sandbox.stub(TopSection.prototype, 'attachTo');
                sandbox.stub(TopSection.prototype, 'setContent');
                sandbox.stub(TopSection.prototype, 'destroy');

                sandbox.stub(usermgmtprofile, 'getContextActions');

                usermgmtprofile.renderApp('edit', usermgmtprofile.model);
            });

            it('Should create TopSection object on layout', function() {
                expect(usermgmtprofile.layout instanceof TopSection).to.equal(true);
            });

            it('Should attach layout to view', function() {
                expect(TopSection.prototype.attachTo.callCount).to.equal(1);
            });

            it('Should set content to layout', function() {
                expect(TopSection.prototype.setContent.callCount).to.equal(1);
            });

            it('Should detach layout if exists', function() {
                usermgmtprofile.onLocationChange();
                expect(TopSection.prototype.destroy.callCount).to.equal(1);
            });
        });

        describe('renderCreate()', function() {
            beforeEach(function() {
                sandbox.stub(usermgmtprofile, 'onLocationChange');
                sandbox.stub(usermgmtprofile, 'renderApp');
                sandbox.stub(usermgmtprofile, 'getContextActions');
                usermgmtprofile.renderCreate(usermgmtprofile.model);
                usermgmtprofile.initActions();
            });

            it('Should call renderApp with create type', function() {
                expect(usermgmtprofile.renderApp.callCount).to.equal(1);
                expect(usermgmtprofile.renderApp.getCall(0).args[0]).to.equal('create');
            });

        });
        describe('renderEdit()', function() {
            beforeEach(function() {
                sandbox.stub(usermgmtprofile, 'onLocationChange');
                sandbox.stub(usermgmtprofile, 'renderApp');
                sandbox.stub(usermgmtprofile, 'getContextActions');
                usermgmtprofile.renderEdit(usermgmtprofile.model);
                usermgmtprofile.initActions();
            });

            it('Should call renderApp with edit type', function() {
                expect(usermgmtprofile.renderApp.callCount).to.equal(1);
                expect(usermgmtprofile.renderApp.getCall(0).args[0]).to.equal('edit');
            });
        });

        describe('getContextActions()', function() {
            var type, output, username;

            beforeEach(function() {
                sandbox.stub(usermgmtprofile, 'onLocationChange');
                username = 'SomeUser';
                usermgmtprofile.initActions();

                sandbox.stub(usermgmtprofile, 'getUsernameOfEditingUser', function() {
                    return username;
                });
                sandbox.stub(usermgmtprofile, 'getModelOfEditingUser', function() {
                    return options.model;
                });

            });

            it('Should create two buttons when user is on create page', function() {
                type = "";
                output = usermgmtprofile.getContextActions(type, options.model, false);

                expect(output.length).to.equal(2);
            });

            it('Should create save and cancel action buttons', function() {
                type = "";
                output = usermgmtprofile.getContextActions(type, options.model, false);

                expect(output.length).to.equal(2);
                expect(output[0].name).to.equal(Dictionary.save);

                var callbackFunction = output[0].action;

                expect(callbackFunction).to.be.function;
                callbackFunction.call();

                expect(usermgmtprofile.getEventBus.callCount).to.equal(1);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('usermgmtprofile:save');
            });



            it('Should do cancel action', function() {

                type = "edit";
                output = usermgmtprofile.getContextActions(type, options.model, false);

                expect(output[1].name).to.equal(Dictionary.cancel);

                var callbackFunction = output[1].action;

                expect(callbackFunction).to.be.function;
            });


            it('Should do changePasswordByAdmin action', function() {
                type = "edit";
                output = usermgmtprofile.getContextActions(type, options.model, false);

                expect(output[3].name).to.equal(Dictionary.editPassword);

                var callbackFunction = output[3].action;

                expect(callbackFunction).to.be.function;
                callbackFunction.call();

                expect(usermgmtprofile.getEventBus.callCount).to.equal(1);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('action:changePasswordByAdmin');
                expect(eventBusStub.publish.getCall(0).args[1]).to.equal(username);
            });

            it('Should do Duplicate User action', function() {

                sandbox.stub(usermgmtprofile, 'duplicateUser', function() {

                });
                type = "edit";
                output = usermgmtprofile.getContextActions(type,options.model, false);

                expect(output[4].name).to.equal(Dictionary.duplicate);

                var callbackFunction = output[4].action;

                expect(callbackFunction).to.be.function;
                callbackFunction.call();

                expect(usermgmtprofile.getEventBus.callCount).to.equal(1);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('action:duplicateUser');
                expect(eventBusStub.publish.getCall(0).args[1]).to.equal(username);
            });


            it('Should do deleteUser action', function() {

                type = "edit";
                output = usermgmtprofile.getContextActions(type, options.model, false);

                expect(output[5].name).to.equal(Dictionary.delete);

                var callbackFunction = output[5].action;

                expect(callbackFunction).to.be.function;
                callbackFunction.call();

                expect(usermgmtprofile.getEventBus.callCount).to.equal(1);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('action:deleteUsers');
                expect(eventBusStub.publish.getCall(0).args[1]).to.equal(username);
            });

            it('Should create Terminate Sessions action buttons', function() {
                type = "edit";
                output = usermgmtprofile.getContextActions(type, options.model, false);

                expect(output[7].name).to.equal(Dictionary.terminateSessions);

                var callbackFunction = output[7].action;

                expect(callbackFunction).to.be.function;
                callbackFunction.call();

                expect(usermgmtprofile.getEventBus.callCount).to.equal(1);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('action:terminateSessions');
                expect(eventBusStub.publish.getCall(0).args[1]).to.equal(username);
            });

            it('Should create Force Change Password action buttons', function() {
                type = "edit";
                output = usermgmtprofile.getContextActions(type, options.model,false);

                expect(output[8].name).to.equal(Dictionary.disablePasswordChange);

                var callbackFunction = output[8].action;

                expect(callbackFunction).to.be.function;
                callbackFunction.call();

                expect(usermgmtprofile.getEventBus.callCount).to.equal(1);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('action:forcePasswordChange');
                expect(eventBusStub.publish.getCall(0).args[1].get("username")).to.equal(username);
                expect(eventBusStub.publish.getCall(0).args[1].get("passwordResetFlag")).to.equal(true);
            });

            it('Should create 9 buttons when user is on edit page', function() {
                type = 'edit';
                output = usermgmtprofile.getContextActions(type, options.model, false);

                expect(output.length).to.equal(9);
            });

            it('Should create save and cancel action buttons', function() {
                expect(output[0].name).to.equal(Dictionary.save);
                expect(output[1].name).to.equal(Dictionary.cancel);
            });
        });

        describe('showConfirmationDeleteUsersDialog()', function() {

            beforeEach(function() {
                var username = "MockName";
                sandbox.stub(usermgmtprofile, 'onLocationChange');
                usermgmtprofile.addEventHandlers();
                sandbox.spy(ConfirmationDeleteUsersDialog.prototype, 'init');
                sandbox.spy(ConfirmationDeleteUsersDialog.prototype, 'showConfirmationDeleteUsersDialog');
                sandbox.spy(ConfirmationDeleteUsersDialog.prototype, 'addEventHandler');
              	usermgmtprofile.showConfirmationDeleteUsersDialog(username);
                
            });

            it('Should show Confirmation Delete Users Dialog', function() {
                expect(ConfirmationDeleteUsersDialog.prototype.init.callCount).to.equal(1);
                expect(ConfirmationDeleteUsersDialog.prototype.showConfirmationDeleteUsersDialog.callCount).to.equal(1);
            });

            it('Should add event handler which show loader', function() {
                expect(ConfirmationDeleteUsersDialog.prototype.addEventHandler.callCount).to.equal(3);
                expect(ConfirmationDeleteUsersDialog.prototype.addEventHandler.getCall(0).args[0]).to.equal('showLoader');
                expect(ConfirmationDeleteUsersDialog.prototype.addEventHandler.getCall(0).args[1]).to.be.function;
            });

            it('Should add event handler which hide loader', function() {
                expect(ConfirmationDeleteUsersDialog.prototype.addEventHandler.callCount).to.equal(3);
                expect(ConfirmationDeleteUsersDialog.prototype.addEventHandler.getCall(1).args[0]).to.equal('hideLoader');
                expect(ConfirmationDeleteUsersDialog.prototype.addEventHandler.getCall(1).args[1]).to.be.function;
            });

            it('Should go to first page after deleting user', function() {
                expect(ConfirmationDeleteUsersDialog.prototype.addEventHandler.callCount).to.equal(3);
                expect(ConfirmationDeleteUsersDialog.prototype.addEventHandler.getCall(2).args[0]).to.equal('deletedUsers');
                expect(ConfirmationDeleteUsersDialog.prototype.addEventHandler.getCall(2).args[1]).to.be.function;
            });
        });
    });
});
