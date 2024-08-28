define([
    'widgets/Dialog',
    'widgets/ProgressBar',
    '../../../Dictionary',
    'webpush/main',
    'usermgmtlib/widgets/HidableDialog'
], function (Dialog, ProgressBar, Dictionary, webpush, HidableDialog) {
    'use strict';

    return Dialog.extend({
        started: function () {
            this.disableButton();
            this.setHeader(Dictionary.parsingFileHeader);
        },

        progress: function (data) {
            if (typeof data.event === 'number') {
                this.setValue(data.event);
            } else {
                this.setValue(data.event.value);
            }
        },

        finishedWithError: function () {
            this.hide();
            this.showParsingErrorDialog();
        },

        finished: function () {
            this.setHeader(Dictionary.analyzingFileHeader);
        },

        init: function (options) {
            this.importParsingProgressBar = new ProgressBar({
                value: 0,
                color: "paleBlue"
            });
            this.owner = options.owner;
            this.options.header = Dictionary.loadingFileHeader;
            this.options.content = this.importParsingProgressBar;
            this.options.buttons = [
                {
                    caption: Dictionary.loadingFileStopButton,
                    action: function() {
                        options.xhr.abort();
                        this.hide();
                    }.bind(this)
                }
            ];
        },

        setValue: function(value) {
            this.importParsingProgressBar.setValue(value);
        },

        disableButton: function() {
            this.getButtons()[0].disable();
        },

        showParsingErrorDialog: function() {
            var parsingErrorDialog = new HidableDialog({
                header: Dictionary.parsingFileErrorHeader,
                content: Dictionary.parsingFileError,
                type: "error",
                actions: [
                    {
                        caption: Dictionary.importAnalysis.okButton
                    }
                ]
            });
            parsingErrorDialog.show();
        }
    });

});
