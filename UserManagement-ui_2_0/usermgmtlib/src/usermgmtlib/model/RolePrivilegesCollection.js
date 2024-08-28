define([
    'identitymgmtlib/mvp/Collection',
    'jscore/ext/privateStore',
    'jscore/ext/utils/base/underscore',
    '../Dictionary',
    './RolePrivilegesModel',
    'i18n!identitymgmtlib/common.json'
], function(Collection, PrivateStore, underscore, Dictionary, RolePrivilegesModel, IdentityDictionary) {

    var _ = PrivateStore.create();

    var typeItems = {
        "com": IdentityDictionary.typeCell.RoleTypeCom,
        "comalias":IdentityDictionary.typeCell.RoleTypeAlias,
        "system": IdentityDictionary.typeCell.RoleTypeSystem,
        "application": IdentityDictionary.typeCell.RoleTypeSystem,
        "custom": IdentityDictionary.typeCell.RoleTypeCustom,
        "cpp": IdentityDictionary.typeCell.RoleTypeCpp
    };

    
    /**
     * Removes not needed privileges - roles in status DISABLED and DISABLED_ASSIGNMENT unless assigned
     * @private
     */
    var removeNotNeededPrivileges = function(options) {
        options = options || {};
        var remove = options.remove || {};
        var silent = options.silent || false; //if silent === true, it is duplicated

        var removeDISABLED_ASSIGNMENT = typeof remove.DISABLED_ASSIGNMENT === 'boolean' ? remove.DISABLED_ASSIGNMENT : true;
        var removeDISABLED = typeof remove.DISABLED === 'boolean' ? remove.DISABLED : true;
        var removeENABLED = typeof remove.ENABLED === 'boolean' ? remove.ENABLED : false;
        var removeAssigned = typeof remove.ASSIGNED === 'boolean' ? remove.ASSIGNED : false;
        this.assignedPrivilegesRemoved = false;
        var privilegesToRemove = [];
        this.each(function(privilege) {
            if ((privilege.get('status') === 'DISABLED_ASSIGNMENT' && removeDISABLED_ASSIGNMENT) || (privilege.get('status') === 'DISABLED' && removeDISABLED) || (privilege.get('status') === 'ENABLED' && removeENABLED)) {
                if (privilege.get('assigned')) {
                    if (removeAssigned) {
                        if (!silent) {
                            this.assignedPrivilegesRemoved = true;
                        }
                        privilegesToRemove.push(privilege);
                    }
                } else {
                    privilegesToRemove.push(privilege);
                }
            }


        }.bind(this));
        privilegesToRemove.forEach(function(privilege) {
            this.removeModel(privilege);
        }.bind(this));
    };

    var setRoleTypeDisplayed = function() {

        this.each(function(privilege) {
            privilege.set('roleTypeDisplayed', typeItems[privilege.get('type')], { silent: true });
        }.bind(this));

    };
    return Collection.extend({

        url: '/oss/idm/rolemanagement/roles',

        Model: RolePrivilegesModel,

        /**
         * Fetchs data colleciton from backend, and calls success callback if privided
         * @param  {Object} options Privides options for fetch, for example success callback
         * @return {super function results}
         * @override
         */
        fetch: function(options) {
            this.trigger('fetch:start');
            return Collection.prototype.fetch.call(this, underscore.extend({}, options, {
                success: function() {
                    removeNotNeededPrivileges.call(this, options);
                    setRoleTypeDisplayed.call(this);

                     this.trigger('fetch:privilegesCollection', this );

                    if (options && options.success) {
                        options.success.apply(arguments);
                    }
                }.bind(this)
            }));
        },

        /**
         * Validates collection
         * @param  {Boolean} strict Marker if strict mode is turn on or of
         * @return {Object}         Object with validation results
         */
        validate: function(strict) {

            
            var assignedPrivileges = this.toJSON().filter(function(privilege) {
                return privilege.assigned;
            });

            if (assignedPrivileges.length > 0) {
               
                    return undefined;
                
            } else if (strict) {
                return {
                    message: Dictionary.validator.roles.assigned,
                    type: 'assigned'
                };
            }
        },

        /**
         * Returns array with assigned privileges
         * @return {Array} Array with assigned privileges (pure JSON, not BB models)
         */
        getAssigned: function() {
            // TODO: too bad that this is not working in this way, but it works at least...
            //return this.searchMap(true, ['assigned']);
            return this.toJSON().filter(function(element) {
                return element.assigned;
            });
        },

        assignAllPrivileges: function() {
            this.each(function(model) {
                if (!model.get('assigned')) {
                    model.set('assigned', true);
                    model.setTouched('assigned');
                }
            });
        },

        unassignAllPrivileges: function() {
            this.each(function(model) {
                if (model.get('assigned')) {
                    model.set('assigned', false);
                    model.setTouched('assigned');
                }
            });
        }
    });
});
