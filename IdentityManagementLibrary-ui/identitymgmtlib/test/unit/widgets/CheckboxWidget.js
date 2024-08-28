define([
    'jscore/core',
    'identitymgmtlib/widgets/CheckboxWidget/CheckboxWidget'
], function(core, CheckboxWidget){
    'use strict';

    describe('CheckboxWidget', function(){

        var sandbox, checkboxWidget, options, inputEl, viewStub;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            inputEl = new core.Element('input');
            options = {
                onLabel: true,
                offLabel: false
            };
            viewStub = {
                findById: function(){
                    return inputEl;
                },
                init: function(){
                   return options;
                }
            };
            sandbox.spy(viewStub,'init');
            sandbox.spy(viewStub,'findById');
            sandbox.spy(inputEl,'addEventHandler');
            checkboxWidget = new CheckboxWidget(options);
            checkboxWidget.view = viewStub;
        });

        afterEach(function(){
            sandbox.restore();
        });

        it('CheckboxWidget should be defined', function(){
            expect(CheckboxWidget).not.to.be.undefined;
        });


        describe('init()', function(){
            var options;
            it('Should initialize onValue and offValue default value', function(){
                options = {
                    onValue: null,
                    offValue: null
                };

                checkboxWidget.init(options);

                expect(checkboxWidget.onValue).to.equal(true);
                expect(checkboxWidget.offValue).to.equal(false);
            });

        });

        describe('onViewReady()', function(){
            var callback;

            it('Should add event handler on change', function(){
                sandbox.spy(checkboxWidget,'trigger');
                checkboxWidget.onViewReady();

                expect(viewStub.findById.calledOnce).to.equal(true);
                expect(viewStub.findById.getCall(0).args[0]).to.equal('switcher');

                expect(inputEl.addEventHandler.calledOnce).to.equal(true);

                callback = inputEl.addEventHandler.getCall(0).args[1];

                expect(callback).to.be.function;

                callback.call(checkboxWidget);

                expect(checkboxWidget.trigger.calledOnce).to.equal(true);

            });
        });

    });



});