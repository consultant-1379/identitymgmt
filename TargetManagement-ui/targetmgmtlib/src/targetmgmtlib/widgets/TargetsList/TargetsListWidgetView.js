define(["jscore/core",
    "template!./targetsListWidget.html",
    "styles!./targetsListWidget.less",
    ], function(core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return style;
        },

        getTableHeader: function() {
            return this.getElement().find('.eaTargetmgmtlib-TargetListWidget-header');
        },

        getTableHolder: function () {
            return this.getElement().find('.eaTargetmgmtlib-TargetListWidget-Table-holder');
        },

        getMessageHolder: function () {
            return this.getElement().find('.elTablelib-Table-posttable');
        }

    });
});