define([
    "jscore/ext/mvp",
    'i18n!rolemgmtlib/dictionary.json',
], function (mvp, dictionary) {

    return mvp.Model.extend({

        url: '/oss/idm/rolemanagement/roles',

        MaxRoleNameLength: 64,
        MaxRoleDescriptionLength: 255,

        init: function(options) {
            if (this.isNew()) {
              this.initWithDefaults();
            }
        },

        initWithDefaults: function(){
            this.setAttribute('name', '');
            this.setAttribute('description', '');
            this.setAttribute('type', 'notselected');
            this.setAttribute('status', 'ENABLED');
            this.setAttribute('assignRoles', []);
            this.setAttribute('policy', {});
        },

        parse: function (resp, options) {
          return resp;
        },

        setName: function(name){
            return this.setAttribute('name', name);
        },

        setDescription: function(description){
            return this.setAttribute('description', description);
        },

        setType: function(type){
            return this.setAttribute('type', type);
        },

        setStatus: function(status){
            return this.setAttribute('status', status);
        },

        getAttributes: function() {
            return this.attributes;
        },

        setAttributes: function(attributes) {
            Object.keys(attributes).forEach(function(key) {
                this.setAttribute(key, attributes[key]);
            }.bind(this));
        },

        getName: function(){
            return this.getAttribute('name');
        },

        getDescription: function(){
            return this.getAttribute('description');
        },

        getType: function(){
            return this.getAttribute('type');
        },

        getStatus: function(){
            return this.getAttribute('status');
        },

        getRoles: function(){
            return this.getAttribute('assignRoles');
        },

        getPolicy: function(){
            return this.getAttribute('policy');
        },

        isNew: function (){
            var id = this.getAttribute('id');
            return ((id === null) || (typeof id === 'undefined'));
        },

        validate: function(){
            var entryResult = {valid: true, errors: []};
            var result = {
                valid: true,
                name: {valid: true, errors: []},
                description: {valid: true, errors: []},
                type: {valid: true, errors: []},
                roles: {valid: true, errors: []}
            };
            var nameResult = this.validateName();
            var descriptionResult = this.validateDescription();
            var typeResult = this.validateType();
            var rolesResult = this.validateRole();
            if (!(nameResult.valid && descriptionResult.valid && typeResult.valid && rolesResult.valid)){
                result.valid = false;
                result.name = nameResult;
                result.description = descriptionResult;
                result.type = typeResult;
                result.roles = rolesResult;
            }
            return result;
        },

        validateName: function(name){
            if (typeof name === 'undefined'){
                name = this.getName();
            }
            var result = {valid:  true, errors: []};
            if((name === '') || (typeof name === 'undefined') || (name ===null)){
                result.valid = false;
                result.errors.push(dictionary.roleModel.name_empty);
                return result;
            }// check if role name not empty
              if (name.length > this.MaxRoleNameLength) {
                result.valid = false;
                result.errors.push(dictionary.roleModel.extend_max_role_name_length);
              }
            var regex = /^[a-z0-9_.-]+$/i;
            var regexTest = regex.test(name);
            if (!regexTest){
                result.valid = false;
                result.errors.push(dictionary.roleModel.name_not_match_pattern);
            }// check if name contains alphanumeric characters or _-.
            regex = /^[a-z0-9]+$/i;
            if(!regex.test(name.charAt(0))){
                result.valid = false;
                result.errors.push(dictionary.roleModel.name_not_start_with_alphanumeric);
            }// First char must be alphanumeric
            regex = /^[a-z0-9]+$/i;
            if(!regex.test(name.slice(-1))){
                result.valid = false;
                result.errors.push(dictionary.roleModel.name_end_with_alphanumeric);
            }// last characters must be alphanumeric

            return result;
        },

        validateDescription: function(description){
            if (typeof description === 'undefined'){
                description = this.getDescription();
            }
            var result = {valid:  true, errors: []};
            if((description === '') || (typeof description === 'undefined') || (description ===null)){
                result.valid = false;
                result.errors.push(dictionary.roleModel.description_empty);
            } else {
              if (description.length > this.MaxRoleDescriptionLength)  {
                result.valid = false;
                result.errors.push(dictionary.roleModel.extend_max_role_description_length);
              }
            }
            return result;
        },

        validateType: function(type){
            if (typeof type === 'undefined'){
                type = this.getType();
            }
            var result = {valid:  true, errors: []};

            if (!(type==="comalias" || type==="com" || type==="custom" || type==="system" || type==="aplication" || type==="cpp")){
                result.valid = false;
                result.errors.push(dictionary.roleModel.type_not_selected);
            }
            return result;
        },

        validateRole: function(assignRoles){
          if (typeof assignRoles === 'undefined'){
        	  assignRoles = this.getRoles();
        	  }
          var result = {valid: true, errors: []};
          if (this.getType() === "com" || this.getType() === "cpp") {
            this.removeAttribute('assignRoles');//com role don't have roles
            this.removeAttribute('policy');//com role don't have policy
          } else {
            if (this.getType() === "comalias") {
            	if (typeof assignRoles === 'undefined'){
              	  assignRoles = [];
            	}
              if(assignRoles.length === [].length) {
                  result.valid = false;
                  result.errors.push(dictionary.roleModel.alias_cannot_be_empty);
              }
              this.removeAttribute('policy');//com role don't have policy
            }
          }
          return result;
        },

        addRole: function(roleName){
            if (this.getAttribute('assignRoles').indexOf(roleName) === -1){
                this.getAttribute('assignRoles').push(roleName);
            }
        },

        removeRole: function(roleName){
            var index = this.getAttribute('assignRoles').indexOf(roleName);
            if (index !== -1){
               this.getAttribute('assignRoles').splice(index, 1);
            }
        },

        addRoles : function(roles){
            this.setAttribute('assignRoles', roles);
        },

    });
});
