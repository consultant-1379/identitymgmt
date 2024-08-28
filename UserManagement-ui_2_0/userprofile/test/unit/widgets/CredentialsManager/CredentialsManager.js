define([
    'userprofile/widgets/CredentialsManager/CredentialsManager',
    'userprofile/model/UserprofileCredentialsModel',
    'usermgmtlib/model/PasswordPoliciesCollection',
    'container/api',
    'jscore/core'
], function(CredentialsManager, UserProfileCredentialsModel, PasswordPoliciesCollection, container,core){
    "use strict";
    describe('CredentialsManager', function(){
        var sandbox, options, credentialsManager, viewStub, elementStub,functionStub, functionStub1;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();

            options = {
                model: new UserProfileCredentialsModel(),

            };
            options.model.passwordPoliciesCollection = new PasswordPoliciesCollection();
            sandbox.spy(options.model,'set');
            elementStub = new core.Element('div');
            functionStub = {
                find: function(){ return elementStub;},
                disable: function(){},
                enable: function(){}

            };

            viewStub = {
                getElement: function(){return functionStub;},
                findById: function(){return functionStub;},

            };

            sandbox.spy(functionStub,'find');
            sandbox.spy(functionStub,'disable');
            sandbox.spy(functionStub,'enable');


            sandbox.spy(viewStub,'getElement');
            sandbox.spy(viewStub,'findById');
            sandbox.stub(elementStub,'setModifier');

            credentialsManager = new CredentialsManager(options);


            credentialsManager.view = viewStub;
        });
        afterEach(function(){
            sandbox.restore();
        });

        it('CredentialsManager should be defined', function(){
            expect(CredentialsManager).not.to.be.undefined;
            expect(CredentialsManager).not.to.be.null;
        });

        describe('init()', function(){
            it('Should initialize model and save/cancel buttons', function(){
                expect(credentialsManager.buttonWidgetSubmit).not.to.be.null;
                expect(credentialsManager.buttonWidgetSubmit).not.to.be.undefined;
                expect(credentialsManager.buttonWidgetCancel).not.to.be.null;
                expect(credentialsManager.buttonWidgetCancel).not.to.be.undefined;
            });
        });

        describe('onViewReady()', function(){
            beforeEach(function(){
                sandbox.spy(credentialsManager,'addEventHandlers');
                sandbox.spy(credentialsManager.infoPopup,'attachTo');
                sandbox.spy(credentialsManager,'getViewElement');
                sandbox.spy(credentialsManager.buttonWidgetSubmit,'attachTo');
                sandbox.spy(credentialsManager.buttonWidgetCancel,'attachTo');

                 credentialsManager.onViewReady();
            });
            it('Should call function addEventHandlers', function(){

                expect(credentialsManager.addEventHandlers.callCount).to.equal(1);
            });
            it('Should set modifier to element on view', function(){
               expect(viewStub.getElement.callCount).to.equal(5);
            });
            
        });
        describe('addEventHandlers()', function(){

            beforeEach(function(){

                sandbox.spy(credentialsManager.buttonWidgetSubmit,'addEventHandler');
                sandbox.spy(credentialsManager.buttonWidgetCancel,'addEventHandler');
                sandbox.spy(container,'getEventBus');
                sandbox.spy(credentialsManager,'trigger');

                credentialsManager.addEventHandlers();

            });

            it('Should add event handler on button cancel', function(){
                expect(credentialsManager.buttonWidgetCancel.addEventHandler.callCount).to.equal(1);
                expect(credentialsManager.buttonWidgetCancel.addEventHandler.getCall(0).args[0]).to.equal('click');
                var output = credentialsManager.buttonWidgetCancel.addEventHandler.getCall(0).args[1];
                expect(output).to.be.function;

                output.call(credentialsManager);
                expect(container.getEventBus.callCount).to.equal(1);


            });

            it('Should add event handler on button submit', function(){
                expect(credentialsManager.buttonWidgetSubmit.addEventHandler.callCount).to.equal(1);
                expect(credentialsManager.buttonWidgetSubmit.addEventHandler.getCall(0).args[0]).to.equal('click');
                var output = credentialsManager.buttonWidgetSubmit.addEventHandler.getCall(0).args[1];
                expect(output).to.be.function;
                output.call(credentialsManager);
                expect(credentialsManager.trigger.callCount).to.equal(1);
                expect(credentialsManager.trigger.getCall(0).args[0]).to.equal('loader-show');
            });
        });
        describe('showFlyout()', function(){
            var publishStub;
            beforeEach(function(){
                publishStub ={
                    publish: function(){}
                };
            sandbox.spy(publishStub,'publish');
            sandbox.stub(container,'getEventBus', function(){return publishStub});

            });
            it('Should open flyout', function(){
                credentialsManager.showFlyout();
                expect(container.getEventBus.callCount).to.equal(1);
                expect(publishStub.publish.callCount).to.equal(1);
                expect(publishStub.publish.getCall(0).args[0]).to.equal('flyout:show');
            });
        });
        describe('hideFlyout()', function(){
            var publishStub;
            beforeEach(function(){
                publishStub ={
                    publish: function(){}
                };
                sandbox.spy(publishStub,'publish');
                sandbox.stub(container,'getEventBus', function(){return publishStub});

            });
            it('Should close flyout', function(){
                credentialsManager.hideFlyout();
                expect(container.getEventBus.callCount).to.equal(1);
                expect(publishStub.publish.callCount).to.equal(1);
                expect(publishStub.publish.getCall(0).args[0]).to.equal('flyout:hide');
            });
        });
        describe('getViewElement()', function() {

            it('Should return suitable element', function() {
                var callback = credentialsManager.getViewElement('');

                expect(viewStub.getElement.calledOnce).to.equal(true);
                expect(functionStub.find.calledOnce).to.equal(true);
                expect(functionStub.find.calledWith('.eaUserprofile-CredentialsManager-formContainer')).to.equal(true);

                expect(callback).not.to.be.null;
                expect(callback instanceof core.Element);
            });
        });
    });


});