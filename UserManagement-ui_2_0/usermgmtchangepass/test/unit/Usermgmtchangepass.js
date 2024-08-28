define([
    'jscore/core',
    'usermgmtchangepass/Usermgmtchangepass',
    'jscore/ext/locationController',
    'usermgmtchangepass/model/UserMgmtChangePassModel',
    'usermgmtchangepass/regions/mainregion/MainRegion',
    'usermgmtchangepass/widgets/UserMgmtChangePassWidget/UserMgmtChangePassWidget',
    'layouts/TopSection',
    'identitymgmtlib/AccessControlService'
], function(core, Usermgmtchangepass, LocationController, UserMgmtChangePassModel, MainRegion, UserMgmtChangePassWidget, TopSection, AccessControlService) {
    "use strict";

    describe('Usermgmtchangepass', function() {
        var sandbox, viewStub, elementStub, usermgmtchangepass, options, server, eventBusStub, context;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            eventBusStub = new core.EventBus();
            context = new core.AppContext();
            eventBusStub = {
                subscribe: function() {},
                publish: function() {}
            };
            options = {
                breadcrumb: {
                    splice: function() {
                        return [{ name: 'ENM',
                                  url: '#launcher'}];
                    }

                },
                context: {},
                namespace: "mocknamespace"
            };
            sandbox.spy(options.breadcrumb, 'splice');
            elementStub = new core.Element('div');
            viewStub = {
                getElement: function() {
                    return elementStub;
                }
            };

            sandbox.stub(UserMgmtChangePassWidget.prototype, 'onViewReady');
            sandbox.spy(viewStub, 'getElement');


            usermgmtchangepass = new Usermgmtchangepass(options);
            usermgmtchangepass.view = viewStub;
            context.eventBus = eventBusStub;
            sandbox.stub(usermgmtchangepass, 'getContext', function() {
                return context;
            });
            sandbox.spy(eventBusStub, 'subscribe');
            sandbox.spy(eventBusStub, 'publish');
            sandbox.spy(usermgmtchangepass, 'getEventBus');

            server = sandbox.useFakeServer();
            sandbox.stub(MainRegion.prototype, 'onStart');

            var response = [{
                'id': 'user_management',
                'name': 'User Management',
                'shortInfo': 'User Management is a web based application that allows the Security Administrator to create, delete users and provide them access to ENM tools.',
                'acronym': null,
                'favorite': 'false',
                'resources': null,
                'hidden': false,
                'roles': '',
                'targetUri': 'https://enmapache.athtem.eei.ericsson.se/#usermanagement',
                'uri': '/rest/apps/web/user_management'
            }];

            server = sandbox.useFakeServer();

            //for acces deny
            server.respondWith('GET', '/rest/apps', [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify(response)
            ]);

            server.respondWith('GET', /^\/oss\/idm\/usermanagement\/users\/.+$/, [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify({
                    "username": "userMW",
                    "password": "********",
                    "status": "enabled",
                    "name": "dkjs",
                    "surname": "kdls",
                    "email": "kljsd@sdf.ds",
                    "previousLogin": "20160705151539+0000",
                    "lastLogin": "20160705151539+0000",
                    'failedLogins': 0,
                    "passwordResetFlag": null,
                    "privileges": []
                })
            ]);
            server.autoRespond = true;
            
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('Usermgmtchangepass should be defined', function() {
            expect(Usermgmtchangepass).not.to.be.undefined;
            expect(Usermgmtchangepass).not.to.be.null;

        });

        describe('LocationController on start, on resume and on pause', function() {

            beforeEach(function() {
                sandbox.stub(LocationController.prototype, 'init');
                sandbox.stub(LocationController.prototype, 'addLocationListener');
                sandbox.stub(usermgmtchangepass, 'onResume');
                sandbox.stub(usermgmtchangepass, 'onLocationChange');
                sandbox.stub(usermgmtchangepass, 'addEventHandlers');

            });

            it('Should initialize locationController', function() {
                usermgmtchangepass.performOnStart();

                expect(LocationController.prototype.init.calledOnce).to.equal(true);
                expect(LocationController.prototype.addLocationListener.calledOnce).to.equal(true);

                var callback = LocationController.prototype.addLocationListener.getCall(0).args[0];
                expect(callback).to.be.function;

                expect(usermgmtchangepass.onResume.calledOnce).to.equal(true);

            });
        });

        describe('onStart()', function() {
            beforeEach(function() {
                sandbox.stub(usermgmtchangepass, 'onLocationChange');
                sandbox.spy(AccessControlService, 'isAppAvailable');
            });
            it('Should control service to prevent setting access for unauthorized user', function() {
                usermgmtchangepass.onStart();
                expect(AccessControlService.isAppAvailable.callCount).to.equal(1);
            });
        });

        describe('addEventHandlers()', function() {
            it('Should subscribe event for save action', function() {
                usermgmtchangepass.addEventHandlers();

                expect(usermgmtchangepass.getEventBus.callCount).to.equal(1);
                expect(eventBusStub.subscribe.callCount).to.equal(1);
                expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal('usermgmtchangepass:save');

                var callback = eventBusStub.subscribe.getCall(0).args[1];
                expect(callback).to.be.function;
            });
        });

        describe('performOnResume()', function() {
            beforeEach(function() {
                sandbox.stub(usermgmtchangepass, 'onLocationChange');
            });
            it('Should clear ticks when passwordPoliciesCollection is not null', function() {
                sandbox.spy(usermgmtchangepass.passwordPoliciesCollection, 'clearTicks');
                usermgmtchangepass.performOnStart();
                usermgmtchangepass.performOnResume();

                expect(usermgmtchangepass.passwordPoliciesCollection.clearTicks.callCount).to.equal(1);
            });
        });



        describe('renderApp()', function() {
            beforeEach(function() {
                usermgmtchangepass.options = {
                    breadcrumb: [{
                       name: 'ENM',
                       url: '#launcher'
                    },{
                       name: 'User Management'
                    }]
                };

                sandbox.stub(TopSection.prototype, 'attachTo');
                sandbox.stub(TopSection.prototype, 'setContent');

                usermgmtchangepass.onLocationChange("#MockHash");
            });

            it('Should create TopSection object on layout', function() {
                expect(usermgmtchangepass.topSection instanceof TopSection).to.equal(true);
            });

            it('Should attach layout to view', function() {
                expect(TopSection.prototype.attachTo.callCount).to.equal(1);
            });

            it('Should set content to layout', function() {
                expect(TopSection.prototype.setContent.callCount).to.equal(1);
            });


        });

        describe('onPause()', function() {
            beforeEach(function() {
                sandbox.spy(usermgmtchangepass, 'onPause');
                sandbox.stub(LocationController.prototype, 'stop');
            });

            it('Check method onPause and stop', function() {

                usermgmtchangepass.performOnStart();
                usermgmtchangepass.onPause();

                expect(usermgmtchangepass.onPause.calledOnce).to.equal(true);
                expect(LocationController.prototype.stop.calledOnce).to.equal(true);

            });
        });

        describe('onLocationChange()', function() {
            beforeEach(function() {
                usermgmtchangepass.options = {
                    breadcrumb: [{
                       name: 'ENM',
                       url: '#launcher'
                    },{
                       name: 'User Management'
                    }]
                };
                sandbox.spy(usermgmtchangepass, 'onLocationChange');
            });

            it('Check method onLocationChange', function() {

                usermgmtchangepass.onStart();
                usermgmtchangepass.onLocationChange("/");

                expect(usermgmtchangepass.onLocationChange.calledOnce).to.equal(true);
            });

        });
    });
});
