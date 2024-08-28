/*global define, Promise */
define([
    './MockServer'
], function (mockServer) {
    'use strict';

    //----------------------------------------------------------------- Exposed Service API
    function getDataLength() {
        return mockServer.getDataLength();
    }

    function setData(data, resetFilter) {
        mockServer.initMockData(data, resetFilter);
    }

    function setFilter(filters) {
        mockServer.setFilter(filters);
    }

    function loadData(index, length, sortAttr, sortMode) {
        /*jshint validthis:true */
        return new Promise(function (resolve, reject) {
            mockServer.getData({
                sortAttr: sortAttr,
                sortMode: sortMode,
                index: index,
                length: length,
                success: function (res) {
                    resolve({
                        data: res.data,
                        totalLength: res.length
                    });
                }.bind(this),
                error: reject
            });
        }.bind(this));
    }

    function getIds(a, b, sortAttr, sortMode) {
        /*jshint validthis:true */
        return new Promise(function (resolve, reject) {
            var aIsBeforeB = (a < b),
                startId = aIsBeforeB ? a : b,
                endId = aIsBeforeB ? b : a;
                mockServer.getIds({
                    sortAttr: sortAttr,
                    sortMode: sortMode,
                    startId: startId,
                    endId: endId,
                    success: resolve,
                    error: reject
                });

        }.bind(this));
    }

    function getAllIds(sortAttr, sortMode) {
        /*jshint validthis:true */
        return new Promise(function (resolve, reject) {
            mockServer.getAllIds({
                sortAttr: sortAttr,
                sortMode: sortMode,
                success: resolve,
                error: reject
            });
        });
    }

    var dataService = {
        getDataLength: getDataLength,
        loadData: loadData,
        setData: setData,
        setFilter: setFilter,
        getIds: getIds,
        getAllIds: getAllIds
    };

    return dataService;
});
