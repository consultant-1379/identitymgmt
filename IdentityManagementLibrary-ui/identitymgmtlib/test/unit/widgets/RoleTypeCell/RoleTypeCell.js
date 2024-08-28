/*******************************************************************************
  * COPYRIGHT Ericsson 2016
  *
  * The copyright to the computer program(s) herein is the property of
  * Ericsson Inc. The programs may be used and/or copied only with written
  * permission from Ericsson Inc. or in accordance with the terms and
  * conditions stipulated in the agreement/contract under which the
  * program(s) have been supplied.
*******************************************************************************/

/*global define, describe, it, expect */
define([
    'identitymgmtlib/widgets/RoleTypeCell/RoleTypeCell'
], function (RoleTypeCell) {
    'use strict';

    describe('RoleTypeCell', function () {

        it('RoleTypeCell should be defined', function () {
            expect(RoleTypeCell).not.to.be.undefined;
        });

        var sandbox, typeCell, viewStub, getTypeTextStub;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            typeCell = new RoleTypeCell();

        	getTypeTextStub = {
                    setText : function () {}
                };

            viewStub = {
            		getTypeText : function () {return getTypeTextStub;},
            };

            typeCell.view = viewStub;

        });

        afterEach(function(){
            sandbox.restore();
        });

        describe('setValue()',function(){
            beforeEach(function(){
                sandbox.spy(viewStub, 'getTypeText');
                sandbox.spy(getTypeTextStub, 'setText');
            });

            it('Should set type to com', function (){

                // Action
                typeCell.setValue('com');

                expect(getTypeTextStub.setText.callCount).to.equal(1);
                expect(getTypeTextStub.setText.getCall(0).calledWith("COM Role")).to.equal(true);

            });

            it('Should set type to comalias', function (){

                // Action
                typeCell.setValue('comalias');

                expect(getTypeTextStub.setText.callCount).to.equal(1);
                expect(getTypeTextStub.setText.getCall(0).calledWith("COM Role Alias")).to.equal(true);

            });

            it('Should set type to custom', function (){

                // Action
                typeCell.setValue('custom');

                expect(getTypeTextStub.setText.callCount).to.equal(1);
                expect(getTypeTextStub.setText.getCall(0).calledWith("Custom Role")).to.equal(true);

            });

            it('Should set type to system', function (){

              // Action
              typeCell.setValue('system');

              expect(getTypeTextStub.setText.callCount).to.equal(1);
              expect(getTypeTextStub.setText.getCall(0).calledWith("ENM System Role")).to.equal(true);

            });

            it('Should set type to application', function (){

              // Action
              typeCell.setValue('application');

              expect(getTypeTextStub.setText.callCount).to.equal(1);
              expect(getTypeTextStub.setText.getCall(0).calledWith("ENM System Role")).to.equal(true);

            });

            it('Should set type to cpp', function (){

              // Action
              typeCell.setValue('cpp');

              expect(getTypeTextStub.setText.callCount).to.equal(1);
              expect(getTypeTextStub.setText.getCall(0).calledWith("Task Profile Role")).to.equal(true);

            });
        });

    });

});
