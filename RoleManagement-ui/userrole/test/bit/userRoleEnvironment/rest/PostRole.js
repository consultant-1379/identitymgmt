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
], function(Rest) {

    var generatePostSuccess = function() {
        //
        var _data = {
            type: "com",
            name: "MockName",
            description: "MockDescription",
            status: "ENABLED"
        };

        return Rest({
            url: /\/oss\/idm\/rolemanagement\/roles?/,
            httpStatus: 201,
            method: 'POST',
            data: _data
        });
    };

    var generatePostFail = function(internalErrorCode) {

        var _data = {
            userMessage: "Role name must be unique.",
            httpStatusCode: "422",
            developer: "mockMessage",
            time: "2016-05-12T11:15:44"
        };

        if (internalErrorCode) {
            _data.internalErrorCode = internalErrorCode;
        }

        return Rest({
            url: /\/oss\/idm\/rolemanagement\/roles?/,
            httpStatus: 422,
            method: 'POST',
            data: _data
        });
    };

        return {
            PostSuccess: generatePostSuccess(),
            PostFail: generatePostFail(),
            PostFailTooManyTaskProfiles: generatePostFail("RIDM-7-5-33")
    };
});

