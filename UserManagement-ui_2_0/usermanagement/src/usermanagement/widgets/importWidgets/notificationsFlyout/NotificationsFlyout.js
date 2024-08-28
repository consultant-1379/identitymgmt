define([
    'jscore/core',
    '../../../Dictionary',
    'jscore/ext/privateStore',
    'uit!./NotificationsFlyout.html',
    '../flyoutNotification/FlyoutNotification',
    'usermgmtlib/services/UserManagementService',
    'webpush/main'
], function(core, Dictionary, PrivateStore, View, FlyoutNotification, UserManagementService, webpush) {
    'use strict';

    var _ = PrivateStore.create();

    var _subscribeToWebpushChannel = function() {
        webpush.subscribe("importexportnotifications:import", function(data) {
            this.handleEvent(data);
        }.bind(this));
    };

    var _hideNoNotificationsMessage = function() {
        this.getNoNotificationsMessageContainer().setStyle("display", "none");
    };

    var _showNoNotificationsMessage = function() {
        this.getNoNotificationsMessageContainer().setStyle("display", "flex");
    };

    var _attachNotification = function() {
        if (_(this).notifications.length) {
            _(this).notifications[0].attachTo(this.getNotificationsContainer());
        } else {
            _showNoNotificationsMessage.call(this);
        }
    };

    var _closePreviousSummary = function(owner) {
        _(this).notifications.some(function(element) {
            if (element.getImportOwner() === owner) {
                element.trigger('close');
                return true;
            }
            return false;
        }.bind(this));
    };

    var _addInitialImportSummary = function() {
        UserManagementService.checkImportStatus().then(function(data) {
            data.tasks.some(function(element) {
                if (element.owner && element.type === "importUsers") {
                    if (element.status === "finished" || element.status === "finished_with_error") {
                        this.addNewNotification({
                            timestamp: element.finishTime,
                            importId: element.id,
                            state: element.status.toUpperCase(),
                            loggedUser: _(this).loggedUser,
                            importOwner: _(this).loggedUser,
                            successfulAmount: element.successfulAmount,
                            failedAmount: element.failedAmount
                        });
                    }
                    return true;
                }
                return false;
            }.bind(this));
        }.bind(this));
    };

    return core.Widget.extend({

        init: function(options) {
            options = options || {};
            _(this).options = {};
            _(this).options.noNotifications = Dictionary.notificationsFlyout.noNotificationsMessage;
            _(this).notifications = [];
            _(this).importIds = {};
            _(this).loggedUser = options.loggedUser;
            this.view = new View(_(this).options);
        },

        onViewReady: function() {
            _addInitialImportSummary.call(this);
            _subscribeToWebpushChannel.call(this);
        },

        getNoNotificationsMessageContainer: function() {
            return this.view.findById('noNotificationsMessageContainer');
        },

        getNotificationsContainer: function() {
            return this.view.findById('notifications');
        },

        getNotifications: function() {
            return _(this).notifications;
        },

        handleEvent: function(data) {
            if (!_(this).importIds[data.importId]) {
                this.addNewNotification({
                    timestamp: data.event.startTime || data.event.finishTime,
                    importId: data.importId,
                    state: data.eventType,
                    loggedUser: _(this).loggedUser,
                    importOwner: data.owner,
                    successfulAmount: data.event.successfulAmount,
                    failedAmount: data.event.failedAmount,
                    value: data.event.done,
                    max: data.event.all
                });
            } else {
                var notification = _(this).notifications.find(function(element) {
                    if (element.getImportId() === data.importId) {
                        return true;
                    }
                    return false;
                });
                notification.handleEvent(data);
            }
        },

        /* Object passed as an argument should be constructed as follows:
         *  {
         *       timestamp: timestamp,
         *       importId: importId,
         *       state: state,
         *       loggedUser: loggedUser,
         *       importOwner: importOwner,
         *       successfulAmount: successfulAmount,            //for summary notification
         *       failedAmount: failedAmount,                    //for summary notification
         *       value: value,                                  //for progress notification
         *       max: all                                       //for progress notification
         *   }
         */
        addNewNotification: function(data) {
            if (_(this).importIds[data.importId]) {
                return;
            }
            _(this).importIds[data.importId] = true;

            var notification = new FlyoutNotification(data);

            if (data.importOwner === data.loggedUser) {
                _closePreviousSummary.call(this, data.importOwner);
            }
            if (!_(this).notifications.length) {
                _hideNoNotificationsMessage.call(this);
                notification.attachTo(this.getNotificationsContainer());
            }
            _(this).notifications.push(notification);

            notification.addEventHandler('close', function() {
                var index = _(this).notifications.indexOf(notification);
                _(this).notifications.splice(index, 1);
                if (notification.isAttached()) {
                    this.trigger('close');
                    notification.destroy();
                    _attachNotification.call(this);
                }
            }.bind(this));
        }
    });
});