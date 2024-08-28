define([
	'jscore/core',
	'template!./PasswordPolicyValidationWidget.html',
	'styles!./PasswordPolicyValidationWidget.less',
	'i18n!identitymgmtlib/common.json'
], function (core, template, style, common){

	return core.View.extend({

		getTemplate: function(){
			return template(common);
		},

		getStyle: function(){
			return style;
		},

		getPolicyContainer: function(){
			return this.getElement().find(".elIdentitymgmtlib-PasswordPolicyValidationWidget-PasswordPolicy");
		}
		
	});
});
