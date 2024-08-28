define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'identitymgmtlib/mvp/Model'
], function(core, _, Model) {

    //NOTE: mandatory for objects in model are /response/ and /type/

    var DataModel = function(response, dialog) {
        this.data = [];
        this.init(response, dialog);
    };

    DataModel.prototype.init = function(response, dialog) {
        this.setData(response, dialog);
        // return Model.prototype.init.apply(this, arguments);
    };

    DataModel.prototype.getData = function() {
        return this.data;
    };
    DataModel.prototype.setData = function(response, dialog) {
        if (typeof response === 'string') {
            this.data.push({
                response: response,
                mode: 'error'
            });
        } else if (response.length === undefined && !dialog) {
            if (!response.singleNotification) {
                response.singleNotification = {};
            }
            this.data.push({
                response: response.singleNotification.messageId || response.xhr || response,
                mode: response.singleNotification.mode || 'error'
            });
        } else if (response.length === 1 && !dialog) {
            if (!response[0].singleNotification) {
                response[0].singleNotification = {};
            }
            this.data.push({
                response: response[0].singleNotification.messageId || response[0].xhr || response[0],
                mode: response[0].singleNotification.mode || 'error'
            });
        } else if (response.length > 1 || dialog === true) {
            if (!response.length) {
                var responseJSON;
                try {
                    responseJSON = response.xhr.getResponseJSON();
                } catch (error) {
                    responseJSON = { httpStatusCode: resp.xhr.getStatus() };
                }

                this.data.push([
                    response.rowValue || 'NONE',
                    responseJSON.httpStatusCode,
                    responseJSON.internalErrorCode
                ]);
            } else {
                response.forEach(function(resp) {
                    var responseJSON;
                    try {
                        responseJSON = resp.xhr.getResponseJSON();
                    } catch (error) {
                        responseJSON = { httpStatusCode: resp.xhr.getStatus() };
                    }

                    this.data.push([
                        resp.rowValue || 'NONE',
                        responseJSON.httpStatusCode,
                        responseJSON.internalErrorCode
                    ]);
                }.bind(this));
            }

        } else {
            this.data.push({
                response: response,
                mode: 'error'
            });
        }
    };
    return DataModel;
});
