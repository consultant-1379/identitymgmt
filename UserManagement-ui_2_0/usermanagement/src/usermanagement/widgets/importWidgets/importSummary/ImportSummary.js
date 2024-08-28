define([
    'jscore/core',
    '../../../Dictionary',
    'jscore/ext/privateStore',
    'uit!./ImportSummary.html',
    'usermgmtlib/services/UserManagementService',
    'identitymgmtlib/Utils'
], function(core, Dictionary, PrivateStore, View, UserManagementService, Utils) {
    'use strict';

    var _ = PrivateStore.create();

    var _setType = function(type, successfulAmount, failedAmount) {
        type = (type ? type.toLowerCase() : type);
        if (type !== "error" && type !== "partial" && type !== "success") {
            throw new Error("Invalid summary type");
        }
        var all = successfulAmount + failedAmount;

        switch(type) {
            case "error":
                _(this).options.frontLabel = Dictionary.notificationsFlyout.onFailureSummaryLabelPart1;
                _(this).options.label = Dictionary.notificationsFlyout.onFailureSummaryLabelPart2;
                if (typeof successfulAmount === "number" && typeof all === "number") {
                    _(this).options.summary = Utils.printf(Dictionary.notificationsFlyout.summaryContent, successfulAmount, all);
                } else {
                    _(this).options.summary = Dictionary.notificationsFlyout.onFailureSummaryContent;
                }
                _(this).options.color = "ebColor_red";
                _(this).options.error = true;
                break;
            case "partial":
                _(this).options.frontLabel = Dictionary.notificationsFlyout.onPartialSuccessSummaryLabelPart1;
                _(this).options.label = Dictionary.notificationsFlyout.onPartialSuccessSummaryLabelPart2;
                _(this).options.summary = Utils.printf(Dictionary.notificationsFlyout.summaryContent, successfulAmount, all);
                _(this).options.color = "ebColor_orange";
                _(this).options.warning = true;
                break;
            default:
                _(this).options.label = Dictionary.notificationsFlyout.summaryLabel;
                _(this).options.summary = Utils.printf(Dictionary.notificationsFlyout.summaryContent, successfulAmount, all);
        }
    };

    return core.Widget.extend({

        init: function(options) {
            options = options || {};
            _(this).importId = options.importId;
            _(this).options = {};
            _(this).options.reportButtonOptions = {
                caption: Dictionary.notificationsFlyout.viewReportButton
            };

            if (options.type === "error") {
                _setType.call(this, "error", options.successfulAmount, options.failedAmount);
            } else if (options.failedAmount > 0) {
                if (options.successfulAmount > 0) {
                    _setType.call(this, "partial", options.successfulAmount, options.failedAmount);
                } else {
                    _setType.call(this, "error", options.successfulAmount, options.failedAmount);
                }
            } else {
                _setType.call(this, "success", options.successfulAmount, options.failedAmount);
            }
            _(this).options.timestamp = options.timestamp || "00:00";

            this.view = new View(_(this).options);
        },

        onViewReady: function() {
            this.getCloseIcon().addEventHandler('click', function() {
                this.trigger('close');
            }.bind(this));
            this.addViewReportListener();
        },

        getCloseIcon: function() {
            return this.view.findById('closeIcon');
        },

        getFrontLabel: function() {
            return this.view.findById('frontLabel');
        },

        getReportButton: function() {
            return this.view.findById('reportButton');
        },

        addViewReportListener: function() {
            this.getReportButton().addEventHandler('click', function() {
                UserManagementService.getImportReport({
                    importId: _(this).importId
                }).then(function(report) {
                    var url = 'data:text/json;charset=utf-8,' + report;
                    var name = 'report.json';
                    var anchor = document.createElement('a');
                    anchor.setAttribute('href', url);
                    anchor.setAttribute('download', name);

                    //Create event
                    var ev = document.createEvent("MouseEvents");
                    ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

                    //Fire event
                    anchor.dispatchEvent(ev);
                });
            }.bind(this));
        }
    });
});