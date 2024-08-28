define([
    'identitymgmtlib/mvp/Model',
    'jscore/ext/net',
    'jscore/ext/utils/base/underscore',
    'usermgmtlib/validators/username.validator',
    'usermgmtlib/validators/password.validator',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    '../Dictionary',
    'identitymgmtlib/Utils'
], function(Model, net, _, usernameValidator, passwordValidator, service, responseHandler, Dictionary, Utils) {


    var isPasswordsChanged = function() {
        return (this.lastPassword !== this.get('password') || this.lastConfirmPassword !== this.get('passwordConfirm'));
    };

    var updateFormLastValues = function() {
        this.lastPassword = this.get('password');
        this.lastConfirmPassword = this.get('passwordConfirm');
    };

    var validationPasswordPolicy = function(strict, resolve, overwriteResult) {

        passwordValidator.validate({
            policiesCollection: this.passwordPoliciesCollection,
            password: this.get('password'),
            passwordConfirm: this.get('passwordConfirm'),
            strictMode: this.isStrictMode(),
            // saveButton: saveButton,
            username: this.get('username'),
            name: this.get('name'),
            surname: this.get('surname'),
            isPasswordsChanged: isPasswordsChanged.call(this)
        }).then(function(validationObject) {
            updateFormLastValues.call(this);
            var result = {};
            if (overwriteResult) {
                result = overwriteResult;
            } else {
                result.password = validationObject;
                result.passwordConfirm = result.password;
            }
            resolve(result);
        }.bind(this));

    };

    return Model.extend({

        //uncomment it after change REST interface (add username at the end url)
        //idAttribute: 'username',

        //url: "/oss/idm/usermanagement/changepassword",

        notSync: ['passwordConfirm', 'username'],

        validate: function(strict, saveButton) {
            return new Promise(function(resolve, reject) {

                var result = {};

                if (!this.get('oldPassword') && this.get('password')) {

                    result.oldPassword = {
                        message: Dictionary.validator.empty_old_password
                    };
                    resolve(result);

                } else if (strict === true && (this.get('oldPassword') === this.get('password'))) { //after click 'Save' and nen.old passwords are the same

                    result.oldPassword = {
                        message: Dictionary.validator.not_different_old_new_passwords
                    };
                    validationPasswordPolicy.call(this, strict, resolve, result);

                } else if (isPasswordsChanged.call(this) || this.shouldBeValidated('oldPassword') ||
                           this.shouldBeValidated('password') || this.shouldBeValidated('passwordConfirm') ) {

                    validationPasswordPolicy.call(this, strict, resolve, null);
                }

            }.bind(this));

        },

        //uncomment it after change REST interface (add username at the end url)
        /*init: function() {
             var model = Model.prototype.init.apply(this, arguments);
             this.setSaveMode("update");
        }*/

        //remove it after change REST interface (add username at the end url)
        save: function(options) {

            this.isValid(false, true).then(function(valid) {

                if (valid === true) {

                    net.ajax({
                        url: '/oss/idm/usermanagement/users/' + this.getAttribute('username') + '/password',
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(this.toJSON()),
                        success: function(data, xhr) {
                            if (options.success) {
                                options.success(data, xhr);
                            }
                        },
                        error: function(msg, xhr) {
                            //old password are not correct
                            if (xhr.getStatus() === 422) {
                                if (xhr.getResponseJSON().internalErrorCode === 'UIDM-7-4-18'||
                                    xhr.getResponseJSON().internalErrorCode === 'UIDM-7-4-53') {
                                    this.trigger('invalid:oldPassword', {
                                        message: Dictionary.validator.incorrect_old_password
                                    });
                                    return;
                                } else if (xhr.getResponseJSON().internalErrorCode === 'UIDM-7-4-4' &&
                                           xhr.getResponseJSON().userMessage.indexOf("mustNotBeOldPassword") !== -1) {
                                    var value = xhr.getResponseJSON().userMessage.match(/\d+/)[0];
                                    this.trigger('invalid:password', {
                                        message: Utils.printf(Dictionary.validator.password_in_password_history, value)
                                    });
                                    this.trigger('invalid');
                                    return;
                                }
                            }
                            if (options.error) {
                                options.error(msg, xhr, false);
                            }
                        }.bind(this)
                    });
                }
            }.bind(this));
        },


        getUser: function(data) {

            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/editprofile",
                    type: 'GET',
                    dataType: 'json',
                    success: resolve,
                    error: function(message, xhr) {
                        var responseJSON;

                        try {
                            responseJSON = xhr.getResponseJSON();
                        } catch (err) {
                            console.log('Error: ', err);
                        }

                        responseHandler.setNotification({ response: xhr });
                    }
                });
            });
        },
    });
});
