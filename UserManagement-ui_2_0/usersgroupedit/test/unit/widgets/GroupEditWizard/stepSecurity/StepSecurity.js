define([
    'jscore/core',
    'usersgroupedit/widgets/GroupEditWizard/stepSecurity/StepSecurity',
    'usermgmtlib/widgets/CustomPasswordAgeingWidget/CustomPasswordAgeingWidget'
], function(core, StepSecurity, CustomPasswordAgeingWidget) {
    "use strict";

    describe("StepSecurity", function() {
        var sandbox, stepSecurity, modelStub, model, viewStub, elementStub, functionStub, getWizardStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');
            model = {
                status: true,
                finish: false,
                passwordAgeing: null
            }
            modelStub = {
                isChangedModel: function() {return false},
                addEventHandler: function() {},
                setAttribute: function() {},
                getAttribute: function(key) {return model[key]},
                removeAttribute: function() {},
                get: function(key) {
                    return model[key];
                },
                set: function(key,value) {
                	model[key] = value;
                },
                fetch: function() {}
            };
            functionStub = {
                addEventHandler: function(){},
                setProperty: function(){},
                disable: function(){},
                enable: function(){},
                getValue: function(){},
                removeTitle: function(){}

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

            //sandbox.spy(modelStub,'addEventHandler');
            sandbox.spy(modelStub,'setAttribute');
            sandbox.spy(modelStub,'removeAttribute');
            sandbox.spy(modelStub,'get');

            sandbox.spy(getWizardStub,'resetRemainingSteps');
            sandbox.spy(getWizardStub,'setLabels');
            sandbox.spy(getWizardStub,'setStep');

            stepSecurity = new StepSecurity(modelStub);
            stepSecurity.view = viewStub;
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('StepSecurity should be defined', function() {
            expect(StepSecurity).not.to.be.undefined;
            expect(StepSecurity).not.to.be.null;
        });

        describe('onViewReady()', function() {
            beforeEach(function() {
                sandbox.stub(stepSecurity,'addEventHandlers');
                sandbox.stub(stepSecurity,'isValid');
                stepSecurity.onViewReady();
            });
            it('Should set passwordAgeing to disable', function() {
                expect(viewStub.findById.callCount).to.equal(2);
                expect(viewStub.findById.getCall(0).args[0]).to.equal('passwordAgeing');
                expect(functionStub.disable.callCount).to.equal(1);
            });

            it('Should call addEventHandlers function', function() {
                expect(stepSecurity.addEventHandlers.callCount).to.equal(1);
            });
        });


        describe('updatePasswordAgeingInModel()', function() {
            it('Should update passwordAgeing in model when CheckBox "Modify Password Ageing" is true', function() {
                sandbox.stub(stepSecurity,'getPwdAgeingCheckBoxValue', function(){return true;})
                sandbox.stub(stepSecurity,'getPwdAgeingValue', function(){return 'passwordAgeingValue';})
                sandbox.stub(stepSecurity,'getWizard', function() {return getWizardStub;});
                stepSecurity.updatePwdAgeingInModel();
                expect(stepSecurity.getPwdAgeingCheckBoxValue.callCount).to.equal(1);
                expect(modelStub.setAttribute.callCount).to.equal(1);
                expect(modelStub.setAttribute.getCall(0).args[0]).to.equal('passwordAgeing');
                expect(modelStub.setAttribute.getCall(0).args[1]).to.equal('passwordAgeingValue');
            });
            it('Should remove attribute passwordAgeing from model when CheckBox "Modify Password Ageing" is not true', function(){
                sandbox.stub(stepSecurity,'getPwdAgeingCheckBoxValue', function(){return false;})
                sandbox.stub(stepSecurity,'getWizard', function() {return getWizardStub;});
                stepSecurity.updatePwdAgeingInModel();
                expect(stepSecurity.getPwdAgeingCheckBoxValue.callCount).to.equal(1);
                expect(modelStub.removeAttribute.callCount).to.equal(3);
                expect(modelStub.removeAttribute.getCall(0).args[0]).to.equal('passwordAgeing');
            });
        });

        describe('addEventHandlers()', function() {
            beforeEach(function() {
                sandbox.spy(stepSecurity,'getPwdAgeing');
                sandbox.stub(stepSecurity,'showButtons');
                sandbox.spy(stepSecurity,'revalidate');
                sandbox.spy(stepSecurity,'addEventHandler');
                sandbox.stub(stepSecurity,'getWizard', function() {return getWizardStub;});
                sandbox.stub(stepSecurity,'getPwdAgeingCheckBox', function() {return elementStub;});
                sandbox.stub(stepSecurity,'getAuthModeCheckBox', function() {return elementStub;});
                sandbox.spy(modelStub,'addEventHandler')

                stepSecurity.addEventHandlers();
            });
            it('Should add change status event handler to model', function() {
                expect(modelStub.addEventHandler.callCount).to.equal(1);
                expect(modelStub.addEventHandler.getCall(0).args[0]).to.equal('change:passwordAgeing');
            });


            it('When model has been changed (change:passwordAgeing event), should update passwordAgeing ', function() {
                var output = modelStub.addEventHandler.getCall(0).args[1];
                var value = 'MockValue';
                output.call(stepSecurity,modelStub,value);
                expect(stepSecurity.getPwdAgeing.callCount).to.equal(2);
                expect(functionStub.enable.callCount).to.equal(1);

                expect(stepSecurity.getWizard.callCount).to.equal(5);
                expect(getWizardStub.resetRemainingSteps.callCount).to.equal(1);
                expect(stepSecurity.revalidate.callCount).to.equal(1);

                var undefValue;
                output.call(stepSecurity,modelStub,undefValue);
                expect(functionStub.disable.callCount).to.equal(1);
            });

            it('Should add activate event handler to stepSecurity', function() {
                expect(stepSecurity.addEventHandler.callCount).to.equal(2);
                expect(stepSecurity.addEventHandler.getCall(0).args[0]).to.equal('activate');
                expect(stepSecurity.addEventHandler.getCall(1).args[0]).to.equal('revalidate');
            });

            it('When stepSecurity has activated, should add labels to wizard', function() {
                var output = stepSecurity.addEventHandler.getCall(0).args[1];
                var value;
                output.call(stepSecurity,modelStub,value);
                expect(stepSecurity.getWizard.callCount).to.equal(1);
                expect(getWizardStub.setLabels.callCount).to.equal(1);
            });

            it('When stepSecurity has activated and model get finish status on false, should shows buttons', function() {
                var output = stepSecurity.addEventHandler.getCall(0).args[1];
                var value;
                output.call(stepSecurity,modelStub,value);
                expect(stepSecurity.showButtons.callCount).to.equal(1);
            });

            it('When stepSecurity has activated and model get finish status on true, should set steps to wizard', function() {
                model['finish'] = true;
                var output = stepSecurity.addEventHandler.getCall(0).args[1];
                var value;
                output.call(stepSecurity,modelStub,value);
                expect(getWizardStub.setStep.callCount).to.equal(1);
                expect(getWizardStub.setStep.getCall(0).args[0]).to.equal(4);
            });

            it('Should add click event handler to update authMode', function() {
                expect(stepSecurity.getAuthModeCheckBox.callCount).to.equal(1);
                expect(elementStub.addEventHandler.callCount).to.equal(2);
                expect(elementStub.addEventHandler.getCall(0).args[0]).to.equal('click');
            });

            it('Should add change event handler to update passwordAgeing', function() {
                expect(viewStub.findById.callCount).to.equal(1);
                expect(viewStub.findById.getCall(0).args[0]).to.equal('passwordAgeing');
                expect(functionStub.addEventHandler.callCount).to.equal(1);
                expect(functionStub.addEventHandler.getCall(0).args[0]).to.equal('change');
            });

            it('Should add change event handler to update statusCheckBox and passwordAgeingCheckBox', function() {
                expect(stepSecurity.getPwdAgeingCheckBox.callCount).to.equal(1);
                expect(elementStub.addEventHandler.callCount).to.equal(2);
                expect(elementStub.addEventHandler.getCall(1).args[0]).to.equal('change');
            });
        });

        describe('isValid()', function() {
            it('Should return value of pwdAgeing checkbox', function() {
                sandbox.stub(stepSecurity,'getPwdAgeingCheckBoxValue');
                var output = stepSecurity.isValid();
                expect(output).not.to.be.null;
            });
        });

        describe('getPwdAgeingCheckBoxValue()', function() {
            it('Should return checked property form passwordAgeingCheckBox', function() {
                sandbox.stub(stepSecurity,'getPwdAgeingCheckBox', function() {return elementStub;});
                var output = stepSecurity.getPwdAgeingCheckBoxValue();
                expect(output).not.to.be.null;
                expect(stepSecurity.getPwdAgeingCheckBox.callCount).to.equal(1);
                expect(elementStub.getProperty.callCount).to.equal(1);
                expect(elementStub.getProperty.getCall(0).args[0]).to.equal('checked');
            });
        });
        describe('getPwdAgeingValue()', function() {
            it('Should return value of passwordAgeing', function() {
                sandbox.spy(stepSecurity,'getPwdAgeing', function(){return functionStub;});
                var output = stepSecurity.getPwdAgeingValue();
                expect(output).not.to.be.null;
                expect(stepSecurity.getPwdAgeing.callCount).to.equal(1);
                expect(functionStub.getValue.callCount).to.equal(1);
            });
        });

        describe('getPwdAgeing()', function() {
            it('Should find and return passwordAgeing element', function() {
                var output = stepSecurity.getPwdAgeing();
                expect(output).not.to.be.null;
                expect(viewStub.findById.callCount).to.equal(1);
                expect(viewStub.findById.getCall(0).args[0]).to.equal('passwordAgeing');
            });
        });

        describe('getPwdAgeingCheckBox()', function() {
            it('Should find and return passwordAgeing from stepSecurity', function() {
                var output = stepSecurity.getPwdAgeingCheckBox();
                expect(output).not.to.be.null;
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(elementStub.find.callCount).to.equal(1);
            });
        });

        describe('setAuthModeLocal()', function() {
            it('Should return checked property form authModeCheckBox', function() {
                sandbox.stub(stepSecurity,'getPwdAgeingCheckBox', function() {return elementStub;});
                var output = stepSecurity.getPwdAgeingCheckBoxValue();
                expect(output).not.to.be.null;
                expect(stepSecurity.getPwdAgeingCheckBox.callCount).to.equal(1);
                expect(elementStub.getProperty.callCount).to.equal(1);
                expect(elementStub.getProperty.getCall(0).args[0]).to.equal('checked');
            });
        });
        
        describe('setAuthModeRemote()', function() {
            it('Should return checked property form passwordAgeingCheckBox', function() {
                sandbox.stub(stepSecurity,'getPwdAgeingCheckBox', function() {return elementStub;});
                var output = stepSecurity.getPwdAgeingCheckBoxValue();
                expect(output).not.to.be.null;
                expect(stepSecurity.getPwdAgeingCheckBox.callCount).to.equal(1);
                expect(elementStub.getProperty.callCount).to.equal(1);
                expect(elementStub.getProperty.getCall(0).args[0]).to.equal('checked');
            });
        });

        describe('getAuthModeCheckBoxValue()', function() {
            it('Should return checked property form authModeCheckBox', function() {
                sandbox.stub(stepSecurity,'getAuthModeCheckBox', function() {return elementStub;});
                var output = stepSecurity.getAuthModeCheckBoxValue();
                expect(output).not.to.be.null;
                expect(stepSecurity.getAuthModeCheckBox.callCount).to.equal(1);
                expect(elementStub.getProperty.callCount).to.equal(1);
                expect(elementStub.getProperty.getCall(0).args[0]).to.equal('checked');
            });
        });

        describe('getAuthMode()', function() {
            it('Should find and return authMode element', function() {
                var output = stepSecurity.getAuthMode();
                expect(output).not.to.be.null;
                expect(viewStub.findById.callCount).to.equal(1);
                expect(viewStub.findById.getCall(0).args[0]).to.equal('dropdownAuthMode');
            });
        });

        describe('getAuthModeCheckBox()', function() {
            it('Should find and return authMode from stepSecurity', function() {
                var output = stepSecurity.getAuthModeCheckBox();
                expect(output).not.to.be.null;
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(elementStub.find.callCount).to.equal(1);
            });
        });

    });
});
