define([
    'jscore/core',
    'text!./Rolemanagement.html'
], function(core, template) {
    return core.View.extend({

        getTemplate: function() {
            return template;
        }
    });
});