define([
    '../data/DefaultUser',
    '../data/GenericUser',
    '../data/GenericUserPasswordAgeingCustom',
    '../data/ResponseForSaveUser'
], function(DefaultUser, GenericUser, GenericUserPasswordAgeingCustom, ResponseForSaveUser) {

    var generate = function(users) {

        return {

            apply: function(server) {

                server.respondWith(
                    'GET',
                    /\/oss\/idm\/usermanagement\/users\/.+/,
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(users)
                        );
                    }.bind(this)
                );
            }
        };
    };

    var generateEdit = function(user, userName) {

        return {
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users/' + userName,
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(user)
                        );
                    }.bind(this)
                );
            }
        };
    };

    var generateResponseForCreateUser = function(responseForSaveUser, status) {

        return {

            apply: function(server) {

                server.respondWith(
                    'POST',
                    /\/oss\/idm\/usermanagement\/users/,
                    function(xhr) {
                        xhr.respond(
                            status, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(responseForSaveUser)
                        );
                    }.bind(this)
                );
            }
        };
    };

    var generateEditFail = function(_httpStatus, _userMessage, _internalCode, _url, _errorData) {
        var _data = {
            userMessage: _userMessage,
            httpStatusCode: _httpStatus,
            developerMessage: "mockDeveloperMessage",
            time: "2016-03-02T11:09:46",
            internalErrorCode: _internalCode,
            errorData: _errorData
        };


        return {
            apply: function(server) {

                server.respondWith(
                    'PUT',
                    _url,
                    function(xhr) {
                        xhr.respond(
                            _httpStatus,
                            {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(_data)
                        );
                    }.bind(this)
                );
            }
        };

    };

    return {
        User: generate(GenericUser('user1', 'local')),
        UserEditPACustom: generateEdit(GenericUserPasswordAgeingCustom('administrator', 'remote'), 'administrator'),
        Default1: generate(DefaultUser),
        Default: generate([DefaultUser, GenericUser('user1', 'local', false)]),
        User: generate(GenericUser('user1', 'local', true)),
        UserEdit: generateEdit(GenericUser('administrator', 'remote', true), 'administrator'),
        UserToSave: generateResponseForCreateUser(ResponseForSaveUser, 201),
        UserToSaveError48TgAll: generateEditFail(422, "Maximum number of users with Task Profile roles and Target Group ALL.", "UIDM-15-2-0",
                                                 "/oss/idm/usermanagement/users/administrator", "[testTarget]"),
        UserToSaveError48UsersForCpp: generateEditFail(422, "Maximum number of users for CPP node.", "UIDM-15-2-1",
                                                 "/oss/idm/usermanagement/users/administrator", "[testTarget]"),
        UserToSaveError10TP: generateEditFail(422, "Max number of Task Profile for User Exceeded.", "UIDM-7-4-51", "/oss/idm/usermanagement/users/administrator", "[testTarget]"),
        UserToDuplicate: generate(GenericUser('userToDuplicate', 'remote', true)),
        UserPasswordResetFlagFalseEdit: generateEdit(GenericUser('user1', 'local', false), 'user1')
    };
});
