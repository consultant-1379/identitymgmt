define([
    'usermanagement/filters/CredentialsStatusFilterComparator'
], function(CredentialsStatusFilterComparator){
    'use strict';

    describe('CredentialsStatusFilterComparator', function(){
        var credentialsComparator, sandbox;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            credentialsComparator = new CredentialsStatusFilterComparator();


        });
        afterEach(function(){
            sandbox.restore();
        });
        it("CredentialsStatusFilterComparator should be defined", function(){
            expect(CredentialsStatusFilterComparator).not.to.be.undefined;
            expect(CredentialsStatusFilterComparator).not.to.be.null;
        });

        describe('filter()', function(){

            it('Should return false when filterCriteria is empty', function(){
                var result = credentialsComparator.filter(null,[]);
                expect(result).to.be.false;
            });

            it('Should return false when value to filtered is null', function(){
                var result = credentialsComparator.filter(null,["NOT APPLICABLE", "ACTIVE", "INACTIVE", "APPLICABLE", "NEW", "DELETED", "REISSUE"]);
                expect(result).to.be.false;
            });

            it('Should return false when value is no equal to any criteria', function(){
                var result = credentialsComparator.filter('mockValue',["NOT APPLICABLE", "ACTIVE", "INACTIVE", "APPLICABLE", "NEW", "DELETED", "REISSUE"]);
                expect(result).to.be.false;
            });

            it('Should return false when value is no equal to any criteria', function(){
                    var result = credentialsComparator.filter('mockValue',["NOT APPLICABLE", "ACTIVE", "INACTIVE", "APPLICABLE", "NEW", "DELETED", "REISSUE"]);
                    expect(result).to.be.false;
                });

            it('Should return true when value is equal with on of criteria', function(){
                var result = credentialsComparator.filter('NEW',["NOT APPLICABLE", "ACTIVE", "INACTIVE", "APPLICABLE", "NEW", "DELETED", "REISSUE"]);
                expect(result).to.be.true;
            });
        });


    });


});