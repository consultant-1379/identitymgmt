define([
    'jscore/core',
    'template!./targetgroup.html',
    'styles!./targetgroup.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        }

    });

});
