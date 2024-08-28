/*******************************************************************************
  * COPYRIGHT Ericsson 2016
  *
  * The copyright to the computer program(s) herein is the property of
  * Ericsson Inc. The programs may be used and/or copied only with written
  * permission from Ericsson Inc. or in accordance with the terms and
  * conditions stipulated in the agreement/contract under which the
  * program(s) have been supplied.
 *******************************************************************************/
define([
    'jscore/core',
    'usermgmtlib/cells/TGAssignedCell/TGAssignedCell',
    'identitymgmtlib/mvp/binding'
], function(core, TGAssignedCell,binding){
    'use strict';

    describe('TGAssignedCell', function(){
        var sandbox, tGAssignedCell, viewStub, getElementStub, findStub, elementStub;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();

            elementStub = new core.Element('div');

            getElementStub = {
                find: function(){return elementStub;},
                setAttribute: function(){}
            };

            viewStub = {
                getElement: function(){return getElementStub;}
            };

            sandbox.stub(binding,'bind');
            sandbox.spy(viewStub,'getElement');
            sandbox.spy(getElementStub,'find');
            sandbox.spy(getElementStub,'setAttribute');
            sandbox.spy(elementStub,'setText');

            tGAssignedCell = new TGAssignedCell();
            tGAssignedCell.view = viewStub;

        });
        afterEach(function(){
            sandbox.restore();
        });
        it('TGAssignedCell should be defined', function(){
            expect(TGAssignedCell).not.to.be.undefined;
            expect(TGAssignedCell).not.to.be.null;
        });

        describe("setValue()",function(){
            var model, modelStub;
            it('Should change assigned target group status to NONE when target group is null and role type is COM', function(){
                model = {
                    'name': 'MockName',
                    'type': 'com',
                    'tgs': null
                };

                modelStub= {
                    get: function(str){return model[str];},
                    addEventHandler: function(){}
                };

                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'addEventHandler');

                tGAssignedCell.setValue(modelStub);

                expect(modelStub.addEventHandler.calledOnce).to.equal(true);
                var callback = modelStub.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;

                callback.call(tGAssignedCell);

                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.setText.callCount).to.equal(2);
                expect(elementStub.setText.getCall(0).args[0]).to.equal('NONE');
            });
            it('Should change assigned target group status to Not applicable when target group is null and role type is system', function(){
                model = {
                    'name': 'MockName',
                    'type': 'system',
                    'tgs': null
                };

                modelStub= {
                    get: function(str){return model[str];},
                    addEventHandler: function(){}
                };

                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'addEventHandler');

                tGAssignedCell.setValue(modelStub);

                expect(modelStub.addEventHandler.calledOnce).to.equal(true);
                var callback = modelStub.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;

                callback.call(tGAssignedCell);

                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.setText.callCount).to.equal(2);
                expect(elementStub.setText.getCall(0).args[0]).to.equal('Not applicable');
            });
            it('Should change assigned target group status on ALL', function(){
                model = {
                    'name': 'MockName',
                    'type': 'comalias',
                    'tgs': ['ALL']
                };

                modelStub= {
                    get: function(str){return model[str];},
                    addEventHandler: function(){}
                };

                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'addEventHandler');

                tGAssignedCell.setValue(modelStub);

                expect(modelStub.addEventHandler.calledOnce).to.equal(true);
                var callback = modelStub.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;

                callback.call(tGAssignedCell);

                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.setText.callCount).to.equal(2);
                expect(elementStub.setText.getCall(0).args[0]).to.equal('ALL');
            });
            it('Should change assigned target group status on NONE', function(){
                model = {
                    'name': 'MockName',
                    'type': 'com',
                    'tgs': ['NONE']
                };

                modelStub= {
                    get: function(str){return model[str];},
                    addEventHandler: function(){}
                };

                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'addEventHandler');

                tGAssignedCell.setValue(modelStub);

                expect(modelStub.addEventHandler.calledOnce).to.equal(true);
                var callback = modelStub.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;

                callback.call(tGAssignedCell);

                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.setText.callCount).to.equal(2);
                expect(elementStub.setText.getCall(0).args[0]).to.equal('NONE');
            });
            it('Should set text with target group length', function(){
                model = {
                    'name': 'MockName',
                    'type': 'com',
                    'tgs': ['MOCKtgs']
                };

                modelStub= {
                    get: function(str){return model[str];},
                    addEventHandler: function(){}
                };

                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'addEventHandler');

                tGAssignedCell.setValue(modelStub);

                expect(modelStub.addEventHandler.calledOnce).to.equal(true);
                var callback = modelStub.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;

                callback.call(tGAssignedCell);

                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.setText.callCount).to.equal(2);
                expect(elementStub.setText.getCall(0).args[0]).to.equal(1);
            });
            it('Should set text when it is system role', function(){
                checkIfNotApplicableIsSetForRoleType.call(this, 'system');
            });
            it('Should set text when it is application role', function(){
                checkIfNotApplicableIsSetForRoleType.call(this, 'application');
            });
            it('Should set text when it is custom role', function(){
                checkIfNotApplicableIsSetForRoleType.call(this, 'custom');
            });

            var checkIfNotApplicableIsSetForRoleType = function(roleType) {
                model = {
                    'name': 'MockName',
                    'type': roleType,
                    'tgs': ['MOCKtgs']
                };

                modelStub= {
                    get: function(str){return model[str];},
                    addEventHandler: function(){}
                };

                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'addEventHandler');

                tGAssignedCell.setValue(modelStub);

                expect(modelStub.addEventHandler.calledOnce).to.equal(true);
                var callback = modelStub.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;

                callback.call(tGAssignedCell);

                expect(getElementStub.find.callCount).to.equal(2);
                expect(elementStub.setText.callCount).to.equal(2);
                expect(elementStub.setText.getCall(0).args[0]).to.equal('Not applicable');
            };
        });
    });
});
