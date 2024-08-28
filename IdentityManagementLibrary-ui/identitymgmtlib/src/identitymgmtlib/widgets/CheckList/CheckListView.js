define([
    'jscore/core',
    'template!./CheckList.html',
    'styles!./CheckList.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        },

        getCheckboxForElement : function(element){
            return this.getElement().find('.elIdentitymgmtlib-checklist-listItem-'+element.value+'-input');
        }

    });

});

