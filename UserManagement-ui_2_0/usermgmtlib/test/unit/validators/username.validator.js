define([
    'usermgmtlib/validators/username.validator',
    'usermgmtlib/Dictionary'
], function(UsernameValidator, Dictionary){
    'use strict';

    describe('UsernameValidator',function(){

        it('UsernameValidator should be defined', function(){
            expect(UsernameValidator).not.to.be.undefined;
        });

        describe('validate()', function(){
        var strictMode, username, output;

            it('Should return error message when username is empty', function(){
                username = "";
                strictMode = true;
                output = UsernameValidator.validate(username,strictMode);

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
                expect(output.message).to.equal(Dictionary.validator.username.must_be_specified);
            });

            it('Should return error message when username contains wrong characters', function(){
                username = "MockUsername#!~";
                strictMode = false;
                output = UsernameValidator.validate(username,strictMode);

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
                expect(output.message).to.equal(Dictionary.validator.username.use_only_characters);
            });

            it('Should positive validate correct username with no error message', function(){
                username = "MockUsername";
                strictMode = false;
                output = UsernameValidator.validate(username,strictMode);

                expect(output).to.be.undefined;

            });

        });
    });
});