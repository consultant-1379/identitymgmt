define([
    'jscore/ext/utils/base/underscore',
    '../Dictionary'
], function(_, Dictionary) {

    var _validateEmail = function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    return {
        validate: function(email, strictMode) {
            if ( email !== null && !_.isEmpty(email)) {
                if (!_validateEmail(email)) {
                    return {
                        message: Dictionary.validator.email.invalid_email
                    };
                }
            }
        }
    };
});
