define([
    'usermgmtlib/widgets/PasswordPolicyElement/PasswordPolicyElement'
], function(PasswordPolicyElement){
    "use strict";

    describe("PasswordPolicyElement", function(){
        var passwordPolicyElement, sandbox, options, modelStub;

        beforeEach(function(){

            sandbox = sinon.sandbox.create();
            modelStub = {
                "name" : "MockName"
            };
            options = {
                model: {
                    get: function(key) {
                       return modelStub[key];
                   }
                }
            };
            sandbox.spy(options.model,'get');
            passwordPolicyElement = new PasswordPolicyElement(options);
        });

        afterEach(function(){
            sandbox.restore();
        });

        it('PasswordPolicyElement should be defined', function(){
            expect(PasswordPolicyElement).not.to.be.undefined;
            expect(PasswordPolicyElement).not.to.be.null;

        });

        it('Should initialize all element of widget', function(){
            expect(options.model.get.callCount).to.equal(2);
        });
    });
});