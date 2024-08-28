/*******************************************************************************
  * COPYRIGHT Ericsson 2016
  *
  * The copyright to the computer program(s) herein is the property of
  * Ericsson Inc. The programs may be used and/or copied only with written
  * permission from Ericsson Inc. or in accordance with the terms and
  * conditions stipulated in the agreement/contract under which the
  * program(s) have been supplied.
*******************************************************************************/

define(function() {
    'use strict';

    return [
            {
                "username":"asdasdfghjkj",
                "password":"********",
                "status":"enabled",
                "name":"asd",
                "surname":"asd",
                "email":"asd@com.com",
                "previousLogin":null,
                "lastLogin":null,
                'failedLogins': 0,
                "passwordResetFlag":false,
                "passwordAgeing" : {
                    "customizedPasswordAgeingEnable": true,
                    "passwordAgeingEnable": true,
                    "pwdMaxAge": 60,
                    "pwdExpireWarning": 5
                },
                "privileges":[{
                                "role":"Amos_Operator",
                                "targetGroup":"ALL"
                              }]
            }
    ];
});
