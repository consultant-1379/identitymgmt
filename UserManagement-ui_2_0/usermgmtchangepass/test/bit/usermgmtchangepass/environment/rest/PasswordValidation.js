define([
    '../data/PasswordValidated',
    '../data/PasswordToShort',
    '../data/PasswordToLong',
    '../data/PasswordNoMinimumLowercaseLetters',
    '../data/PasswordNoMinimumUppercaseLetters',
    '../data/PasswordNoMinimumDigits',
    '../data/PasswordOnlyDigits',
    '../data/PasswordOnlySpecialCharacters',
     '../data/PasswordUnsupportedSpecialChars'
], function(PasswordValidated, PasswordToShort, PasswordToLong, PasswordNoMinimumLowercaseLetters, PasswordNoMinimumUppercaseLetters, PasswordNoMinimumDigits, PasswordOnlyDigits, PasswordOnlySpecialCharacters,PasswordUnsupportedSpecialChars) {

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
        PasswordToShort: generate(PasswordToShort),
        PasswordToLong: generate(PasswordToLong),
        PasswordNoMinimumLowercaseLetters: generate(PasswordNoMinimumLowercaseLetters),
        PasswordNoMinimumUppercaseLetters: generate(PasswordNoMinimumUppercaseLetters),
        PasswordNoMinimumDigits: generate(PasswordNoMinimumDigits),
        PasswordOnlyDigits: generate(PasswordOnlyDigits),
        PasswordOnlySpecialCharacters: generate(PasswordOnlySpecialCharacters),
        PasswordUnsupportedSpecialChars:generate(PasswordUnsupportedSpecialChars)
    };
});