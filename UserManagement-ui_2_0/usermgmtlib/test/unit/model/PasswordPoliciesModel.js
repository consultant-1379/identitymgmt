define([
    'usermgmtlib/model/PasswordPoliciesModel'
],function(PasswordPoliciesModel){
    'use strict';

    describe('PasswordPoliciesModel', function(){
        var passwordPoliciesModel;

        beforeEach(function(){
            passwordPoliciesModel = new PasswordPoliciesModel();
        });


        it('PasswordPoliciesModel should be defined', function(){
            expect(PasswordPoliciesModel).not.to.be.undefined;
            expect(PasswordPoliciesModel).not.to.be.null;
        });

        describe('parse()', function(){
            it('Should parse value 0 to \'\' ', function(){
                var data = {
                    value: 0
                }
                var output = passwordPoliciesModel.parse(data);

                expect(output).not.to.be.null;
                expect(output).not.to.be.undefined;

                expect(output.value).to.equal('');

            });
            it('Should return data without any changes ', function(){
                var mockValue = 1;
                var data = {
                    value: mockValue
                }
                var output = passwordPoliciesModel.parse(data);

                expect(output).not.to.be.null;
                expect(output).not.to.be.undefined;

                expect(output.value).to.equal(mockValue);

            });
        });
    });
});