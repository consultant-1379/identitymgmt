define([
    'jscore/core',
    'jscore/ext/privateStore',
    './ProfileSummaryRolesView',
    'identitymgmtlib/mvp/binding',
    'tablelib/Table',
    'tablelib/plugins/ExpandableRows',
    '../ProfileSummaryRoleRowContent/ProfileSummaryRoleRowContent',
    '../TgsListButton/TgsListButton',
    'identitymgmtlib/Utils',
    '../../Dictionary',
    'jscore/ext/utils/base/underscore',
    '../ProfileSummaryRoleCell/ProfileSummaryRoleCell'
], function(core, PrivateStore, View, binding, Table, ExpandableRows, ProfileSummaryRoleRowContent, TgsListButton, Utils, Dictionary, underscore, ProfileSummaryRoleCell) {

    var _ = PrivateStore.create();

    var getRole = function(roles, name) {
        return roles.find(function(role) {
                    return role.name === name;
                });
    };

    var getPrivileges = function(privileges, roles) {
        var newPriv = {};
        for(var i in privileges) {
            var obj = privileges[i];
            if (newPriv[obj.role]) {
                newPriv[obj.role].tgs.push(obj.targetGroup);
            } else {
                newPriv[obj.role] = {};
                newPriv[obj.role].roleName = obj.role;
                var role = getRole(roles, obj.role);
                newPriv[obj.role].type = role.type;
                newPriv[obj.role].tgs = [];
                newPriv[obj.role].tgs.push(obj.targetGroup);
            }
        }
        var newPriv2 = [];
        for(var j in newPriv) {
            newPriv2.push(newPriv[j]);
        }

        return newPriv2;

    };

    var getTgsValue = function(tgs) {
        if (tgs.length === 1) {
            if (tgs[0] === 'ALL') {
                return 'ALL';
            } else if (tgs[0] === 'NONE') {
                return 'NONE';
            }
        }
        return tgs.length;
    };


    return core.Widget.extend({

        View: View,

        privileges: [],

        tgs: [],

        getTgs: function(privileges) {

            var privilegeENM = privileges.filter(function(privilege) {
                return Utils.isServiceRoleByType(privilege.type);
            });

            var tgs = [];
            privilegeENM.forEach(function(privilege) {
                tgs = underscore.union(tgs, privilege.tgs);
            });

            if ( tgs.indexOf("ALL") !== -1 ) {
                tgs = ['ALL'];
            }

            if (tgs.length > 1) {
                tgs = tgs.filter(function(el) {
                    return el !== 'NONE';
                });
            }

            return tgs;

        },

        onViewReady: function() {

            this.privileges = getPrivileges(this.options.privileges, this.options.roles);
            this.tgs = this.getTgs(this.privileges);
            var tgsListButton = new TgsListButton({tgs: this.tgs, username: this.options.userName});
            tgsListButton.attachTo(this.view.getListServiceTgs());
            this.view.getServiceTgs().setText(getTgsValue(this.tgs));

            var tableOptions = this.buildTableOptions(),
                tableW = new Table(tableOptions);
            this.view.getCaption().setText(Utils.printf(Dictionary.roleTable.assigned_roles2, this.privileges.length));
            tableW.attachTo(this.getElement());
        },

        buildTableOptions: function () {
            return {
                data: this.privileges,
                columns: [
                    {title: Dictionary.roleTable.role_name, attribute: 'roleName', cellType: ProfileSummaryRoleCell},
                ],
                plugins: [
                    new ExpandableRows({
                        content: ProfileSummaryRoleRowContent,
                        args: {
                            userName: this.options.userName
                        }
                    })
                ],
                modifiers: [
                    {name: 'expandableStriped'} // Applying a different table style
                ]
            };
        }

    });

});
