define([
    'jscore/core',
    'jscore/ext/net',
    'jscore/ext/privateStore',
    'jscore/ext/utils/base/underscore',
    'identitymgmtlib/FilterComparator'
], function(core, net, PrivateStore, underscore, FilterComparator) {
    'use strict';

    var _ = PrivateStore.create();

    // 
     
    /**
     * Returns comparator with uniqueID - if options.uniqueID is available this comparator will be used
     * @param  {Object} query   query provided through whole data processing
     * @return {Function}       comparator
     * @private
     */
    var getComparatorWithUniqueID = function(query) {
        var sort_attribute = query.sort.attribute;
        var sort_order = query.sort.order === 'asc' ? 1 : -1;
        return function(a, b) {
            var _a = String(a[sort_attribute]).toLowerCase();
            var _b = String(b[sort_attribute]).toLowerCase();
            if (sort_attribute === "failedLogins") {
                // numerical ordering
                _a = a[sort_attribute];
                _b = b[sort_attribute];
            }
            if (_a < _b) {
                return sort_order * -1;
            } else if (_a > _b) {
                return sort_order * 1;
            } else {
                // if original element is equals then sort according to unique element
                var _aUnique = a[_(this).uniqueID].toLowerCase();
                var _bUnique = b[_(this).uniqueID].toLowerCase();
                if (_aUnique < _bUnique)
                    return sort_order * -1;
                else if (_aUnique > _bUnique)
                    return sort_order * 1;
                else
                    return 0;
            }
        }.bind(this);
    };

    /**
     * Returns simple comparator - if options.uniqueID is not avaiable then use simple comparator
     * @param  {Object} query   query provided through whole data processing
     * @return {Function}       comparator
     * @private
     */
    var getSimpleComparator = function(query) {
        var sort_attribute = query.sort.attribute;
        var sort_order = query.sort.order === 'asc' ? 1 : -1;
        return function(a, b) {
            var _a = String(a[sort_attribute]).toLowerCase();
            var _b = String(b[sort_attribute]).toLowerCase();
            if (sort_attribute === "failedLogins") {
                // numerical ordering
                _a = a[sort_attribute];
                _b = b[sort_attribute];
            }
            if (_a < _b) {
                return sort_order * -1;
            } else if (_a > _b) {
                return sort_order * 1;
            } else {
                return 0;
            }
        }.bind(this);
    };

    /**
     * @constructor
     * @param {Object} options
     */
    function DataHandler(options) {
        // choose comparator function
        if (options && options.uniqueID) {
            _(this).uniqueID = options.uniqueID;
            _(this).getComparator = getSimpleComparator; // getComparatorWithUniqueID;
        } else {
            _(this).getComparator = getSimpleComparator;
        }

        _(this).url = options && options.url;
        this.federated = options && options.federated;
        _(this).previousQuery = {
            data: []
        };

        _(this).updateData = options && options.updateData || null;

        _(this).comparators = {};
        _(this).comparators.filter = {};
        _(this).comparators.filter.default = new FilterComparator();
        for (var comparatorId in options && options.filter && options.filter.comparators) {
            _(this).comparators.filter[comparatorId] = new options.filter.comparators[comparatorId]();
        }

        if (this.init) {
            this.init(options);
        }
    }

    /**
     * Gets total data size
     * @return {int}
     */
    DataHandler.prototype.getTotalSize = function() {
        return _(this).data.length;
    };

    /**
     * Gets previous filter, sort or whole query object
     * @param  {String} attibute 
     * @return {Object} 
     */
    DataHandler.prototype.getPrevious = function(attribute) {
        switch (attribute) {
            case 'filter':
                return _(this).previousQuery.filter;
            case 'sort':
                return _(this).previousQuery.sort;
            default:
                return _(this).previousQuery;
        }
    };

    /**
     * Gets previously processed data (without Promise)
     * @return {Array}
     */
    DataHandler.prototype.getProcessedData = function(query) {
        return this.getPrevious().data;
    };



    /**
     * Gets data
     * @param  {Object} query - query with filter and sort
     * @return {Promise}
     */
    DataHandler.prototype.getData = function(query) {
        return new Promise(function(resolve, reject) {
            Promise.resolve(query || {})
                .then(this.fetchData.bind(this))
                .then(this.changeData.bind(this))
                .then(this.sortData.bind(this))
                .then(this.filterData.bind(this))
                .then(function(query) {
                    _(this).previousQuery = underscore.clone(query);
                    resolve(query.data);
                }.bind(this))
                .catch(function(error) {
                    console.error(error);
                    reject(arguments);
                });
        }.bind(this));
    };


    /**
     * Update data from server.
     * @param  {Object} query
     * @return {Promise}
     */
    DataHandler.prototype.changeData = function(query) {
        return new Promise(function(resolve, reject) {
            if (_(this).updateData) {
                _(this).updateData(query);
            }
            resolve(query);
        }.bind(this));
    };

    /**
     * Fetches data from server or privide from cache
     * @param  {Object} query - query.force
     * @return {Promise}
     */
    DataHandler.prototype.fetchData = function(query) {
        return new Promise(function(resolve, reject) {
            if (!(_(this).data) || query.force) {
                // Cancel any existing request if any
                if (_(this).pageXhr) {
                    _(this).pageXhr.abort();
                }
                // Request from backend
                _(this).pageXhr = net.ajax({
                    url: _(this).url,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        _(this).data = data;
                        query.data = _(this).data;
                        resolve(query);
                    }.bind(this),
                    error: reject
                });
            } else {
                query.data = _(this).data;
                resolve(query);
            }
        }.bind(this));
    };

    /**
     * Sort data if needed according to provided {sort} param in query
     * @param  {Object} query - query.sort
     * @return {Object}
     */
    DataHandler.prototype.sortData = function(query) {
        if (query.sort) {
            query.data.sort(_(this).getComparator.call(this, query));
        }
        return query;
    };

    /**
     * Filter data if needed according to provided {filter} param in query
     * @param  {Object} query - query.filter
     * @return {Object}
     */
    DataHandler.prototype.filterData = function(query) {
        if (query.filter) {
            // Filter data
            query.data = query.data.filter(function(element) {
                for (var prop in query.filter) {
                    var comparator = _(this).comparators.filter[prop] || _(this).comparators.filter.default;
                    if(!comparator.filter(element[prop], query.filter[prop])) {
                        return false;
                    }
                }
                return true;
            }.bind(this));
        }
        return query;
    };

    DataHandler.extend = core.extend;

    return DataHandler;

});