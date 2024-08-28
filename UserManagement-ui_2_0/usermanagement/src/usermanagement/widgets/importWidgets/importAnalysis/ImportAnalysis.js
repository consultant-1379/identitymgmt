define([
    'jscore/core',
    'uit!./ImportAnalysis.html',
    'jscore/ext/privateStore',
    '../../../Dictionary',
    'usermgmtlib/widgets/HidableDialog',
    '../usernameList/UsernameList',
    'identitymgmtlib/Utils',
    'i18n/number'
], function (core, View, PrivateStore, Dictionary, HidableDialog, UsernameList, Utils, Number) {
    'use strict';

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            _(this).options = {};
            _(this).options.view = Dictionary.importAnalysis.view;
            _(this).options.analysisHeader = Utils.printf(Dictionary.importAnalysis.analysisListHeader, Number(options.analysisResult.allUsers).format('0,0'));
            _(this).options.warningsHeader = Dictionary.importAnalysis.warningHeader;
            _(this).options.question = Dictionary.importAnalysis.question;
            _(this).options.note = Dictionary.importAnalysis.note;
            _(this).options.analysisRecords = _createAnalysisRecordList(options.analysisResult);
            _(this).options.warnings = _createWarningList(options.analysisResult.toBeModified);
            this.view = new View(_(this).options);
        },

        onViewReady: function() {
            var links = this.getViewLinks();
            links.forEach(function(link, index) {
                link.addEventHandler('click', function() {
                    this.showUsernameListDialog(_(this).options.warnings[index]);
                }.bind(this));
            }.bind(this));
        },

        showUsernameListDialog: function(usernamesData) {
            if (!_(this).usernameListDialog) {
                _(this).usernameList = new UsernameList(usernamesData);
                _(this).usernameListDialog = new HidableDialog({
                    header: Dictionary.importAnalysis.warningHeader,
                    content: _(this).usernameList,
                    type: 'warning',
                    actions: [{
                        caption: Dictionary.importAnalysis.okButton
                    }]
                });
            } else {
                _(this).usernameList.setData(usernamesData);
            }
            _(this).usernameListDialog.show();
        },

        getViewLinks: function() {
            return this.getElement().findAll('.eaUsermanagement-wImportAnalysis-link');
        }
    });

    function _createAnalysisRecordList(analysisResult) {
        if (!analysisResult) {
            return [];
        }
        var analysisRecords = [];
        if (analysisResult.toBeCreated !== undefined) {
            analysisRecords.push({
                content: Utils.printf(Dictionary.importAnalysis.analysisListItemNew, Number(analysisResult.toBeCreated).format('0,0'))
            });
        }
        if (analysisResult.toBeUpdated !== undefined) {
            analysisRecords.push({
                content: Utils.printf(Dictionary.importAnalysis.analysisListItemModified, Number(analysisResult.toBeUpdated).format('0,0'))
            });
        }
        return analysisRecords;
    }

    function _createWarningList(toBeModified) {
        if (!toBeModified) {
            return [];
        }
        var warnings = [];
        for (var property in toBeModified) {
            if (!toBeModified.hasOwnProperty(property) || !toBeModified[property].length) {
                continue;
            }
            switch (property) {
                case "security_administrators":
                    warnings.push({
                        content: Utils.printf(Dictionary.importAnalysis.warningListItemSecAdmin,Number(toBeModified[property].length).format('0,0')),
                        label: Dictionary.importAnalysis.usernameListLabelSecAdmin,
                        usernames: toBeModified[property]
                    });
                    break;
                case "administrators":
                    warnings.push({
                        content: Utils.printf(Dictionary.importAnalysis.warningListItemAdmin, Number(toBeModified[property].length).format('0,0')),
                        label: Dictionary.importAnalysis.usernameListLabelAdmin,
                        usernames: toBeModified[property]
                    });
                    break;
                case "operators":
                    warnings.push({
                        content: Utils.printf(Dictionary.importAnalysis.warningListItemOperator, Number(toBeModified[property].length).format('0,0')),
                        label: Dictionary.importAnalysis.usernameListLabelOperator,
                        usernames: toBeModified[property]
                    });
            }
        }
        return warnings;
    }

});
