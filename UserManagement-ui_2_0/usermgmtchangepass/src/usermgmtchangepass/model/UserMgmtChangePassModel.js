define([
    'identitymgmtlib/mvp/Model',
    'jscore/ext/net',
    'jscore/ext/utils/base/underscore',
    'usermgmtlib/validators/username.validator',
    'usermgmtlib/validators/password.validator',
    'usermgmtlib/services/UserManagementService',
    '../Dictionary',
    'identitymgmtlib/Utils'
], function(Model, net, _, usernameValidator, passwordValidator, service, Dictionary, Utils) {

    var RESTusers = "/oss/idm/usermanagement/users/";

    var isPasswordsChanged = function() {
        return (this.lastPassword !== this.get('password') || this.lastConfirmPassword !== this.get('passwordConfirm'));
    };

    var updateFormLastValues = function() {
        this.lastPassword = this.get('password');
        this.lastConfirmPassword = this.get('passwordConfirm');
    };

    return Model.extend({

        //uncomment it after change REST interface (add username at the end url)
        //idAttribute: 'username',

        url: "/oss/idm/usermanagement/changepassword",

        notSync: ['passwordConfirm'],

        defaults: {
            passwordResetFlag: true
        },

        validate: function(strict, saveButton) {
            return new Promise(function(resolve, reject) {

                var result = {};

                // validate password and confirm password
                // TODO: should be performed only when password, passwordConfirm or username changed
                // but first result should be stored to not lost previous failed result
                if (isPasswordsChanged.call(this) || this.shouldBeValidated('password') || this.shouldBeValidated('passwordConfirm')) {
                    passwordValidator.validate({
                        policiesCollection: this.passwordPoliciesCollection,
                        password: this.get('password'),
                        passwordConfirm: this.get('passwordConfirm'),
                        strictMode: this.isStrictMode(),
                        saveButton: saveButton,
                        username: this.get('username'),
                        name: this.get('name'),
                        surname: this.get('surname'),
                        isPasswordsChanged: isPasswordsChanged.call(this)
                    }).then(function(validationObject) {
                        updateFormLastValues.call(this);
                        result.password = validationObject;
                        result.passwordConfirm = result.password;
                        resolve(result);
                    }.bind(this));
                } else {
                    resolve(result);
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
            this.isValid(true, true).then(function(valid) {

                if (valid === true) {

                    net.ajax({
                        url: this.url,
                        type: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(this.toJSON()),
                        success: function(data, xhr) {
                            if (options.success) {
                                options.success(data, xhr);
                            }
                        },
                        error: function(msg, xhr) {
                            var validationFailed = false;
                            if (xhr.getStatus() === 422 && xhr.getResponseJSON().internalErrorCode === 'UIDM-7-4-4' && xhr.getResponseJSON().userMessage.indexOf("mustNotBeOldPassword") !== -1) {
                                var value = xhr.getResponseJSON().userMessage.match(/\d+/)[0];
                                this.trigger('invalid:password', {
                                    message: Utils.printf(Dictionary.validator.password_in_password_history, value)
                                });
                                this.trigger('invalid');
                                validationFailed = true;
                            }
                            if (options.error) {
                                options.error(msg, xhr, validationFailed);
                            }
                        }.bind(this)
                    });
                }
            }.bind(this));
        },

        //get data user
        getUser: function(options) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: RESTusers + this.get('username'),
                    type: "GET",
                    dataType: "json",
                    success: function(data) {
                        if (options.success) {
                            options.success(data);
                        }
                    },
                    error: function(msg, xhr) {
                        if (options.error) {
                            options.error(msg, xhr, false);
                        }
                    }
                });
            }.bind(this));
        }






    });

});
