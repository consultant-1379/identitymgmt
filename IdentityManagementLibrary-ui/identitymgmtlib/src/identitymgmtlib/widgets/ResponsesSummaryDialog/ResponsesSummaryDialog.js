define([
    'jscore/core',
    'widgets/Dialog',
    'i18n!identitymgmtlib/common.json',
    'identitymgmtlib/ResponsesSummaryList',
    'identitymgmtlib/Utils'
], function(core, Dialog, CommonDictionary, ResponsesSummaryList, Utils) {

    return Dialog.extend({

        init: function(options) {
            this.options.visible = true;
            this.options.buttons = [{
                caption: CommonDictionary.ok,
                action: options.action || function() {
                    this.hide();
                }.bind(this)
            }];
            this.options.header = options.header;
            if (_isOneResponseWithError(options)) {
                this.errorMessageForSingleError(options);
            } else {
                this.errorMessageForMultipleErrors(options);
            }
        },

        errorMessageForSingleError: function(options) {
            this.options.type = 'error';
            var errorData=options.data[0][3];
            var errorMessage = Utils.getErrorMessage(options.data[0][1], options.data[0][2]);
            errorMessage.internalErrorCodeMessage = Utils.printf(errorMessage.internalErrorCodeMessage,options.data[0][0], errorData);
            this.options.content = errorMessage.internalErrorCodeMessage || errorMessage.defaultHttpMessage;
        },

        errorMessageForMultipleErrors: function(options) {
            var content = new ResponsesSummaryList(options);
            if (options.successCounter === 0) {
                this.options.type = 'error';
            }
            this.options.content = content;
        }
    });

    function _isOneResponseWithError(options) {
        return options.successCounter === 0 && options.data.length === 1;
    }
});
