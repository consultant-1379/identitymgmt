define([
    'widgets/ProgressBar',
    'i18n/number'
], function (ProgressBar, i18nNumber) {
    'use strict';

    return ProgressBar.extend({

        onViewReady: function () {
            this.setColor(this.options.color || "paleBlue");
            this.setValue(this.options.value, this.options.max);
            this.view.iconModifier = this.options.icon;
            this.view.getBar().setStyle('width', 'calc(100% - 82px)');

            // if we have label or icon we need to show Header section
            if (this.options.label || this.options.icon) {
                this.view.getLabel().setStyle('font-weight', 'bold');
                this.view.showHeader();
            }

            if (!this.options.icon) {
                this.view.toggleElement(this.view.getIcon());
            }
        },

        setValue: function(value, max) {
            max = max !== undefined && typeof max === 'number' ? max : 100;
            value = value !== undefined && typeof value === 'number' ? value : 0;

           var percentValue = value/max * 100;
            if (percentValue < 0) {
                percentValue = 0;
            } else if (percentValue > 100) {
                percentValue = 100;
            }

            this.view.getFill().setStyle("width", percentValue + "%");
            this.view.getProgressValue().setText("(" + i18nNumber(value).format("0,0") + "/" + i18nNumber(max).format("0,0") + ")");
        }
    });

});
