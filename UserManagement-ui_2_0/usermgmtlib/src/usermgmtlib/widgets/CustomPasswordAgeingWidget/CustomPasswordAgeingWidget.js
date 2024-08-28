define([
    'jscore/core',
    'jscore/ext/privateStore',
    'jscore/ext/net',
    './CustomPasswordAgeingWidgetView',
    'identitymgmtlib/services/PasswordPolicyService',
    'identitymgmtlib/mvp/binding',
    '../../Dictionary',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'widgets/InfoPopup'
], function(core, PrivateStore, net, View, passwordService, binding, Dictionary, responseHandler, InfoPopup) {

    var _ = PrivateStore.create();
    //var previousSettings; // needed to store initially the global settings

    return core.Widget.extend({

        init: function(options) {
            _(this).model = options.model;
            if(_(this).model.get('passwordAgeing') === null || _(this).model.get('passwordAgeing') === undefined ) {
                this.setDefaultValue();
            }

            passwordService.getValidationRulesWithPwdAgeing().then(function(globals) {
                this.previousSettings = globals;
                if ( this.previousSettings.enablingConfigurable === false ) {
                    this.view.getPwdAgeingFlag().setAttribute('disabled','disabled');
                }
            }.bind(this)).catch(function(xhr) {
                responseHandler.setNotificationError({ response: xhr });
            });
        },

        setDefaultValue: function() {
            var pwdAgeJson = {
                    'customizedPasswordAgeingEnable':false,
                    'passwordAgeingEnable':false,
                    'pwdMaxAge':0,
                    'pwdExpireWarning':0,
                    'graceLoginCount':0
            };
            _(this).model.set('passwordAgeing', pwdAgeJson);
        },

        getValue: function() {
            if(_(this).model.get('passwordAgeing') === null || _(this).model.get('passwordAgeing') === undefined ) {
                this.setDefaultValue();
            }
            return _(this).model.get('passwordAgeing');
        },

        //enable/disable methods

        enable: function() {
            this.view.getCustomPwdAgeFalse().removeAttribute('disabled');
            this.view.getCustomPwdAgeTrue().removeAttribute('disabled');
        },

        disable: function() {
            this.view.getCustomPwdAgeFalse().setProperty('checked', true);
            this.view.getCustomPwdAgeFalse().setAttribute('disabled', 'disabled');
            this.view.getCustomPwdAgeTrue().setAttribute('disabled', 'disabled');
            if(_(this).model.get('passwordAgeing')) {
                var tmpPwdAgeModel = Object.assign({}, _(this).model.get('passwordAgeing'));
                tmpPwdAgeModel.customizedPasswordAgeingEnable = false;
                _(this).model.set('passwordAgeing', tmpPwdAgeModel);
                this.disablePwdAgeFlag();
            } else {
                this.view.getPwdAgeingFlag().setProperty('checked', false);
                this.view.getPwdAgeingFlag().setAttribute('disabled', 'disabled');
                this.view.getCheckboxLabel().setStyle('opacity','0.5');
                this.view.getPwdMaxAge().setValue('');
                this.view.getPwdMaxAge().setAttribute('disabled', 'disabled');
                this.view.getPwdExpireWarning().setValue('');
                this.view.getPwdExpireWarning().setAttribute('disabled', 'disabled');
                this.view.getInputTextLabels().forEach(function(input) {
                    input.setStyle("opacity","0.5");
                });
            }
        },

        removeTitle: function() {
            this.view.getTitle().remove();
        },

        enablePwdAgeFlag: function() {
            if ( this.previousSettings.enablingConfigurable === false ) {
                this.view.getPwdAgeingFlag().setAttribute('disabled','disabled');
            } else {
                this.view.getPwdAgeingFlag().removeAttribute('disabled');
            }
            //previousSettings are being re-overridden if I change the values when in the same page
            passwordService.getValidationRulesWithPwdAgeing().then(function(globals) {
                this.previousSettings = globals;
                var tmpPwdAgeModel = Object.assign({}, _(this).model.get('passwordAgeing'));
                tmpPwdAgeModel.passwordAgeingEnable = this.previousSettings.enabled;
                _(this).model.set('passwordAgeing', tmpPwdAgeModel);
                this.view.getPwdAgeingFlag().setProperty('checked', this.previousSettings.enabled);
                //label opacity
                this.view.getCheckboxLabel().setStyle('opacity','1');
                if(this.previousSettings.enabled) {
                    this.enablePwdAgeInputText(this.previousSettings);
                } else {
                    this.disablePwdAgeInputText(true);
                }
                //attribute for TAF test execution flow
                this.view.getPwdAgeingFlag().setAttribute('ready', "ready");
            }.bind(this)).catch(function(xhr) {
                responseHandler.setNotificationError({ response: xhr });
            });
        },

        disablePwdAgeFlag: function() {
            var tmpPwdAgeModel = Object.assign({}, _(this).model.get('passwordAgeing'));
            tmpPwdAgeModel.passwordAgeingEnable = false;
            _(this).model.set('passwordAgeing',tmpPwdAgeModel);
            this.view.getPwdAgeingFlag().setProperty('checked', false);
            this.view.getPwdAgeingFlag().setAttribute('disabled','disabled');
            //attribute for TAF test execution flow
            this.view.getPwdAgeingFlag().removeAttribute('ready');
            //label opacity
            this.view.getCheckboxLabel().setStyle('opacity','0.5');
            this.disablePwdAgeInputText(true);
        },

        enablePwdAgeInputText: function(globs) {
            var tmpPwdAgeModel = Object.assign({}, _(this).model.get('passwordAgeing'));
            this.view.getPwdMaxAge().removeAttribute('disabled');
            this.view.getPwdExpireWarning().removeAttribute('disabled');

            this.view.getPwdMaxAge().setValue(_(this).model.get('passwordAgeing').pwdMaxAge);
            this.view.getPwdExpireWarning().setValue(_(this).model.get('passwordAgeing').pwdExpireWarning);

            if(globs) {
                this.previousSettings = globs;
            }

            //extracting custom pwdMaxAge previous settings if pwdMaxAgeFlag has been disabled in the same page
            //global settings will be used if customizing has been enabled

            if( ( this.view.getPwdMaxAge().getValue() === '' || this.view.getPwdMaxAge().getValue() === '0' || this.view.getPwdExpireWarning().getValue() === '' ) && this.previousSettings !== undefined ) {

                this.view.getPwdMaxAge().setValue(this.previousSettings.pwdMaxAge);
                tmpPwdAgeModel.pwdMaxAge = this.previousSettings.pwdMaxAge;
                this.view.getPwdExpireWarning().setValue(this.previousSettings.pwdExpireWarning);
                tmpPwdAgeModel.pwdExpireWarning = this.previousSettings.pwdExpireWarning;
                _(this).model.set('passwordAgeing',tmpPwdAgeModel);
            }

            //label opacity
            this.view.getInputTextLabels().forEach(function(input) {
                input.setStyle("opacity","1");
            });
        },

        disablePwdAgeInputText: function(isGlobal) {
            var tmpPwdAgeModel = Object.assign({}, _(this).model.get('passwordAgeing'));
            //not needed to save previous values if flow got here disabling customization: globals will be used when enabled
            if(!isGlobal) {
                this.previousSettings.pwdMaxAge = tmpPwdAgeModel.pwdMaxAge;
                this.previousSettings.pwdExpireWarning = tmpPwdAgeModel.pwdExpireWarning;
            }
            tmpPwdAgeModel.pwdMaxAge = '';
            tmpPwdAgeModel.pwdExpireWarning = '';
            _(this).model.set('passwordAgeing',tmpPwdAgeModel);

            this.view.getPwdMaxAge().setValue('');
            this.view.getPwdMaxAge().setAttribute('disabled','disabled');

            this.view.getPwdExpireWarning().setValue('');
            this.view.getPwdExpireWarning().setAttribute('disabled','disabled');

            //label opacity
            this.view.getInputTextLabels().forEach(function(input) {
                input.setStyle("opacity","0.5");
            });
        },

        //methods to show/hide validation messages
        setValid: function() {
            this.view.getPwdMaxAgeValidator().removeModifier("show");
            this.view.getPwdExpireWarningValidator().removeModifier("show");
            this.view.getPwdMaxAge().removeStyle("border-color");
            this.view.getPwdExpireWarning().removeStyle("border-color");
        },

        setInvalid: function(result) {
            if(result.isPwdAge) {
                this.view.getPwdMaxAgeMsgVal().setText(result.messageAge);
                this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-error-pwdMaxAge').setModifier("show");
                this.view.getPwdMaxAge().setStyle("border-color", "#e32119");
            } else {
                if(this.view.getPwdMaxAgeValidator()){
                    this.view.getPwdMaxAgeValidator().removeModifier("show");
                    this.view.getPwdMaxAge().removeStyle("border-color");
                }
            }
            if(result.isPwdExpire) {
                this.view.getPwdExpireWarnMsgVal().setText(result.messageExpire);
                this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-error-pwdExpireWarning').setModifier("show");
                this.view.getPwdExpireWarning().setStyle("border-color", "#e32119");
            } else {
                if(this.view.getPwdExpireWarningValidator()) {
                    this.view.getPwdExpireWarningValidator().removeModifier("show");
                    this.view.getPwdExpireWarning().removeStyle("border-color");
                }
            }
        },

        addEventHandlers: function() {

            var customFalseElement = this.view.getCustomPwdAgeFalse();
            customFalseElement.addEventHandler('click', function(){
                var tmpPwdAgeModel = Object.assign({}, _(this).model.get('passwordAgeing'));
                tmpPwdAgeModel.customizedPasswordAgeingEnable = false;
                _(this).model.set('passwordAgeing', tmpPwdAgeModel);
                this.view.getCustomPwdAgeFalse().setProperty('checked', true);
                this.disablePwdAgeFlag();
            }.bind(this));

            var customTrueElement = this.view.getCustomPwdAgeTrue();
            customTrueElement.addEventHandler('click', function(){
                var tmpPwdAgeModel = Object.assign({}, _(this).model.get('passwordAgeing'));
                tmpPwdAgeModel.customizedPasswordAgeingEnable = true;
                _(this).model.set('passwordAgeing', tmpPwdAgeModel);
                this.view.getCustomPwdAgeTrue().setProperty('checked', true);
                this.enablePwdAgeFlag();
            }.bind(this));

            var pwdMaxAgeFlagElement = this.view.getPwdAgeingFlag();
            pwdMaxAgeFlagElement.addEventHandler('click', function(){
                var tmpPwdAgeModel = Object.assign({}, _(this).model.get('passwordAgeing'));
                //when clicked the check is already added, so it is not needed to set again the checked property
                if(this.view.getPwdAgeingFlag().getProperty('checked')) {
                    tmpPwdAgeModel.passwordAgeingEnable = true;
                    _(this).model.set('passwordAgeing', tmpPwdAgeModel);
                    this.enablePwdAgeInputText();
                } else {
                    tmpPwdAgeModel.passwordAgeingEnable = false;
                    _(this).model.set('passwordAgeing', tmpPwdAgeModel);
                    this.disablePwdAgeInputText(false);
                }
            }.bind(this));

            var pwdMaxAgeElement = this.view.getPwdMaxAge();
            pwdMaxAgeElement.addEventHandler('input', function(){
                var tmpPwdAgeModel = Object.assign({}, _(this).model.get('passwordAgeing'));
                tmpPwdAgeModel.pwdMaxAge = this.view.getPwdMaxAge().getValue();
                _(this).model.set('passwordAgeing', tmpPwdAgeModel);
            }.bind(this));

            var pwdExpireWarnElement = this.view.getPwdExpireWarning();
            pwdExpireWarnElement.addEventHandler('input', function(){
                var tmpPwdAgeModel = Object.assign({}, _(this).model.get('passwordAgeing'));
                tmpPwdAgeModel.pwdExpireWarning = this.view.getPwdExpireWarning().getValue();
                _(this).model.set('passwordAgeing', tmpPwdAgeModel);
            }.bind(this));

            _(this).model.addEventHandler('valid:passwordAgeing', this.setValid.bind(this));
            _(this).model.addEventHandler('invalid:passwordAgeing', this.setInvalid.bind(this));
        },

        View: function() {
            return new View({
                Dictionary: Dictionary,
                pwdAgeInfoPopup: {
                    content: Dictionary.userPasswordAgeing.infoPopup,
                    width: '300px',
                    topRightCloseBtn: false
                },
                inputPasswordAgeingFields: [{
                    id: 'customizedPasswordAgeingEnable',
                    radiobutton: true,
                    type: 'radio',
                    group: 'pwdAgeSettings',
                    name0: Dictionary.userPasswordAgeing.globalPwdAge,
                    value0: 'false',
                    name1: Dictionary.userPasswordAgeing.customizedPasswordAgeingEnable,
                    value1: 'true',
                }, {
                    id: 'passwordAgeingEnable',
                    name: Dictionary.userPasswordAgeing.passwordAgeingEnable,
                    checkbox: true,
                    type: 'checkbox',
                    indentLV1: true,
                }, {
                    id: 'pwdMaxAge',
                    name: Dictionary.userPasswordAgeing.pwdMaxAge,
                    validator: 'pwdMaxAgeValidation',
                    indentLV2: true,
                }, {
                    id: 'pwdExpireWarning',
                    name: Dictionary.userPasswordAgeing.pwdExpireWarning,
                    validator: 'pwdExpireWarningValidation',
                    indentLV2: true,
                }]
            });
        },

        onViewReady: function() {
            var infoPopup = new InfoPopup({content: Dictionary.userPasswordAgeing.infoPopup, width: '300px', topRightCloseBtn: false});
            infoPopup.attachTo(this.view.getInfoPopupContainer());

            this.addEventHandlers();

            //first initialization needed when page is first loaded so that view acquire model values in edit mode
            //and does not override user values with global pwd ageing values
            this.view.getPwdAgeingFlag().setProperty('checked', _(this).model.get('passwordAgeing').passwordAgeingEnable);
            this.view.getPwdMaxAge().setValue(_(this).model.get('passwordAgeing').pwdMaxAge);
            this.view.getPwdExpireWarning().setValue(_(this).model.get('passwordAgeing').pwdExpireWarning);
            if(_(this).model.get('passwordAgeing').customizedPasswordAgeingEnable) {
                this.view.getCustomPwdAgeTrue().setProperty('checked', true);
                if(!_(this).model.get('passwordAgeing').passwordAgeingEnable) {
                    this.disablePwdAgeInputText(true);
                }
            } else {
                this.view.getCustomPwdAgeFalse().setProperty('checked', true);
                this.disablePwdAgeFlag();
            }
        }
    });
});
