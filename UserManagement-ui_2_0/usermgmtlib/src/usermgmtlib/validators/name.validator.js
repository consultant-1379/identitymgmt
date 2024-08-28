define([
    'jscore/ext/utils/base/underscore',
    '../Dictionary'
], function(_, Dictionary) {
    return {
        validate: function(name, strictMode) {
            if (_.isEmpty(name) && strictMode) {
                return {
                    message: Dictionary.validator.name.must_be_specified
                };
            }
        }
    };
});