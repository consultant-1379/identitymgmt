define([
    'jscore/core',
    "./NotificationsView",
    'jscore/ext/privateStore',
    'widgets/Notification',
    'i18n!rolemgmtlib/dictionary.json',
], function (core, View, PrivateStore, Notification, dictionary) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        View: View,

        init: function(){
            _(this).activeNotification = null;
        },

        onViewReady: function(){
            _(this).notificationHolder = this.view.getNotificationHolder();
        },

        show: function(notif){

            this.clear();
            switch(notif){
                case "saveSuccess":

                    var roleSuccessfullySavedNotification =  new Notification({
                        label: dictionary.notifications.role_save_success,
                        icon: 'tick',
                        color: 'green',
                        showCloseButton: false,
                        showAsToast: true,
                        autoDismiss: true,
                        autoDismissDuration: 10000
                    });
                    roleSuccessfullySavedNotification.attachTo(_(this).notificationHolder);
                    _(this).activeNotification = roleSuccessfullySavedNotification;
                    break;
                case "saveError":
                    var roleSaveFailedNotification =  new Notification({
                        label: dictionary.notifications.role_save_failed,
                        icon: 'error',
                        color: 'red',
                        showCloseButton: true,
                        showAsToast: true,
                        autoDismiss: true,
                        autoDismissDuration: 10000
                    });
                    roleSaveFailedNotification.attachTo(_(this).notificationHolder);
                    _(this).activeNotification = roleSaveFailedNotification;
                    break;
                case "formHasErrors":
                    var formHasErrorsNotification =  new Notification({
                        label: dictionary.notifications.form_has_errors,
                        icon: 'error',
                        color: 'red',
                        showCloseButton: true,
                        showAsToast: true,
                        autoDismiss: true,
                        autoDismissDuration: 10000
                    });
                    formHasErrorsNotification.attachTo(_(this).notificationHolder);
                    _(this).activeNotification = formHasErrorsNotification;
                    break;
                case "serverError":
                    var serverErrorNotification =  new Notification({
                        label: dictionary.notifications.server_error,
                        icon: 'error',
                        color: 'red',
                        showCloseButton: true,
                        showAsToast: true,
                        autoDismiss: true,
                        autoDismissDuration: 10000
                    });
                    serverErrorNotification.attachTo(_(this).notificationHolder);
                    _(this).activeNotification = serverErrorNotification;
                    break;
                default:
                    break;
            }
        },

        clear: function(){
            if (_(this).activeNotification !== null && typeof _(this).activeNotification !== 'undefined')
            _(this).activeNotification.destroy();
        }
    });
});