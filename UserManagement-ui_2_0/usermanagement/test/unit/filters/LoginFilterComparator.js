define([
    'usermanagement/filters/LoginFilterComparator'
], function(LoginFilterComparator) {
    'use strict';

    describe("LoginFilterComparator", function() {
        var loginComparator, sandbox;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            loginComparator = new LoginFilterComparator();
        });

        afterEach(function() {
            sandbox.restore();
        });

        it("LoginFilterComparator should be defined", function() {
            expect(LoginFilterComparator).not.to.be.undefined;
            expect(LoginFilterComparator).not.to.be.null;
        });

        describe("filter()", function() {
            it("Should return true when criteria to filtered is \"NEVER_LOGGED_IN\" and value is null", function() {
                var result = loginComparator.filter(null,["NEVER_LOGGED_IN"]);
                expect(result).to.be.true;
            });

            it("Should return true when criteria to filtered is \"NEVER_LOGGED_IN\" and value is undefined", function() {
                var result = loginComparator.filter(undefined,["NEVER_LOGGED_IN"]);
                expect(result).to.be.true;
            });

            it("Should return false when criteria to filtered is \"NEVER_LOGGED_IN\" and value is defined", function() {
                var result = loginComparator.filter("valueMock",["NEVER_LOGGED_IN"]);
                expect(result).to.be.false;
            });

            it("Should return false when criteria to filtered is mocked array ", function() {
                var result = loginComparator.filter(null,["MOCK_CRITERIA"]);
                expect(result).to.be.false;
            });

            it("Should return false when login data is older than value input data", function() {
                var criteria = [];
                criteria.push({
                    LOGGED_WITHIN: parseInt("2", 10)
                });
                var result = loginComparator.filter("10160911234123+0000",criteria);
                expect(result).to.be.false;
            });
            it("Should return true when login data is not older than value input data", function() {
                var criteria = [];
                criteria.push({
                    LOGGED_WITHIN: parseInt("3650", 10)
                });
                var result = loginComparator.filter("20160920234123+0000",criteria);
                expect(result).to.be.true;
            });

        });


    });

});