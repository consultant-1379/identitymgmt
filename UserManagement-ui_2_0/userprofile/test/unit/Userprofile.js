define([
    'jscore/core',
    'userprofile/Userprofile',
    'jscore/ext/locationController',
    'userprofile/Dictionary',
    'usermgmtlib/model/RegularUserProfileModel',
    'userprofile/regions/mainregion/MainRegion',
    'layouts/TopSection',
    'identitymgmtlib/Utils'
], function(core, Userprofile, LocationController, Dictionary, RegularUserProfileModel, MainRegion, TopSection, utils){
    "use strict";

    describe('Userprofile', function(){
        var sandbox, userprofile, options, viewStub, context, eventBusStub, locationControllerStub, regularUserProfileModel, username;

        beforeEach(function(){

            sandbox = sinon.sandbox.create();

            eventBusStub = new core.EventBus();
            context = new core.AppContext();

            eventBusStub = {
                subscribe: function() {},
                publish: function() {}
            };

            viewStub = {
                getElement: function() {}
            };

            options = {
                namespace: "",
                breadcrumb: "",
                properties: {
                    title: ""
                }
            };
            sandbox.stub(utils,'removeChildAppsFromBreadcrumb');
            sandbox.spy(viewStub, 'getElement');

            userprofile = new Userprofile(options);
            userprofile.view = viewStub;
            userprofile.model = new RegularUserProfileModel();

            context.eventBus = eventBusStub;
            sandbox.stub(userprofile, 'getContext', function() {
                return context;
            });
            sandbox.spy(eventBusStub, 'subscribe');
            sandbox.spy(eventBusStub, 'publish');
            sandbox.spy(userprofile, 'getEventBus');

            locationControllerStub = {
                addLocationListener: function() {},
                start: function() {},
                stop: function() {}
            };



            sandbox.stub(locationControllerStub, 'addLocationListener');
            sandbox.stub(locationControllerStub, 'start');
            sandbox.stub(locationControllerStub, 'stop');

            userprofile.locationController = locationControllerStub;

            regularUserProfileModel = new RegularUserProfileModel();
            sandbox.spy(regularUserProfileModel, 'save');
            sandbox.spy(regularUserProfileModel, 'fetch');
            sandbox.spy(regularUserProfileModel, 'set');

            sandbox.stub(MainRegion.prototype, 'onStart');


        });
        afterEach(function(){
            sandbox.restore();
        });

        it('Userprofile should be defined', function(){
            expect(Userprofile).not.to.be.undefined;
            expect(Userprofile).not.to.be.null;
        });

        describe('onStart()', function(){
            beforeEach(function(){
                sandbox.spy(userprofile,'initActions');
                sandbox.spy(userprofile,'addEventHandlers');
                sandbox.spy(userprofile,'onResume');
                sandbox.stub(userprofile,'onLocationChange');
                userprofile.onStart();

            });
            it('Should initialize actions buttons', function(){
               expect(userprofile.initActions.callCount).to.equal(1);
            });
            
            it('Should add listener to location controller', function(){
                expect(userprofile.locationController).not.to.be.null;
                expect(userprofile.locationController).not.to.be.undefined;
                expect(userprofile.onLocationChange.callCount).to.equal(1);
            });

            it('Should call addEventHandlers function', function(){
                expect(userprofile.addEventHandlers.callCount).to.equal(1);
            });
            it('Should started location controller', function(){
                expect(userprofile.onResume.callCount).to.equal(1);
            });
        });

        describe('addEventHandlers()', function(){
            beforeEach(function(){
                userprofile.addEventHandlers();
            });

            it('Should subscribe save event for userprofile', function(){
                expect(userprofile.getEventBus.callCount).to.equal(1);
                expect(eventBusStub.subscribe.callCount).to.equal(1);
                expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal('userprofile:save');

                var callbackFunction = eventBusStub.subscribe.getCall(0).args[0];
                expect(callbackFunction).to.be.function;

            });

        });

        describe('renderView()', function(){
            beforeEach(function(){
                sandbox.stub(userprofile,'renderApp');
                userprofile.renderView(regularUserProfileModel);
            });
            it('Should call renderApp function for view mode', function(){
                expect(userprofile.renderApp.callCount).to.equal(1);
                expect(userprofile.renderApp.getCall(0).args[0]).to.equal('view');
                expect(userprofile.renderApp.getCall(0).args[1]).to.equal(regularUserProfileModel);
            });
        });

        describe('renderEdit()', function(){
            beforeEach(function(){
                sandbox.stub(userprofile,'renderApp');
                userprofile.renderEdit(regularUserProfileModel);
            });
            it('Should call renderApp function for edit mode', function(){
                expect(userprofile.renderApp.callCount).to.equal(1);
                expect(userprofile.renderApp.getCall(0).args[0]).to.equal('edit');
                expect(userprofile.renderApp.getCall(0).args[1]).to.equal(regularUserProfileModel);
            });
        });



        describe('getContextActions()', function(){
            var output;
            beforeEach(function(){
                userprofile.initActions();

            });
            it('Should create three buttons when user is on User Profile page', function(){
                output = userprofile.getContextActions('view');
                expect(output.length).to.equal(3);

            });
            it('Should create changePasswordByUser action button when user is on User Profile page', function(){
                output = userprofile.getContextActions('view');
                expect(output[0].name).to.equal(Dictionary.editPassword);
                var callbackFunction = output[1].action;
                expect(callbackFunction).to.be.function;

            });

            it('Should create editData action button whe user is on User Profile page', function(){
                output = userprofile.getContextActions('view');
                expect(output[1].name).to.equal(Dictionary.editData);
                var callbackFunction = output[1].action;
                expect(callbackFunction).to.be.function;

            });
            it('Should create getCredentials action button when user is on User Profile page', function(){
                output = userprofile.getContextActions('view');
                expect(output[2].name).to.equal(Dictionary.credentials);
            });

            it('Should create two buttons when user is on Edit Data page', function(){
                output = userprofile.getContextActions('edit');

                expect(output.length).to.equal(3);
                expect(output[0].type).to.equal('button');
                expect(output[1].type).to.equal('button');

                expect(output[2].type).to.equal('separator');
            });

            it('Should create save action button when user is on Edit Data page', function(){
                output = userprofile.getContextActions('edit');

                expect(output[0].name).to.equal(Dictionary.save);
                var callbackFunction = output[0].action;
                expect(callbackFunction).to.be.function;

                callbackFunction.call();

                expect(userprofile.getEventBus.callCount).to.equal(1);
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('userprofile:save');


            });
            it('Should create cancel action button when user is on Edit Data page', function(){
                output = userprofile.getContextActions('edit');

                expect(output[1].name).to.equal(Dictionary.cancel);
                var callbackFunction = output[1].action;
                expect(callbackFunction).to.be.function;

            });
        });

        describe('renderApp()', function(){
            var layout;
            beforeEach(function(){
                layout ={
                    destroy: function(){}
                };
                sandbox.spy(layout,'destroy');
                userprofile.layout = layout;
                userprofile.renderApp('create', new RegularUserProfileModel);
            });

            it('Should clean layout if exist', function(){
               expect(layout.destroy.callCount).to.equal(1);
            });

            it('Should create TopSection object on layout', function(){
                expect(userprofile.layout instanceof TopSection).to.equal(true);
            });

        });

        describe('formatTime()', function(){
            it('Should return time with property format', function(){
                var value = "20151125183300+0000";
                var output = userprofile.formatTime(value);
                expect(output).not.to.be.null;
                expect(output).not.to.be.undefined;


            });
        });
    });

});
