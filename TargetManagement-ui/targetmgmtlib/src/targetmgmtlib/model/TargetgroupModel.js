define(['jscore/ext/mvp',
    'i18n!/targetmgmtlib/dictionary.json'
], function(mvp, dictionary) {
    return mvp.Model.extend({

        url: '/oss/idm/targetgroupmanagement/targetgroups',

        init: function() {
            this.setAttribute('description', "");
            this.setAttribute('name', "");
        },

        getId: function() {
            return this.getAttribute('id');
        },

        getName: function() {
            return this.getAttribute('name');
        },

        setName: function(name) {
            this.setAttribute('name', name);
        },

        getDescription: function() {
            return this.getAttribute('description');
        },

        setDescription: function(description) {
            this.setAttribute('description', description);
        },

        validate: function() {
            var name = this.getAttribute('name');
            var desc = this.getAttribute('description');
            var errors = {};

            var nameCharsRegex = /^[a-z0-9_.-]+$/i;
            var nameFirstCharRegex = /^[a-z]+$/i;
            var nameLastCharRegex = /^[a-z0-9]+$/i;

            if (!name || name.length === 0) {
                errors.name = dictionary.targetgroupModel.name_empty;
            } else if ( name.length > 255) {
                errors.name = dictionary.targetgroupModel.name_toolong;
            } else {
                if (!nameCharsRegex.test(name)) {
                    errors.name = dictionary.targetgroupModel.name_not_match_pattern;
                } else if (!nameFirstCharRegex.test(name.charAt(0))) {
                    errors.name = dictionary.targetgroupModel.name_not_start_with_letter;
                } else if (!nameLastCharRegex.test(name.slice(-1))) {
                    errors.name = dictionary.targetgroupModel.name_end_with_alphanumeric;
                }
            }

            if (!desc || desc.length === 0) {
                errors.description = dictionary.targetgroupModel.description_empty;
            }
            return errors;
        }
    });
});