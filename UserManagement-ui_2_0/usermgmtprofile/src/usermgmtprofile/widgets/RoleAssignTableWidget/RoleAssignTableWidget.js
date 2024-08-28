/*******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************/

define([
    'container/api',
    'jscore/core',
    'jscore/ext/privateStore',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/QuickFilter',
    'tablelib/plugins/SmartTooltips',
    'tablelib/plugins/StickyScrollbar',
    'uit!./roleassigntablewidget.html',
    'usermgmtlib/cells/CheckboxIconCell',
    'usermgmtlib/cells/RoleNameCell',
    'usermgmtlib/cells/RoleStatusCell',
    'usermgmtlib/cells/TGActionButtonsCell',
    'usermgmtlib/model/RolePrivilegesCollection',
    'usermgmtlib/widgets/AssignTGFlyout/AssignTGFlyout',
    'identitymgmtlib/widgets/RoleTypeCell/RoleTypeCell',
    'identitymgmtlib/Utils',
    'i18n!identitymgmtlib/common.json',
    'usermgmtlib/Dictionary',
    'i18n/number',
    'widgets/InfoPopup'
], function(apiContainer, core, PrivateStore, SortableHeader, ResizableHeader, QuickFilter, SmartTooltips, StickyScrollbar, View, CheckboxIconCell, RoleNameCell, RoleStatusCell, TGActionButtonsCell, RolePrivilegesCollection, AssignTGFlyout, RoleTypeCell,  Utils, IdentityDictionary, Dictionary, i18nNumber, InfoPopup) {

    var _ = PrivateStore.create();

    var displayData = function(params) {

        if (_(this).model.get('privileges').assignedPrivilegesRemoved) {
            this.getElement().find('.eaUsermgmtprofile-role-duplicate-info').setModifier("show_true");
        } else {
            this.getElement().find('.eaUsermgmtprofile-role-duplicate-info').removeModifier("show_true");
        }

        _(this).sort = (params && params.sort) || _(this).sort || {
            order: 'asc',
            attribute: 'name'
        };
        _(this).filter = (params && params.filter) || _(this).filter || {
            pattern: '',
            attribute: 'name'
        };

        _(this).rolePrivilegesCollection.sort(_(this).sort.attribute, _(this).sort.order);

        _(this).rolePrivilegesCollection.each( function( privilege ) {
            privilege.setAttribute('tgsChanged', true );
        });

        var data = _(this).rolePrivilegesCollection;

        if ( this.filters && this.filters.length > 0 ) {
            var objectFiltersToApply = [];

            // First apply text filters
            this.filters.forEach(function (item, index) {
                if ( item.attribute === 'model' || item.attribute === 'type' || item.attribute === 'status' ) {
                    objectFiltersToApply.push(item);
                } else {
                    data = data.searchMap( item.pattern, [item.attribute]);
                }
            });
            data = data.toJSONwithModels();

            // Now apply object filters

            if ( objectFiltersToApply.length > 0 ) {
                objectFiltersToApply.forEach(function (item, index) {
                    if ( item.attribute === 'model') {
                        if ( item.pattern.value === "Assigned"  ) {
                            data = data.filter( function(el) {
                                return el.assigned === true;
                            });
                        }

                        if ( item.pattern.value === "NotAssigned"  ) {
                            data = data.filter( function(el) {
                                return ( (typeof el.assigned === 'undefined') || el.assigned === false);
                            });
                        }
                    } else if ( item.attribute === 'type' || item.attribute === 'status' ) {
                        var listToFilter = [];

                        item.pattern.forEach(function (pItem, pIndex) {
                            if ( pItem.value === "application_system" ) {
                               listToFilter.push("application", "system");
                            } else {
                                listToFilter.push(pItem.value);
                            }
                        });

                        if ( listToFilter.length > 0 ) {
                            data = data.filter( function(el) {
                                return listToFilter.includes(item.attribute === 'type'? el.type : el.status);
                            });
                        }
                    }

                });
            }
        } else {
            data = data.searchMap(_(this).filter.pattern, [_(this).filter.attribute])
                .toJSONwithModels();
        }

        updateTableHeader.call(this);
        this.view.findById('rolePrivilegsTable').setData(data);
        this.hideLoader();
    };

    var updateTableHeader = function() {
        var allNumber = this.view.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-resultsRole-all');
        var assignedNumber = this.view.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-resultsRole-assigned');

        allNumber.setText(Utils.printf(Dictionary.roleTable.roles2 , i18nNumber(_(this).rolePrivilegesCollection.size()).format('0,0')));
        assignedNumber.setText(Utils.printf(Dictionary.roleTable.roles_assigned2, i18nNumber(_(this).rolePrivilegesCollection.getAssigned().length).format('0,0')));

        this.evaluateServiceTgAssignButtonState();
        this.displayServiceTGsAndPropagate();
    };



    return core.Widget.extend({

        init: function(options) {
            _(this).model = options.model;
            _(this).rolePrivilegesCollection = _(this).model.get('privileges');
            _(this).rolePrivilegesCollection.addEventHandler('fetched', function() {

                displayData.call(this, {
                });
            }.bind(this));
        },

        view: function() {
            return new View({
                tableHeaders: IdentityDictionary.roleTable,
                duplicateMessage: Dictionary.duplicate_message_text,
                searchPlaceholder: Dictionary.roleTable.searchPlaceholder,
                infoPopup: {
                    content: Dictionary.roleTable.infoPopup
                },
                tableOptions: {
                    modifiers: [{
                        name: 'striped'
                    }],
                    plugins: [
                        new SortableHeader(),
                        new SmartTooltips(),
                        new StickyScrollbar(),
                        new ResizableHeader(),
                        new QuickFilter({visible: true})
                    ],

                    columns: [{
                        attribute: 'model',
                        width: '100px',
                        cellType: CheckboxIconCell,
                        resizable: true,
                        filter: {
                            type: 'select',
                            options: {
                                value: { name: Dictionary.filters.all, value: "All" },
                                items: [
                                    {name: Dictionary.filters.all, value: "All"},
                                    {name: Dictionary.assigned, value: "Assigned"},
                                    {name: Dictionary.notAssigned, value: "NotAssigned"}]
                                  }
                        }
                    }, {
                        title: IdentityDictionary.roleTable.columns.name,
                        attribute: 'name',
                        width: '350px',
                        cellType: RoleNameCell,
                        resizable: true,
                        sortable: true,
                        filter: {
                            type: 'text',
                            options: {
                                submitOn: 'input',
                                placeholder: Dictionary.filterPlaceHolder
                            }
                        }
                    }, {
                        title: IdentityDictionary.roleTable.columns.type,
                        attribute: 'type',
                        cellType: RoleTypeCell,
                        width: '150px',
                        resizable: true,
                        sortable: true,
                        filter: {
                            type: 'multi-select',
                            options: {
                                items:  [
                                    {name: IdentityDictionary.typeCell.RoleTypeCom, value: "com"},
                                    {name: IdentityDictionary.typeCell.RoleTypeAlias, value: "comalias"},
                                    {name: IdentityDictionary.typeCell.RoleTypeCustom, value: "custom"},
                                    {name: IdentityDictionary.typeCell.RoleTypeSystem, value: "application_system"},
                                    {name: IdentityDictionary.typeCell.RoleTypeCpp, value: "cpp"}
                                        ]
                            }
                        }
                    }, {
                        title: IdentityDictionary.roleTable.columns.status,
                        attribute: 'status',                        
                        width: '150px',
                        cellType: RoleStatusCell,
                        resizable: true,
                        sortable: true,
                        filter: {
                            type: 'multi-select',
                            options: {
                                items:  [
                                    {name: Dictionary.enabled, value: "ENABLED"},
                                    {name: Dictionary.disabled, value: "DISABLED"},
                                    {name: Dictionary.notAssignable, value: "DISABLED_ASSIGNMENT"}
                                        ]
                            }
                        }
                    }, {
                        title: IdentityDictionary.roleTable.columns.description,
                        width: '400px',
                        attribute: 'description',
                        resizable: true,
                        filter: {
                            type: 'text',
                            options: {
                                submitOn: 'input',
                                placeholder: Dictionary.filterPlaceHolder
                            }
                        }
                    }, {
                        title: IdentityDictionary.roleTable.columns.tgs,
                        attribute: 'model',
                        width: '190px',
                        cellType: TGActionButtonsCell,
                        resizable: true
                    }]
                }
            });
        },

        setValid: function() {
            var notificationContainer = this.view.getElement().find('.eaUsermgmtprofile-role-error');
            notificationContainer.removeModifier("show");
        },

        setInvalid: function(result) {
            var notificationTextElement = this.view.getElement().find('.eaUsermgmtprofile-role-error-message');
            notificationTextElement.setText(result.message);

            var notificationContainer = this.getElement().find('.eaUsermgmtprofile-role-error');
            notificationContainer.setModifier("show");
        },

        showLoader: function() {
            this.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-loader-overlay').setModifier('show');
        },

        hideLoader: function() {
            this.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-loader-overlay').removeModifier('show');
        },

        evaluateServiceTgAssignButtonState: function() {
            var assignedServiceTGS = this.view.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-actions-serviceTGs');
            var buttonEnabled = false;
            _(this).rolePrivilegesCollection.each(function(privilege) {
                if (Utils.isServiceRole(privilege) && privilege.get('assigned') === true) {
                    buttonEnabled = true;
                }
            }.bind(this));
            if (buttonEnabled === false) {
                assignedServiceTGS.setAttribute('disabled', 'disabled');
            }
            else {
                assignedServiceTGS.removeAttribute('disabled');
            }
        },

        displayServiceTGsAndPropagate: function() {
            var assignedServiceTGS = this.view.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-actions-serviceTGs');
            var serviceTGSinfo = this.view.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-actions-info');
            assignedServiceTGS.setStyle("visibility", "visible");
            serviceTGSinfo.setStyle("visibility", "visible");
            assignedServiceTGS.setText(Utils.printf(Dictionary.roleTable.service_target_groups1, Utils.getAssignedTgsValue.call(this, _(this).model ) ));

            _(this).model.set('serviceTgsChanged', true);

            // Propagate change
            _(this).model.privilegesCollection.each(function(privilege) {
                //var assigned = privilege.getAttribute('assigned');
                if ( /*assigned === true && */Utils.isServiceRole(privilege) ) {
                    privilege.setAttribute('tgs', _(this).model.get('tgs') );
                    privilege.setAttribute('tgsChanged', true );
                }
            }.bind(this));
        },

        onTableFilter: function (filters) {
            this.showLoader();
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(function() {
                var pattern;
                this.filters = [];
                for(var k in filters) {
                    if ( typeof filters[k] === 'object' ) {
                        pattern = filters[k];
                        this.filters.push({ attribute: k, pattern: pattern });
                    } else if ( filters[k] !== "" ) {
                         pattern = new RegExp(  filters[k], 'i');
                        this.filters.push({attribute: k, pattern: pattern });
                    }
                }
                displayData.call(this, {});
            }.bind(this), 500);
        },

        onViewReady: function() {
            _(this).rolePrivilegesCollection.addEventHandler('fetch:start', function() {
                this.showLoader();
            }.bind(this));

            _(this).model.addEventHandler('valid:privileges', this.setValid.bind(this));
            _(this).model.addEventHandler('invalid:privileges', this.setInvalid.bind(this));

            var selectAllRoles = this.view.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-resultsRole-assignAllRoles-link');
            selectAllRoles.addEventHandler('click', function() {
                _(this).rolePrivilegesCollection.assignAllPrivileges();
            }.bind(this));

            var selectNoneRoles = this.view.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-resultsRole-unassignAllRoles-link');
            selectNoneRoles.addEventHandler('click', function() {
                _(this).rolePrivilegesCollection.unassignAllPrivileges();
            }.bind(this));

            // add sort event
            this.view.findById('rolePrivilegsTable').addEventHandler('sort', function(order, attribute) {
                displayData.call(this, {
                    sort: {
                        order: order,
                        attribute: attribute === 'type' ? 'roleTypeDisplayed' : attribute
                    }
                });
            }.bind(this));

            this.view.findById('rolePrivilegsTable').addEventHandler('filter:change', this.onTableFilter.bind(this));

            // add event for collection when something changes to update header
            _(this).rolePrivilegesCollection.addEventHandler('change:assigned', function() {
                updateTableHeader.call(this);
            }.bind(this));

            _(this).model.addEventHandler("change:tgs", function() {
                this.displayServiceTGsAndPropagate();
            }.bind(this));

            var serviceTgAssignBtn = this.view.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-actions-serviceTGs');
            serviceTgAssignBtn.addEventHandler('click', function() {

                AssignTGFlyout.setEventBus(apiContainer.getEventBus());
                AssignTGFlyout.setModel(_(this).model);

                apiContainer.getEventBus().publish("flyout:show", {
                    header: Dictionary.targetGroupPanel.titleServiceTG,
                    content: AssignTGFlyout,
                    width: "60vw"
                });

            }.bind(this));

            if ( this.infoPopup ) {
                this.infoPopup.detach();
            }

            this.infoPopup = new InfoPopup({
                icon: 'warning',
                content: Dictionary.targetGroupPanel.tbacWarningMessage
            });
            this.infoPopup.attachTo(this.getElement().find('.eaUsermgmtprofile-wRoleAssignTableWidget-actions-info'));
        }

    });
});
