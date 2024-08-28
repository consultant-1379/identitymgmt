define([
    'jscore/core',
    'identitymgmtlib/widgets/list-builder/menu/item/Item'
], function(core, Item){
    'use strict';

    describe('Item', function(){
        var sandbox, item, elementStub, viewStub;
        beforeEach(function(){

            sandbox = sinon.sandbox.create();
            elementStub = new core.Element();
            viewStub = {
                findById: function(){return elementStub;}
            };
            sandbox.spy(viewStub,'findById', function(){return elementStub;});

            item = new Item();
            item.view = viewStub;

            sandbox.stub(item,'getElement', function(){return elementStub;});
            sandbox.stub(elementStub,'setModifier');
            sandbox.stub(elementStub,'removeModifier');
            sandbox.spy(elementStub,'addEventHandler');
        });
        afterEach(function(){
            sandbox.restore();
        });
        it('Item should be defined', function(){
            expect(Item).not.to.be.undefined;
            expect(Item).not.to.be.null;
        });

        describe('onViewReady()', function(){
            it('Should handler event on click button', function(){
                item.onViewReady();
                expect(item.getElement.callCount).to.equal(1);
                expect(elementStub.addEventHandler.callCount).to.equal(1);
                expect(elementStub.addEventHandler.getCall(0).args[0]).to.equal('click');
            });
        });

        describe('enable()', function(){
            var status;
            it('should set disabled modifier on button and icon', function(){
                status = false;
                item.enable(status);

                expect(elementStub.setModifier.callCount).to.equal(2);

            });

            it('should remove disabled modifier on button and icon', function(){
                status = true;
                item.enable(status);

                expect(elementStub.removeModifier.callCount).to.equal(2);
            });
        });

    });
});