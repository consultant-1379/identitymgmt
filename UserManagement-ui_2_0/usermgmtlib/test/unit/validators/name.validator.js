define([
    'usermgmtlib/validators/name.validator',
    'usermgmtlib/Dictionary'
], function(NameValidator, Dictionary){
    'use strict';

    describe('NameValidator',function(){
        it('NameValidator should be defined', function(){
            expect(NameValidator).not.to.be.undefined;
        });

        describe('validate()', function(){
        var strictMode, name, output;

            it('Should return error message when username is empty', function(){
                name = "";
                strictMode = true;
                output = NameValidator.validate(name,strictMode);

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
                expect(output.message).to.equal(Dictionary.validator.name.must_be_specified);
            });

            it('Should positive validate correct name with no error message', function(){
                name = "MockName";
                strictMode = false;
                output = NameValidator.validate(name,strictMode);

                expect(output).to.be.undefined;

            });

        });
    });
});