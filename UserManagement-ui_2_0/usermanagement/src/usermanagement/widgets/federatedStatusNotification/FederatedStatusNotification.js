define([
    'jscore/core',
    '../../Dictionary',
    'usermgmtlib/widgets/ExpandableNotification',
    'uit!./FederatedStatusNotification.html',
    'usermgmtlib/services/UserManagementService',
    "identitymgmtlib/Utils",
    "identitymgmtlib/SystemTime"
], function(core, Dictionary, Notification, View, UserManagementService, Utils, SystemTime ) {
    'use strict';

    return core.Widget.extend({
        View: View,

        onViewReady: function() {
            this.notification = null;
            this.getLastSyncReport();
        },

        refreshData: function() {
            UserManagementService.getFederatedState().then(function(data) {
                this.attachNotification(data);
            }.bind(this), function() {
                this.detachNotification();
            }.bind(this));
        },

        getLastSyncReport: function() {
            UserManagementService.getFederatedReport().then(function(data) {
                if ( data.actionReport && data.actionReport.action && data.actionReport.action !== "" ) {
                    this.lastSyncReportDateLabel  = Utils.printf(Dictionary.lastSyncReportDateLabel[data.actionReport.action],
                                        SystemTime.getDate(data.actionReport.startTime));
                }
                this.refreshData();
            }.bind(this), function() {
                this.lastSyncReportDateLabel = "";
                this.refreshData();
            }.bind(this));

        },

        getContainer: function() {
            return this.view.findById("container");
        },

        attachNotification: function(data) {
            if (this.notification) {
                 this.notification.destroy();
                this.trigger('refresh'); // refresh the user list
            }

            if ( data.operState && Dictionary.operState[data.operState] ) {
                this.notification = this.createNotification(Dictionary.operState[data.operState]);
            } else {
                // data.operState missing or not managed --> display anyway the value
                this.notification = this.createNotification(data.operState);
            }

            this.notification.getLinks()[0].addEventHandler('click', function() {
                this.getLastSyncReport();
            }.bind(this));

            this.notification.addEventHandler('close', function() {
                this.notification = null;
            }.bind(this));
            this.notification.expand();
            this.notification.attachTo(this.getContainer());
        },

        createNotification: function(label, showCloseButton, color, icon) {
            if ( this.lastSyncReportDateLabel !== ""  ) {
                label = label + " " + this.lastSyncReportDateLabel;
            }
            return new Notification({
                label: label + " - [Refresh]()",
                color: color || 'paleBlue',
                autoDismiss: false,
                icon: icon || "infoMsgIndicator",
                showCloseButton: showCloseButton || false
            });
        },

        detachNotification: function() {
            if (this.notification) {
                this.notification.destroy();
                this.notification = null;
            }
        }
    });
});
