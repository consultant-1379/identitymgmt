/*global define, Promise */
define([
], function () {
    'use strict';

    /**
     * This module emulates the connection with a server while mimicking the API of net.ajax.
     *
     * /!\ The module was designed to run exclusively with the example e.g. no shared references.
     */

    var serverData, serverDataById, serverDataFilters;

    function initMockData(data, resetFilter) {
        data.forEach(function(obj, index) { obj.id = index.toString(); });
        serverData = data;
        serverDataById = {};
        if ( resetFilter ) {
            serverDataFilters = {};
        }

        serverData.forEach(function (item, index) {
            serverData[index] = item;
            serverDataById[item.id] = item;
        });
    }

    function setFilter(filters) {
        serverDataFilters = filters;
    }

    function getDataFiltered() {
        var data = serverData.slice();

        if ( serverDataFilters.targetTypeName && serverDataFilters.targetTypeName !== "" ) {
            data = data.filter(function (item) {
                return compareString(serverDataFilters.targetTypeName, item.targetTypeName);
            });
        }

        if ( serverDataFilters.name && serverDataFilters.name !== "" ) {
            data = data.filter(function (item) {
                return compareString(serverDataFilters.name, item.name);
            });
        }
        return data;
    }

    //-----------------------------------------------------------------

    function checkCurrentSortingWithRequestSorting(options) {
        /*jshint validthis:true */
        if (!this.serverSortAttr && !this.serverSortMode || (this.serverSortAttr !== options.sortAttr || this.serverSortMode !== options.sortMode)) {
            sortData(options.sortAttr, options.sortMode);

            this.serverSortAttr = options.sortAttr;
            this.serverSortMode = options.sortMode;
        }
    }

    function sortData(attribute, sortMode) {
        var sortFunc = function (a, b) {
            var comp = a[attribute].localeCompare(b[attribute]);
            return sortMode === 'asc' ? comp : comp * -1;
        };

        if (attribute === 'id') {
            sortFunc = function (a, b) {
                return sortMode === 'asc' ? a[attribute] - b[attribute] : b[attribute] - a[attribute];
            };
        }

        serverData.sort(sortFunc);
    }

    function getDataSegment(start, end) {
        return getDataFiltered().slice(start, end);
    }

    //----------------------------------------------------------------- Exposed Mock Server API

    function getDataLength() {
        return getDataFiltered().length;
    }

    function getIds(options) {
        /*jshint validthis:true */
        checkCurrentSortingWithRequestSorting.call(this, options);

        var startItem = serverDataById[options.startId],
            endItem = serverDataById[options.endId],
            indexA = getDataFiltered().indexOf(startItem),
            indexB = getDataFiltered().indexOf(endItem),
        // based on the current sort mode, the index can be reversed
        // the data is stored in an array (ascending order indexes)
            sortedIndexes = [indexA, indexB].sort(function (a, b) {  return a - b;});

        options.success(
            getDataSegment(sortedIndexes[0], sortedIndexes[1] + 1).map(function (item) {
                return item.id;
            })
        );
    }

    function getAllIds(options) {
        /*jshint validthis:true */
        checkCurrentSortingWithRequestSorting.call(this, options);

        options.success(
            getDataFiltered().map(function (item) {
                return item.id;
            })
        );
    }

    function getData(options) {
        /*jshint validthis:true */
        checkCurrentSortingWithRequestSorting.call(this, options);
//        console.log( " getData " + options.index + " len " + options.length);

        options.success({
            data: getDataSegment(options.index, options.index + options.length),
            length: getDataFiltered().length
        });
    }

    function compareString(filterValue, itemValue) {
        return itemValue.toLocaleLowerCase().indexOf(filterValue.toLocaleLowerCase()) !== -1;
    }


    return {
        getData: getData,
        getIds: getIds,
        getAllIds: getAllIds,
        getDataLength: getDataLength,
        initMockData: initMockData,
        setFilter: setFilter
    };
});
