/*global define, describe, it, expect, beforeEach, afterEach, sinon */
define([
    'identitymgmtlib/ResponsesSummaryList',
    'identitymgmtlib/Utils',
    'tablelib/Table',
    'i18n!identitymgmtlib/common.json',
    'i18n!identitymgmtlib/error-codes.json'
], function (ResponsesSummaryList, Utils, Table, Dictionary, ErrorCodes) {
    'use strict';


    var roleMgmtErrorCodes = {
        '204': {
            'default': 'Success',
            'internalCodes': {
                '100401': 'ExampleInternalCode'
            }
        },
        '400': {
            'default': 'Role assigned to group role'
        },
        '404': {
            'default': 'Role not found'
        },
        '422': {
            'default': 'Role assigned to user'
        },
        '500': {
            'default': 'Internal server error'
        },
        '123': {
            'default': 'Some error',
            'internalCodes': {
                '100.10': 'Some internal code'
            }
        },
        'unexpected': 'Code {0} - Unexpected reason'
    };

    describe('ResponsesSummaryList', function () {

        it('ResponsesSummaryList should be defined', function () {
            expect(ResponsesSummaryList).not.to.be.undefined;
        });

        var sandbox, responsesSummaryList, deletedRolesStatus;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            responsesSummaryList = undefined;
            deletedRolesStatus = [];
        });

        afterEach(function () {
            sandbox.restore();
        });

        describe('onViewReady', function () {

            var viewStub, data;

            beforeEach(function () {

                data = [];

                viewStub = {
                    setTotalCount: sandbox.stub(),
                    setSuccededCount: sandbox.stub(),
                    setFailedCount: sandbox.stub(),
                    getTableDiv: sandbox.stub(),
                    hideStatusSuccededField: sandbox.stub(),
                    hidetatusFaileddField: sandbox.stub()
                };

                //init runs onViewReady, by stubbing it we are preventing that
                //options are stored in constructor, so we have acces
                sandbox.stub(ResponsesSummaryList.prototype, 'init');
            });

            describe('one role deleted succesfully', function () {

                beforeEach(function () {
                    deletedRolesStatus.push(['testedRoleName', 204]);
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus
                    });
                    sandbox.spy(responsesSummaryList, 'createResultTable');
                    responsesSummaryList.view = viewStub;
                    responsesSummaryList.onViewReady(responsesSummaryList.options);
                });
                it('Check setTotalCount', function () {
                    expect(viewStub.setTotalCount.callCount).to.equal(1);
                    expect(viewStub.setTotalCount.calledWith(1)).to.equal(true);
                });
                it('Check setSuccededCount', function () {
                    expect(viewStub.setSuccededCount.callCount).to.equal(1);
                    expect(viewStub.setSuccededCount.calledWith(1)).to.equal(true);
                });
                it('Check setFailedCount', function () {
                    expect(viewStub.setFailedCount.callCount).to.equal(1);
                    expect(viewStub.setFailedCount.calledWith(0)).to.equal(true);
                });
                it('Check hideStatusSuccededField', function () {
                    expect(viewStub.hideStatusSuccededField.callCount).to.equal(0);
                });
                it('Check hidetatusFaileddField', function () {
                    expect(viewStub.hidetatusFaileddField.callCount).to.equal(0);
                });
                it('Check createResultTable', function () {
                    expect(responsesSummaryList.createResultTable.callCount).to.equal(1);
                    data.push({
                        elementName: deletedRolesStatus[0][0],
                        result: "Success"
                    });
                    expect(responsesSummaryList.createResultTable.getCall(0).args[0]).to.deep.equal(data);
                });
                it('Check getTableDiv', function () {
                    expect(viewStub.getTableDiv.callCount).to.equal(1);
                });
            });

            describe('one role delete fail: Role assigned to group role', function () {

                beforeEach(function () {
                    deletedRolesStatus.push(['testedRoleName', 400]);
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus,
                        errorCodes: roleMgmtErrorCodes
                    });
                    sandbox.spy(responsesSummaryList, 'createResultTable');
                    responsesSummaryList.view = viewStub;
                    responsesSummaryList.onViewReady(responsesSummaryList.options);
                });

                it('Check setTotalCount', function () {
                    expect(viewStub.setTotalCount.callCount).to.equal(1);
                    expect(viewStub.setTotalCount.calledWith(1)).to.equal(true);
                });
                it('Check setSuccededCount', function () {
                    expect(viewStub.setSuccededCount.callCount).to.equal(1);
                    expect(viewStub.setSuccededCount.calledWith(0)).to.equal(true);
                });
                it('Check setFailedCount', function () {
                    expect(viewStub.setFailedCount.callCount).to.equal(1);
                    expect(viewStub.setFailedCount.calledWith(1)).to.equal(true);
                });
                it('Check hideStatusSuccededField', function () {
                    expect(viewStub.hideStatusSuccededField.callCount).to.equal(1);
                });
                it('Check hidetatusFaileddField', function () {
                    expect(viewStub.hidetatusFaileddField.callCount).to.equal(1);
                });
                it('Check createResultTable', function () {
                    expect(responsesSummaryList.createResultTable.callCount).to.equal(1);
                    data.push({
                        elementName: deletedRolesStatus[0][0],
                        result: Utils.getErrorMessage(deletedRolesStatus[0][1]).defaultHttpMessage
                    });
                    expect(responsesSummaryList.createResultTable.getCall(0).args[0]).to.deep.equal(data);
                });
                it('Check getTableDiv', function () {
                    expect(viewStub.getTableDiv.callCount).to.equal(1);
                });
            });

            describe('one role delete fail: Role not found', function () {

                beforeEach(function () {
                    deletedRolesStatus.push(['testedRoleName', 404]);
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus,
                        errorCodes: roleMgmtErrorCodes
                    });
                    sandbox.spy(responsesSummaryList, 'createResultTable');
                    responsesSummaryList.view = viewStub;
                    responsesSummaryList.onViewReady(responsesSummaryList.options);
                });

                it('Check setTotalCount', function () {
                    expect(viewStub.setTotalCount.callCount).to.equal(1);
                    expect(viewStub.setTotalCount.calledWith(1)).to.equal(true);
                });
                it('Check setSuccededCount', function () {
                    expect(viewStub.setSuccededCount.callCount).to.equal(1);
                    expect(viewStub.setSuccededCount.calledWith(0)).to.equal(true);
                });
                it('Check setFailedCount', function () {
                    expect(viewStub.setFailedCount.callCount).to.equal(1);
                    expect(viewStub.setFailedCount.calledWith(1)).to.equal(true);
                });
                it('Check hideStatusSuccededField', function () {
                    expect(viewStub.hideStatusSuccededField.callCount).to.equal(1);
                });
                it('Check hidetatusFaileddField', function () {
                    expect(viewStub.hidetatusFaileddField.callCount).to.equal(1);
                });
                it('Check createResultTable', function () {
                    expect(responsesSummaryList.createResultTable.callCount).to.equal(1);
                    data.push({
                        elementName: deletedRolesStatus[0][0],
                        result: Utils.getErrorMessage(deletedRolesStatus[0][1]).defaultHttpMessage
                    });
                    expect(responsesSummaryList.createResultTable.getCall(0).args[0]).to.deep.equal(data);
                });
                it('Check getTableDiv', function () {
                    expect(viewStub.getTableDiv.callCount).to.equal(1);
                });
            });

            describe('one role delete fail: Role assigned to user', function () {

                beforeEach(function () {
                    deletedRolesStatus.push(['testedRoleName', 422]);
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus,
                        errorCodes: roleMgmtErrorCodes
                    });
                    sandbox.spy(responsesSummaryList, 'createResultTable');
                    responsesSummaryList.view = viewStub;
                    responsesSummaryList.onViewReady(responsesSummaryList.options);
                });

                it('Check setTotalCount', function () {
                    expect(viewStub.setTotalCount.callCount).to.equal(1);
                    expect(viewStub.setTotalCount.calledWith(1)).to.equal(true);
                });
                it('Check setSuccededCount', function () {
                    expect(viewStub.setSuccededCount.callCount).to.equal(1);
                    expect(viewStub.setSuccededCount.calledWith(0)).to.equal(true);
                });
                it('Check setFailedCount', function () {
                    expect(viewStub.setFailedCount.callCount).to.equal(1);
                    expect(viewStub.setFailedCount.calledWith(1)).to.equal(true);
                });
                it('Check hideStatusSuccededField', function () {
                    expect(viewStub.hideStatusSuccededField.callCount).to.equal(1);
                });
                it('Check hidetatusFaileddField', function () {
                    expect(viewStub.hidetatusFaileddField.callCount).to.equal(1);
                });
                it('Check createResultTable', function () {
                    expect(responsesSummaryList.createResultTable.callCount).to.equal(1);
                    data.push({
                        elementName: deletedRolesStatus[0][0],
                        result: Utils.getErrorMessage(deletedRolesStatus[0][1]).defaultHttpMessage
                    });
                    expect(responsesSummaryList.createResultTable.getCall(0).args[0]).to.deep.equal(data);
                });
                it('Check getTableDiv', function () {
                    expect(viewStub.getTableDiv.callCount).to.equal(1);
                });
            });

            describe('one role delete fail: unexpected reason (4xx but unhandled response)', function () {

                var unexpected;

                beforeEach(function () {
                    deletedRolesStatus.push(['testedRoleName', 499]);
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus,
                        errorCodes: roleMgmtErrorCodes
                    });
                    sandbox.spy(responsesSummaryList, 'createResultTable');
                    responsesSummaryList.view = viewStub;
                    responsesSummaryList.onViewReady(responsesSummaryList.options);
                });

                it('Check setTotalCount', function () {
                    expect(viewStub.setTotalCount.callCount).to.equal(1);
                    expect(viewStub.setTotalCount.calledWith(1)).to.equal(true);
                });
                it('Check setSuccededCount', function () {
                    expect(viewStub.setSuccededCount.callCount).to.equal(1);
                    expect(viewStub.setSuccededCount.calledWith(0)).to.equal(true);
                });
                it('Check setFailedCount', function () {
                    expect(viewStub.setFailedCount.callCount).to.equal(1);
                    expect(viewStub.setFailedCount.calledWith(1)).to.equal(true);
                });
                it('Check hideStatusSuccededField', function () {
                    expect(viewStub.hideStatusSuccededField.callCount).to.equal(1);
                });
                it('Check hidetatusFaileddField', function () {
                    expect(viewStub.hidetatusFaileddField.callCount).to.equal(1);
                });

                it('Check createResultTable', function () {
                    expect(responsesSummaryList.createResultTable.callCount).to.equal(1);
                    data.push({
                        elementName: deletedRolesStatus[0][0],
                        result: Utils.getErrorMessage(deletedRolesStatus[0][1]).defaultHttpMessage
                    });
                    expect(responsesSummaryList.createResultTable.getCall(0).args[0]).to.deep.equal(data);
                });
                it('Check getTableDiv', function () {
                    expect(viewStub.getTableDiv.callCount).to.equal(1);
                });
            });

            describe('one role delete fail: internal server error', function () {

                beforeEach(function () {
                    deletedRolesStatus.push(['testedRoleName', 500]);
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus,
                        errorCodes: roleMgmtErrorCodes
                    });
                    sandbox.spy(responsesSummaryList, 'createResultTable');
                    responsesSummaryList.view = viewStub;
                    responsesSummaryList.onViewReady(responsesSummaryList.options);
                });

                it('Check setTotalCount', function () {
                    expect(viewStub.setTotalCount.callCount).to.equal(1);
                    expect(viewStub.setTotalCount.calledWith(1)).to.equal(true);
                });
                it('Check setSuccededCount', function () {
                    expect(viewStub.setSuccededCount.callCount).to.equal(1);
                    expect(viewStub.setSuccededCount.calledWith(0)).to.equal(true);
                });
                it('Check setFailedCount', function () {
                    expect(viewStub.setFailedCount.callCount).to.equal(1);
                    expect(viewStub.setFailedCount.calledWith(1)).to.equal(true);
                });
                it('Check hideStatusSuccededField', function () {
                    expect(viewStub.hideStatusSuccededField.callCount).to.equal(1);
                });
                it('Check hidetatusFaileddField', function () {
                    expect(viewStub.hidetatusFaileddField.callCount).to.equal(1);
                });
                it('Check createResultTable', function () {
                    expect(responsesSummaryList.createResultTable.callCount).to.equal(1);
                    data.push({
                        elementName: deletedRolesStatus[0][0],
                        result: Utils.getErrorMessage(deletedRolesStatus[0][1]).defaultHttpMessage
                    });
                    expect(responsesSummaryList.createResultTable.getCall(0).args[0]).to.deep.equal(data);
                });
                it('Check getTableDiv', function () {
                    expect(viewStub.getTableDiv.callCount).to.equal(1);
                });
            });

        });

        describe('createResultTable (using error codes)', function () {

            var callbackRef;

            var data = [];
            data.push({
                elementName: 'testedRoleName204',
                result: "Success"
            });
            data.push({
                elementName: 'testedRoleName400',
                result: Utils.getErrorMessage(400).defaultHttpMessage
            });
            data.push({
                elementName: 'testedRoleName404',
                result: Utils.getErrorMessage(404).defaultHttpMessage
            });
            data.push({
                elementName: 'testedRoleName422',
                result: Utils.getErrorMessage(422).defaultHttpMessage
            });
            data.push({
                elementName: 'testedRoleName499',
                result: Utils.getErrorMessage(499).defaultHttpMessage
            });
            data.push({
                elementName: 'testedRoleName500',
                result: Utils.getErrorMessage(500).defaultHttpMessage

            });

            var dataSortedResultAsc = [];
            //testedRoleName204 Success

             dataSortedResultAsc.push({
                elementName: 'testedRoleName499',
                result: Utils.getErrorMessage(499).defaultHttpMessage
            });

            dataSortedResultAsc.push({
                elementName: 'testedRoleName500',
                result: Utils.getErrorMessage(500).defaultHttpMessage
            });

            dataSortedResultAsc.push({
                elementName: 'testedRoleName204',
                result: "Success"
            });

            dataSortedResultAsc.push({
                elementName: 'testedRoleName404',
                result: Utils.getErrorMessage(404).defaultHttpMessage
            });

            dataSortedResultAsc.push({
                elementName: 'testedRoleName400',
                result: Utils.getErrorMessage(400).defaultHttpMessage
            });

            dataSortedResultAsc.push({
                elementName: 'testedRoleName422',
                result: Utils.getErrorMessage(422).defaultHttpMessage
            });


            beforeEach(function () {
                deletedRolesStatus = [
                    ['testedRoleName204', 204],
                    ['testedRoleName400', 400],
                    ['testedRoleName404', 404],
                    ['testedRoleName422', 422],
                    ['testedRoleName499', 499],
                    ['testedRoleName500', 500]
                ];
                sandbox.spy(ResponsesSummaryList.prototype, 'createResultTable');
                sandbox.spy(Table.prototype, 'addEventHandler');
            });

            it('Check table is initialised with proper data', function () {
                responsesSummaryList = new ResponsesSummaryList({
                    data: deletedRolesStatus
                });
                expect(ResponsesSummaryList.prototype.createResultTable.callCount).to.equal(1);
                expect(responsesSummaryList.createResultTable.calledWith(data)).to.equal(true);
            });

            it('Check sort handler is added to table ', function () {
                responsesSummaryList = new ResponsesSummaryList({
                    data: deletedRolesStatus,
                    errorCodes: roleMgmtErrorCodes
                });
                expect(Table.prototype.addEventHandler.callCount).to.equal(1);
                expect(Table.prototype.addEventHandler.getCall(0).args[0]).to.deep.equal('sort');
            });

            describe('callback() sort by rolename asc', function () {
                //data is overwritten after sort, so new ResponsesSummaryList must be created each time
                beforeEach(function () {
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus
                    });
                    sandbox.spy(Table.prototype, 'setData'); //Spy after initial setData in constructor
                    callbackRef = Table.prototype.addEventHandler.getCall(0).args[1];
                });

                it('Should properly sort provided data', function () {
                    callbackRef.call(responsesSummaryList, 'asc', 'elementName');
                    expect(Table.prototype.setData.callCount).to.equal(1);
                    expect(Table.prototype.setData.getCall(0).args[0]).to.deep.equal(data);
                });
            });

            describe('callback() sort by rolename desc', function () {
                //data is overwritten after sort, so new ResponsesSummaryList must be created each time
                beforeEach(function () {
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus,
                        errorCodes: roleMgmtErrorCodes
                    });
                    sandbox.spy(Table.prototype, 'setData'); //Spy after initial setData in constructor
                    callbackRef = Table.prototype.addEventHandler.getCall(0).args[1];
                });

                it('Should properly sort provided data', function () {
                    callbackRef.call(responsesSummaryList, 'desc', 'elementName');
                    expect(Table.prototype.setData.callCount).to.equal(1);
                    expect(Table.prototype.setData.getCall(0).args[0]).to.deep.equal(data.reverse());
                });
            });

            describe('callback() sort by result asc', function () {
                //data is overwritten after sort, so new ResponsesSummaryList must be created each time
                beforeEach(function () {
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus,
                        errorCodes: roleMgmtErrorCodes
                    });

                    sandbox.spy(Table.prototype, 'setData'); //Spy after initial setData in constructor
                    callbackRef = Table.prototype.addEventHandler.getCall(0).args[1];
                });

                it('Should properly sort provided data', function () {
                    callbackRef.call(responsesSummaryList, 'asc', 'result');
                    expect(Table.prototype.setData.callCount).to.equal(1);
                    expect(Table.prototype.setData.getCall(0).args[0]).to.deep.equal(dataSortedResultAsc);
                });
            });

            describe('callback() sort by result desc', function () {
                //data is overwritten after sort, so new ResponsesSummaryList must be created each time
                beforeEach(function () {
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus,
                        errorCodes: roleMgmtErrorCodes
                    });
                    sandbox.spy(Table.prototype, 'setData'); //Spy after initial setData in constructor
                    callbackRef = Table.prototype.addEventHandler.getCall(0).args[1];
                });

                it('Should properly sort provided data', function () {
                    callbackRef.call(responsesSummaryList, 'desc', 'result');
                    expect(Table.prototype.setData.callCount).to.equal(1);
                    expect(Table.prototype.setData.getCall(0).args[0]).to.deep.equal(dataSortedResultAsc.reverse());
                });
            });

            describe('callback() sort by result desc with duplicated codes', function () {
                //This tests "return 0" in sort handler

                //data is overwritten after sort, so new ResponsesSummaryList must be created each time
                var dataWithDuplicatedCodes = [];
                dataWithDuplicatedCodes.push({
                    elementName: 'testedRoleName400a',
                    result:  Utils.getErrorMessage(400).defaultHttpMessage
                });
                dataWithDuplicatedCodes.push({
                    elementName: 'testedRoleName400b',
                    result: Utils.getErrorMessage(400).defaultHttpMessage
                });

                beforeEach(function () {

                    deletedRolesStatus = [];
                    deletedRolesStatus.push(['testedRoleName400a', 400]);
                    deletedRolesStatus.push(['testedRoleName400b', 400]);
                    responsesSummaryList = new ResponsesSummaryList({
                        data: deletedRolesStatus,
                        errorCodes: roleMgmtErrorCodes
                    });
                    sandbox.spy(Table.prototype, 'setData'); //Spy after initial setData in constructor
                    callbackRef = Table.prototype.addEventHandler.getCall(0).args[1];
                });

                it('Should properly sort provided data', function () {
                    callbackRef.call(responsesSummaryList, 'desc', 'result');
                    expect(Table.prototype.setData.callCount).to.equal(1);
                    expect(Table.prototype.setData.getCall(0).args[0]).to.deep.equal(dataWithDuplicatedCodes);
                });
            });
        });

        describe('createResultTable (using http response object)', function () {
            var actionResponsesArray;

            beforeEach(function () {
                actionResponsesArray = [
                    ['mockAction1', {
                        getResponseJSON: function () {
                            return {};
                        },
                        getStatus: function () {
                            return 200;
                        }
                    }],
                    ['mockAction2', {
                        getResponseJSON: function () {
                            return {};
                        },
                        getStatus: function () {
                            return 404;
                        }
                    }],
                    ['mockAction3', {
                        getResponseJSON: function () {
                            return {internalErrorCode: 1.101};
                        },
                        getStatus: function () {
                            return 500;
                        }
                    }],
                    ['mockAction4', {
                        getResponseJSON: function () {
                            return {};
                        },
                        getStatus: function () {
                            return 1000;
                        }
                    }]
                ];
                sandbox.spy(Table.prototype, 'setData');

                responsesSummaryList = new ResponsesSummaryList({
                    data: actionResponsesArray,
                    errorCodes: roleMgmtErrorCodes,
                    hideStatusCounters: true,
                    displayResponseStatusIcons: true
                });


                it('should map http status code and internal code to message', function () {
                    var tableConstructorArgArray = Table.prototype.setData.getCall(0).args[0];

                    for (var index in tableConstructorArgArray) {
                        var expectedMessage = Utils.getErrorMessageForResponseObject(roleMgmtErrorCodes, actionResponsesArray[index][1]);
                        var actualMessage = tableConstructorArgArray[index].result.message;

                        expect(actualMessage).to.be.equal(expectedMessage);
                    }
                });

                it('should hide status counters', function () {
                    var view = responsesSummaryList.view;

                    expect(view.getStatusTotalField().getStyle("display")).to.be.equal("none");
                    expect(view.getStatusFaileddField().getStyle("display")).to.be.equal("none");
                    expect(view.getStatusSuccededField().getStyle("display")).to.be.equal("none");
                });

            });

        });
    });
});