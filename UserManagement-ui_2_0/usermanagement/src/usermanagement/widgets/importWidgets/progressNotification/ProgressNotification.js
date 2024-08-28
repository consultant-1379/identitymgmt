define([
    'jscore/core',
    '../../../Dictionary',
    'jscore/ext/privateStore',
    'uit!./ProgressNotification.html'
], function(core, Dictionary, PrivateStore, View) {
    'use strict';

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            options = options || {};
            _(this).options = {};
            _(this).options.stopButtonOptions = {
                caption: Dictionary.notificationsFlyout.stopButton,
                modifiers: [{
                    name: "color",
                    value: "red"
                }]
            };
            _(this).options.progressOptions = {
                value: options.value,
                max: options.max,
                label: Dictionary.notificationsFlyout.progressBarLabel
            };
            _(this).options.timestamp = options.timestamp || "00:00";

            this.view = new View(_(this).options);
        },

        getProgressBar: function() {
            return this.view.findById('progressBar');
        },

        setValue: function(value, max) {
            max = max !== undefined && typeof max === 'number' ? max : this.options.max;
            this.getProgressBar().setValue(value, max);
        }
    });
});