/*------------------------------------------------------------------------------
 *******************************************************************************
  * COPYRIGHT Ericsson 2016
  *
  * The copyright to the computer program(s) herein is the property of
  * Ericsson Inc. The programs may be used and/or copied only with written
  * permission from Ericsson Inc. or in accordance with the terms and
  * conditions stipulated in the agreement/contract under which the
  * program(s) have been supplied.
  *******************************************************************************
 -----------------------------------------------------------------------------*/

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
    'i18n!targetmanagement/app.json',
    'identitymgmtlib/Utils',
    'identitymgmtlib/widgets/CheckList',
    'jscore/ext/privateStore',
    'identitymgmtlib/filters/FilterPlugin',
    'widgets/Accordion',
    'identitymgmtlib/filters/TextInputFilterPlugin',
], function(core, net, Container, View, Dictionary, utils, CheckList, PrivateStore, FilterPlugin, Accordion, TextInputFilterPlugin) {

    var _ = PrivateStore.create();

    return core.Widget.extend({
        init: function(options) {
            this.view = new View({
                buttons: {
                    apply: Dictionary.filter.apply,
                    clear: Dictionary.filter.clear,
                    cancel: Dictionary.filter.cancel
                }
            });

            this.locationController = options.locationController;
            _(this).defaultValue = options.defaultValue;

            _(this).filterPlugins = [];
            _(this).filterPlugins.push(_getTargetGroupNameFilterPlugin.call(this));
        },

        getData: function() {
            var result = {};
            _(this).filterPlugins.forEach(function (plugin) {
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

            _(this).filterPlugins.forEach(function (plugin) {
                if(plugin.showTitle && plugin.useAccordion){
                    _(this).pluginContainer.append((new Accordion({
                        title: plugin.title,
                        content: plugin,
                        expanded: plugin.expandOnStart
                    })).getElement());
                } else {
                    _(this).pluginContainer.append(plugin.getElement());
                }
            }.bind(this));

            _addPluginsEvents.call(this);
        },

        onFilteredClear : function() {
            _triggerClear.call(this);
        },

        setFilterValues: function(FilterValues) {
            _(this).filterPlugins.forEach(function (plugin) {
                if (plugin.updateValue) {
                    plugin.updateValue(FilterValues);
                }
            }.bind(this));
        }
    });

    function _getTargetGroupNameFilterPlugin() {
        return new TextInputFilterPlugin({
            title: Dictionary.filter.target_group_name,
            placeholder: Dictionary.filter.type_to_filter_by_target_name,
            name: 'name',
            showTitle: false,
            applyOnEnter: true,
            defaultValue: _(this).defaultValue ? _(this).defaultValue.name : undefined

        });
    }

    function _addPluginsEvents() {
        _(this).filterPlugins.forEach(function (plugin) {
            plugin.addEventHandler('plugin:apply', _triggerApply.bind(this));
        }.bind(this));
    }

    function _triggerApply() {
        this.trigger('filter:apply', this.getData());
    }

    function _triggerClear() {
        _(this).filterPlugins.forEach(function (plugin) {
            plugin.clear();
        });
        this.trigger('filter:clear');
    }

     function _triggerCancel() {
        Container.getEventBus().publish('flyout:hide');
    }
});
