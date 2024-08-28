define([
    'usermgmtlib/validators/surname.validator',
    'usermgmtlib/Dictionary'
], function(SurnameValidator, Dictionary){
    'use strict';

    describe('SurnameValidator',function(){

        it('SurnameValidator should be defined', function(){
            expect(SurnameValidator).not.to.be.undefined;
        });

        describe('validate()', function(){
        var strictMode, surname, output;

            it('Should return error message when username is empty', function(){
                surname = "";
                strictMode = true;
                output = SurnameValidator.validate(surname,strictMode);

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
                expect(output.message).to.equal(Dictionary.validator.surname.must_be_specified);
            });

            it('Should positive validate correct surname with no error message', function(){
                surname = "MockSurname";
                strictMode = false;
                output = SurnameValidator.validate(surname,strictMode);

                expect(output).to.be.undefined;

            });

        });
    });
});