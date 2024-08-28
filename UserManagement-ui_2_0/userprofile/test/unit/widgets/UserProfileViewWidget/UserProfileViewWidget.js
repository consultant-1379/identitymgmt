define([
    'jscore/core',
    'identitymgmtlib/mvp/binding',
    'userprofile/Dictionary',
    'userprofile/widgets/UserProfileViewWidget/UserProfileViewWidget',
    'usermgmtlib/model/RegularUserProfileModel'
], function(core, binding, Dictionary, UserProfileViewWidget, RegularUserProfileModel){
    "use strict";

    describe('UserProfileViewWidget', function(){
        var userProfileViewWidget, sandbox, options, modelStub, userProfileViewWidgetSpy;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            options = {
                model: {
                    get: function(key){
                        return modelStub[key];
                    }
                }
            };
            modelStub = {
                "username":"TestUser",
                "name":"security",
                "surname":"TestUser1",
                "description": "Any Description",
                "email":"TestUser1@TestUser.com",
                "boolType":true
            };

            sandbox.spy(options.model,'get');
            sandbox.stub(binding,'bind');


            userProfileViewWidget = new UserProfileViewWidget(options);
            userProfileViewWidgetSpy = sandbox.spy(userProfileViewWidget.view,'getElement');
        });

        afterEach(function(){
            sandbox.restore();
        });


        it('UserProfileViewWidget should be defined', function(){
            expect(UserProfileViewWidget).not.to.be.null;
            expect(UserProfileViewWidget).not.to.be.undefined;
        });

        describe('onViewReady()', function(){

            it('Should bind user data', function(){

                expect(binding.bind.callCount).to.equal(1);
                var output = binding.bind.getCall(0).args[2];
                expect(output).to.deep.equal({
                    'username': ['username'],
                    'name': ['name'],
                    'surname': ['surname'],
                    'description': ['description'],
                    'email': ['email'],
                    'status': 'status',
                    'previousLogin': 'previousLogin'
                });
                userProfileViewWidget.onViewReady();
                expect(userProfileViewWidgetSpy.callCount).to.equal(1);
            });
        });
    });
});