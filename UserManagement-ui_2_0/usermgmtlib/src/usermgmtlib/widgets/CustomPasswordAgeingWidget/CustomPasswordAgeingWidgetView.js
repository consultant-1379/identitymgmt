define([   
    'jscore/core',
    'template!./CustomPasswordAgeingWidget.html',
    'styles!./CustomPasswordAgeingWidget.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getCustomPwdAgeFalse: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-wRadioButtonWidget-input-false');
        },

        getCustomPwdAgeTrue: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-wRadioButtonWidget-input-true');
        },

        getAllCustomPwdAge: function() {
            return this.getElement().findAll('.eaUsermgmtlib-wUserMgmtCustomPwd-wRadioButtonWidget-input');
        },

        getPwdAgeingFlag: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-wSimpleCheckboxWidget-input');
        },

        getPwdMaxAge: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-wInputWidget-input-pwdMaxAge');
        },

        getPwdExpireWarning: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-wInputWidget-input-pwdExpireWarning');
        },

        getCheckboxLabel: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-wSimpleCheckboxWidget-details-label');
        },

        getInputTextLabels: function() {
            return this.getElement().findAll('.eaUsermgmtlib-wUserMgmtCustomPwd-pwdAgeing-label');
        },

        getPwdMaxAgeValidator: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-error-pwdMaxAge');
        },

        getPwdExpireWarningValidator: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-error-pwdExpireWarning');
        },

        getPwdMaxAgeMsgVal: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-error-message-pwdMaxAge');
        },

        getPwdExpireWarnMsgVal: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-error-message-pwdExpireWarning');
        },

        getTitle: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-titleCompose');
        },

        getInfoPopupContainer: function() {
            return this.getElement().find('.eaUsermgmtlib-wUserMgmtCustomPwd-infoPopup');
        }
    });
});