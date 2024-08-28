define([
    'jscore/core',
    'identitymgmtlib/filters/RolesSelector/RolesSelector'
], function(core, RolesSelector) {
    'use strict';

    describe('RolesSelector', function() {
        var sandbox, rolesSelector, elementStub, getElementStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');

            getElementStub = {
                find: function(){
                    return elementStub;
                }
            };
            sandbox.spy(elementStub,'addEventHandler');
            sandbox.spy(getElementStub,'find');

            rolesSelector = new RolesSelector();

            sandbox.stub(rolesSelector,'getElement', function() {
                return getElementStub;
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('RolesSelector should be defined', function() {
            expect(RolesSelector).not.to.be.undefined;
            expect(RolesSelector).not.to.be.null;
        });

        describe('onViewReady()', function() {
            it('Should add click event handler to two elements in view', function() {
                rolesSelector.onViewReady();
                expect(rolesSelector.getElement.callCount).to.equal(2);
                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.addEventHandler.callCount).to.equal(2);
                expect(elementStub.addEventHandler.getCall(0).args[0]).to.equal('click');
                expect(elementStub.addEventHandler.getCall(1).args[0]).to.equal('click');
            });
        });

    });
});