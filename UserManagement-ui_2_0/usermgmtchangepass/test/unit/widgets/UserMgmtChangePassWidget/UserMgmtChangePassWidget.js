define([
    'jscore/core',
    'usermgmtchangepass/widgets/UserMgmtChangePassWidget/UserMgmtChangePassWidget',
    'identitymgmtlib/mvp/binding',
    'usermgmtchangepass/Dictionary'
], function(core, UserMgmtChangePassWidget, binding, Dictionary) {
    "use strict";

    describe('UserMgmtChangePassWidget', function() {
        var sandbox, userMgmtChangePassWidget, viewStub, elementStub;
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

            sandbox.spy(options.model, 'get');


            userMgmtChangePassWidget = new UserMgmtChangePassWidget(options);
            userMgmtChangePassWidget.view = viewStub;



        });

        afterEach(function() {
            sandbox.restore();
        });

        it('UserMgmtChangePassWidget should be defined', function() {
            expect(UserMgmtChangePassWidget).not.to.be.undefined;
            expect(UserMgmtChangePassWidget).not.to.be.null;
        })

        describe('onViewReady()', function() {
            var modifierStub;

            beforeEach(function() {
                modifierStub = {
                    setModifier: function() {}
                };
                sandbox.stub(userMgmtChangePassWidget, 'setInfoTest');

                sandbox.spy(modifierStub, 'setModifier');
            });
            it('Should update info text', function() {
                userMgmtChangePassWidget.onViewReady();

                expect(userMgmtChangePassWidget.setInfoTest.callCount).to.equal(1);

            });
        });




        describe('setInfoTest()', function() {
            beforeEach(function() {
                sandbox.spy(elementStub, 'setText');
                sandbox.stub(userMgmtChangePassWidget, 'getViewElement', function() {
                    return elementStub;
                });

                userMgmtChangePassWidget.setInfoTest();
            });

            it('Should find suitable element to set info text', function() {
                expect(userMgmtChangePassWidget.getViewElement.callCount).to.equal(3);

                expect(userMgmtChangePassWidget.getViewElement.getCall(0).args[0]).to.equal('-mainContent-topInfoText1');
                expect(userMgmtChangePassWidget.getViewElement.getCall(1).args[0]).to.equal('-mainContent-topInfoTextUserName');
                expect(userMgmtChangePassWidget.getViewElement.getCall(2).args[0]).to.equal('-mainContent-topInfoText2');

            });

            it('Should set information into suitable element', function() {
                expect(elementStub.setText.callCount).to.equal(3);

                expect(elementStub.setText.getCall(0).args[0]).to.equal(Dictionary.topInfoText1);
                expect(elementStub.setText.getCall(2).args[0]).to.equal(Dictionary.topInfoText2);

            });
        });
        describe('getViewElement()', function() {

            it('Should return suitable element', function() {
                var callback = userMgmtChangePassWidget.getViewElement('');

                expect(viewStub.getElement.calledOnce).to.equal(true);
                expect(elementStub.find.calledOnce).to.equal(true);
                expect(elementStub.find.calledWith('.eaUsermgmtchangepass-wUserMgmtChangePassWidget')).to.equal(true);

                expect(callback).not.to.be.null;
                expect(callback instanceof core.Element);
            });
        });
    });
});
