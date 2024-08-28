define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'identitymgmtlib/FilterComparator',
    'i18n!identitymgmtlib/common.json'
], function(core, _, FilterComparator, Dictionary) {
    'use strict';

    return FilterComparator.extend({
        filter: function(userRoles, filterCriteria) {
            if (filterCriteria.assigned.length === 0 && filterCriteria.not_assigned.length === 0) {
                return true;
            }
            var not_assigned = userRoles.some(function(value) {
                return filterCriteria.not_assigned.indexOf(value) > -1;
            });

            if (not_assigned) {
                return false;
            } else {
                //check if userRoles not contains required filterCriteria roles
                return !filterCriteria.assigned.some(function(roleName) {
                    return userRoles.indexOf(roleName) === -1;
                });
            }
        }
    });
});
