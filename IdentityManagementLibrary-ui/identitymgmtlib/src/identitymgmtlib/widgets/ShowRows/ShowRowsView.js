define([
    'jscore/core',
    'template!./ShowRows.html',
    'styles!./ShowRows.less'
], function (core, template, style) {
    
    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getSelectboxContainer: function() {
            return this.getElement().find(".elIdentitymgmtlib-ShowRows-selectbox");
        }

    });

});