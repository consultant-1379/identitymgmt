define([
    'identitymgmtlib/mvp/Model',
    'jscore/ext/utils/base/underscore',
    'usermgmtlib/model/RolePrivilegesCollection'
], function(Model, _, RolePrivilegesCollection) {

    return Model.extend({

         // starts to providing proper GET method with privileges
         fetch: function(options) {

            this.setAttribute('privileges', new RolePrivilegesCollection());

            this.get('privileges').addEventHandler('fetched', function() {
                this.trigger('fetched:privileges', this);
            }.bind(this));

            this.get('privileges').addEventHandler('change', function() {
                this.trigger('change:privileges', this);
            }.bind(this));

            this.get('privileges').fetch(options || {});
         },

         isChangedModel: function() {
             return this.get('status') !== undefined ||
                    this.get('description') !== undefined ||
                    this.get('passwordAgeing') !== undefined ||
                    this.get('authMode')  !== undefined ||
                  ( this.get('selectedRoleBox') !== undefined );
         }
    });
});
