define([
    'jscore/core',
    'usersgroupedit/Usersgroupedit',
    'jscore/ext/locationController',
    'usersgroupedit/Dictionary',
    'identitymgmtlib/Utils'
], function(core, Usersgroupedit, LocationController, Dictionary, utils) {
    "use strict";

    describe('Usersgroupedit', function() {
        var sandbox,
            usersgroupedit,
            context,
            viewStub,
            options,
            responseAccess,
            responseDenied,
            eventBus_stub,
            context_stub;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();

            viewStub = {
                getElement: function() {}
            };

            eventBus_stub = new core.EventBus();
            context_stub = new core.AppContext();
            sandbox.stub(utils,'removeChildAppsFromBreadcrumb');
            sandbox.stub(eventBus_stub, 'subscribe');
            context_stub.eventBus = eventBus_stub;
            sandbox.stub(Usersgroupedit.prototype, 'getContext', function() {
                return context_stub;
            });

            sandbox.stub(Usersgroupedit.prototype, 'getEventBus', function() {
                return eventBus_stub;
            });

            options = {
                namespace: "",
                breadcrumb: "",
                properties: {
                    title: ""
                }
            };

            responseAccess = [{ "id": "user_management" }];
            responseDenied = [{ "id": "" }];


        });
        afterEach(function() {
            sandbox.restore();
        });

        describe('Application start', function() {
            var onStart_spy,
                performOnStart_stub,
                performOnResume_stub,
                server;

            beforeEach(function() {
                performOnStart_stub = sandbox.spy(Usersgroupedit.prototype, 'performOnStart');
                performOnResume_stub = sandbox.stub(Usersgroupedit.prototype, 'performOnResume');
                onStart_spy = sandbox.spy(Usersgroupedit.prototype, 'onStart');
                usersgroupedit = new Usersgroupedit();
                server = sandbox.useFakeServer();
                server.autoRespond = true;
            });

            it('Usersgroupedit should be defined', function() {
                expect(usersgroupedit).not.to.be.undefined;
                expect(usersgroupedit).not.to.be.null;
            });

            it('onStart(), performOnStart() and performOnResume() should be called - Access Granted ', function(done) {
                server.respondWith('GET', '/rest/apps', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(responseAccess)
                ]);

                usersgroupedit.onStart().then(function() {
                    expect(onStart_spy.callCount).to.equal(1);
                    expect(performOnStart_stub.callCount).to.equal(1);
                    expect(performOnResume_stub.callCount).to.equal(1);
                    done();
                }).catch(done);
            });

            it('onStart() should be called, performOnStart() and performOnResume() NOT  - Acces Denied', function(done) {
                server.respondWith('GET', '/rest/apps', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(responseDenied)
                ]);

                usersgroupedit.onStart().then(function() {
                    expect(onStart_spy.callCount).to.equal(1);
                    expect(performOnStart_stub.callCount).to.equal(0);
                    expect(performOnResume_stub.callCount).to.equal(0);
                    done();
                }).catch(done);
            });
        });

        describe('Application resume', function() {
            var onResume_spy,
                performOnResume_stub,
                server;

            beforeEach(function() {
                performOnResume_stub = sandbox.stub(Usersgroupedit.prototype, 'performOnResume');
                onResume_spy = sandbox.spy(Usersgroupedit.prototype, 'onResume');
                usersgroupedit = new Usersgroupedit();
                server = sandbox.useFakeServer();
                server.autoRespond = true;
            });

            it('Usersgroupedit should be defined', function() {
                expect(usersgroupedit).not.to.be.undefined;
                expect(usersgroupedit).not.to.be.null;
            });

            it('onResume(), performOnResume() should be called - Access Granted ', function(done) {
                server.respondWith('GET', '/rest/apps', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(responseAccess)
                ]);

                usersgroupedit.onResume().then(function() {
                    expect(onResume_spy.callCount).to.equal(1);
                    expect(performOnResume_stub.callCount).to.equal(1);
                    done();
                }).catch(done);
            });

            it('onResume(), performOnResume() should NOT be called  - Acces Denied', function(done) {
                server.respondWith('GET', '/rest/apps', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(responseDenied)
                ]);

                usersgroupedit.onResume().then(function() {
                    expect(onResume_spy.callCount).to.equal(1);
                    expect(performOnResume_stub.callCount).to.equal(0);
                    done();
                }).catch(done);
            });
        });

        describe('Application flow', function() {
            var performOnStart_spy,
                setUsersToEdit_spy,
                renderApp_stub,
                server;

            beforeEach(function() {
                performOnStart_spy = sandbox.spy(Usersgroupedit.prototype, 'performOnStart');
                usersgroupedit = new Usersgroupedit();
                setUsersToEdit_spy = sandbox.spy(usersgroupedit, 'setUsersToEdit');
                renderApp_stub = sandbox.stub(usersgroupedit, 'renderApp');
                server = sandbox.useFakeServer();
                server.respondWith('GET', '/rest/apps', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(responseAccess)
                ]);
                server.autoRespond = true;
            });

            afterEach(function() {
                window.location.hash = '';
            });

            it('Should call setUsersToEdit() and save data to model ', function() {
                var users = 'user0,user1';
                window.location.hash = '#usersgroupedit/?users=' + users;
                usersgroupedit.performOnStart();
                expect(setUsersToEdit_spy.callCount).to.equal(1);
                expect(usersgroupedit.usersToEdit).to.deep.equal(users.split(','));
            });

            it('Should call setUsersToEdit() parse hash users to array', function() {
                var users = 'user0,user1,, ,  user2  ,user3,    ';
                var expectedUsers = 'user0,user1,user2,user3';
                window.location.hash = '#usersgroupedit/?users=' + users;
                usersgroupedit.performOnStart();
                expect(setUsersToEdit_spy.callCount).to.equal(1);
                expect(usersgroupedit.usersToEdit).to.deep.equal(expectedUsers.split(','));
            });


            it('Should call renderApp() onLocationChange', function() {
                usersgroupedit.onLocationChange();
                expect(renderApp_stub.callCount).to.equal(1);
            });
        });

        describe('Application render', function() {
            var onLocationChange_spy,
                initWizard_stub,
                renderApp_spy,
                server;

            beforeEach(function() {
                usersgroupedit = new Usersgroupedit();
                usersgroupedit.options = {
                    properties: {}
                }
                initWizard_stub = sandbox.stub(usersgroupedit, 'initWizard');
                renderApp_spy = sandbox.spy(usersgroupedit, 'renderApp');
                onLocationChange_spy = sandbox.spy(usersgroupedit, 'onLocationChange');
                server = sandbox.useFakeServer();
                server.respondWith('GET', '/rest/apps', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(responseAccess)
                ]);
                server.autoRespond = true;

                usersgroupedit.view = { getElement: function() {} };
            });

            it('Should initWizard() after renderApp() ', function() {
                usersgroupedit.onLocationChange();
                expect(renderApp_spy.callCount).to.equal(1);
                expect(initWizard_stub.callCount).to.equal(1);
            });
        });

        describe('Wizard', function() {
            var initWizard_spy,
                performOnStart_spy,
                setUsersToEdit_spy;

            beforeEach(function() {
                performOnStart_spy = sandbox.spy(Usersgroupedit.prototype, 'performOnStart');
                usersgroupedit = new Usersgroupedit();
                initWizard_spy = sandbox.spy(usersgroupedit, 'initWizard');
                setUsersToEdit_spy = sandbox.spy(usersgroupedit, 'setUsersToEdit');
            });

            afterEach(function() {
                window.location.hash = '';
            });

            it('Should create Wizard with 4 steps', function() {
                usersgroupedit.initWizard();
                expect(initWizard_spy.callCount).to.equal(1);
                expect(usersgroupedit.wizard).not.to.be.null;
                expect(usersgroupedit.wizard).not.to.be.undefined;
                expect(usersgroupedit.wizard.options.steps.length).to.equal(5);
            });

            it('Should create Wizard and model with "usersToGroupEdit" attribute', function() {

                sandbox.stub(usersgroupedit, 'renderApp');

                var users = 'user0,user1';
                window.location.hash = '#usersgroupedit/?users=' + users;
                usersgroupedit.performOnStart();
                expect(setUsersToEdit_spy.callCount).to.equal(1);
                expect(usersgroupedit.usersToEdit).to.deep.equal(users.split(','));

                usersgroupedit.initWizard();
                expect(initWizard_spy.callCount).to.equal(1);
                expect(usersgroupedit.wizard).not.to.be.null;
                expect(usersgroupedit.wizard).not.to.be.undefined;
                expect(usersgroupedit.wizard.options.steps.length).to.equal(5);

                expect(usersgroupedit.model.getAttribute('usersToGroupEdit')).to.deep.equal(users.split(','));
            });

            it('Should call addEventHandlersWizard() ', function() {

                var addEventHandlersWizard_stub = sandbox.stub(usersgroupedit, 'addEventHandlersWizard');
                usersgroupedit.initWizard();
                expect(initWizard_spy.callCount).to.equal(1);
                expect(usersgroupedit.wizard).not.to.be.null;
                expect(usersgroupedit.wizard).not.to.be.undefined;

                expect(usersgroupedit.model).not.to.be.null;
                expect(usersgroupedit.model).not.to.be.undefined;

                expect(addEventHandlersWizard_stub.callCount).to.equal(1);
            });
            it('Should subscribe Wizard on "finish" and "cancel" events', function() {
                var addEventHandlersWizard_spy = sandbox.spy(usersgroupedit, 'addEventHandlersWizard');
                usersgroupedit.wizard = {
                    addEventHandler: function() {}
                }
                var addEventHandlersWizard_spy = sandbox.spy(usersgroupedit.wizard, 'addEventHandler');

                usersgroupedit.addEventHandlersWizard();

                expect(usersgroupedit.wizard.addEventHandler.callCount).to.equal(2);
                expect(usersgroupedit.wizard.addEventHandler.getCall(0).args[0]).to.equal('finish');
                expect(usersgroupedit.wizard.addEventHandler.getCall(1).args[0]).to.equal('cancel');
            });

            it('Should call goBack() after "finish" or "cancel"', function() {
                sandbox.stub(usersgroupedit, 'renderApp');
                var goBack_spy = sandbox.spy(usersgroupedit, 'goBack');

                var users = 'user0,user1';
                window.location.hash = '#usersgroupedit/?users=' + users;
                usersgroupedit.performOnStart();

                usersgroupedit.initWizard();
                expect(initWizard_spy.callCount).to.equal(1);

                usersgroupedit.wizard.trigger('finish');
                expect(goBack_spy.callCount).to.equal(1);
                usersgroupedit.wizard.trigger('cancel');
                expect(goBack_spy.callCount).to.equal(2);
            });
        });
    });
});
