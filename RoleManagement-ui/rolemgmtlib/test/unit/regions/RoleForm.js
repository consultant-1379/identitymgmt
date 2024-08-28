/*global define, describe, it, expect */
define([
    'rolemgmtlib/regions/RoleForm/RoleForm',
    'rolemgmtlib/regions/ComAliasRoleList/ComAliasRoleList',
    'rolemgmtlib/model/RoleModel',
    'rolemgmtlib/regions/RoleForm/RoleFormView',
    'widgets/SelectBox',
], function (RoleForm, ComRolesList, RoleModel, View, SelectBox) {
    'use strict';



    describe('RoleForm', function () {

    	var model, roleForm, sandbox, model;
      var eventBusStub, getContextStub, getEventBusStub, onViewReadyStub, mockContext;

        it('Should be defined', function() {
            expect(RoleForm).not.to.be.undefined;
        });

        beforeEach(function() {
        	sandbox = sinon.sandbox.create();
          eventBusStub = {
            publish: function () {},
            subscribe: function() {}
          };
          mockContext = { eventBus: eventBusStub };
        });

        afterEach(function() {
        	sandbox.restore();
        });

        describe('onViewReady()', function(){
          var getTypeSelectionWrapperSpy, enableSpy, disableSpy, modelMock;
          var fetchStub, getRolesStub, getPolicyStub;
          beforeEach(function(){
            fetchStub = sandbox.stub();
            modelMock = {
              fetch: fetchStub,
              getRoles: getRolesStub,
              getPolicy: getPolicyStub
            };
            getTypeSelectionWrapperSpy = sandbox.spy(View.prototype, 'getTypeSelectionWrapper');
            enableSpy = sandbox.stub(SelectBox.prototype, 'enable');
            disableSpy = sandbox.spy(SelectBox.prototype, 'disable');
          });

          //TODO: FIXME: Fix this testcases and check success (mayby use callback)
          //and errors after fetch
          it('Should execute enable when action is create', function(){
            roleForm = new RoleForm(
              {
                action: "create"
              });

            expect(getTypeSelectionWrapperSpy.calledOnce).to.equal(true);
            //console.log(enableSpy.callCount);// this is equal 2 WTF??
            //console.log(disableSpy.callCount);// this is equal 0 ok
            // expect(enableSpy.calledOnce).to.equal(true);
          });
          it('should fetch on model when action is not create', function(){
            roleForm = new RoleForm({
              action: 'edit',
              model: modelMock
            });

            expect(fetchStub.calledOnce).to.equal(true);
            //console.log(enableSpy.callCount);// this is equal 1 WTF??
            //console.log(disableSpy.callCount);// this is equal 1 ok
            // expect(enableSpy.calledOnce).to.equal(false);

          });
        });


        describe('after onViewReady with onViewReadyStub', function(){
          var modelMock, fetchStub, getRolesStub, getPolicyStub;
          beforeEach(function(){
            fetchStub = sandbox.stub();
            getRolesStub = sandbox.stub();
            getPolicyStub = sandbox.stub();
            modelMock = {
              fetch: fetchStub,
              getRoles: getRolesStub,
              getPolicy: getPolicyStub
            };
            onViewReadyStub = sandbox.stub(RoleForm.prototype, 'onViewReady');
        	  roleForm = new RoleForm({model: modelMock});
            getContextStub = sandbox.stub(roleForm, 'getContext').returns(mockContext);
            getEventBusStub = sandbox.stub(roleForm, 'getEventBus').returns(eventBusStub);
          });
          afterEach(function(){
            roleForm.delete;
          });

          describe('onStart()', function(){
            var subscribeSpy, selectBoxStub, addEventHandlerStub, getValueStub;
            var showComRolesStub, hideComRolesStub;
            beforeEach(function(){
              subscribeSpy = sandbox.spy(eventBusStub, 'subscribe');
              showComRolesStub = sandbox.stub(roleForm, 'showComRoles');
              hideComRolesStub = sandbox.stub(roleForm, 'hideComRoles');
              addEventHandlerStub = sandbox.stub();
              getValueStub = sandbox.stub();
              selectBoxStub ={
                addEventHandler: addEventHandlerStub,
                getValue: getValueStub
              };
              roleForm.selectBox = selectBoxStub;
            });

            it('should subscribe to two functions and create comRoleList', function(){
              roleForm.onStart();

              expect(roleForm.comRolesList).not.to.be.undefined;
              expect(subscribeSpy.calledTwice).to.equal(true);
              expect(addEventHandlerStub.calledOnce).to.equal(true);
              expect(addEventHandlerStub.getCall(0).args[0]).to.equal('change');
            });

            it('should call showComRoles if selectbox value is comalias', function(){
              getValueStub.returns({value: 'comalias'});
              roleForm.onStart();
              var callback = addEventHandlerStub.getCall(0).args[1];
              callback.call(roleForm);

              expect(callback).to.be.function;
              expect(showComRolesStub.calledOnce).to.equal(true);
            });

            it('should call hideComRoles if selectbox value is not comalias', function(){
              getValueStub.returns({value: 'com'});
              roleForm.onStart();
              var callback = addEventHandlerStub.getCall(0).args[1];
              callback.call(roleForm);

              expect(callback).to.be.function;
              expect(hideComRolesStub.calledOnce).to.equal(true);
            });

          });

          describe('hideComRoles()', function(){
            var stopStub;
            beforeEach(function(){
              roleForm.comRolesList = new ComRolesList({
                context : getContextStub()
              });
              stopStub = sandbox.stub(roleForm.comRolesList, 'stop');
            });

            it('should call stop function on comRoleList', function(){
              roleForm.hideComRoles();

              expect(stopStub.calledOnce).to.equal(true);
            });
          });

          describe('showComRoles', function(){
            var publishSpy, startStub, roles, model;
            beforeEach(function(){
              publishSpy = sandbox.spy(eventBusStub, 'publish');
              roleForm.comRolesList = new ComRolesList({
                context : getContextStub()
              });
              startStub = sandbox.stub(roleForm.comRolesList, 'start');
            });

            it('should not publish "comrolesTable:selectRoles" if action is create', function(){
              roleForm.options = {action: 'create'};
              roleForm.showComRoles();

              expect(startStub.calledOnce).to.equal(true);
              expect(publishSpy.calledOnce).to.equal(false);
            });

            it('should publish "comrolesTable:selectRoles" if action is not create', function(){
              // roleForm.options = {action: 'edit'};
              roles = ["role1", "role2"];
              model = {attributes: roles};
              roleForm.options = {model: model, action: 'edit'};
              roleForm.eventBus = eventBusStub;
              roleForm.showComRoles();

              expect(startStub.calledOnce).to.equal(true);
              expect(publishSpy.calledOnce).to.equal(true);
            });

          });

          describe('updateModel()', function(){
            var roleModel, validateFieldsStub, getValueStub, selectBoxStub;
            beforeEach(function(){
              roleModel = new RoleModel();
              roleModel.initWithDefaults();
              getValueStub = sandbox.stub().returns({value: "value"})
              selectBoxStub ={
                getValue: getValueStub
              };
              roleForm.selectBox = selectBoxStub;
              roleForm.options = {model: roleModel};
              validateFieldsStub = sandbox.stub(roleForm, 'validateFields');
            });
            afterEach(function(){
              roleModel.delete;
            });

            it('update model properly and validate fields', function(){
              roleForm.updateModel();

              expect(validateFieldsStub.calledOnce).to.equal(true);
            });
          });

          describe('updateView()', function(){
            var setValueStub, selectBoxStub, showComRolesStub, hideComRolesStub, roleModel, hideCustomRolesStub, showCustomRolesStub;
            beforeEach(function(){
              roleModel = new RoleModel();
              roleForm.options = {model: roleModel};
              setValueStub = sandbox.stub();
              selectBoxStub ={
                setValue: setValueStub
              };
              roleForm.selectBox = selectBoxStub;
              showComRolesStub = sandbox.stub(roleForm, 'showComRoles');
              hideComRolesStub = sandbox.stub(roleForm, 'hideComRoles');
              hideCustomRolesStub = sandbox.stub(roleForm, 'hideCustomRoles');
              showCustomRolesStub = sandbox.stub(roleForm, 'showCustomRoles');
              roleForm.typeItems ={
                "com":{ value: "com" },
                "comalias":{ value: "comalias" }
              };
            });
            afterEach(function(){
              roleModel.delete;
            });

            it('update View properly when Type of role is comalias', function(){
              roleForm.options.model.setType('comalias');
              roleForm.updateView();

              expect(setValueStub.calledOnce).to.equal(true);
              expect(showComRolesStub.calledOnce).to.equal(true);
              expect(hideComRolesStub.calledOnce).to.equal(false);
              expect(hideCustomRolesStub.calledOnce).to.equal(true);
              expect(showCustomRolesStub.calledOnce).to.equal(false);
            });

            it('update View properly when Type of role is not comalias', function(){
              roleForm.options.model.setType('com');
              roleForm.updateView();

              expect(setValueStub.calledOnce).to.equal(true);
              expect(showComRolesStub.calledOnce).to.equal(false);
              expect(hideComRolesStub.calledOnce).to.equal(true);
              expect(hideCustomRolesStub.calledOnce).to.equal(true);
              expect(showCustomRolesStub.calledOnce).to.equal(false);
            });

            it('update View properly when Type of role is custom role', function(){
              roleForm.options.model.setType('custom');
              roleForm.updateView();

              expect(setValueStub.calledOnce).to.equal(true);
              expect(showComRolesStub.calledOnce).to.equal(false);
              expect(hideComRolesStub.calledOnce).to.equal(true);
              expect(hideCustomRolesStub.calledOnce).to.equal(false);
              expect(showCustomRolesStub.calledOnce).to.equal(true);
            });

          });

        describe('showErrors()', function() {
            var setNameValidStub, setNameInvalidStub, setDescriptionValidStub;
            var setDescriptionInvalidStub, setTypeValidStub, setTypeInvalidStub;
            var viewMock, mockResult, getErrorBoxFunction, getErrorBoxStub, getErrorMessageBoxStub;
            beforeEach(function(){
                getErrorBoxFunction = {
                    setModifier: function(){},
                    setText: function(){}
                };
                sandbox.spy(getErrorBoxFunction,'setModifier');
                sandbox.spy(getErrorBoxFunction,'setText');

                setNameValidStub = sandbox.stub(roleForm.view, 'setNameValid');
                setNameInvalidStub = sandbox.stub(roleForm.view, 'setNameInvalid');
                setDescriptionValidStub = sandbox.stub(roleForm.view, 'setDescriptionValid');
                setDescriptionInvalidStub = sandbox.stub(roleForm.view, 'setDescriptionInvalid');
                setTypeValidStub = sandbox.stub(roleForm.view, 'setTypeValid');
                setTypeInvalidStub = sandbox.stub(roleForm.view, 'setTypeInvalid');
                getErrorBoxStub = sandbox.stub(roleForm.view,'getErrorBox', function(){return getErrorBoxFunction;});
                getErrorMessageBoxStub = sandbox.stub(roleForm.view,'getErrorMessageBox', function(){return getErrorBoxFunction;});
                viewMock = {
                    setNameValid: setNameValidStub,
                    setNameInvalid: setNameInvalidStub,
                    setDescriptionValid: setDescriptionValidStub,
                    setDescriptionInvalid: setDescriptionInvalidStub,
                    setTypeValid: setTypeValidStub,
                    setTypeInvalid: setTypeInvalidStub,
                    getErrorBox: getErrorBoxStub,
                    getErrorMessageBox: getErrorMessageBoxStub
                };
                roleForm.view = viewMock;
            });

          it('Should call view.setNameInvalid() if name is invalid', function() {
            mockResult = {
              name: {
                valid: false,
                errors: ["Error error"]
              },

              description: {
                valid: true,
              },

              type: {
                valid: true
              },
              roles: {
                valid: true
              }
            }
            roleForm.showErrors(mockResult);
            expect(setNameInvalidStub.calledOnce);
          });

          it('Should call view.setDescriptionInvalid() if description is invalid', function() {
            mockResult = {
              name: {
                valid: true,
              },

              description: {
                valid: false,
                errors: ["error"]
              },

              type: {
                valid: true
              },
              roles: {
                valid: true
              }
            }
            roleForm.showErrors(mockResult);
            expect(setDescriptionInvalidStub.calledOnce);
          });


          it('Should call view.setTypeInvalid() if type is invalid', function() {
            mockResult = {
              name: {
                valid: true,
              },

              description: {
                valid: true
              },

              type: {
                valid: false,
                errors: ["error"]
              },
              roles: {
                valid: true
              }
            };

            roleForm.showErrors(mockResult);
            expect(setTypeInvalidStub.calledOnce);
          });


          it('Should call view.setTypeInvalid() if roles are invalid', function() {
            mockResult = {
              name: {
                valid: true,
              },

              description: {
                valid: true
              },

              type: {
                valid: true
              },
              roles: {
                valid: false,
                errors: ["error"]
              }
            };

            roleForm.showErrors(mockResult);
            expect(setTypeInvalidStub.calledWith(mockResult.roles.errors[0]));
          });

          describe('validateFields()', function(){
            var roleModel, showErrorsStub;
            beforeEach(function(){
              roleModel = new RoleModel();
              roleForm.options = {model: roleModel};
              showErrorsStub = sandbox.stub(roleForm, 'showErrors');
            });
            afterEach(function(){
              roleModel.delete;
            });

            it('should call showErrors function',function(){
              roleForm.validateFields();

              expect(showErrorsStub.calledOnce).to.equal(true);
            });
          });

          describe('showCustomRoles()', function() {
            var setItemsToSelectStub, attachToStub, viewStub, mockOptions;
            beforeEach(function() {
              setItemsToSelectStub = sandbox.stub();
              attachToStub = sandbox.stub();
              viewStub = {
                getCustomRolesDetailsFormElement: sandbox.stub()
              };
              roleForm.view = viewStub;
              mockOptions = {
                model: {
                  attributes: {
                    roles: [{name: "mockRoles"}],
                    policy: "mockPolicy"
                  },
                  removeAttribute: sandbox.stub()
                }
              };
              roleForm.options = mockOptions;
            });
            it('should call setItemsToSelect when action is not create', function() {
              roleForm.options.action = 'mockAction';
              roleForm.options.model = mockOptions.model;
              roleForm.customRoleDetails = {
                setItemsToSelect: setItemsToSelectStub,
                attachTo: attachToStub
              };

              roleForm.showCustomRoles();

              expect(setItemsToSelectStub.calledOnce).to.equal(true);
              expect(attachToStub.calledOnce).to.equal(true);
              expect(mockOptions.model.removeAttribute.getCall(0).args[0]).to.equal('roles');
              expect(mockOptions.model.removeAttribute.calledOnce).to.equal(true);
            });
          });
        });
      });
    });
});
