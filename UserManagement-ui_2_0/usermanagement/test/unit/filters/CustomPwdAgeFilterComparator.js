define([
    'usermanagement/filters/CustomPwdAgeFilterComparator'
], function(CustomPwdAgeFilterComparator){
    'use strict'

    describe("CustomPwdAgeFilterComparator", function(){
        var custompwdAgeComparator, sandbox;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            custompwdAgeComparator = new CustomPwdAgeFilterComparator();
        });

        afterEach(function(){
            sandbox.restore();
        });

        it("CustomPwdAgeFilterComparator should be defined", function(){
            expect(CustomPwdAgeFilterComparator).not.to.be.undefined;
            expect(CustomPwdAgeFilterComparator).not.to.be.null;
        });

        describe("filter()", function() {

            it('Should return false when value is undefined', function(){
                var result = custompwdAgeComparator.filter(undefined, []);
                expect(result).to.be.false;
            });

            it('Should return false when value is null', function(){
                var result = custompwdAgeComparator.filter(null, []);
                expect(result).to.be.false;
            });

            it('Should return true when value.custom is true and criteria is custom', function(){
                var pwdAgeing = {};
                pwdAgeing.customizedPasswordAgeingEnable = true;
                var result = custompwdAgeComparator.filter(pwdAgeing, ["custom"]);
                expect(result).to.be.true;
            });

            it('Should return true when value.custom is false and criteria is system', function(){
                var pwdAgeing = {};
                pwdAgeing.customizedPasswordAgeingEnable = false;
                var result = custompwdAgeComparator.filter(pwdAgeing, ["system"]);
                expect(result).to.be.true;
            });

            it('Should return false when value.custom is true and criteria is system', function(){
                var pwdAgeing = {};
                pwdAgeing.customizedPasswordAgeingEnable = true;
                var result = custompwdAgeComparator.filter(pwdAgeing, ["system"]);
                expect(result).to.be.false;
            });

            it('Should return false when value.custom is false and criteria is custom', function(){
                var pwdAgeing = {};
                pwdAgeing.customizedPasswordAgeingEnable = false;
                var result = custompwdAgeComparator.filter(pwdAgeing, ["custom"]);
                expect(result).to.be.false;
            });
        });
    });
});
