define([
    'jscore/core',
    'usermanagement/regions/ProfileSummary/ProfileSummary',
    'container/api',
    'usermanagement/Dictionary',
    'usermgmtlib/services/UserManagementService'
], function(core, ProfileSummary, container, Dictionary, UserManagementService){
    "use strict";

    describe("ProfileSummary Region", function(){
        var sandbox, profileSummaryRegion, options, viewStub, elementStub, findStub, functionStub;


        beforeEach(function(){
            sandbox = sinon.sandbox.create();

            options={
                username:"MockName",
                sessions: null
            }
            elementStub = new core.Element('div');
            viewStub = {
                getElement: function(){return functionStub;}
            };
            functionStub = {
                find: function(){return findStub;}
            };
            findStub = {
                setModifier: function(){},
                removeModifier: function(){},
                setText: function(){},
                setStyle: function(){},
                removeStyle: function(){},
                addEventHandler: function(){}

            };
            sandbox.spy(functionStub,'find');
            sandbox.spy(findStub,'setModifier');
            sandbox.spy(findStub,'removeModifier');
            sandbox.spy(findStub,'setText');
            sandbox.spy(findStub,'setStyle');
            sandbox.spy(findStub,'removeStyle');
            sandbox.spy(findStub,'addEventHandler');
            sandbox.spy(viewStub,'getElement');

            profileSummaryRegion = new ProfileSummary(options);
            profileSummaryRegion.view = viewStub;

        });

        afterEach(function(){
            sandbox.restore();
        });

        it("ProfileSummary Region should be defined", function(){
            expect(ProfileSummary).not.to.be.undefined;
            expect(ProfileSummary).not.to.be.null;
        });

        describe('addEventHandlers()', function(){

            var eventBusStub;
            beforeEach(function(){
                eventBusStub = {
                    subscribe: function(){},
                    publish: function(){}
                };
                sandbox.stub(profileSummaryRegion,'getEventBus', function(){return eventBusStub;});
                sandbox.spy(eventBusStub,'subscribe');
                sandbox.spy(eventBusStub,'publish');
                sandbox.spy(profileSummaryRegion,'updatePrivileges');

                profileSummaryRegion.addEventHandlers();
            });

            it('Should call subscribe function for all section in profile summary', function(){
                expect(profileSummaryRegion.getEventBus.callCount).to.equal(5);
                expect(eventBusStub.subscribe.callCount).to.equal(4);
            });

            it('Should subscribe session-update event on profile summary when session is undefined', function(){
                expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal('profilesummary:sessions-update');

                var callback = eventBusStub.subscribe.getCall(0).args[1];
                var session = null;
                expect(callback).to.be.function;
                callback.call(profileSummaryRegion, session);

                expect(viewStub.getElement.callCount).to.equal(4);
                expect(functionStub.find.callCount).to.equal(4);

                expect(functionStub.find.getCall(0).args[0]).to.equal('.eaUsermanagement-ProfileSummary-editlink');
                expect(functionStub.find.getCall(1).args[0]).to.equal('.eaUsermanagement-ProfileSummary-sessions-loader');
                expect(functionStub.find.getCall(2).args[0]).to.equal('.eaUsermanagement-ProfileSummary-sessions-instances');
                expect(functionStub.find.getCall(3).args[0]).to.equal('.eaUsermanagement-ProfileSummary-sessions-value');

                expect(findStub.setText.callCount).to.equal(2);
                expect(findStub.setText.getCall(1).args[0]).to.equal('error');

                expect(findStub.setModifier.callCount).to.equal(1);
                expect(findStub.setModifier.calledWith('hide')).to.equal(true);

            });
            it('Should subscribe session-update event on profile summary when session is defined', function(){
                expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal('profilesummary:sessions-update');

                var callback = eventBusStub.subscribe.getCall(0).args[1];
                var sessions = {
                    username: "MockName"
                };

                expect(callback).to.be.function;
                callback.call(profileSummaryRegion, sessions);

                expect(viewStub.getElement.callCount).to.equal(5);
                expect(functionStub.find.callCount).to.equal(5);
                expect(functionStub.find.getCall(0).args[0]).to.equal('.eaUsermanagement-ProfileSummary-editlink');
                expect(functionStub.find.getCall(1).args[0]).to.equal('.eaUsermanagement-ProfileSummary-sessions-loader');
                expect(functionStub.find.getCall(2).args[0]).to.equal('.eaUsermanagement-ProfileSummary-sessions-instances');
                expect(functionStub.find.getCall(3).args[0]).to.equal('.eaUsermanagement-ProfileSummary-sessions-instances');
                expect(functionStub.find.getCall(4).args[0]).to.equal('.eaUsermanagement-ProfileSummary-sessions-value');

                expect(findStub.setText.callCount).to.equal(3);
                expect(findStub.setText.getCall(1).args[0]).to.equal(Dictionary.instances);
                expect(findStub.setText.getCall(2).args[0]).to.equal(0);

                expect(findStub.setModifier.callCount).to.equal(1);
                expect(findStub.setModifier.calledWith('hide')).to.equal(true);

            });

            it('Should update information with sessions on profile summary', function(){
               expect(eventBusStub.subscribe.getCall(1).args[0]).to.equal('profilesummary:terminatesessions');

               var callback = eventBusStub.subscribe.getCall(1).args[1];
               expect(callback).to.be.function;
               callback.call(profileSummaryRegion);

               expect(viewStub.getElement.callCount).to.equal(3);
               expect(functionStub.find.callCount).to.equal(3);
               expect(functionStub.find.getCall(0).args[0]).to.equal('.eaUsermanagement-ProfileSummary-sessions-value');
               expect(functionStub.find.getCall(1).args[0]).to.equal('.eaUsermanagement-ProfileSummary-sessions-instances');
               expect(functionStub.find.getCall(2).args[0]).to.equal('.eaUsermanagement-ProfileSummary-sessions-loader');

               expect(findStub.setText.callCount).to.equal(2);
               expect(findStub.removeModifier.callCount).to.equal(1);
               expect(findStub.removeModifier.calledWith('hide')).to.equal(true);

            });

            it('Should subscribe event for updatePrivileges', function(){
                expect(eventBusStub.subscribe.getCall(2).args[0]).to.equal('profilesummary:roles-MockName');

                var callback = eventBusStub.subscribe.getCall(2).args[1];
                expect(callback).to.be.function;

                callback.call(profileSummaryRegion);

                expect(profileSummaryRegion.updatePrivileges.calledOnce).to.equal(true);
            });

            it('Should publish sessions updated event, when sessions are null', function(){
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args[0]).to.equal('profilesummary:sessions-update');
            });


        });

        describe('onStart()', function(){

            beforeEach(function(){
                sandbox.stub(profileSummaryRegion,'addEventHandlers');
                sandbox.stub(profileSummaryRegion,'updatePrivileges');
                sandbox.spy(UserManagementService,'setTerminateSessions');
                profileSummaryRegion.onStart();
            });

            it('Should add event handlers and update privileges', function(){
                expect(profileSummaryRegion.addEventHandlers.callCount).to.equal(1);
                expect(profileSummaryRegion.updatePrivileges.callCount).to.equal(1);
            });

            it('Should add click event handler to terminate sessions button', function(){

                expect(findStub.addEventHandler.callCount).to.equal(1);
                expect(findStub.addEventHandler.getCall(0).args[0]).to.equal('click');

                var callback = findStub.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;

                callback.call(profileSummaryRegion);
                expect(UserManagementService.setTerminateSessions.callCount).to.equal(1);

            });
        });

        describe('updatePrivileges()', function(){
            beforeEach(function(){
                sandbox.spy(UserManagementService,'getRoles');
            });
            it('Should update privileges', function(){
                profileSummaryRegion.updatePrivileges();
                expect(UserManagementService.getRoles.calledOnce).to.equal(true);
                var callback = UserManagementService.getRoles.getCall(0).args[1];
                expect(callback).to.be.function;

            });
        });


    });
});
