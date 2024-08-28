define([
    'identitymgmtlib/mvp/Collection',
    'jscore/ext/utils/base/underscore',
    './PasswordPoliciesModel',
    'usermgmtlib/services/UserManagementService',
    '../Dictionary'
], function(Collection, _, PasswordPoliciesModel, UserManagementService, Dictionary) {

    function validatePasswordMatch(password, passwordConfirm, strictMode) {

        if (strictMode) {
            if (_.isEmpty(password) || _.isEmpty(passwordConfirm)) {
                return { message: Dictionary.validator.password.enter_pass_and_reppass };
            }
        } else {
            if (_.isEmpty(password) && _.isEmpty(passwordConfirm)) {
                return { message: Dictionary.validator.password.enter_pass_and_reppass };
            }

            if (_.isEmpty(password)) {
                return { message: Dictionary.validator.password.enter_password };
            }
        }

        if (password !== passwordConfirm) {
            return { message: Dictionary.validator.password.passwords_must_match };
        }

        return undefined;
    }

    return Collection.extend({

        clearTicks: function() {
            this.first = false;
            this.lastPassword = "";
            this.lastConfirmPassword = "";
            this.each(function(policy) {
                policy.setAttribute('valid', undefined);
                policy.clear();
            });
        },

        lastValidationResult: null,
        first: false,
        lastPassword: "",
        lastConfirmPassword: "",
        validationRules: null,

        url: "/oss/idm/usermanagement/users/validationrules/password",

        Model: PasswordPoliciesModel,

        validate: function(data) {
            var updatePolicies = new Promise(function(resolve, reject) {
                if (data.isNameSurnameUsernameChanged || data.isPasswordsChanged) {
                    this.fetch({
                        success: function() {
                            resolve();
                        }.bind(this)
                    });
                } else {
                    resolve();
                }
            }.bind(this));

            var validationResult = new Promise(function(resolve, reject) {

                updatePolicies.then(function() {
                    var rules = this.toJSON().map(function(policy, index) {
                        if (policy.name !== "mustNotContainUserId") {
                            return { "name": policy.name };
                        } else {
                            this.usernamePolicyExist = true;
                            return {
                                "name": policy.name,
                                "arguments": [
                                    data.username || '',
                                    data.name || '',
                                    data.surname || ''
                                ]
                            };
                            //!!BUG in backend if all arguments are empty
                        }
                    }.bind(this));

                    this.validatePolicyMustNotContainUserId = rules.some(function(rule) {
                        return rule.name === 'mustNotContainUserId' && data.isNameSurnameUsernameChanged;
                    });

                    rules = rules.filter(function(rule) {
                        if (rule.name !== 'mustNotContainUserId') {
                            return true;
                        } else {
                            if (_.isEmpty(data.username) && _.isEmpty(data.name) && _.isEmpty(data.surname)) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    });

                    this.validationRules = {
                        "attributeValue": data.password || "",
                        "validationRules": rules
                    };

                    var validationObject = {};
                    if ( data.password === undefined ) {
                        validationObject = validatePasswordMatch(data.password, data.passwordConfirm, data.strictMode);
                        this.lastValidationResult = validationObject;
                        resolve(validationObject);

                    } else if (!data.isPasswordsChanged && !this.validatePolicyMustNotContainUserId && this.first && !data.saveButton) {
                        resolve(this.lastValidationResult);
                    } else {
                        UserManagementService.getPasswordValidationResult(this.validationRules).then(function(results) {
                            this.first = true;

                            this.setModels(results, { add: false, remove: false });

                            //this is because of policy 'mustNotContainUserId', 
                            // if it is turned on in backend and when admin have not 
                            // enter name and surname and username, backend will not give 
                            // 'mustNotContainUserId' validation result and it has to be 
                            // set manually to show any tick next to this policy in widget
                            this.each(function(model) {
                                if (model.get('name') === 'mustNotContainUserId' && model.get('valid') === undefined) {
                                    model.set('valid', true);
                                }
                            });

                            var allPoliciesValid = results.every(function(result) {
                                return result.valid === true;
                            });
                            if (allPoliciesValid || _.isEmpty(data.password)  ) {
                                validationObject = validatePasswordMatch(data.password, data.passwordConfirm, data.strictMode);
                            } else {
                                validationObject.message = Dictionary.validator.password.policies_must_fulfilled;
                            }

                            if (!_.isEmpty(validationObject)) {
                                validationObject.policies = results;
                            }
                            this.lastValidationResult = validationObject;
                            resolve(validationObject);
                        }.bind(this), function(results) {
                            console.log('Can NOT validate password! Error: ', results.response);
                            reject(results.response);
                        }.bind(this));
                    }
                    // resolve();
                }.bind(this));
            }.bind(this));

            return validationResult;
        }
    });
});
