define([
    'jscore/core',
    'identitymgmtlib/filters/SearchCell/SearchCell'
], function(core, SearchCell) {
    'use strict';

    describe('SearchCell', function() {
        var sandbox, searchCell, elementStub, getElementStub, triggerStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');

            getElementStub = {
                find: function(){
                    return elementStub;
                }
            };
            triggerStub = {
                trigger: function(){}
            };
            sandbox.spy(elementStub,'setAttribute');
            sandbox.spy(elementStub,'addEventHandler');
            sandbox.spy(elementStub,'getValue');
            sandbox.spy(getElementStub,'find');
            sandbox.spy(triggerStub,'trigger');

            searchCell = new SearchCell();

            sandbox.stub(searchCell,'getElement', function() {
                return getElementStub;
            });

            sandbox.stub(searchCell,'getTable', function() {
                return triggerStub;
            });


        });

        afterEach(function() {
            sandbox.restore();
        });

        it('SearchCell should be defined', function() {
            expect(SearchCell).not.to.be.undefined;
            expect(SearchCell).not.to.be.null;
        });

        describe('onViewReady()', function() {
            it('Should set attribute on element in view', function() {
                searchCell.onViewReady();
                expect(searchCell.getElement.callCount).to.equal(1);
                expect(getElementStub.find.callCount).to.equal(1);
                expect(elementStub.setAttribute.callCount).to.equal(1);
                expect(elementStub.setAttribute.getCall(0).args[0]).to.equal('placeholder');

            });
        });

        describe('setValue()', function() {
            it('Should add event handler on input field', function() {
                searchCell.setValue();
                expect(searchCell.getElement.callCount).to.equal(1);
                expect(getElementStub.find.callCount).to.equal(1);
                expect(elementStub.addEventHandler.callCount).to.equal(1);
                expect(elementStub.addEventHandler.getCall(0).args[0]).to.equal('input');

            });

            it('Should search value in table', function() {
                searchCell.setValue();
                var result = elementStub.addEventHandler.getCall(0).args[1];
                expect(result).to.be.function;

                result.call(searchCell,"MockValue");

                expect(searchCell.getTable.callCount).to.equal(1);
                expect(triggerStub.trigger.callCount).to.equal(1);
                expect(triggerStub.trigger.getCall(0).args[0]).to.equal('search');
                expect(elementStub.getValue.callCount).to.equal(1);
            });
        });


    });
});