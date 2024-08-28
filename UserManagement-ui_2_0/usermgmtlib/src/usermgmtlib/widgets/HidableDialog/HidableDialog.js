define([
    'widgets/Dialog'
], function (Dialog) {
    'use strict';

    return Dialog.extend({

        init: function (options) {

            this.options.buttons = [];
            this.options.actions.forEach(function (action) {
                //generate button(s)
                this.options.buttons.push({
                    caption: action.caption,
                    action: function () {
                        if (action.value) {
                            action.value();
                        }
                        this.hide();
                    }.bind(this)
                });

            }.bind(this));

        }
    });

});
