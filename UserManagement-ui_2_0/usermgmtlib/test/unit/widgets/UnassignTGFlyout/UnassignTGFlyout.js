define([
    'container/api',
    'usermgmtlib/widgets/UnassignTGFlyout/UnassignTGFlyout',
    'widgets/InfoPopup',
    'identitymgmtlib/widgets/ListBuilder'
], function(apiContainer, UnassignTGFlyout, InfoPopup, ListBuilder) {

    'use strict';

    describe("UnassignTGFlyout", function() {
        var sandbox, viewStub, functionStub;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            functionStub = {
                setProperty: function() {},
                setText: function() {},
                addEventHandler: function() {},
                getProperty: function() {},
                setModifier: function() {},
                removeModifier: function() {},
                removeAttribute: function() {},
                setAttribute: function() {},
            };

            viewStub = {
                getApplyButton: function() {
                    return functionStub;
                },
                getErrorBox: function() {
                    return functionStub;
                },
                getCancelButton: function() {
                    return functionStub;
                },
                getRoleNameContainer: function() {
                    return functionStub;
                },
                getRoleNameLabel: function() {
                    return functionStub;
                },
                getListContainer: function() {}
            };

            sandbox.spy(functionStub, 'setProperty');
            sandbox.spy(functionStub, 'setText');
            sandbox.spy(functionStub, 'addEventHandler');
            sandbox.spy(functionStub, 'getProperty');
            sandbox.spy(functionStub, 'setModifier');
            sandbox.spy(functionStub, 'removeModifier');
            sandbox.spy(functionStub, 'removeAttribute');
            sandbox.spy(functionStub, 'setAttribute');


            sandbox.spy(viewStub, 'getApplyButton');
            sandbox.spy(viewStub, 'getErrorBox');
            sandbox.spy(viewStub, 'getCancelButton');
            sandbox.spy(viewStub, 'getRoleNameContainer');
            sandbox.spy(viewStub, 'getListContainer');

            UnassignTGFlyout.view = viewStub;

            UnassignTGFlyout.setEventBus(apiContainer.getEventBus());

            sandbox.spy(ListBuilder.prototype, 'init');


        });
        afterEach(function() {
            sandbox.restore();
        });

        it('UnassignTGFlyout should be defined', function() {
            expect(UnassignTGFlyout).not.to.be.undefined;
            expect(UnassignTGFlyout).not.to.be.null;
        });

        describe('onViewReady()', function() {
            beforeEach(function() {
                sandbox.spy(UnassignTGFlyout, 'addEventHandlers');
            });
            it('Should call addEventHandlerst', function() {
                var options = {};
                UnassignTGFlyout.onViewReady(options);

                expect(UnassignTGFlyout.addEventHandlers.callCount).to.equal(1);
            });
        });

        describe('addEventHandlers()', function() {
            beforeEach(function() {
                sandbox.spy(UnassignTGFlyout, 'handleClickApply');
                sandbox.spy(UnassignTGFlyout, 'handleClickCancel');

                UnassignTGFlyout.addEventHandlers();
            });
            it('Should call function to handle event on all buttons', function() {
                expect(UnassignTGFlyout.handleClickApply.calledOnce).to.equal(true);
                expect(UnassignTGFlyout.handleClickCancel.calledOnce).to.equal(true);
            });
        });

        describe('handleClickApply()', function() {
            var model, modelStub;
            beforeEach(function() {
                model = {
                    'tgs': ['ALL'],
                    'type': 'com',
                    'status': 'ENABLED'
                };
                modelStub = {
                    get: function(str) {
                        return model[str];
                    },
                    set: function() {},
                    getAttribute: function(str) {
                        return model[str];
                    }
                };
                sandbox.spy(modelStub, 'set');
                sandbox.spy(modelStub, 'get');
                sandbox.stub(UnassignTGFlyout, 'trigger');
                UnassignTGFlyout.setModel(modelStub);

                sandbox.stub(UnassignTGFlyout.listBuilder, 'getDestinationItemsIds', function(){return [[],[]]});

                UnassignTGFlyout.model = modelStub;
                UnassignTGFlyout.handleClickApply();
            });
            it('Should add event handler on click apply button', function() {

                expect(viewStub.getApplyButton.callCount).to.equal(2);
                expect(functionStub.addEventHandler.callCount).to.equal(1);
                expect(functionStub.addEventHandler.getCall(0).args[0]).to.equal('click');
            });

            it('Should update model with target groups data', function() {

                var callback = functionStub.addEventHandler.getCall(0).args[1];

                expect(callback).to.be.function;
                callback.call(UnassignTGFlyout);

                expect(UnassignTGFlyout.listBuilder.getDestinationItemsIds.callCount).to.equal(2);
                expect(UnassignTGFlyout.model.set.callCount).to.equal(2);

            });

            it('Should close flyout widget', function() {

                var callback = functionStub.addEventHandler.getCall(0).args[1];
                callback.call(UnassignTGFlyout);
                expect(UnassignTGFlyout.trigger.callCount).to.equal(1);
                expect(UnassignTGFlyout.trigger.getCall(0).args[0]).to.equal('close');

            });


            it('Should remove modifier displayed on view with error box', function() {

                var callback = functionStub.addEventHandler.getCall(0).args[1];
                callback.call(UnassignTGFlyout);
                expect(viewStub.getErrorBox.callCount).to.equal(1);
                expect(functionStub.removeModifier.callCount).to.equal(1);
                expect(functionStub.removeModifier.getCall(0).args[0]).to.equal('displayed');
            });

        });

        describe('handleClickCancel()', function() {
            beforeEach(function() {
                sandbox.spy(UnassignTGFlyout.eventBus, 'publish');
                sandbox.spy(UnassignTGFlyout, 'trigger');
                UnassignTGFlyout.handleClickCancel();
            });
            it('Should add event handler on click cancel button', function() {
                expect(viewStub.getCancelButton.calledOnce).to.equal(true);
                expect(functionStub.addEventHandler.calledOnce).to.equal(true);
                expect(functionStub.addEventHandler.getCall(0).args[0]).to.equal('click');
                expect(functionStub.addEventHandler.getCall(0).args[1]).to.be.function;
            });
            it('Should publish event to hide flyout', function() {
                var callback = functionStub.addEventHandler.getCall(0).args[1];

                callback.call(UnassignTGFlyout);
                expect(viewStub.getErrorBox.calledOnce).to.equal(true);
                expect(functionStub.removeModifier.calledOnce).to.equal(true);
                expect(UnassignTGFlyout.eventBus.publish.calledOnce).to.equal(true);
                expect(UnassignTGFlyout.eventBus.publish.getCall(0).args[0]).to.equal("flyout:hide");
                expect(UnassignTGFlyout.trigger.calledOnce).to.equal(true);
            });

        });




    });
});
