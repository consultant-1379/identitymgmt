/*global define */
define([
    'jscore/core',
    'jscore/ext/net',
    './RoleSummaryView',
    'identitymgmtlib/widgets/List',
    'widgets/Accordion',
    '../../Dictionary',
    'identitymgmtlib/Utils'
], function(core, net, View, List, Accordion, Dictionary, utils) {
    'use strict';

    return core.Region.extend({
        selectedRole: null,

        accordionRoles: null,

        rolesList : null,

        view: function() {
            return new View(Dictionary.roleSummary);
        },

        onViewReady: function(options) {
            this.initAccordion();
            this.addEventHandlers();
        },

        addEventHandlers: function() {
            this.getEventBus().subscribe('rolemgmt:checkedRows', function(checkedRows) {
                if (checkedRows[0] !== this.selectedRole) {
                    this.selectedRole = checkedRows[0];
                    this.updateView();
                }
            }.bind(this));
        },

        updateView: function() {
            if (this.selectedRole) {
                this.view.getRoleNameContainer().setText(this.selectedRole.name);
                this.view.getRoleDescriptionContainer().setText(this.selectedRole.description);
                this.view.setRoleDetailLink('#rolemanagement/userrole/' + this.selectedRole.name);
                switch(this.selectedRole.type) {
                    case 'system':
                    case 'application':
                        this.view.getRoleTypeContainer().setText(Dictionary.roleSummary.enmSystemRole);
                        this.view.getRolesListContainer().setModifier("hide");
                        this.view.getCapabilitiesContainer().setModifier("hide");
                        this.view.getRoleDetailsLinkWrapper().setModifier("hide");
                        break;
                    case 'custom':
                        this.view.getRoleTypeContainer().setText(Dictionary.roleSummary.customRole);
                        this.accordionRoles.setTitle(Dictionary.roleSummary.roles);
                        this.view.getRolesListContainer().removeModifier("hide");
                        this.view.getCapabilitiesContainer().removeModifier("hide");
                        this.view.getRoleDetailsLinkWrapper().removeModifier("hide");
                        this.loadDetails();
                        break;
                    case 'com':
                        this.view.getRoleTypeContainer().setText(Dictionary.roleSummary.comRole);
                        this.view.getRolesListContainer().setModifier("hide");
                        this.view.getCapabilitiesContainer().setModifier("hide");
                        this.view.getRoleDetailsLinkWrapper().setModifier("hide");
                        break;
                    case 'comalias':
                        this.view.getRoleTypeContainer().setText(Dictionary.roleSummary.comRoleAlias);
                        this.accordionRoles.setTitle(Dictionary.roleSummary.comRoles);
                        this.view.getRolesListContainer().removeModifier("hide");
                        this.view.getCapabilitiesContainer().setModifier("hide");
                        this.view.getRoleDetailsLinkWrapper().removeModifier("hide");
                        this.loadDetails();
                        break;
                    case 'cpp':
                        this.view.getRoleTypeContainer().setText(Dictionary.roleSummary.cppRole);
                        this.view.getRolesListContainer().setModifier("hide");
                        this.view.getCapabilitiesContainer().setModifier("hide");
                        this.view.getRoleDetailsLinkWrapper().setModifier("hide");
                        break;
                    default:
                        this.view.getRoleTypeContainer().setText('');
                        this.view.getRolesListContainer().setModifier("hide");
                        this.view.getCapabilitiesContainer().setModifier("hide");
                        this.view.getRoleDetailsLinkWrapper().removeModifier("hide");
                        break;
                }

                switch(this.selectedRole.status) {
                    case 'ENABLED':
                        this.view.getRoleStatusContainer().setText(Dictionary.roleSummary.enabled);
                        this.view.getRoleSummaryStatusIcon().removeModifier("None");
                        this.view.getRoleSummaryStatusIcon().removeModifier("Red");
                        this.view.getRoleSummaryStatusIcon().setModifier("Green");
                        break;
                    case 'DISABLED':
                        this.view.getRoleStatusContainer().setText(Dictionary.roleSummary.disabled);
                        this.view.getRoleSummaryStatusIcon().removeModifier("None");
                        this.view.getRoleSummaryStatusIcon().removeModifier("Green");
                        this.view.getRoleSummaryStatusIcon().setModifier("Red");
                        break;
                    case 'DISABLED_ASSIGNMENT':
                        this.view.getRoleStatusContainer().setText(Dictionary.roleSummary.nonassignable);
                        this.view.getRoleSummaryStatusIcon().removeModifier("Red");
                        this.view.getRoleSummaryStatusIcon().removeModifier("Green");
                        this.view.getRoleSummaryStatusIcon().setModifier("None");
                        break;
                    default:
                        this.view.getRoleStatusContainer().setText('');
                        this.view.getRoleSummaryStatusIcon().removeModifier("Red");
                        this.view.getRoleSummaryStatusIcon().removeModifier("Green");
                        this.view.getRoleSummaryStatusIcon().setModifier("None");
                        break;
                }
                this.view.getRoleSummaryContent().removeModifier("hide");
            } else {
                this.view.getRoleNameContainer().setText(Dictionary.roleSummary.noRoleSelected);
                this.view.getRoleDescriptionContainer().setText('');
                this.view.getRoleTypeContainer().setText('');
                this.view.getRoleStatusContainer().setText('');
                this.view.getRoleSummaryContent().setModifier("hide");
            }
        },

        initAccordion: function() {
            this.rolesList = new List({
                elements: []
            });

            this.accordionRoles = new Accordion({
                title: Dictionary.roleSummary.roles,
                content: this.rolesList,
                expanded: false
            });

            this.accordionRoles.attachTo(this.view.getRolesListContainer());
        },

        loadDetails: function() {
            //set empty roles list before details are loaded
            if (this.rolesList.getElements().length > 0) {
               this.rolesList = new List({
                  elements: []
               });
               this.accordionRoles.setContent(this.rolesList);
            }

            //hide capabilities info before details are loaded
            this.view.getCapabilitiesInfo().setModifier("hide");

            net.ajax({
                url: "/oss/idm/rolemanagement/roles/" + this.selectedRole.name,
                type: "GET",
                dataType: 'json',
                success: function(data){
                             this.roleDetail = data;
                             this.successLoadDetails();
                         }.bind(this),
                error: function(data){
                            this.roleDetail = null;
                            this.failLoadDetails();
                       }.bind(this)
            });
        },

        successLoadDetails: function() {
            //this is to avoid unnecessary reload of a view (roles list has been cleared before loading)
            if (this.roleDetail.roles.length > 0) {
                this.rolesList = new List({
                    sortFunction: function(a, b) {
                        return a.name.localeCompare(b.name);
                    },
                    elements: this.roleDetail.roles
                });
                this.accordionRoles.setContent(this.rolesList);
            }
            
            var noOfCap = 0;

            if (this.roleDetail.policy) {
                for(var key in this.roleDetail.policy) {
                    noOfCap = noOfCap + this.roleDetail.policy[key].length;
                }
            }

            this.view.getCapabilitiesInfo().setText(utils.printf(Dictionary.roleSummary.capabilitiesInfo, noOfCap));
            this.view.getCapabilitiesInfo().removeModifier("hide");
        },


        failLoadDetails: function() {
            // do not show any related subroles
            // do not show misleading capabilities info
            // this.view.getCapabilitiesInfo().setText(utils.printf(Dictionary.roleSummary.capabilitiesInfo, 0));
            // this.view.getCapabilitiesInfo().removeModifier("hide");
        }

    });
});
