define([
    'jscore/core',
    './PasswordPolicyValidationWidgetView',
    'jscore/ext/net',
    'container/api',
    'i18n!identitymgmtlib/password-policy.json',
    'identitymgmtlib/Utils',
    'identitymgmtlib/PasswordPolicyListWidget',
    'identitymgmtlib/services/PasswordPolicyService'
    ], function (core, View, net, container, dictionary, utils, PasswordPolicyListWidget, passwordPolicyService) {

       return core.Widget.extend({
            View : View,
            activePolicesGet : null,
            userPassword : "",
            userId : "",
            userFirstName : "",
            userLastName : "",
            timeout : 0,
            policyListWidget : null,
            isPasswordValid : null,

            onViewReady: function(){
                if(this.options.userId !== undefined){
                    this.userId = this.options.userId;
                }

                this.getPolicies(function(){
                    if(this.options.firstPasswordValue){
                        this.inputData(this.options.firstPasswordValue, function(){});
                    }
                }.bind(this));

                container.getEventBus().subscribe("PasswordPolicyValidationWidget:getValidationCheckFromUserModel", function(){
                    container.getEventBus().publish("UserModel:passwordValidationForUserModel", this.isPasswordValid);
                }.bind(this));
            },

            doneTyping: function(callBackValidation) {
                var postData = {
                    attributeValue: this.userPassword,
                    validationRules: this.activePolicesGet.map(function(field){
                        if(field.name === "mustNotContainUserId"){
                            return {
                                name: field.name, "arguments": [this.userId, this.userFirstName, this.userLastName]
                            };
                        }
                        return {
                            name: field.name
                        };
                    }.bind(this))
                };
                postData = JSON.stringify(postData);
                passwordPolicyService.validate(postData).then(function(response) {
                    this.updatePolices(response, callBackValidation);
                }.bind(this));
            },

            updatePolices: function(response, callBackValidation){
                this.isPasswordValid = true;
                response.forEach(function(policy) {
                    if(!policy.valid){
                        this.isPasswordValid = false;
                    }
                    this.policyListWidget.updatePolicy(policy.name, policy.valid);
                }.bind(this));
                callBackValidation(this.isPasswordValid);
                return this.isPasswordValid;
            },

            getPolicies: function(firstValidation) {
                passwordPolicyService.getValidationRules().then(function(policies) {
                    this.activePolicesGet = policies;
                    policies = policies
                        .map(function(policy) {
                            return {
                                policyName: utils.printf(dictionary[policy.name], policy.value),
                                policyId: policy.name
                            };
                        });

                    this.policyListWidget = new PasswordPolicyListWidget({
                        policies: policies
                    });

                    this.policyListWidget.attachTo(this.view.getPolicyContainer());
                    firstValidation();
                }.bind(this));
            },

            getIsPasswordValid: function(){
                return this.isPasswordValid;
            },

            inputData: function(data, callBackValidation){
                if(data.key === 'password'){
                    this.userPassword = data.value;
                }
                else if(data.key === 'id'){
                    this.userId = data.value;
                }
                else if(data.key === 'name'){
                    this.userFirstName = data.value;
                }
                else if(data.key === 'surname'){
                    this.userLastName = data.value;
                }

                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(function(){
                    this.doneTyping(callBackValidation);
                }.bind(this), 300);
            }
    });
});
