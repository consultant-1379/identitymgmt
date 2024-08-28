define([
    'widgets/Dialog',
    '../../Dictionary'
], function (Dialog, Dictionary) {
    'use strict';

    return Dialog.extend({

        init: function (options) {
            this.owner = options.owner;
            this.options.type = 'error';
            this.options.header = "Error";
            this.options.content = Dictionary.too_much_users_selected;
            this.options.buttons = [
                {
                    caption: "Close",
                    action: function() {
                        this.hide();
                    }.bind(this)
                }
            ];
        }
    });

});
