define([
    'jscore/core',
    './TableSettingsFormView'
], function (core, View) {
    'use strict';

    return core.Widget.extend({
       View : View,

        onViewReady: function () {
            this.options.content.attachTo(this.view.getContent());
            this.view.getApply().addEventHandler('click', this.applySettings.bind(this));
            this.view.getCancel().addEventHandler('click', this.cancelSettings.bind(this));
        },

        applySettings:function(){
             this.trigger('apply');
        },

        cancelSettings:function(){
             this.trigger('cancel');
        }

    });
});
