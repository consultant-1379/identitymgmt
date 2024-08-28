define([
    'jscore/core',
    'widgets/Dialog',
    'identitymgmtlib/ConfirmationSummaryList',
    'identitymgmtlib/Utils'
], function (core, Dialog, ConfirmationSummaryList, Utils) {

    return Dialog.extend({

        init: function (options) {
            this.options.visible = true;
            this.options.buttons = [];
            this.options.header = options.header;
            this.options.statuses = options.statuses;
            this.options.info = options.info;

            this.options.actions.forEach(function (action) {
                //generate button(s)
                this.options.buttons.push({
                    caption: action.caption,
                    action: function () {
                        this.trigger("dialog-confirmation", action.value, options.elementsArray);
                        this.hide();
                    }.bind(this)
                });

            }.bind(this));

            this.options.content = new ConfirmationSummaryList(options);

        }
    });

});
