define([
    'layouts/WizardStep',
    'uit!./stepRoles.html',
    'tablelib/Table',
    '../../../Dictionary',
    '../../../groupEditWizardUtils'
], function(WizardStep, View, Table, Dictionary, WizardUtils) {

    return WizardStep.extend({

        title: Dictionary.rolesStep.title,

        init: function(model) {
            this.model = model;
            this.view = new View({
                roles: {
                    label: Dictionary.rolesStep.modifyRoles
                },
                selectBoxRoles: {
                    enabled: false,
                    value: {
                        name: Dictionary.rolesStep.assign,
                        value: true,
                        title: Dictionary.rolesStep.assign
                    },
                    items: [{
                        name: Dictionary.rolesStep.assign,
                        value: true,
                        title: Dictionary.rolesStep.assign
                    } , {
                        type: 'separator'
                    }, {
                        name: Dictionary.rolesStep.unassign,
                        value: false,
                        title: Dictionary.rolesStep.unassign
                    }]
                },
                tablePrivilegesOptions: {
                    model: this.model
                }
            });
        },

        onViewReady: function() {
            this.addEventHandlers();
        },

        updateRolesCheckInModel: function() {
            if (this.getRolesCheckBoxValue()) {
                this.model.setAttribute('assign', this.getSelectBoxRolesValue().value);
            } else {
                this.model.removeAttribute('assign');
            }
        },

        addEventHandlers: function() {
            this.getRolesCheckBox().addEventHandler('click', function() {
                if (this.getRolesCheckBoxValue()) {
                    this.getSelectBoxRoles().enable();
                    this.model.setAttribute('selectedRoleBox', true);
                } else {
                    this.getSelectBoxRoles().disable();
                    this.model.removeAttribute('selectedRoleBox');
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
            }.bind(this));

            //checkbox active role panel and selectBox(assign/unassign)
            this.getRolesCheckBox().addEventHandler('change', this.updateRolesCheckInModel.bind(this));
            this.getSelectBoxRoles().addEventHandler('change', this.updateRolesCheckInModel.bind(this));
        },

        isValid: function() {
            return true;
        },

        getRolesCheckBoxValue: function() {
            return this.getRolesCheckBox().getProperty("checked");
        },

        getSelectBoxRolesValue: function() {
            return this.getSelectBoxRoles().getValue();
        },

        getSelectBoxRoles: function() {
            return this.view.findById('selectBoxRoles');
        },

        getRolesCheckBox: function() {
            return this.view.getElement().find('.eaUsersgroupedit-StepRoles-roles');
        },

        showButtons: function() {
            this.getWizard().getElement().find(".ebWizard-footerCommandListItem").removeAttribute('style');
        }

    });
});
