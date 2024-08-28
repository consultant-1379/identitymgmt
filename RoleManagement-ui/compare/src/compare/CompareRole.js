define([
    'jscore/core',
    './CompareRoleView',
    'jscore/ext/locationController',
    'jscore/ext/net',
    'layouts/TopSection',
    'identitymgmtlib/Utils',
    'i18n!compare/dictionary.json',
    'rolemgmtlib/model/CompareModel',
    'widgets/Notification',
    'rolemgmtlib/regions/CompareForm/CompareForm',
    'identitymgmtlib/AccessControlService'
], function(core, View, LocationController, net, TopSection, Utils, Dictionary, CompareModel, Notification, CompareForm, accessControlService) {

    return core.App.extend({
        View: View,

        topSection: null,
        roleModel: null,
        roleCompare: null,
        roleName: null,
        role1: null,
        role2: null,

        onStart: function() {

            // Location controller sets autoUrlDecode to false for GOTO query variable to work correctly.
            // Without the autoUrlDecode, the goto may break.
            this.lc = new LocationController({
                namespace: this.options.namespace,
                autoUrlDecode: false
            });
            accessControlService.isAppAvailable("role_management", Utils.createAccessControlRegion.bind(this));

            this.lc.addLocationListener(this.onLocationChange.bind(this));

            this.lc.start();
        },

        onResume: function(hash) {
            accessControlService.isAppAvailable("role_management", Utils.createAccessControlRegion.bind(this));
        },

        onLocationChange: function(hash) {

            this.goto = 'rolemanagement';
            this.role1 = null;
            this.role2 = null;

            this.action = null;

            var roleNamesFromUrl = hash.split('&');
            this.role1 = (roleNamesFromUrl[0]) ? roleNamesFromUrl[0] : "";
            this.role2 = (roleNamesFromUrl[1]) ? roleNamesFromUrl[1] : "";

            this.roleCompare = new CompareForm({
                role1: this.role1,
                role2: this.role2,
                model1: new CompareModel({
                    roleName: this.role1
                }),
                model2: new CompareModel({
                    roleName: this.role2
                }),
                context: this.getContext()
            });

            // Create and attach TopSection
            this.createTopSection(this.action);
            this.topSection.attachTo(this.getElement());
            this.topSection.setContent(this.roleCompare);

        },

        doesBothRolesExist: function() {
            if (Utils.isNotNullEmptyOrUndefined(this.role1) &&
                Utils.isNotNullEmptyOrUndefined(this.role2)) {
                return true;
            } else {
                return false;
            }
        },

        createTopSection: function(action) {
            if (this.topSection) {
                this.topSection.destroy();
            }

            var breadcrumbWithoutChildApps = Utils.removeChildAppsFromBreadcrumb(this.options.breadcrumb);

            this.topSection = new TopSection({
                title: Dictionary.headers.comparison,
                breadcrumb: breadcrumbWithoutChildApps,
                context: this.getContext(),
                defaultActions: this.getDefaultActions()
            });

            this.topSection.setContent(this.roleCompare);
        },

        getDefaultActions: function() {
            return [{
                name: Dictionary.backToRoles,
                type: 'button',
                action: this.triggerGoto.bind(this)
            }];
        },

        triggerGoto: function() {
            window.location.hash = this.goto;
        }
    });
});