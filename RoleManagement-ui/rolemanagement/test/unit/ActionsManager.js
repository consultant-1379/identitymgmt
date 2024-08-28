/*global define, describe, it, expect */
define([
    'jscore/core',
    'rolemanagement/ActionsManager',
    'identitymgmtlib/Utils',
    "i18n!rolemanagement/app.json",
    'rolemanagement/regions/RoleSummary/RoleSummary',
], function(core, ActionsManager, Utils, Dictionary, RoleSummary) {
    'use strict';

    describe('ActionsManager', function() {

        var sandbox, actionsManager, checkedRows, output;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('isRoleSummaryVisible()', function() {
            it('should by default return role summary is not visible', function() {
                output = ActionsManager.isRoleSummaryVisible();
                expect(output).to.equal(false);
            });
        });

        describe('getContextActions()', function() {
            beforeEach(function() {
                checkedRows = [];
            });
            it('Should return create action at first position if no ckeckedRows', function() {
                output = ActionsManager.getContextActions(checkedRows);
                expect(JSON.stringify(output[0])).to.be.equal(JSON.stringify((ActionsManager.getDefaultActions())[0]));
            });
            it('should not return create action if there are selected rows', function() {
                checkedRows.push({ type: "Com" });
                output = ActionsManager.getContextActions(checkedRows);
                expect(output[0].name).not.to.equal("Create");
            })
        });

        describe('getContextActions() for delete action', function() {
            it('should show delete button when one com, cpp, comalias or custom role is selected', function() {
                checkedRows = [];
                checkedRows.push({ type: "Com" });

                output = ActionsManager.getContextActions(checkedRows);
                expect(output.length).to.equal(4);
                expect(output[0].name).to.equal(Dictionary.actions.EditUserRole);
                expect(output[1].name).to.equal(Dictionary.actions.DeleteUserRole);
                expect(output[2].type).to.equal('separator');
                expect(output[3].name).to.equal(Dictionary.actions.Enable);

                checkedRows = [];
                checkedRows.push({ type: "ComAlias" });

                output = ActionsManager.getContextActions(checkedRows);
                expect(output.length).to.equal(5);
                expect(output[0].name).to.equal(Dictionary.actions.EditUserRole);
                expect(output[1].name).to.equal(Dictionary.actions.DeleteUserRole);
                expect(output[2].type).to.equal('separator');
                expect(output[3].name).to.equal(Dictionary.actions.Enable);
                expect(output[4].name).to.equal(Dictionary.actions.Disable);

                checkedRows = [];
                checkedRows.push({ type: "CUSTOM" });

                output = ActionsManager.getContextActions(checkedRows);
                expect(output.length).to.equal(5);
                expect(output[0].name).to.equal(Dictionary.actions.EditUserRole);
                expect(output[1].name).to.equal(Dictionary.actions.DeleteUserRole);
                expect(output[2].type).to.equal('separator');
                expect(output[3].name).to.equal(Dictionary.actions.Enable);
                expect(output[4].name).to.equal(Dictionary.actions.Disable);

                checkedRows = [];
                checkedRows.push({ type: "Cpp" });

                output = ActionsManager.getContextActions(checkedRows);
                expect(output.length).to.equal(4);
                expect(output[0].name).to.equal(Dictionary.actions.EditUserRole);
                expect(output[1].name).to.equal(Dictionary.actions.DeleteUserRole);
                expect(output[2].type).to.equal('separator');
                expect(output[3].name).to.equal(Dictionary.actions.Enable);
            });
            it('should not show delete button when one of selected role is application role', function() {
                checkedRows = [];
                checkedRows.push({ type: "Com" });
                checkedRows.push({ type: "Cpp" });
                checkedRows.push({ type: "ComAlias" });
                checkedRows.push({ type: "CUSTOM" });
                checkedRows.push({ type: "application" });
                output = ActionsManager.getContextActions(checkedRows);
                expect(output).to.be.empty;
            });
            it('should not show delete button when one of selected role is system role', function() {
                checkedRows = [];
                checkedRows.push({ type: "Com" });
                checkedRows.push({ type: "Cpp" });
                checkedRows.push({ type: "ComAlias" });
                checkedRows.push({ type: "CUSTOM" });
                checkedRows.push({ type: "system" });
                output = ActionsManager.getContextActions(checkedRows);
                expect(output).to.be.empty;
            });
        });

        describe('getContextActions() for changing status', function() {
            it('should show all three buttons when selected roles does not have the same status', function() {
                checkedRows = [];
                checkedRows.push({ type: "ComAlias", status: "ENABLED" });
                checkedRows.push({ type: "ComAlias", status: "DISABLED" });
                checkedRows.push({ type: "CUSTOM", status: "ENABLED" });
                output = ActionsManager.getContextActions(checkedRows);
                expect(output.length).to.equal(5);
                expect(output[0].name).to.equal(Dictionary.actions.DeleteUserRole);
                expect(output[1].type).to.equal('separator');
                expect(output[2].name).to.equal(Dictionary.actions.Enable);
                expect(output[3].name).to.equal(Dictionary.actions.Disable);
                expect(output[4].name).to.equal(Dictionary.actions.Nonassignable);
            });
            it('should show disable and nonassignable buttons when all selected roles have status enabled', function() {
                checkedRows = [];
                checkedRows.push({ type: "Com", status: "ENABLED" });
                checkedRows.push({ type: "Com", status: "ENABLED" });
                checkedRows.push({ type: "Com", status: "ENABLED" });
                checkedRows.push({ type: "Cpp", status: "ENABLED" });
                output = ActionsManager.getContextActions(checkedRows);
                expect(output.length).to.equal(3);
                expect(output[0].name).to.equal(Dictionary.actions.DeleteUserRole);
                expect(output[1].type).to.equal('separator');
                expect(output[2].name).to.equal(Dictionary.actions.Nonassignable);
            });
            it('should show enable and nonassignable buttons when all selected have status disabled', function() {
                checkedRows = [];
                checkedRows.push({ type: "ComAlias", status: "DISABLED" });
                checkedRows.push({ type: "Com", status: "DISABLED" });
                checkedRows.push({ type: "Com", status: "DISABLED" });
                output = ActionsManager.getContextActions(checkedRows);
                expect(output.length).to.equal(4);
                expect(output[0].name).to.equal(Dictionary.actions.DeleteUserRole);
                expect(output[1].type).to.equal('separator');
                expect(output[2].name).to.equal(Dictionary.actions.Enable);
                expect(output[3].name).to.equal(Dictionary.actions.Nonassignable);
            });
            it('should show enable and disable buttons when all selected roles does have status disabled_assignment', function() {
                checkedRows = [];
                checkedRows.push({ type: "ComAlias", status: "DISABLED_ASSIGNMENT" });
                checkedRows.push({ type: "Com", status: "DISABLED_ASSIGNMENT" });
                checkedRows.push({ type: "Com", status: "DISABLED_ASSIGNMENT" });
                output = ActionsManager.getContextActions(checkedRows);
                expect(output.length).to.equal(3);
                expect(output[0].name).to.equal(Dictionary.actions.DeleteUserRole);
                expect(output[1].type).to.equal('separator');
                expect(output[2].name).to.equal(Dictionary.actions.Enable);
            });
        });

        describe('getDefaultActions()', function() {
            it('Should return object with property name = Create User Role', function() {
                output = ActionsManager.getDefaultActions();
                expect(output[0]).to.have.property('name', 'Create User Role');
            });
            it('Should return object with property type = button', function() {
                output = ActionsManager.getDefaultActions()
                expect(output[0]).to.have.property('type', 'button');
            });
            it('Should return object with property color = darkBlue', function() {
                output = ActionsManager.getDefaultActions()
                expect(output[0]).to.have.property('color', 'darkBlue');
            });
        });

        describe('setEventBus()', function() {
          var theEventBus, subscribeStub;
          beforeEach(function(){
            theEventBus = new core.EventBus();
            subscribeStub = sandbox.stub(theEventBus, 'subscribe');
          });

            it('should subscribe on event when setting event bus', function() {
                ActionsManager.setEventBus(theEventBus);
                expect(subscribeStub.calledOnce).to.equal(true);
            });
            it('should set roleSummaryRegionVisible to true when second argument is summary', function(){
              ActionsManager.setEventBus(theEventBus);
              var callback = subscribeStub.getCall(0).args[1];

              callback.call(ActionsManager, true, 'summary');
              expect(ActionsManager.isRoleSummaryVisible()).to.equal(true);
            });
            it('should set roleSummaryRegionVisible to false when second argument is not summary', function(){
              ActionsManager.setEventBus(theEventBus);
              var callback = subscribeStub.getCall(0).args[1];

              callback.call(ActionsManager, true, 'definittellynotsummary');
              expect(ActionsManager.isRoleSummaryVisible()).to.equal(false);
            });

        });

    });
});
