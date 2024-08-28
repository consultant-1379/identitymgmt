define([
    'jscore/core',
    'usermgmtlib/cells/CheckboxIconCell/CheckboxIconCell',
    'identitymgmtlib/mvp/binding'
], function(core, CheckboxIconCell, binding){
    'use strict';

    describe('CheckboxIconCell', function(){
        var sandbox, checkboxIconCell, viewStub, getElementStub, elementStub;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');

            getElementStub = {
                find: function(){ return elementStub;},
                setAttribute:function(){}
            };

            viewStub = {
                getElement: function() { return getElementStub;}
            };

            checkboxIconCell = new CheckboxIconCell();

            checkboxIconCell.view = viewStub;
            sandbox.stub(binding,'bind');
            sandbox.spy(viewStub,'getElement');
            sandbox.spy(getElementStub,'find');
            sandbox.spy(elementStub,'addEventHandler');
            sandbox.stub(elementStub,'hasModifier', function(){return true;});
            sandbox.spy(elementStub,'removeModifier');
            sandbox.stub(elementStub,'setModifier');

        });
        afterEach(function(){
            sandbox.restore();
        });

        it('CheckboxIconCell should be defined', function(){
            expect(CheckboxIconCell).not.to.be.undefined;
        });

        describe('setValue()', function(){
            var model, modelStub;
            
             it('Should update icon handler with modifier tick', function(){
                model ={
                    'name': 'MockName',
                    'assigned':true
                };
                modelStub = {
                    get: function(str){return model[str];},
                    setAttribute: function(){},
                    getAttribute: function(){},
                    setTouched: function(){},
                    addEventHandler: function(){}
                };

                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'setAttribute');
                sandbox.spy(modelStub,'getAttribute');
                sandbox.spy(modelStub,'setTouched');
                sandbox.spy(modelStub,'addEventHandler');


                checkboxIconCell.setValue(modelStub);
                expect(viewStub.getElement.callCount).to.equal(3);
                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.hasModifier.callCount).to.equal(3);
                expect(elementStub.removeModifier.callCount).to.equal(3);
                expect(elementStub.setModifier.callCount).to.equal(1);
                expect(elementStub.setModifier.getCall(0).args[0]).to.equal('tick_green');

            });
            it('Should update icon handler with modifier tick_grey', function(){
                model ={
                    'name': 'MockName',
                    'assigned':false
                };
                modelStub = {
                    get: function(str){return model[str];},
                    setAttribute: function(){},
                    getAttribute: function(){},
                    setTouched: function(){},
                    addEventHandler: function(){}
                };

                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'setAttribute');
                sandbox.spy(modelStub,'getAttribute');
                sandbox.spy(modelStub,'setTouched');
                sandbox.spy(modelStub,'addEventHandler');


                checkboxIconCell.setValue(modelStub);

                expect(viewStub.getElement.callCount).to.equal(3);
                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.hasModifier.callCount).to.equal(3);
                expect(elementStub.removeModifier.callCount).to.equal(3);
                expect(elementStub.setModifier.callCount).to.equal(1);
                expect(elementStub.setModifier.getCall(0).args[0]).to.equal('tick_grey');

            });

            it('Should handel click even on icon element', function(){
                model ={
                    'name': 'MockName',
                    'assigned':true
                };
                modelStub = {
                    get: function(str){return model[str];},
                    setAttribute: function(){},
                    getAttribute: function(){},
                    setTouched: function(){},
                    addEventHandler: function(){}
                };

                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'setAttribute');
                sandbox.spy(modelStub,'getAttribute');
                sandbox.spy(modelStub,'setTouched');
                sandbox.spy(modelStub,'addEventHandler');


                checkboxIconCell.setValue(modelStub);

                expect(viewStub.getElement.callCount).to.equal(3);
                expect(elementStub.addEventHandler.callCount).to.equal(1);
                var callback = elementStub.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;

                callback.call(checkboxIconCell);
                expect(modelStub.setAttribute.callCount).to.equal(1);
                expect(modelStub.setTouched.callCount).to.equal(1);
                expect(modelStub.setTouched.getCall(0).args[0]).to.equal('assigned');
            });
        });
    });
});