define([
    './rest/PasswordValidation',
    './rest/ValidationRules',
    './rest/EditProfile'

], function(PasswordValidation, ValidationRules, EditProfile) {

    return {
        Default: [
            PasswordValidation.Default,
            ValidationRules.Default,
            EditProfile.Default
        ],
        PasswordValidation: PasswordValidation,
        ValidationRules: ValidationRules,
        EditProfile: EditProfile
    };

});