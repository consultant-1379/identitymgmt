define([
    'jscore/core',
    'identitymgmtlib/widgets/InputWidget/InputWidget',
    'jscore/ext/privateStore'
], function(core,InputWidget, PrivateStore){
    'use strict';

    describe('InputWidget', function(){
        var sandbox, inputWidget, viewStub, getElementStub, inputEl;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            inputEl = new core.Element('input');
            getElementStub = {
                find: function(){return inputEl;}

            };
            viewStub = {
                getElement: function(){return getElementStub;}
            };
            inputWidget = new InputWidget();
            inputWidget.view = viewStub;

        });
        afterEach(function(){
            sandbox.restore();
        });

        it('InputWidget should be defined', function(){
            expect(InputWidget).not.to.be.undefined;
        });

        describe('init()', function(){
            it('Should set default type', function(){
                var options;
                inputWidget.init(options);

                expect(inputWidget.options.type).to.equal('text');
            });
        });

        describe('onViewReady()', function(){
            beforeEach(function(){
                sandbox.spy(getElementStub,'find');
                sandbox.spy(viewStub,'getElement');
                sandbox.spy(inputEl,'addEventHandler');
                sandbox.stub(inputEl,'setModifier');
                sandbox.stub(inputEl,'removeModifier');
                sandbox.stub(inputWidget,'trigger');
            });

            it('Should add event on input', function(){

                inputWidget.onViewReady();

                expect(viewStub.getElement.callCount).to.equal(2);
                expect(getElementStub.find.callCount).to.equal(2);
                expect(getElementStub.find.getCall(0).args[0]).to.equal('.eaIdentitymgmtlib-wInputWidget-input');
                expect(inputEl.addEventHandler.callCount).to.equal(2);

                var callback = inputEl.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;
                callback.call(inputWidget);

                expect(inputWidget.trigger.callCount).to.equal(1);
                expect(inputWidget.trigger.getCall(0).args[0]).to.equal('change');
                expect(inputWidget.trigger.getCall(0).args[2]).to.be.function;
            });
        });

        describe('getValue()', function(){
            it('Should get value from input', function(){
                var output = inputWidget.getValue();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });


    });
});