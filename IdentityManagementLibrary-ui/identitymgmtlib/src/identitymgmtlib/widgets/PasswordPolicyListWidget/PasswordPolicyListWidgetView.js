define([
	'jscore/core',
	'template!./PasswordPolicyListWidget.html',
	'styles!./PasswordPolicyListWidget.less'
], function (core, template, style){

	return core.View.extend({

		getTemplate: function(){
			return template(this.options);
		},

		getStyle: function(){
			return style;
		},

		getPolicyContainer: function(){
			return this.getElement().find(".elIdentitymgmtlib-PasswordPolicyValidationWidget-PasswordPolicy");
		},

		setValidityOfPolicy: function(policyNote, valid){
			var findPolicyIcon = this.getElement().find(".elIdentitymgmtlib-PasswordPolicyValidationWidget-Icon-" + policyNote);
			if(findPolicyIcon !== undefined){
				if(valid){
					findPolicyIcon.find(".ebIcon").removeModifier('close_red');
					findPolicyIcon.find(".ebIcon").setModifier('simpleGreenTick');
				}
			 	else{
					findPolicyIcon.find(".ebIcon").removeModifier('simpleGreenTick');
					findPolicyIcon.find(".ebIcon").setModifier('close_red');
				}
			}
			return valid;
		}
	});
});
