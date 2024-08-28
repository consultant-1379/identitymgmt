define([
    'jscore/ext/utils/base/underscore',
    'identitymgmtlib/Utils',
    '../Dictionary'

], function(_, Utils, Dictionary) {

    var _validateForbiddenChars = function(username) {

        var allowedSpecialChars = ".-_";
        var forbiddenCharactersFoundInUsername = [];

        for (var i = 0; i < username.length; i++) {

            if (!(username[i].charCodeAt(0) <= 122 && username[i].charCodeAt(0) >= 97) && !(username[i].charCodeAt(0) <= 90 && username[i].charCodeAt(0) >= 65) && !(username[i].charCodeAt(0) <= 57 && username[i].charCodeAt(0) >= 48) && (_.indexOf(allowedSpecialChars, username[i]) === -1)) {
                forbiddenCharactersFoundInUsername.push(" '" + (username[i] === " " ? "space" : username[i]) + "'");
            }
        }
        return _.unique(forbiddenCharactersFoundInUsername);
    };

    return {
        validate: function(username, strictMode) {

            var forbiddenCharactersFoundInUsername;

            if (_.isEmpty(username) && strictMode) {
                return {
                    message: Dictionary.validator.username.must_be_specified
                };
            } else if (username.length > 32) {
                return {
                    message: Dictionary.validator.username.to_long
                };
            } else if ((forbiddenCharactersFoundInUsername = _validateForbiddenChars(username)).length > 0) {
                return {
                    message: Dictionary.validator.username.use_only_characters
                };
            } else if (username === '..' || username === '.') {
                return {
                    message: Utils.printf(Dictionary.validator.username.cannot_be, username)
                };
            }

        }

    };
});


