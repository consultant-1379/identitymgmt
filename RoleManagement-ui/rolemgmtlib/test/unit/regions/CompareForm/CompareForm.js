define([
   'jscore/core',
   'jscore/ext/net',
   'rolemgmtlib/regions/CompareForm/CompareForm',
   'rolemgmtlib/model/CompareModel',
   'rolemgmtlib/regions/CompareForm/CompareFormView',
   'identitymgmtlib/Utils',
   'widgets/Notification',
   'i18n!rolemgmtlib/dictionary.json'
], function(core, net, CompareForm, CompareModel, CompareFormView, utils, Notification, Dictionary) {
   'use strict';

   describe('CompareForm', function() {
      it('should be defined', function() {
         expect(CompareForm).not.to.be.undefined;
      });

      var sandbox, compareForm, compareFormView, eventBusStub, mockContext,
         roleName1, roleName2, server, roleName, roleStatus, roleDescription;

      beforeEach(function() {
         roleName = 'ROLE';

         sandbox = sinon.sandbox.create();

         eventBusStub = new core.EventBus();

         mockContext = new core.AppContext();
         mockContext.eventBus = eventBusStub;

         compareForm = new CompareForm({
            context: mockContext,
            role1: roleName,
            role2: roleName,
            model1: new CompareModel({
               roleName: roleName
            }),
            model2: new CompareModel({
               roleName: roleName
            })
         });

         compareFormView = new CompareFormView();

         sandbox.stub(compareForm, 'getContext', function() {
            return mockContext;
         });

         sandbox.stub(compareForm, 'getEventBus', function() {
            return eventBusStub;
         });
         server = sandbox.useFakeServer();
      });

      afterEach(function() {
         sandbox.restore();
      });

      describe('onViewReady():success', function() {
         var onViewReadySpy, onStartSpy, response, updateView1Spy, updateView2Spy,
            deleteSameActionsSpy, updateActionsForRolesSpy, getActionsObjectSpy;

         beforeEach(function() {
            onViewReadySpy = sandbox.spy(compareForm, 'onViewReady');
            onStartSpy = sandbox.spy(compareForm, 'onStart');
            updateView1Spy = sandbox.spy(compareForm, 'updateView1');
            updateView2Spy = sandbox.spy(compareForm, 'updateView2');
            deleteSameActionsSpy = sandbox.spy(compareForm, 'deleteSameActions');
            updateActionsForRolesSpy = sandbox.spy(compareForm, 'updateActionsForRoles');
            getActionsObjectSpy = sandbox.spy(compareForm, 'getActionsObject');

            response = {
               "type": "application",
               "name": roleName,
               "description": "Authorized PersistentObjectService",
               "status": "ENABLED" // pusta tablica capabilities i porównać
            };
            server.respondWith('GET', '/oss/idm/rolemanagement/roles/' + roleName, [200, {
                  'Content-Type': 'application/json'
               },
               JSON.stringify(response)
            ]);

            compareForm.onStart();
            compareForm.onViewReady();

            server.respond();
         });

         it('should proceed common behaviour', function() {
            expect(compareForm.options.model1).not.to.be.undefined;
            expect(compareForm.options.model2).not.to.be.undefined;

            expect(onViewReadySpy.calledOnce).to.equal(true);
            expect(onStartSpy.calledOnce).to.equal(true);
         });

         it('should fetch models correctly', function() {
            expect(compareForm.actionsRole1).not.to.be.undefined;
            expect(compareForm.actionsRole2).not.to.be.undefined;

            expect(updateView1Spy.calledOnce).to.equal(true);
            expect(updateView2Spy.calledOnce).to.equal(true);

            expect(deleteSameActionsSpy.calledOnce).to.equal(true);
            expect(updateActionsForRolesSpy.calledOnce).to.equal(true);

            expect(getActionsObjectSpy.getCall(0).args[0]).to.equal(compareForm.options.model1);
            expect(getActionsObjectSpy.getCall(1).args[0]).to.equal(compareForm.options.model2);

            expect(compareForm.options.model1.id).to.equal(roleName);
            expect(compareForm.options.model2.id).to.equal(roleName);
         });

         it('should set role name which is displayed', function() {
            expect(compareForm.options.role1).to.equal(roleName);
            expect(compareForm.options.role2).to.equal(roleName);
         });

         it('should fetch role status', function() {
            expect(compareForm.options.model1.getStatus()).to.equal(response.status);
            expect(compareForm.options.model2.getStatus()).to.equal(response.status);
         });

         it('should fetch role description', function() {
            expect(compareForm.options.model1.getDescription()).to.equal(response.description);
            expect(compareForm.options.model2.getDescription()).to.equal(response.description);
         });

         it('should fetch role models in onViewReady function', function() {
            expect(compareForm.options.model1.getType()).to.equal(response.type);
            expect(compareForm.options.model2.getType()).to.equal(response.type);
         });

         it('should set role name', function() {
            expect(compareForm.options.model1.getName()).to.equal(response.name);
            expect(compareForm.options.model2.getName()).to.equal(response.name);
         });
      });
      describe('onViewReady():error', function() {
         var onViewReadyStub, showErrorMessageStub, response;
         beforeEach(function() {

            onViewReadyStub = sandbox.spy(compareForm, 'onViewReady');
            showErrorMessageStub = sandbox.spy(compareForm, 'showErrorMessage');

            response = {
               "userMessage": "Specified role not found.",
               "httpStatusCode": 404,
               "internalErrorCode": null,
               "developerMessage": null,
               "time": "2015-10-22T14:41:07",
               "links": null
            };
            server.respondWith('GET', '/oss/idm/rolemanagement/roles/' + roleName, [404, {
                  'Content-Type': 'application/json'
               },
               JSON.stringify(response)
            ]);

            compareForm.onViewReady();

            server.respond();
         });
         it('should show error message after error 404', function() {

            expect(compareForm.showErrorMessage.callCount).to.equal(2);
            expect(compareForm.failureNotification).not.to.be.undefined;

            expect(compareForm.showErrorMessage.getCall(0).args[0]).to.be.equal( utils.printf(Dictionary.compareRoleForm.noRoleMessage, 'ROLE'));
         });
      });
      describe('updateView1()', function() {
         var setDescriptionStub, setStatusStub, getStatusFormElementSpy, getElementStub, mockView, 
         compareFormSpy, getDescriptionFormElementSpy;

         beforeEach(function() {
            setDescriptionStub = sandbox.stub(compareFormView, 'setDescription');
            setStatusStub = sandbox.stub(compareFormView, 'setStatus');
            getDescriptionFormElementSpy = sandbox.stub(compareFormView, 'getDescriptionFormElement');
            getStatusFormElementSpy = sandbox.stub(compareFormView, 'getStatusFormElement');

         });

         // it('should update view description', function() {
         //    compareFormView.setDescription(compareForm.options.model1.getDescription(), 1);

         //    expect(setDescriptionStub.getCall(0).args[0]).to.equal(compareForm.options.model1.getDescription());
         //    expect(setDescriptionStub.getCall(0).args[1]).to.equal(1);

         //    expect(setDescriptionStub.callCount).to.equal(1);

         //    expect(compareFormView.getDescriptionFormElement(1)).to.equal(compareForm.options.model1.getDescription());
         // });

         it('should update view status', function() {
            compareFormView.setStatus(compareForm.options.model1.getStatus(), 1);

            expect(setStatusStub.getCall(0).args[0]).to.equal(compareForm.options.model1.getStatus());
            expect(setStatusStub.getCall(0).args[1]).to.equal(1);

            expect(setStatusStub.callCount).to.equal(1);

            expect(compareFormView.getStatusFormElement(1)).to.equal(compareForm.options.model1.getStatus());
         });
      });

      describe('updateView2()', function() {
         var setDescriptionStub, setStatusStub, getStatusFormElementSpy, getElementStub, mockView, compareFormSpy, getDescriptionFormElementSpy;

         beforeEach(function() {
            setDescriptionStub = sandbox.stub(compareFormView, 'setDescription');
            setStatusStub = sandbox.stub(compareFormView, 'setStatus');
            getDescriptionFormElementSpy = sandbox.stub(compareFormView, 'getDescriptionFormElement');
            getStatusFormElementSpy = sandbox.stub(compareFormView, 'getStatusFormElement');
         });

         // it('should update view description', function() {
         //    compareFormView.setDescription(compareForm.options.model2.getDescription(), 2);

         //    expect(setDescriptionStub.getCall(0).args[0]).to.equal(compareForm.options.model1.getDescription());
         //    expect(setDescriptionStub.getCall(0).args[1]).to.equal(2);

         //    expect(setDescriptionStub.callCount).to.equal(1);

         //    expect(compareFormView.getDescriptionFormElement(2)).to.equal(compareForm.options.model2.getDescription());
         // });

         it('should update view status', function() {
            compareFormView.setStatus(compareForm.options.model2.getStatus(), 2);

            expect(setStatusStub.getCall(0).args[0]).to.equal(compareForm.options.model1.getStatus());
            expect(setStatusStub.getCall(0).args[1]).to.equal(2);

            expect(setStatusStub.callCount).to.equal(1);

            expect(compareFormView.getStatusFormElement(2)).to.equal(compareForm.options.model2.getStatus());
         });
      });

      describe('showErrorMessage()', function() {
         var addEventHandlersStub, response, getElementAttachToStub, attachToMock, failureNotification,
            attachToStub, initStub, notificationOptions, message;

         beforeEach(function() {
            message = "Role 'ROLE' does not exist. Please back to list and try again. Error 404.";
            attachToStub = sandbox.stub(Notification.prototype, 'attachTo');
            initStub = sandbox.stub(Notification.prototype, 'init');
         });

         it('should set notification for error message', function() {

            compareForm.showErrorMessage(message);

            expect(initStub.callCount).to.equal(1);
            expect(initStub.getCall(0).args[0].color).to.be.equal('red');
            expect(initStub.getCall(0).args[0].icon).to.be.equal('ebIcon ebIcon_error');
            expect(initStub.getCall(0).args[0].label).to.be.equal(message);
            expect(initStub.getCall(0).args[0].content).to.be.equal(message);
            expect(initStub.getCall(0).args[0].showCloseButton).to.be.equal(true);
            expect(initStub.getCall(0).args[0].showAsToast).to.be.equal(true);
            expect(initStub.getCall(0).args[0].autoDismiss).to.be.equal(false);

            expect(attachToStub.callCount).to.equal(1);
            expect(attachToStub.getCall(0).args[0]).to.be.equal(compareForm.getElement());
         });
      });
   });
});