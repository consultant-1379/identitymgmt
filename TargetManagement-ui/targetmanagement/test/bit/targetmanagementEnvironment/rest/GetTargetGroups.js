define([
    '../../lib/Rest',
    '../data/DefaultGetTargetGroups'
], function(Rest, DefaultGetTargetGroups) {

    var generate = function(_data) {
        return Rest({
            url: '/oss/idm/targetgroupmanagement/targetgroups',
            httpStatus: 200,
            method: 'GET',
            data: _data
        });
    };

    var generateGetListFail = function() {
        var _data = {
            userMessage: "mockUserMessage",
            httpStatusCode: 403,
            developerMessage: "mockDeveloperMessage",
            time: "2016-03-02T11:09:46",
            internalErrorCode: "TGIDM-3-query"
        };

        return Rest({
            url: '/oss/idm/targetgroupmanagement/targetgroups',
            httpStatus: 403,
            method: 'GET',
            data: _data
        });
    };

    var generateDeleteTargetGroupSuccess = function() {
        var _data = {
            userMessage: "mockUserMessage",
            httpStatusCode: 200,
            developerMessage: "mockDeveloperMessage",
            time: "2016-03-02T11:09:46"
        };

        return Rest({
            url: /\/oss\/idm\/targetgroupmanagement\/targetgroups\/\w+/i,
            httpStatus: 200,
            method: 'DELETE',
            data: _data
        });
    };

    var generateDeleteFail = function(_httpStatus, _userMessage, _internalCode) {
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
            method: 'DELETE',
            data: _data
        });
    };

    var generateDeleteFailMultiple = function(_httpStatus, _userMessage, _internalCode, _mockName) {
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
            url: '/oss/idm/targetgroupmanagement/targetgroups/'+_mockName,
            httpStatus: _httpStatus,
            method: 'DELETE',
            data: _data
        });
    };


    var internalCodeGetFailGenerator = function(_internalCode) {
        return generateDeleteFail(404, "UserMessage", _internalCode);
    };

    var internalCodeGetFailMultipleGenerator = function(_internalCode, _mockName) {
        return generateDeleteFailMultiple(404, "UserMessage", _internalCode, _mockName);
    };

    return {
        Default: generate(DefaultGetTargetGroups),
        generateGetListFail: generateGetListFail(),
        generateDeleteTargetGroupSuccess: generateDeleteTargetGroupSuccess(),
        DeleteTargetGroupFail_unexpected_http_code: generateDeleteFail(777, "UserMessage"),
        DeleteTargetGroupFail_no_internal_code: generateDeleteFail(422, "UserMessage"),
        DeleteTargetGroupFail_internalCodeGenerator: internalCodeGetFailGenerator,
        DeleteTargetGroupMultipleFail_internalCodeGenerator: internalCodeGetFailMultipleGenerator
    };
});