/*------------------------------------------------------------------------------
 *******************************************************************************
  * COPYRIGHT Ericsson 2016
  *
  * The copyright to the computer program(s) herein is the property of
  * Ericsson Inc. The programs may be used and/or copied only with written
  * permission from Ericsson Inc. or in accordance with the terms and
  * conditions stipulated in the agreement/contract under which the
  * program(s) have been supplied.
  *******************************************************************************
 -----------------------------------------------------------------------------*/
define([
    'identitymgmtlib/Utils',
    'jscore/core',
    'jscore/ext/net',
     'container/api',
    'identitymgmtlib/ParamsLocationController',
    'layouts/TopSection',
    './widgets/FilterWidget/FilterWidget',
    'layouts/MultiSlidingPanels',
    './ActionsManager',
    'i18n!targetmanagement/app.json',
    './TargetmanagementView',
    './regions/TargetMgmtRegion',
    'widgets/Dialog',
    'widgets/Notification',
    'identitymgmtlib/AccessControlService',
    'identitymgmtlib/widgets/ResponsesSummaryDialog'
], function(utils , core, net, container, ParamsLocationController, TopSection, FilterWidget, MultiSlidingPanels, ActionsManager, Dictionary, View, TargetMgmtRegion, Dialog, Notification, accessControlService, ResponsesSummaryDialog) {
    return core.App.extend({

        View: View,
        topSection: null,
        deleteTG: {
            toDelete: [],
            deleted: []
        },
        showFilterPanel : false,

        deletedTgSuccessCounter: 0,

        onStart: function() {
            ActionsManager.setContext(this.getContext());

            this.locationController = new ParamsLocationController({
                namespace: this.options.namespace,
                autoUrlDecode: false
            });

            this.topSection = new TopSection({
                context: this.getContext(),
                breadcrumb: this.options.breadcrumb,
                title: this.options.properties.title,
                defaultActions: ActionsManager.getDefaultActions()
            });

            accessControlService.isAppAvailable("targetmanagement", utils.createAccessControlRegion.bind(this));

            // Create the regions and populate them into the layouts
            this.filterWidget = createFilterWidget.call(this);

            this.targetMgmtRegion = new TargetMgmtRegion({
                filterWidget: this.filterWidget,
                context: this.getContext(),
                locationController: this.locationController
            });

            this.multiSlidingPanels = new MultiSlidingPanels({
                context: this.getContext(),
                main: {
                    label: this.options.properties.title,
                    content: this.targetMgmtRegion
                },
                right: [{
                    label: Dictionary.filter.title,
                    icon: 'filter',
                    value: Dictionary.filter.label,
                    type: 'external'
                }]

            });

            this.topSection.setContent(this.multiSlidingPanels);
            this.topSection.attachTo(this.getElement());

            this.addEventHandlers();

            // create handlers for actions triggered by ActionsManager.
            this.addActionsEventHandlers();

            this.onResume();
            this.initMenu();

        },

        initMenu: function() {
            var table = this.targetMgmtRegion.getTable().getTable();

            // this event will trigger each time the user right clicks on any row
            table.addEventHandler('rowevents:contextmenu', function (row, e) {
                e.preventDefault();
                // If there is any row selected then show context menu
                if (table.getSelectedRows().length > 0) {
                    container.getEventBus().publish('contextmenu:show', e, ActionsManager.getMenuActions(this.targetMgmtRegion.getTable().getCheckedRows(), false));
                }
             }.bind(this));
        },

        onResume: function() {
            accessControlService.isAppAvailable("targetmanagement", utils.createAccessControlRegion.bind(this));
            this.getEventBus().publish('mainregion:refreshdata');

            this.locationController.start();
            this.targetMgmtRegion.refreshDataNeeded();
        },

        onPause: function() {
            this.locationController.stop();
        },

        addEventHandlers: function() {
            this.getEventBus().subscribe('refresh', this.onResume.bind(this));
            this.getEventBus().subscribe('layouts:panelaction', function (value) {
                if (value === Dictionary.filter.label) {
                    container.getEventBus().publish('flyout:show', {
                        header: Dictionary.filter.title,
                        content: this.filterWidget
                    });
                }
            }.bind(this));
            this.addFilteredClearEventHandler();

        },

        addActionsEventHandlers: function(){
          this.getEventBus().subscribe('actions:create', this.createAction.bind(this));
          this.getEventBus().subscribe('actions:delete', this.deleteAction.bind(this));
          this.getEventBus().subscribe('actions:edit', this.editAction.bind(this));
          this.getEventBus().subscribe('actions:view', this.viewAction.bind(this));
          this.getEventBus().subscribe('actions:refresh', this.refreshAction.bind(this));
        },

        viewAction: function(selectedTargetGroupName) {
            this.locationController.setNamespaceLocation('targetgroup/view/' + selectedTargetGroupName);
        },

        editAction: function(selectedTargetGroupName) {
            this.locationController.setNamespaceLocation('targetgroup/edit/' + selectedTargetGroupName);
        },

        createAction: function(){
            this.locationController.setLocation('targetmanagement/targetgroup/create');
        },

        refreshAction: function(){
            this.onResume();
        },

        deleteAction: function(targetGroupsToDelete){
            this.deleteTG.toDelete = targetGroupsToDelete.map(function(targetGroup) {
                return targetGroup.name;
            });
            this.deleteTG.deleted = [];

            var deleteDialog = new Dialog({
                header: Dictionary.deleteTargetGroups.confirmDialog.deleteTgHeader,
                content: Dictionary.deleteTargetGroups.confirmDialog.deleteTgContent,
                buttons: [{
                    caption: Dictionary.deleteTargetGroups.confirmDialog.deleteTgConfirm,
                    color: 'darkBlue',
                    action: function() {
                        deleteDialog.hide();
                        this.deleteTargetGroupsViaREST();
                    }.bind(this)
                }, {
                    caption: Dictionary.deleteTargetGroups.confirmDialog.deleteTgCancel,
                    action: function() {
                        deleteDialog.hide();
                    }.bind(this)
                }],
                type: 'warning',
                visible: true
            });
        },

        deleteTargetGroupsViaREST: function() {
            this.deleteTG.toDelete.forEach(function(targetGroup) {
                net.ajax({
                    url: "/oss/idm/targetgroupmanagement/targetgroups/" + targetGroup,
                    type: "DELETE",
                    success: this.deleteTgOnSuccessHandlerProducer(targetGroup).bind(this),
                    error: this.deleteTgOnErrorHandlerProducer(targetGroup).bind(this)
                });
            }.bind(this));
        },

        deleteTgOnSuccessHandlerProducer: function(targetGroup) {
            return function(data, xhr) {
                this.deleteTG.deleted.push([targetGroup, xhr.getStatus()]);
                this.deletedTgSuccessCounter++;
                this.refreshTable();
            }.bind(this);
        },

        deleteTgOnErrorHandlerProducer: function(targetGroup) {
            return function(errorMsg, xhr) {
                this.deleteTG.deleted.push([targetGroup, xhr.getStatus(), JSON.parse(xhr.getResponseText()).internalErrorCode]);
                this.refreshTable();
            }.bind(this);
        },

        refreshTable: function() {
            if(this.deleteTG.toDelete.length === this.deleteTG.deleted.length) {

                if (this.deletedTgSuccessCounter === this.deleteTG.toDelete.length) {
                    this.showNotification();
                } else {
                    //TODO: We can try refactor deletedTargetGroupsSummaryResultDialog to calculate deletedTgSuccessCounter itselve
                    this.deletedTargetGroupsSummaryResultDialog(this.deleteTG.deleted, this.deletedTgSuccessCounter);
                }

                this.getEventBus().publish('mainregion:refreshdata');

                // cleanup
                this.deleteTG.deleted = [];
                this.deleteTG.toDelete = [];
                this.deletedTgSuccessCounter = 0;
            }
        },

        deletedTargetGroupsSummaryResultDialog: function(statusArray, successCounter) {
            new ResponsesSummaryDialog({
                elementNameColumnHeader: Dictionary.targetMgmt.targetNameHeader,
                data: statusArray,
                errorCodes: Dictionary.errorCodes,
                successCounter: successCounter,
                header: (successCounter === 0) ? Dictionary.deleteTargetGroups.response.CannotDeletedTargetGroup : Dictionary.deleteTargetGroups.response.DeleteResults
            });
        },

        showNotification: function() {
            if(this.deleteTG.deleted.length !== 0) {
                var label;
                if(this.deleteTG.deleted.length > 1) {
                    label = Dictionary.deleteTargetGroups.notifications.deletedTargetGroups + this.deleteTG.deleted.length;
                } else {
                    label = Dictionary.deleteTargetGroups.notifications.deletedTargetGroup;
                }
                this.createNotification(label);
            }
        },

        createNotification: function(notificationLabel) {
            this.notification = new Notification({
                label: notificationLabel,
                color: "green",
                icon: "tick",
                showCloseButton: true,
                showAsGlobalToast: true,
                autoDismiss: true
            });
        },

        addFilteredClearEventHandler: function() {
            this.targetMgmtRegion.getTable().addEventHandler('filtered:clear', function(filter) {
                this.filterWidget.onFilteredClear();
            }.bind(this));
        }
    });

    function createFilterWidget() {
        return new FilterWidget({
            locationController: this.locationController,
            defaultValue: this.locationController.getParameter('filter')
        });
    }
});
