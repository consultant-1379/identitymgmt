/*******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************/
define([
    '../data/PasswordRules',
    '../data/PasswordRulesPlus',
    '../data/PasswordRulesMinus'
], function(PasswordRules, PasswordRulesPlus, PasswordRulesMinus) {

    var generate = function(passwordRules) {
        return {
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/usermanagement/users/validationrules/password',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(passwordRules)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(PasswordRules),
        OnePlus: generate(PasswordRulesPlus),
        OneMinus: generate(PasswordRulesMinus)
    };
});
