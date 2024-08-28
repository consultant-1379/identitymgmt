define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./usersgroupedit.html',
    'jscore/ext/utils/base/underscore',
    'layouts/Wizard',
    './widgets/GroupEditWizard/stepDetails/StepDetails',
    './widgets/GroupEditWizard/stepRoles/StepRoles',
    './widgets/GroupEditWizard/stepSecurity/StepSecurity',
    './widgets/GroupEditWizard/stepSummary/StepSummary',
    './widgets/GroupEditWizard/stepApply/StepApply',
    'widgets/Breadcrumb',
    'layouts/TopSection',
    'layouts/MultiSlidingPanels',
    './Dictionary',
    'identitymgmtlib/ParamsLocationController',
    'identitymgmtlib/AccessControlService',
    './model/UsersGroupEditModel',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'identitymgmtlib/Utils'
], function(core, PrivateStore, View, __, Wizard, StepDetails, StepRoles, StepSecurity, StepSummary, StepApply, Breadcrumb, TopSection, MultiSlidingPanels, Dictionary, LocationController, AccessControlService, UsersGroupEditModel, responseHandler, utils) {

    var _ = PrivateStore.create();

    return core.App.extend({
        View: View,

        performOnStart: function() {

            _(this).locationController = new LocationController({
                namespace: this.options.namespace,
                autoUrlDecode: false
            });

            _(this).locationController.addLocationListener(this.onLocationChange.bind(this));
            this.performOnResume();
        },

        setUsersToEdit: function() {
            var params = _(this).locationController.getParameter('users') || '';
            this.usersToEdit = params.length ? params.split(',') : [];
            this.usersToEdit.forEach(function(username, index) {
                this.usersToEdit[index] = username.trim();
            }.bind(this));
            if (__.last(this.usersToEdit) === "") {
                this.usersToEdit = __.without(this.usersToEdit, '');
            }
            this.usersToEdit = __.uniq(this.usersToEdit);
        },

        onStart: function() {
            return AccessControlService.isAppAvailable('user_management').then(function() {
                    this.performOnStart();
                }.bind(this),
                function(response) {
                    if (response.getStatus && response.getStatus() !== 401) {
                        responseHandler.setNotificationError({ response: '' + response.getStatus() });
                    } else {
                        responseHandler.showAccessDeniedDialog();
                    }
                }.bind(this));
        },

        onResume: function() {
            return AccessControlService.isAppAvailable('user_management').then(function() {
                    this.performOnResume();
                }.bind(this),
                function(response) {
                    if (response.getStatus && response.getStatus() !== 401) {
                        responseHandler.setNotificationError({ response: '' + response.getStatus() });
                    } else {
                        responseHandler.showAccessDeniedDialog();
                    }
                }.bind(this));
        },

        goBack: function() {
            _(this).locationController.setLocation('usermanagement');
        },

        performOnResume: function() {
            this.setUsersToEdit();
            _(this).locationController.start();
            if (!this.usersToEdit || this.usersToEdit.length === 0) {
                this.goBack();
            }
        },

        onPause: function() {
            core.Window.removeEventHandler('focus');
            if (_(this).locationController) {
                _(this).locationController.stop();
            }
            this.wizard.trigger('pauseStep');

            if(this.wizard) {
                this.wizard.destroy();
            }
        },

        onLocationChange: function() {
            this.renderApp();
        },

        addEventHandlersWizard: function() {
            this.wizard.addEventHandler('finish', this.goBack.bind(this));
            this.wizard.addEventHandler('cancel', this.goBack.bind(this));
        },


        initWizard: function() {
            this.model = new UsersGroupEditModel();
            this.model.setAttribute('usersToGroupEdit', this.usersToEdit || [], { silent: true });
            this.wizard = new Wizard({
                steps: [
                    new StepDetails(this.model),
                    new StepRoles(this.model),
                    new StepSecurity(this.model),
                    new StepSummary(this.model),
                    new StepApply(this.model)
                ],
                labels: {
                    next: Dictionary.detailsStep.next,
                    previous: Dictionary.detailsStep.previous,
                    cancel: Dictionary.detailsStep.cancel,
                    finish: Dictionary.detailsStep.finish
                }
            });
            this.addEventHandlersWizard();
        },

        onBeforeLeave: function() {
            if (this.model.get('finish') !== undefined || !this.model.get('usersToGroupEdit').length || !this.model.isChangedModel()) {
                return false;
            } else {
                return true;
            }
        },

        renderApp: function() {
            this.initWizard();

            if (this.layout) {
                this.layout.destroy();
            }
            this.layout = new TopSection({
                context: this.getContext(),
                title: Dictionary.title,
                defaultActions: null,
                breadcrumb: utils.removeChildAppsFromBreadcrumb(this.options.breadcrumb)
            });
            this.layout.attachTo(this.view.getElement());
            this.layout.setContent(
                new MultiSlidingPanels({
                    context: this.getContext(),
                    showLabel: true,
                    main: {
                        label: this.options.properties.title,
                        content: this.wizard
                    }
                })
            );

        }
    });
});
