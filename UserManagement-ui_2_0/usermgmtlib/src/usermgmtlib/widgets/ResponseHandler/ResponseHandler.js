define([
    'jscore/ext/utils/base/underscore',
    'jscore/core',
    'i18n!identitymgmtlib/error-codes.json',
    'i18n!identitymgmtlib/common.json',
    'widgets/Notification',
    'usermgmtlib/model/ResponseParser',
    'identitymgmtlib/widgets/ResponsesSummaryDialog',
    'identitymgmtlib/Utils',
    'identitymgmtlib/widgets/AccessDeniedDialog'
], function(_, core, DictionaryErrors, Dictionary, Notification, ResponseParser, ResponsesSummaryDialog, Utils, AccessDeniedDialog) {

    //INFO: default mode for notification is: 'error'


    //HOWTO: you can transfer 4 types to this widget:
    //string which is the /Dictionary.variable/ id, this message will be displayed in notification, default /error/, if you want succes add second string parametr: 'success'
    //string which not exist in dictionary, than notification will apear with this message
    //if you want parse parameters to message just add array ['parsingValue',...], it will parse to string from dictionary or string you entered while executing function, {0} {1} ... max {3}
    //xhr, nothing else, if you want success notification transfer second string parameter 'success' else default is error
    //Array of responses, then ResponsesSummaryDialog will appear with summary of operations you made
    //each element of array must contain object: 
    //in case of error response: {xhr: xhr,rowValue: rowValue}, in case success: {xhr: xhr,rowValue: rowValue,singleNotification: {messageId: 'success_message_id',mode: 'success'}}

    var failureNotification;
    var iconSuccess = "ebIcon ebIcon_tick",
        iconError = "ebIcon ebIcon_error",
        colorSuccess = "green",
        colorError = "red",
        contentSuccess = "success",
        contentError = "error",
        showCloseButton = true,
        showAsGlobalToast = true,
        autoDismiss = true,
        autoDismissDuration = 10000;

    function getResponsesSummaryDialogHeader(successCounter, operation) {

        if (successCounter === 0) {
            return DictionaryErrors.responseDialog.full[operation] || DictionaryErrors.responseDialog.fail_default;
        } else {
            return DictionaryErrors.responseDialog.partial[operation] || DictionaryErrors.responseDialog.partial_default;
        }
    }

    function getResponseMessage(xhr, mode) {
        var responseJSON, errorMessage;
        try {
            responseJSON = xhr.getResponseJSON();
            errorMessage = Utils.getErrorMessage(responseJSON.httpStatusCode, responseJSON.internalErrorCode);
            errorMessage.internalErrorCodeMessage = Utils.printf(errorMessage.internalErrorCodeMessage, responseJSON.errorData);
        } catch (error) {
            return DictionaryErrors.default;
        }
        return errorMessage.internalErrorCodeMessage || errorMessage.defaultHttpMessage;
    }

    function getResponseCustomMessage(internalCode, mode) {
        if (DictionaryErrors.defaultHttpMessages[internalCode]) {
            return DictionaryErrors.defaultHttpMessages[internalCode];
        } else {
            return internalCode;
        }
    }

    function getNotificationText(responseData, mode) {
        var notificationMessage;
        if (typeof responseData === 'string') {
            notificationMessage = getResponseCustomMessage(responseData, mode);
        } else {
            notificationMessage = getResponseMessage(responseData, mode);
        }
        return notificationMessage;
    }

    function parseNotificationParameters(responseData, mode, values) {
        var notificationDataObject = {};
        var notificationMessage = "";

        switch (mode) {
            case 'success':
                {
                    notificationDataObject.color = colorSuccess;
                    notificationDataObject.icon = iconSuccess;
                    notificationDataObject.content = contentSuccess;
                    break;
                }
            case 'error':
                {
                    notificationDataObject.color = colorError;
                    notificationDataObject.icon = iconError;
                    notificationDataObject.content = contentError;
                    break;
                }
        }

        notificationDataObject.showCloseButton = showCloseButton;
        notificationDataObject.showAsGlobalToast = showAsGlobalToast;
        notificationDataObject.autoDismiss = autoDismiss;
        notificationDataObject.autoDismissDuration = autoDismissDuration;

        var message;
        if (values.length) {
            message = Utils.printf(getNotificationText(responseData, mode), values[0], values[1], values[2], values[3]);
        } else {
            message = getNotificationText(responseData, mode);
        }
        notificationDataObject.label = message;

        return notificationDataObject;
    }

    function getSuccessCount(model) {
        var counter = 0;
        model.forEach(function(element) {
            if (element[1] >= 200 && element[1] < 300) { counter++; }
        });
        return counter;
    }

    var ResponsesHandler = core.Widget.extend({

        setNotification: function(options) {
            var dataObject = new ResponseParser(options.response, options.dialog);
            var parsedData = dataObject.getData();

            if (parsedData.length === 1 && !options.dialog) {
                var notificationObject = parseNotificationParameters(parsedData[0].response, options.mode || parsedData[0].mode, options.values || []);
                return new Notification(notificationObject);
            } else {
                var successCounter = getSuccessCount(parsedData);
                new ResponsesSummaryDialog({
                    elementNameColumnHeader: Dictionary.User,
                    data: parsedData,
                    errorCodes: DictionaryErrors,
                    successCounter: successCounter,
                    header: getResponsesSummaryDialogHeader(successCounter, options.operation),
                    displayResponseStatusIcons: true
                });
            }
        },
        setNotificationSuccess: function(options) {
            options.mode = 'success';
            return this.setNotification(options);
        },
        setNotificationError: function(options) {
            options.mode = 'error';
            this.setNotification(options);
        },
        showAccessDeniedDialog: function() {
            if (this.accessDeniedDialog) {
                this.accessDeniedDialog.show();
            } else {
                this.accessDeniedDialog = new AccessDeniedDialog();
            }
        },
        getInstance: function() {
            return this;
        }
    });

    return new ResponsesHandler();
});
