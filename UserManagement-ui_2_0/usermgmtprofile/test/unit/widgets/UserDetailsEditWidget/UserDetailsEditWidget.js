define([
    'jscore/core',
    'jscore/ext/privateStore',
    'usermgmtprofile/widgets/UserDetailsEditWidget/UserDetailsEditWidget',
    'usermgmtlib/widgets/CustomPasswordAgeingWidget/CustomPasswordAgeingWidget',
    'identitymgmtlib/mvp/binding',
    'usermgmtprofile/Dictionary'
], function(core, PrivateStore, UserDetailsEditWidget, CustomPasswordAgeingWidget, binding, Dictionary){
    'use strict';

    describe('UserDetailsEditWidget', function(){
        var userDetailsEditWidget, sandbox, options;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            sandbox.spy(PrivateStore,'create');
            options = {
                model: {}
            };
            sandbox.stub(binding,'bind');
            sandbox.stub(CustomPasswordAgeingWidget.prototype, 'init');
            sandbox.stub(CustomPasswordAgeingWidget.prototype, 'onViewReady');
            userDetailsEditWidget = new UserDetailsEditWidget(options);


        });
        afterEach(function(){
            sandbox.restore();
        });
        it('UserDetailsEditWidget should be defined', function(){
            expect(UserDetailsEditWidget).not.to.be.null;
            expect(UserDetailsEditWidget).not.to.be.undefined;
        });

        describe('onViewReady()', function(){
            it('Should bind user data', function(){

                expect(binding.bind.callCount).to.equal(1);
                expect(binding.bind.getCall(0).args[1]).to.equal(userDetailsEditWidget.view);

                var output = binding.bind.getCall(0).args[2];
                expect(output).to.deep.equal({
                    'username': ['username'],
                    'name': ['name', 'nameValidation'],
                    'surname': ['surname', 'surnameValidation'],
                    'email': ['email', 'emailValidation'],
                    'status': 'status',
                    'description': ['description'],
                    'passwordAgeing': 'passwordAgeing',
                    'authMode': 'authMode'
                });



            });
        });


    });
});