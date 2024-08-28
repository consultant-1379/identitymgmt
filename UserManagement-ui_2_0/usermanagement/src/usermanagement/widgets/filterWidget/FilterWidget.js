/*
 The SelectAll widget allows the user to select all or clear all rows in the table.
 Events :
 selectAllLink - Triggered when all rows in table are selected by user input
 clearAllLink - Triggered when all rows in table are unselected by user input

 The following options are mandatory : collectionSize, selectedRows, paginationTotalPages, allRowsSelectedOnCurrentPage

 The following options are accepted:
 label (Optional): a string used to set the notification text.
 icon (Optional): a string used to define an icon to show.
 selectAll (Optional): a string used to define the selectAll link text.
 clearAll (Optional): a string used to define the clearAll link text.
 */

define([
    'jscore/core',
    'jscore/ext/net',
    'container/api',
    'uit!./filterwidget.html',
    '../../Dictionary',
    'identitymgmtlib/Utils',
    'identitymgmtlib/widgets/CheckList',
    'jscore/ext/privateStore',
    'identitymgmtlib/filters/FilterPlugin',
    'widgets/Accordion',
    'identitymgmtlib/filters/LoginFilterPlugin',
    'identitymgmtlib/filters/CheckListFilterPlugin',
    'identitymgmtlib/filters/RadioListFilterPlugin',
    'identitymgmtlib/filters/TextInputFilterPlugin',
    'identitymgmtlib/filters/RolesListFilterPlugin',
    'identitymgmtlib/filters/RolesAccordionFilterWidget'
], function(core, net, Container, View, Dictionary, utils, CheckList, PrivateStore, FilterPlugin, Accordion, LoginFilterPlugin, CheckListFilterPlugin, RadioListFilterPlugin, TextInputFilterPlugin, RolesListFilterWidget, RolesAccordionFilterWidget) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        eventBus: null,

        updateValues: function(query) {
            _(this).filterPlugins.forEach(function(plugin) {
                if (plugin.updateValue) {
                    plugin.updateValue(query);
                }
            });
        },

        setEventBus: function(bus) {
            this.eventBus = bus;
        },

        init: function(options) {

            this.view = new View({
                buttons: Dictionary.filters.buttons
            });

            _(this).defaultValue = options.defaultValue;

            this.isFederated = options.isFederated;

            _(this).filterPlugins = [];
            _(this).filterPlugins.push(_getUsernameFilterPlugin.call(this));
            if (!this.isFederated) {
                _(this).filterPlugins.push(_getNameFilterPlugin.call(this));
                _(this).filterPlugins.push(_getSurnameFilterPlugin.call(this));
                _(this).filterPlugins.push(_getDescriptionFilterPlugin.call(this));
                _(this).filterPlugins.push(_getStatusFilterPlugin.call(this));
            }
            _(this).filterPlugins.push(_getLoginFilterPlugin.call(this));
            _(this).filterPlugins.push(_getFailedLoginsFilterPlugin.call(this));
            if (!this.isFederated) {
                _(this).filterPlugins.push(_getAuthModeFilterPlugin.call(this));
            }
            _(this).filterPlugins.push(_getCredentialFilterPlugin.call(this));
            _(this).filterPlugins.push(_getCurrentlyLoggedInPlugin.call(this));
            if (!this.isFederated) {
                _(this).filterPlugins.push(_getPasswordChangeTimeFilterPlugin.call(this));
                _(this).filterPlugins.push(_getPasswordAgeingFilterPlugin.call(this));
            }
            _(this).filterPlugins.push(_getRolesListFilterWidget.call(this));

        },

        getData: function() {
            var result = {};
            //TODO: Change this forEach loop to filterPlugins.map().filter()
            _(this).filterPlugins.forEach(function(plugin) {
                var pluginData;
                if ((pluginData = plugin.getData())) {
                    result[plugin.name] = pluginData[plugin.name];
                }
            });
            return result;
        },

        onViewReady: function() {
            this.view.findById('applyButton').addEventHandler('click', _triggerApply.bind(this));
            this.view.findById('clearButton').addEventHandler('click', _triggerClear.bind(this));
            this.view.findById('cancelButton').addEventHandler('click', _triggerCancel.bind(this));

            _(this).pluginContainer = this.view.findById('pluginContainer');

            _(this).filterPlugins.forEach(function(plugin) {
                if (plugin.useAccordion) {
                    var accordion = new Accordion({
                        title: plugin.title,
                        content: plugin,
                        expanded: plugin.expandOnStart
                    });

                    //in case when title is widget
                    if (typeof plugin.title !== 'string') {
                        plugin.title.addEventHandler('toggle', function(isExpanded) {
                            accordion.trigger(isExpanded ? 'collapse' : 'expand');
                        }.bind(this));
                    }

                    _(this).pluginContainer.append((accordion).getElement());
                } else {
                    _(this).pluginContainer.append(plugin.getElement());
                }
            }.bind(this));

            _addPluginsEvents.call(this);
        },

        setIsFederated: function(isFederated) {
            this.isFederated = isFederated;
        },

        onFilteredClear : function() {
            _triggerClear.call(this);
        }

    });

    function _getUsernameFilterPlugin() {
        return new TextInputFilterPlugin({
            title: Dictionary.filters.username.title,
            name: 'username',
            showTitle: true,
            applyOnEnter: true,
            placeholder: Dictionary.filters.username.placeholder,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.username : undefined

        });
    }

    function _getNameFilterPlugin() {
        return new TextInputFilterPlugin({
            title: Dictionary.filters.name.title,
            name: 'name',
            showTitle: true,
            applyOnEnter: true,
            placeholder: Dictionary.filters.name.placeholder,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.name : undefined

        });
    }

    function _getSurnameFilterPlugin() {
        return new TextInputFilterPlugin({
            title: Dictionary.filters.surname.title,
            name: 'surname',
            showTitle: true,
            applyOnEnter: true,
            placeholder: Dictionary.filters.surname.placeholder,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.surname : undefined

        });
    }

    function _getDescriptionFilterPlugin() {
        return new TextInputFilterPlugin({
            title: Dictionary.filters.description.title,
            name: 'description',
            showTitle: true,
            applyOnEnter: true,
            placeholder: Dictionary.filters.description.placeholder,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.description : undefined

        });
    }

    function _getStatusFilterPlugin() {
        return new RadioListFilterPlugin({
            title: Dictionary.filters.status.title,
            name: "status",
            disableInactive: false,
            useAccordion: true,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.status : undefined,
            elements: [{
                title: Dictionary.filters.all,
                value: 'all',
                status: false,
                group: 'status',
                checked: true
            }, {
                title: Dictionary.filters.status.enabled,
                value: "enabled",
                status: false,
                group: 'status'
            }, {
                title: Dictionary.filters.status.disabled,
                value: "disabled",
                status: false,
                group: 'status'
            }]
        });
    }

    function _getPasswordChangeTimeFilterPlugin() {
        return new RadioListFilterPlugin({
            title: Dictionary.filters.passwordExpiration.title,
            name: "expirationData",
            disableInactive: false,
            useAccordion: true,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.expirationData : undefined,
            elements: [{
                title: Dictionary.filters.all,
                value: 'all',
                status: false,
                group: 'expiry',
                checked: true
            }, {
                title: Dictionary.filters.passwordExpiration.expired,
                value: "expired",
                status: false,
                group: 'expiry'
            }, {
                title: Dictionary.filters.passwordExpiration.notExpired,
                value: "notexpired",
                status: false,
                group: 'expiry'
            }]
        });
    }

    function _getPasswordAgeingFilterPlugin() {
        return new RadioListFilterPlugin({
            title: Dictionary.filters.passwordAgeing.title,
            name: "passwordAgeing",
            disableInactive: false,
            useAccordion: true,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.passwordAgeing : undefined,
            elements: [{
                title: Dictionary.filters.all,
                value: 'all',
                status: false,
                group: 'ageing',
                checked: true
            }, {
                title: Dictionary.filters.passwordAgeing.system,
                value: "system",
                status: false,
                group: 'ageing'
            }, {
                title: Dictionary.filters.passwordAgeing.custom,
                value: "custom",
                status: false,
                group: 'ageing'
            }]
        });
    }

    function _getLoginFilterPlugin() {
        return new LoginFilterPlugin({
            title: Dictionary.filters.login.title,
            name: "lastLogin",
            disableInactive: false,
            useAccordion: true,
            group: 'lastLogin',
            defaultValue: _(this).defaultValue ? _(this).defaultValue.lastLogin : undefined
        });
    }

    function _getFailedLoginsFilterPlugin() {
        return new RadioListFilterPlugin({
            title: Dictionary.filters.failedLogins.title,
            name: "failedLogins",
            disableInactive: false,
            useAccordion: true,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.failedLogins : undefined,
            elements: [{
                title: Dictionary.filters.all,
                value: "all",
                status: false,
                group: 'failedLogins',
                checked: 'true'
            }, {
                title: Dictionary.filters.failedLogins.withfailed,
                value: "withfailed",
                status: false,
                group: 'failedLogins'
            }, {
                title: Dictionary.filters.failedLogins.withoutfailed,
                value: "withoutfailed",
                status: false,
                group: 'failedLogins'
            }]
        });
    }

    function _getCredentialFilterPlugin() {
        return new CheckListFilterPlugin({
            title: Dictionary.filters.credentialStatus.title,
            name: "credentialStatus",
            disableInactive: false,
            useAccordion: true,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.credentialStatus : undefined,
            elements: [{
                title: Dictionary.filters.credentialStatus.new,
                value: "NEW",
                status: false,
            }, {
                title: Dictionary.filters.credentialStatus.active,
                value: "ACTIVE",
                status: false,
            }, {
                title: Dictionary.filters.credentialStatus.inactive,
                value: "INACTIVE",
                status: false,
            }, {
                title: Dictionary.filters.credentialStatus.deleted,
                value: 'DELETED',
                status: false
            }, {
                title: Dictionary.filters.credentialStatus.not_applicable,
                value: 'NOT APPLICABLE',
                status: false
            }]
        });
    }

    function _getCurrentlyLoggedInPlugin() {
        return new RadioListFilterPlugin({
            title: Dictionary.filters.loggedIn.title,
            name: "currentlyLoggedIn",
            disableInactive: false,
            useAccordion: true,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.currentlyLoggedIn : undefined,
            elements: [{
                title: Dictionary.filters.all,
                value: "all",
                status: false,
                group: 'loggined',
                checked: 'true'
            }, {
                title: Dictionary.filters.loggedIn.yes,
                value: "true",
                status: false,
                group: 'loggined'
            }, {
                title: Dictionary.filters.loggedIn.no,
                value: "false",
                status: false,
                group: 'loggined'
            }]
        });
    }

    function _getRolesListFilterWidget() {
        return new RolesListFilterWidget({
            title: new RolesAccordionFilterWidget(),
            name: "roles",
            disableInactive: false,
            useAccordion: true,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.roles : undefined, //TODO
        });
    }

    function _getAuthModeFilterPlugin() {
        return new RadioListFilterPlugin({
            title: Dictionary.filters.authMode.title,
            name: "authMode",
            disableInactive: false,
            useAccordion: true,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.authMode : undefined,
            elements: [{
                title: Dictionary.filters.all,
                value: 'all',
                status: false,
                group: 'authMode',
                checked: true
            }, {
                title: Dictionary.filters.authMode.local,
                value: "local",
                status: false,
                group: 'authMode'
            }, {
                title: Dictionary.filters.authMode.remote,
                value: "remote",
                status: false,
                group: 'authMode'
            }]
        });
    }


    function _addPluginsEvents() {
        _(this).filterPlugins.forEach(function(plugin) {
            plugin.addEventHandler('plugin:apply', _triggerApply.bind(this));
        }.bind(this));
    }

    function _triggerApply() {
        this.trigger('filter:apply', this.getData());
    }

    function _triggerClear() {
        _(this).filterPlugins.forEach(function(plugin) {
            plugin.clear();
        });

        this.trigger('filter:clear');
    }

    function _triggerCancel() {
        Container.getEventBus().publish('flyout:hide');
    }

});
