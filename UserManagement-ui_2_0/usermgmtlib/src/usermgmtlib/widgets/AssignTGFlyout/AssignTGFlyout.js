/*global define */
define([
    'jscore/core',
    'jscore/ext/net',
    "jscore/ext/utils/base/underscore",
    './AssignTGFlyoutView',
    'identitymgmtlib/widgets/ListBuilder',
    '../../Dictionary',
    'widgets/InfoPopup',
    'usermgmtlib/services/UserManagementService',
    'identitymgmtlib/Utils'
], function(core, net, _, View, ListBuilder, Dictionary, InfoPopup, UserManagementService, Utils) {
    'use strict';

    var AssignTGWidget = core.Widget.extend({
        eventBus: null,
        model: null,
        roleTGArrayDest: null,

        view: function() {
            return new View({ i18n: Dictionary });
        },


        onViewReady: function(options) {
            this.addEventHandlers();

            this.infoPopup = new InfoPopup({
                content: Dictionary.flyoutPanel.newRoleInfoPopup
            });
            
            this.infoPopup.attachTo(this.view.getInfoPopupContainer());
        },

        addEventHandlers: function() {
            this.handleClickApply();
            this.handleClickCancel();
            this.handleRadioButtons();
        },

        setEventBus: function(bus) {
            this.eventBus = bus;
        },

        setModel: function(model) {
            this.model = model;
            this.isServiceRole = Utils.isServiceRole(model);

            var flag_ALL_NONE = true;
            if ( !model.get('tgs') ) {
                this.view.getTgAllRadio().setProperty('checked', true);
                this.view.getTgNoneRadio().setProperty('checked', false);
                this.view.getManualTgRadio().setProperty('checked', false);

                this.setNoDisabledRadioboxes( "ENABLED", true );

            } else {
                this.roleTGArrayDest = model.get('tgs').filter(function(tg) {
                    return tg !== 'ALL' && tg !== 'NONE';
                });

                flag_ALL_NONE = model.get('tgs').indexOf('ALL') !== -1 ? "ALL" :
                    (model.get('tgs').indexOf('NONE') !== -1 ? "NONE" : false);

                if (flag_ALL_NONE === "ALL") {
                    this.view.getTgAllRadio().setProperty('checked', true);
                    this.view.getTgNoneRadio().setProperty('checked', false);
                    this.view.getManualTgRadio().setProperty('checked', false);
                } else if (flag_ALL_NONE === "NONE") {
                    this.view.getTgAllRadio().setProperty('checked', false);
                    this.view.getTgNoneRadio().setProperty('checked', true);
                    this.view.getManualTgRadio().setProperty('checked', false);
                } else {
                    this.view.getTgAllRadio().setProperty('checked', false);
                    this.view.getTgNoneRadio().setProperty('checked', false);
                    this.view.getManualTgRadio().setProperty('checked', true);
                }

                //panel should be read-only for disabled and non-assignable roles
                this.setNoDisabledRadioboxes(this.model.get('status'), this.isServiceRole);

            }

            if( !Utils.isServiceRole(model) ) {
                this.view.getRoleNameLabel().setText(Dictionary.flyoutPanel.roleName + ":");

                if ( this.model.get('name') !== undefined ) {
                    this.view.getRoleNameContainer().setText(model.get('name'));
                }
                this.view.getInlineMessageHolder().setModifier("hide");
            } else {
                this.view.getRoleNameLabel().setText("");
                this.view.getRoleNameContainer().setText("");
                this.view.getInlineMessageHolder().removeModifier("hide");
            }

            if (this.listBuilder) {
                this.listBuilder.detach();
                this.listBuilder.destroy();
            }
            this.listBuilder = new ListBuilder({
                getData: this.getAllTargetGroups.bind(this),
                source: {
                    filter: {
                        caseSensitive: false // default true
                    },
                    labels: {
                        filter: Dictionary.flyoutPanel.source.filter,
                        title: Dictionary.flyoutPanel.source.title
                    }
                },
                menu: {
                    labels: {
                        // i18n API
                        add: Dictionary.flyoutPanel.add,
                        addAll: Dictionary.flyoutPanel.addAll,
                        remove: Dictionary.flyoutPanel.remove,
                        removeAll: Dictionary.flyoutPanel.removeAll
                    }
                },
                destination: {
                    items: (this.roleTGArrayDest ? this.roleTGArrayDest : []),
                    filter: {
                        caseSensitive: false // default true
                    },
                    labels: {
                        filter: Dictionary.flyoutPanel.destination.filter,
                        title: Dictionary.flyoutPanel.destination.title
                    }
                },
                enabled: !flag_ALL_NONE && (model.get('status') === "ENABLED" || this.isServiceRole )
            });

            this.listBuilder.attachTo(this.view.getListContainer());
        },

        handleClickApply: function() {
            this.view.getApplyButton().addEventHandler('click', function() {
                if ( Utils.isServiceRole(this.model) ) {
                    this.model.set('serviceTgsChanged', true);
                } else {
                    this.model.set('tgsChanged', true);
                }

                var noValid = 0;

                //in case when user select option ALL || NONE
                if (this.view.getTgAllRadio().getProperty('checked')) {
                    this.model.set('tgs', ["ALL"]);
                } else if (this.view.getTgNoneRadio().getProperty('checked')) {
                    this.model.set('tgs', ["NONE"]);
                } else {
                    if (this.listBuilder.getDestinationItemsIds().length > 0) {
                        this.model.set('tgs', this.listBuilder.getDestinationItemsIds());
                    } else {
                        noValid = 1;
                        this.view.getErrorBox().setModifier("displayed");
                        this.view.getErrorMessageBox().setText(Dictionary.flyoutPanel.tgAssignListEmptyFlyoutPanelErrorMessage);
                    }
                }

                if (noValid === 0) {

                    /*var data = this.dataTable.getData();
                    this.dataTable.setData(data);

                    var eventData = {
                        tableData: this.dataTable.getData(),
                        rowNumber: this.dataTable.getData().indexOf(this.roleTGObj)
                    };

                    this.dataTable.trigger('formChange', eventData);*/

                    this.eventBus.publish("flyout:hide");
                    this.trigger("close");

                    this.view.getErrorBox().removeModifier("displayed");
                }

            }.bind(this));
        },

        handleClickCancel: function() {
            this.view.getCancelButton().addEventHandler('click', function() {

                this.view.getErrorBox().removeModifier("displayed");
                this.eventBus.publish("flyout:hide");
                this.trigger("close");

            }.bind(this));
        },

        handleRadioButtons: function() {
            this.view.getErrorBox().removeModifier("displayed");

            this.view.getTgAllRadio().addEventHandler('click', function() {
                this.listBuilder.setEnabled(false);
            }.bind(this));

            this.view.getTgNoneRadio().addEventHandler('click', function() {
                this.listBuilder.setEnabled(false);
            }.bind(this));

            this.view.getManualTgRadio().addEventHandler('click', function() {
                this.listBuilder.setEnabled(true);
            }.bind(this));
        },

        //remove disable from radio boxes - clear after close
        // disabled or non-assignabled role
        setNoDisabledRadioboxes: function(status, isServiceRole) {
            if (status === "ENABLED" || isServiceRole ) {
                this.view.getTgNoneRadio().removeAttribute('disabled');
                this.view.getTgAllRadio().removeAttribute('disabled');

                this.view.getApplyButton().removeAttribute('disabled');
            } else {
                this.view.getTgNoneRadio().setAttribute('disabled', 'disabled');
                this.view.getTgAllRadio().setAttribute('disabled', 'disabled');
                this.view.getManualTgRadio().setAttribute('disabled', 'disabled');

                this.view.getApplyButton().setAttribute('disabled', 'disabled');
            }

        },

        getAllTargetGroups: function(success, error) {
            UserManagementService.getAllTargetGroups().then(function(data) {

                var allTargetGroups = data.filter(function(tg) {
                    return tg.name !== 'ALL' && tg.name !== 'NONE';
                }).map(function(tg) {
                    return {
                        id: tg.name,
                        label: tg.name,
                        parent: null,
                        locked: false,
                        children: undefined
                    };
                });
                success(allTargetGroups);

                if ((this.model.get('status') === "ENABLED" || this.isServiceRole ) && !_.isEmpty(allTargetGroups)) {
                    this.view.getManualTgRadio().removeAttribute('disabled');
                }

            }.bind(this)).catch(error);
        }

    });

    return new AssignTGWidget();
});
