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
    'jscore/ext/utils/base/underscore',
    'jscore/ext/privateStore',
    'tablelib/Table',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/SmartTooltips',
    'tablelib/plugins/StickyScrollbar',
    'uit!./roleassigntablewidget.html',
    '../../../Dictionary',
    'usermgmtlib/cells/RoleNameCell',
    'usermgmtlib/cells/CheckboxCell',
    'identitymgmtlib/widgets/RoleTypeCell/RoleTypeCell',
    'usermgmtlib/cells/TGActionButtonsCell',
    'i18n/number',
    'identitymgmtlib/Utils',
    'usermgmtlib/widgets/AssignTGFlyout/AssignTGFlyout',
    'usermgmtlib/widgets/UnassignTGFlyout/UnassignTGFlyout',
    'usermgmtlib/Dictionary',
    'widgets/InfoPopup'
], function(apiContainer, core, __, PrivateStore, Table, SortableHeader, SmartTooltips, StickyScrollbar, View, Dictionary, RoleNameCell, CheckboxCell, RoleTypeCell, TGActionButtonsCell, i18nNumber, Utils, AssignTGFlyout, UnassignTGFlyout, UserLibDictionary, InfoPopup) {
    var _ = PrivateStore.create();

    var displayDataDefault = function() {

        displayData.call(this, {
            sort: {
                attribute: 'name',
                order: 'asc'
            }
        });
    };

    function getObjectLength(onject) {
        return _.values(onject).length;
    }


    function getTableContainer() {
        return this.view.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-tableContainer');
    }

    function getTableColumns(assign) {
        var columns = [{
            attribute: 'model',
            width: '30px',
            cellType:  CheckboxCell
        }, {
            title: Dictionary.roleTable.columns.name,
            attribute: 'name',
            width: '350px',
            cellType: RoleNameCell,
            sortable: true
        }, {
            title: Dictionary.roleTable.columns.type,
            attribute: 'type',
            cellType: RoleTypeCell,
            width: '150px',
            sortable: true
        }, {
            title: Dictionary.roleTable.columns.status,
            attribute: 'status',
            width: '100px',
            sortable: true
        }, {
            title: Dictionary.roleTable.columns.description,
            width: '300px',
            attribute: 'description'
        },
        {
            title: (assign===true ? Dictionary.roleTable.columns.tgsToAssign : Dictionary.roleTable.columns.tgsToUnassign),
            attribute: 'model',
            width: '190px',
            cellType:  TGActionButtonsCell
        }];
        return columns;
    }

    var displayData = function(params) {
        _(this).sort = (params && params.sort) || _(this).sort;
        _(this).filter = (params && params.filter) || _(this).filter;

        if (_(this).sort) {
            _(this).model.get('privileges').sort(_(this).sort.attribute, _(this).sort.order);
        }

        var data = null;
        if (_(this).filter) {
            data = _(this).model.get('privileges')
                .searchMap(_(this).filter.pattern, [_(this).filter.attribute])
                .toJSONwithModels();
        } else {
            data = _(this).model.get('privileges').toJSONwithModels();
        }

        updateTableHeader.call(this);
        this.table.setData(data);
        this.hideLoader();
        this.enableSearchInput();
    };

    var updateTableHeader = function() {
        var allNumber = this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-resultsRole-all');
        var assignedNumber = this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-resultsRole-assigned');

        var allText, assignedText, assignedValue;
        if (_(this).model.get('assign') === true) {
            allText = Dictionary.roleTable.available_roles;
            assignedText = Dictionary.roleTable.roles_to_assign;
            assignedValue = _(this).model.get('privileges').getAssigned().length;
        } else if (_(this).model.get('assign') === false) {
            allText = Dictionary.roleTable.assigned_roles;
            assignedText = Dictionary.roleTable.roles_to_unassign;
            assignedValue = (_(this).model.get('privileges').size() - _(this).model.get('privileges').getAssigned().length);
        }
        _(this).model.set('rolesToChangeCount', assignedValue);

        allNumber.setText(allText + ' (' + i18nNumber(_(this).model.get('privileges').size()).format('0,0') + ')');
        assignedNumber.setText(assignedText + ' (' + i18nNumber(assignedValue).format('0,0') + ')');
    };


    var tableRoleRefresh = function() {
        core.Window.addEventHandler('focus', function() {
            setTimeout(function() {
                //refresh roles in model after focus browser tab, roles are binded to table
                if (_(this).model.get('assign') !== false) {
                    console.log("refresh roles in model"); // TO REMOVE
                    _(this).model.get('privileges').fetch();
                }
            }.bind(this), 50);
        }.bind(this));
    };

    return core.Widget.extend({

        init: function(options) {
            _(this).model = options.model;
        },

        view: function() {
            return new View({
                tableHeaders: Dictionary.roleTable,
                searchPlaceholder: Dictionary.roleTable.searchPlaceholder,
                infoPopup: {
                    content: Dictionary.roleTable.infoPopup
                }
            });
        },

        onViewReady: function() {
            this.table = new Table({
                modifiers: [{
                    name: 'striped'
                }],
                plugins: [
                    new SortableHeader(),
                    new SmartTooltips(),
                    new StickyScrollbar()

                ],
                columns: getTableColumns(_(this).model.get('assign'))

            });
            this.table.attachTo(getTableContainer.call(this));
            this.getElement().setModifier('hide');
            tableRoleRefresh.call(this);

            _(this).model.fetch();

            _(this).model.addEventHandler('change:assign', function() {
                var assignSelectBoxValue = _(this).model.get('assign');
                if (assignSelectBoxValue === undefined) {
                    this.getElement().setModifier('hide');
                } else {
                    this.showLoader();
                    this.disableSearchInput();
                    this.getElement().removeModifier('hide');
                    this.updateView(assignSelectBoxValue);
                    this.handleRolesMode(assignSelectBoxValue);
                }
            }.bind(this));

            _(this).model.addEventHandler('fetched:privileges', function() {
                if (_(this).model.get('assign') === true) {
                    this.setAssignModeTable();
                } else if (_(this).model.get('assign') === false) {
                    this.setUnassignModeTable();
                }
            }.bind(this));

             _(this).model.addEventHandler("change:tgs", function() {
                 this.displayServiceTGsAndPropagate();
             }.bind(this));

             this.getServiceTGsButton().addEventHandler('click', function() {
                var operation = (_(this).model.get('assign') === true) ? AssignTGFlyout : UnassignTGFlyout;
                var title = (_(this).model.get('assign') === true) ? UserLibDictionary.targetGroupPanel.titleServiceTG : UserLibDictionary.targetGroupPanel.titleUnassignServiceTG;

                 operation.setEventBus(apiContainer.getEventBus());
                 operation.setModel(_(this).model);

                 apiContainer.getEventBus().publish("flyout:show", {
                     header: title,
                     content: operation,
                     width: "60vw"
                 });
             }.bind(this));

            this.tableLinksEventHandler();
            this.tableSearchEventHandler();
            this.tableSortEventHandler();

            // add event for collection when something changes to update header
            _(this).model.addEventHandler('change:privileges', function() {
                updateTableHeader.call(this);
            }.bind(this));

        },

        handleRolesMode: function(assignSelectBoxValue) {
            this.table.destroy();
            this.table = new Table({
                modifiers: [{
                    name: 'striped'
                }],
                plugins: [
                    new SortableHeader(),
                    new SmartTooltips(),
                    new StickyScrollbar()

                ],
                columns: getTableColumns(_(this).model.get('assign'))

            });
            this.table.attachTo(getTableContainer.call(this));
            this.tableSortEventHandler();
            if (assignSelectBoxValue === true) {
                _(this).model.fetch();
            } else if (assignSelectBoxValue === false) {
                this.getAssignedPrivilegesForUsers().then(function(privilegesAssigned) {
                    var rolesToSelect = [];
                    privilegesAssigned.forEach(function(privilege) {
                        if (__.indexOf(rolesToSelect,privilege.role ) === -1 ) {
                            rolesToSelect.push(privilege.role);
                        }
                    });

                    _(this).model.set('rolesToSelect', rolesToSelect);
                    _(this).model.set('privilegesAssigned', privilegesAssigned);
                    _(this).model.fetch({
                         remove: {
                             DISABLED: false,
                             DISABLED_ASSIGNMENT: false
                         }
                    });

                }.bind(this));
            }
        },

        getAssignedPrivilegesForUsers: function() {
            var prom = new Promise(function(resolve, reject) {
                var privilegesToSelectInTable = [];
                _(this).model.get('dataHandler')
                    .getData({ group: true })
                    .then(function(data) {
                        //var rolesToSelect = [];
                        data.forEach(function(user) {
                            user.privileges.forEach(function(privilege) {
                                if (__.indexOf(_(this).model.get('usersToGroupEdit'), user.username) > -1) {

                                    if ( !privilegesToSelectInTable.some (function(privilegeInTable) {
                                                return privilege.role === privilegeInTable.role && 
                                                       privilege.targetGroup === privilegeInTable.targetGroup;
                                    })) { 
                                        privilegesToSelectInTable.push( { role: privilege.role, targetGroup: privilege.targetGroup } );
                                    }

                                }
                            }.bind(this));
                        }.bind(this));
                        resolve(privilegesToSelectInTable);
                    }.bind(this), reject);
            }.bind(this));
            return prom;
        },

        setAssignModeTable: function() {
            _(this).model.get('privileges').each(function(model) {
                model.set('action', 'assign');
             }.bind(this));
            displayDataDefault.call(this);
        },

        setUnassignModeTable: function() {
//             var serviceTgs = [];

            _(this).model.get('privileges').each(function(model) {
                model.set('action', 'unassign');
                model.set('assigned', __.indexOf(_(this).model.get('rolesToSelect'), model.get('name')) > -1);

                // Add tgs
                tgs = [];
                var privilegesAssigned = _(this).model.get('privilegesAssigned').filter( function(privilege) { return privilege.role === model.get('name');});
                if ( privilegesAssigned.length !== 0 ) {
                    privilegesAssigned.forEach( function(privilege) { tgs.push(privilege.targetGroup);} );
                }
                if ( tgs.length !== 0 ) {
                    model.set('tgs', tgs );
                }
            }.bind(this));
//            this.setServiceTargetGroups(serviceTgs);
            // TODO Fare mergione e settare servicesTgs e poi settarlo sulla root

            var roleModels = _(this).model.get('privileges').map(function(model) {
                return model;
            });

            roleModels = roleModels.filter(function(model) {
                return !model.get('assigned');
            });

            _(this).model.get('privileges').removeModel(roleModels);

            displayDataDefault.call(this);
         },

         setServiceTargetGroups: function(tgs) {
             // I can have wrong configuration generated by REST.
             // In this case we fix incongruences
             if ( tgs.indexOf('ALL') > -1 ) {
                 tgs = ['ALL'];
             } else if ( tgs.length > 1 ) {
                 var index = tgs.indexOf('NONE');
                 if ( index !== -1 ) {
                     tgs.splice(index, 1);
                 }
             }

             if ( tgs.length > 0 ) {
                 _(this).model.setAttribute('tgs', tgs );
             } else {
                 _(this).model.setAttribute('tgs', ['ALL'] ); // Default for Service TGs
             }
         },


        tableLinksEventHandler: function() {

            this.getSelectAllRolesLink().addEventHandler('click', function() {
                if (_(this).model.get('assign') === true) {
                    _(this).model.get('privileges').assignAllPrivileges();
                } else if (_(this).model.get('assign') === false) {
                    _(this).model.get('privileges').unassignAllPrivileges();
                }
            }.bind(this));

            this.getSelectNoneRolesLink().addEventHandler('click', function() {
                if (_(this).model.get('assign') === true) {
                    _(this).model.get('privileges').unassignAllPrivileges();
                } else if (_(this).model.get('assign') === false) {
                    _(this).model.get('privileges').assignAllPrivileges();
                }
            }.bind(this));
        },


        tableSearchEventHandler: function() {
            this.getSearchInput().addEventHandler('input', function() {

                this.showLoader();
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }

                this.timeout = setTimeout(function() {
                    displayData.call(this, {
                        filter: {
                            attribute: 'name',
                            pattern: new RegExp(this.getSearchInput().getValue(), 'i')
                        }
                    });
                }.bind(this), 500);
            }.bind(this));

        },

        tableSortEventHandler: function() {

            // this.view.findById('rolePrivilegsTable')
            this.table.addEventHandler('sort', function(order, attribute) {
                displayData.call(this, {
                    sort: {
                        order: order,
                        attribute: attribute === 'type' ? 'roleTypeDisplayed' : attribute
                    }
                });
            }.bind(this));
        },


        showLoader: function() {
            this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-loader-overlay').setModifier('show');
        },

        hideLoader: function() {
            this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-loader-overlay').removeModifier('show');
        },

        enableSearchInput: function() {
            this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-filter-search').removeAttribute('disabled');
        },

        disableSearchInput: function() {
            this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-filter-search').setAttribute('disabled', 'disabled');
        },

        getSelectAllRolesLink: function() {
            return this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-filter-assign-roles-link-all');
        },

        getSelectNoneRolesLink: function() {
            return this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-filter-assign-roles-link-none');
        },

        getSearchInput: function() {
            return this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-filter-search');
        },

        getRoleTitle: function() {
            return this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-title');
        },

        hideCreateRole: function() {
            this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-createRole').setModifier('hide');
        },

        showCreateRole: function() {
            this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-createRole').removeModifier('hide');
        },

        getServiceTGsButton: function() {
            return this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-actions-serviceTGs');
        },

        updateView: function(assign) {
            var infoPopupWidget = this.view.findById('rolePrivilegsInfoPopup');

            if (assign === true) {
               this.showCreateRole();
               this.getRoleTitle().setText(Dictionary.roleTable.title);
               infoPopupWidget.setContent(Dictionary.roleTable.infoPopup);

               this.getSelectAllRolesLink().setText(Dictionary.roleTable.all);
               this.getSelectNoneRolesLink().setText(Dictionary.roleTable.none);
            } else if (assign === false) {
               this.hideCreateRole();
               this.getRoleTitle().setText(Dictionary.roleTable.titleToUnassign);
               infoPopupWidget.setContent(Dictionary.roleTable.infoPopupUnassign);

               this.getSelectAllRolesLink().setText(Dictionary.roleTable.none);
               this.getSelectNoneRolesLink().setText(Dictionary.roleTable.clearSelection);
            }
            this.displayServiceTGsAndPropagate();
        },

        displayServiceTGsAndPropagate: function() {
            if ( _(this).model.get('assign') === true) {
                this.getServiceTGsButton().removeModifier('hide');
                if ( _(this).model.get('serviceTgsChanged') ) {

                    this.getServiceTGsButton().setText(Utils.printf(Dictionary.roleTable.service_target_groupsToAssign, Utils.getAssignedTgsValue.call(this, _(this).model ) ));
                } else {
                    this.getServiceTGsButton().setText(Utils.printf(Dictionary.roleTable.service_target_groupsToAssign, "-" ));
                }

                if ( this.infoPopup ) {
                    this.infoPopup.detach();
                }

                this.infoPopup = new InfoPopup({
                    icon: 'warning',
                    content: UserLibDictionary.targetGroupPanel.tbacWarningMessage
                });
                this.infoPopup.attachTo(this.getElement().find('.eaUsersgroupedit-wRoleAssignTableWidget-actions-info'));

            } else {
//                this.getServiceTGsButton().setText(Utils.printf(Dictionary.roleTable.service_target_groupsToUnassign, Utils.getAssignedTgsValue.call(this, _(this).model ) ));
                this.getServiceTGsButton().setModifier('hide');

                if ( this.infoPopup ) {
                    this.infoPopup.detach();
                }
            }

            // Propagate change
            _(this).model.get('privileges').each(function(privilege) {
                if ( Utils.isServiceRole(privilege) ) {
                    privilege.setAttribute('tgs', _(this).model.get('tgs') );

                    if (  _(this).model.get('serviceTgsChanged' )) {
                        privilege.setAttribute('tgsChanged', true );
                    } else {
                        privilege.removeAttribute('tgsChanged' );
                    }
                }

            }.bind(this));
        }
    });

 });
