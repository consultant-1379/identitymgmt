define([
    'jscore/core',
    'container/api',
    'usermanagement/regions/mainregion/MainRegion',
    'identitymgmtlib/widgets/TableSelectionInfoWidget',
    'identitymgmtlib/PaginatedTable',
    'identitymgmtlib/widgets/ShowRows',
    'identitymgmtlib/DataHandler',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'usermgmtlib/services/UserManagementService'
], function(core,container,MainRegion, TableSelectionInfoWidget, PaginatedTable, ShowRows, DataHandler, ResponseHandler, UserManagementService) {
    'use strict';

    describe('MainRegion', function() {
        var sandbox, mainRegion, eventBusStub,containerBusStub, mockContext, multiSlidingPanel;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            eventBusStub = new core.EventBus();
            containerBusStub = new core.EventBus();
            mockContext = new core.AppContext();
            multiSlidingPanel = {isShown: function() { return false;}};
            mockContext.eventBus = eventBusStub;
            mainRegion = new MainRegion({isFederatedView: false});
            mainRegion.paginatedTable = new PaginatedTable({ url: '/oss/idm/usermanagement/users' });
            mainRegion.dataHandler = new DataHandler();
            mainRegion.setMSP(multiSlidingPanel);

            sandbox.stub(mainRegion, 'getContext', function() {
                return mockContext;
            });

            sandbox.stub(mainRegion, 'getEventBus', function() {
                return eventBusStub;
            });

            sandbox.stub(container, 'getEventBus', function() {
                 return containerBusStub;
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('MainRegion should be defined', function() {
            expect(MainRegion).not.to.be.undefined;
            expect(MainRegion).not.to.be.null;
        });

        describe('onViewReady()', function() {
            var setupTableSpy, setupDataHandler, setupShowRows, setupTableSettings, startWebpushImportChannels;
            beforeEach(function() {
                setupTableSpy = sandbox.spy(mainRegion, 'setupTable');
                setupDataHandler = sandbox.spy(mainRegion, 'setupDataHandler');
                setupShowRows = sandbox.spy(mainRegion, 'setupShowRows');
                setupTableSettings = sandbox.spy(mainRegion, 'setupTableSettings');
                startWebpushImportChannels = sandbox.spy(mainRegion, 'startWebpushImportChannels');

                mainRegion.onViewReady();

            });

            it('Should call setup methods', function() {
                expect(setupTableSpy.calledOnce).to.equal(true);
                expect(setupDataHandler.calledOnce).to.equal(true);
                expect(setupShowRows.calledOnce).to.equal(true);
                expect(setupTableSettings.calledOnce).to.equal(true);
                expect(startWebpushImportChannels.calledOnce).to.equal(true);
            });
         });

         describe('TableSettings', function() {
                    var paginatedTableSpy,publishStub;

                    beforeEach(function() {
                        publishStub = sandbox.stub(containerBusStub, 'publish');
                        mainRegion.onViewReady();
                        paginatedTableSpy = sandbox.spy(PaginatedTable.prototype, 'init');
                    });

                    it('Should open flyOut', function() {
                        mainRegion.tableSettings.onTableSettings();
                        expect(publishStub.calledOnce).to.equal(true);
                    });

                     it('Should recreate the paginated table', function() {

                        mainRegion.tableSettings.onTableSettings();
                        mainRegion.tableSettings.settingsForm.applySettings();
                        expect(publishStub.callCount).to.equal(2);
                        expect(paginatedTableSpy.calledOnce).to.equal(true);
                      });

         });


        describe('setupTable()', function() {
            var paginatedTableSpy, tableSelectionInfoWidget, showRowsSpy;
            beforeEach(function() {
                mainRegion.paginatedTable = null;
                paginatedTableSpy = sandbox.spy(PaginatedTable.prototype, 'init');
                tableSelectionInfoWidget = sandbox.spy(TableSelectionInfoWidget.prototype, 'init');
                showRowsSpy = sandbox.spy(ShowRows.prototype, 'init');
            });
            it('Should setup table', function() {
                mainRegion.showRows = new ShowRows();
                mainRegion.setupTable();
                expect(paginatedTableSpy.calledOnce).to.equal(true);
                expect(tableSelectionInfoWidget.calledOnce).to.equal(true);
                expect(showRowsSpy.calledOnce).to.equal(true);
            });
        });

        describe('getTable()', function() {
            it('Should get table', function() {
                var output = mainRegion.getTable();

                expect(output).not.to.be.null;
                expect(output).not.to.be.undefined;
                expect(output).to.equal(mainRegion.paginatedTable);
            });
        });

        describe('refreshDataNeeded()', function() {
            it('Should refresh data', function() {
                mainRegion.refreshDataNeeded();

                expect(mainRegion.forceXHR).to.equal(true);
            });
        });

        describe('addEventHandlers()', function() {
            var subscribeStub, publishStub, triggerContextActionsStub;
            beforeEach(function() {
                subscribeStub = sandbox.stub(eventBusStub, 'subscribe');
                publishStub = sandbox.stub(eventBusStub, 'publish');
                sandbox.stub(mainRegion.paginatedTable, 'addEventHandler');
                sandbox.stub(mainRegion.paginatedTable, 'setQueryParams');
                triggerContextActionsStub = sandbox.stub(mainRegion, 'triggerContextActions');
                sandbox.spy(mainRegion,'forcePasswordShowResult');
                sandbox.spy(mainRegion,'showConfirmationDeleteUsersDialog');
                sandbox.spy(mainRegion,'terminateSessionsShowResult');
                sandbox.spy(mainRegion,'revokeCertificate');
                sandbox.spy(mainRegion,'profileSummaryTrigger');
                sandbox.spy(mainRegion,'exportProfiles');
                sandbox.spy(mainRegion,'enableDisableUser');

                mainRegion.addEventHandlers();
                mainRegion.addSubscribtions();
            });


            it('Should subscribe to event and handle pageloaded', function() {
                expect(subscribeStub.getCall(0).args[0]).to.equal('locationcontroller:queryparamsupdated');
                expect(mainRegion.paginatedTable.addEventHandler.callCount).to.equal(2);
                expect(mainRegion.paginatedTable.addEventHandler.getCall(0).args[0]).to.equal('pageloaded');
                expect(mainRegion.paginatedTable.addEventHandler.getCall(0).args[1]).to.be.function;
                expect(mainRegion.paginatedTable.addEventHandler.getCall(1).args[0]).to.equal('checkend');
                expect(mainRegion.paginatedTable.addEventHandler.getCall(1).args[1]).to.be.function;
            });

            it('Should subscribe action: forcePasswordChange, deleteUsers, importUsers, export, duplicateProfile, create, terminateSessions, revokeCertificate, viewSummary', function(){
                var callback;
                expect(eventBusStub.subscribe.callCount).to.equal(15);

                expect(eventBusStub.subscribe.getCall(2).args[0]).to.equal('action:forcePasswordChange');
                callback = eventBusStub.subscribe.getCall(2).args[1];
                expect(callback).to.be.function;
                callback.call(mainRegion);
                expect(mainRegion.forcePasswordShowResult.calledOnce).to.equal(true);

                expect(eventBusStub.subscribe.getCall(3).args[0]).to.equal('action:enableDisableUser');
                callback = eventBusStub.subscribe.getCall(3).args[1];
                expect(callback).to.be.function;
                callback.call(mainRegion);
                expect(mainRegion.enableDisableUser.calledOnce).to.equal(true);

                expect(eventBusStub.subscribe.getCall(4).args[0]).to.equal('action:deleteUsers');
                callback = eventBusStub.subscribe.getCall(4).args[1];
                expect(callback).to.be.function;
                callback.call(mainRegion);
                expect(mainRegion.showConfirmationDeleteUsersDialog.calledOnce).to.equal(true);

                expect(eventBusStub.subscribe.getCall(7).args[0]).to.equal('action:editProfile');
                expect(eventBusStub.subscribe.getCall(8).args[0]).to.equal('action:duplicateProfile');
                expect(eventBusStub.subscribe.getCall(9).args[0]).to.equal('action:create');

                expect(eventBusStub.subscribe.getCall(10).args[0]).to.equal('action:terminateSessions');
                callback = eventBusStub.subscribe.getCall(10).args[1];
                expect(callback).to.be.function;
                callback.call(mainRegion);
                expect(mainRegion.terminateSessionsShowResult.calledOnce).to.equal(true);

                expect(eventBusStub.subscribe.getCall(11).args[0]).to.equal('action:revokeCertificate');
                callback = eventBusStub.subscribe.getCall(11).args[1];
                expect(callback).to.be.function;
                callback.call(mainRegion);
                expect(mainRegion.revokeCertificate.calledOnce).to.equal(true);

                expect(eventBusStub.subscribe.getCall(12).args[0]).to.equal('action:viewSummary');
                callback = eventBusStub.subscribe.getCall(12).args[1];
                expect(callback).to.be.function;
                callback.call(mainRegion);
                expect(mainRegion.profileSummaryTrigger.calledOnce).to.equal(true);

            });
        });

        describe('triggerContextActions()', function() {
            var checkedRowsNumber, publishStub;
            beforeEach(function() {
                publishStub = sandbox.stub(eventBusStub, 'publish');
            });
            it('1 checked rows-> should publish topsection with contextactions', function() {
                checkedRowsNumber = 1;
                mainRegion.triggerContextActions(checkedRowsNumber);
                expect(publishStub.calledOnce).to.equal(true);
                expect(publishStub.getCall(0).args[0]).to.equal('topsection:contextactions');

            });
        });
        describe('profileSummaryTrigger()', function(){
            var publishStub;

            beforeEach(function() {
                publishStub = sandbox.stub(eventBusStub, 'publish');
            });

            it('When filter is visible, profile summary should be shown', function(){
                multiSlidingPanel = {isShown : function() {return true;}};

                mainRegion.visiblePanel = "Filter";
                mainRegion.profileSummaryTrigger();

                expect(publishStub.calledOnce).to.equal(true);
                expect(publishStub.getCall(0).args[0]).to.equal('layouts:showpanel');

            });

            it('When profile summary is visible, it should be closed', function(){
                sandbox.stub(multiSlidingPanel, 'isShown', function() {
                    return true;
                });
                mainRegion.visiblePanel = "profileSummary";
                mainRegion.profileSummaryTrigger();

                expect(publishStub.calledOnce).to.equal(true);
                expect(publishStub.getCall(0).args[0]).to.equal('layouts:closerightpanel');
            });

            it('When nothing is visible, profile summary should be shown', function(){
                sandbox.stub(multiSlidingPanel, 'isShown', function() {
                    return false;
                });
                mainRegion.visiblePanel = "none";
                mainRegion.profileSummaryTrigger();

                expect(publishStub.calledOnce).to.equal(true);
                expect(publishStub.getCall(0).args[0]).to.equal('layouts:showpanel');
            });

        });

        describe('updateProfileSummary', function(){
            var publishStub;

            beforeEach(function() {
                publishStub = sandbox.stub(eventBusStub, 'publish');
            });
            it('Should show panel with updated profile summary\'s data', function(){
                mainRegion.updateProfileSummary();

                expect(publishStub.calledOnce).to.equal(true);
                expect(publishStub.getCall(0).args[0]).to.equal('layouts:showpanel');
            });
        });

        describe('forcePasswordShowResult()', function() {
            var forcePasswordShowResultSpy, responseHandler, mainRegion;
            beforeEach(function() {
                mainRegion = new MainRegion();

                responseHandler = ResponseHandler.getInstance();
                mainRegion.responseHandler = responseHandler;

                //below works but cannot checkcallCount
                // setNotificationStub = sinon.stub(mainRegion.responseHandler, 'setNotification', function(){
                //     console.log('STUB')
                // });

                forcePasswordShowResultSpy = sinon.spy(mainRegion, 'forcePasswordShowResult');

            });

            afterEach(function() {
                mainRegion.forcePasswordShowResult.restore();
            });

            // TODO: make 'it' for Array of two XHRs

            it('should call response handler for 1 request /error/', function(done) {
                var selectedRows = [{
                    username: "administrator"
                }]
                mainRegion.selectedRows = selectedRows;

                var resolve = sinon.spy();
                var responseObj = [];

                var serverResponse = {
                    userMessage: "Force password change for user administrator is not allowed.",
                    httpStatusCode: 412,
                    internalErrorCode: "1.45",
                    developerMessage: "Cannot force change Security Admin password",
                    time: "2016-04-27T12:59:33",
                    links: []
                };

                var serverErr = sinon.fakeServer.create();
                serverErr.respondWith("PUT",
                    "/oss/idm/usermanagement/users/administrator/forcepasswordchange", [412,
                        { "Content-Type": "application/json" },
                        JSON.stringify(serverResponse)
                    ]);
                serverErr.autoRespond = true;

                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService
                            .setForcePasswordChange(mainRegion.selectedRows[0].username, true)
                            .then(resolve, resolve);
                    })

                );

                Promise.all(responseObj).then(function(responses) {
                    var response = responses[0];

                    expect(response).not.to.be.undefined;
                    expect(response).not.to.be.null;
                    expect(response.xhr.getStatus()).to.equals(serverResponse.httpStatusCode);
                    expect(response.xhr.getResponseJSON().internalErrorCode).to.equals(serverResponse.internalErrorCode);
                    expect(response.rowValue).to.equals(mainRegion.selectedRows[0].username);

                    mainRegion.forcePasswordShowResult(true);
                    expect(forcePasswordShowResultSpy.callCount).to.equals(1);
                    //0 to exual 1
                    // expect(setNotificationStub.callCount).to.equal(1);
                    done();
                }).catch(done);
            });

            it('should call response handler for 1 request /success/ with true', function(done) {
                var selectedRows = [{
                    username: "userMW"
                }]
                mainRegion.selectedRows = selectedRows;

                var resolve = sinon.spy();
                var responseObj = [];

                var serverResponse = {
                    httpStatusCode: 204,
                };

                var serverSucc = sinon.fakeServer.create();
                serverSucc.respondWith("PUT",
                    "/oss/idm/usermanagement/users/userMW/forcepasswordchange", [204,
                        { "Content-Type": "text/plain; charset=UTF-8" },
                        JSON.stringify(serverResponse)
                    ]);

                serverSucc.autoRespond = true;

                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService
                            .setForcePasswordChange(mainRegion.selectedRows[0].username, true)
                            .then(resolve, resolve);
                    })
                );

                Promise.all(responseObj).then(function(responses) {
                    var response = responses[0];

                    expect(response).not.to.be.undefined;
                    expect(response).not.to.be.null;
                    expect(response.xhr.getStatus()).to.equals(serverResponse.httpStatusCode);
                    // expect(response.xhr.getResponseJSON().internalErrorCode).to.equals(serverResponse.internalErrorCode);
                    expect(response.rowValue).to.equals(mainRegion.selectedRows[0].username);

                    mainRegion.forcePasswordShowResult(true);
                    expect(forcePasswordShowResultSpy.callCount).to.equals(1);
                    //0 to exual 1
                    // expect(setNotificationStub.callCount).to.equal(1);
                    done();
                }).catch(done);
            });

            it('should call response handler for 1 request /success/ with false', function(done) {
                var selectedRows = [{
                    username: "userMW"

                }]
                mainRegion.selectedRows = selectedRows;

                var resolve = sinon.spy();
                var responseObj = [];

                var serverResponse = {
                    httpStatusCode: 204,
                };

                var serverSucc = sinon.fakeServer.create();
                serverSucc.respondWith("PUT",
                    "/oss/idm/usermanagement/users/userMW/forcepasswordchange", [204,
                        { "Content-Type": "text/plain; charset=UTF-8" },
                        JSON.stringify(serverResponse)
                    ]);

                serverSucc.autoRespond = true;

                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService
                            .setForcePasswordChange(mainRegion.selectedRows[0].username, false)
                            .then(resolve, resolve);
                    })
                );

                Promise.all(responseObj).then(function(responses) {
                    var response = responses[0];

                    expect(response).not.to.be.undefined;
                    expect(response).not.to.be.null;
                    expect(response.xhr.getStatus()).to.equals(serverResponse.httpStatusCode);
                    // expect(response.xhr.getResponseJSON().internalErrorCode).to.equals(serverResponse.internalErrorCode);
                    expect(response.rowValue).to.equals(mainRegion.selectedRows[0].username);

                    mainRegion.forcePasswordShowResult(true);
                    expect(forcePasswordShowResultSpy.callCount).to.equals(1);
                    //0 to exual 1
                    // expect(setNotificationStub.callCount).to.equal(1);
                    done();
                }).catch(done);
            });

        });


        describe('terminateSessionsShowResult()', function() {
            var terminateSessionsShowResultSpy, responseHandler, mainRegion;
            beforeEach(function() {
                mainRegion = new MainRegion();
                mainRegion.paginatedTable = new PaginatedTable({ url: '/oss/idm/usermanagement/users' });

                responseHandler = ResponseHandler.getInstance();
                mainRegion.responseHandler = responseHandler;

                //below works but cannot checkcallCount
                // setNotificationStub = sinon.stub(mainRegion.responseHandler, 'setNotification', function(){
                //     console.log('STUB')
                // });

                terminateSessionsShowResultSpy = sinon.spy(mainRegion, 'terminateSessionsShowResult');

            });

            afterEach(function() {
                mainRegion.terminateSessionsShowResult.restore();
            });

            it('should call response handler for 1 request /success/', function(done) {
                
                sandbox.stub(mainRegion.paginatedTable, 'refreshData', function() {});

                var selectedRows = [{
                    username: "userMW"
                }]
                mainRegion.selectedRows = selectedRows;

                var resolve = sinon.spy();
                var responseObj = [];

                var serverResponse = {
                    httpStatusCode: 204,
                };

                var serverSucc = sinon.fakeServer.create();
                serverSucc.respondWith("DELETE",
                    "/oss/sso/utilities/users/" + mainRegion.selectedRows[0].username, [204,
                        { "Content-Type": "text/plain; charset=UTF-8" },
                        JSON.stringify(serverResponse)
                    ]);

                serverSucc.autoRespond = true;

                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService
                            .setTerminateSessions(mainRegion.selectedRows[0].username)
                            .then(resolve, resolve);
                    })
                );

                Promise.all(responseObj).then(function(responses) {
                    var response = responses[0];

                    expect(response).not.to.be.undefined;
                    expect(response).not.to.be.null;
                    expect(response.xhr.getStatus()).to.equals(serverResponse.httpStatusCode);
                    expect(response.rowValue).to.equals(mainRegion.selectedRows[0].username);

                    mainRegion.terminateSessionsShowResult();
                    expect(terminateSessionsShowResultSpy.callCount).to.equals(1);
                    //0 to exual 1
                    // expect(setNotificationStub.callCount).to.equal(1);
                    done();
                }).catch(done);
            });

        });

        describe('revokeCertificate()', function() {
            var revokeCertificateSpy, responseHandler, mainRegion;
            beforeEach(function() {
                mainRegion = new MainRegion();
                mainRegion.paginatedTable = new PaginatedTable({ url: '/oss/idm/usermanagement/users' });

                responseHandler = ResponseHandler.getInstance();
                mainRegion.responseHandler = responseHandler;
                revokeCertificateSpy = sinon.spy(mainRegion, 'revokeCertificate');

            });

            afterEach(function() {
                mainRegion.revokeCertificate.restore();
            });

            it('should call response handler for 1 request /success/', function(done) {

                sandbox.stub(mainRegion.paginatedTable, 'refreshData', function() {});

                var selectedRows = [{
                    username: "userMW"
                }]
                mainRegion.selectedRows = selectedRows;

                var resolve = sinon.spy();
                var responseObj = [];

                var serverResponse = {
                    httpStatusCode: 204,
                };

                var serverSucc = sinon.fakeServer.create();
                serverSucc.respondWith("DELETE",
                    "/oss/sls/credentials/users/" + mainRegion.selectedRows[0].username + "/nodetypes", [204,
                        { "Content-Type": "text/plain; charset=UTF-8" },
                        JSON.stringify(serverResponse)
                    ]);

                serverSucc.autoRespond = true;

                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService
                            .requestRevokeCertificate(mainRegion.selectedRows[0].username)
                            .then(resolve, resolve);
                    })
                );

                Promise.all(responseObj).then(function(responses) {
                    var response = responses[0];

                    expect(response).not.to.be.undefined;
                    expect(response).not.to.be.null;
                    expect(response.xhr.getStatus()).to.equals(serverResponse.httpStatusCode);
                    expect(response.rowValue).to.equals(mainRegion.selectedRows[0].username);

                    mainRegion.revokeCertificate();
                    expect(revokeCertificateSpy.callCount).to.equals(1);
                    done();
                }).catch(done);
            });

        });
    });

        describe('MainRegion: Federated User', function() {
            var sandbox, mainRegion, eventBusStub,containerBusStub, mockContext, multiSlidingPanel;

            beforeEach(function() {
                sandbox = sinon.sandbox.create();
                eventBusStub = new core.EventBus();
                containerBusStub = new core.EventBus();
                mockContext = new core.AppContext();
                multiSlidingPanel = {isShown: function() { return false;}};
                mockContext.eventBus = eventBusStub;
                mainRegion = new MainRegion({isFederatedView: true});
                mainRegion.paginatedTable = new PaginatedTable({ url: '/oss/idm/usermanagement/users' });
                mainRegion.dataHandler = new DataHandler();
                mainRegion.setMSP(multiSlidingPanel);

                sandbox.stub(mainRegion, 'getContext', function() {
                    return mockContext;
                });

                sandbox.stub(mainRegion, 'getEventBus', function() {
                    return eventBusStub;
                });

                sandbox.stub(container, 'getEventBus', function() {
                     return containerBusStub;
                });
            });

            afterEach(function() {
                sandbox.restore();
            });

            it('MainRegion (federated users) should be defined', function() {
                expect(MainRegion).not.to.be.undefined;
                expect(MainRegion).not.to.be.null;
            });

            describe('onViewReady()', function() {
                var setupTableSpy, setupDataHandler, setupShowRows, setupTableSettings, startWebpushImportChannels;
                beforeEach(function() {
                    setupTableSpy = sandbox.spy(mainRegion, 'setupTable');
                    setupDataHandler = sandbox.spy(mainRegion, 'setupDataHandler');
                    setupShowRows = sandbox.spy(mainRegion, 'setupShowRows');
                    setupTableSettings = sandbox.spy(mainRegion, 'setupTableSettings');
                    startWebpushImportChannels = sandbox.spy(mainRegion, 'startWebpushImportChannels');

                });

                it('Should call setup methods (federated users)', function() {
                    mainRegion.init({"isFederatedView": true})
                    mainRegion.onViewReady();
                    expect(setupTableSpy.calledOnce).to.equal(true);
                    expect(setupDataHandler.calledOnce).to.equal(true);
                    expect(setupShowRows.calledOnce).to.equal(true);
                    expect(setupTableSettings.calledOnce).to.equal(true);
                    expect(startWebpushImportChannels.calledOnce).to.equal(true);
                });

            });

            describe('addEventHandlers() (federated users)', function() {
                var subscribeStub, publishStub, triggerContextActionsStub;
                beforeEach(function() {
                    subscribeStub = sandbox.stub(eventBusStub, 'subscribe');
                    publishStub = sandbox.stub(eventBusStub, 'publish');
                    sandbox.stub(mainRegion.paginatedTable, 'addEventHandler');
                    sandbox.stub(mainRegion.paginatedTable, 'setQueryParams');
                    triggerContextActionsStub = sandbox.stub(mainRegion, 'triggerContextActions');
                    sandbox.spy(mainRegion,'forcePasswordShowResult');
                    sandbox.spy(mainRegion,'showConfirmationDeleteUsersDialog');
                    sandbox.spy(mainRegion,'terminateSessionsShowResult');
                    sandbox.spy(mainRegion,'revokeCertificate');
                    sandbox.spy(mainRegion,'profileSummaryTrigger');
                    sandbox.spy(mainRegion,'exportProfiles');
                    sandbox.spy(mainRegion,'enableDisableUser');

                    mainRegion.addEventHandlers();
                    mainRegion.addSubscribtions();
                });

                it('Should subscribe action: create, terminateSessions, revokeCertificate, viewSummary (federated users)', function(){
                    var callback;
                    expect(eventBusStub.subscribe.callCount).to.equal(7);

                    expect(eventBusStub.subscribe.getCall(2).args[0]).to.equal('action:terminateSessions');
                    callback = eventBusStub.subscribe.getCall(2).args[1];
                    expect(callback).to.be.function;
                    callback.call(mainRegion);
                    expect(mainRegion.terminateSessionsShowResult.calledOnce).to.equal(true);

                    expect(eventBusStub.subscribe.getCall(3).args[0]).to.equal('action:revokeCertificate');
                    callback = eventBusStub.subscribe.getCall(3).args[1];
                    expect(callback).to.be.function;
                    callback.call(mainRegion);
                    expect(mainRegion.revokeCertificate.calledOnce).to.equal(true);

                    expect(eventBusStub.subscribe.getCall(4).args[0]).to.equal('action:viewSummary');
                    callback = eventBusStub.subscribe.getCall(4).args[1];
                    expect(callback).to.be.function;
                    callback.call(mainRegion);
                    expect(mainRegion.profileSummaryTrigger.calledOnce).to.equal(true);

                });
            });
        });

        describe('enableDisableUser()', function() {
            var enableDisableUserSpy, responseHandler, mainRegion;
            beforeEach(function() {
                mainRegion = new MainRegion();

                responseHandler = ResponseHandler.getInstance();
                mainRegion.responseHandler = responseHandler;

                //below works but cannot checkcallCount
                // setNotificationStub = sinon.stub(mainRegion.responseHandler, 'setNotification', function(){
                //     console.log('STUB')
                // });

                enableDisableUserSpy = sinon.spy(mainRegion, 'enableDisableUser');
            });

            afterEach(function() {
                mainRegion.enableDisableUser.restore();
            });

            // TODO: make 'it' for Array of two XHRs

            it('should call response handler for 1 request /error/', function(done) {
                var selectedRows = [{
                    username: "administrator"
                }]
                mainRegion.selectedRows = selectedRows;

                var resolve = sinon.spy();
                var responseObj = [];

                var serverResponse = {
                    userMessage: "A user cannot disable/delete himself.",
                    httpStatusCode: 422,
                    internalErrorCode: "UIDM-7-4-481.45",
                    developerMessage: "null",
                    time: "2016-04-27T12:59:33",
                    links: []
                };

                var serverErr = sinon.fakeServer.create();
                serverErr.respondWith("PUT",
                    "/oss/idm/usermanagement/users/administrator", [422,
                        { "Content-Type": "application/json" },
                        JSON.stringify(serverResponse)
                    ]);
                serverErr.autoRespond = true;

                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService
                            .setEnableDisableUser(mainRegion.selectedRows[0].username, "enabled")
                            .then(resolve, resolve);
                    })

                );

                Promise.all(responseObj).then(function(responses) {
                    var response = responses[0];

                    expect(response).not.to.be.undefined;
                    expect(response).not.to.be.null;
                    expect(response.xhr.getStatus()).to.equals(serverResponse.httpStatusCode);
                    expect(response.xhr.getResponseJSON().internalErrorCode).to.equals(serverResponse.internalErrorCode);
                    expect(response.rowValue).to.equals(mainRegion.selectedRows[0].username);

                    mainRegion.enableDisableUser(true);
                    expect(enableDisableUserSpy.callCount).to.equals(1);
                    //0 to exual 1
                    // expect(setNotificationStub.callCount).to.equal(1);
                    done();
                }).catch(done);
            });

            it('should call response handler for 1 request /success/ with enabled', function(done) {
                var selectedRows = [{
                    username: "userMW"
                }]
                mainRegion.selectedRows = selectedRows;

                var resolve = sinon.spy();
                var responseObj = [];

                var serverResponse = {
                    httpStatusCode: 204,
                };

                var serverSucc = sinon.fakeServer.create();
                serverSucc.respondWith("PUT",
                    "/oss/idm/usermanagement/users/userMW", [204,
                        { "Content-Type": "text/plain; charset=UTF-8" },
                        JSON.stringify(serverResponse)
                    ]);

                serverSucc.autoRespond = true;

                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService
                            .setEnableDisableUser(mainRegion.selectedRows[0].username, "enabled")
                            .then(resolve, resolve);
                    })
                );

                Promise.all(responseObj).then(function(responses) {
                    var response = responses[0];

                    expect(response).not.to.be.undefined;
                    expect(response).not.to.be.null;
                    expect(response.xhr.getStatus()).to.equals(serverResponse.httpStatusCode);
                    // expect(response.xhr.getResponseJSON().internalErrorCode).to.equals(serverResponse.internalErrorCode);
                    expect(response.rowValue).to.equals(mainRegion.selectedRows[0].username);

                    mainRegion.enableDisableUser(true);
                    expect(enableDisableUserSpy.callCount).to.equals(1);
                    //0 to exual 1
                    // expect(setNotificationStub.callCount).to.equal(1);
                    done();
                }).catch(done);
            });

            it('should call response handler for 1 request /success/ with disabled', function(done) {
                var selectedRows = [{
                    username: "userMW"

                }]
                mainRegion.selectedRows = selectedRows;

                var resolve = sinon.spy();
                var responseObj = [];

                var serverResponse = {
                    httpStatusCode: 204,
                };

                var serverSucc = sinon.fakeServer.create();
                serverSucc.respondWith("PUT",
                    "/oss/idm/usermanagement/users/userMW", [204,
                        { "Content-Type": "text/plain; charset=UTF-8" },
                        JSON.stringify(serverResponse)
                    ]);

                serverSucc.autoRespond = true;

                responseObj.push(
                    new Promise(function(resolve, reject) {
                        UserManagementService
                            .setEnableDisableUser(mainRegion.selectedRows[0].username, "disabled")
                            .then(resolve, resolve);
                    })
                );

                Promise.all(responseObj).then(function(responses) {
                    var response = responses[0];

                    expect(response).not.to.be.undefined;
                    expect(response).not.to.be.null;
                    expect(response.xhr.getStatus()).to.equals(serverResponse.httpStatusCode);
                    // expect(response.xhr.getResponseJSON().internalErrorCode).to.equals(serverResponse.internalErrorCode);
                    expect(response.rowValue).to.equals(mainRegion.selectedRows[0].username);

                    mainRegion.enableDisableUser(true);
                    expect(enableDisableUserSpy.callCount).to.equals(1);
                    //0 to exual 1
                    // expect(setNotificationStub.callCount).to.equal(1);
                    done();
                }).catch(done);
            });

        });
});
