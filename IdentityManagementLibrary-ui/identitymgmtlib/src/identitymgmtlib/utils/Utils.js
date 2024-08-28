define([
    'widgets/Dialog',
    'i18n!identitymgmtlib/common.json',
    'layouts/SlidingPanels',
    'identitymgmtlib/regions/AccessControl',
    'i18n!identitymgmtlib/error-codes.json',
    'i18n/number'
], function(Dialog, i18n, SlidingPanelsLayout, AccessControlRegion, ErrorCodes, Number) {

    // A utility classed filled with random useful functions that are used
    // in multiple apps.

    /**
     * Parses the query variables from the URL and returns it
     * in an easier to read object format.
     *
     * @method getJsonFromUrl
     * @private
     * @param {String} path
     * @return {Object} props
     */
    function getJsonFromUrl(path) {

        var query = path.split("?").slice(1).join("?");
        var result = {};
        var decoded, parsed;

        query.split('&').forEach(function(part) {
            var item = part.split('=');
            decoded = decodeURIComponent(item[1]);
            try {
                parsed = JSON.parse(decoded);

            } catch(err) {
            } finally {
                result[item[0]] = (parsed !== undefined) ? parsed : decoded;
                parsed = undefined;
                decoded = undefined;
            }
        });
        return result;
    }

    /**
     * Parses the query variables from the URL and returns it
     * in an easier to read object format.
     *
     * @method getJsonAsStringFromUrl
     * @private
     * @param {String} path
     * @return {Object} props
     */
    function getJsonAsStringFromUrl(path) {
        var query = path.split("?").slice(1).join("?");
        var result = {};
        var decoded;
        query.split('&').forEach(function(part) {
            var item = part.split('=');
            decoded = decodeURIComponent(item[1]);
            result[item[0]] =  decoded;
        });
        return result;
    }

    return {

        /**
         * Compares objects.
         *
         * @method equals
         * @param {Object} obj1
         * @param {Object} obj2
         * @return {Boolean} result
         */
        equals: function(obj1, obj2) {
            // TODO: should be done in most efficent way
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        },

        /**
         * Splits the hash into the hash fragment and query variables.
         *
         * @method parseHash
         * @param {String} hash
         * @return {Object} props
         */
        parseHash: function(hash) {
            var query = {};
            var queryIndex = hash.indexOf('?');
            if (queryIndex >= 0) {

                query = getJsonFromUrl(hash);
                hash = hash.substring(0, queryIndex);
            }

            return {
                hash: hash,
                query: query
            };
        },

        /**
         * Splits the hash into the hash fragment and query variables.
         *
         * @method parseHashAsString
         * @param {String} hash
         * @return {Object} props
         */
        parseHashAsString: function(hash) {
            var query = {};
            var queryIndex = hash.indexOf('?');
            if (queryIndex >= 0) {
                query = getJsonAsStringFromUrl(hash);
                hash = hash.substring(0, queryIndex);
            }

            return {
                hash: hash,
                query: query
            };
        },

        /**
         * Creates a new object using the properties of the passed objects.
         *
         * @method mergeObjects
         * @param {Object} obj1
         * @param {Object} obj2
         * @return {Object} mergedObject
         */
        mergeObjects: function(obj1, obj2) {
            var output = {};
            var prop;
            for (prop in obj1) {
                output[prop] = obj1[prop];
            }

            for (prop in obj2) {
                output[prop] = obj2[prop];
            }

            return output;
        },

        /**
         * Creates a new object using the properties of the passed object, and affected fields.
         *
         * @method mergeSpecial
         * @param {Object} obj1
         * @param {Object} obj2
         * @param {Array<String>} fields
         * @return {Object} mergedObject
         */
        mergeSpecial: function(obj1, obj2, fields) {
            var output = {};
            var prop;
            if (obj1) {
                for (prop in obj1) {
                    output[prop] = obj1[prop];
                }
            }

            fields.forEach(function(prop) {
                delete output[prop];
            });

            if (obj2) {
                for (prop in obj2) {
                    output[prop] = obj2[prop];
                }
            }

            return output;
        },

        /**
         * Converts an object to a URL query string.
         *
         * @method convertObjectToQueryString
         * @param {Object} obj
         * @return {String} queryString
         */
        convertObjectToQueryString: function(obj) {
            var queryArray = [];

            for (var prop in obj) {
                if ( prop !== "savedUser")
                    queryArray.push(prop + '=' + encodeURIComponent(JSON.stringify(obj[prop])));
            }
            return queryArray.join('&');
        },

        /**
         * Capitalizes the first letter of the passed string.
         *
         * @method capitalizeFirstLetter
         * @param {String} string
         * @return {String} string
         */
        capitalizeFirstLetter: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        /**
         * Finds the color for the alarm type passed.
         *
         * @method getAlarmColor
         * @param {String} type
         * @return {String} color
         */
        getAlarmColor: function(type) {
            var colors = {
                "major": '#FF7300',
                'minor': '#FABB00',
                'warning': '#2379FF',
                'indeterminate': '#B1B3B4',
                'cleared': '#89BA17',
                'critical': '#E32219'
            };

            return colors[type];
        },


        /**
         * Returns object with messages
            {
                internalErrorCodeMessage: String,
                defaultHttpMessage: String
            }

            If message for _internalErrorCode is not found, internalErrorCodeMessage is undefined.
         */
        getErrorMessage: function(_httpStatusCode, _internalErrorCode) {
            var result = {}, internalErrorCodeMessage, httpStatusCodeMessage;
            if(_internalErrorCode && (internalErrorCodeMessage = ErrorCodes.internalErrorCodes[_internalErrorCode])) {
                result.internalErrorCodeMessage = internalErrorCodeMessage;
            }

            if(_httpStatusCode && (httpStatusCodeMessage = ErrorCodes.defaultHttpMessages[_httpStatusCode])) {
                result.defaultHttpMessage = httpStatusCodeMessage;
            } else {
                result.defaultHttpMessage = this.printf(ErrorCodes.defaultHttpMessages.unexpected, _httpStatusCode);
            }

            return result;
        },

        confirm: function(header, message, successCallback) {
            var defaultDialog = new Dialog({
                header: header,
                content: message,
                buttons: [{
                    caption: i18n.yes,
                    color: 'darkBlue',
                    action: function() {
                        defaultDialog.hide();
                        successCallback();
                    }
                }, {
                    caption: i18n.no,
                    action: function() {
                        defaultDialog.hide();
                    }
                }, ]
            });
            defaultDialog.show();
        },


        info: function(header, message) {
            var infoDialog = new Dialog({
                header: header,
                content: message,
                buttons: [
                    {caption: i18n.ok, color: 'darkBlue', action: function () { infoDialog.hide(); successCallback(); }},
                ]
            });
            infoDialog.show();
        },

        errorInfo: function(header, message) {
            var errorDialog = new Dialog({
                type: "error",
                header: header,
                content: message,
                buttons:
                    [
                        {caption: i18n.ok, color: 'darkBlue', action: function() { errorDialog.hide();} }
                    ],
            });

            errorDialog.show();
        },

        infoRedirect: function(header, message, successCallback) {
            var infoDialog = new Dialog({
                header: header,
                content: message,
                buttons: [
                    {caption: i18n.ok, color: 'darkBlue', action: function () { infoDialog.hide(); successCallback(); }},
                ]
            });
            infoDialog.show();
        },

        printf: function(pattern) {
            if (pattern && pattern !== '') {
                var args = arguments;
                return pattern.replace(/{(\d+)}/g, function(match, number) {
                    number = parseInt(number) + 1;

                    return typeof args[number] !== 'undefined' ? (typeof args[number] === "number" ? Number(args[number]).format("0,0") : args[number] ) : match;
                });
            }
        },

        createAccessControlRegion: function(appAvability) {
            var options = {
                context: this.getContext(),
                model: null,
                mode: null,
                params: {locationController: this.locationController}
            };
            if (!appAvability) {
                if(this.topSection !== null){
                    this.topSection.view.getActionBar().setStyle('visibility', 'hidden');
                }
                if(this.mainRegion !== undefined){
                    this.mainRegion.stop();
                }
                //Add reference to collection and model here
                this.mainRegion = new AccessControlRegion(options);
                if(this.slidingPanel !== undefined){
                    this.slidingPanel.destroy();
                }
                this.appAvailable = false;

                this.slidingPanel = new SlidingPanelsLayout(this.mainRegion);
                this.topSection.setContent(this.slidingPanel);
            }
        },

        removeChildAppsFromBreadcrumb: function(breadcrumbOptions) {
            breadcrumbOptions[1].children = [];
            return breadcrumbOptions;
        },

        isNotNullEmptyOrUndefined: function(text) {
            return (text !== '' && text !== null && text !== undefined);
        },

        isServiceRole : function(model) {
            return isServiceRole(model);
        },

        isServiceRoleByType : function(roleType) {
            return isServiceRoleByType(roleType);
        },

        isComRole : function(model) {
            return isComRole(model);
        },

        isComRoleByType : function(roleType) {
            return isComRoleByType(roleType);
        },

        type2String : function(type) {
            return type2String(type);
        },


        getAssignedTgsValue : function(model) {
            if (!model.get('tgs')) {
                // default value
                if( isServiceRole(model)) {
                    return 'ALL';
                } else {
                    return 'NONE';
                }
            } else if ( model.get('tgs').some( function(tg) { return tg==="ALL"; })) {
                return 'ALL';
            } else if ( model.get('tgs').length === 1 && model.get('tgs')[0] === "NONE" ) {
                return 'NONE';
            } else {
                return model.get('tgs').length;
            }
        },

        getUserSessions : function( username, sessions ) {
            var numSessions = 0;
            for ( var key in sessions) {
                if ( key.toLowerCase() === username.toLowerCase() ) {
                    numSessions = sessions [ key ];
                }
            }
            return numSessions;
        },

        replaceALL: function(target, search, replacement) {
            return target.replace(new RegExp(search, 'g'), replacement);
        }
    };

    function isServiceRole(model) {
        if ( model.getAttribute('privileges') !== undefined ) {
            return true;
        }

        var roleType = model.get('type');
        return isServiceRoleByType(roleType);
    }

    function isComRole(model) {
        if ( model.getAttribute('privileges') !== undefined ) {
            return false;
        }

        var roleType = model.get('type');
        return isComRoleByType(roleType);
    }

    function isServiceRoleByType(roleType) {
        return roleType === 'system' || roleType === 'application' || roleType === 'custom';
    }

    function isComRoleByType(roleType) {
        return roleType === 'com' || roleType === 'comalias';
    }

    function type2String(type) {
        switch (type.toLowerCase()) {
            case 'com':
                return i18n.typeCell.RoleTypeCom;
            case 'comalias':
                return i18n.typeCell.RoleTypeAlias;
            case 'custom':
                return i18n.typeCell.RoleTypeCustom;
            case 'application':
            case 'system':
                return i18n.typeCell.RoleTypeSystem;
            case 'cpp':
                return i18n.typeCell.RoleTypeCpp;
        }
        return undefined;
    }

//    function pad2(number) {
//        return number < 10? "0" + number : number;
//    }

});
