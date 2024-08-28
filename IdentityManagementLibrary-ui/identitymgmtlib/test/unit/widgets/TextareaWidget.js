define([
    'jscore/core',
    'identitymgmtlib/widgets/TextareaWidget/TextareaWidget',
    'jscore/ext/privateStore'
], function(core,TextareaWidget, PrivateStore){
    'use strict';

    describe('TextareaWidget', function(){
        var sandbox, textareaWidget, viewStub, getElementStub, textareaEl;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            textareaEl = new core.Element('textarea');
            getElementStub = {
                find: function(){return textareaEl;}
            };
            viewStub = {
                getElement: function(){return getElementStub;}
            };
            textareaWidget = new TextareaWidget();
            textareaWidget.view = viewStub;

        });
        afterEach(function(){
            sandbox.restore();
        });

        it('TextareaWidget should be defined', function(){
            expect(TextareaWidget).not.to.be.undefined;
        });

        describe('init()', function(){
            it('Should set default type', function(){
                var options;
                textareaWidget.init(options);

                expect(textareaWidget.options.info).to.equal(false);
                expect(textareaWidget.options.subclass).to.equal(null);
                expect(textareaWidget.options.maxlength).to.equal(255);
            });
        });

        describe('onViewReady()', function(){
            beforeEach(function(){
                sandbox.spy(getElementStub,'find');
                sandbox.spy(viewStub,'getElement');
                sandbox.spy(textareaEl,'addEventHandler');
                sandbox.stub(textareaWidget,'trigger');
            });

            it('Should add event on input', function(){

                textareaWidget.onViewReady();

                expect(viewStub.getElement.callCount).to.equal(1);
                expect(getElementStub.find.callCount).to.equal(1);
                expect(getElementStub.find.getCall(0).args[0]).to.equal('.eaIdentitymgmtlib-wTextareaWidget-textarea');
                expect(textareaEl.addEventHandler.callCount).to.equal(1);

                var callback = textareaEl.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;
                callback.call(textareaWidget);

                expect(textareaWidget.trigger.callCount).to.equal(1);
                expect(textareaWidget.trigger.getCall(0).args[0]).to.equal('change');
                expect(textareaWidget.trigger.getCall(0).args[2]).to.be.function;
            });
        });

        describe('getValue()', function(){
            it('Should get value from textarea', function(){
                var output = textareaWidget.getValue();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });


    });
});