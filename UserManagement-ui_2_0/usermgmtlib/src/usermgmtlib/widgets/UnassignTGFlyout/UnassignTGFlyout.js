/*global define */
define([
    'jscore/core',
    'jscore/ext/net',
    "jscore/ext/utils/base/underscore",
    './UnassignTGFlyoutView',
    'identitymgmtlib/widgets/ListBuilder',
    '../../Dictionary',
    'widgets/InfoPopup',
    'usermgmtlib/services/UserManagementService',
    'identitymgmtlib/Utils'
], function(core, net, _, View, ListBuilder, Dictionary, InfoPopup, UserManagementService, Utils) {
    'use strict';

    var UnassignTGWidget = core.Widget.extend({
        eventBus: null,
        model: null,
        roleTGAssigned: [],

        view: function() {
            return new View({ i18n: Dictionary.flyoutPanel });
        },


        onViewReady: function(options) {
            this.addEventHandlers();
        },

        addEventHandlers: function() {
            this.handleClickApply();
            this.handleClickCancel();
        },

        setEventBus: function(bus) {
            this.eventBus = bus;
        },

        setModel: function(model) {
            this.model = model;
            this.isServiceRole = Utils.isServiceRole(model);

            if ( model.get('tgs') ) {
                this.roleTGAssigned = model.get('tgs').filter(function(tg) {
                    return tg !== 'NONE';
                });
            }

            this.roleTGToUnassign = model.get('tgsToUnassign');
            if (this.roleTGToUnassign === undefined) {
                this.roleTGToUnassign = [];
            }

            if( !Utils.isServiceRole(model) ) {
                //panel should be read-only for disabled and non-assignable roles
                this.setNoDisabledRadioboxes(this.model.get('status'));

                this.view.getRoleNameLabel().setText(Dictionary.flyoutPanel.roleName + ":");

                if ( this.model.get('name') !== undefined ) {
                    this.view.getRoleNameContainer().setText(model.get('name'));
                }
            } else {
                this.view.getRoleNameLabel().setText("");
                this.view.getRoleNameContainer().setText("");
            }

            if (this.listBuilder) {
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
                        title: Dictionary.flyoutPanel.source.titleToUnassign
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
                    items: this.roleTGAssigned,
                    filter: {
                        caseSensitive: false // default true
                    },
                    labels: {
                        filter: Dictionary.flyoutPanel.destination.filter,
                        title: Dictionary.flyoutPanel.destination.title
                    }
                },
               enabled: (Utils.isServiceRole(model) ? true : model.get('status') === "ENABLED")
            });

            this.listBuilder.attachTo(this.view.getListContainer());
        },

        handleClickApply: function() {
            this.view.getApplyButton().addEventHandler('click', function() {
                this.model.set('tgs', this.listBuilder.getDestinationItemsIds());
                this.model.set('tgsToUnassign', this.allRoleTG.filter(function (tg) { return this.listBuilder.getDestinationItemsIds().indexOf(tg)===-1;}.bind(this)));
                
                this.eventBus.publish("flyout:hide");
                this.trigger("close");

                this.view.getErrorBox().removeModifier("displayed");
            }.bind(this));
        },

        handleClickCancel: function() {
            this.view.getCancelButton().addEventHandler('click', function() {

                this.view.getErrorBox().removeModifier("displayed");
                this.eventBus.publish("flyout:hide");
                this.trigger("close");

            }.bind(this));
        },

        //remove disable from radio boxes - clear after close
        // disabled or non-assignabled role
        setNoDisabledRadioboxes: function(status) {
            if (status === "ENABLED") {
                this.view.getApplyButton().removeAttribute('disabled');
            } else {
                this.view.getApplyButton().setAttribute('disabled', 'disabled');
            }
        },

        getAllTargetGroups: function(resolve, error) {
            return new Promise(function() {
                this.allRoleTG = this.roleTGToUnassign.concat(this.roleTGAssigned);
                var allTargetGroups = this.allRoleTG.map(function(tg) {
                                        return {
                                                id: tg,
                                                label: tg,
                                                parent: null,
                                                locked: false,
                                                children: undefined
                                    };
                            });
                resolve(allTargetGroups);
            }.bind(this)).catch(error);
        }
    });
    return new UnassignTGWidget();
});
