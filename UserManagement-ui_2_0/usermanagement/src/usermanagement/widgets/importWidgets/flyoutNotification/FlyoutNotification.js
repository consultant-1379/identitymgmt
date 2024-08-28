define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./FlyoutNotification.html',
    'identitymgmtlib/SystemTime',
    '../importSummary/ImportSummary',
    '../progressNotification/ProgressNotification'
], function(core, PrivateStore, View, systemTime, ImportSummary, ProgressNotification) {
    'use strict';

    var _ = PrivateStore.create();

    var _showProgressNotification = function() {
        if (!_(this).progressNotification && !_(this).importSummary) {
            _(this).progressNotification = new ProgressNotification({
                timestamp: _(this).timestamp
            });
            _(this).progressNotification.attachTo(this.getNotificationContainer());
        }
    };

    var _showImportSummary = function(successfulAmount, failedAmount, type) {
        if (_(this).progressNotification) {
            _(this).progressNotification.destroy();
            _(this).progressNotification = null;
        }
        if (!_(this).importSummary) {
            _(this).importSummary = new ImportSummary({
                successfulAmount: successfulAmount,
                failedAmount: failedAmount,
                timestamp: _(this).timestamp,
                importId: _(this).importId,
                type: type
            });
            _(this).importSummary.addEventHandler('close', function() {
                this.trigger('close');
            }.bind(this));
            _(this).importSummary.attachTo(this.getNotificationContainer());
        }
    };

    var _setProgressValue = function(value, max) {
        if (_(this).progressNotification) {
            _(this).value = value;
            _(this).max = max;
            _(this).progressNotification.setValue(value, max);
        }
    };

    var _setInitialState = function() {
        switch(_(this).state) {
            case 'FINISHED_WITH_ERROR':
                if (_(this).loggedUser === _(this).importOwner) {
                    _showImportSummary.call(this, _(this).successfulAmount, _(this).failedAmount, "error");
                } else {
                    this.trigger('close');
                }
                break;
            case 'FINISHED':
                if (_(this).loggedUser === _(this).importOwner) {
                    _showImportSummary.call(this, _(this).successfulAmount, _(this).failedAmount);
                } else {
                    this.trigger('close');
                }
                break;
            default:
                _showProgressNotification.call(this);
                _setProgressValue.call(this, _(this).value, _(this).max);
        }
    };

    var _setTimestamp = function(timestamp) {
        _(this).timestamp = timestamp ? systemTime.formatTimestampImport(timestamp).format('DT') : "00:00";
    };

    return core.Widget.extend({

        View: View,

        init: function(options) {
            options = options || {};
            options.state = (options.state ? options.state.toUpperCase() : options.state);
            _(this).attached = false;
            _(this).state = options.state;
            _(this).successfulAmount = options.successfulAmount;
            _(this).failedAmount = options.failedAmount;
            _(this).importId = options.importId;
            _(this).loggedUser = options.loggedUser;
            _(this).importOwner = options.importOwner;
            _(this).value = options.value;
            _(this).max = options.max;
            _setTimestamp.call(this, options.timestamp);
        },

        onViewReady: function() {
            _setInitialState.call(this);
        },

        onAttach: function() {
            _(this).attached = true;
        },

        getNotificationContainer: function() {
            return this.view.findById('container');
        },

        getImportId: function() {
            return _(this).importId;
        },

        handleEvent: function(data) {
            if (data.importId !== _(this).importId) {
                return;
            }
            switch (data.eventType) {
                case "PROGRESS":
                    _setProgressValue.call(this, data.event.done, data.event.all);
                    break;
                case "FINISHED_WITH_ERROR":
                    if (data.owner === _(this).loggedUser) {
                        _setTimestamp.call(this, data.event.finishTime);
                        _showImportSummary.call(this, data.event.successfulAmount, data.event.failedAmount, "error");
                    } else {
                        this.trigger('close');
                    }
                    break;
                case "FINISHED":
                    if (data.owner === _(this).loggedUser) {
                        _setTimestamp.call(this, data.event.finishTime);
                        _showImportSummary.call(this, data.event.successfulAmount, data.event.failedAmount);
                    } else {
                        this.trigger('close');
                    }
            }
        },

        getImportOwner: function() {
            return _(this).importOwner;
        },

        isAttached: function() {
            return _(this).attached;
        }
    });
});
