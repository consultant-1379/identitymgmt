define([
    'jscore/core',
    'uit!./ErrorContainer.html',
    'jscore/ext/privateStore',
    'i18n!identitymgmtlib/error-codes.json',
    'i18n!identitymgmtlib/common.json',
    'widgets/Accordion',
    'widgets/Dialog'
], function(core, View, PrivateStore, Dictionary, DictionaryCommon, Accordion, Dialog) {

    var _ = PrivateStore.create();

    //This function should be replaced when Jcoholics deliver change of response type from html to json
    // function getResponseMessage(xhr, mode) { //TODO: do try and check syntax
    //     var responseJSON = xhr.getResponseJSON();
    //     var errorMessage = Utils.getErrorMessage(responseJSON.httpStatusCode, responseJSON.internalErrorCode);
    //     return errorMessage.internalErrorCodeMessage || errorMessage.defaultHttpMessage;
    // }

    function getResponseMessage() {

        var message;
        switch (_(this).requestType) {
            case 'SLS':
                {
                    message = Dictionary.defaultHttpMessages.commonErrors.SLS;
                    break;
                }
            case 'USERS':
                {
                    message = Dictionary.defaultHttpMessages.commonErrors.USERS;
                    break;
                }

            case 'PRIVILEGES':
                {
                    message = Dictionary.defaultHttpMessages.commonErrors.PRIVILEGES;
                    break;
                }
            case 'SESSIONS':
                {
                    message = Dictionary.defaultHttpMessages.commonErrors.SESSIONS;
                    break;
                }
            case 'USER_PRIVILEGES':
                {
                    message = Dictionary.defaultHttpMessages.commonErrors.USER_PRIVILEGES;
                    break;
                }

            case 'ROLES':
                {
                    message = Dictionary.defaultHttpMessages.commonErrors.ROLES;
                    break;
                }
            case 'TG':
                {
                    message = Dictionary.defaultHttpMessages.commonErrors.TG;
                    break;
                }
            default:
                {
                    message = Dictionary.defaultHttpMessages.commonErrors.DEFAULT;
                }
        }
        return message + Dictionary.defaultHttpMessages[_(this).responseXHR.getStatus() || 0] || Dictionary.defaultHttpMessages || Dictionary.defaultHttpMessages.default_error;
    }

    return core.Widget.extend({

        view: function() {
            return new View({
                Dictionary: DictionaryCommon.table_messages
            });
        },

        init: function(response) {
            _(this).responseXHR = response[0].xhr;
            _(this).requestType = response[0].requestFor;
        },

        onViewReady: function() {

            _(this).accordion = new Accordion({
                title: DictionaryCommon.show_details,
                content: getResponseMessage.call(this)
            });
            _(this).accordion.attachTo(this.view.getElement().find('.elIdentitymgmtlib-ErrorContainer-accordion'));
        }
    });

});
