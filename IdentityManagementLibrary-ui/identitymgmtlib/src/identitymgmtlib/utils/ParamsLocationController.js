define([
    'jscore/core',
    'jscore/ext/privateStore',
    'jscore/ext/locationController',
    'identitymgmtlib/Utils',
], function(core, PrivateStore, LocationController, Utils) {

    var _ = PrivateStore.create();

    function _parameterValueChanged(paramName, newParamValue) {
        return !(_(this).container[paramName] && Utils.equals(newParamValue, _(this).container[paramName]));
    }

    /**
     * Function updates parameters from URL. Event for parameter is called if value is changed.
     *
     * @method _updateParamsFromUrl
     * @private
     *
     **/
    function _updateParamsFromUrl() {
        var tmpContainer = Utils.parseHash(this.getLocation()).query;
        //Find differences in variables from URL
        Object.keys(tmpContainer).forEach(function(key) {
            if (_parameterValueChanged.call(this, key, tmpContainer[key])) {
                _(this).events.publish(key, tmpContainer[key]);
            }
        }.bind(this));

        _(this).container = tmpContainer;
    }

    /**
     * Function updates parameters from URL. Event for parameter is called if value is changed.
     *
     * @method _updateParamsAsStringFromUrl
     * @private
     *
     **/
    function _updateParamsAsStringFromUrl() {
        var tmpContainer = Utils.parseHashAsString(this.getLocation()).query;
       //Find differences in variables from URL
        Object.keys(tmpContainer).forEach(function(key) {
            if (_parameterValueChanged.call(this, key, tmpContainer[key])) {
                _(this).events.publish(key, tmpContainer[key]);
            }
        }.bind(this));

        _(this).container = tmpContainer;
    }

    function _updateUrlFromParams(preventEvent, history) {
        this.setLocation(_generateUrlFromParameters.call(this), preventEvent || false, history === undefined ? true : !history);
    }


    function _generateUrlFromParameters() {
        var hash = this.getLocation().split("?")[0];

        if (Object.keys(_(this).container).length > 0) {
            return hash + "?" + Utils.convertObjectToQueryString(_(this).container);
        }
        return hash;
    }

    return LocationController.extend({
        init: function(options) {
            _(this).container = Utils.parseHash(this.getLocation()).query;
            _(this).events = new core.EventBus();
            this.addLocationListener(_updateParamsFromUrl.bind(this));
        },

        /**
         * Sets passed as argument parameter to url. If preventEvent parameter is true, changing url will not cause parameter event.
         *
         * @method setParameter
         * @param paramName
         * @param paramValue
         * @param preventEvent (optional) default is false
         **/
        setParameter: function(paramName, paramValue, preventEvent, history) {
            if ((!preventEvent) && _parameterValueChanged.call(this, paramName, paramValue)) {
                _(this).events.publish(paramName, paramValue);
            }
            _(this).container[paramName] = paramValue;

            _updateUrlFromParams.call(this, preventEvent, history);
        },

        /**
         * Sets passed as argument parameter to url. If preventEvent parameter is true, changing url will not cause parameter event.
         *
         * @method setParameter
         * @param paramName
         * @param paramValue
         * @param preventEvent (optional) default is false
         **/
        setParameters: function(params, preventEvent, history) {
            for (var i in params) {
                if ((!preventEvent) && _parameterValueChanged.call(this, i, params[i])) {
                    _(this).events.publish(i, params[i]);
                }
                _(this).container[i] = params[i];
            }
            _updateUrlFromParams.call(this, preventEvent, history);
        },

        removeParameter: function(paramName, history) {
            delete _(this).container[paramName];
            _updateUrlFromParams.call(this, true, history);
        },

        getParameter: function(paramName) {
            return this.getParameters()[paramName];
        },

        getParameterAsString: function(paramName) {
            return this.getParametersAsString()[paramName];
        },

        /**
         * It updates parameters from URL and returns object. It must update before each execute
         * because if params will be updated only when Location Listener trigger, we would have
         * not actual data when someone will change location/namespace with "preventListener"
         * parameter set as true
         *
         * @getParameters
         * @returns {Object} parameters rode from URL
         **/
        getParameters: function() {
            _updateParamsFromUrl.call(this);
            return _(this).container;
        },

        /**
         * It updates parameters from URL and returns object. It must update before each execute
         * because if params will be updated only when Location Listener trigger, we would have
         * not actual data when someone will change location/namespace with "preventListener"
         * parameter set as true
         *
         * @getParametersAsString
         * @returns {Object} parameters rode from URL
         **/
        getParametersAsString: function() {
            _updateParamsAsStringFromUrl.call(this);
            return _(this).container;
        },

        /**
         * Works same like jscore/core/EventBus.subscribe
         *
         * @method addParameterListener
         * @param paramName
         * @param callback
         *
         **/

        addParameterListener: function(paramName, callback) {
            return _(this).events.subscribe(paramName, callback);
        },

        /**
         * Works same like jscore/core/EventBus.unsubscribe
         *
         * @method removeParameterListener
         * @param channel
         * @param identifier
         *
         **/
        removeParameterListener: function(channel, identifier) {
            _(this).events.unsubscribe(channel, identifier);
        }

    });

});
