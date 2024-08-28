define([
    'jscore/ext/utils/base/underscore',
    '../Dictionary'
], function(_, Dictionary) {
    return {
        validate: function(surname, strictMode) {
            if (_.isEmpty(surname) && strictMode) {
                return {
                    message: Dictionary.validator.surname.must_be_specified
                };
            }
        }
    };
});