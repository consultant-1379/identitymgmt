define([
    'layouts/WizardStep',
    'uit!./stepDetails.html',
    'tablelib/Table',
    '../../../Dictionary',
    '../../../groupEditWizardUtils'
], function(WizardStep, View, Table, Dictionary, WizardUtils) {

    return WizardStep.extend({

        title: Dictionary.detailsStep.title,

        init: function(model) {
            this.model = model;
            this.view = new View({
                switcher: {
                    label: Dictionary.detailsStep.modifyStatus,
                    enabled: Dictionary.detailsStep.enabled,
                    disabled: Dictionary.detailsStep.disabled
                },
                description: {
                    label: Dictionary.detailsStep.modifyDescription
                }
            });
        },

        onViewReady: function() {
            this.view.findById('switcher').disable();
            this.view.findById('description').disable({clear:true});
            this.addEventHandlers();
        },

        updateStatusInModel: function() {
            if (this.getStatusCheckBoxValue()) {
                this.model.setAttribute('status', this.getSwitcherValue() || false);
            } else {
                this.model.removeAttribute('status');
            }
            WizardUtils.enableSummaryStep(this.getWizard(), this.model);
        },

        updateDescriptionInModel: function() {
            if (this.getDescriptionCheckBoxValue()) {
                this.model.setAttribute('description', this.getDescriptionValue());
            } else {
                this.model.removeAttribute('description');
            }
            WizardUtils.enableSummaryStep(this.getWizard(), this.model);
        },

        addEventHandlers: function() {
            this.model.addEventHandler('change:status', function(model, value) {
                if (value !== undefined) {
                    this.getSwitcher().enable();
                } else {
                    this.getSwitcher().disable();
                }

                WizardUtils.enableSummaryStep(this.getWizard(), this.model);
                this.getWizard().resetRemainingSteps();
                this.revalidate();
            }.bind(this));

            this.model.addEventHandler('change:description', function(model, value) {
                if (value !== undefined) {
                    this.getDescription().enable();
                } else {
                    this.getDescription().disable({clear:false});
                }

                WizardUtils.enableSummaryStep(this.getWizard(), this.model);
                this.getWizard().resetRemainingSteps();
                this.revalidate();
            }.bind(this));

            this.addEventHandler('activate', function() {
                this.getWizard().setLabels({
                    next: Dictionary.detailsStep.next,
                });

                if (!this.model.get('finish')) {
                    WizardUtils.enableSummaryStep(this.getWizard(), this.model);
                    this.showButtons();
                } else {
                    WizardUtils.goToApplyStep(this.getWizard());
                }
                WizardUtils.enableAuthenticationStep(this.getWizard());
            }.bind(this));

            this.getSwitcher().addEventHandler('change', this.updateStatusInModel.bind(this));
            this.getStatusCheckBox().addEventHandler('change', this.updateStatusInModel.bind(this));
            this.getDescription().addEventHandler('change', this.updateDescriptionInModel.bind(this));
            this.getDescriptionCheckBox().addEventHandler('change', this.updateDescriptionInModel.bind(this));
        },

        isValid: function() {
            return true;
        },

        reset: function() {
            this.getSwitcher.setProperty('checked', false);
        },

        getStatusCheckBoxValue: function() {
            return this.getStatusCheckBox().getProperty("checked");
        },

        getDescriptionCheckBoxValue: function() {
            return this.getDescriptionCheckBox().getProperty("checked");
        },

        getSwitcherValue: function() {
            return this.getSwitcher().getValue();
        },

        getDescriptionValue: function() {
            return this.getDescription().getValue();
        },

        getSwitcher: function() {
            return this.view.findById('switcher');
        },

        getDescription: function() {
            return this.view.findById('description');
        },

        getSelectBoxRoles: function() {
            return this.view.findById('selectBoxRoles');
        },

        getStatusCheckBox: function() {
            return this.view.getElement().find('.eaUsersgroupedit-StepDetails-status');
        },

        getDescriptionCheckBox: function() {
            return this.view.getElement().find('.eaUsersgroupedit-StepDetails-description');
        },

        showButtons: function() {
            this.getWizard().getElement().find(".ebWizard-footerCommandListItem").removeAttribute('style');
        }

    });
});
