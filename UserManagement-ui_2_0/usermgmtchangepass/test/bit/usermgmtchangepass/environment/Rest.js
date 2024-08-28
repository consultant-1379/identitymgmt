define([
    './rest/PasswordValidation',
    './rest/ValidationRules',
    './rest/User',
    './rest/Authorize',
    './rest/ChangePassword',
    './rest/EnforcedUserHardening'
], function(PasswordValidation, ValidationRules, User, Authorize, ChangePassword, EnforcedUserHardening) {

    return {
        Default: [
            PasswordValidation.Default,
            ValidationRules.Default,
            User.Default,
            Authorize.Default
        ],
        NotAuthorize: [
            PasswordValidation.Default,
            ValidationRules.Default,
            User.Default,
            Authorize.Failure
        ],
        PasswordValidation: PasswordValidation,
        ValidationRules: ValidationRules,
        ChangePassword: ChangePassword,
        EnforcedUserHardening: EnforcedUserHardening

    };

});