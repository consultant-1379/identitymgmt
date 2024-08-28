define([
    'layouts/WizardStep',
    'uit!./stepSecurity.html',
    '../../../Dictionary',
    'usermgmtlib/validators/passwordageing.validator',
     '../../../groupEditWizardUtils'
], function(WizardStep, View, Dictionary, passwordAgeingValidator, WizardUtils) {

    return WizardStep.extend({

        title: Dictionary.securityStep.title,

        init: function(model) {
            this.model = model;

            this.view = new View ({
                authMode: {
                    label: Dictionary.securityStep.modifyAuthMode,
                    content: Dictionary.securityStep.authModeInfoPopup,
                },
                dropdownAuthMode: {
                    caption: Dictionary.local,
                    enabled: false,
                    items: [{
                        name: Dictionary.local,
                        action: this.setAuthModeLocal.bind(this)
                    }, {
                        name: Dictionary.remote,
                        action: this.setAuthModeRemote.bind(this)
                    }]
                },
                passwordAgeing: {
                    label: Dictionary.securityStep.modifyPwdAgeing,
                    content: Dictionary.userPasswordAgeing.infoPopupMultipleIntro+Dictionary.userPasswordAgeing.infoPopup,
                    width: '300px',
                    topRightCloseBtn: false
                },
                pwdAgeingOptions: {
                    model: this.model,
                }
            });
        },

        onViewReady: function() {
            this.view.findById('passwordAgeing').disable();
            this.model.removeAttribute('passwordAgeing');
            this.view.findById('passwordAgeing').removeTitle();
            this.model.removeAttribute('authMode');

            this.addEventHandlers();
            this.revalidate(); //needed for elements in previous step
        },

        updatePwdAgeingInModel: function() {
            if (this.getPwdAgeingCheckBoxValue()) {
                this.model.setAttribute('passwordAgeing', this.getPwdAgeingValue());
            } else {
                this.model.removeAttribute('passwordAgeing');
            }
        },

        addEventHandlers: function() {
            this.getAuthModeCheckBox().addEventHandler('click', function() {
                if (this.getAuthModeCheckBoxValue()) {
                    this.getAuthMode().enable();
                    this.model.setAttribute('authMode', "local");
                } else {
                    this.getAuthMode().disable();
                    this.getAuthMode().setCaption(Dictionary.local);
                    this.model.removeAttribute('authMode');
                }
                this.getWizard().resetRemainingSteps();
                this.revalidate();
            }.bind(this));

            this.model.addEventHandler('change:passwordAgeing', function(model, value) {
                if (value !== undefined) {
                    this.getPwdAgeing().enable();
                } else {
                    this.getPwdAgeing().disable();
                }
                this.getWizard().resetRemainingSteps();
                this.revalidate();
            }.bind(this));

            this.addEventHandler('activate', function() {
                this.getWizard().setLabels({
                    next: Dictionary.detailsStep.next,
                });
                if (!this.model.get('finish')) {
                    this.showButtons();
                } else {
                    WizardUtils.goToApplyStep(this.getWizard());
                }
            }.bind(this));

            this.addEventHandler('revalidate', function (isValid) {
                if ( this.getWizard() ) {
                    WizardUtils.enableAuthenticationStep(this.getWizard());
                }
            }.bind(this));


            this.getPwdAgeing().addEventHandler('change', this.updatePwdAgeingInModel.bind(this));
            this.getPwdAgeingCheckBox().addEventHandler('change', this.updatePwdAgeingInModel.bind(this));
        },

        isValid: function() {
            //reference to other elements eventually set previously in model
            return this.model.isChangedModel();
        },

        getPwdAgeingCheckBoxValue: function() {
            return this.getPwdAgeingCheckBox().getProperty("checked");
        },

        getPwdAgeingValue: function() {
            return this.getPwdAgeing().getValue();
        },

        getPwdAgeing: function() {
            return this.view.findById('passwordAgeing');
        },

        getPwdAgeingCheckBox: function() {
            return this.view.getElement().find('.eaUsersgroupedit-StepSecurity-pwdAgeing');
        },

        setAuthModeLocal: function () {
            this.getAuthMode().setCaption(Dictionary.local);
            this.model.setAttribute('authMode', "local");
            WizardUtils.enableSummaryStep(this.getWizard(), this.model);
            this.revalidate();
        },

        setAuthModeRemote: function () {
            this.getAuthMode().setCaption(Dictionary.remote);
            this.model.setAttribute('authMode', "remote");
            WizardUtils.enableSummaryStep(this.getWizard(), this.model);
            this.revalidate();
        },

        getAuthModeCheckBoxValue: function() {
            return this.getAuthModeCheckBox().getProperty("checked");
        },

        getAuthMode: function() {
            return this.view.findById('dropdownAuthMode');
        },

        getAuthModeCheckBox: function() {
            return this.view.getElement().find('.eaUsersgroupedit-StepSecurity-authMode');
        },

        showButtons: function() {
            this.getWizard().getElement().find(".ebWizard-footerCommandListItem").removeAttribute('style');
        }
    });
});
