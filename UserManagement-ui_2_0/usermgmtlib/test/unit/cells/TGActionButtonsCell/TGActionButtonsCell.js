define([
    'usermgmtlib/cells/TGActionButtonsCell/TGActionButtonsCell',
    'widgets/Button',
    'usermgmtlib/widgets/AssignTGFlyout/AssignTGFlyout',
    'widgets/InfoPopup'
], function(TGActionButtonsCell, Button, assignTargetGroupPanel, InfoPopup){
    'use strict';

    describe("TGActionButtonsCell", function(){
        var sandbox, TGactionButtonsCell, viewStub, getElementStub, buttonWidgetSpy;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();

            getElementStub={
                setAttribute: function(){},
                find: function(){}
            };
            viewStub = {
                getElement: function(){return getElementStub;},
                find: function(){return {};}
            };

            buttonWidgetSpy = sandbox.spy(Button.prototype, 'init');
            infoPopupWidgetSpy = sandbox.spy(InfoPopup.prototype, 'init');

            sandbox.spy(getElementStub,'setAttribute');
            sandbox.spy(getElementStub,'find');
            sandbox.spy(viewStub,'getElement');
            sandbox.spy(viewStub,'find');

            TGactionButtonsCell = new TGactionButtonsCell();
            TGactionButtonsCell.view = viewStub;

            TGactionButtonsCell.buttonWidget = Button.prototype;
            sandbox.stub(TGactionButtonsCell.buttonWidget,'disable');
            sandbox.stub(TGactionButtonsCell.buttonWidget,'enable');
            sandbox.spy(TGactionButtonsCell.buttonWidget,'addEventHandler');
            sandbox.spy(TGactionButtonsCell.buttonWidget,'attachTo');

            sandbox.spy(assignTargetGroupPanel, 'setEventBus');
            sandbox.spy(assignTargetGroupPanel, 'setModel');



        });
        afterEach(function(){
            sandbox.restore();
        });

        it("TGactionButtonsCell should be defined", function(){
            expect(TGactionButtonsCell).not.to.be.undefined;
            expect(TGactionButtonsCell).not.to.be.null;
        });

        describe('setValue()', function(){
            var model, modelStub, output;
            beforeEach(function(){
                model = {
                    'name': 'MockName',
                    'type': 'application',
                    'assigned': true

                };
                modelStub = {
                    get: function(str){return model[str];},
                    addEventHandler: function(){}
                };
                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'addEventHandler');
                sandbox.spy(TGactionButtonsCell,'setCorrectState');
                sandbox.spy(TGactionButtonsCell,'setViewElementAssignedTgs');

            });

            it('should set attribute', function(){

                TGactionButtonsCell.setValue(modelStub);
                expect(getElementStub.setAttribute.calledOnce).to.equal(true);

            });

            it('When type is application and role assigned should be visible Service Target Groups label and infoPopup ', function(){
                model = {
                    'name': 'MockName',
                    'type': 'application',
                    'assigned': true

                };
                TGactionButtonsCell.setValue(modelStub);
                expect(buttonWidgetSpy.callCount).to.equal(0);
                expect(infoPopupWidgetSpy.callCount).to.equal(1);

                expect(getElementStub.setAttribute.calledOnce).to.equal(true);
                expect(modelStub.addEventHandler.getCall(0).args[0]).to.equal('change:assigned');
                output = modelStub.addEventHandler.getCall(0).args[1];
                expect(modelStub.addEventHandler.getCall(0).args[0]).to.equal('change:tgs');
                output = modelStub.addEventHandler.getCall(0).args[1];

                expect(output).to.be.function;

                expect(TGactionButtonsCell.setViewElementAssignedTgs.callCount).to.equal(1);

            });

            it('When type is com or comalias should initialize buttonWidget ', function(){
                model = {
                    'name': 'MockName',
                    'type': 'com',
                    'assigned': true

                };
                TGactionButtonsCell.setValue(modelStub);
                expect(buttonWidgetSpy.callCount).to.equal(1);
                expect(getElementStub.setAttribute.calledOnce).to.equal(true);
                expect(modelStub.addEventHandler.callCount).to.equal(1);
                expect(modelStub.addEventHandler.getCall(0).args[0]).to.equal('change:assigned');
                output = modelStub.addEventHandler.getCall(0).args[1];

                expect(output).to.be.function;

                expect(TGactionButtonsCell.setCorrectState.callCount).to.equal(1);

            });

            it('Should add event handler to click event on buttonWidget', function(){

                model = {
                    'name': 'MockName',
                    'type': 'com',
                    'assigned': true

                };
                TGactionButtonsCell.setValue(modelStub);
                expect(TGactionButtonsCell.buttonWidget.addEventHandler.getCall(0).args[0]).to.equal('click');

                output = TGactionButtonsCell.buttonWidget.addEventHandler.getCall(0).args[1];
                expect(output).to.be.function;

            });
        });

        describe('setCorrectState()', function(){
            var modelStub, model;
            beforeEach(function(){
                model = {
                    'name': 'MockName',
                    'type': 'application',
                    'assigned': false
                };
                modelStub = {
                    get: function(str){return model[str];},
                    addEventHandler: function(){}
                };

                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'addEventHandler');

            });

            it('should set disable button ', function(){

                TGactionButtonsCell.setCorrectState(modelStub);
                expect(TGactionButtonsCell.buttonWidget.disable.calledOnce).to.equal(true);

            });
            it('should set enable button ', function(){
                model = {
                    'name': 'MockName',
                    'type': 'application',
                    'assigned': true
                };
                TGactionButtonsCell.setCorrectState(modelStub);
                expect(TGactionButtonsCell.buttonWidget.enable.calledOnce).to.equal(true);
            });
        });
    });
});