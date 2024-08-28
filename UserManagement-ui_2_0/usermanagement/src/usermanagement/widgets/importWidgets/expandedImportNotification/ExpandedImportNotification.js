define([
    'jscore/core',
    'jscore/ext/privateStore',
    '../../../Dictionary',
    'usermgmtlib/widgets/ExpandableNotification',
    'uit!./ExpandedImportNotification.html',
    'webpush/main'
], function(core, PrivateStore, Dictionary, Notification, View, webpush) {
    'use strict';

    var _ = PrivateStore.create();

    var _subscribeToWebpushChannel = function() {
        webpush.subscribe("importexportnotifications:import", function(data) {
            if (data.eventType === "STARTED" || data.eventType === "PROGRESS" || _(this).loggedUser === data.owner) {
                this.attachNotification(data.eventType, data.event);
            } else {
                this.detachNotification();
                this.trigger('refresh');
            }
        }.bind(this));
    };

    var _addNotificationLinksEventHandlers = function(type) {
        switch(type) {
            case "PROGRESS":
                _(this).notification.getLinks()[0].addEventHandler('click', function() {
                    this.trigger('refresh');
                }.bind(this));
                _(this).notification.getLinks()[1].addEventHandler('click', function() {
                    this.trigger('showNotifications');
                }.bind(this));
                break;
            case "SUBSCRIPTION_FAILED":
                //no links are present
                break;
            default:
                _(this).notification.getLinks()[0].addEventHandler('click', function() {
                    this.trigger('showNotifications');
                }.bind(this));
        }
    };

    var _createNotification = function(label, showCloseButton, color, icon) {
        return new Notification({
            label: label || Dictionary.importInProgressNotification,
            color: color || 'paleBlue',
            autoDismiss: false,
            icon: icon || "infoMsgIndicator",
            showCloseButton: showCloseButton || false
        });
    };

    return core.Widget.extend({

        View: View,

        init: function(options) {
            options = options || {};
            _(this).loggedUser = options.loggedUser;
            _(this).type = options.type ? options.type.toUpperCase() : "PROGRESS";
            _(this).notification = null;
        },

        onViewReady: function() {
            _subscribeToWebpushChannel.call(this);
        },

        getContainer: function() {
            return this.view.findById("container");
        },

        attachNotification: function(type, data) {
            type = type ? type.toUpperCase() : type;
            if (type !== "FINISHED" && type !== "STARTED" && type !== "FINISHED_WITH_ERROR" && type !== "PROGRESS" && type !== "SUBSCRIPTION_FAILED") {
                throw new Error("Invalid notification type");
            }
            if (type === "STARTED") {
                type = "PROGRESS";
            } else if (type === "FINISHED" && data.failedAmount > 0) {
                if (data.successfulAmount === 0) {
                    type = "FINISHED_WITH_ERROR";
                } else {
                    type = "PARTIAL_SUCCESS";
                }
            }

            if (_(this).notification) {
                 if (_(this).type === type) {
                    return;
                 }
                 _(this).notification.destroy();
            }

            switch (type) {
                case "FINISHED":
                    _(this).notification = _createNotification(Dictionary.importFinishedNotification, true);
                    this.trigger('refresh');
                    break;
                case "FINISHED_WITH_ERROR":
                    _(this).notification = _createNotification(Dictionary.importFailedNotification, true, 'red', "error");
                    this.trigger('refresh');
                    break;
                case "PARTIAL_SUCCESS":
                    _(this).notification = _createNotification(Dictionary.importPartiallySucceededNotification, true, 'paleBlue', "warning");
                    this.trigger('refresh');
                    break;
                case "SUBSCRIPTION_FAILED":
                    _(this).notification = _createNotification(Dictionary.subscriptionFailedNotification, true, 'yellow', "warning");
                    this.trigger('refresh');
                    break;
                default:
                    _(this).notification = _createNotification();
            }
            _(this).notification.addEventHandler('close', function() {
                _(this).notification = null;
            }.bind(this));
            _addNotificationLinksEventHandlers.call(this, type);
            _(this).notification.expand();

            _(this).type = type;
            _(this).notification.attachTo(this.getContainer());
        },

        getType: function() {
            return _(this).type;
        },

        detachNotification: function() {
            if (_(this).notification) {
                _(this).notification.destroy();
                _(this).notification = null;
            }
            _(this).type = "NONE";
        }
    });
});
