define([
    'jscore/core',
    'usermgmtchangepass/regions/mainregion/MainRegion',
    'usermgmtchangepass/widgets/UserMgmtChangePassWidget/UserMgmtChangePassWidget',
    'identitymgmtlib/mvp/binding'
], function(core, MainRegion, UserMgmtChangePassWidget, binding) {
    'use strict';

    describe('MainRegion', function() {

        var sandbox, mainRegion, options, refreshDataStub, viewStub, addEventHandlerStub, model;

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
            sandbox.stub(UserMgmtChangePassWidget.prototype, 'onViewReady');
            mainRegion = new MainRegion(options);

        });

        afterEach(function() {
            sandbox.restore();
        });

        it('MainRegion should be defined', function() {
            expect(MainRegion).not.to.be.undefined;
            expect(MainRegion).not.to.be.null;
        });

    });
});