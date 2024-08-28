define([
    "jscore/core",
    "template!./basicFilterHeaderCell.html",
    "styles!./basicFilterHeaderCell.less",
    "i18n!rolemgmtlib/dictionary.json"
], function (core, template, styles, dictionary) {

    return core.View.extend({

        getTemplate: function() {
            return template(dictionary);
        },

        getStyle: function() {
            return styles;
        }

    });

});

