/*global define, describe, it, expect */
define([
    'rolemanagement/widgets/StatusCell/StatusCell',
    'i18n!rolemanagement/app.json'
], function(StatusCell, Dictionary) {
    'use strict';

    describe('StatusCell', function() {

        it('StatusCell should be defined', function() {
            expect(StatusCell).not.to.be.undefined;
        });

        var sandbox, statusCell, viewStub, getStatusTextStub, getStatusIconStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            statusCell = new StatusCell();

            getStatusTextStub = {
                setText: function() {}
            };

            getStatusIconStub = {
                setModifier: function() {}
            };

            viewStub = {
                getStatusText: function() {
                    return getStatusTextStub;
                },
                getStatusIcon: function() {
                    return getStatusIconStub;
                }
            };

            statusCell.view = viewStub;
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('setValue()', function() {
            beforeEach(function() {
                sandbox.spy(viewStub, 'getStatusText');
                sandbox.spy(viewStub, 'getStatusIcon');
                sandbox.spy(getStatusTextStub, 'setText');
                sandbox.spy(getStatusIconStub, 'setModifier');
            });

            it('Should set status to enabled', function() {

                // Action
                statusCell.setValue(Dictionary.statusCell.RoleStatusEnabled);

                expect(getStatusTextStub.setText.callCount).to.equal(1);
                expect(getStatusTextStub.setText.getCall(0).calledWith(Dictionary.statusCell.RoleStatusEnabled)).to.equal(true);
            });

            it('Should set status to disable', function() {

                // Action
                statusCell.setValue(Dictionary.statusCell.RoleStatusDisabled);

                expect(getStatusTextStub.setText.callCount).to.equal(1);
                expect(getStatusTextStub.setText.getCall(0).calledWith(Dictionary.statusCell.RoleStatusDisabled)).to.equal(true);
            });

            it('Should set status to nonassignable', function() {

                // Action
                statusCell.setValue(Dictionary.statusCell.RoleStatusNonassignable);

                expect(getStatusTextStub.setText.callCount).to.equal(1);
                expect(getStatusTextStub.setText.getCall(0).calledWith(Dictionary.statusCell.RoleStatusNonassignable)).to.equal(true);
            });
        });
    });

});