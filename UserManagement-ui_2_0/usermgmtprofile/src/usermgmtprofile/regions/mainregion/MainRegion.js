define([
    'jscore/core',
    'uit!./mainregion.html',
    'i18n!identitymgmtlib/common.json',
    '../../Dictionary',
    'widgets/Tabs',
    'widgets/InfoPopup',
    '../../widgets/RoleAssignTableWidget/RoleAssignTableWidget',
    '../../widgets/OdpProfilesTableWidget/odpProfilesTableWidget'
], function(core, View, IdentityDictionary, Dictionary, Tabs, InfoPopup, RoleAssignTableWidget, OdpProfilesTableWidget ) {

    return core.Region.extend({
        view: function() {
            return new View({
                Dictionary: Dictionary,
                edit: this.options.type === 'edit',
                create: this.options.type === 'create',
                userDetailsOptions: {
                    model: this.options.model,
                    enforcedUserHardening: this.options.enforcedUserHardening
                }
            });
        },

        onViewReady: function() {
            this.roleAssignTableWidget = new RoleAssignTableWidget({ model: this.options.model });
            this.tabsValues = [{title: IdentityDictionary.roleTable.title, content: this.roleAssignTableWidget }];

            if ( this.options.odpProfiles.length > 0 ) {
                this.odpProfilesTableWidget = new OdpProfilesTableWidget({ model: this.options.model,
                                                                           odpProfiles: this.options.odpProfiles });
                this.tabsValues.push({title: IdentityDictionary.odpTable.title, content: this.odpProfilesTableWidget });
            }

            this.tabs = new Tabs({
                showAddButton: false,
                tabs: this.tabsValues
            });
            this.tabs.attachTo(this.getElement().find('.eaUsermgmtprofile-rMainRegion-tabsHolder'));
        }
    });
});
