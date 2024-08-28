/*global define, describe, it, expect */
define([
    'jscore/core',
    'targetgroup/TargetgroupActionsManager',
    'identitymgmtlib/Utils',
    "i18n!targetgroup/app.json"
], function (core, TgActionsManager, Utils, Dictionary) {
    'use strict';

    describe('TargetgroupActionsManager', function () {
      var sandbox, mockContext, eventBusStub, publishSpy;

        eventBusStub = new core.EventBus();
        mockContext = new core.AppContext();
        mockContext.eventBus = eventBusStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            var server = sandbox.useFakeServer();
            publishSpy = sandbox.spy(eventBusStub, 'publish');
            TgActionsManager.setContext(mockContext);
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('TargetgroupActionsManager should be defined', function() {
            expect(TgActionsManager).not.to.be.undefined;
        });

        describe('setContext(ctx)', function() {
            it('should be possible to set context', function() {
                 expect(TgActionsManager.getContext()).to.equal(mockContext);
            });
        });

        describe('getDefaultActionsForEdit()', function() {
            var actions = TgActionsManager.getDefaultActionsForEdit();
            checkHasCorrectLength(actions,2);
            checkSaveButton(actions[0]);
            checkCancelButton(actions[1]);
        });
        describe('getDefaultActionsForView(shouldEditBeDisabled)', function() {
            describe('if shouldEditBeDisabled = false ', function() {
                var actions = TgActionsManager.getDefaultActionsForView(false);
                checkHasCorrectLength(actions,1);
                checkEditButtonEnabled(actions[0]);
            });
            describe('if shouldEditBeDisabled = true ', function() {
                var actions = TgActionsManager.getDefaultActionsForView(true);
                checkHasCorrectLength(actions,1);
                checkEditButtonDisabled(actions[0]);
            });
        });
        describe('getDefaultActionsForCreate()', function() {
            var actions = TgActionsManager.getDefaultActionsForCreate();
            checkHasCorrectLength(actions,2);
            checkSaveButton(actions[0]);
            checkCancelButton(actions[1]);
        });
        describe('getContextActionsForEdit(checkedRows, excludeDefaults)', function() {
            describe('if checkedRows.length = 1 && excludeDefaults = false', function() {
                var actions = TgActionsManager.getContextActionsForEdit(['row1'],false);
                checkHasCorrectLength(actions,4);
                checkSaveButton(actions[0]);
                checkCancelButton(actions[1]);
                checkSeparator(actions[2]);
                checkRemoveNodeButton(actions[3]);
            });
            describe('if checkedRows.length = 3 && excludeDefaults = true', function() {
                var actions = TgActionsManager.getContextActionsForEdit(['row1','row2','row3'],true);
                checkHasCorrectLength(actions,1);
                checkRemoveNodeButton(actions[0]);
            });
            describe('if checkedRows.length = 0 && excludeDefaults = true', function() {
                var actions = TgActionsManager.getContextActionsForEdit([],true);
                checkHasCorrectLength(actions,0);
            });
            describe('if checkedRows.length = 0 && excludeDefaults = false', function() {
                var actions = TgActionsManager.getContextActionsForEdit([],false);
                checkHasCorrectLength(actions,2);
                checkSaveButton(actions[0]);
                checkCancelButton(actions[1]);
            });
        });

        function checkHasCorrectLength(actions, length){
            it('should contain ' + length + ' elements', function() {
                 expect(actions.length).to.equal(length);
            });
        }

        function checkSaveButton(action){
            describe('should return save button', function() {
                checkButtonName(action, Dictionary.save);
                checkPropertyHasValue(action.color, 'color', 'darkBlue');
                hasNoProperty(action, 'disabled');
                checkAction(action,"tgActions:save");
            });
        }

        function checkCancelButton(action){
            describe('should return cancel button', function() {
                checkButtonName(action, Dictionary.cancel);
                hasNoProperty(action, 'color');
                hasNoProperty(action, 'disabled');
                checkAction(action,"tgActions:cancel");
            });
        }

         function checkEditButton(action){
             checkButtonName(action, Dictionary.edit);
             hasNoProperty(action, 'color');
             checkAction(action,"tgActions:edit")
         }

        function checkEditButtonEnabled(action){
            describe('should return edit button', function() {
                checkEditButton(action);
                checkPropertyHasValue(action.disabled, 'disabled', false);
            });
        }

        function checkEditButtonDisabled(action){
            describe('should return edit button', function() {
                checkEditButton(action);
                checkPropertyHasValue(action.disabled, 'disabled', true);
            });
        }

        function checkSeparator(action){
            describe('should return separator', function() {
                checkPropertyHasValue(action.type, 'type', 'separator')
            });
        }

        function checkRemoveNodeButton(action){
            describe('should return removeNode button', function() {
                checkButtonName(action, Dictionary.removeNode);
                hasNoProperty(action, 'color');
                checkPropertyHasValue(action.icon, 'icon', 'delete');
                hasNoProperty(action, 'disabled');
                checkAction(action,"tgActions:removeNode");
            });
        }

        function checkButtonName(action, name){
            it('at correct position with name: ' + name, function() {
                 expect(action.name).to.equal(name);
                 expect(action.type).to.equal('button');
            });
         }

        function checkPropertyHasValue(property,propertyName,value){
            it('that has property: ' + propertyName + ' with value ' + value, function() {
                 expect(property).to.equal(value);
            });
        }

        function hasNoProperty(action,property){
            it('that has no property: ' + property, function() {
                 expect(action).not.to.have.property(property);
            });
        }

        function checkAction(action,publishEvent){
            it('that has function: "action", that calls once "context.publish" with argument: "' + publishEvent + '"', function() {
              expect(action).to.have.property('action');
              action.action();
              expect(publishSpy.calledOnce).to.equal(true);
              expect(publishSpy.getCall(0).args[0]).to.equal(publishEvent);
          });
        }

    });
});
