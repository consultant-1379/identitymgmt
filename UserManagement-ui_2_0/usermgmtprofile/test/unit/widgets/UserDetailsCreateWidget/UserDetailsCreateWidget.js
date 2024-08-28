define([
    'jscore/core',
    'jscore/ext/privateStore',
    'identitymgmtlib/mvp/binding',
    'usermgmtprofile/widgets/UserDetailsCreateWidget/UserDetailsCreateWidget',
    'usermgmtlib/widgets/CustomPasswordAgeingWidget/CustomPasswordAgeingWidget'
], function(core, PrivateStore, binding, UserDetailsCreateWidget, CustomPasswordAgeingWidget) {
    'use strict';

    describe('UserDetailsCreateWidget', function() {
        var userDetailsCreateWidget, sandbox, options;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            sandbox.spy(PrivateStore, 'create');
            options = {
                model: {
                    passwordPoliciesCollection: {
                        fetch: function() {},
                        addEventHandler: function() {}
                    }
                }
            };
            sandbox.stub(binding, 'bind');
            sandbox.stub(CustomPasswordAgeingWidget.prototype, 'init');
            sandbox.stub(CustomPasswordAgeingWidget.prototype, 'onViewReady');
            userDetailsCreateWidget = new UserDetailsCreateWidget(options);


        });
        afterEach(function() {
            sandbox.restore();
        });
        it('UserDetailsCreateWidget should be defined', function() {
            expect(UserDetailsCreateWidget).not.to.be.null;
            expect(UserDetailsCreateWidget).not.to.be.undefined;
        });

        describe('onViewReady()', function() {
            it('Should bind user data', function() {

                expect(binding.bind.callCount).to.equal(1);
                expect(binding.bind.getCall(0).args[1]).to.equal(userDetailsCreateWidget.view);

                var output = binding.bind.getCall(0).args[2];
                expect(output).to.deep.equal({
                    'username': ['username', 'usernameValidation'],
                    'password': ['password', 'passwordValidation', 'passwordPolicy'],
                    'passwordConfirm': ['passwordConfirm'],
                    'passwordResetFlag': 'passwordResetFlag',
                    'name': ['name', 'nameValidation'],
                    'surname': ['surname', 'surnameValidation'],
                    'email': ['email', 'emailValidation'],
                    'status': 'status',
                    'description': ['description'],
                    'passwordAgeing': 'passwordAgeing',
                    'authMode':'authMode'
                });
            });
        });
    });
});
