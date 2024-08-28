define([
    'container/api',
    'usermgmtlib/widgets/AssignTGFlyout/AssignTGFlyout',
    'widgets/InfoPopup',
    'identitymgmtlib/widgets/ListBuilder'
], function(apiContainer, AssignTGFlyout, InfoPopup, ListBuilder) {

    'use strict';

    describe("AssignTGFlyout", function() {
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
                getTgAllRadio: function() {
                    return functionStub;
                },
                getTgNoneRadio: function() {
                    return functionStub;
                },
                getErrorBox: function() {
                    return functionStub;
                },
                getErrorMessageBox: function() {
                    return functionStub;
                },
                getCancelButton: function() {
                    return functionStub;
                },
                getManualTgRadio: function() {
                    return functionStub;
                },
                getRoleNameContainer: function() {
                    return functionStub;
                },
                getRoleNameLabel: function() {
                    return functionStub;
                },
                getInlineMessageHolder: function() {
                    return functionStub;
                },

                getListContainer: function() {},
                getInfoPopupContainer: function() {},

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
            sandbox.spy(viewStub, 'getTgAllRadio');
            sandbox.spy(viewStub, 'getTgNoneRadio');
            sandbox.spy(viewStub, 'getErrorBox');
            sandbox.spy(viewStub, 'getErrorMessageBox');
            sandbox.spy(viewStub, 'getCancelButton');
            sandbox.spy(viewStub, 'getManualTgRadio');
            sandbox.spy(viewStub, 'getRoleNameContainer');
            sandbox.spy(viewStub, 'getListContainer');
            sandbox.spy(viewStub, 'getInfoPopupContainer');
            sandbox.spy(viewStub, 'getRoleNameLabel');

            AssignTGFlyout.view = viewStub;

            AssignTGFlyout.setEventBus(apiContainer.getEventBus());

            sandbox.spy(ListBuilder.prototype, 'init');


        });
        afterEach(function() {
            sandbox.restore();
        });

        it('AssignTGFlyout defined', function() {
            expect(AssignTGFlyout).not.to.be.undefined;
            expect(AssignTGFlyout).not.to.be.null;
        });

        describe('onViewReady()', function() {
            beforeEach(function() {
                sandbox.spy(AssignTGFlyout, 'addEventHandlers');
                sandbox.spy(InfoPopup.prototype, 'init');
                sandbox.spy(InfoPopup.prototype, 'attachTo');
            });
            it('Should add event handlers on all buttons in widget', function() {
                var options = {};
                AssignTGFlyout.onViewReady(options);

                expect(AssignTGFlyout.addEventHandlers.callCount).to.equal(1);
                expect(InfoPopup.prototype.init.callCount).to.equal(1);
                expect(InfoPopup.prototype.attachTo.callCount).to.equal(1);
                expect(viewStub.getInfoPopupContainer.callCount).to.equal(1);
            });
        });

        describe('addEventHandlers()', function() {
            beforeEach(function() {
                sandbox.spy(AssignTGFlyout, 'handleClickApply');
                sandbox.spy(AssignTGFlyout, 'handleClickCancel');
                sandbox.spy(AssignTGFlyout, 'handleRadioButtons');

                AssignTGFlyout.addEventHandlers();
            });
            it('Should call function to handle event on all buttons', function() {
                expect(AssignTGFlyout.handleClickApply.calledOnce).to.equal(true);
                expect(AssignTGFlyout.handleClickCancel.calledOnce).to.equal(true);
                expect(AssignTGFlyout.handleRadioButtons.calledOnce).to.equal(true);
            });
        });


        describe('setModel()', function() {
            var model, modelStub, server;
            beforeEach(function() {
                model = {
                    'tgs': ['ALL'],
                    'status': 'ENABLED'
                };
                modelStub = {
                    get: function(str) {
                        return model[str];
                    },
                    getAttribute: function(str) {
                        return model[str];
                    }
                };

                var response = [{
                    name: 'ALL',
                    description: 'All TGS',
                    isDefault: true
                }, {
                    name: 'NONE',
                    description: 'NONE TG1',
                    isDefault: true
                }, {
                    name: 'MOCKTGGROUP',
                    description: 'MOCKTGGROUP',
                    isDefault: true
                }];

                server = sandbox.useFakeServer();

                server.respondWith('GET', '/oss/idm/targetgroupmanagement/targetgroups', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(response)
                ]);
                server.autoRespond = true;
                sandbox.spy(modelStub, 'get');
            });

            it('Should set model and initialize listBuilder', function() {
                AssignTGFlyout.setModel(modelStub);

                expect(AssignTGFlyout.model).to.deep.equal(modelStub);
                expect(ListBuilder.prototype.init.callCount).to.equal(1);

            });

            // it('Should initialize properly view, when target group status is ALL', function() {
            //     AssignTGFlyout.setModel(modelStub);

            //     //2- setNoDisabledRadioboxes
            //     expect(viewStub.getTgAllRadio.callCount).to.equal(2);
            //     expect(viewStub.getTgNoneRadio.callCount).to.equal(2);
            //     expect(viewStub.getManualTgRadio.callCount).to.equal(1);

            //     expect(functionStub.setProperty.callCount).to.equal(3);

            //     expect(functionStub.setProperty.getCall(0).args[0]).to.equal('checked');
            //     expect(functionStub.setProperty.getCall(0).args[1]).to.equal(true);

            //     expect(functionStub.setProperty.getCall(1).args[0]).to.equal('checked');
            //     expect(functionStub.setProperty.getCall(1).args[1]).to.equal(false);

            //     expect(functionStub.setProperty.getCall(2).args[0]).to.equal('checked');
            //     expect(functionStub.setProperty.getCall(2).args[1]).to.equal(false);
            // });

            // it('Should initialize properly view, when target group status is NONE', function() {
            //     model = {
            //         'tgs': ['NONE'],
            //         'status': 'ENABLED'
            //     };

            //     AssignTGFlyout.setModel(modelStub);

            //     //2- setNoDisabledRadioboxes
            //     expect(viewStub.getManualTgRadio.callCount).to.equal(1);
            //     expect(viewStub.getTgAllRadio.callCount).to.equal(2);
            //     expect(viewStub.getTgNoneRadio.callCount).to.equal(2);

            //     expect(functionStub.setProperty.callCount).to.equal(3);
            //     expect(functionStub.setProperty.getCall(0).args[0]).to.equal('checked');
            //     expect(functionStub.setProperty.getCall(0).args[1]).to.equal(false);

            //     expect(functionStub.setProperty.getCall(1).args[0]).to.equal('checked');
            //     expect(functionStub.setProperty.getCall(1).args[1]).to.equal(true);

            //     expect(functionStub.setProperty.getCall(2).args[0]).to.equal('checked');
            //     expect(functionStub.setProperty.getCall(2).args[1]).to.equal(false);
            // });

            it('Should initialize properly view, when target group status is not NONE or ALL', function() {
                model = {
                    'tgs': ['MOCKTGGROUP'],
                    'status': 'ENABLED'
                };

                AssignTGFlyout.setModel(modelStub);

                //2- setNoDisabledRadioboxes
                expect(viewStub.getTgAllRadio.callCount).to.equal(2);
                expect(viewStub.getTgNoneRadio.callCount).to.equal(2);
                //expect(viewStub.getManualTgRadio.callCount).to.equal(1);

                expect(functionStub.setProperty.callCount).to.equal(3);

                expect(functionStub.setProperty.getCall(0).args[0]).to.equal('checked');
                expect(functionStub.setProperty.getCall(0).args[1]).to.equal(false);

                expect(functionStub.setProperty.getCall(1).args[0]).to.equal('checked');
                expect(functionStub.setProperty.getCall(1).args[1]).to.equal(false);

                expect(functionStub.setProperty.getCall(2).args[0]).to.equal('checked');
                expect(functionStub.setProperty.getCall(2).args[1]).to.equal(true);
            });
        });

        describe('handleClickApply()', function() {
            var model, modelStub;
            beforeEach(function() {
                model = {
                    'tgs': ['ALL'],
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

                AssignTGFlyout.model = modelStub;
                AssignTGFlyout.handleClickApply();
            });
            it('Should add event handler on click apply button', function() {

                sandbox.stub(AssignTGFlyout.listBuilder, 'getDestinationItemsIds', function() {
                    return [
                        [],
                        []
                    ];
                });
                sandbox.stub(AssignTGFlyout, 'trigger');

                expect(viewStub.getApplyButton.callCount).to.equal(1);
                expect(functionStub.addEventHandler.callCount).to.equal(1);
                expect(functionStub.addEventHandler.getCall(0).args[0]).to.equal('click');

                var callback = functionStub.addEventHandler.getCall(0).args[1];

                expect(callback).to.be.function;
                callback.call(AssignTGFlyout);

                expect(AssignTGFlyout.listBuilder.getDestinationItemsIds.callCount).to.equal(2);
                //expect(AssignTGFlyout.model.set.callCount).to.equal(1);
                expect(AssignTGFlyout.trigger.callCount).to.equal(1);
                expect(viewStub.getErrorBox.callCount).to.equal(1);
                expect(functionStub.removeModifier.callCount).to.equal(1);

            });
            it('Should show error message on view', function() {

                sandbox.stub(AssignTGFlyout.listBuilder, 'getDestinationItemsIds', function() {
                    return {};
                });
                sandbox.stub(AssignTGFlyout, 'trigger');

                expect(viewStub.getApplyButton.callCount).to.equal(1);
                expect(functionStub.addEventHandler.callCount).to.equal(1);
                expect(functionStub.addEventHandler.getCall(0).args[0]).to.equal('click');

                var callback = functionStub.addEventHandler.getCall(0).args[1];

                expect(callback).to.be.function;
                callback.call(AssignTGFlyout);

                expect(AssignTGFlyout.listBuilder.getDestinationItemsIds.callCount).to.equal(1);
                expect(viewStub.getErrorBox.callCount).to.equal(1);
                expect(functionStub.setModifier.callCount).to.equal(1);
                expect(functionStub.setModifier.getCall(0).args[0]).to.equal('displayed');
                expect(viewStub.getErrorMessageBox.callCount).to.equal(1);
                expect(functionStub.setText.callCount).to.equal(1);

            });

        });

        describe('handleClickCancel()', function() {
            beforeEach(function() {
                sandbox.spy(AssignTGFlyout.eventBus, 'publish');
                sandbox.spy(AssignTGFlyout, 'trigger');
                AssignTGFlyout.handleClickCancel();
            });
            it('Should add event handler on click cancel button', function() {
                expect(viewStub.getCancelButton.calledOnce).to.equal(true);
                expect(functionStub.addEventHandler.calledOnce).to.equal(true);
                expect(functionStub.addEventHandler.getCall(0).args[0]).to.equal('click');
                expect(functionStub.addEventHandler.getCall(0).args[1]).to.be.function;
            });
            it('Should publish event to hide flyout', function() {
                var callback = functionStub.addEventHandler.getCall(0).args[1];

                callback.call(AssignTGFlyout);
                expect(viewStub.getErrorBox.calledOnce).to.equal(true);
                expect(functionStub.removeModifier.calledOnce).to.equal(true);
                expect(AssignTGFlyout.eventBus.publish.calledOnce).to.equal(true);
                expect(AssignTGFlyout.eventBus.publish.getCall(0).args[0]).to.equal("flyout:hide");
                expect(AssignTGFlyout.trigger.calledOnce).to.equal(true);
            });

        });

        describe('handleRadioButtons()', function() {
            var output;
            beforeEach(function() {
                sandbox.stub(ListBuilder.prototype, 'setEnabled');
                AssignTGFlyout.handleRadioButtons();
            });

            it('Should add event handler on click All target groups radio buttons', function() {

                expect(viewStub.getErrorBox.calledOnce).to.equal(true);
                expect(functionStub.removeModifier.calledOnce).to.equal(true);


                expect(viewStub.getTgAllRadio.calledOnce).to.equal(true);
                expect(functionStub.addEventHandler.callCount).to.equal(3);

                expect(functionStub.addEventHandler.getCall(0).args[0]).to.equal('click');
                output = functionStub.addEventHandler.getCall(0).args[1];

                expect(output).to.be.function;
                output.call();

                expect(ListBuilder.prototype.setEnabled.callCount).to.equal(1);
                expect(ListBuilder.prototype.setEnabled.calledWith(false)).to.equal(true);



            });
            it('Should add event handler on click None target group radio buttons', function() {

                expect(viewStub.getErrorBox.calledOnce).to.equal(true);
                expect(functionStub.removeModifier.calledOnce).to.equal(true);

                expect(viewStub.getTgNoneRadio.calledOnce).to.equal(true);
                expect(functionStub.addEventHandler.callCount).to.equal(3);

                expect(functionStub.addEventHandler.getCall(1).args[0]).to.equal('click');
                output = functionStub.addEventHandler.getCall(1).args[1];

                expect(output).to.be.function;
                output.call();

                expect(ListBuilder.prototype.setEnabled.callCount).to.equal(1);
                expect(ListBuilder.prototype.setEnabled.calledWith(false)).to.equal(true);

            });
            it('Should add event handler on click Manual target group radio buttons', function() {

                expect(viewStub.getErrorBox.calledOnce).to.equal(true);
                expect(functionStub.removeModifier.calledOnce).to.equal(true);

                expect(viewStub.getManualTgRadio.calledOnce).to.equal(true);
                expect(functionStub.addEventHandler.callCount).to.equal(3);

                expect(functionStub.addEventHandler.getCall(2).args[0]).to.equal('click');
                output = functionStub.addEventHandler.getCall(2).args[1];

                expect(output).to.be.function;
                output.call();

                expect(ListBuilder.prototype.setEnabled.callCount).to.equal(1);
                expect(ListBuilder.prototype.setEnabled.calledWith(true)).to.equal(true);
            });



        });

        describe('setNoDisabledRadioboxes()', function() {
            var status;
            it('should properly view when status is enabled', function() {
                status = 'ENABLED';

                AssignTGFlyout.setNoDisabledRadioboxes(status);

                expect(viewStub.getTgNoneRadio.calledOnce).to.equal(true);
                expect(viewStub.getTgAllRadio.calledOnce).to.equal(true);
                expect(viewStub.getManualTgRadio.calledOnce).to.equal(false); //!!! true
                expect(viewStub.getApplyButton.calledOnce).to.equal(true);

                expect(functionStub.removeAttribute.callCount).to.equal(3); //!!! 4
                expect(functionStub.removeAttribute.getCall(0).args[0]).to.equal('disabled');
                expect(functionStub.removeAttribute.getCall(1).args[0]).to.equal('disabled');
                expect(functionStub.removeAttribute.getCall(2).args[0]).to.equal('disabled');
            });
            it('should properly view when status is disabled', function() {
                status = 'DISABLED';

                AssignTGFlyout.setNoDisabledRadioboxes(status);

                expect(viewStub.getTgNoneRadio.calledOnce).to.equal(true);
                expect(viewStub.getTgAllRadio.calledOnce).to.equal(true);
                expect(viewStub.getManualTgRadio.calledOnce).to.equal(true);
                expect(viewStub.getApplyButton.calledOnce).to.equal(true);

                expect(functionStub.setAttribute.callCount).to.equal(4);
                expect(functionStub.setAttribute.getCall(0).args[0]).to.equal('disabled');
                expect(functionStub.setAttribute.getCall(1).args[0]).to.equal('disabled');
                expect(functionStub.setAttribute.getCall(2).args[0]).to.equal('disabled');
                expect(functionStub.setAttribute.getCall(3).args[0]).to.equal('disabled');

                expect(functionStub.setAttribute.getCall(0).args[1]).to.equal('disabled');
                expect(functionStub.setAttribute.getCall(1).args[1]).to.equal('disabled');
                expect(functionStub.setAttribute.getCall(2).args[1]).to.equal('disabled');
                expect(functionStub.setAttribute.getCall(3).args[1]).to.equal('disabled');
            });
        });
    });
});
