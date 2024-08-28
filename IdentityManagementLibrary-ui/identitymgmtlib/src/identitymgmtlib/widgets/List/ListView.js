define([
    'jscore/core',
    'template!./List.html',
    'styles!./List.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        }

    });

});

