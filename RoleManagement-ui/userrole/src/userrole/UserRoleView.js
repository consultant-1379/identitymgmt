define([
    'jscore/core',
    'text!./UserRole.html',
], function (core, template) {
    return core.View.extend({
    	getTemplate: function () {
            return template;
        }
    });
});