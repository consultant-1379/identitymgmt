define([
    "jscore/ext/mvp",
    'i18n!rolemgmtlib/dictionary.json',
], function(mvp, dictionary) {

    return mvp.Model.extend({

        url: '/oss/idm/rolemanagement/roles',

        init: function(options) {
            this.setName(options.roleName);
        },

        setName: function(name) {
            this.setAttribute('id', name);
            return this.setAttribute('name', name);
        },

        getName: function() {
            return this.getAttribute('name');
        },

        getDescription: function() {
            return this.getAttribute('description');
        },

        getType: function() {
            return this.getAttribute('type');
        },

        getStatus: function() {
            return this.getAttribute('status');
        },

        getRoles: function() {
            return this.getAttribute('roles');
        },

        getActions: function() {
            return this.getAttribute('policy');
        }
    });
});