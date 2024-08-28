define([
    'jscore/core',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'usermgmtlib/model/ResponseParser',
    'identitymgmtlib/widgets/ResponsesSummaryDialog',
    'widgets/Notification'
], function(core, ResponseHandler, ResponseParser, ResponsesSummaryDialog, Notification) {
    'use strict';

    describe('ResponseHandler', function() {
        it('ResponseHandler should be defined', function() {
            expect(ResponseHandler).not.to.be.undefined;
            expect(ResponseHandler).not.to.be.null;
        });
    });

    describe('ResponseHandler', function() {
        var responseHandlerStub, notification, responseParser, responseParserStub, responseHandler, sandbox, setNotificationSuccessStub, setNotificationStub, setNotificationErrorStub;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            var responseHandler = ResponseHandler.getInstance();
            setNotificationSuccessStub = sandbox.spy(responseHandler, 'setNotificationSuccess');
            setNotificationErrorStub = sandbox.spy(responseHandler, 'setNotificationError');
            setNotificationStub = sandbox.spy(responseHandler, 'setNotification');

            responseParser = new ResponseParser('abc');
            responseParserStub = sandbox.spy(responseParser, 'getData');

            notification = new Notification();

        });

        afterEach(function() {
            sandbox.restore();
        });

        it('setNotification functions should be defined', function() {
            expect(setNotificationSuccessStub).not.to.be.undefined;
            expect(setNotificationErrorStub).not.to.be.undefined;
            expect(setNotificationSuccessStub).not.to.be.null;
            expect(setNotificationErrorStub).not.to.be.null;
        });

        it('Should call setNotification() with correct /success/ arguments and no values and dictionary message', function() {
            var response = 'default_success';

            var options = {
                response: response
            };

            ResponseHandler.setNotificationSuccess(options);
            expect(setNotificationSuccessStub.callCount).to.equal(1);
            expect(setNotificationStub.callCount).to.equal(1);
            expect(setNotificationStub.getCall(0).args[0]).to.equal(options);
            expect(setNotificationStub.getCall(0).args[0].response).to.equal(options.response);
            expect(setNotificationStub.getCall(0).args[0].mode).to.equal("success");
        });

        it('Should call setNotification() with correct /error/ arguments and values and random message', function() {
            var response = 'dictionary_id',
                values = ['val1', 'val2'];

            var options = {
                response: response,
                values: values
            };

            ResponseHandler.setNotificationError(options);
            expect(setNotificationErrorStub.callCount).to.equal(1);
            expect(setNotificationStub.callCount).to.equal(1);
            expect(setNotificationStub.getCall(0).args[0]).to.equal(options);
            expect(setNotificationStub.getCall(0).args[0].response).to.equal(options.response);
            expect(setNotificationStub.getCall(0).args[0].mode).to.equal("error");
            expect(setNotificationStub.getCall(0).args[0].values).to.equal(values);

        });

        it('Should call setNotification() directly for single response', function() {
            var response = 'dictionary_id',
                values = ['val1', 'val2'];
            var options = {
                response: response,
                mode: 'success',
                values: values
            };

            ResponseHandler.setNotification(options);
            expect(setNotificationStub.callCount).to.equal(1);
            expect(setNotificationStub.getCall(0).args[0]).to.equal(options);
            expect(setNotificationStub.getCall(0).args[0].response).to.equal(options.response);
            expect(setNotificationStub.getCall(0).args[0].mode).to.equal("success");
            expect(setNotificationStub.getCall(0).args[0].values).to.equal(options.values);

        });

//        it('Should call setNotification() directly for multiple response', function() {
//            var options = {
//                response: [
//                    { rowValue: 'administrator', xhr: 412 },
//                    { rowValue: 'normalUser', xhr: 200 }
//                ],
//                values: ['val1', 'val2']
//            };
//
//            ResponseHandler.setNotification(options);
//            expect(setNotificationStub.callCount).to.equal(1);
//            expect(setNotificationStub.getCall(0).args[0]).to.equal(options);
//            expect(setNotificationStub.getCall(0).args[0].response).to.equal(options.response);
//            expect(setNotificationStub.getCall(0).args[0].mode).to.equal(options.mode);
//        });

        it('Should call setNotification() directly for multiple response XHR', function() {

            var xhrErr = {
                rowValue: 'administrator',
                xhr: {
                    getStatus: function() {
                        return 412;
                    },
                    getResponseHeader: function() {
                        return 'application/json';
                    },
                    getResponseJSON: function() {
                        return { internalErrorCode: "1.45" }
                    }
                }
            };
            var xhrSucc = {
                rowValue: 'normalUser',
                xhr: {
                    getStatus: function() {
                        return 200;
                    },
                    getResponseHeader: function() {
                        return 'text/plain; charset=UTF-8';
                    }
                }
            };

            var options = {
                response: [
                    xhrErr,
                    xhrSucc
                ]
            };

            ResponseHandler.setNotification(options);
            expect(setNotificationStub.callCount).to.equal(1);
            expect(setNotificationStub.getCall(0).args[0]).to.equal(options);
            expect(setNotificationStub.getCall(0).args[0].response).to.equal(options.response);
        });

        it('Should call setNotification() directly for single response XHR with internal error code in dictionary', function() {

            var xhrErr = {
                rowValue: 'administrator',
                xhr: {
                    getStatus: function() {
                        return 412;
                    },
                    getResponseHeader: function() {
                        return 'application/json';
                    },
                    getResponseJSON: function() {
                        return { internalErrorCode: "1.45" }
                    }
                }
            };

            var options = {
                response: [
                    xhrErr
                ]
            };

            ResponseHandler.setNotification(options);
            expect(setNotificationStub.callCount).to.equal(1);
            expect(setNotificationStub.getCall(0).args[0]).to.equal(options);
            expect(setNotificationStub.getCall(0).args[0].response).to.equal(options.response);
        });

        it('Should call setNotification() directly for single response XHR without internal error code in dictionary', function() {

            var xhrErr = {
                rowValue: 'administrator',
                xhr: {
                    getStatus: function() {
                        return 412;
                    },
                    getResponseHeader: function() {
                        return 'application/json';
                    },
                    getResponseJSON: function() {
                        return { internalErrorCode: "2.22" }
                    }
                }
            };

            var options = {
                response: [
                    xhrErr
                ]
            };

            ResponseHandler.setNotification(options);
            expect(setNotificationStub.callCount).to.equal(1);
            expect(setNotificationStub.getCall(0).args[0]).to.equal(options);
            expect(setNotificationStub.getCall(0).args[0].response).to.equal(options.response);
        });

        it('Should call setNotification() directly for single response XHR without internal and status error code in dictionary', function() {

            var xhrErr = {
                rowValue: 'administrator',
                xhr: {
                    getStatus: function() {
                        return 488;
                    },
                    getResponseHeader: function() {
                        return 'application/json';
                    },
                    getResponseJSON: function() {
                        return { internalErrorCode: "2.22" }
                    }
                }
            };

            var options = {
                response: [
                    xhrErr
                ]
            };

            ResponseHandler.setNotification(options);
            expect(setNotificationStub.callCount).to.equal(1);
            expect(setNotificationStub.getCall(0).args[0]).to.equal(options);
            expect(setNotificationStub.getCall(0).args[0].response).to.equal(options.response);
        });

        it('Should call setNotification() directly for XHR without internal and status error code in dictionary', function() {

            var options = {
                response: {
                    rowValue: 'administrator',
                    xhr: {
                        getStatus: function() {
                            return 412;
                        },
                        getResponseHeader: function() {
                            return 'application/json';
                        },
                        getResponseJSON: function() {
                            return { internalErrorCode: "1.45" }
                        }
                    }
                }
            };

            ResponseHandler.setNotification(options);
            expect(setNotificationStub.callCount).to.equal(1);
            expect(setNotificationStub.getCall(0).args[0]).to.equal(options);
            expect(setNotificationStub.getCall(0).args[0].response).to.equal(options.response);
        });
    });
});
