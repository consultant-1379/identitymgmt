define([
    'jscore/ext/utils/base/underscore',
    '../Dictionary',
    'usermgmtlib/model/PasswordPoliciesCollection',
], function(_, Dictionary, PasswordPoliciesCollection) {

    return {
        validate: function(data) {

            if (data.policiesCollection) {
                var validationResult = data.policiesCollection.validate({
                    password: data.password,
                    passwordConfirm: data.passwordConfirm || '',
                    username: data.username || '',
                    name: data.name || '',
                    surname: data.surname || '',
                    strictMode: data.strictMode,
                    saveButton: data.saveButton,
                    isPasswordsChanged: data.isPasswordsChanged,
                    isNameSurnameUsernameChanged: data.isNameSurnameUsernameChanged
                });
                return validationResult ? validationResult : new Promise(function(resolve, reject) { resolve(); });
            } else {
                return new Promise(function(resolve, reject) {
                    resolve({
                        message: 'Cannot validate password policies'
                    });
                });
            }
        }
    };
});
