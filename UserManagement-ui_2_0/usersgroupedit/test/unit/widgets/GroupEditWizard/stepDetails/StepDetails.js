define([
    'jscore/core',
    'usersgroupedit/widgets/GroupEditWizard/stepDetails/StepDetails'
], function(core, StepDetails) {
    "use strict";

    describe("StepDetails", function() {
        var sandbox, stepDetails, modelStub, model, viewStub, elementStub, functionStub, getWizardStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');
            model = {
                status: true,
                finish: false,
                description: ""
            }
            modelStub = {
                isChangedModel: function() {return false},
                addEventHandler: function() {},
                setAttribute: function() {},
                removeAttribute: function() {},
                get: function(key) {
                    return model[key];
                },
                fetch: function() {}
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

            getWizardStub={
                resetRemainingSteps: function(){},
                setLabels: function(){},
                setStep: function(){},
                _steps: undefined
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

            sandbox.spy(getWizardStub,'resetRemainingSteps');
            sandbox.spy(getWizardStub,'setLabels');
            sandbox.spy(getWizardStub,'setStep');

            stepDetails = new StepDetails(modelStub);
            stepDetails.view = viewStub;
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('StepDetails should be defined', function() {
            expect(StepDetails).not.to.be.undefined;
            expect(StepDetails).not.to.be.null;
        });

        describe('onViewReady()', function() {
            beforeEach(function() {
                sandbox.stub(stepDetails,'addEventHandlers');
                stepDetails.onViewReady();
            });
            it('Should set switcher to disable', function() {
                expect(viewStub.findById.callCount).to.equal(2);
                expect(viewStub.findById.getCall(0).args[0]).to.equal('switcher');
                expect(viewStub.findById.getCall(1).args[0]).to.equal('description');
                expect(functionStub.disable.callCount).to.equal(2);
            });

            it('Should call addEventHandlers function', function() {
                expect(stepDetails.addEventHandlers.callCount).to.equal(1);
            });
        });

        describe('updateStatusInModel()', function() {
            it('Should update status in model when CheckBox "Modify Status" is true', function() {
                sandbox.stub(stepDetails,'getStatusCheckBoxValue', function(){return true;})
                sandbox.stub(stepDetails,'getSwitcherValue', function(){return true;})
                sandbox.stub(stepDetails,'getWizard', function() {return getWizardStub;});
                stepDetails.updateStatusInModel();
                expect(stepDetails.getStatusCheckBoxValue.callCount).to.equal(1);
                expect(modelStub.setAttribute.callCount).to.equal(1);
                expect(modelStub.setAttribute.getCall(0).args[0]).to.equal('status');
                expect(modelStub.setAttribute.getCall(0).args[1]).to.equal(true);
            });
            it('Should remove attribute status from model when CheckBox "Modify Status" is not true', function(){
                sandbox.stub(stepDetails,'getStatusCheckBoxValue', function(){return false;})
                sandbox.stub(stepDetails,'getWizard', function() {return getWizardStub;});
                stepDetails.updateStatusInModel();
                expect(stepDetails.getStatusCheckBoxValue.callCount).to.equal(1);
                expect(modelStub.removeAttribute.callCount).to.equal(1);
                expect(modelStub.removeAttribute.getCall(0).args[0]).to.equal('status');
            });
        });


        describe('updateDescriptionInModel()', function() {
            it('Should update description in model when CheckBox "Modify Description" is true', function() {
                sandbox.stub(stepDetails,'getDescriptionCheckBoxValue', function(){return true;})
                sandbox.stub(stepDetails,'getDescriptionValue', function(){return 'descriptionValue';})
                sandbox.stub(stepDetails,'getWizard', function() {return getWizardStub;});
                stepDetails.updateDescriptionInModel();
                expect(stepDetails.getDescriptionCheckBoxValue.callCount).to.equal(1);
                expect(modelStub.setAttribute.callCount).to.equal(1);
                expect(modelStub.setAttribute.getCall(0).args[0]).to.equal('description');
                expect(modelStub.setAttribute.getCall(0).args[1]).to.equal('descriptionValue');
            });
            it('Should remove attribute description from model when CheckBox "Modify Description" is not true', function(){
                sandbox.stub(stepDetails,'getDescriptionCheckBoxValue', function(){return false;})
                sandbox.stub(stepDetails,'getWizard', function() {return getWizardStub;});
                stepDetails.updateDescriptionInModel();
                expect(stepDetails.getDescriptionCheckBoxValue.callCount).to.equal(1);
                expect(modelStub.removeAttribute.callCount).to.equal(1);
                expect(modelStub.removeAttribute.getCall(0).args[0]).to.equal('description');
            });
        });

        describe('addEventHandlers()', function() {
            beforeEach(function() {
                sandbox.spy(stepDetails,'getSwitcher');
                sandbox.spy(stepDetails,'getDescription');
                sandbox.stub(stepDetails,'showButtons');
                sandbox.spy(stepDetails,'revalidate');
                sandbox.spy(stepDetails,'addEventHandler');
                sandbox.stub(stepDetails,'getWizard', function() {return getWizardStub;});
                sandbox.stub(stepDetails,'getStatusCheckBox', function() {return elementStub;});
                sandbox.stub(stepDetails,'getDescriptionCheckBox', function() {return elementStub;});
                sandbox.spy(modelStub,'addEventHandler');

                stepDetails.addEventHandlers();
            });
            it('Should add change status event handler to model', function() {
                expect(modelStub.addEventHandler.callCount).to.equal(2);
                expect(modelStub.addEventHandler.getCall(0).args[0]).to.equal('change:status');
                expect(modelStub.addEventHandler.getCall(1).args[0]).to.equal('change:description');
            });

            it('When model has been changed (change:status event), should update switcher ', function() {
                var output = modelStub.addEventHandler.getCall(0).args[1];
                var value = 'MockValue';
                output.call(stepDetails,modelStub,value);
                expect(stepDetails.getSwitcher.callCount).to.equal(2);
                expect(functionStub.enable.callCount).to.equal(1);
                expect(stepDetails.getWizard.callCount).to.equal(2);
                expect(getWizardStub.resetRemainingSteps.callCount).to.equal(1);
                expect(stepDetails.revalidate.callCount).to.equal(1);
                var undefValue;
                output.call(stepDetails,modelStub,undefValue);
                expect(functionStub.disable.callCount).to.equal(1);
            });

            it('When model has been changed (change:description event), should update description ', function() {
                var output = modelStub.addEventHandler.getCall(1).args[1];
                var value = 'MockValue';
                output.call(stepDetails,modelStub,value);
                expect(stepDetails.getDescription.callCount).to.equal(2);
                expect(functionStub.enable.callCount).to.equal(1);
                expect(stepDetails.getWizard.callCount).to.equal(2);
                expect(getWizardStub.resetRemainingSteps.callCount).to.equal(1);
                expect(stepDetails.revalidate.callCount).to.equal(1);

                var undefValue;
                output.call(stepDetails,modelStub,undefValue);
                expect(functionStub.disable.callCount).to.equal(1);
            });

            it('Should add activate event handler to stepDetails', function() {
                expect(stepDetails.addEventHandler.callCount).to.equal(1);
                expect(stepDetails.addEventHandler.getCall(0).args[0]).to.equal('activate');
            });

            it('When stepDetails has activated, should add labels to wizard', function() {
                var output = stepDetails.addEventHandler.getCall(0).args[1];
                var value;
                output.call(stepDetails,modelStub,value);
                expect(stepDetails.getWizard.callCount).to.equal(3);
                expect(getWizardStub.setLabels.callCount).to.equal(1);
            });

            it('When stepDetails has activated and model get finish status on false, should shows buttons', function() {
                var output = stepDetails.addEventHandler.getCall(0).args[1];
                var value;
                output.call(stepDetails,modelStub,value);
                expect(stepDetails.showButtons.callCount).to.equal(1);
            });

            it('When stepDetails has activated and model get finish status on true, should set steps to wizard', function() {
                model['finish'] = true;
                var output = stepDetails.addEventHandler.getCall(0).args[1];
                var value;
                output.call(stepDetails,modelStub,value);
                expect(getWizardStub.setStep.callCount).to.equal(1);
                expect(getWizardStub.setStep.getCall(0).args[0]).to.equal(4);
            });

            it('Should add change event handler to update switcher', function() {
                expect(viewStub.findById.callCount).to.equal(2);
                expect(viewStub.findById.getCall(0).args[0]).to.equal('switcher');
                expect(viewStub.findById.getCall(1).args[0]).to.equal('description');
                expect(functionStub.addEventHandler.callCount).to.equal(2);
                expect(functionStub.addEventHandler.getCall(0).args[0]).to.equal('change');
                expect(functionStub.addEventHandler.getCall(1).args[0]).to.equal('change');
            });

            it('Should add change event handler to update statusCheckBox and descriptionCheckBox', function() {
                expect(stepDetails.getStatusCheckBox.callCount).to.equal(1);
                expect(stepDetails.getDescriptionCheckBox.callCount).to.equal(1);
                expect(elementStub.addEventHandler.callCount).to.equal(2);
                expect(elementStub.addEventHandler.getCall(0).args[0]).to.equal('change');
                expect(elementStub.addEventHandler.getCall(1).args[0]).to.equal('change');
            });
        });

        describe('isValid()', function() {
            it('Should return value of status checkbox', function() {
                sandbox.stub(stepDetails,'getStatusCheckBoxValue');
                sandbox.stub(stepDetails,'getDescriptionCheckBoxValue');
                //returns always true because it is only the first step
                var output = stepDetails.isValid();
                expect(output).to.equal(true);
                expect(stepDetails.getStatusCheckBoxValue.callCount).to.equal(0);
                expect(stepDetails.getDescriptionCheckBoxValue.callCount).to.equal(0);

            });
        });

        describe('getStatusCheckBoxValue()', function() {
            it('Should return checked property form statusCheckBox', function() {
                sandbox.stub(stepDetails,'getStatusCheckBox', function() {return elementStub;});
                var output = stepDetails.getStatusCheckBoxValue();
                expect(output).not.to.be.null;
                expect(stepDetails.getStatusCheckBox.callCount).to.equal(1);
                expect(elementStub.getProperty.callCount).to.equal(1);
                expect(elementStub.getProperty.getCall(0).args[0]).to.equal('checked');
            });
        });

        describe('getDescriptionCheckBoxValue()', function() {
            it('Should return checked property form descriptionCheckBox', function() {
                sandbox.stub(stepDetails,'getDescriptionCheckBox', function() {return elementStub;});
                var output = stepDetails.getDescriptionCheckBoxValue();
                expect(output).not.to.be.null;
                expect(stepDetails.getDescriptionCheckBox.callCount).to.equal(1);
                expect(elementStub.getProperty.callCount).to.equal(1);
                expect(elementStub.getProperty.getCall(0).args[0]).to.equal('checked');
            });
        });
        describe('getSwitcherValue()', function() {
            it('Should return value of switcher', function() {
                sandbox.spy(stepDetails,'getSwitcher', function(){return functionStub;});
                var output = stepDetails.getSwitcherValue();
                expect(output).not.to.be.null;
                expect(stepDetails.getSwitcher.callCount).to.equal(1);
                expect(functionStub.getValue.callCount).to.equal(1);
            });
        });
        describe('getDescriptionValue()', function() {
            it('Should return value of description', function() {
                sandbox.spy(stepDetails,'getDescription', function(){return functionStub;});
                var output = stepDetails.getDescriptionValue();
                expect(output).not.to.be.null;
                expect(stepDetails.getDescription.callCount).to.equal(1);
                expect(functionStub.getValue.callCount).to.equal(1);
            });
        });
        describe('getSwitcher()', function() {
            it('Should find and return switcher element', function() {
                var output = stepDetails.getSwitcher();
                expect(output).not.to.be.null;
                expect(viewStub.findById.callCount).to.equal(1);
                expect(viewStub.findById.getCall(0).args[0]).to.equal('switcher');
            });
        });
        describe('getDescription()', function() {
            it('Should find and return description element', function() {
                var output = stepDetails.getDescription();
                expect(output).not.to.be.null;
                expect(viewStub.findById.callCount).to.equal(1);
                expect(viewStub.findById.getCall(0).args[0]).to.equal('description');
            });
        });

        describe('getStatusCheckBox()', function() {
            it('Should find and return status from stepDetails', function() {
                var output = stepDetails.getStatusCheckBox();
                expect(output).not.to.be.null;
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(elementStub.find.callCount).to.equal(1);
            });
        });
        describe('getDescriptionCheckBox()', function() {
            it('Should find and return description from stepDetails', function() {
                var output = stepDetails.getDescriptionCheckBox();
                expect(output).not.to.be.null;
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(elementStub.find.callCount).to.equal(1);
            });
        });
    });
});