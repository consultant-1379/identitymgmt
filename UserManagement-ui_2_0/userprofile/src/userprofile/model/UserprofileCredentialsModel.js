define([
    'identitymgmtlib/mvp/Model',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/validators/password.validator',
    'jscore/ext/utils/base/underscore',
    '../Dictionary'
], function(Model, service, passwordValidator, _, Dictionary) {

    var isPasswordsChanged = function() {
        return (this.lastPassword !== this.get('newPassword') || this.lastConfirmPassword !== this.get('repeatNewPassword'));
    };

    var updateFormLastValues = function() {
        this.lastPassword = this.get('newPassword');
        this.lastConfirmPassword = this.get('repeatNewPassword');
    };

    var validationPasswordPolicy = function(strict, resolve) {

        passwordValidator.validate({
            policiesCollection: this.passwordPoliciesCollection,
            name: this.get('name'),
            surname: this.get('surname'),
            username: this.get('username'),
            password: this.get('newPassword'),
            passwordConfirm: this.get('repeatNewPassword'),
            strictMode: this.isStrictMode(),
            isPasswordsChanged: isPasswordsChanged.call(this)
        }).then(function(validationObject) {
            updateFormLastValues.call(this);
            var result = {};
            if (validationObject) {
                result.newPassword = validationObject;
                result.repeatNewPassword = result.newPassword;
                resolve(result);
            } else {
                resolve({});
            }
        }.bind(this));

    };

    var saveToFile = function(url, name) {
        var anchor = document.createElement('a');
        anchor.setAttribute('href', url);
        anchor.setAttribute('download', name);

        //Create event
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        //Fire event
        anchor.dispatchEvent(ev);
    };

    return Model.extend({
        notSync: ['passwordConfirm'],

        save: function(credentialData, options) {
            if (this.get('credentialsFormat') === 'XML') {
                service.getUserCredentialsXml(credentialData).then(function(credentialFileData) {
                    //Workaround for saving credentials file
                    var url = 'data:application/xml,' + credentialFileData;
                    var name = 'ssuCredentials.xml';
                    saveToFile.call(null, url, name);
                    if (options && options.success) {
                        options.success.apply(arguments);
                    }
                }.bind(this),
                function(response, message) {
                    if (options && options.error) {
                        options.error.apply(arguments);
                    }
                }.bind(this));
            } else {
                service.getUserCredentialsPkcs12(credentialData).then(function(credentialFileBinaryData) {
                    //Workaround for saving credentials binary file
                    var name = 'credentials.p12';
                    var blob = new Blob([credentialFileBinaryData], {type: 'application/octet-stream'});
                    var fileReader = new FileReader();

                    fileReader.onload = function(ev) {
                        saveToFile.call(null, ev.target.result, name);
                        if (options && options.success) {
                            options.success.apply(arguments);
                        }
                    };
                    fileReader.readAsDataURL(blob);
                }.bind(this),
                function(response, message) {
                    if (options && options.error) {
                        options.error.apply(arguments);
                    }
                }.bind(this));
            }
        },

        validate: function(strict, saveButton) {
            return new Promise(function(resolve, reject) {

                var result = {};

                if (_.isEmpty(this.get('PKIEntityPassword'))) {
                    result.PKIEntityPassword = {
                        message: Dictionary.credentialsForm.validator.empty_PKIEntity_password
                    };
                    resolve(result);
                }

                if (!this.get('credentialsFormat') || this.get('credentialsFormat') === 'PKCS12') {
                    if (isPasswordsChanged.call(this) || this.shouldBeValidated('password') || this.shouldBeValidated('passwordConfirm')) {
                        validationPasswordPolicy.call(this, strict, resolve);
                    }
                } else if (this.get('credentialsFormat') === 'XML') {
                    resolve(result);
                }

            }.bind(this));

        }
    });
});
