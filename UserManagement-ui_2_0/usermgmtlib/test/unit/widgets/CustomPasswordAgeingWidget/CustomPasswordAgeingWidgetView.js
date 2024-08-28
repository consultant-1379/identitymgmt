define([
    'jscore/core',
    'identitymgmtlib/services/PasswordPolicyService',
    'usermgmtlib/widgets/CustomPasswordAgeingWidget/CustomPasswordAgeingWidgetView'
], function(core, PasswordPolicyService, CustomPasswordAgeingWidgetView) {
    'use strict';

    describe('CustomPasswordAgeingWidgetView', function() {

        var sandbox, viewStub, server;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            viewStub = new CustomPasswordAgeingWidgetView();


            server = sinon.fakeServer.create();
        });

        afterEach(function() {
            sandbox.restore();
            server.restore();
        });

        describe('get input Elements()', function(){
            beforeEach(function() {
                viewStub.render();
                sandbox.spy(viewStub.getElement(),"find");
                sandbox.spy(viewStub.getElement(),"findAll");
                sandbox.spy(viewStub,"getElement");
            });
            afterEach(function() {
                sandbox.restore();
            });
            it('Should get the get system setting radio button', function() {
                viewStub.getCustomPwdAgeFalse();
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(viewStub.getElement().find.callCount).to.equal(1);
                expect(viewStub.getElement().find.getCall(0).args[0]).to.equal('.eaUsermgmtlib-wUserMgmtCustomPwd-wRadioButtonWidget-input-false');
            });
            it('Should get the get customized setting radio button', function() {
                viewStub.getCustomPwdAgeTrue();
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(viewStub.getElement().find.callCount).to.equal(1);
                expect(viewStub.getElement().find.getCall(0).args[0]).to.equal('.eaUsermgmtlib-wUserMgmtCustomPwd-wRadioButtonWidget-input-true');
            });
            it('Should get all the radio buttons', function() {
                viewStub.getAllCustomPwdAge();
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(viewStub.getElement().findAll.callCount).to.equal(1);
                expect(viewStub.getElement().findAll.getCall(0).args[0]).to.equal('.eaUsermgmtlib-wUserMgmtCustomPwd-wRadioButtonWidget-input');
            });
            it('Should get the enable pwd age enabling button', function() {
                viewStub.getPwdAgeingFlag();
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(viewStub.getElement().find.callCount).to.equal(1);
                expect(viewStub.getElement().find.getCall(0).args[0]).to.equal('.eaUsermgmtlib-wUserMgmtCustomPwd-wSimpleCheckboxWidget-input');
            });
            it('Should get the pwd age input text', function() {
                viewStub.getPwdMaxAge();
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(viewStub.getElement().find.callCount).to.equal(1);
                expect(viewStub.getElement().find.getCall(0).args[0]).to.equal('.eaUsermgmtlib-wUserMgmtCustomPwd-wInputWidget-input-pwdMaxAge');
            });
            it('Should get the pwd expire warning input text', function() {
                viewStub.getPwdExpireWarning();
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(viewStub.getElement().find.callCount).to.equal(1);
                expect(viewStub.getElement().find.getCall(0).args[0]).to.equal('.eaUsermgmtlib-wUserMgmtCustomPwd-wInputWidget-input-pwdExpireWarning');
            });
        });
    });
});
