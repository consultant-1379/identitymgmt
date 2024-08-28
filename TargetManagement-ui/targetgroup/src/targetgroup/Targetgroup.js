define([
    'container/api',
    'jscore/core',
    'identitymgmtlib/ParamsLocationController',
    'jscore/ext/net',
    'jscore/ext/utils/base/underscore',
    './TargetgroupView',
    'layouts/TopSection',
    'identitymgmtlib/Utils',
    'targetmgmtlib/widgets/TargetgroupForm',
    'targetmgmtlib/model/TargetgroupModel',
    'widgets/Notification',
    'i18n!targetgroup/app.json',
    'identitymgmtlib/AccessControlService',
    'identitymgmtlib/widgets/ResponsesSummaryDialog',
    'targetmgmtlib/NetworkExplorerManager',
    './TargetgroupActionsManager',
    'targetmgmtlib/ServerResponseCodes'
    ], function(container, core, LocationController, net, underscore, View, TopSection, Utils, TargetgroupForm, TargetgroupModel, Notification, Dictionary, accessControlService, ResponsesSummaryDialog, NetworkExplorerManager, ActionsManager, ServerResponseCodes) {

    function showLoader() {
        container.getEventBus().publish('container:loader');
    }

    function hideLoader() {
        container.getEventBus().publish('container:loader-hide');
    }

    return core.App.extend({

        View: View,

        onStart: function() {
            this.initData();
            this.action = null;
            this.formRegion = null;
            this.goto = null;
            this.targetGroup = null;

            this.topSection = null;
            this.appAvailable = true;
            this.formDataSavedSuccessfully = true;
            this.addingNeTargetsInProgress = false;
            this.subscriptions = {};
            accessControlService.isAppAvailable("targetmanagement", Utils.createAccessControlRegion.bind(this));
            ActionsManager.setContext(this.getContext());

            this.getEventBus().subscribe("addtopologydata:itemSelected", function(config) {
                this.addingNeTargetsInProgress = true;
                if (this.formRegion) {
                    this.oldDescription = this.formRegion.getDescription();
                }
                showLoader.call(this);
                _updateTargetsToAdd.call(this, config );
            }.bind(this));
            this.getEventBus().subscribe("model:initialised", function(_model) {
                this.targetgroupModelBeforeModification.setName(_model.getName());
                this.targetgroupModelBeforeModification.setDescription(_model.getDescription());
            }.bind(this));
            this.locationController = new LocationController({
                namespace: this.options.namespace,
                autoUrlDecode: false
            });
            this.locationController.addLocationListener(this.onLocationChange.bind(this));
            this.locationController.start();
        },

        addNodesToTable: function(nodesLists) {
            this.formRegion.addNodesToWidget(nodesLists);
        },

        onLocationChange: function(hash) {
            this.renderApp(hash);
        },

        renderApp: function(hash, fromNetworkExplorer) {
            if (!this.subscriptions) {
                this.subscriptions = {};
            }
            var parsedUrl = Utils.parseHash(hash);
            var oldAction = this.action;
            this.action = null;
            this.targetGroup = null;
            this.goto = parsedUrl.query.goto || 'targetmanagement';
            
            if (this.parseAction(parsedUrl) === false) {
                return;
            }            

            if (this.targetgroupModel === null || this.targetGroup !== this.targetgroupModel.getId() || this.action !== oldAction) {
                this.resetFields();
                if (this.targetGroup === null) {
                    this.targetgroupModel = new TargetgroupModel();
                } else {
                    this.targetgroupModel = new TargetgroupModel({
                        id: this.targetGroup
                    });
                }
            }

            if (!this.formRegion) {
                this.formRegion = new TargetgroupForm({
                    action: this.action,
                    targetGroup: this.targetGroup,
                    model: this.targetgroupModel,
                    context: this.getContext(),
                    locationController: this.locationController,
                    newNodes: this.targetsToAdd,
                    description: this.oldDescription,
                    eventBus: this.getEventBus()
                });

                this.topSection = this.createTopSection(this.action, this.targetGroup);
                this.topSection.setContent(this.formRegion);
                this.topSection.attachTo(this.getElement());
                this.addActionsEventHandlers(this.action);
            }
        },

        resetFields: function() {
            if (this.formRegion) {
                this.formRegion.destroy();
            }
            this.formRegion = null;
            this.rowsToDelete = [];
            this.initData();
        },

        parseAction: function(parsedUrl) {
            var splitedHash = parsedUrl.hash.split('/');
            if (parsedUrl.hash === '') {
                this.action = 'create';
            } else {
                this.action = splitedHash[0];
            }
            if (splitedHash.length > 1) {
                this.targetGroup = splitedHash[1];
            }
            return this._isActionValid();
        },

        onResume: function() {
            this.isReturningToTargetManagment = false;
            accessControlService.isAppAvailable("targetmanagement", Utils.createAccessControlRegion.bind(this));
            if (!this.addingNeTargetsInProgress) { //Case: Add new targets after unsuccesfull save
                this.formDataSavedSuccessfully = true;
            }
            this.addingNeTargetsInProgress = false;
            if ((this.locationController.getParameterAsString('collections') || this.locationController.getParameterAsString('savedsearches'))) {
                showLoader.call(this);
                _updateTargetsToAdd.call(this, _getLocalConfig.call(this));
            } else {
                this.locationController.start();
            }
        },

        onPause: function() {
            this.locationController.stop();
            if (this.isReturningToTargetManagment === true) {
                this.resetFields();
            }
        },

        createTopSection: function(action, tgName) {
            if (this.topSection) {
                this.topSection.destroy();
            }
            return new TopSection({
                title: Dictionary.headers[action],
                breadcrumb: this.options.breadcrumb,
                context: this.getContext(),
                defaultActions: this.getDefaultActionButtons.call(this, action, tgName)
            });
        },

        getDefaultActionButtons: function(action, tgName) {
            if (action === 'create') {
                return ActionsManager.getDefaultActionsForCreate();
            } else if (action === 'view') {
                if (tgName === 'ALL' || tgName === 'NONE') {
                    return ActionsManager.getDefaultActionsForView(true);
                }
                return ActionsManager.getDefaultActionsForView(false);
            } else if (action === 'edit') {
                return ActionsManager.getDefaultActionsForEdit();
            } else {
                return [];
            }
        },

        addActionsEventHandlers: function(action) {
            this._subscribeOnEvents(action);
            this._addEventHandlers(action);
        },

        saveAction: function() {
            this.getEventBus().publish('model:update', this.targetgroupModel);
            if (this._validateModel().isSuccessful) {
                this._saveTargetGroup();
            } else {
                this.getEventBus().publish('model:hasErrors', this.errors);
            }
        },

        cancelAction: function() {
            this.getEventBus().publish('model:update', this.targetgroupModel);
            window.location.hash = this.goto;
        },

        initData: function() {
            this.rowsToDelete = [];
            this.targetsToAdd = [];
            this.oldDescription = undefined;
            this.targetgroupModelBeforeModification = new TargetgroupModel();
            this.targetgroupModel = null;
        },

        editAction: function() {
            this.locationController.setNamespaceLocation('edit/' + this.targetGroup);
        },

        removeNodeAction: function() {
            this.formRegion.targetsTableWidget.getSelectedRows().forEach(function(row) {
                var data = row;
                var found = false;
                for (var i in this.targetsToAdd) {
                    if (this.targetsToAdd[i].name === row.name) {
                        this.targetsToAdd.splice(i, 1);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    this.rowsToDelete.push(data);
                }
            }.bind(this));
            this.formRegion.targetsTableWidget.removeRowsFromTargetsTable(this.formRegion.targetsTableWidget.getSelectedRows());
            this.contextActionsForEdit([]);
        },

        onBeforeLeave: function(event) {
            var newChangesInName = this.targetgroupModelBeforeModification.getName() !== this.targetgroupModel.getName();
            var newChangesInDescription = this.targetgroupModelBeforeModification.getDescription() !== this.targetgroupModel.getDescription();
            var newChangesInTargetsList = (this.targetsToAdd.length > 0) || (this.rowsToDelete.length > 0);
            if (event.target && event.target === 'targetmanagement') {
                this.isReturningToTargetManagment = true;
            }
            if (this.action !== 'view' && this.appAvailable && !this.addingNeTargetsInProgress) {
                if (!this.formDataSavedSuccessfully || newChangesInName || newChangesInDescription || newChangesInTargetsList) {
                    return Dictionary.confirmNav;
                }
            }

        },

        contextActionsForEdit: function(checkedRows) {
            if (checkedRows && checkedRows.length > 0) {
                var actions = ActionsManager.getContextActionsForEdit(checkedRows, false);
                this.getEventBus().publish('topsection:contextactions', actions);
            } else {
                this.getEventBus().publish('topsection:leavecontext');
            }
        },

        contextMenuActionsForEdit: function(checkedRows, e) {
            var actions = ActionsManager.getContextActionsForEdit(checkedRows, true);
            // Don't show menu if actions list is empty
            if (actions.length > 0) {
                container.getEventBus().publish('contextmenu:show', e, actions);
            } else {
                e.preventDefault();
            }
        },

        _saveTargetGroup: function() {
            showLoader.call(this);
            if (this.action === 'create') {
                getCreateTargetGroupPromise.call(this).then(this._saveSuccessHandler.bind(this)).catch(this._saveTargetGroupErrorHandler.bind(this));
            } else if (this.action === 'edit') {
                getUpdateTargetGroupRequestsPromise.call(this, {
                    targetGroup: this.targetgroupModel.getName(),
                    targetsToAdd: this.targetsToAdd,
                    targetsToRemove: this.rowsToDelete
                }).then(this._saveSuccessHandler.bind(this)).catch(this._saveBothModifiedErrorHandler.bind(this));
            }
        },

        _saveBothModifiedErrorHandler: function(responses) {
            this.formDataSavedSuccessfully = false;
            if (responses.targets.response === undefined) {
                this._saveTargetGroupErrorHandler(responses.description.response);
            } else {
                this._createErrorSummaryDialog(responses);
            }
        },

        _validateModel: function() {
            this.errors = this.targetgroupModel.validate();
            if (this.errors.name || this.errors.description) {
                return {
                    isSuccessful: false
                };
            }
            return {
                isSuccessful: true
            };
        },

        _saveSuccessHandler: function() {
            this.formDataSavedSuccessfully = true;
            _showNotification(this.action === 'create' ? Dictionary.notifications.targetgroupCreated : Dictionary.notifications.targetgroupEdited);
            this.rowsToDelete = [];
            this.targetsToAdd = [];
            this.oldDescription = undefined;
            window.location.hash = this.goto;
            hideLoader.call(this);
        },

        _saveTargetGroupErrorHandler: function(response) {
            hideLoader.call(this);
            var errorMessage = Utils.getErrorMessage(response.getResponseJSON().httpStatusCode, response.getResponseJSON().internalErrorCode);
            Utils.errorInfo(Dictionary.error, errorMessage.internalErrorCodeMessage || errorMessage.defaultHttpMessage);
        },

        _getErrorMsg: function(response, description) {
            var message = [];
            message.push(description);
            message.push(response.getStatus());
            if (response.getStatus() === 200) {
                message.push(response.getStatusText());
            } else {
                message.push(response.getResponseJSON().internalErrorCode);
                var targetName = response.getResponseJSON().userMessage.split(' ');
                message.push(targetName[0]);
            }
            return message;
        },

        _createErrorSummaryDialog: function(responses) {
            hideLoader.call(this);
            return new ResponsesSummaryDialog({
                header: Dictionary.errorSummary.title,
                data: [
                    this._getErrorMsg(responses.description.response, Dictionary.errorSummary.actionUpdateDescription),
                    this._getErrorMsg(responses.targets.response, Dictionary.errorSummary.actionUpdateTargetGroups)
                ],
                elementNameColumnHeader: Dictionary.errorSummary.elementColumnName,
                errorCodes: Dictionary.errorCodes,
                hideStatusCounters: true,
                displayResponseStatusIcons: true
            });
        },

        _subscribeOnEvents: function(action) {
            if (!this.subscriptions['tgActions:save']) {
                this.subscriptions['tgActions:save'] = this.getEventBus().subscribe('tgActions:save', this.saveAction.bind(this));
            }
            if (!this.subscriptions['tgActions:cancel']) {
                this.subscriptions['tgActions:cancel'] = this.getEventBus().subscribe('tgActions:cancel', this.cancelAction.bind(this));
            }
            if (!this.subscriptions['tgActions:edit']) {
                this.subscriptions['tgActions:edit'] = this.getEventBus().subscribe('tgActions:edit', this.editAction.bind(this));
            }
            if (!this.subscriptions['tgActions:removeNode']) {
                this.subscriptions['tgActions:removeNode'] = this.getEventBus().subscribe('tgActions:removeNode', this.removeNodeAction.bind(this));
            }
        },

        _addEventHandlers: function(action) {
            if (action === 'edit') {
                this.formRegion.targetsTableWidget.addEventHandler('checkend', this.contextActionsForEdit.bind(this));
                this.formRegion.targetsTableWidget.addEventHandler('pageloaded', this.contextActionsForEdit.bind(this));
                this.formRegion.targetsTableWidget.addEventHandler('rowevents:contextmenu', this.contextMenuActionsForEdit.bind(this));
            }
        },

        _isActionValid: function() {
            if (this.action === 'create' && !this.targetGroup) {
                return true;
            } else if ((this.action === 'edit' || this.action === 'view') && this.targetGroup) {
                return true;
            }
            return false;
        }
    });

    function _clearUrlParameters(id) {
        this.locationController.removeParameter(id);
        this.locationController.removeParameter('generatedCollection');
    }

    function _updateTargetsToAdd(config) {
        NetworkExplorerManager.reloadTargets({
            type: config.id,
            data: config.value,
            success: function(nodesListArray) {
                var newTargetsToAdd = [];
                var atLeastANodeSelected = false;
                nodesListArray.forEach(function(nodesList) {
                    nodesList.forEach(function(nodes) {
                        nodes.forEach(function(node) {
                            atLeastANodeSelected = true;
                            if (_checkNodeIsRemoved.call(this, node)) {
                                newTargetsToAdd.push(node);
                            }
                            if (!_checkNodeIsOriginal.call(this, node)) {
                                if (!_checkNodeIsAlreadyAdded.call(this, node)) {
                                    this.targetsToAdd.push(node);
                                    newTargetsToAdd.push(node);
                                }
                            }
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
                _clearUrlParameters.call(this, config.id);
                this.addNodesToTable(newTargetsToAdd);
                this.renderApp(this.locationController.getNamespaceLocation(), true);
                hideLoader.call(this);

                var invalid = function (target) {
                    return target.valid === false;
                };

                if (!atLeastANodeSelected) {
                    _showNotification(Dictionary.notifications.collectionEmpty);
                } else {
                    if (newTargetsToAdd.length === 0) { 
                        _showNotification(Dictionary.notifications.noNewTargetsAdded);                    
                    } else {
                        if ( newTargetsToAdd.some( invalid ) ) {
                            _showErrorNotification(Dictionary.notifications.targetsLoadedWithErrors);
                        } else {
                            _showNotification(Dictionary.notifications.targetsLoaded);
                        }
                    }
                }

            }.bind(this),
            error: function(response, xhr) {
                hideLoader.call(this);
                var title = response.getStatus();
                var message = response.getStatusText() ;

                if ( response && response.getResponseText() ) {
                    var responseText = JSON.parse(response.getResponseText());
                    if ( responseText.userMessage ) {
                        if ( responseText.userMessage.title ) {
                            title = responseText.userMessage.title;
                        }

                        if ( responseText.userMessage.body ) {
                            message = responseText.userMessage.body;
                        }
                    } else {
                        if ( responseText.title ) {
                            title = responseText.title;
                        }

                        if ( responseText.body ) {
                            message = responseText.body;
                        }
                    }
                }
                Utils.errorInfo(title, message );
            }
        });
    }


    function _checkNodeIsAlreadyAdded(newTargetToAdd) {
        for (var i in this.targetsToAdd) {
            if (this.targetsToAdd[i].name === newTargetToAdd.name) {
                return true;
            }
        }
        return false;
        // return this.targetsToAdd.some(function(el) {
        //     return el.name === newTargetToAdd.name;
        // }.bind(this));
    }

    function _checkNodeIsOriginal(newTargetToAdd) {
        var originalData = this.formRegion.targetsTableWidget.getOriginalData();
        for (var i in originalData) {
            if (originalData[i].name === newTargetToAdd.name) {
                return true;
            }
        }
        return false;
        // return this.formRegion.targetsTableWidget.getOriginalData().some(function(el) {
        //     return (el.name === newTargetsToAdd.name);
        // }.bind(this));
    }

    function _checkNodeIsRemoved(newTargetToAdd) {
        var found = false;
        this.rowsToDelete = this.rowsToDelete.filter(function(el) {
            if (el.name === newTargetToAdd.name) {
                found = true;
                return false;
            } else {
                return true;
            }
        });
        return found;
    }

    function _showNotification(notificationLabel) {
        new Notification({
            label: notificationLabel,
            color: 'green',
            icon: 'tick',
            showCloseButton: true,
            showAsGlobalToast: true,
            autoDismiss: true,
            autoDismissDuration: 10000
        });
    }

    function _showErrorNotification(notificationLabel) {
        new Notification({
            label: notificationLabel,
            color: 'red',
            icon: 'error',
            showCloseButton: true,
            showAsGlobalToast: true,
            autoDismiss: true,
            autoDismissDuration: 10000
        });
    }

    function _getLocalConfig() {
        var local_config = {};
        if ((local_config.value = this.locationController.getParameterAsString('collections')) !== undefined) {
            local_config.id = 'collections';
            return local_config;
        } else if ((local_config.value = this.locationController.getParameterAsString('savedsearches')) !== undefined) {
            local_config.id = 'savedsearches';
            return local_config;
        }
    }

    function getCreateTargetGroupPromise() {
        return new Promise(function(resolve, reject) {
            try {
                this.targetgroupModel.save({
                    id: this.targetgroupModel.getId()
                }, {
                    success: function(_model, response, options) {
                        this.targetgroupModelBeforeModification.setName(_model.getName());
                        this.targetgroupModelBeforeModification.setDescription(_model.getDescription());
                        resolve(response);
                    }.bind(this),
                    error: function(model, response, options) {
                        reject(response);
                    }
                });
            } catch (exception) {
                console.error(exception);
            }
        }.bind(this));
    }

    function getUpdateTargetGroupDescriptionPromise() {
        return new Promise(function(resolve, reject) {
            try {
                var dataToSend = {
                    description: this.targetgroupModel.getDescription()
                };
                net.ajax({
                    url: "/oss/idm/targetgroupmanagement/targetgroups/" + this.targetGroup + "/description",
                    type: "PUT",
                    contentType: 'application/json',
                    data: JSON.stringify(dataToSend),
                    success: function(data, xhr) {
                        this.targetgroupModelBeforeModification.setName(JSON.parse(data).name);
                        this.targetgroupModelBeforeModification.setDescription(JSON.parse(data).description);
                        this.oldDescription = undefined;
                        resolve(xhr);
                    }.bind(this),
                    error: function(errorMsg, response) {
                        reject(response);
                    }
                });
            } catch (exception) {
                console.error(exception);
            }
        }.bind(this));
    }

    function getUpdateTargetGroupRequestsPromise(modifications) {
        return new Promise(function(resolve, reject) {
            try {
                var responses = createEmptyResponsesObject();
                var modifiedTargets = createTargetsObject(modifications.targetGroup, modifications.targetsToAdd, modifications.targetsToRemove);
                getUpdateTargetGroupDescriptionPromise.call(this).then(function(response) {
                    responses.description.isSuccess = true;
                    responses.description.response = response;
                    collectData();
                }).catch(function(response) {
                    responses.description.isSuccess = false;
                    responses.description.response = response;
                    collectData();
                });
                if (modifiedTargets.length !== 0) {
                    getUpdateTargetsAssignedToTargetGroupPromise.call(this, modifiedTargets).then(function(response) {
                        responses.targets.isSuccess = true;
                        responses.targets.response = response;
                        collectData();
                    }).catch(function(response) {
                        responses.targets.isSuccess = false;
                        responses.targets.response = response;
                        collectData();
                    });
                } else {
                    responses.targets.isSuccess = true;
                }
                var collectData = function() {
                    if (responses.description.isSuccess && responses.targets.isSuccess) {
                        resolve(responses);
                    } else if (responses.description.isSuccess !== undefined && responses.targets.isSuccess !== undefined) {
                        reject(responses);
                    }
                };
            } catch (exception) {
                console.error(exception);
            }
        }.bind(this));
    }

    function getUpdateTargetsAssignedToTargetGroupPromise(modifiedTargets) {
        return new Promise(function(resolve, reject) {
            try {
                if (modifiedTargets.length !== 0) {
                    net.ajax({
                        url: '/oss/idm/targetgroupmanagement/modifyassignment',
                        type: 'PUT',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify(modifiedTargets),
                        success: function(data, xhr) {
                            this.targetsToAdd = [];
                            this.rowsToDelete = [];
                            resolve(xhr);
                        }.bind(this),
                        error: function(errorMsg, response) {
                            reject(response);
                        }
                    });
                } else {
                    resolve();
                }
            } catch (exception) {
                console.error(exception);
            }
        }.bind(this));
    }

    function createTargetsObject(targetGroupName, targetsToAdd, targetsToRemove) {
        var result = [];
        if (targetGroupName) {
            if (targetsToAdd) {
                targetsToAdd.forEach(function(target) {
                    result.push({
                        action: 'ADD',
                        targetGroup: targetGroupName,
                        target: target.name
                    });
                });
            }
            if (targetsToRemove) {
                targetsToRemove.forEach(function(target) {
                    result.push({
                        action: 'REMOVE',
                        targetGroup: targetGroupName,
                        target: target.name
                    });
                });
            }
        }
        return result;
    }

    function createEmptyResponsesObject() {
        return {
            description: {
                isSuccess: undefined,
                response: undefined
            },
            targets: {
                isSuccess: undefined,
                response: undefined
            }
        };
    }
});
