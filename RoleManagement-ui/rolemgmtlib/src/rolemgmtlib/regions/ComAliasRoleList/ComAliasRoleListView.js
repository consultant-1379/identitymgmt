define([
    "jscore/core",
    "text!./ComAliasRoleList.html",
    "styles!./ComAliasRoleList.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

		getTable: function() {
			return this.getElement().find(".elRolemgmtlib-ComAliasRoleList-table");
		}

    });

});
