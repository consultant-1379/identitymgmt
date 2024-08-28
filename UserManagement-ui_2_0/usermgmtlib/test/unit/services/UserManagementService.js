define([
    'usermgmtlib/services/UserManagementService'
], function(UserManagementService){
    'use strict';
    describe('UserManagementService', function(){
    	var sandbox, server, callbackResolve, callbackReject;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            server = sinon.fakeServer.create();
        });

        afterEach(function() {
            sandbox.restore();
            server.restore();
        });

        it('UserManagementService should be defined', function(){
            expect(UserManagementService).not.to.be.undefined;
            expect(UserManagementService).not.to.be.null;
        });

        it('getEnforceUserHardeningState success', function(done){
            var serverResponse = [{
                xhr: {
                    httpStatusCode: 200
                },
                data: "true",
            }];

            var responseObj = [];
            var resolve = sinon.spy();
            var serverSucc = sinon.fakeServer.create();
            serverSucc.respondWith("GET",
                "/oss/idm/usermanagement/enforceduserhardening", [200, {
                    "Content-Type": "text/plain; charset=UTF-8"
                }, JSON.stringify(serverResponse)]
            );

            serverSucc.autoRespond = true;

            responseObj.push(
                new Promise(function(resolve, reject) {
                    UserManagementService.getEnforceUserHardeningState().then(resolve, resolve);
                })
            );

            Promise.all(responseObj).then(function(responses) {
                expect(responses).not.to.be.undefined;
                expect(responses).not.to.be.null;
                done();
            }).catch(done);
        });

        it('getEnforceUserHardeningState error', function(done){
            var serverResponse = [{
                xhr: {
                    httpStatusCode: 404
                }
            }];

            var responseObj = [];
            var resolve = sinon.spy();
            var serverSucc = sinon.fakeServer.create();
            serverSucc.respondWith("GET",
                "/oss/idm/usermanagement/enforceduserhardening", [404, {
                    "Content-Type": "text/plain; charset=UTF-8"
                }, JSON.stringify(serverResponse)]
            );

            serverSucc.autoRespond = true;

            responseObj.push(
                new Promise(function(resolve, reject) {
                    UserManagementService.getEnforceUserHardeningState().then(resolve, resolve);
                })
            );

            Promise.all(responseObj).then(function(responses) {
                expect(responses).not.to.be.undefined;
                expect(responses).not.to.be.null;
                done();
            }).catch(done);
        });

        it('setEnableDisableUser success', function(done){

            var serverResponse = [{
                xhr: {
                    httpStatusCode: 200
                },
                data: {},
            }];

            var responseObj = [];
            var resolve = sinon.spy();
            var serverSucc = sinon.fakeServer.create();
            serverSucc.respondWith("PUT",
                "/oss/idm/usermanagement/users/administrator", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(serverResponse)]
            );

            serverSucc.autoRespond = true;

            responseObj.push(
                new Promise(function(resolve, reject) {
                    UserManagementService.setEnableDisableUser("administrator", "enabled").then(resolve, resolve);
                })
            );

            Promise.all(responseObj).then(function(responses) {
                expect(responses).not.to.be.undefined;
                expect(responses).not.to.be.null;
                done();
            }).catch(done);

        });

        it('setEnableDisableUser error', function(done){

            var serverResponse = [{
                xhr: {
                    httpStatusCode: 404
                }
            }];

            var responseObj = [];
            var resolve = sinon.spy();
            var serverSucc = sinon.fakeServer.create();
            serverSucc.respondWith("GET",
                "/oss/idm/usermanagement/users/user", [404, {
                    "Content-Type": "text/plain; charset=UTF-8"
                }, JSON.stringify(serverResponse)]
            );

            serverSucc.autoRespond = true;

            responseObj.push(
                new Promise(function(resolve, reject) {
                    UserManagementService.setEnableDisableUser("administrator", "enabled").then(resolve, resolve);
                })
            );

            Promise.all(responseObj).then(function(responses) {
                expect(responses).not.to.be.undefined;
                expect(responses).not.to.be.null;
                done();
            }).catch(done);

        });

        it('getOdpProfiles success', function(done){
            var odpProfiles = [{
                applicationName: [ "AMOS" ],
                profileNames: [ "Small EM", "Large EM", "Medium EM"]
            },
            {
                applicationName: [ "Element Manager" ],
                profileNames: [ "Small EM", "Large EM", "Medium EM"]
            }];

            var serverResponse = [{
                xhr: {
                    httpStatusCode: 200
                },
                data: odpProfiles,
            }];

            var responseObj = [];
            var resolve = sinon.spy();
            var serverSucc = sinon.fakeServer.create();
            serverSucc.respondWith("GET",
                "/oss/idm/usermanagement/odpProfiles", [200, {
                    "Content-Type": "text/plain; charset=UTF-8"
                }, JSON.stringify(serverResponse)]
            );

            serverSucc.autoRespond = true;

            responseObj.push(
                new Promise(function(resolve, reject) {
                    UserManagementService.getOdpProfiles().then(resolve, resolve);
                })
            );

            Promise.all(responseObj).then(function(responses) {
                expect(responses).not.to.be.undefined;
                expect(responses).not.to.be.null;
                done();
            }).catch(done);
        });

         it('getOdpProfiles error', function(done){
            var serverResponse = [{
                xhr: {
                    httpStatusCode: 404
                }
            }];

            var responseObj = [];
            var resolve = sinon.spy();
            var serverSucc = sinon.fakeServer.create();
            serverSucc.respondWith("GET",
                "/oss/idm/usermanagement/odpProfiles", [404, {
                    "Content-Type": "text/plain; charset=UTF-8"
                }, JSON.stringify(serverResponse)]
            );

            serverSucc.autoRespond = true;

            responseObj.push(
                new Promise(function(resolve, reject) {
                    UserManagementService.getOdpProfiles().then(resolve, resolve);
                })
            );

            Promise.all(responseObj).then(function(responses) {
                expect(responses).not.to.be.undefined;
                expect(responses).not.to.be.null;
                done();
            }).catch(done);

        });
    });
});