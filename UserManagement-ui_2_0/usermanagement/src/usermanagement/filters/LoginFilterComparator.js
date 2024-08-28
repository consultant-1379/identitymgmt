define([
    'jscore/core',
    'identitymgmtlib/FilterComparator',
    'identitymgmtlib/SystemTime',
], function(core, FilterComparator, systemTime) {
    'use strict';

    return FilterComparator.extend({
        filter: function(value, filterCriteria) {
            return filterCriteria.some(function(criteria) {
                if (criteria === "NEVER_LOGGED_IN" && (value === null || value === undefined)) {
                    return true;
                }
                else if(criteria.LOGGED_WITHIN) {
                    return systemTime.isAfter(value, criteria.LOGGED_WITHIN);
                }
                else {
                    return false;
                }
            });
        }
    });
});