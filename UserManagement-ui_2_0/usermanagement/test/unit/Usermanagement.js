/*global define, describe, it, expect */
define([
    'usermanagement/Usermanagement',
    'jscore/core',
    'layouts/TopSection',
    'usermanagement/regions/mainregion/MainRegion',
    'identitymgmtlib/PaginatedTable',
    'usermanagement/widgets/filterWidget/FilterWidget',
    'identitymgmtlib/AccessControlService',
    'identitymgmtlib/Utils'
], function(Usermanagement, Core, TopSection, MainRegion, PaginatedTable, FilterWidget, AccessControlService, utils) {
    'use strict';

    describe('Usermanagement', function() {
        var sandbox, usermanagement, server, eventBusStub, context; //, topSection;
        beforeEach(function() {

            sandbox = sinon.sandbox.create();

            eventBusStub = new Core.EventBus();

            //Mock Context For Event Bus
            context = new Core.AppContext();
            context.eventBus = eventBusStub;

            usermanagement = new Usermanagement({
                properties: {
                    tittle: 'User Maganement'
                }
            });
            sandbox.stub(utils,'removeChildAppsFromBreadcrumb');
            sandbox.stub(usermanagement, 'getContext', function() {
                return context;
            });

            //EventBusStub
            eventBusStub = {
                publish: function() {},
                subscribe: function() {},
                unsubscribe: function() {}
            };

            context.eventBus = eventBusStub;

            sandbox.spy(eventBusStub, 'subscribe');
            sandbox.spy(usermanagement, 'getEventBus');

            // sandbox.stub(usermanagement, 'getEventBus', function() {
            //  return eventBusStub;
            // });

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

            var passwordAgeingResponse = {
                "enabled":true,
                "pwdMaxAge":60,
                "pwdExpireWarning":5,
                "graceLoginCount":3
            };

            server = sandbox.useFakeServer();

            //for acces deny
            server.respondWith('GET', '/rest/apps', [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify(response)
            ]);

            server.respondWith('GET', '/oss/idm/config/passwordsettings/enmuser/passwordageing', [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify(passwordAgeingResponse)
            ]);
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('Usermanagement should be defined', function() {
            expect(Usermanagement).not.to.be.undefined;
        });

        describe('onStart()', function() {
            it('Should initialize main page correctly', function(done) {
                var onStartSpy = sandbox.spy(usermanagement, 'onStart');
                var onResumeSpy = sandbox.spy(usermanagement, 'onResume');

                sandbox.spy(AccessControlService,'isAppAvailable');

                expect(onStartSpy.callCount).to.equal(0);

                //ACT
                var response = { serverLocation: 'Eire' };
                server.respondWith('GET', '/rest/system/time', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(response)
                ]);
                server.autoRespond = true;
                var performOnStartSpy = sandbox.spy(usermanagement, 'performOnStart')
                var performOnResumeStub = sandbox.stub(usermanagement, 'performOnResume')

                usermanagement.onStart().then(function() {
                    expect(performOnStartSpy.callCount).to.equal(1);
                    expect(eventBusStub.subscribe.callCount).to.equal(33);
                    done();

                }).catch(done);
            });
        });

        describe('onResume()', function() {
            it('Should initialize main page correctly', function(done) {
                var onResumeSpy = sandbox.spy(usermanagement, 'onResume');

                expect(onResumeSpy.callCount).to.equal(0);

                //ACT
                var response = { serverLocation: 'Eire' };
                server.respondWith('GET', '/rest/system/time', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(response)
                ]);
                server.autoRespond = true;
                var performOnResumeSpy = sandbox.stub(usermanagement, 'performOnResume')
                usermanagement.onResume().then(function() {
                    expect(performOnResumeSpy.callCount).to.equal(1)
                    done();
                }).catch(done);
            });
        });
    });

    describe('Mainregion', function() {
        var sandbox, server, mainRegion, eventBusStub, context;
        beforeEach(function() {

            var passwordAgeingResponse = {
                "enabled":true,
                "pwdMaxAge":60,
                "pwdExpireWarning":5,
                "graceLoginCount":3
            };

            sandbox = sinon.sandbox.create();

            server = sandbox.useFakeServer();

            server.respondWith('GET', '/oss/idm/config/passwordsettings/enmuser/passwordageing', [200, {
                    'Content-Type': 'application/json'
                },
                JSON.stringify(passwordAgeingResponse)
            ]);

            eventBusStub = new Core.EventBus();

            //Mock Context For Event Bus
            context = new Core.AppContext();
            context.eventBus = eventBusStub;

            mainRegion = new MainRegion({
                context: context,
                paginatedTable: new PaginatedTable({
                    context: context,
                    url: 'fakeUrl'
                })
            });

           sandbox.spy(mainRegion, 'setupTable');

        });

        it('Mainregion should be defined', function() {
            mainRegion.onViewReady();
            expect(mainRegion).not.to.be.undefined;
        });

        it('Check if table loaded correctly', function() {

            mainRegion.onViewReady();
            //expect(mainRegion.paginatedTable).to.be.undefined;
            //mainRegion.setupTable();

            var tempPaginationTable = mainRegion.paginatedTable.getTable();
            //check if table is not undefined or null
            expect(mainRegion.paginatedTable.getTable()).not.to.be.undefined;
            expect(mainRegion.paginatedTable.getTable()).not.to.be.null;

            //call count
            expect(mainRegion.setupTable.callCount).to.equal(1);

            //check if table is not recreated when aleready exist
            //mainRegion.setupTable();

            //check if table is not undefined or null
            //expect(mainRegion.paginatedTable.getTable()).not.to.be.undefined;
            //expect(mainRegion.paginatedTable.getTable()).not.to.be.null;


            //call count after second call of method setupTable
            //expect(mainRegion.setupTable.callCount).to.equal(2);

            //check if created paginated table looks same as previous
            //expect(mainRegion.paginatedTable.getTable()).to.equal(tempPaginationTable);

            //TODO is it necesery to check how many times some method was called on paginatedTable?
            // mainRegion.paginatedTable = sandbox.stub({
            //  getPageData: function() {}
            // });
            //expect(mainRegion.paginatedTable.getTable.callCount).to.equal(1);
            //expect(mainRegion.paginatedTable.getPageData.callCount).to.equal(1);

        });
    });
});
