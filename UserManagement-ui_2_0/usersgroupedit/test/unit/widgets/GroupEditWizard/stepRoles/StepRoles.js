define([
    'jscore/core',
    'usersgroupedit/widgets/GroupEditWizard/stepRoles/StepRoles',
    'usersgroupedit/widgets/GroupEditWizard/RoleAssignTableWidget/RoleAssignTableWidget'
], function(core, StepRoles, RoleAssignTableWidget) {
    "use strict";

    describe("StepRoles", function() {
        var sandbox, stepRoles, modelStub, model, viewStub, elementStub, functionStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');
            model = {
                finish: false,
                privileges: {
                    addEventHandler: function() {},
                    sort: function() {},
                    toJSONwithModels: function() {},
                    size: function() {},
                    getAssigned: function() {return {};}
                }
            }
            modelStub = {
                addEventHandler: function() {},
                setAttribute: function() {},
                removeAttribute: function() {},
                get: function(key) {
                    return model[key];
                },
                fetch: function() {},
                isChangedModel: function() {return false;}
            };
            functionStub = {
                addEventHandler: function(){},
                setProperty: function(){},
                disable: function(){},
                enable: function(){},
                getValue: function(){}

            };
            viewStub = {
                findById: function() {
                     return  functionStub;
                },
                getElement: function() {
                    return  elementStub;
                }
            };

            sandbox.spy(functionStub,'addEventHandler');
            sandbox.spy(functionStub,'disable');
            sandbox.spy(functionStub,'enable');
            sandbox.spy(functionStub,'setProperty');
            sandbox.spy(functionStub,'getValue');
            sandbox.spy(elementStub,'find', function(){elementStub;});
            sandbox.spy(elementStub,'removeAttribute');
            sandbox.spy(elementStub,'getProperty');
            sandbox.spy(elementStub,'addEventHandler');

            sandbox.spy(viewStub, 'findById');
            sandbox.spy(viewStub, 'getElement');

            sandbox.spy(modelStub,'setAttribute');
            sandbox.spy(modelStub,'removeAttribute');
            sandbox.spy(modelStub,'get');

            stepRoles = new StepRoles(modelStub);
            stepRoles.view = viewStub;
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('StepRoles should be defined', function() {
            expect(StepRoles).not.to.be.undefined;
            expect(StepRoles).not.to.be.null;
        });

        describe('onViewReady()', function() {
            beforeEach(function() {
                sandbox.stub(stepRoles,'addEventHandlers');
                stepRoles.onViewReady();
            });

            it('Should call addEventHandlers function', function() {
                expect(stepRoles.addEventHandlers.callCount).to.equal(1);
            });
        });

        describe('updateRolesCheckInModel()', function() {
            it('Should update roles in model when CheckBox "Modify Roles" is true', function() {
                sandbox.stub(stepRoles,'getRolesCheckBoxValue', function(){return true;})
                sandbox.stub(stepRoles,'getSelectBoxRolesValue', function(){return {value: 'true'};})
                stepRoles.updateRolesCheckInModel();
                expect(stepRoles.getRolesCheckBoxValue.callCount).to.equal(1);
                expect(modelStub.setAttribute.callCount).to.equal(1);
                expect(modelStub.setAttribute.getCall(0).args[0]).to.equal('assign');
                expect(modelStub.setAttribute.getCall(0).args[1]).to.equal('true');
            });
            it('Should remove attribute role from model when CheckBox "Modify Roles" is not true', function(){
                sandbox.stub(stepRoles,'getRolesCheckBoxValue', function(){return false;})
                stepRoles.updateRolesCheckInModel();
                expect(stepRoles.getRolesCheckBoxValue.callCount).to.equal(1);
                expect(modelStub.removeAttribute.callCount).to.equal(1);
                expect(modelStub.removeAttribute.getCall(0).args[0]).to.equal('assign');
            });
        });

        describe('addEventHandlers()', function() {
            var getWizardStub, elementRolesStub;
            beforeEach(function() {
                elementRolesStub = new core.Element('div');
                getWizardStub={
                    resetRemainingSteps: function(){},
                    setLabels: function(){},
                    setStep: function(){}
                };
                sandbox.spy(getWizardStub,'resetRemainingSteps');
                sandbox.spy(getWizardStub,'setLabels');
                sandbox.spy(getWizardStub,'setStep');
                sandbox.stub(stepRoles,'showButtons');
                sandbox.spy(stepRoles,'revalidate');
                sandbox.spy(stepRoles,'addEventHandler');
                sandbox.stub(stepRoles,'getWizard', function() {return getWizardStub;});
                sandbox.stub(stepRoles,'getRolesCheckBox', function() {return elementRolesStub;});
                sandbox.spy(modelStub,'addEventHandler');
                sandbox.spy(elementRolesStub,'addEventHandler');

                stepRoles.addEventHandlers();
            });

            it('When model has been changed (click event), should update roles ', function() {
                var getRolesCheckBoxValue = sandbox.stub(stepRoles,'getRolesCheckBoxValue', function(){return true;});

                var output = elementRolesStub.addEventHandler.getCall(0).args[1];
                output.call(stepRoles);
                expect(functionStub.enable.callCount).to.equal(1);

                expect(stepRoles.getWizard.callCount).to.equal(2);
                expect(getWizardStub.resetRemainingSteps.callCount).to.equal(1);
                expect(stepRoles.revalidate.callCount).to.equal(1);

                getRolesCheckBoxValue.restore();
                sandbox.stub(stepRoles,'getRolesCheckBoxValue', function() {return undefined;});

                output.call(stepRoles);
                expect(functionStub.disable.callCount).to.equal(1);
            });

            it('Should add activate event handler to stepRoles', function() {
                expect(stepRoles.addEventHandler.callCount).to.equal(1);
                expect(stepRoles.addEventHandler.getCall(0).args[0]).to.equal('activate');
            });

            it('When stepRoles has activated, should add labels to wizard', function() {
                var output = stepRoles.addEventHandler.getCall(0).args[1];
                var value;
                output.call(stepRoles,modelStub,value);
                expect(stepRoles.getWizard.callCount).to.equal(2);
                expect(getWizardStub.setLabels.callCount).to.equal(1);
            });

            it('When stepRoles has activated and model get finish status on false, should shows buttons', function() {
                var output = stepRoles.addEventHandler.getCall(0).args[1];
                var value;
                output.call(stepRoles,modelStub,value);
                expect(stepRoles.showButtons.callCount).to.equal(1);
            });

            it('When stepRoles has activated and model get finish status on true, should set steps to wizard', function() {
                model['finish'] = true;
                var output = stepRoles.addEventHandler.getCall(0).args[1];
                var value;
                output.call(stepRoles,modelStub,value);
                expect(getWizardStub.setStep.callCount).to.equal(1);
                expect(getWizardStub.setStep.getCall(0).args[0]).to.equal(4);
            });

        });

        describe('isValid()', function() {
            it('Should return value of status checkbox', function() {
                sandbox.stub(stepRoles,'getRolesCheckBoxValue');
                //returns always true because it is only the first step
                var output = stepRoles.isValid();
                expect(output).to.equal(true);
                expect(stepRoles.getRolesCheckBoxValue.callCount).to.equal(0);

            });
        });

        describe('getRolesCheckBoxValue()', function() {
            it('Should return checked property form rolesCheckBox', function() {
                sandbox.stub(stepRoles,'getRolesCheckBox', function() {return elementStub;});
                var output = stepRoles.getRolesCheckBoxValue();
                expect(output).not.to.be.null;
                expect(stepRoles.getRolesCheckBox.callCount).to.equal(1);
                expect(elementStub.getProperty.callCount).to.equal(1);
                expect(elementStub.getProperty.getCall(0).args[0]).to.equal('checked');
            });
        });
        describe('getSelectBoxRolesValue()', function() {
            it('Should return value of roles', function() {
                sandbox.spy(stepRoles,'getSelectBoxRoles', function(){return functionStub;});
                var output = stepRoles.getSelectBoxRolesValue();
                expect(output).not.to.be.null;
                expect(stepRoles.getSelectBoxRoles.callCount).to.equal(1);
                expect(functionStub.getValue.callCount).to.equal(1);
            });
        });

        describe('getSelectBoxRoles()', function() {
            it('Should find and return roles element', function() {
                var output = stepRoles.getSelectBoxRoles();
                expect(output).not.to.be.null;
                expect(viewStub.findById.callCount).to.equal(1);
                expect(viewStub.findById.getCall(0).args[0]).to.equal('selectBoxRoles');
            });
        });

        describe('getRolesCheckBox()', function() {
            it('Should find and return roles from stepRoles', function() {
                var output = stepRoles.getRolesCheckBox();
                expect(output).not.to.be.null;
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(elementStub.find.callCount).to.equal(1);
            });
        });
    });
});
