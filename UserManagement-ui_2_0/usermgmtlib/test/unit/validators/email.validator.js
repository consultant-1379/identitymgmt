define([
    'usermgmtlib/validators/email.validator',
    'usermgmtlib/Dictionary'
], function(EmailValidator, Dictionary){
    'use strict';

    describe('EmailValidator',function(){

        it('EmailValidator should be defined', function(){
            expect(EmailValidator).not.to.be.undefined;
        });

        describe('validate()', function(){
        var strictMode, email, output;

            it('Should return error message when email is empty and strictMode is true ', function(){
                email = "";
                strictMode = true;
                output = EmailValidator.validate(email,strictMode);

                expect(output).to.be.undefined;
            });


            it('Should return error message when email contains wrong characters', function(){
                email = "MockEmail@.!$mail.com";
                strictMode = false;
                output = EmailValidator.validate(email,strictMode);

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
                expect(output.message).to.equal(Dictionary.validator.email.invalid_email);
            });

            it('Should positive validate correct email with no error message', function(){
                email = "MockEmail@mail.com";
                strictMode = false;
                output = EmailValidator.validate(email,strictMode);

                expect(output).to.be.undefined;

            });

        });
    });
});