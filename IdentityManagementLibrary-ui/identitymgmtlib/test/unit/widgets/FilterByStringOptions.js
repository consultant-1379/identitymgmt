define([
    'jscore/core',
    'identitymgmtlib/FilterByStringOptions'
], function (core, FilterByStringOptions) {
    'use strict';

    describe('FilterByStringOptions', function () {

    	var sandbox, viewStub, filterOptions, mockSelectionItems;
        var setItemsSpy, triggerSpy, viewSetSelectedSpy,viewGetSelectedSpy;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            
            filterOptions = new FilterByStringOptions();
            viewStub = {
                getSelected: function() { return "mock" },
                setSelected: function() {}
            };

            filterOptions.view = viewStub;

            setItemsSpy = sandbox.spy(filterOptions, 'setItems');
            triggerSpy = sandbox.spy(filterOptions, 'trigger');
            viewSetSelectedSpy = sandbox.spy(viewStub, 'setSelected');
            viewGetSelectedSpy = sandbox.spy(viewStub, 'getSelected');

        });
        
        afterEach(function(){
            sandbox.restore();
        });

        describe('onControlReady()', function () {

            beforeEach(function(){
                filterOptions.onControlReady();
            });

            it('should initialise width', function () {
                expect(filterOptions.options.width).to.equal('auto');
            });

            it('should initialise selection options', function () {
                mockSelectionItems = [ { name: "=" }, { name: "!=" } ];
                expect(setItemsSpy.getCall(0).args[0]).to.deep.equal(mockSelectionItems);
            });

            it('should initialise default selection', function () {
                expect(viewSetSelectedSpy.calledOnce).to.equal(true);
                expect(viewSetSelectedSpy.getCall(0).args[0]).to.equal('=');
            });

        });        

        describe('onItemSelected()', function () {

            beforeEach(function() {
                filterOptions.onItemSelected({ name: "mockSelectedValueName" });
            });

            it('should set Selected item in view', function() {
                expect(viewSetSelectedSpy.calledOnce).to.equal(true);
                expect(viewSetSelectedSpy.getCall(0).args[0]).to.equal("mockSelectedValueName");
            });

            it('should trigge change event', function() {
                expect(triggerSpy.calledOnce).to.equal(true);
                expect(triggerSpy.getCall(0).args[0]).to.equal("change");
            });

        }); 

        describe('getValue()', function () {
            beforeEach(function() {
                filterOptions.getValue();
            });

            it('should get Selected item from view', function() {
                expect(viewGetSelectedSpy.calledOnce).to.equal(true);
            });
        });         
    })
})