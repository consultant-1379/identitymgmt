/*------------------------------------------------------------------------------
 *******************************************************************************
  * COPYRIGHT Ericsson 2016
  *
  * The copyright to the computer program(s) herein is the property of
  * Ericsson Inc. The programs may be used and/or copied only with written
  * permission from Ericsson Inc. or in accordance with the terms and
  * conditions stipulated in the agreement/contract under which the
  * program(s) have been supplied.
  *******************************************************************************
 -----------------------------------------------------------------------------*/

define([
    '../../lib/Rest'
], function (Rest) {

    var generateGetComRole = function () {

        var _data = {
            type: "com",
            name: "SystemAdministrator",
            description: "Provides full control over Managed Element model fragments related to System Functions, Equipment and Transport, excluding the fragment related to Security Management",
            status: "ENABLED"
        };

        return Rest({
            url: /\/oss\/idm\/rolemanagement\/roles\/SystemAdministrator/,
            httpStatus: 200,
            method: 'GET',
            data: _data
        });
    };

    var generatePutComRole = function () {

        return Rest({
            url: /\/oss\/idm\/rolemanagement\/roles\/SystemAdministrator/,
            httpStatus: 200,
            method: 'PUT',
            data: {}
        });
    };

    var generateGetComRoleAlias = function () {

        var _data = {
            type: "comalias",
            name: "comalias_enabled_1",
            description: "mock description",
            status: "ENABLED",
            roles: [{
                type: "com",
                name: "SystemSecurityAdministrator",
                description: "Provides full control over the fragment of a Managed Element model related to Security Management",
                status: "ENABLED"
            }]
        };

        return Rest({
            url: /\/oss\/idm\/rolemanagement\/roles\/comalias_enabled_1/,
            httpStatus: 200,
            method: 'GET',
            data: _data
        });
    };

    var generatePutComRoleAlias = function () {

        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/comalias_enabled_1/,
            httpStatus: 200,
            method: 'PUT',
            data: {}
        });
    };

    var generateGetCustomRole = function () {

        var _data = {
            type: "custom",
            name: "custom_enabled_1",
            description: "mock description",
            status: "ENABLED",
            roles: [{
                type: "com",
                name: "SystemSecurityAdministrator",
                description: "Provides full control over the fragment of a Managed Element model related to Security Management",
                status: "ENABLED"
            }],
            policy: {"nhm": ["execute"]}
        };

        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/custom_enabled_1/,
            httpStatus: 200,
            method: 'GET',
            data: _data
        });
    };

    var generatePutCustomRole = function () {

        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/custom_enabled_1/,
            httpStatus: 200,
            method: 'PUT',
            data: {}
        });
    };

    var generatePutCustomRoleFail = function () {

        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/custom_enabled_1/,
            httpStatus: 422,
            method: 'PUT',
            data: {
                userMessage: "Role name must be unique.",
                httpStatusCode: "422",
                time: "2016-05-12T11:15:44"
            }
        });
    };

    var generatePutComRoleFail = function () {

        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/SystemAdministrator/,
            httpStatus: 422,
            method: 'PUT',
            data: {
                userMessage: "Role name must be unique.",
                httpStatusCode: "422",
                time: "2016-05-12T11:15:44"
            }
        });
    };

    var generatePutComRoleAliasFail = function () {

        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/comalias_enabled_1/,
            httpStatus: 422,
            method: 'PUT',
            data: {
                userMessage: "Role name must be unique.",
                httpStatusCode: "422",
                time: "2016-05-12T11:15:44"
            }
        });
    };

    return {
        GetComRoleAlias: generateGetComRoleAlias(),
        GetCustomRole: generateGetCustomRole(),
        GetComRole: generateGetComRole(),
        PutComRole: generatePutComRole(),
        PutComRoleAlias: generatePutComRoleAlias(),
        PutCustomRole: generatePutCustomRole(),
        PutCustomRoleFail: generatePutCustomRoleFail(),
        PutComRoleFail: generatePutComRoleFail(),
        PutComRoleAliasFail: generatePutComRoleAliasFail()
    };


});
