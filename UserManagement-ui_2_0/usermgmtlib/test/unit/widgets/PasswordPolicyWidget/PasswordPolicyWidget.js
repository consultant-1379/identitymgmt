define([
    'jscore/core',
    'usermgmtlib/widgets/PasswordPolicyWidget/PasswordPolicyWidget',
    'identitymgmtlib/mvp/binding',
    'usermgmtlib/model/PasswordPoliciesCollection',
    'usermgmtlib/widgets/PasswordPolicyElement'
], function(core, PasswordPolicyWidget, binding, PasswordPoliciesCollection, PasswordPolicyElement) {
    'use strict';

    describe('PasswordPolicyWidget', function() {
        var sandbox, passwordPolicyWidget, collectionStub, viewStub, elementStub;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            var data = {"name": "MockName"};
            collectionStub = {
                collection: new PasswordPoliciesCollection()

            }
            elementStub = new core.Element('div');
            viewStub = {
                getElement: function(){
                    return elementStub;
                }
            }
            sandbox.spy(viewStub,'getElement');
            sandbox.spy(elementStub,'find');

            passwordPolicyWidget = new PasswordPolicyWidget(collectionStub);

            passwordPolicyWidget.view = viewStub;

            sandbox.stub(binding, 'bind');
            sandbox.stub(PasswordPolicyElement.prototype,'init');
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('PasswordPoliciesWidget should be defined', function() {
            expect(PasswordPolicyWidget).not.to.be.undefined;
            expect(PasswordPolicyWidget).not.to.be.null;
        });
        describe('init()', function(){
            it('Should initialize password policies collection', function(){
                expect(passwordPolicyWidget.PasswordPoliciesCollection).not.to.be.undefined;
                expect(passwordPolicyWidget.PasswordPoliciesCollection).not.to.be.null;
            });
        });

        describe('getPolicyWidget()', function(){
            var model, modelStub;
            it('Should initialize PasswordPolicyElement', function(){
                modelStub = {
                    "name" : "MockName"
                };
                model = {
                    get: function(key) {
                        return modelStub[key];
                    }
                }

                sandbox.spy(model,'get');

                var output = passwordPolicyWidget.getPolicyWidget(model);
                expect(PasswordPolicyElement.prototype.init.callCount).to.equal(1);
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('attachPolicyWidget()', function(){
            var model, attachToStub, modelStub;
            beforeEach(function(){
                modelStub = {
                   "name" : "MockName"
               };
                model = {
                    get: function(key) {
                        return modelStub[key];
                    }
                };
                attachToStub = {
                    attachTo: function(){
                    }
                };
                sandbox.spy(model,'get');

                sandbox.stub(passwordPolicyWidget,'getPolicyWidget', function(){return attachToStub;});
                sandbox.spy(attachToStub,'attachTo');
                passwordPolicyWidget.attachPolicyWidget(model);
            });
            it('Should attach policy widget to view', function(){
                expect(passwordPolicyWidget.getPolicyWidget.callCount).to.equal(1);
                expect(attachToStub.attachTo.callCount).to.equal(1);

                expect(viewStub.getElement.callCount).to.equal(1);
                expect(elementStub.find.callCount).to.equal(1);
                expect(elementStub.find.calledWith('.eaUsermgmtlib-wPasswordPolicyContainer-list')).to.equal(true);
            });
        });

        describe('updatePolicyWidgets()', function(){
            beforeEach(function(){
                sandbox.spy(collectionStub.collection,'toJSON');
                passwordPolicyWidget.updatePolicyWidgets();
            });
            it('Should update Policy ', function(){
                expect(collectionStub.collection.toJSON.callCount).to.equal(1);
            });
        });

        describe('setValid()', function(){
            it('Should update policy widget', function(){
                sandbox.stub(passwordPolicyWidget,'updatePolicyWidgets');
                passwordPolicyWidget.setValid();
                expect(passwordPolicyWidget.updatePolicyWidgets.callCount).to.equal(1);
            });

        });
        describe('setInvalid()', function(){
            it('Should update policy widget', function(){
                 sandbox.stub(passwordPolicyWidget,'updatePolicyWidgets');
                 passwordPolicyWidget.setInvalid();
                 expect(passwordPolicyWidget.updatePolicyWidgets.callCount).to.equal(1);
            });
        });
    });
});
