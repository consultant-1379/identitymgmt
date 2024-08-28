define([
    'jscore/core',
    'test/bit/lib/Browser',
    './Model'
], function(core, Browser, Model) {

    var sleep = function(timeout) {
        return function sleep(resolve) {
            setTimeout(resolve, timeout);
        };
    };

    var setName = function(_name) {
        return function setName() {
            Model.setName(_name);
        };
    };

    var setDescription = function(_description) {
        return function setDescription() {
            Model.setDescription(_description);
        };
    };

    var onResume = function(_app) {
        return function onResume() {
            Model.onResume(_app);
        };
    };

    var saveCreateTargetGroup = function() {
        return function saveCreateTargetGroup() {
            Model.saveCreateTargetGroup();
        };
    };

    var verifyTopSectionTitle = function(_title) {
        return function verifyTopSectionTitle() {
            Model.verifyPageTopSectionTitle(_title);
        };
    };

    var waitForNotification = function(resolve, reject) { //INFO: Guess if async base on method signature
        Model.waitForNotification(2000)
            .then(resolve)
            .catch(reject);
    }

    var verifyNotificationText = function(_text) {
        return function verifyNotificationText() {
            Model.verifyNotificationText(_text);
        };
    };

    var clickNotificationClose = function() {
        Model.clickNotificationClose();
    };

    var waitForDialog = function(resolve, reject) {
        Model.waitForDialog(2000)
            .then(
            function(dialog) {

                // if()
                //     reject();

                resolve();
            })
            .catch(reject);
    }

    var verifyDialogPrimaryText = function(_text) {
        return function verifyDialogPrimaryText() {
            Model.verifyDialogPrimaryText(_text);
        };
    };

    var verifyDialogSecondaryText = function(_text) {
        return function verifyDialogSecondaryText() {
            Model.verifyDialogSecondaryText(_text);
        };
    };

    var clickDialogOkButton = function() {
        Model.clickDialogOkButton();
    };

    var verifyLocationHash = function(_hash) {
        return function verifyLocationHash() {
            Model.verifyLocationHash(_hash);
        };
    };

    return {
        sleep: sleep,

        //FORM DATA/ACTIONS
        setName: setName,
        setDescription: setDescription,
        onResume: onResume,
        saveCreateTargetGroup: saveCreateTargetGroup,
        verifyTopSectionTitle: verifyTopSectionTitle,
        
        //FORM VERYFICATIONS
        verifyLocationHash: verifyLocationHash,

        //NOTIFFICATION ACTIONS
        waitForNotification: waitForNotification,
        verifyNotificationText: verifyNotificationText,
        clickNotificationClose: clickNotificationClose,

        //DIALOG ACTIONS
        waitForDialog: waitForDialog,
        verifyDialogPrimaryText: verifyDialogPrimaryText,
        verifyDialogSecondaryText: verifyDialogSecondaryText,
        clickDialogOkButton: clickDialogOkButton
    };

});