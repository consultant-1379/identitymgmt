define([
    'jscore/core'
], function (core) {

    /**
     * FiterPlugin is "inteface" that should help to create filter plugins for filtering widgets which
     * should implement getData and clear methods
     * "FilterPlugin.prototype.init" method should me called in child's "init" method.
     *             enter is pressed
     * }
     * Widgets that extends on this interface should implement or use logic of these parameters by their own.
     *
     */
    var FilterPlugin = core.Widget.extend({
        /**
         * @param options:
         * {
         *  title: String - title of plugin that will be displayed (optional)
         *  name: String - name of variable that will be returned in getData method (mandatory)
         *  useAccordion: boolean - if true plugin will be wrapped by Accordion element (default: false)
         *  expandOnStart: boolean - defines if plugin will be visible on start (default: true)
         *  applyOnChange: boolean - defines if event "plugin:apply" will be triggered on value change (default: false)
         *  applyOnEnter: boolean - used for text inputs plugins, defines if event "plugin:apply" will be triggered when
         *  disableInactive: boolean - disable inactive options, i.e. when click on one item and second shouldn't be available
         *  defaultValue: Object - intial value of the filterPlugin, should have same structure as returned in getData()
         * }
         */
        init: function (options) {
            this.title = options.title;
            this.name = options.name;
            this.useAccordion = options.useAccordion === undefined ? false : options.useAccordion;
            this.showTitle = options.showTitle === undefined ? true : options.showTitle;
            this.expandOnStart = options.expandOnStart === undefined ? true : options.expandOnStart;
            this.applyOnChange = options.applyOnChange || false;
            this.applyOnEnter = options.applyOnEnter || false;
            this.disableInactive = options.disableInactive || false;
            this.defaultValue = options.defaultValue;
        }
    });

    /**
     * This method should be implemented in every child of FilterPlugin
     *
     * @returns filter data object with defined by user structure
     *
     */

    FilterPlugin.prototype.getData = function (){
        throw new Exception("getData function should be implemented");
    };

    FilterPlugin.prototype.clear = function (){
        throw new Exception("clear function should be implemented");
    };

    return FilterPlugin;
});
