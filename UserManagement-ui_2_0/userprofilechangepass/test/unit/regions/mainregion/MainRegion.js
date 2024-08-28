define([
    'userprofilechangepass/regions/mainregion/MainRegion',
    'userprofilechangepass/widgets/UserProfileChangePassWidget/UserProfileChangePassWidget',
    'identitymgmtlib/mvp/binding'
],function(MainRegion, UserProfileChangePassWidget, binding){
    'use strict';

    describe("MainRegion", function(){
        var sandbox, mainRegion, options;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            options = {
                model: {
                    get: function() {},
                    passwordPoliciesCollection: {
                        fetch: function() {},
                        addEventHandler: function() {}
                    }

                }
            };
            sandbox.stub(binding, 'bind');
            sandbox.stub(UserProfileChangePassWidget.prototype, 'onViewReady');
            mainRegion = new MainRegion(options);

        });

        afterEach(function() {
            sandbox.restore();
        });

        it('MainRegion should be defined', function(){
            expect(MainRegion).not.to.be.undefined;
            expect(MainRegion).not.to.be.null
        });

    });
});