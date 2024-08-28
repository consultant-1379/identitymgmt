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
    '../data/PasswordValidated',
    '../data/NewPoliciesPlusResult',
    '../data/NewPoliciesMinusResult',
    '../data/PasswordToShort',
    '../data/PasswordToLong',
    '../data/PasswordNoMinimumLowercaseLetters',
    '../data/PasswordNoMinimumUppercaseLetters',
    '../data/PasswordNoMinimumDigits',
    '../data/PasswordOnlyDigits',
    '../data/PasswordOnlySpecialCharacters'
], function(PasswordValidated, NewPoliciesPlusResult, NewPoliciesMinusResult, PasswordToShort, PasswordToLong, PasswordNoMinimumLowercaseLetters, PasswordNoMinimumUppercaseLetters, PasswordNoMinimumDigits, PasswordOnlyDigits, PasswordOnlySpecialCharacters) {

    var generate = function(passwordPolicy) {

        return {

            apply: function(server) {
                server.respondWith(
                    'POST',
                    '/oss/idm/usermanagement/users/validate/password',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(passwordPolicy)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(PasswordValidated),
        NewPoliciesPlusResult: generate(NewPoliciesPlusResult),
        NewPoliciesMinusResult: generate(NewPoliciesMinusResult),
        PasswordToShort: generate(PasswordToShort),
        PasswordToLong: generate(PasswordToLong),
        PasswordNoMinimumLowercaseLetters: generate(PasswordNoMinimumLowercaseLetters),
        PasswordNoMinimumUppercaseLetters: generate(PasswordNoMinimumUppercaseLetters),
        PasswordNoMinimumDigits: generate(PasswordNoMinimumDigits),
        PasswordOnlyDigits: generate(PasswordOnlyDigits),
        PasswordOnlySpecialCharacters: generate(PasswordOnlySpecialCharacters)
    };
});
