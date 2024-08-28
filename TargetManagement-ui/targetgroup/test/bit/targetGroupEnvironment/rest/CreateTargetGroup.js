define([
    '../../lib/Rest'
], function(Rest) {

    var generateSuccess = function(_httpStatus) {

        var _data = {
            name: "mockName",
            description: "mockDescription",
            isDefault: "false"
        };

        return Rest({
            url: '/oss/idm/targetgroupmanagement/targetgroups',
            httpStatus: _httpStatus,
            method: 'POST',
            data: _data
        });
    };

    var generateFail = function(_httpStatus, _userMessage, _internalCode) {
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
            url: '/oss/idm/targetgroupmanagement/targetgroups',
            httpStatus: _httpStatus,
            method: 'POST',
            data: _data
        });
    };

    var internalCodeFailGenerator = function(_internalCode) {
        return generateFail(422, "UserMessage", _internalCode);
    };

    return {
        CreateTargetGroupSuccess: generateSuccess(201),
        CreateTargetGroupFail_unexpected_http_code: generateFail(777, "UserMessage"),
        CreateTargetGroupFail_no_internal_code: generateFail(422, "UserMessage"),
        CreateTargetGroupFail_internalCodeGenerator: internalCodeFailGenerator
    };
});