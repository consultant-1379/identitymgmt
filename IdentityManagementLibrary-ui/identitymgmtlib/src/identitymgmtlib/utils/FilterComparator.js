define([
	'jscore/core',
	'jscore/ext/net',
	'jscore/ext/privateStore',
	'jscore/ext/utils/base/underscore'
], function(core, net, PrivateStore, underscore) {
	'use strict';

	var _ = PrivateStore.create();

	/**
	 * @constructor
	 * @param {Object} options
	 */
	function FilterComparator(options) {
		if (this.init) {
			this.init(options);
		}
	}

	/**
	 * Filter data according to provided {filter} param in query
	 * @param  {Object} query
	 * @return {Object}
	 */
	FilterComparator.prototype.filter = function(value, filterCriteria) {
		// Filter data
		if (value) {
			if (filterCriteria instanceof Array) { // 1) if filter element is an array
				// If none of elements in filter array are equal or not in list if element is array, 
				// then return false, else continue with next loop iteration.
				if (!filterCriteria.some(value instanceof Array ? isInList : isEqual, {
						valueToTest: value
					})) {
					return false;
				}
			} else if (typeof(filterCriteria) === 'string' || filterCriteria instanceof String) { // 2) if filter element is String
				// test it with regular expression
				try {
					var pattern = new RegExp(filterCriteria, 'i');

					if (!pattern.test(value)) {
						return false;
					}
				} catch(err) {
					return false;
				}
			} else { // Otherwise
				if (value !== filterCriteria) {
					return false;
				}
			}
		} else {
			if (value === null && (typeof(filterCriteria) === 'string' || filterCriteria instanceof String)) {
				try {
					var pattern2 = new RegExp(filterCriteria, 'i');

					if (!pattern2.test("")) {
						return false;
					}
				} catch(err) {
					return false;
				}
			} else {
				return false;
			}
		}

		return true;
	};

	FilterComparator.extend = core.extend;

	var isEqual = function(filterElement) {
		return filterElement === this.valueToTest;
	};

	var isInList = function(filterElement) {
		return this.valueToTest.indexOf(filterElement) !== -1;
	};

	return FilterComparator;

});
