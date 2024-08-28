define([
    'jscore/core',
    'usersgroupedit/widgets/GroupEditWizard/stepApply/StepApply'
], function(core, StepApply) {
    "use strict";

    describe("StepApply", function() {
        var sandbox, stepApply, model, modelStub, elementStub,functionStub, getWizardStub;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            model = {
                usersToUpdate: {

                },
                finish:false
            };

            modelStub = {
                get: function(name){ return model.get(name);},
                setAttribute: function(){}
            }
            elementStub = new core.Element('div');

            functionStub = {
                find: function(){return elementStub;},
                setAttribute: function() {}
            };
            getWizardStub = {
                getElement: function() {return functionStub;},
                addEventHandler: function() {}
            }

            sandbox.stub(modelStub,'get');
            sandbox.spy(modelStub,'setAttribute');

            sandbox.spy(functionStub,'find');

            sandbox.stub(elementStub,'setText');
            sandbox.stub(elementStub,'setAttribute');

            sandbox.spy(getWizardStub,'getElement');
            sandbox.spy(getWizardStub,'addEventHandler');

            stepApply = new StepApply(modelStub);

            sandbox.stub(stepApply,'getElement', function(){return functionStub;});
            sandbox.stub(stepApply,'getWizard', function(){return getWizardStub;});

        });

        afterEach(function() {
            sandbox.restore();
        });

        it("StepApply should be defined", function(){
            expect(StepApply).not.to.be.undefined;
            expect(StepApply).not.to.be.null;
        });

        describe('updateProgressBarValue()', function() {

            it('Should calculate progressBar value', function() {
                sandbox.spy(stepApply.progressBar,'setValue');
                stepApply.updateProgressBarValue();
                expect(stepApply.progressBar.setValue.callCount).to.equal(1);
            });
        });


        describe('onViewReady()', function() {
            it('Should add activate event handler on StepApply', function() {
                sandbox.spy(stepApply,'addEventHandler');
                stepApply.onViewReady();
                expect(stepApply.addEventHandler.callCount).to.equal(1);
                expect(stepApply.addEventHandler.getCall(0).args[0]).to.equal('activate');
                var output = stepApply.addEventHandler.getCall(0).args[1];
                output.call(stepApply);

               expect(getWizardStub.addEventHandler.callCount).to.equal(1);
               expect(getWizardStub.addEventHandler.getCall(0).args[0]).to.equal('pauseStep');
            });
        });

        describe('isValid()', function() {
            it('Should value of valid', function() {
                stepApply.valid = true;
                var output = stepApply.isValid();
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
                expect(output).to.equal(true);
            });
        });

        describe('showButtons()', function() {
            it('Should set proper style to elements from wizard', function() {
                stepApply.showButtons();
                expect(stepApply.getWizard.callCount).to.equal(2);
                expect(getWizardStub.getElement.callCount).to.equal(2);
                expect(functionStub.find.callCount).to.equal(2);
                expect(elementStub.setAttribute.callCount).to.equal(2);
                expect(elementStub.setAttribute.getCall(0).args[0]).to.equal('style');
                expect(elementStub.setAttribute.getCall(1).args[0]).to.equal('style');
                expect(elementStub.setAttribute.getCall(0).args[1]).to.equal('display:none');
                expect(elementStub.setAttribute.getCall(1).args[1]).to.equal('display:none');
            });
        });


    });

});