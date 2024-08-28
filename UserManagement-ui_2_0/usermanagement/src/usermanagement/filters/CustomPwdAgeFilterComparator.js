define([
    'jscore/core',
    'identitymgmtlib/FilterComparator'
], function(core, FilterComparator) {
    'use strict';

    return FilterComparator.extend({

        filter: function(value, filterCriteria) {
            return filterCriteria.some(function(criteria) {
                if(criteria === "custom") {
                    if (value === null || value === undefined ||
                            value.customizedPasswordAgeingEnable === null ||
                            value.customizedPasswordAgeingEnable === undefined ||
                            value.customizedPasswordAgeingEnable === false) {
                        return false;
                    } else { //requested customized true
                        return true;
                    }
                } else { //system criteria
                    if (value === null || value === undefined ||
                            value.customizedPasswordAgeingEnable === null ||
                            value.customizedPasswordAgeingEnable === undefined ||
                            value.customizedPasswordAgeingEnable === false) {
                        return true;
                    } else { //requested customized true
                        return false;
                    }
                }
            }.bind(this));
        }
    });
});
