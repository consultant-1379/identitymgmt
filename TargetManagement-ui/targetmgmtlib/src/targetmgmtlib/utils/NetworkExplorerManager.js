define([
    'jscore/ext/net',
    'i18n!identitymgmtlib/error-codes.json',
    'identitymgmtlib/Utils'
], function(net, Dictionary, Utils) {

    /* Get query string from SavedSearch PoId and Get PoIds List executing that query */
    var getQueryFromSaveSearchIdPromise = function(savedSearchId) {
        return new Promise(function(resolve, reject) {
            net.ajax({
                url: '/topologyCollections/savedSearches/' + savedSearchId,
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    resolve(response.searchQuery);
                },
                error: function (err,response) {
                    reject(response);
                }
            });
        });
    };

    var getPoListFromSearchQueryPromise = function(searchQuery) {
        return new Promise(function(resolve, reject) {
            net.ajax({
                url: '/managedObjects/query/?searchQuery=' + encodeURIComponent(searchQuery) + '&fullMo=false',
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    resolve(response.poList);
                },
                error: function (err, response) {
                    reject(response);
                }
            });
        });
    };

    /* Get PoIds List From collection PoId */
    var getPoListFromCollectionPromise = function (id) {
        return new Promise(function (resolve, reject) {
                net.ajax({
                    url: '/object-configuration/collections/v4/' + id+'?includeContents=true',
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response) {
                        var poList = [];
                        if (response.contents) {
                            response.contents.forEach(function (object) {
                                poList.push(object.id);
                            }.bind(this));
                        }
                        resolve(poList);
                    },
                    error: function (err, response) {
                        reject(response);
                    }
                });
            });
    };

    /* Divide PoIds list in chunk of 250 PoIds and get node information (Name and type)*/
    var getNodesFromPoListPromise = function(poList) {
        var promises = [];
        var i,j,chunk = 250;
        for (i=0,j=poList.length; i<j; i+=chunk) {
            promises.push(getChunkOfPoListFromRootAssociationPromise(poList.slice(i,i+chunk)));
        }
        return new Promise(function (resolve, reject) {
             Promise.all(promises)
                .then(resolve)
                .catch(reject);
        });
    };

    /* Get NeTpe PoId from Mirrored */
    var getChunkOfPoListFromRootAssociationPromise = function(poList) {
        return new Promise(function(resolve, reject) {
            if (poList.length !== 0) {
                net.ajax({
                    url: '/persistentObject/rootAssociations/',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "poList": poList,
                    }),
                    success: function (response) {
                        var poList = response.map(function(node) {
                            return node.id;
                        });
                        resolve(getChunkOfNodesFromPoListPromise(poList));
                    },
                    error: function (err, response) {
                        reject(response);
                    }
                });
            } else {
                var responseList = [];
                resolve(responseList);
            }
        });
    };

    /* Get NeTpe and Node Name from PoId */
    var getChunkOfNodesFromPoListPromise = function(poList) {
        return new Promise(function(resolve, reject) {
            if (poList.length !== 0) {
                net.ajax({
                    url: '/managedObjects/getPosByPoIds/',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "poList": poList,
                        "attributeMappings":[{"moType":"NetworkElement","attributeNames":["neType", "platformType"]}]
                    }),
                    success: function (response) {
                        var nodeInfoList = response.map(function(node) {
                            return {
                                name: node.moName ? node.moName : Utils.printf(Dictionary.defaultHttpMessages.invalid_target, node.moName),
                                targetTypeName: node.attributes.neType,
                                valid: node.mibRootName ? true : false
                            };
                        });
                        resolve(nodeInfoList);
                    },
                    error: function (err, response) {
                        reject(response);
                    }
                });
            } else {
                var responseList = [];
                resolve(responseList);
            }
        });
    };

    /* Get NeTpe and Node Name from Saved Search PoId */
    var getNodesFromSaveSearchPromise = function (id) {
        return new Promise(function (resolve, reject) {
            getQueryFromSaveSearchIdPromise(id)
                .then(getPoListFromSearchQueryPromise)
                .then(getNodesFromPoListPromise)
                .then(resolve)
                .catch(reject);
        });
    };

    /* Get NeTpe and Node Name from Collection PoId */
    var getNodesFromCollectionPromise = function (id) {
        return new Promise(function (resolve, reject) {
            getPoListFromCollectionPromise(id)
                .then(getNodesFromPoListPromise)
                .then(resolve)
                .catch(reject);
        });
    };

    return {
        /**
         * Generates function that will get list of nodes for specified collection or seavesearch id.
         * @param config
         * * {
         *  type: (mandatory) ['collections' | 'savedsearches' ],
         *  success: (mandatory) callback which will be called with array with result as parameter when successful
         *  error: (mandatory) callback wchich will be called with error message when error
         * }
         *
         * @returns {Function}

         */
        reloadTargets: function (config) {
            var promises = [];

            if ( config.type === 'collections')  {
                config.data.forEach(function (id) {
                    promises.push(getNodesFromCollectionPromise(id));
                }.bind(this));

            } else if ( config.type === 'savedSearches') {
                config.data.forEach(function (id) {
                    promises.push(getNodesFromSaveSearchPromise(id));
                }.bind(this));

            } else {
                promises.push(getNodesFromPoListPromise(config.data));
            }

            Promise.all(promises)
                .then(config.success)
                .catch(config.error);
        }
    };
});