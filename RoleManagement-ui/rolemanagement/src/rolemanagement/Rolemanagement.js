define([
    'jscore/core',
    'container/api',
    './RolemanagementView',
    'identitymgmtlib/ParamsLocationController',
    'layouts/MultiSlidingPanels',
    'layouts/TopSection',
    './regions/RoleMgmtRegion',
    './ActionsManager',
    'identitymgmtlib/Utils',
    './regions/Filters/Filters',
    './regions/RoleSummary/RoleSummary',
    './Dictionary',
    'identitymgmtlib/AccessControlService',
], function(core, container, View, ParamsLocationController, MultiSlidingPanels, TopSection, RoleMgmtRegion, ActionsManager, utils, FilterRegion, RoleSummaryRegion, Dictionary, accessControlService) {

    return core.App.extend({
        View: View,
        topSection: null,

        onStart: function() {

            accessControlService.isAppAvailable("role_management", utils.createAccessControlRegion.bind(this));
            _configureLocationController.call(this);

            var breadcrumbWithoutChildApps = utils.removeChildAppsFromBreadcrumb(this.options.breadcrumb);

            this.topSection = new TopSection({
                context: this.getContext(),
                breadcrumb: breadcrumbWithoutChildApps,
                title: this.options.properties.title,
                defaultActions: ActionsManager.getDefaultActions()
            });

            this.topSection.attachTo(this.getElement());

            this.roleMgmtRegion = new RoleMgmtRegion({
                context: this.getContext(),
                locationController: this.locationController
            });

            this.filterRegion = new FilterRegion({
                context: this.getContext(),
                initialValues: this.locationController.getParameter("filter")
            });

            this.roleSummaryRegion = new RoleSummaryRegion({
                context: this.getContext()
            });

            ActionsManager.setEventBus(this.getEventBus());
            ActionsManager.setContext(this.getContext());
            ActionsManager.setRoleSummaryRegion(this.roleSummaryRegion);

            this.msp = new MultiSlidingPanels({
                context: this.getContext(),
                resizeable: true,
                main: {
                    label: this.options.properties.title,
                    content: this.roleMgmtRegion
                },
                right: [{
                    label: Dictionary.filter.title,
                    icon: 'filter',
                    value: "filters",
                    type: 'external'
                },
                {
                    label: Dictionary.roleSummary.title,
                    icon: "info",
                    value: "summary",
                    content: this.roleSummaryRegion
                }]
            });

            this.topSection.setContent(this.msp);
            this.addEventHandlers();
            this.getEventBus().publish('mainregion:refreshdata');
            this.locationController.start();

        },

        onResume: function() {
            accessControlService.isAppAvailable("role_management", utils.createAccessControlRegion.bind(this));
            this.getEventBus().publish('mainregion:refreshdata');
            this.locationController.start();
            this.roleMgmtRegion.start();

        },

        onPause: function() {
            this.locationController.stop();
            this.roleMgmtRegion.stop();

        },

        addEventHandlers: function() {
            this.getEventBus().subscribe('actions:create', this.createAction.bind(this));
            this.getEventBus().subscribe('refresh', this.onResume.bind(this)); //Triggered by delete

            this.getEventBus().subscribe('layouts:panelaction', function (value) {
                if (value === "filters") {
                    container.getEventBus().publish('flyout:show', {
                        header: Dictionary.filter.title,
                        content: this.filterRegion
                    });
                }
            }.bind(this));

            this.addFilteredClearEventHandler();
        },

        createAction: function(){
            this.locationController.setNamespaceLocation('userrole/create');
        },

        addFilteredClearEventHandler: function() {
            this.roleMgmtRegion.getTable().addEventHandler('filtered:clear', function(filter) {
                this.filterRegion.onFilteredClear();
            }.bind(this));
        }
    });

    function _configureLocationController() {
        this.locationController = new ParamsLocationController({
            namespace: this.options.namespace,
            autoUrlDecode: false
        });
    }

});
