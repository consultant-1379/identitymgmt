/*global define, describe, it, expect, beforeEach, afterEach, sinon */
define([
    'identitymgmtlib/widgets/ResponsesSummaryDialog',
    'identitymgmtlib/ResponsesSummaryList',
    'identitymgmtlib/Utils',
    'i18n!identitymgmtlib/common.json',
    'widgets/Dialog'
], function(ResponsesSummaryDialog, ResponsesSummaryList, Utils, identitymgmtlibDictionary, Dialog) {
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
            'default': 'Not found'
        },
        '422': {
            'default': 'Role assigned to user'
        },
        '500': {
            'default': 'Internal server error',
            'internalCodes': {
                '1.101' : 'Some internal code'
            }
        },
        'unexpected': 'Code {0} - Unexpected reason'
    };

    describe('ResponsesSummaryDialog()', function() {

        var sandbox, deletedRolesStatus, responsesSummaryDialog, dialogInitOptions;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            sandbox.stub(Dialog.prototype, 'show'); //Prevent attaching dialog during unit tests in UI mode
            sandbox.stub(ResponsesSummaryDialog.prototype, 'hide');
            sandbox.stub(ResponsesSummaryList.prototype, 'init');

            deletedRolesStatus = [];

        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('init()', function() {

            //THIS CASE IS SUPERFLOUS SINCE, WE ASSUME THIS DIALOGUE WILL BE USED FOR ERRORS
            describe('one response with success', function() {

                var buttons, buttonHandlerRef;

                beforeEach(function() {

                    deletedRolesStatus.push(['mockRoleName1', 204]);

                    dialogInitOptions = {
                        data: deletedRolesStatus,
                        successCounter: 1,
                        header: 'mockHeader'
                    };
                    responsesSummaryDialog = new ResponsesSummaryDialog(dialogInitOptions);
                });

                it('Should set options.visible', function() {
                    expect(responsesSummaryDialog.options.visible).to.equal(true);
                });

                it('Should set options.buttons', function() {
                    expect(responsesSummaryDialog.options.buttons[0].caption).to.equal(identitymgmtlibDictionary.ok);
                    buttonHandlerRef = responsesSummaryDialog.options.buttons[0].action;
                    buttonHandlerRef();
                    expect(ResponsesSummaryDialog.prototype.hide.callCount).to.equal(1);
                });

                it('Should set options.header', function() {
                    expect(responsesSummaryDialog.options.header).to.equal('mockHeader');
                });

                it('Should set options.content', function() {
                    expect(ResponsesSummaryList.prototype.init.callCount).to.equal(1);
                    expect(ResponsesSummaryList.prototype.init.getCall(0).args[0]).to.deep.equal(dialogInitOptions);
                    expect(responsesSummaryDialog.options.content instanceof ResponsesSummaryList).to.equal(true);
                });

                it('Should set options.type', function() {
                    expect(responsesSummaryDialog.options.type).to.equal(undefined);
                });

            });

            describe('status code based responses', function() {
                describe('one response with fail', function() {

                    var buttons, buttonHandlerRef;

                    beforeEach(function() {

                        deletedRolesStatus.push(['mockRoleName1', 404]);

                        dialogInitOptions = {
                            data: deletedRolesStatus,
                            successCounter: 0,
                            header: 'mockHeader'
                        };
                        responsesSummaryDialog = new ResponsesSummaryDialog(dialogInitOptions);
                    });

                    it('Should set options.type', function() {
                        expect(responsesSummaryDialog.options.type).to.equal('error');
                    });

                    it('Should set options.content', function() {
                        expect(ResponsesSummaryList.prototype.init.callCount).to.equal(0);
                        expect(typeof responsesSummaryDialog.options.content).to.equal('string');
                        Utils.getErrorMessage(deletedRolesStatus[0][1]).defaultHttpMessage;
                        expect(responsesSummaryDialog.options.content).to.equal(Utils.getErrorMessage(deletedRolesStatus[0][1]).defaultHttpMessage);
                    });
                });

                describe('multiple responses, one success', function() {
                    beforeEach(function() {

                        deletedRolesStatus.push(['mockRoleName1', 204]);
                        deletedRolesStatus.push(['mockRoleName2', 400]);
                        deletedRolesStatus.push(['mockRoleName3', 404]);
                        deletedRolesStatus.push(['mockRoleName4', 422]);
                        deletedRolesStatus.push(['mockRoleName5', 499]);//Unexpected
                        deletedRolesStatus.push(['mockRoleName6', 500]);

                        dialogInitOptions = {
                            data: deletedRolesStatus,
                            successCounter: 1,
                            header: 'mockHeader'
                        };
                        responsesSummaryDialog = new ResponsesSummaryDialog(dialogInitOptions);
                    });

                    it('Should set options.type', function() {
                        expect(responsesSummaryDialog.options.type).to.equal(undefined);
                    });

                    it('Should set options.content', function() {
                        expect(ResponsesSummaryList.prototype.init.callCount).to.equal(1);
                        expect(ResponsesSummaryList.prototype.init.getCall(0).args[0]).to.deep.equal(dialogInitOptions);
                        expect(responsesSummaryDialog.options.content instanceof ResponsesSummaryList).to.equal(true);
                    });
                });

                describe('multiple responses, all fail', function() {
                    beforeEach(function() {

                        deletedRolesStatus.push(['mockRoleName2', 400]);
                        deletedRolesStatus.push(['mockRoleName3', 404]);
                        deletedRolesStatus.push(['mockRoleName4', 422]);
                        deletedRolesStatus.push(['mockRoleName5', 499]);//Unexpected
                        deletedRolesStatus.push(['mockRoleName6', 500]);

                        dialogInitOptions = {
                            data: deletedRolesStatus,
                            successCounter: 0,
                            header: 'mockHeader'
                        };
                        responsesSummaryDialog = new ResponsesSummaryDialog(dialogInitOptions);
                    });

                    it('Should set options.type', function() {
                        expect(responsesSummaryDialog.options.type).to.equal('error');
                    });

                    it('Should set options.content', function() {
                        expect(ResponsesSummaryList.prototype.init.callCount).to.equal(1);
                        expect(ResponsesSummaryList.prototype.init.getCall(0).args[0]).to.deep.equal(dialogInitOptions);
                        expect(responsesSummaryDialog.options.content instanceof ResponsesSummaryList).to.equal(true);
                    });
                });
            })
        });
    });
});
