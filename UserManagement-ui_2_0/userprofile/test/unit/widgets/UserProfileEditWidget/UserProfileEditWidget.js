define([
    'jscore/core',
    'jscore/ext/privateStore',
    'userprofile/widgets/UserProfileEditWidget/UserProfileEditWidget',
    'identitymgmtlib/mvp/binding',
    'userprofile/Dictionary'
], function(core, PrivateStore, UserProfileEditWidget, binding, Dictionary){
    'use strict';

    var userSettings = {
        allowDataModification: [{
                name: "personals",
                enabled: false
            }, {
                name: "email",
                enabled: true
            }
        ]
    };

    var options = {
        model: {
            roles: ["SECURITY_ADMIN"],
            modifiables: userSettings.allowDataModification
        }
    };

    describe('UserProfileEditWidget', function(){
        var userProfileEditWidget, sandbox;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            sandbox.stub(binding,'bind');
            userProfileEditWidget = new UserProfileEditWidget(options);
        });

        afterEach(function(){
            sandbox.restore();
        });

        it('UserProfileEditWidget should be defined', function(){
            expect(UserProfileEditWidget).not.to.be.null;
            expect(UserProfileEditWidget).not.to.be.undefined;
        });

        describe('onViewReady()', function(){
            it('Should bind user data', function(){

                expect(binding.bind.callCount).to.equal(1);
                expect(binding.bind.getCall(0).args[1]).to.equal(userProfileEditWidget.view);

                var output = binding.bind.getCall(0).args[2];
                expect(output).to.deep.equal({
                    'username': ['username'],
                    'name': ['name', 'nameValidation'],
                    'surname': ['surname', 'surnameValidation'],
                    'email': ['email', 'emailValidation']
                });
            });
        });


    });
});