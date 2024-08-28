define([
    'identitymgmtlib/ConfirmationSummaryList',
    'identitymgmtlib/Utils',
    'tablelib/Table',
    'i18n!identitymgmtlib/common.json'
],function(ConfirmationSummaryList, Utils, Table, Dictionary){
    'use strict';

     describe("ConfirmationSummaryList", function(){

        it('ConfirmationSummaryList should be defined', function() {
        expect(ConfirmationSummaryList).not.to.be.undefined;
        });

        var sandbox, confirmationSummaryList;

        beforeEach(function(){
        sandbox = sinon.sandbox.create();

        });

        afterEach(function(){
        sandbox.restore();
        });


        describe('onViewReady',function(){
            var viewStub, options;

            beforeEach(function(){
                viewStub = {
                    setTotalCount : sandbox.stub(),
                    setFailedCount: sandbox.stub(),
                    setSucceedCount: sandbox.stub(),
                    setInfoDiv: sandbox.stub(),
                    getTableDiv: sandbox.stub()
                };

                options = {
                    elementsArray:[{
                        key: 'user1',
                        status: 'false',
                        text: 'Inactive'
                    },
                    {
                        key: 'user2',
                        status: 'true',
                        text: 'Active'
                    }],
                    statuses:["Inactive","Active"]
                };
                sandbox.stub(ConfirmationSummaryList.prototype, 'init');
            });

            describe('Two user deleted', function(){
                beforeEach(function(){
                    confirmationSummaryList = new ConfirmationSummaryList({
                        elementsArray:options.elementsArray,
                        statuses:options.statuses
                    });
                    sandbox.spy(confirmationSummaryList,'createResultTable');
                    confirmationSummaryList.view = viewStub;
                    confirmationSummaryList.onViewReady(confirmationSummaryList.options);
                });

                it('Check setTotalCount', function(){
                    expect(viewStub.setTotalCount.callCount).to.equal(1);
                    expect(viewStub.setTotalCount.calledWith(2)).to.equal(true);
                });

                it('Check setFailedCount', function(){
                    expect(viewStub.setFailedCount.callCount).to.equal(1);
                });

                it('Check setSucceedCount', function(){
                    expect(viewStub.setSucceedCount.callCount).to.equal(1);
                });

                it('Check createResultTable', function(){
                    expect(confirmationSummaryList.createResultTable.callCount).to.equal(1);
                });

                it('Check getTableDiv', function(){
                    expect(viewStub.getTableDiv.callCount).to.equal(1);
                });

            });
        });
    });
});