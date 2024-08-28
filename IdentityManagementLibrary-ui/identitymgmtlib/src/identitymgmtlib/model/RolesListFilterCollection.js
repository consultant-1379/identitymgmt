define([
    'identitymgmtlib/mvp/Collection',
    'jscore/ext/privateStore',
    'jscore/ext/utils/base/underscore',
    'identitymgmtlib/model/RolesListFilterModel'
], function(Collection, PrivateStore, underscore, RoleListFilterModel) {

    var _ = PrivateStore.create();


    return Collection.extend({

        url: '/oss/idm/rolemanagement/roles',

        Model: RoleListFilterModel,

        /**
         * Validates collection
         * @param  {Boolean} strict Marker if strict mode is turn on or of
         * @return {Object}         Object with validation results
         */
        validate: function(strict) {
        }
    });
});
