define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'identitymgmtlib/FilterComparator',
    'i18n!identitymgmtlib/common.json'
], function(core, _, FilterComparator, Dictionary) {
    'use strict';
    var _active = Dictionary.filters.credentialStatus.names.active,
        _inactive = Dictionary.filters.credentialStatus.names.inactive,
        _new = Dictionary.filters.credentialStatus.names.new,
        _not_applicable = Dictionary.filters.credentialStatus.names.not_applicable,
        _deleted = Dictionary.filters.credentialStatus.names.deleted,
        _reissue = Dictionary.filters.credentialStatus.names.reissue;

    return FilterComparator.extend({
        filter: function(value, filterCriteria) {

            return filterCriteria.some(function(criteria) {
                if (!value) {
                    return false;
                } else {
                    if (criteria === value) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        }
    });
});
