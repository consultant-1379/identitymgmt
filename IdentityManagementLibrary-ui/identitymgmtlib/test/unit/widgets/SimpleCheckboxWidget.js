define([
    'jscore/core',
    'identitymgmtlib/widgets/SimpleCheckboxWidget/SimpleCheckboxWidget'
], function(core, SimpleCheckboxWidget){
    'use strict';

    describe('SimpleCheckboxWidget', function(){
        var sandbox, simplecheckboxWidget, options, inputEl, viewStub, getElementStub;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            inputEl = new core.Element('input');
            options = {};
            getElementStub = {
                find: function(){return inputEl;}
            };
            viewStub = {
                findById: function(){
                    return inputEl;
                },
                init: function(){
                    return options;
                },
                getElement: function(){
                    return getElementStub;
                }
            };
            sandbox.spy(viewStub,'init');
            sandbox.spy(viewStub,'findById');
            sandbox.spy(inputEl,'addEventHandler');
            simplecheckboxWidget = new SimpleCheckboxWidget(options);
            simplecheckboxWidget.view = viewStub;
        });

        afterEach(function(){
            sandbox.restore();
        });

        it('SimpleCheckboxWidget should be defined', function(){
            expect(SimpleCheckboxWidget).not.to.be.undefined;
        });


        describe('init()', function() {
            var options;
            it('Should initialize type options for simplecheckboxwidget', function() {
                options = {};
                simplecheckboxWidget.init(options);
                expect(simplecheckboxWidget.options.type).to.equal('checkbox');
                expect(simplecheckboxWidget.options.subclass).to.equal(null);

            });
        });

         describe('onViewReady()', function() {
             beforeEach(function(){
                 sandbox.spy(getElementStub,'find');
                 sandbox.spy(viewStub,'getElement');
                 sandbox.stub(simplecheckboxWidget,'trigger');
             });

             it('Should add and trigger event on click', function() {
                 simplecheckboxWidget.onViewReady();
                 expect(viewStub.getElement.callCount).to.equal(1);
                 expect(getElementStub.find.callCount).to.equal(1);
                 expect(getElementStub.find.getCall(0).args[0]).to.equal('.eaIdentitymgmtlib-wSimpleCheckboxWidget-input');
                 expect(inputEl.addEventHandler.callCount).to.equal(1);

                 var callback = inputEl.addEventHandler.getCall(0).args[1];
                 expect(callback).to.be.function;
                 callback.call(simplecheckboxWidget);

                 expect(simplecheckboxWidget.trigger.callCount).to.equal(1);
                 expect(simplecheckboxWidget.trigger.getCall(0).args[0]).to.equal('change');
                 expect(simplecheckboxWidget.trigger.getCall(0).args[2]).to.be.function;

             });
         });

        describe('getValue()', function() {
            it('Should get boolean value', function() {
                var output = simplecheckboxWidget.getValue();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

        });
    });
});
