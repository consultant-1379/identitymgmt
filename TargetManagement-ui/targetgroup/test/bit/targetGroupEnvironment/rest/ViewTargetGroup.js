define([
    '../../lib/Rest'
], function(Rest) {

    var generateGetSuccess = function(_httpStatus) {

        var _data = {
            name: "mockName",
            description: "mockDescription",
            isDefault: "false"
        };

        return Rest({
            url: /\/oss\/idm\/targetgroupmanagement\/targetgroups\/\w+/i,
            httpStatus: _httpStatus,
            method: 'GET',
            data: _data
        });
    };

    var generateGetFail = function(_httpStatus, _userMessage, _internalCode) {
        var _data = {
            userMessage: _userMessage,
            httpStatusCode: _httpStatus,
            developerMessage: "mockDeveloperMessage",
            time: "2016-03-02T11:09:46"
        };

        if (_internalCode !== undefined) {
            _data.internalErrorCode = _internalCode;
        }

        return Rest({

            url: /\/oss\/idm\/targetgroupmanagement\/targetgroups\/\w+/i,
            httpStatus: _httpStatus,
            method: 'GET',
            data: _data
        });
    };

    var internalCodeGetFailGenerator = function(_internalCode) {
        return generateGetFail(422, "UserMessage", _internalCode);
    };

    return {
        LoadTargetGroupSuccess: generateGetSuccess(200),
        LoadTargetGroupFail_unexpected_http_code: generateGetFail(777, "UserMessage"),
        LoadTargetGroupFail_no_internal_code: generateGetFail(422, "UserMessage"),
        LoadTargetGroupFail_internalCodeGenerator: internalCodeGetFailGenerator
    };
});