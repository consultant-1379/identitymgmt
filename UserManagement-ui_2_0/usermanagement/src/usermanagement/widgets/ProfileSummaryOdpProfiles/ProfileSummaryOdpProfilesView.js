define([
    'jscore/core',
    'template!./ProfileSummaryOdpProfiles.html',
    'styles!./ProfileSummaryOdpProfiles.less',
    '../../Dictionary'
], function (core, template, styles, Dictionary) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template(Dictionary);
        },

        getStyle: function () {
            return styles;
        },

    });

});
