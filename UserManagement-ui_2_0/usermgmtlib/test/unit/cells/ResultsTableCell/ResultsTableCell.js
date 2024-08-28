define([
    'jscore/core',
    'usermgmtlib/cells/ResultsTableCell/ResultsTableCell'
], function(core,ResultsTableCell) {
    "use strict";

    describe('ResultsTableCell', function() {
        var resultsTableCell, sandbox, functionStub, elementStub;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');
            resultsTableCell = new ResultsTableCell();

            functionStub = {
                find: function(){return elementStub;},
                setAttribute: function() {}
            };

            sandbox.spy(functionStub,'find');
            sandbox.spy(functionStub,'setAttribute');
            sandbox.stub(elementStub,'setModifier');
            sandbox.stub(elementStub,'setText');
            sandbox.stub(resultsTableCell,'getElement', function(){return functionStub;});

        });

        afterEach(function() {
            sandbox.restore();
        });
        it('ResultsTableCell should be defined', function() {
            expect(ResultsTableCell).not.to.be.null;
            expect(ResultsTableCell).not.to.be.undefined;
        });

        describe("setValue()", function() {
            it('Should update icon with tick modifier when model has success status', function() {
                var value = {
                    success: true,
                    message: "MockMessage"
                };
                resultsTableCell.setValue(value);
                expect(resultsTableCell.getElement.callCount).to.equal(2);
                expect(functionStub.find.callCount).to.equal(2);
                expect(elementStub.setModifier.callCount).to.equal(1);
                expect(elementStub.setText.callCount).to.equal(1);
                expect(elementStub.setModifier.getCall(0).args[0]).to.equal('tick');
            });

            it('Should update icon with error modifier when model has success status as false', function() {
                var value = {
                    success: false,
                    message: "MockMessage"
                };
                resultsTableCell.setValue(value);
                expect(resultsTableCell.getElement.callCount).to.equal(2);
                expect(functionStub.find.callCount).to.equal(2);
                expect(elementStub.setModifier.callCount).to.equal(1);
                expect(elementStub.setText.callCount).to.equal(1);
                expect(elementStub.setModifier.getCall(0).args[0]).to.equal('error');
            });
        });

        describe("setTooltip()", function() {
            it('Should set message from value', function() {
                    var value = {
                        message: "MockMessage"
                    };
                    resultsTableCell.setTooltip(value);
                    expect(resultsTableCell.getElement.callCount).to.equal(1);
                    expect(functionStub.setAttribute.callCount).to.equal(1);
                    expect(functionStub.setAttribute.getCall(0).args[0]).to.equal('title');
                    expect(functionStub.setAttribute.getCall(0).args[1]).to.equal('MockMessage');
            });
        });

    });
});