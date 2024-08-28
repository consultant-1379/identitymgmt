define([
    'jscore/core',
    'jscore/ext/net',
    'container/api',
    'layouts/TopSection',
    'layouts/MultiSlidingPanels',
    'widgets/Tabs',
    './regions/mainregion/MainRegion',
    'identitymgmtlib/ParamsLocationController',
    './ActionsManager',
    './Dictionary',
    'identitymgmtlib/Utils',
    'identitymgmtlib/SystemTime',
    './widgets/filterWidget/FilterWidget',
    'identitymgmtlib/AccessControlService',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'identitymgmtlib/services/TimeService',
    'identitymgmtlib/UsersExport',
], function(core, net, container, TopSection, MultiSlidingPanels, Tabs, MainRegion, LocationController, ActionsManager, Dictionary, utils, systemTime, FilterWidget, AccessControlService, responseHandler, TimeService, UsersExport) {

    return core.App.extend({

        performOnStart: function() {
            TimeService.getServerTime()
                .then(function(data) {
                    systemTime.updateTimezone(data.serverLocation);
                    this.onResume();
                }.bind(this), function() {
                    this.onResume();
                }.bind(this));

            configureLocationControllerAndSubscribeOnEvents.call(this);

            // Create the regions and populate them into the layouts
            this.filterWidget = createFilterWidget.call(this, false);
            this.mainRegion = createMainRegion.call(this, false);
            this.filterWidget.setEventBus(this.getEventBus());

            this.filterWidgetFederated = createFilterWidget.call(this, true);
            this.federatedRegion = createMainRegion.call(this, true);
            this.filterWidgetFederated.setEventBus(this.getEventBus());

            ActionsManager.setEventBus(this.getEventBus());

            this.tabs = createTabs.call(this);

            this.multiSlidingPanels = createMultiSlidingPanels.call(this, this.tabs);
            this.mainRegion.setMSP(this.multiSlidingPanels);
            this.federatedRegion.setMSP(this.multiSlidingPanels);

            this.tabSelected = -1;

            createTopSectionUsingContainerOptions.call(this);

            this.tabs.addEventHandler('tabselect', this.tabSelectedHandle.bind(this));

            // Configure Contextual Menu on table
            this.initMenu(this.mainRegion.getTable());
            this.initMenu(this.federatedRegion.getTable());

            if ( this.locationController.getParameter('federated') ) {
                this.tabs.setSelectedTab(1);
                this.tabSelectedHandle("Federated User",1);
            } else {
                this.tabs.setSelectedTab(0);
                this.tabSelectedHandle("Local User",0);
            }

            // Refresh event gets called by the delete action.
            this.getEventBus().subscribe('refresh', this.onResume.bind(this));

            this.getEventBus().subscribe('layouts:panelaction', function (value) {
                if (value === "filters") {
                    if ( this.tabSelected === 0 ) { // Local User
                        container.getEventBus().publish('flyout:show', {
                            header: Dictionary.filters.label,
                            content: this.filterWidget
                        });
                    } else {
                        container.getEventBus().publish('flyout:show', {
                            header: Dictionary.filters.label,
                            content: this.filterWidgetFederated
                        });
                    }
                } else if ( value==="summary" ){
                    this.getEventBus().publish('action:viewSummary');
                }
            }.bind(this));

            addApplyEventHandler.call(this);
            addCancelEventHandler.call(this);
            addFilteredClearEventHandler.call(this);
        },

        tabSelectedHandle: function(tabTitle, tabNumber) {
                // tabNumber and/or this.tabSelected  = 0  --> Local Users
                // tabNumber and/or this.tabSelected  = 1  --> Federated Users
                if ( tabNumber === 0 && this.tabSelected !== 0 ) {
                    ActionsManager.setFederatedView(false); //Update topSection actions
                    if (!this.mainRegion.getTable()) {
                        this.getEventBus().publish('topsection:defaultactions',
                                               ActionsManager.getActions(undefined, true));
                    } else {
                        this.getEventBus().publish('topsection:defaultactions',
                                               ActionsManager.getActions(this.mainRegion.getTable().getCheckedRows(), true));
                    }
                    this.federatedRegion.onPause();
                    this.mainRegion.onResume();
                    this.mainRegion.refreshData();
                } else if ( tabNumber === 1 && this.tabSelected !== 1) {
                    ActionsManager.setFederatedView(true); //Update topSection actions
                    if (!this.federatedRegion.getTable()) {
                        this.getEventBus().publish('topsection:defaultactions',
                                               ActionsManager.getActions(undefined, false));
                    } else {
                        this.getEventBus().publish('topsection:defaultactions',
                                               ActionsManager.getActions(this.federatedRegion.getTable().getCheckedRows(), true));
                    }
                    this.mainRegion.onPause();
                    this.federatedRegion.onResume();
                }
                this.tabSelected = tabNumber;
            },

        initMenu: function(tableParent) {
            if ( tableParent ) {
                var table = tableParent.getTable();

                // this event will trigger each time the user right clicks on any row
                table.addEventHandler('rowevents:contextmenu', function (row, e) {
                    e.preventDefault();
                    // If there is any row selected then show context menu
                    if (table.getSelectedRows().length > 0) {
                        container.getEventBus().publish('contextmenu:show', e, ActionsManager.getMenuActions(table.getCheckedRows(), true));
                    }
                }.bind(this));
            }
        },

        /**
         * Start the layouts
         *
         * @method onStart
         */
        onStart: function() {
            return AccessControlService.isAppAvailable('user_management').then(function() {
                    this.performOnStart();
                }.bind(this),
                function(response) {
                    if (response.getStatus && response.getStatus() !== 401) {
                        responseHandler.setNotificationError({ response: '' + response.getStatus() });
                    } else {
                        responseHandler.showAccessDeniedDialog();
                    }
                }.bind(this));
            // onResume has the logic for fetching roles and continue from there.
            //this.onResume();
        },

        performOnResume: function() {
            //this.mainRegion.refreshDataNeeded();
            this.ignoreLocationChange = false;
            this.locationController.start();
        },

        /**
         * Fetch the roles and publish the event lettings regions know.
         * Each time we come back to this app we want roles fetched.
         *
         * @method onResume
         */
        onResume: function() {
            return AccessControlService.isAppAvailable('user_management').then(function() {
                    this.performOnResume();
                }.bind(this),
                function(response) {
                    if (response.getStatus && response.getStatus() !== 401) {
                        responseHandler.setNotificationError({ response: '' + response.getStatus() });
                    } else {
                        responseHandler.showAccessDeniedDialog();
                    }
                }.bind(this));
        },

        onPause: function() {
            if (this.mainRegion) {
                this.mainRegion.getTable().clearMarkers();
            }

            if (this.federatedRegion) {
                this.federatedRegion.getTable().clearMarkers();
            }

            if (this.locationController) {
                this.locationController.stop();
            }
        }
    });

    function addApplyEventHandler() {
        this.filterWidget.addEventHandler('filter:apply', function(filter) {
            if ( this.tabSelected === 0 ) {
                this.mainRegion.getTable().filter(filter, false);
            }
        }.bind(this));

        this.filterWidgetFederated.addEventHandler('filter:apply', function(filter) {
            if ( this.tabSelected === 1 ) {
                this.federatedRegion.getTable().filter(filter, false);
            }
        }.bind(this));

    }

    function addCancelEventHandler() {
        this.filterWidget.addEventHandler('filter:clear', function(filter) {
            if ( this.tabSelected === 0 ) {
                this.mainRegion.getTable().resetFilter(false);
            }
        }.bind(this));

        this.filterWidgetFederated.addEventHandler('filter:clear', function(filter) {
            if ( this.tabSelected === 1 ) {
                this.federatedRegion.getTable().resetFilter(false);
            }
        }.bind(this));

    }

    function addFilteredClearEventHandler() {
        this.mainRegion.getTable().addEventHandler('filtered:clear', function(filter) {
            if ( this.tabSelected === 0 ) {
                this.filterWidget.onFilteredClear();
            }
        }.bind(this));

        this.federatedRegion.getTable().addEventHandler('filtered:clear', function(filter) {
            if ( this.tabSelected === 1 ) {
                this.filterWidgetFederated.onFilteredClear();
            }
        }.bind(this));

    }

    function createTopSectionUsingContainerOptions() {
        var topSection = new TopSection({
            context: this.getContext(),
            breadcrumb: utils.removeChildAppsFromBreadcrumb(this.options.breadcrumb),
            title: this.options.properties.title,
        });
        topSection.attachTo(this.getElement());
        topSection.setContent(this.multiSlidingPanels);
        return topSection;
    }

    function createFilterWidget(isFederated) {
        if ( this.locationController.getParameter('federated') ) { // user management app is called by GIC, tab federated should be automatically opened
            return new FilterWidget({
                isFederated: isFederated,
                defaultValue: isFederated? this.locationController.getParameter('filter') : undefined
            });
        } else {
            return new FilterWidget({
                isFederated: isFederated,
                defaultValue: isFederated ? undefined : this.locationController.getParameter('filter')
            });
        }
    }

    function createTabs() {
        return new Tabs({
            showAddButton: false,
            tabs: [
                {title: Dictionary.tabLocalUsersTitle, content: this.mainRegion },
                {title: Dictionary.tabFederatedUsersTitle, content: this.federatedRegion}
                  ]
        });
    }

    function createMainRegion(isFederated) {
        return new MainRegion({
            context: this.getContext(),
            isFederatedView: isFederated,
            filterWidget: isFederated ? this.filterWidgetFederated : this.filterWidget
        });
    }

    function createMultiSlidingPanels(contentRegion) {
        return new MultiSlidingPanels({
            context: this.getContext(),
            resizeable: true,
            main: {
                label: this.options.properties.title,
                content: contentRegion
            },
            rightWidth: 400,
            right: [{
                value: 'notifications',
                icon: 'mail',
                type: 'external'
            }, {
                label: Dictionary.filters.label,
                icon: 'filter',
                value: "filters",
                type: 'external'
            }, {
                label: Dictionary.profileSummary,
                icon: 'info',
                value: "summary",
                type: 'external'
            }]
        });
    }

    function configureLocationControllerAndSubscribeOnEvents() {
        // Create and configure location controller
        this.locationController = new LocationController({
            namespace: this.options.namespace,
            autoUrlDecode: false
        });

        this.locationController.addLocationListener(function(hash) {
            if ( (this.locationController.getNamespaceLocation().indexOf('?') === 0) ||
                  this.locationController.getLocation().split('?')[0] === this.options.namespace) {
                /*
                 * [qmiclap]: comented out due to BIT tests form command line, should be investigated why this is problem
                 * if (this.locationController.getNamespaceLocation().startsWith('?') || this.locationController.getLocation() === this.options.namespace || this.locationController.getLocation() === this.options.namespace + '/') {
                 */
                var paramsObj = utils.parseHash(hash, true);
                if ( paramsObj.query.savedUser ) {
                    if (this.mainRegion) {
                        this.mainRegion.setSavedUser(paramsObj.query.savedUser);
                    }
                }

                if ( this.ignoreLocationChange !== true ) {
                    this.getEventBus().publish('locationcontroller:queryparamsupdated', paramsObj.query);
                }
                this.ignoreLocationChange = false;

                if ( this.locationController.getParameter('federated') ) {
                    if ( this.filterWidgetFederated ) {
                        this.filterWidgetFederated.updateValues(paramsObj.query.filter);
                    }
                } else {
                    if ( this.filterWidget ) {
                        this.filterWidget.updateValues(paramsObj.query.filter);
                    }
                }
            }
        }.bind(this));


        this.getEventBus().subscribe('locationcontroller:updatequeryparams', function(paramsObj, history) {
            if ( this.waitSetParameters ) {
              clearTimeout(this.waitSetParameters);
            }
	    if (this.locationController.getLocation().split('?')[0] === this.options.namespace ) {
                this.ignoreLocationChange = true;
                this.locationController.setParameters(paramsObj, undefined, history);
                this.waitSetParameters = setTimeout(function() {
                    this.ignoreLocationChange = false;
                    this.waitSetParameters = undefined;
                }.bind(this), 3000);
            }
        }.bind(this));
    }
});
