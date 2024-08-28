define([
    'usermgmtlib/widgets/ValidationResultWidget/ValidationResultWidget'
], function(ValidationResultWidget){
    'use strict';

    describe('ValidationResultWidget', function(){
        var sandbox, validationResultWidget, viewStub, getElementStub, findStub;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            validationResultWidget = new ValidationResultWidget();
            findStub = {
                removeModifier: function(){},
                setModifier:function(){},
                setText: function(){}
            };
            getElementStub = {
                find: function(){
                    return findStub;
                }
            };
            viewStub={
                getElement: function(){
                    return getElementStub;
                }
            };
            validationResultWidget.view = viewStub;

        });
        afterEach(function(){
            sandbox.restore();
        });
        it('ValidationResultWidget should be updated', function(){
            expect(ValidationResultWidget).not.to.be.undefined;
        });

        describe('setValid()', function(){
            beforeEach(function(){
                sandbox.spy(findStub,'removeModifier');
                sandbox.spy(findStub,'setText');
                sandbox.spy(getElementStub,'find');
                sandbox.spy(viewStub,'getElement');

            });
            it('should remove all error message', function(){
                validationResultWidget.setValid();

                expect(viewStub.getElement.callCount).to.equal(3);
                expect(getElementStub.find.callCount).to.equal(3);
                expect(getElementStub.find.getCall(0).args[0]).to.equal('.eaUsermgmtlib-wValidationResultWidget-container');
                expect(getElementStub.find.getCall(1).args[0]).to.equal('.eaUsermgmtlib-wValidationResultWidget-container-status');
                expect(getElementStub.find.getCall(2).args[0]).to.equal('.eaUsermgmtlib-wValidationResultWidget-container-errorMessage');
                expect(findStub.removeModifier.callCount).to.equal(2);
                expect(findStub.removeModifier.getCall(0).args[0]).to.equal('show');
                expect(findStub.removeModifier.getCall(1).args[0]).to.equal('error');
                expect(findStub.setText.callCount).to.equal(1);
                expect(findStub.setText.getCall(0).args[0]).to.equal("");
            });
        });

        describe('setInvalid()', function(){
            beforeEach(function(){
                sandbox.spy(findStub,'setModifier');
                sandbox.spy(findStub,'setText');
                sandbox.spy(getElementStub,'find');
                sandbox.spy(viewStub,'getElement');

            });
            it('should show all error message', function(){
                var messageMock = {message: "Mock message error"};
                validationResultWidget.setInvalid(messageMock);

                expect(viewStub.getElement.callCount).to.equal(3);
                expect(getElementStub.find.callCount).to.equal(3);
                expect(getElementStub.find.getCall(0).args[0]).to.equal('.eaUsermgmtlib-wValidationResultWidget-container');
                expect(getElementStub.find.getCall(1).args[0]).to.equal('.eaUsermgmtlib-wValidationResultWidget-container-status');
                expect(getElementStub.find.getCall(2).args[0]).to.equal('.eaUsermgmtlib-wValidationResultWidget-container-errorMessage');
                expect(findStub.setModifier.callCount).to.equal(2);
                expect(findStub.setModifier.getCall(0).args[0]).to.equal('show');
                expect(findStub.setModifier.getCall(1).args[0]).to.equal('error');
                expect(findStub.setText.callCount).to.equal(1);
                expect(findStub.setText.getCall(0).args[0]).to.equal(messageMock.message);
            });
        });



    });
});