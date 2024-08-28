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
            url: "/oss/idm/rolemanagement/roles/ENodeB_Application_User",
            httpStatus: _httpStatus,
            method: 'DELETE',
            data: _data
        });
    };

    var generateFail = function(_httpStatus, _userMessage, _internalCode, _url, _errorData) {
        var _data = {
            userMessage: _userMessage,
            httpStatusCode: _httpStatus,
            developerMessage: "mockDeveloperMessage",
            time: "2016-03-02T11:09:46",
            internalErrorCode: _internalCode,
            errorData: _errorData
        };


        return Rest({
            url: _url,
            httpStatus: _httpStatus,
            method: 'DELETE',
            data: _data
        });
    };

    return {
        DeleteRoleSuccess: generateSuccess(201),
        DeleteRoleFailed_RIDM_14_5_7: generateFail(400, "UserMessage", "RIDM-14-5-7", "/oss/idm/rolemanagement/roles/Support_Application_Administrator", "[testRole]"),
        DeleteRoleFailed_RIDM_14_5_9: generateFail(400, "UserMessage", "RIDM-14-5-9", "/oss/idm/rolemanagement/roles/Support_Application_User", "[testUser]")
    };
});