define([
    'usermgmtlib/validators/passwordageing.validator',
    'usermgmtlib/Dictionary'
], function(PwdAgeValidator, Dictionary){
    'use strict';

    describe('PwdAgeValidator',function(){
        it('PwdAgeValidator should be defined', function(){
            expect(PwdAgeValidator).not.to.be.undefined;
        });

        describe('validate()', function(){
        var strictMode, output;
        var passwordAgeing = {};

            it('Should bypass validation when customized pwd age is disabled', function(){
                passwordAgeing.customizedPasswordAgeingEnable = false;
                passwordAgeing.passwordAgeingEnable = true;
                passwordAgeing.pwdMaxAge = "";
                passwordAgeing.pwdExpireWarning = "";
                strictMode = false;
                output = PwdAgeValidator.validate(passwordAgeing, strictMode);

                expect(output).to.be.undefined;
            });

            it('Should return error message when pwd max age/ pwd expire warning are empty and is enabled', function(){
                passwordAgeing.customizedPasswordAgeingEnable = true;
                passwordAgeing.passwordAgeingEnable = true;
                passwordAgeing.pwdMaxAge = "";
                passwordAgeing.pwdExpireWarning = "";
                strictMode = true;
                output = PwdAgeValidator.validate(passwordAgeing, strictMode);

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
                expect(output.messageAge).to.equal(Dictionary.validator.pwdMaxAge.must_be_specified);
                expect(output.messageExpire).to.equal(Dictionary.validator.pwdExpireWarning.must_be_specified);
            });

            it('Should invalidate pwd max age because of boundaries', function(){
                passwordAgeing.customizedPasswordAgeingEnable = true;
                passwordAgeing.passwordAgeingEnable = true;
                passwordAgeing.pwdMaxAge = "0";
                passwordAgeing.pwdExpireWarning = "0";
                strictMode = true;
                output = PwdAgeValidator.validate(passwordAgeing, strictMode);

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
                expect(output.messageAge).to.equal(Dictionary.validator.pwdMaxAge.policies_must_fulfilled);
            });

            it('Should invalidate pwd expire warning because of boundaries', function(){
                passwordAgeing.customizedPasswordAgeingEnable = true;
                passwordAgeing.passwordAgeingEnable = true;
                passwordAgeing.pwdMaxAge = "1";
                passwordAgeing.pwdExpireWarning = "16";
                strictMode = true;
                output = PwdAgeValidator.validate(passwordAgeing, strictMode);

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
                expect(output.messageExpire).to.equal(Dictionary.validator.pwdExpireWarning.policies_must_fulfilled);
            });

            it('Should invalidate pwd expire warning because of value greater than pwd max ageing value', function(){
                passwordAgeing.customizedPasswordAgeingEnable = true;
                passwordAgeing.passwordAgeingEnable = true;
                passwordAgeing.pwdMaxAge = "2";
                passwordAgeing.pwdExpireWarning = "3";
                strictMode = true;
                output = PwdAgeValidator.validate(passwordAgeing, strictMode);

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
                expect(output.messageExpire).to.equal(Dictionary.validator.pwdExpireWarning.must_be_less_than);
            });

            it('Should positive validate correct pwd max age with no error message', function(){
                passwordAgeing.customizedPasswordAgeingEnable = true;
                passwordAgeing.passwordAgeingEnable = true;
                passwordAgeing.pwdMaxAge = "10";
                passwordAgeing.pwdExpireWarning = "5";
                strictMode = true;
                output = undefined;
                output = PwdAgeValidator.validate(passwordAgeing, strictMode);

                expect(output).to.be.undefined;

            });

        });
    });
});
