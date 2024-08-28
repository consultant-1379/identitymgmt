define([
    'jscore/core',
    'identitymgmtlib/filters/RolesAccordionFilterWidget',
    'widgets/InfoPopup',
], function(core, RolesAccordionFilterWidget, InfoPopup) {
    'use strict';

    describe('RolesAccordionFilterWidget', function() {
        var sandbox, rolesAccordionFilterWidget, viewStub, elementStub, infoPopupStub, getElementStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');
            infoPopupStub = InfoPopup.prototype;
            viewStub = {
                getElement: function() {
                    return elementStub;
                }
            }
            sandbox.spy(infoPopupStub,'attachTo');
            sandbox.spy(elementStub,'find');
            sandbox.spy(elementStub,'addEventHandler');
            sandbox.spy(viewStub,'getElement');
            rolesAccordionFilterWidget = new RolesAccordionFilterWidget();
            rolesAccordionFilterWidget.view = viewStub;
            rolesAccordionFilterWidget.infoPopup = infoPopupStub;
            getElementStub = {
                find: function(){
                    return elementStub;
                }
            }
            sandbox.spy(getElementStub,'find');
            sandbox.stub(rolesAccordionFilterWidget,'getElement', function() {
                return getElementStub;
            });


        });

        afterEach(function() {
            sandbox.restore();
        });

        it('RolesAccordionFilterWidget should be defined', function() {
            expect(RolesAccordionFilterWidget).not.to.be.undefined;
            expect(RolesAccordionFilterWidget).not.to.be.null;
        });

        describe('onViewReady()', function() {
            it('Should add Info popup widget to view', function() {
                expect(infoPopupStub.attachTo.callCount).to.equal(1);
                var result = infoPopupStub.attachTo.getCall(0).args[0];
                expect(result).not.to.be.undefined;
                expect(result).not.to.be.null;
            });

            it('Should add click event handler to element in view', function() {
                rolesAccordionFilterWidget.onViewReady();
                expect(rolesAccordionFilterWidget.getElement.callCount).to.equal(3);
                expect(getElementStub.find.callCount).to.equal(3);
                expect(elementStub.addEventHandler.callCount).to.equal(2);
                expect(elementStub.addEventHandler.getCall(0).args[0]).to.equal('click');
                expect(elementStub.addEventHandler.getCall(1).args[0]).to.equal('click');
            });
        });
    });
});