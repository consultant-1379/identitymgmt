define([
    'jscore/core',
    'text!./CompareRole.html'
], function (core, template) {
    return core.View.extend({
    	getTemplate: function () {
            return template;
        }
    });
});