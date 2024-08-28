define([
    '../data/ChangePassword',
    '../../../lib/Rest'
], function(ChangePassword, Rest) {

    var generate = function(changepassword) {

        return {
            apply: function(server) {

                server.respondWith(
                    'PUT',
                    '/oss/idm/usermanagement/changepassword',
                    function(xhr) {
                        xhr.respond(
                            204, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(changepassword)
                        );
                    }.bind(this)
                );
            }
        };
    };
    var generateFail = function(_httpStatus, _userMessage, _internalCode, _url) {
        var _data = {
            userMessage: _userMessage,
            httpStatusCode: _httpStatus,
            developerMessage: "mockDeveloperMessage",
            time: "2016-03-02T11:09:46",
            internalErrorCode: _internalCode
        };


        return Rest({
            url: _url,
            httpStatus: _httpStatus,
            method: 'PUT',
            data: _data
        });
    };


    return {
        Default: generate(ChangePassword),
        ChangePasswordFailure_UIDM_4_4: generateFail(404, "UserMessage", "UIDM-4-4","/oss/idm/usermanagement/changepassword"),
        ChangePasswordFailure_UIDM_3_update: generateFail(403, "UserMessage", "UIDM-3-update","/oss/idm/usermanagement/changepassword")
    };
});