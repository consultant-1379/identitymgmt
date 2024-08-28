define([
    'usermanagement/filters/PwdAgeFilterComparator'
], function(PwdAgeFilterComparator){
    'use strict'

    describe("PwdAgeFilterComparator", function(){
        var pwdAgeComparator, sandbox;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            pwdAgeComparator = new PwdAgeFilterComparator();
            pwdAgeComparator.init();
        });

        afterEach(function(){
            sandbox.restore();
        });

        it("PwdAgeFilterComparator should be defined", function(){
            expect(PwdAgeFilterComparator).not.to.be.undefined;
            expect(PwdAgeFilterComparator).not.to.be.null;
        });

        describe("filter()", function() {

            it('Should return false when value is undefined', function(){
                var result = pwdAgeComparator.filter(undefined, []);
                expect(result).to.be.false;
            });

            it('Should return false when value is null', function(){
                var result = pwdAgeComparator.filter(null, []);
                expect(result).to.be.false;
            });

//            it('Should return true when EXPIRED ', function(){
//                pwdAgeComparator.init();
//                var result = pwdAgeComparator.filter("20160701122034+0001", ["expired"]);
//                expect(result).to.be.false;
//            });
//
//            it('Should return true when EXPIRED ', function(){
//                pwdAgeComparator.init();
//                var result = pwdAgeComparator.filter("20180701122034+0001", ["test"]);
//                expect(result).to.be.true;
//            });
        });
    });
});