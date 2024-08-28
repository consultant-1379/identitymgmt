define([
    'jscore/core',
    'identitymgmtlib/FilterComparator'
], function(core, FilterComparator) {
    'use strict';

    return FilterComparator.extend({
        filter: function(value, filterCriteria) {
            return filterCriteria.some(function(criteria) {
                if (criteria === "withfailed" && value !== null && value !== undefined && value !== 0) {
                    return true;
                }
                else if (criteria === "withoutfailed" && (value === null || value === undefined || value === 0)) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }
    });
});