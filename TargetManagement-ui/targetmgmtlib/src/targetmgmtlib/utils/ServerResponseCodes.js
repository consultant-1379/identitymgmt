define([
    'i18n!identitymgmtlib/error-codes.json',
    'identitymgmtlib/Utils'
], function(Dictionary, Utils) {
    return {

        getMessageForInternalCode: function(_internalCode) {
            return Dictionary.internalErrorCodes[_internalCode];
        },

        getMessageForHttpCode: function(_httpCode) {
            if (_httpCode) {
                _httpCode = _httpCode.toString(); // Allow number or string format
            }
            return Dictionary.defaultHttpMessages[_httpCode];
        },

        getMessage: function(_httpCode, _internalCode) {
            var _internalCodeMessage = this.getMessageForInternalCode(_internalCode);
            if (_internalCodeMessage ) {
                return _internalCodeMessage;
            } else {
                var _httpCodeMessage = this.getMessageForHttpCode(_httpCode);
                if (_httpCodeMessage) {
                    return _httpCodeMessage;
                } else {
                    return Utils.printf(Dictionary.defaultHttpMessages.unexpected, _httpCode);
                }
            }
        }
    };
});