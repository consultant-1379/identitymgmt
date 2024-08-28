define([
    'usermanagement/widgets/federatedStatusNotification/FederatedStatusNotification',
    'usermgmtlib/services/UserManagementService',
    'usermanagement/Dictionary',
    'usermgmtlib/widgets/ExpandableNotification'
], function(FederatedStatusNotification, UserManagementService, Dictionary,Notification) {
    "use strict";

    describe('FederatedStatusNotification', function() {
        it('Should create Notification', function() {
            var resolve = sinon.spy();
            var responseObj = [];

            var serverResponse = {
                "adminState" : "enabled",
                "operState" : "forcedSyncInProgress",
                "progressReport" : "externallySearching"
            };

            var server = sinon.fakeServer.create();
            server.respondWith("GET", "/oss/fidm/sync/state", [200,
                    { "Content-Type": "application/json" },
                       JSON.stringify(serverResponse)
                    ]);
            server.autoRespond = true;

            sinon.stub(FederatedStatusNotification.prototype, 'createNotification', function(label) {
                expect(label).to.equal(Dictionary.operState.forcedSyncInProgress);
                return new Notification({ label: label + " - [Refresh]()" });
            });
            var federatedStatusNotification = new FederatedStatusNotification();
            expect(federatedStatusNotification).to.be.defined;
        });
    });
});