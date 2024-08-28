define([
    'jscore/core',
    'identitymgmtlib/widgets/list-builder/list-tree/ListTree'
], function(core, ListTree){
    'use strict';

    describe('ListTree', function(){
        var sandbox, listTree, options, elementStub, viewStub;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            options = {
                labels:{},
                setTotalRootItems:{}
            };
            viewStub={
                findById: function(){return elementStub;}
            };
            elementStub = new core.Element();

            listTree = new ListTree(options);
            console.log(listTree);
            sandbox.spy(listTree,'setTotalRootItems');
            //sandbox.spy(listTree,'setListTitle');
            sandbox.spy(listTree,'getElement', function(){return elementStub;});
            sandbox.spy(elementStub,'setModifier');
            sandbox.spy(elementStub,'setAttribute');
            sandbox.spy(elementStub,'removeAttribute');
            sandbox.spy(elementStub,'removeModifier');
            sandbox.spy(viewStub,'findById');
            listTree.view = viewStub;
        });
        afterEach(function(){
            sandbox.restore();
        });
        it('ListTree should be defined', function(){
            expect(ListTree).not.to.be.undefined;
            expect(ListTree).not.to.be.null;
        });

        describe('onViewReady()', function(){
            it('Should initialize view', function(){
                listTree.onViewReady();
                expect(listTree.setTotalRootItems.calledOnce).to.equal(true);
                //expect(listTree.setListTitle.calledOnce).to.equal(true);
            });
        });

        describe.skip('setEnabled()', function(){
            var isEnabled;
            it('Should set disabled modifier and attribute', function(){
                isEnabled = false;
                listTree.setEnabled(isEnabled);

                //expect(elementStub.setModifier.callCount).to.equal(1);
                expect(elementStub.setAttribute.callCount).to.equal(1);
               expect(viewStub.findById.callCount).to.equal(1);
            });
            it.skip('Should remove disabled modifier and attribute', function(){
                isEnabled = true;
                listTree.setEnabled(isEnabled);

               // expect(elementStub.removeModifier.callCount).to.equal(1);
                expect(elementStub.removeAttribute.callCount).to.equal(1);
                expect(viewStub.findById.callCount).to.equal(1);
            });
        });


    });
});