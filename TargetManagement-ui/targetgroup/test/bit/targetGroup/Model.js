define([
    'test/bit/lib/Browser'
], function(Browser) {

    var selector = {

        button: '.ebBtn',
        paragraph: 'p',

        title: '.elLayouts-TopSection-title',
        topSectionButtons: '.elLayouts-ActionBarButton',

        nameInput: '.eaTargetmgmtlib-targetgroupForm-name',
        descriptionInput: '.eaTargetmgmtlib-targetgroupForm-description',

        notiffication: '.ebNotification',
        notifficationLabel: '.ebNotification-label',
        notifficationClose: '.ebNotification-close',

        dialog: '.ebDialog',
        dialogPrimaryText: '.ebDialogBox-primaryText',
        dialogSecondaryText: '.ebDialogBox-secondaryText',
        

    };

    return {

        waitForTitleElement: function(timeout) {
            return Browser.waitForElement(selector.title, timeout);
        },

        setName: function(_name) {
            var name = Browser.getElement(selector.nameInput);
            name.setValue(_name);
        },

        setDescription: function(_description) {
            var description = Browser.getElement(selector.descriptionInput);
            description.setText(_description);
        },

        saveCreateTargetGroup: function(_name) {

            var buttons = Browser.getElements(selector.topSectionButtons);

            //TODO: do loop and search for value SAVE
            // console.log(buttons[0].getText());
            // console.log(buttons[1].getText());
            // buttons[0].setText('000000');
            // buttons[1].setText('111111');

            //TODO: CHECK ALL BUTTON AND HET THE ONE WITH TEXT SAVE
            buttons[0].trigger('click');

        },

        verifyPageTopSectionTitle: function(_title) {
            var title = Browser.getElement(selector.title);
            if (title.getText() !== _title) {
                throw new Error("Title different than expected:" + _title);
            }
        },

        waitForNotification: function(_timeout) {
            return Browser.waitForElement(selector.notiffication, _timeout); //Returns promise
        },

        verifyNotificationText: function(_text) {
            var notifficationLabel = Browser.getElement(selector.notifficationLabel);
            if (notifficationLabel.getText() !== _text) {
                throw new Error("Notiffication text different than expected:" + notifficationLabel.getText());
            }
        },

        clickNotificationClose: function() {
            var notifficationClose = Browser.getElement(selector.notifficationClose);
            notifficationClose.trigger('click');
        },

        waitForDialog: function(_timeout) {
            return Browser.waitForElement(selector.dialog, _timeout);
        },

        verifyDialogPrimaryText: function(_text) {
            var dialogPrimaryText = Browser.getElement(selector.dialogPrimaryText);
            if (dialogPrimaryText.getText() !== _text) {
                throw new Error("Dialog Primary text different than expected:" + dialogPrimaryText.getText());
            }
        },

        verifyDialogSecondaryText: function(_text) {
            var dialogSecondaryText = Browser.getElement(selector.dialogSecondaryText);
            dialogSecondaryText = dialogSecondaryText.find(selector.paragraph);
            if (dialogSecondaryText.getText() !== _text) {
                throw new Error("Dialog Secondary text different than expected:" + dialogSecondaryText.getText());
            }
        },

        clickDialogOkButton: function() {
            var dialogButton = Browser.getElement(selector.dialog);
            dialogButton = dialogButton.find(selector.button);
            //TODO: CHECK we are clicking "Ok" button
            dialogButton.trigger('click');
        },

        verifyLocationHash: function(_hash) {
            if (window.location.hash !== _hash) {
                throw new Error("Location hash different than expected:" + _hash);
            }
        }
     };
});