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
    'jscore/core',
    'widgets/Tabs',
    './CustomRoleDetailsView',
    'i18n!rolemgmtlib/dictionary.json',
    'identitymgmtlib/RoleMgmtTable',
    'tablelib/plugins/Selection',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/StickyHeader',
    'tablelib/plugins/SecondHeader',
    'identitymgmtlib/FilterByStringHeaderCell',
    'identitymgmtlib/widgets/RoleTypeCell/RoleTypeCell'
], function(core, Tabs, View, Dictionary, Table, Selection, SortableHeader, ResizableHeader, StickyHeader, SecondHeader, FilterByStringHeaderCell, RoleTypeCell) {

    return core.Widget.extend({

        init: function() {
            this.model = this.options.model;
            this.roles = this.options.roles;
            this.policy = this.options.policy;
            this.isEditable = this.options.action === 'display' ? false : true;
        },

        view: function() {
            return new View(Dictionary);
        },

        onViewReady: function() {
            // create roles table
            if (this.rolesList) {
                this.rolesList.destroy();
            }
            this.rolesList = this.createRolesList();

            if (this.taskProfilesList) {
                this.taskProfilesList.destroy();
            }
            this.taskProfilesList = this.createTaskProfilesList();

            // create capabilities table
            if (this.capabilitiesList) {
                this.capabilitiesList.destroy();
            }
            this.capabilitiesList = this.createCapabilitiesList();

            var tabsWidget = new Tabs({
                enabled: true,
                maxTabs: 3,
                tabs: [{
                    title: Dictionary.customRoleDetails.capabilities_tab_title,
                    content: this.capabilitiesList
                }, {
                    title: Dictionary.customRoleDetails.custom_role_tab_title,
                    content: this.rolesList
                }, {
                    title: Dictionary.customRoleDetails.task_profile_role_tab_title,
                    content: this.taskProfilesList
                }]
            });

            tabsWidget.attachTo(this.getElement());
        },

        createRolesList: function() {

            var table = new Table({
                title: Dictionary.customRoleDetails.role_tab_title,
                url: '/oss/idm/rolemanagement/roles',
                fetchErrorHeader: Dictionary.customRoleDetails.fetch_roles_error_header,
                fetchErrorContent: Dictionary.customRoleDetails.fetch_roles_error_content,
                selectedCaption: Dictionary.customRoleDetails.selected_caption,
                unique_key: 'name',
                tooltips: true,
                // TODO: move these settings to RoleMgmtTable when merged with ComRoleAlias
                plugins: [
                    new SortableHeader(),
                    new ResizableHeader(),
                    new StickyHeader({
                        topOffset: 32
                    }),
                    new SecondHeader(),
                    new Selection({
                        checkboxes: this.isEditable,
                        selectableRows: this.isEditable,
                        multiselect: this.isEditable,
                        bind: this.isEditable
                    })
                ],
                //rowsToSelect: [{'name' : 'COM_ROLE1_Seq'}],
                defaultFilter: function(element) { return element.type === 'com'; },
                columns: [{
                    title: Dictionary.customRoleDetails.roles_name,
                    attribute: 'name',
                    width: '400px',
                    secondHeaderCellType: FilterByStringHeaderCell,
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.customRoleDetails.roles_type,
                    attribute: 'type',
                    width: '400px',
                    secondHeaderCellType: FilterByStringHeaderCell,
                    sortable: true,
                    resizable: true,
                    cellType: RoleTypeCell
                }, {
                    title: Dictionary.customRoleDetails.roles_description,
                    attribute: 'description',
                    secondHeaderCellType: FilterByStringHeaderCell,
                    sortable: true,
                    resizable: true
                }]
            });

            table.getTable().addEventHandler('rowselectend', this.updateRolesList.bind(this));

            if( ! this.isEditable) {
                this.rolesHandlerId = table.addEventHandler('pageload', this.removeRolesNotInModel.bind(this));
            }

            return table;
        },

        createTaskProfilesList: function() {

            var table = new Table({
                title: Dictionary.customRoleDetails.task_profile_role_tab_title,
                url: '/oss/idm/rolemanagement/roles',
                fetchErrorHeader: Dictionary.customRoleDetails.fetch_roles_error_header,
                fetchErrorContent: Dictionary.customRoleDetails.fetch_roles_error_content,
                selectedCaption: Dictionary.customRoleDetails.selected_caption,
                unique_key: 'name',
                tooltips: true,
                // TODO: move these settings to RoleMgmtTable when merged with ComRoleAlias
                plugins: [
                    new SortableHeader(),
                    new ResizableHeader(),
                    new StickyHeader({
                        topOffset: 32
                    }),
                    new SecondHeader(),
                    new Selection({
                        checkboxes: this.isEditable,
                        selectableRows: this.isEditable,
                        multiselect: this.isEditable,
                        bind: this.isEditable
                    })
                ],
                //rowsToSelect: [{'name' : 'COM_ROLE1_Seq'}],
                defaultFilter: function(element) { return element.type === 'cpp'; },
                columns: [{
                    title: Dictionary.customRoleDetails.roles_name,
                    attribute: 'name',
                    width: '400px',
                    secondHeaderCellType: FilterByStringHeaderCell,
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.customRoleDetails.roles_type,
                    attribute: 'type',
                    width: '400px',
                    secondHeaderCellType: FilterByStringHeaderCell,
                    sortable: true,
                    resizable: true,
                    cellType: RoleTypeCell
                }, {
                    title: Dictionary.customRoleDetails.roles_description,
                    attribute: 'description',
                    secondHeaderCellType: FilterByStringHeaderCell,
                    sortable: true,
                    resizable: true
                }]
            });

            table.getTable().addEventHandler('rowselectend', this.updateTaskProfilesList.bind(this));

            if( ! this.isEditable) {
                //this.rolesHandlerId = table.addEventHandler('pageload', this.removeTaskProfilesNotInModel.bind(this));
                this.taskProfilesHandlerId = table.addEventHandler('pageload', this.removeTaskProfilesNotInModel.bind(this));
            }

            return table;
        },

        createCapabilitiesList: function() {

            var table = new Table({

                title: Dictionary.customRoleDetails.capabilities_tab_title,
                url: '/oss/idm/rolemanagement/usecases',
                fetchErrorHeader: Dictionary.customRoleDetails.fetch_capabilities_error_header,
                fetchErrorContent: Dictionary.customRoleDetails.fetch_capabilities_error_content,
                selectedCaption: Dictionary.customRoleDetails.selected_caption,
                unique_key: ['resource', 'action'],
                tooltips: true,
                plugins: [
                    new SortableHeader(),
                    new ResizableHeader(),
                    new StickyHeader({
                        topOffset: 32
                    }),
                    new SecondHeader(),
                    new Selection({
                        checkboxes: this.isEditable,
                        selectableRows: this.isEditable,
                        multiselect: this.isEditable,
                        bind: this.isEditable
                    })
                ],
                //rowsToSelect: [{'resource': 'pm_service', 'action':'read'},{'resource': 'pm_service', 'action':'create'}],
                columns: [{
                    title: Dictionary.customRoleDetails.capabilities_application,
                    attribute: 'application',
                    width: '300px',
                    secondHeaderCellType: FilterByStringHeaderCell,
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.customRoleDetails.capabilities_resource,
                    attribute: 'resource',
                    width: '250px',
                    secondHeaderCellType: FilterByStringHeaderCell,
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.customRoleDetails.capabilities_operation,
                    attribute: 'action',
                    width: '250px',
                    secondHeaderCellType: FilterByStringHeaderCell,
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.customRoleDetails.capabilities_description,
                    attribute: 'description',
                    secondHeaderCellType: FilterByStringHeaderCell,
                    sortable: true,
                    resizable: true
                }]
            });

            table.getTable().addEventHandler('rowselectend', this.updateCapabilitiesList.bind(this));
            if( ! this.isEditable) {
                this.capabilitiesHandlerId = table.addEventHandler('pageload', this.removeCapabilitiesNotInModel.bind(this));
            }

            return table;
        },

        getRolesNames: function(roles) {
            return roles.map(function(row) {
                return row.name;
            });
        },

        removeRolesNotInModel: function() {
            var roleNames = this.getRolesNames(this.roles);
            this.rolesList.removeEventHandler('pageload', this.rolesHandlerId);

            this.rolesList.persistOnlyMatchingRows(function(row) {
                return this.isRowDataInRoles(row, roleNames);
            }.bind(this));
        },

        removeTaskProfilesNotInModel: function() {
            var taskProfileNames = this.getRolesNames(this.roles);
            this.taskProfilesList.removeEventHandler('pageload', this.taskProfilesHandlerId);

            this.taskProfilesList.persistOnlyMatchingRows(function(row) {
                return this.isRowDataInRoles(row, taskProfileNames);
            }.bind(this));
        },

        removeCapabilitiesNotInModel: function() {
            this.capabilitiesList.removeEventHandler('pageload', this.capabilitiesHandlerId);

            this.capabilitiesList.persistOnlyMatchingRows(function(row) {
                return this.isRowDataInPolicy(row, this.policy);
            }.bind(this));
        },

        isRowDataInRoles: function(rowData, roles) {
            for (var i = 0; i < roles.length; ++i) {
                if (rowData.name === roles[i]) {
                    return true;
                }
            }
        },

        isRowDataInPolicy: function(rowData, policy) {
            for(var p in policy) {
                if(rowData.resource === p) {
                    for(var i = 0; i<policy[p].length; ++i) {
                        if(rowData.action === policy[p][i]) {
                            return true;
                        }
                    }
                }
            }
        },

        setItemsToSelect: function(roles, policy) {
            this.roles = roles;
            this.policy = policy;
            this.rolesList.selectRows(this.roles.filter((function(row) { return ( row.type === "com" );})));
            this.taskProfilesList.selectRows(this.roles.filter((function(row) { return ( row.type === "cpp" );})));
            this.capabilitiesList.selectRows(this._convertPolicyObjectToArray(this.policy));
            this.model.addRoles(this.roles);
        },

        _convertPolicyObjectToArray: function(policyObject) {
            var policyArray = [];
            Object.keys(policyObject).forEach(function(resourceName) {
                policyObject[resourceName].forEach(function(actionName) {
                    policyArray.push({
                        resource: resourceName,
                        action: actionName
                    });
                });
            }.bind(this));
            return policyArray;
        },

        updateRolesList: function(rows) {
             // reset list without loosing reference
            if(this.roles) {
                while(this.roles.pop()) {}
            }
            // copy element to not lose reference
            rows.forEach(function(row) {
                this.roles.push(row.getData().name);
                this.model.addRole(row.getData().name);
            }.bind(this));
            // copy element from TaskProfileTab to not lose reference
            this.taskProfilesList.getSelectedRowsData().forEach(function(row) {
                this.roles.push(row.name);
                this.model.addRole(row.name);
            }.bind(this));
        },

        updateTaskProfilesList: function(rows) {
             // reset list without loosing reference
            if(this.roles) {
                while(this.roles.pop()) {}
            }
            // copy element to not lose reference
            rows.forEach(function(row) {
                this.roles.push(row.getData().name);
                this.model.addRole(row.getData().name);
            }.bind(this));
            // copy element from ComRolesTab to not lose reference
            this.rolesList.getSelectedRowsData().forEach(function(row) {
                this.roles.push(row.name);
                this.model.addRole(row.name);
            }.bind(this));
        },

        updateCapabilitiesList: function(rows) {
            // reset list without loosing reference
            for (var member in this.policy) {
                delete this.policy[member];
            }

            this.capabilitiesList.getSelectedRowsData().forEach(function(row) {
                if (this.policy[row.resource])
                    this.policy[row.resource].push(row.action);
                else
                    this.policy[row.resource] = [row.action];
            }.bind(this));
        }

    });

});
