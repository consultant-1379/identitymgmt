define([
    'jscore/core',
    'identitymgmtlib/widgets/RadioButtonWidget/RadioButtonWidget'
], function(core, RadioButtonWidget) {
    'use strict';

    describe('RadioButtonWidget', function() {

        var sandbox, radiobuttonWidget, options, inputEl1, inputEl2, inputElms, viewStub, getElementStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            inputEl1 = new core.Element('input');
            inputEl2 = new core.Element('input');
            inputElms = [inputEl1, inputEl2];
            options = {};
            getElementStub = {
                findAll: function() {
                    return inputElms;
                }
            };
            viewStub = {
                findById: function() {
                    return inputElms;
                },
                init: function() {
                    return options;
                },
                getElement: function(){
                    return getElementStub;
                }
            };
            sandbox.spy(viewStub,'init');
            sandbox.spy(viewStub,'findById');
            sandbox.spy(inputElms[0],'addEventHandler');
            sandbox.spy(inputElms[1],'addEventHandler');
            radiobuttonWidget = new RadioButtonWidget(options);
            radiobuttonWidget.view = viewStub;

        });

        afterEach(function() {
            sandbox.restore();
        });

        it('RadioButtonWidget should be defined', function(){
            expect(RadioButtonWidget).not.to.be.undefined;
        });

        describe ('init()', function() {
            var options;
            it('Should initialize type options for radiobuttonwidget', function(){
                options = {};
                radiobuttonWidget.init(options);
                expect(radiobuttonWidget.options.type).to.equal('radio');
            });
        });


         describe ('onViewReady()', function() {
             beforeEach(function(){
                 sandbox.spy(getElementStub,'findAll');
                 sandbox.spy(viewStub,'getElement');
                 sandbox.stub(radiobuttonWidget,'trigger');
             });

             it('Should add and trigger event on click', function() {
                 radiobuttonWidget.onViewReady();
                 expect(viewStub.getElement.callCount).to.equal(1);
                 expect(getElementStub.findAll.callCount).to.equal(1);
                 expect(getElementStub.findAll.getCall(0).args[0]).to.equal('.eaIdentitymgmtlib-wRadioButtonWidget-input');
                 expect(inputElms[0].addEventHandler.callCount).to.equal(1);
                 expect(inputElms[1].addEventHandler.callCount).to.equal(1);

                 var callback1 = inputElms[0].addEventHandler.getCall(0).args[1];
                 expect(callback1).to.be.function;
                 callback1.call(radiobuttonWidget);

                 var callback2 = inputElms[1].addEventHandler.getCall(0).args[1];
                 expect(callback2).to.be.function;
                 callback2.call(radiobuttonWidget);

                 expect(radiobuttonWidget.trigger.callCount).to.equal(2);
                 expect(radiobuttonWidget.trigger.getCall(0).args[0]).to.equal('change');
                 expect(radiobuttonWidget.trigger.getCall(0).args[2]).to.be.function;

             });

         });

         describe ('getValue()', function() {
             it('Should get boolean value', function() {
                 var output = radiobuttonWidget.getValue();

                 expect(output).to.be.undefined;
                 expect(output).not.to.be.null;
             });
         });
    });
});
