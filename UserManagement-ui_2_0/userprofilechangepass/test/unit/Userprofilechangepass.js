define([
    'jscore/core',
    'userprofilechangepass/Userprofilechangepass',
    'widgets/Breadcrumb',
    'jscore/ext/locationController',
    'userprofilechangepass/model/UserProfileChangePassModel',
    'userprofilechangepass/regions/mainregion/MainRegion',
    'userprofilechangepass/widgets/UserProfileChangePassWidget/UserProfileChangePassWidget',
    'layouts/TopSection',
    'usermgmtlib/model/PasswordPoliciesCollection',
    'usermgmtlib/widgets/PasswordPolicyWidget/PasswordPolicyWidget'
], function(core, Userprofilechangepass, Breadcrumb, LocationController, UserProfileChangePassModel, MainRegion, UserProfileChangePassWidget, TopSection,PasswordPoliciesCollection, PasswordPolicyWidget) {
    "use strict";

    describe('Userprofilechangepass', function() {
        var sandbox, viewStub, elementStub, userprofilechangepass, options, eventBusStub;

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
                  },
                },
                namespace: "mocknamespace"
            };
            sandbox.spy(options.breadcrumb, 'splice');
            elementStub = new core.Element('div');
            viewStub = {
              getElement: function() {
                  return elementStub;
              }
            };
            sandbox.stub(UserProfileChangePassWidget.prototype, 'onViewReady');
            sandbox.stub(PasswordPolicyWidget.prototype, 'onViewReady');
            sandbox.spy(viewStub, 'getElement');


            userprofilechangepass = new Userprofilechangepass(options);
            userprofilechangepass.view = viewStub;

            context.eventBus = eventBusStub;
            sandbox.stub(userprofilechangepass, 'getContext', function() {
                return context;
            });
            sandbox.spy(eventBusStub, 'subscribe');
            sandbox.spy(eventBusStub, 'publish');
            sandbox.spy(userprofilechangepass, 'getEventBus');


        });

        afterEach(function() {
            sandbox.restore();
        });

        it('Userprofilechangepass should be defined', function() {
            expect(Userprofilechangepass).not.to.be.undefined;
            expect(Userprofilechangepass).not.to.be.null;

        });

        describe('LocationController on start, on resume and on pause', function() {

            beforeEach(function() {
                sandbox.stub(LocationController.prototype, 'init');
                sandbox.stub(LocationController.prototype, 'addLocationListener');
                sandbox.spy(userprofilechangepass, 'onResume');
                sandbox.stub(userprofilechangepass, 'onLocationChange');
                sandbox.stub(userprofilechangepass, 'addEventHandlers');
            });

            it('Should initialize locationController', function() {
                userprofilechangepass.onStart();

                expect(LocationController.prototype.init.calledOnce).to.equal(true);
                expect(LocationController.prototype.addLocationListener.calledOnce).to.equal(true);

                var callback = LocationController.prototype.addLocationListener.getCall(0).args[0];
                expect(callback).to.be.function;

                expect(userprofilechangepass.onResume.calledOnce).to.equal(true);

            });

            it('Should call addEventHandler function', function() {
                userprofilechangepass.onStart();

                expect(userprofilechangepass.addEventHandlers.calledOnce).to.equal(true);

            });
        });

        describe('renderApp()', function() {
            var model;
            beforeEach(function() {
               model = new UserProfileChangePassModel();
              //userprofilechangepass.passwordPoliciesCollection = new PasswordPoliciesCollection();
               userprofilechangepass.options = {
                   breadcrumb: [{
                      name: 'ENM',
                      url: '#launcher'
                   },{
                      name: 'User Management'
                   }],

               };

               sandbox.stub(TopSection.prototype, 'attachTo');
               sandbox.stub(TopSection.prototype, 'setContent');

              userprofilechangepass.renderApp(model);
           });

           it('Should create TopSection object on layout', function() {
               expect(userprofilechangepass.topSection instanceof TopSection).to.equal(true);
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
                sandbox.spy(userprofilechangepass, 'onPause');
                sandbox.stub(LocationController.prototype, 'stop');
            });

            it('Check method onPause and stop', function() {

                userprofilechangepass.onStart();
                userprofilechangepass.onPause();

                expect(userprofilechangepass.onPause.calledOnce).to.equal(true);
                expect(LocationController.prototype.stop.calledOnce).to.equal(true);

            });
        });

        describe('onLocationChange()', function() {
            beforeEach(function() {
                sandbox.spy(userprofilechangepass, 'onLocationChange');
            });

            it('Check method onLocationChange', function() {

                userprofilechangepass.onStart();
                userprofilechangepass.onLocationChange("/");

                expect(userprofilechangepass.onLocationChange.calledOnce).to.equal(true);
            });
        });
    });
});
