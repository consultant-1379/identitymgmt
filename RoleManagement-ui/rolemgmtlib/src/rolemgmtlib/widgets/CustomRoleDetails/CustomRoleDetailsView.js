define([
    'jscore/core',
    'template!./CustomRoleDetails.html',
    'styles!./CustomRoleDetails.less'
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        },

        getRoleFormWrapper: function(){
            return this.getElement().find('.eaRolemgmtlib-customRoleDetails-roleFormWrapper');
        },

        getDetailsWrapper: function(){
            return this.getElement().find('.eaRolemgmtlib-customRoleDetails-detailsWrapper');
        }
    });
});
