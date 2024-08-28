define([
    'jscore/core',
    'usermgmtlib/cells/CheckboxCell',
    'identitymgmtlib/mvp/binding'
], function(core, CheckboxCell, binding){
    'use strict';

    describe('CheckboxCell', function(){
        var sandbox, checkboxCell, viewStub, getElementStub, elementStub;

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

            checkboxCell = new CheckboxCell();

            checkboxCell.view = viewStub;
            sandbox.stub(binding,'bind');
            sandbox.spy(viewStub,'getElement');
            sandbox.spy(getElementStub,'find');
            sandbox.spy(elementStub,'addEventHandler');
            sandbox.stub(elementStub,'setProperty');

        });
        afterEach(function(){
            sandbox.restore();
        });

        it('CheckboxCell should be defined', function(){
            expect(CheckboxCell).not.to.be.undefined;
        });

        describe('setValue()', function(){
            var model, modelStub;
            it('Should update checkbox when when we try to assign role and model has changed to assigned', function(){
                model ={
                    'name': 'MockName',
                    'assigned':true,
                    'action' : 'assign'
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


                checkboxCell.setValue(modelStub);
                expect(viewStub.getElement.callCount).to.equal(3);
                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.setProperty.callCount).to.equal(1);
                expect(elementStub.setProperty.getCall(0).args[0]).to.equal("checked");
                expect(elementStub.setProperty.getCall(0).args[1]).to.equal("checked");

            });
            it('Should update checkbox when we try to assign role and model has changed to unassigned', function(){
                model ={
                    'name': 'MockName',
                    'assigned':false,
                    'action' : 'assign'
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



                checkboxCell.setValue(modelStub);
                expect(viewStub.getElement.callCount).to.equal(3);
                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.setProperty.callCount).to.equal(1);
                expect(elementStub.setProperty.getCall(0).args[0]).to.equal("checked");
                expect(elementStub.setProperty.getCall(0).args[1]).to.equal("");

            });
            it('Should update checkbox when when we try to unassign role and model has changed to assigned', function(){
                model ={
                    'name': 'MockName',
                    'assigned':true,
                    'action' : 'unassign'
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


                checkboxCell.setValue(modelStub);
                expect(viewStub.getElement.callCount).to.equal(3);
                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.setProperty.callCount).to.equal(1);
                expect(elementStub.setProperty.getCall(0).args[0]).to.equal("checked");
                expect(elementStub.setProperty.getCall(0).args[1]).to.equal("");

            });
            it('Should update checkbox when we try to unassign role and model has changed to unassigned', function(){
                model ={
                    'name': 'MockName',
                    'assigned':false,
                    'action' : 'unassign'
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



                checkboxCell.setValue(modelStub);
                expect(viewStub.getElement.callCount).to.equal(3);
                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.setProperty.callCount).to.equal(1);
                expect(elementStub.setProperty.getCall(0).args[0]).to.equal("checked");
                expect(elementStub.setProperty.getCall(0).args[1]).to.equal("checked");

            });

            it('Should handel click even on checkbox element', function(){
                model ={
                    'name': 'MockName',
                    'assigned':true,
                    'action': 'assign'
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


                checkboxCell.setValue(modelStub);

                expect(viewStub.getElement.callCount).to.equal(3);
                expect(elementStub.addEventHandler.callCount).to.equal(1);
                var callback = elementStub.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;

                callback.call(checkboxCell);
                expect(modelStub.setAttribute.callCount).to.equal(1);
                expect(modelStub.setAttribute.getCall(0).args[0]).to.equal('assigned');
                expect(modelStub.getAttribute.callCount).to.equal(1);
                expect(modelStub.setTouched.callCount).to.equal(1);
                expect(modelStub.setTouched.getCall(0).args[0]).to.equal('assigned');
            });
        });
        describe('setTooltip()', function() {
            var removeAttributeStub;
            it('Should removed attribute title from element', function() {
                removeAttributeStub= {
                    removeAttribute: function(){}
                };
                sandbox.spy(removeAttributeStub,'removeAttribute');
                sandbox.stub(checkboxCell,'getElement', function(){return removeAttributeStub;});
                checkboxCell.setTooltip();

                expect(checkboxCell.getElement.callCount).to.equal(1);
                expect(removeAttributeStub.removeAttribute.callCount).to.equal(1);
                expect(removeAttributeStub.removeAttribute.getCall(0).args[0]).to.equal('title');

            });
        });
    });
});