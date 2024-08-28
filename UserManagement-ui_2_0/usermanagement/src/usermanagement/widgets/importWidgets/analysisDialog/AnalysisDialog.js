define([
    'widgets/Dialog',
    '../../../Dictionary',
    '../importAnalysis/ImportAnalysis',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'identitymgmtlib/Utils'
], function (Dialog, Dictionary, ImportAnalysis, UserManagementService, responseHandler, Utils) {
    'use strict';

    var _handleError = function(response, xhr) {
        responseHandler.setNotification({
            response: {
                xhr: xhr
            },
            dialog: true,
            operation: "importUsers"
        });
    };

    var _createButtonsArray = function(importId, analysisResult) {
        var buttons;
        if (analysisResult.toBeCreated && analysisResult.toBeUpdated) {
            buttons = [
                {
                    caption: Utils.printf(Dictionary.importAnalysis.importAllButton, analysisResult.allUsers),
                    action: function() {
                        UserManagementService.startImportUsers({
                            mode: "override",
                            importId: importId
                        }).then(this.hide.bind(this), _handleError);
                    }.bind(this)
                },
                {
                    caption: Utils.printf(Dictionary.importAnalysis.importNewButton, analysisResult.toBeCreated),
                    action: function() {
                        UserManagementService.startImportUsers({
                            mode: "addNew",
                            importId: importId
                        }).then(this.hide.bind(this), _handleError);
                    }.bind(this)
                },
                {
                    caption: Dictionary.importAnalysis.cancelButton,
                    action: this.hide.bind(this)
                }
            ];
        } else if (analysisResult.toBeCreated || analysisResult.toBeUpdated) {
            buttons = [
                {
                    caption: Utils.printf(Dictionary.importAnalysis.importAllButton, analysisResult.allUsers),
                    action: function() {
                        UserManagementService.startImportUsers({
                            mode: "override",
                            importId: importId
                        }).then(this.hide.bind(this), _handleError);
                    }.bind(this)
                },
                {
                    caption: Dictionary.importAnalysis.cancelButton,
                    action: this.hide.bind(this)
                }
            ];
        } else {
            buttons = [
                {
                    caption: Dictionary.importAnalysis.cancelButton,
                    action: this.hide.bind(this)
                }
            ];
        }
        return buttons;
    };

    return Dialog.extend({

        init: function (options) {
            options = options || {};
            if (!options.analysisResult) {
                options.analysisResult = {
                    allUsers: 0,
                    toBeCreated: 0,
                    toBeUpdated: 0
                };
            } else {
                options.analysisResult.allUsers = options.analysisResult.toBeCreated + options.analysisResult.toBeUpdated;
            }
            this.options.header = Dictionary.importAnalysis.dialogHeader;
            this.options.buttons = _createButtonsArray.call(this, options.importId, options.analysisResult);
            this.options.content = new ImportAnalysis(options);
        }
    });
});