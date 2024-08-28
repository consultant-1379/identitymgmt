define([
    'jscore/core',
    'usermgmtlib/Dictionary',
    'identitymgmtlib/widgets/ConfirmationSummaryDialog',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'usermgmtlib/widgets/ConfirmationDeleteUsersDialog/ConfirmationDeleteUsersDialog'
], function(core, Dictionary, ConfirmationSummaryDialog, UserManagementService, responseHandler, ConfirmationDeleteUsersDialog) {
    'use strict';


    describe('ConfirmationDeleteUsersDialog', function() {

        describe('ConfirmationDeleteUsersDialog - Method showConfirmationDeleteUsersDialog', function() {

            var sandbox, server, confirmationDeleteUsersDialog, confirmationSummaryDialog, callbackResolve, callbackReject;
            beforeEach(function() {
                sandbox = sinon.sandbox.create();
                server = sinon.fakeServer.create();
                confirmationDeleteUsersDialog = new ConfirmationDeleteUsersDialog();
                sandbox.stub(responseHandler, 'setNotificationError');
                sandbox.stub(responseHandler, 'setNotificationSuccess');

                confirmationSummaryDialog = new ConfirmationSummaryDialog({
                    elementNameColumnHeader: "1",
                    type: "warning",
                    elementsArray: [],
                    header: "1",
                    info: "1",
                    statuses: [],
                    actions: [{
                        caption: "",
                        value: ""
                    }]
                });

                sandbox.stub(confirmationDeleteUsersDialog, 'getConfirmationSummaryDialog', function() {
                    return confirmationSummaryDialog;
                });
                sandbox.spy(confirmationDeleteUsersDialog, 'createConfirmationDeleteUsersDialog');
                sandbox.spy(confirmationDeleteUsersDialog, 'deleteUsers');


            });

            afterEach(function() {
                sandbox.restore();
                server.restore();
                confirmationSummaryDialog.hide();
            });
            it('Method showConfirmationDeleteUsersDialog - logged user - cancel', function(done) {

                var responseLoggedUsers = {
                    "users": {
                        "administrator": 7
                    }
                };
                var selectedUsers = [{
                    "username": "test"
                }, {
                    "username": "administrator"
                }];
                var loggedSelectedUsers = [{
                    "key": "test",
                    "status": false,
                    "text": "Inactive"
                }, {
                    "key": "administrator",
                    "status": true,
                    "text": "Active"
                }];
                var expLoggedSelectedUsers = [{
                    "key": "test",
                    "status": false,
                    "text": "Inactive"
                }, {
                    "key": "administrator",
                    "status": true,
                    "text": "Active"
                }];
                server.respondWith("GET", "/oss/sso/utilities/users", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(responseLoggedUsers)]);

                server.autoRespond = true;
                var outputPromise = confirmationDeleteUsersDialog.showConfirmationDeleteUsersDialog(selectedUsers);

                var callbackResolve = function() { confirmationSummaryDialog.trigger("dialog-confirmation", "cancel", loggedSelectedUsers) };
                var verify = outputPromise.then(callbackResolve);

                expect(verify).not.to.be.undefined;
                expect(verify).not.to.be.null;

                verify.then(function() {
                    expect(confirmationDeleteUsersDialog.createConfirmationDeleteUsersDialog.callCount).to.equal(1);
                    expect(confirmationDeleteUsersDialog.deleteUsers.callCount).to.equal(0);
                    expect(confirmationDeleteUsersDialog.createConfirmationDeleteUsersDialog.args[0][0]).to.deep.equal(expLoggedSelectedUsers);
                    done();
                }).catch(done);

            });



            it('Method showConfirmationDeleteUsersDialog - all inactive user - delete all users', function(done) {

                var responseLoggedUsers = {
                    "users": {
                        "administrator": 7
                    }
                };
                var selectedUsers = [{
                    "username": "test"
                }, {
                    "username": "administrator"
                }];
                var loggedSelectedUsers = [{
                    "key": "test",
                    "status": false,
                    "text": "Inactive"
                }, {
                    "key": "administrator",
                    "status": true,
                    "text": "Active"
                }];
                var expLoggedSelectedUsers = [{
                    "key": "test",
                    "status": false,
                    "text": "Inactive"
                }, {
                    "key": "administrator",
                    "status": true,
                    "text": "Active"
                }];
                server.respondWith("GET", "/oss/sso/utilities/users", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(responseLoggedUsers)]);

                server.autoRespond = true;
                var outputPromise = confirmationDeleteUsersDialog.showConfirmationDeleteUsersDialog(selectedUsers);

                var callbackResolve = function() { confirmationSummaryDialog.trigger("dialog-confirmation", "delete-all", loggedSelectedUsers) };
                var verify = outputPromise.then(callbackResolve);

                expect(verify).not.to.be.undefined;
                expect(verify).not.to.be.null;

                verify.then(function() {
                    expect(confirmationDeleteUsersDialog.createConfirmationDeleteUsersDialog.callCount).to.equal(1);
                    expect(confirmationDeleteUsersDialog.deleteUsers.callCount).to.equal(1);
                    expect(confirmationDeleteUsersDialog.deleteUsers.args[0][0]).to.deep.equal(["test", "administrator"]);
                    expect(confirmationDeleteUsersDialog.createConfirmationDeleteUsersDialog.args[0][0]).to.deep.equal(expLoggedSelectedUsers);
                    done();
                }).catch(done);

            });


            it('Method showConfirmationDeleteUsersDialog - all logged user - delete all users  ', function(done) {

                var responseLoggedUsers = {
                    "users": {
                        "administrator": 7,
                        "test": 12
                    }
                };
                var selectedUsers = [{
                    "username": "test"
                }, {
                    "username": "administrator"
                }];
                var loggedSelectedUsers = [{
                    "key": "test",
                    "status": true,
                    "text": "Active"
                }, {
                    "key": "administrator",
                    "status": true,
                    "text": "Active"
                }];
                var expLoggedSelectedUsers = [{
                    "key": "test",
                    "status": true,
                    "text": "Active"
                }, {
                    "key": "administrator",
                    "status": true,
                    "text": "Active"
                }];
                server.respondWith("GET", "/oss/sso/utilities/users", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(responseLoggedUsers)]);

                server.autoRespond = true;
                var outputPromise = confirmationDeleteUsersDialog.showConfirmationDeleteUsersDialog(selectedUsers);

                var callbackResolve = function() { confirmationSummaryDialog.trigger("dialog-confirmation", "delete-all", loggedSelectedUsers) };
                var verify = outputPromise.then(callbackResolve);

                expect(verify).not.to.be.undefined;
                expect(verify).not.to.be.null;

                verify.then(function() {
                    expect(confirmationDeleteUsersDialog.createConfirmationDeleteUsersDialog.callCount).to.equal(1);
                    expect(confirmationDeleteUsersDialog.deleteUsers.callCount).to.equal(1);
                    expect(confirmationDeleteUsersDialog.deleteUsers.args[0][0]).to.deep.equal(["test", "administrator"]);
                    expect(confirmationDeleteUsersDialog.createConfirmationDeleteUsersDialog.args[0][0]).to.deep.equal(expLoggedSelectedUsers);
                    done();
                }).catch(done);

            });

            it('Method showConfirmationDeleteUsersDialog - delete zero users ', function(done) {

                var responseLoggedUsers = {
                    "users": {
                        "no_name": 7
                    }
                };
                var selectedUsers = [{
                    "username": "test"
                }];
                var loggedSelectedUsers = [{
                    "key": "test",
                    "status": false,
                    "text": "Inactive"
                }];
                var expLoggedSelectedUsers = [{
                    "key": "test",
                    "status": false,
                    "text": "Inactive"
                }];
                server.respondWith("GET", "/oss/sso/utilities/users", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(responseLoggedUsers)]);

                server.autoRespond = true;
                var outputPromise = confirmationDeleteUsersDialog.showConfirmationDeleteUsersDialog(selectedUsers);

                var callbackResolve = function() { confirmationSummaryDialog.trigger("dialog-confirmation", "delete-all", loggedSelectedUsers) };
                var verify = outputPromise.then(callbackResolve);

                expect(verify).not.to.be.undefined;
                expect(verify).not.to.be.null;

                verify.then(function() {
                    expect(confirmationDeleteUsersDialog.createConfirmationDeleteUsersDialog.callCount).to.equal(1);
                    expect(confirmationDeleteUsersDialog.deleteUsers.callCount).to.equal(1);
                    expect(confirmationDeleteUsersDialog.deleteUsers.args[0][0]).to.deep.equal(["test"]);
                    expect(confirmationDeleteUsersDialog.createConfirmationDeleteUsersDialog.args[0][0]).to.deep.equal(expLoggedSelectedUsers);
                    done();
                }).catch(done);

            });



        });



        describe('ConfirmationDeleteUsersDialog - Method deleteUsers', function() {

            var sandbox, server, confirmationDeleteUsersDialog, callbackResolve, callbackReject;
            beforeEach(function() {
                sandbox = sinon.sandbox.create();
                server = sinon.fakeServer.create();
                confirmationDeleteUsersDialog = new ConfirmationDeleteUsersDialog();

            });

            afterEach(function() {
                sandbox.restore();
                server.restore();
            });



            it('check one deleteUser method', function(done) {

                var userNameList = ["testUser"];
                var serverResponse = [{
                    xhr: {
                        httpStatusCode: 204
                    },
                    rowValue: "testUser",
                    singleNotification: {
                        messageId: 'success_delete_user',
                        mode: 'success'
                    }
                }];

                var responseObj = [];
                var resolve = sinon.spy();
                var serverSucc = sinon.fakeServer.create();
                serverSucc.respondWith("DELETE",
                    "/oss/idm/usermanagement/users/" + userNameList[0], [204, {
                        "Content-Type": "text/plain; charset=UTF-8"
                    }, JSON.stringify(serverResponse)]
                );

                serverSucc.autoRespond = true;

                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService.requestDeleteUser(userNameList[0]).then(resolve, resolve);
                    })
                );

                Promise.all(responseObj).then(function(responses) {
                    expect(responses).not.to.be.undefined;
                    expect(responses).not.to.be.null;
                    confirmationDeleteUsersDialog.deleteUsers(userNameList);
                    expect(responses[0].rowValue).equal(serverResponse[0].rowValue);
                    done();
                }).catch(done);

            });

            it('check two deleteUser method', function(done) {

                var userNameList = ["testUser1", "testUser2"];
                var serverResponse = [{
                    xhr: {
                        httpStatusCode: 204
                    },
                    rowValue: "testUser1",
                    singleNotification: {
                        messageId: 'success_delete_user',
                        mode: 'success'
                    }
                }, {
                    xhr: {
                        httpStatusCode: 204
                    },
                    rowValue: "testUser2",
                    singleNotification: {
                        messageId: 'success_delete_user',
                        mode: 'success'
                    }
                }];

                var responseObj = [];
                var resolve = sinon.spy();
                var serverSucc = sinon.fakeServer.create();
                serverSucc.respondWith("DELETE",
                    "/oss/idm/usermanagement/users/" + userNameList[0], [204, {
                        "Content-Type": "text/plain; charset=UTF-8"
                    }, JSON.stringify([serverResponse[0]])]
                );
                serverSucc.respondWith("DELETE",
                    "/oss/idm/usermanagement/users/" + userNameList[1], [204, {
                        "Content-Type": "text/plain; charset=UTF-8"
                    }, JSON.stringify([serverResponse[1]])]
                );

                serverSucc.autoRespond = true;

                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService.requestDeleteUser(userNameList[0]).then(resolve, resolve);
                    })
                );
                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService.requestDeleteUser(userNameList[1]).then(resolve, resolve);
                    })
                );

                Promise.all(responseObj).then(function(responses) {
                    expect(responses).not.to.be.undefined;
                    expect(responses).not.to.be.null;
                    confirmationDeleteUsersDialog.deleteUsers(userNameList);
                    expect(responses[0].rowValue).equal(serverResponse[0].rowValue);
                    expect(responses[1].rowValue).equal(serverResponse[1].rowValue);
                    done();
                }).catch(done);

            });



        });

    });



});
