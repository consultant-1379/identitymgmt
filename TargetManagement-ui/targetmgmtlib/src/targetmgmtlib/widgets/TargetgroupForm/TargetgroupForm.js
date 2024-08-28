define([
    'jscore/core',
    'container/api',
    'jscore/ext/binding',
    './TargetgroupFormView',
    'i18n!targetmgmtlib/dictionary.json',
    'identitymgmtlib/ErrorWidget',
    'identitymgmtlib/Utils',
    'targetmgmtlib/widgets/TargetsListWidget',
    'scopingpanel/ScopingPanel',
    'scopingpanel/TopologyButton',
    'targetmgmtlib/ServerResponseCodes',
], function(core, container, binding, View, dictionary, ErrorWidget, Utils, TargetsListWidget, ScopingPanel, TopologyButton, ServerResponseCodes) {

    return core.Widget.extend({

        targetsTableWidget: null,
        topologyDataWidget: null,

        view: function() {
            var actionObject = {};
            actionObject[this.options.action] = true;
            return new View({
                action: actionObject,
                targetGroup: this.options.targetGroup
            });
        },

        init: function() {
            this.eventBus = this.options.eventBus;
        },

        onViewReady: function() {
            this.modelUpdateSubscriptionId = this.eventBus.subscribe('model:update', this.updateModel.bind(this));
            this.modelErrorSubscriptionId = this.eventBus.subscribe('model:hasErrors', this.showErrors.bind(this));

            switch(this.options.action) {
                case 'create':
                    this.eventBus.publish('model:initialised', this.options.model);
                    break;
                case 'view':
                    this.fetchModel();
                    this.createTargetsListTableWidget();
                    break;
                case 'edit':
                    this.fetchModel();
                    this.createTargetsListTableWidget();
                    break;
            }
        },

        onDestroy: function() {
            this.eventBus.unsubscribe('model:update', this.modelUpdateSubscriptionId);
            this.eventBus.unsubscribe('model:hasErrors', this.modelErrorSubscriptionId);
            this.eventBus.unsubscribe(ScopingPanel.events.SELECT, this.scopingPanelSelectEventId);
            container.getEventBus().unsubscribe('flyout:show', this.scopingPanelShowEventId);
        },

        createTopologyDataWidget: function() {
            this.topologyDataWidget = new TopologyButton({
               context: this.options.context,
               title: dictionary.targetgroupForm.ScopingPanel_Title,
               multiselect: true,
               applyRecursively: true,
               multiSelectPerTab: {
                   TOPOLOGY: true,
                   SEARCH: true,
                   COLLECTIONS: true,
                   SAVED_SEARCHES: true
               },
               tabs: [
                   ScopingPanel.tabs.TOPOLOGY,
                   ScopingPanel.tabs.SEARCH,
                   ScopingPanel.tabs.COLLECTIONS,
                   ScopingPanel.tabs.SAVED_SEARCHES
               ],
               restrictions: {
                   nodeLevel: true
               },
               tabsOptions: {
                   topology: {
                       selection: {
                           collectionOfCollections: 'multi',
                           collectionOfObjects: 'multi',
                           networkObjects: 'multi',
                           combination: {
                               collections: true,
                               networkObject: true
                           }
                       }
                   }
               }
            });

            this.topologyDataWidget.attachTo(this.view.getTopologyDataElement());
            this.scopingPanelSelectEventId = this.eventBus.subscribe(ScopingPanel.events.SELECT, this.onScopingPanelSelect.bind(this));
            this.scopingPanelShowEventId = container.getEventBus().subscribe('flyout:show', this.onShowScopingPanel.bind(this));
        },

        onShowScopingPanel: function() {            
            this.oldScope = null;
        },

        onScopingPanelSelect: function(scope) {
            if ( !this.oldScope || this.oldScope === null || !scope.equals(this.oldScope) ) {
                if (scope.collections.length > 0 ) {
                    if ( scope.recursivelyFoundNetworkObjects.length > 0 ) {
                        this.eventBus.publish('addtopologydata:itemSelected', { id : "networkObjects", value : scope.recursivelyFoundNetworkObjects });
                    } else {
                        this.eventBus.publish('addtopologydata:itemSelected', { id : "collections", value : scope.collections });
                    }
                }
                if (scope.networkObjects.length > 0 ) {
                    this.eventBus.publish('addtopologydata:itemSelected', { id : "networkObjects", value : scope.networkObjects });
                }
                if (scope.savedSearches.length > 0 ) {
                    this.eventBus.publish('addtopologydata:itemSelected', { id : "savedSearches", value : scope.savedSearches });
                }
                this.oldScope = scope;
            }
        },

        createTargetsListTableWidget: function() {
            this.targetsTableWidget = new TargetsListWidget({
                action: this.options.action,
                targetGroup: this.options.targetGroup,
                context: this.options.context
            });
            this.targetsTableWidget.attachTo(this.view.getTargetsListTableElement());
        },

        showErrors: function(errors) {
            if (this.options.action === 'create') {
                if (!errors.name) {
                    this.view.setNameValid();
                } else {
                    this.view.setNameInvalid(errors.name);
                }
            }

            if (!errors.description) {
                this.view.setDescriptionValid();
            } else {
                this.view.setDescriptionInvalid(errors.description);
            }
        },

        addNodesToWidget: function(nodes) {
            if(this.options.action !== 'create' && this.targetsTableWidget) {
                this.targetsTableWidget.addRowsToTargetsTable(nodes);
            }
        },

        fetchModel: function() {
            this.options.model.fetch({
                success: function() {
                    this.view.getTargetGroupFormEntryElement().removeModifier('error');
                    this.updateView();
                    this.eventBus.publish('model:initialised', this.options.model);
                }.bind(this),
                error: function(model, response) {
                    this.view.getTargetGroupFormEntryElement().setModifier('error');
                    var errorcontent = this._retrieveErrorContent(response);
                    new ErrorWidget({
                        header: dictionary.targetgroupForm.fetch_target_group_failed,
                        content: errorcontent
                    }).attachTo(this.view.getTargetGroupFormContentErrorElement());
                }.bind(this)
            });
        },

        updateModel: function() {
            if (this.options.action === 'create') {
                this.options.model.setName(this.view.getName());
            } else {
                this.options.model.setName(this.options.targetGroup);
            }
            this.options.model.setDescription(this.view.getDescription());
        },

        updateView: function() {
            if (this.options.action === 'create') {
                this.view.setName(this.options.model.getName());
            }
            if (this.options.description) {
               this.view.setDescription(this.options.description);
            } else {
                this.view.setDescription(this.options.model.getDescription());
            }

            if(this.options.action === 'view' &&
                isTgNamedALLorNONE(this.options.model.getName())) {
                    disableEditButton.call(this);
            }
           if(this.options.action === 'edit') {
               this.createTopologyDataWidget();
           }
        },

        _retrieveErrorContent: function(_response) {
            var httpStatusCode = _response.getResponseJSON().httpStatusCode;
            var internalErrorCode = _response.getResponseJSON().internalErrorCode;
            return ServerResponseCodes.getMessage(httpStatusCode, internalErrorCode);
        },

        getDescription: function() {
            return this.view.getDescription();
        }
    });

    function isTgNamedALLorNONE(tgName) {
         return (tgName === 'ALL' || tgName === 'NONE');
     }

     function disableEditButton() {
         this.eventBus.publish("targetgroup:disableEditButton");
     }

});
