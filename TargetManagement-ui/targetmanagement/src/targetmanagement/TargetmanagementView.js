define([
    'jscore/core',
    'template!./targetmanagement.html'
], function (core, template) {

    return core.View.extend({
        getTemplate: function() {
            return template(this.options);
        }
    });

});
