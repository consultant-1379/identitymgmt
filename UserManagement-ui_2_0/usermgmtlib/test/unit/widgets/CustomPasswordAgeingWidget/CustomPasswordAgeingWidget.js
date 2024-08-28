define([
    'jscore/core',
    'usermgmtlib/widgets/CustomPasswordAgeingWidget/CustomPasswordAgeingWidget',
    'identitymgmtlib/services/PasswordPolicyService',
    'usermgmtlib/model/UserProfileModel'
], function(core, CustomPasswordAgeingWidget, PasswordPolicyService, UserProfileModel) {
    'use strict';

    describe('CustomPasswordAgeingWidget', function() {

        var sandbox, options, customPasswordAgeingWidget, viewStub, server, userModel, pwdAgeJson;

        beforeEach(function() {
                sandbox = sinon.sandbox.create();
                userModel = new UserProfileModel();


                pwdAgeJson = {
                        'customizedPasswordAgeingEnable':false,
                        'passwordAgeingEnable':false,
                        'pwdMaxAge':0,
                        'pwdExpireWarning':0,
                        'graceLoginCount':0
                };
                userModel.set('passwordAgeing', pwdAgeJson);

                options = {
                        model: userModel
                };

                customPasswordAgeingWidget = new CustomPasswordAgeingWidget(options);

                server = sinon.fakeServer.create();
                customPasswordAgeingWidget.model = userModel;

                var functionStub = {
                    setProperty: function() {},
                    setText: function() {},
                    addEventHandler: function() {},
                    getProperty: function() {},
                    setModifier: function() {},
                    removeModifier: function() {},
                    removeAttribute: function() {},
                    setAttribute: function() {},
                    setValue: function() {},
                    setStyle: function() {},
                    forEach: function() {},
                    find: function() {},
                    findAll: function() {}
                };

                viewStub = {
                    getCustomPwdAgeFalse: function() {
                        return functionStub;
                    },
                    getCustomPwdAgeTrue: function() {
                        return functionStub;
                    },
                    getAllCustomPwdAge: function() {
                        return functionStub;
                    },
                    getPwdAgeingFlag: function() {
                        return functionStub;
                    },
                    getPwdMaxAge: function() {
                        return functionStub;
                    },
                    getPwdExpireWarning: function() {
                        return functionStub;
                    },
                    getCheckboxLabel: function() {
                        return functionStub;
                    },
                    getInputTextLabels: function() {
                        return functionStub;
                    },
                    getPwdMaxAgeValidator: function() {
                        return functionStub;
                    },
                    getPwdExpireWarningValidator: function() {
                        return functionStub;
                    },
                    getPwdMaxAgeMsgVal: function() {
                        return functionStub;
                    },
                    getPwdExpireWarnMsgVal: function() {
                        return functionStub;
                    },
                    getTitle: function() {
                        return functionStub;
                    },
                    getInfoPopupContainer: function() {
                        return functionStub;
                    },
                    getElement: function() {
                        return functionStub;
                    }
                };

                sandbox.spy(functionStub, 'setProperty');
                sandbox.spy(functionStub, 'setText');
                sandbox.spy(functionStub, 'addEventHandler');
                sandbox.spy(functionStub, 'getProperty');
                sandbox.spy(functionStub, 'setModifier');
                sandbox.spy(functionStub, 'removeModifier');
                sandbox.spy(functionStub, 'removeAttribute');
                sandbox.spy(functionStub, 'setAttribute');
                sandbox.spy(functionStub, 'setValue');
                sandbox.spy(functionStub, 'setStyle');
                sandbox.spy(functionStub, 'forEach');
                sandbox.spy(functionStub, 'find');
                sandbox.spy(functionStub, 'findAll');

                sandbox.spy(viewStub, 'getElement');
                sandbox.spy(viewStub, 'getCustomPwdAgeFalse');
                sandbox.spy(viewStub, 'getCustomPwdAgeTrue');
                sandbox.spy(viewStub, 'getAllCustomPwdAge');
                sandbox.spy(viewStub, 'getPwdAgeingFlag');
                sandbox.spy(viewStub, 'getPwdMaxAge');
                sandbox.spy(viewStub, 'getPwdExpireWarning');
                sandbox.spy(viewStub, 'getCheckboxLabel');
                sandbox.spy(viewStub, 'getInputTextLabels');
                sandbox.spy(viewStub, 'getPwdMaxAgeValidator');
                sandbox.spy(viewStub, 'getPwdExpireWarningValidator');
                sandbox.spy(viewStub, 'getPwdMaxAgeMsgVal');
                sandbox.spy(viewStub, 'getPwdExpireWarnMsgVal');
                sandbox.spy(viewStub, 'getTitle');
                sandbox.spy(viewStub, 'getInfoPopupContainer');


                customPasswordAgeingWidget.view = viewStub;
        });

        afterEach(function() {
            sandbox.restore();
            server.restore();
        });

        it('CustomPasswordAgeingWidget should be defined', function() {
            expect(CustomPasswordAgeingWidget).not.to.be.undefined;
            expect(CustomPasswordAgeingWidget).not.to.be.null;
        });

        describe('init()', function(){
            it('Should initialize Custom Password Ageing imported model', function(){
                expect(customPasswordAgeingWidget.model).not.to.be.undefined;
                expect(customPasswordAgeingWidget.model).not.to.be.null;
            });
        });

        describe ('getValue()', function(){

            it('Should get a password ageing object with default values', function() {
                expect(customPasswordAgeingWidget.getValue()).not.to.be.undefined;
                expect(customPasswordAgeingWidget.getValue()).not.to.be.null;
            });
        });

        describe('enable/disable methods', function() {

            it('Should enable the radio buttons', function() {
                customPasswordAgeingWidget.enable();
                expect(viewStub.getCustomPwdAgeFalse.callCount).to.equal(1);
                expect(viewStub.getCustomPwdAgeTrue.callCount).to.equal(1);
            });
            it('Should disable the radio buttons and the others in cascade', function() {
                customPasswordAgeingWidget.disable();
                expect(viewStub.getCustomPwdAgeFalse.callCount).to.equal(2);
                expect(viewStub.getCustomPwdAgeTrue.callCount).to.equal(1);
                expect(viewStub.getPwdAgeingFlag.callCount).to.equal(3);
                expect(viewStub.getCheckboxLabel.callCount).to.equal(1);
                expect(viewStub.getPwdExpireWarning.callCount).to.equal(2);
                expect(viewStub.getInputTextLabels.callCount).to.equal(1);
            });
        });
    });
});
