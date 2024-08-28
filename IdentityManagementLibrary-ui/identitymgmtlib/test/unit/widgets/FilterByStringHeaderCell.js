define([
    'jscore/core',
    'identitymgmtlib/FilterByStringHeaderCell',
	'identitymgmtlib/FilterByStringOptions'
], function (core, FilterByStringHeaderCell, FilterByStringOptions) {
    'use strict';

    describe('FilterByStringHeaderCell', function() {

            var sandbox, filterHeaderCell, viewStub, sendFilterEventReference;
            var mockInputElement, mockDivElement;
            var inputAddEventHandlerSpy, divAddEventHandlerSpy, getInputSpy, getDivSpy;
            var divAttachToSpy, filteroptionsStub;

            beforeEach(function() {
                sandbox = sinon.sandbox.create();

                //We add stubs after creating object so automatic onViewReady() running
                //does not corrupt spies counters
	            filterHeaderCell = new FilterByStringHeaderCell({
	                column: {
	                    attribute: "mockColumnName"
	                },
	                index: 2,
	                table: undefined,
	                row: undefined
	            });

				mockInputElement = new core.Element("testInput");
				mockDivElement = new core.Element("testDiv");

	            viewStub = {
	                getInput: function() { return mockInputElement; },
	                getDiv: function() { return mockDivElement; }
	            };

	            filterHeaderCell.view = viewStub;

				getInputSpy = sandbox.spy(viewStub, 'getInput');
				getDivSpy = sandbox.spy(viewStub, 'getDiv');

				inputAddEventHandlerSpy = sandbox.spy(mockInputElement, 'addEventHandler');
            });

            afterEach(function() {
                sandbox.restore();
            });

            describe('onViewReady()', function() {

                beforeEach(function() {
					divAttachToSpy = sandbox.spy(FilterByStringOptions.prototype, 'attachTo');
	                divAddEventHandlerSpy = sandbox.spy(FilterByStringOptions.prototype, 'addEventHandler');
                });

                it('sholud initialise FilterByStringHeaderCell after create view', function() {

					filterHeaderCell.onViewReady();

                	expect(getInputSpy.calledOnce).to.equal(true);
                	expect(inputAddEventHandlerSpy.calledOnce).to.equal(true);
            		expect(inputAddEventHandlerSpy.getCall(0).args[0]).to.equal('input');
                	expect(getDivSpy.calledOnce).to.equal(true);

                	expect(divAttachToSpy.calledOnce).to.equal(true);
            		expect(divAddEventHandlerSpy.calledOnce).to.equal(true);
            	    expect(divAddEventHandlerSpy.getCall(0).args[0]).to.equal('change');

                });               

            });

            // describe('setValue()', function() {
            // });

			describe('sendFilterEvent()', function() {

            	var getInputValueSpy, getTableStub, getColumnDefinitionSpy, inputMock, sendFilterEventReference;
            	var getTriggerSpy, triggeredObjectMock;

			    beforeEach(function() {

			    	inputMock = {
			    		getValue: function () { return "mockInputValue"; }
			    	};

					getInputValueSpy = sandbox.spy(inputMock, 'getValue' );
					getColumnDefinitionSpy = sandbox.spy(filterHeaderCell, 'getColumnDefinition' );

   				    filterHeaderCell.onViewReady();
   				    filterHeaderCell.input = inputMock;

            		sendFilterEventReference = inputAddEventHandlerSpy.getCall(0).args[1];

            		triggeredObjectMock = { trigger: function() {} };

					getTableStub = sandbox.stub(filterHeaderCell, 'getTable', function() {
						return triggeredObjectMock;
					});
					
					getTriggerSpy = sandbox.spy(triggeredObjectMock, 'trigger' );

			    });

			    it('Attributes should be set with defaults', function() {
			    	sendFilterEventReference.call(filterHeaderCell);
                	expect(getColumnDefinitionSpy.calledOnce).to.equal(true);
                	expect(getInputValueSpy.calledOnce).to.equal(true);
                	expect(getTableStub.calledOnce).to.equal(true);
                	expect(getTriggerSpy.calledOnce).to.equal(true);
            	    expect(getTriggerSpy.getCall(0).args[0]).to.equal('filter');
            	    expect(getTriggerSpy.getCall(0).args[1]).to.equal('mockColumnName');
            	    expect(getTriggerSpy.getCall(0).args[2]).to.equal('mockInputValue');
            	    expect(getTriggerSpy.getCall(0).args[3]).to.equal('=');
			    });

			});
        
    });
});