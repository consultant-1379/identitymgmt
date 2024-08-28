define([
    'userprofile/regions/mainregion/MainRegion',
   'usermgmtlib/model/RegularUserProfileModel'
], function(MainRegion, RegularUserProfileModel){
    'use strict';

    describe('MainRegion', function(){
        var mainregion, options;

        beforeEach(function(){
            options = {
                model: new RegularUserProfileModel()
            };
            mainregion = new MainRegion(options);

        });

        it('MainRegion should be defined', function(){
            expect(MainRegion).not.to.be.undefined;
            expect(MainRegion).not.to.be.null;
        });

        describe('view()', function(){
            it('Should return proper view', function(){
                expect(mainregion.view).not.to.be.undefined;
                expect(mainregion.view).not.to.be.null;

            });
        });

    });


});