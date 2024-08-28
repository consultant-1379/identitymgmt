define([
    'jscore/core',
    'userprofilechangepass/widgets/UserProfileChangePassWidget/UserProfileChangePassWidget',
    'identitymgmtlib/mvp/binding',
    'userprofilechangepass/Dictionary'
], function(core, UserProfileChangePassWidget, binding, Dictionary) {
    "use strict";

    describe('UserProfileChangePassWidget', function() {
        var sandbox, userProfileChangePassWidget, viewStub, elementStub;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            var options = {
                model: {
                    get: function() {},
                    passwordPoliciesCollection: {
                        fetch: function() {},
                        addEventHandler: function() {}
                    }
                }
            };
            elementStub = new core.Element('div');
            viewStub = {
                getElement: function() {
                    return elementStub;
                }
            };

            sandbox.stub(binding, 'bind');
            sandbox.spy(viewStub, 'getElement');
            sandbox.spy(elementStub, 'find');



            userProfileChangePassWidget = new UserProfileChangePassWidget(options);
            userProfileChangePassWidget.view = viewStub;

        });

        afterEach(function() {
            sandbox.restore();
        });

        it('UserProfileChangePassWidget should be defined', function() {
            expect(UserProfileChangePassWidget).not.to.be.undefined;
            expect(UserProfileChangePassWidget).not.to.be.null;
        })

        describe('onViewReady()', function() {
            var modifierStub;

            beforeEach(function() {
                modifierStub = {
                    setModifier: function() {}
                };
                sandbox.stub(userProfileChangePassWidget, 'setInfoTest');

                sandbox.spy(modifierStub, 'setModifier');
            });

            it('Should update info text', function() {
                userProfileChangePassWidget.onViewReady();

                expect(userProfileChangePassWidget.setInfoTest.calledOnce).to.equal(true);

            });
        });


        describe('setInfoTest()', function() {
            beforeEach(function() {
                sandbox.spy(elementStub, 'setText');
                sandbox.stub(userProfileChangePassWidget, 'getViewElement', function() {
                    return elementStub;
                });

                userProfileChangePassWidget.setInfoTest();
            });

            it('Should find suitable element to set info text', function() {
                expect(userProfileChangePassWidget.getViewElement.callCount).to.equal(3);

                expect(userProfileChangePassWidget.getViewElement.getCall(0).args[0]).to.equal('-mainContent-topInfoText1');
                expect(userProfileChangePassWidget.getViewElement.getCall(1).args[0]).to.equal('-mainContent-topInfoTextUserName');
                expect(userProfileChangePassWidget.getViewElement.getCall(2).args[0]).to.equal('-mainContent-topInfoText2');

            });

            it('Should set information into suitable element', function() {
                expect(elementStub.setText.callCount).to.equal(3);

                expect(elementStub.setText.getCall(0).args[0]).to.equal(Dictionary.topInfoText1);
                expect(elementStub.setText.getCall(2).args[0]).to.equal(Dictionary.topInfoText2);

            });
        });
        describe('getViewElement()', function() {

            it('Should return suitable element', function() {
                var callback = userProfileChangePassWidget.getViewElement('');

                expect(viewStub.getElement.calledOnce).to.equal(true);
                expect(elementStub.find.calledOnce).to.equal(true);
                expect(elementStub.find.calledWith('.eaUserprofilechangepass-wUserProfileChangePassWidget')).to.equal(true);

                expect(callback).not.to.be.null;
                expect(callback instanceof core.Element);
            });
        });
    });
});
