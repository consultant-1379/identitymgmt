define([
    'jscore/core',
    'jscore/ext/net',
    'identitymgmtlib/utils/AccessControlService'
], function(core, net, accessControlService) {

    describe("AccessControlService", function() {
        //variables
        var sandbox;
        var restUrl = '/rest/apps';
        var restUrl2 = '/oss/uiaccesscontrol/resources/wrongIdentityManagementApp/actions';

        beforeEach(function() {
            //Setup to prepare fake stuffs
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('isAppAvailable()', function() {

            it('Should make an ajax request for apps with success callback', function() {

                //Setup for this test
                var data = {
                    "resource":"some_management",
                    "actions":["read","create","update","delete"]
                };

                var callback = sinon.spy();

                sandbox.stub(net, "ajax").yieldsTo("success", data);

                expect(net.ajax.callCount).to.equal(0);
                expect(callback.called).to.equal(false);
                expect(callback.calledWith(true)).to.equal(false);

                //Acting
                accessControlService.isAppAvailable("some_management", callback);

                //Assertion
                expect(callback.called).to.equal(true);
                expect(callback.calledWith(true)).to.equal(true);

            });

            it('Should make an ajax request for apps with success callback but for not existing application', function() {

                //Setup for this test
                var data = [{
                    "id": "some_management",
                    "name": "Some Management",
                    "shortInfo": "Some Management is a web based application that allows the Security Administrator to create, delete some resources and provide them access to ENM tools.",
                    "acronym": null,
                    "favorite": "false",
                    "resources": null,
                    "hidden": false,
                    "roles": "",
                    "targetUri": "https://enmapache.athtem.eei.ericsson.se/#somemanagement",
                    "uri": "/rest/apps/web/some_management"
                }];

                var callback = sinon.spy();

                sandbox.stub(net, "ajax").yieldsTo("error");

                expect(net.ajax.callCount).to.equal(0);
                expect(callback.called).to.equal(false);
                expect(callback.calledWith(false)).to.equal(false);

                //Acting
                accessControlService.isAppAvailable("not_existing_application", callback);

                //Assertion
                expect(net.ajax.callCount).to.equal(2);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: restUrl2,
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);

                expect(callback.called).to.equal(true);
                expect(callback.calledWith(false)).to.equal(true);

            });

            it('Should make an ajax request for apps with error callback', function() {

                //Setup for this test
                var callback = sinon.spy();

                sandbox.stub(net, "ajax").yieldsTo("error");

                expect(net.ajax.callCount).to.equal(0);
                expect(callback.called).to.equal(false);
                expect(callback.calledWith(false)).to.equal(false);

                //Acting
                accessControlService.isAppAvailable("some_management", callback);

                //Assertion
                expect(net.ajax.callCount).to.equal(2);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: restUrl2,
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);
                expect(net.ajax.getCall(1).calledWithMatch({
                    url: restUrl,
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);

                expect(callback.called).to.equal(true);
                expect(callback.calledWith(false)).to.equal(true);

            });
        });
    });
});
