define([
    'jscore/core',
    'usermgmtprofile/regions/mainregion/MainRegion',
    'usermgmtprofile/widgets/RoleAssignTableWidget/RoleAssignTableWidget',
    'identitymgmtlib/mvp/binding',
    'usermgmtlib/model/UserProfileModel'
], function(core, MainRegion, RoleAssignTableWidget, binding, UserProfileModel) {
    'use strict';

    describe('MainRegion', function() {

        var sandbox, mainRegion, options, refreshDataStub, viewStub, addEventHandlerStub, model;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            model = new UserProfileModel();
            options = {
                model: model,
                odpProfiles: [],
                type: 'edit'
            };

            viewStub = {
                findById: function() {}
            };

            sandbox.spy(viewStub, 'findById');

            sandbox.stub(binding, 'bind');
            sandbox.stub(RoleAssignTableWidget.prototype, 'onViewReady');

            sandbox.spy(model.get('privileges'), 'sort');
            sandbox.spy(model.get('privileges'), 'toJSONwithModels');
            sandbox.stub(model.get('privileges'), 'searchMap', function() {
                return model.get('privileges');
            });

            mainRegion = new MainRegion(options);

            mainRegion.view = viewStub;

        });

        afterEach(function() {
            sandbox.restore();
        });

        it('MainRegion should be defined', function() {
            expect(MainRegion).not.to.be.undefined;
            expect(MainRegion).not.to.be.null;
        });

        describe('onStart()', function() {
            beforeEach(function() {
                mainRegion.onStart();
            });

            it('Should refresh data on view with privilegesTable', function() {
                model.get('privileges').trigger('fetched');
                expect(model.get('privileges').sort.callCount).to.equal(1);
                expect(model.get('privileges').sort.getCall(0).args[0]).to.equal('name');
                expect(model.get('privileges').sort.getCall(0).args[1]).to.equal('asc');
                expect(model.get('privileges').searchMap.callCount).to.equal(1);
                expect(model.get('privileges').searchMap.getCall(0).args[0]).to.equal('');
                expect(model.get('privileges').searchMap.getCall(0).args[1]).to.deep.equal(['name']);
                expect(model.get('privileges').toJSONwithModels.callCount).to.equal(1);
            });

        });
    });
});