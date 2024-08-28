define([
    'i18n!targetmanagement/app.json'
], function(Dictionary) {

    var context;

    return {
        actions : {
            'create': {
                name: Dictionary.actions.createTargetGroup,
                type: 'button',
                color: 'darkBlue',
                action: function() {
                    context.eventBus.publish('actions:create');
                }
            },
            'delete': function(targetGroupsToDelete, disable) {
                return {
                    name: Dictionary.actions.deleteTargetGroup,
                    type: "button",
                    icon: "delete",
                    disabled: disable,
                    action: function() {
                        context.eventBus.publish('actions:delete', targetGroupsToDelete);
                    }
                };
            },
            'display': function(selectedTargetGroupName) {
                return {
                    name: Dictionary.actions.viewTargetGroup,
                    type: "button",
                    action: function () {
                        context.eventBus.publish('actions:view', selectedTargetGroupName);
                    }
                };
            },
            'edit': function(selectedTargetGroupName) {
                return {
                    name: Dictionary.actions.editTargetGroup,
                    type: 'button',
                    icon: 'edit',
                    action: function() {
                        context.eventBus.publish('actions:edit', selectedTargetGroupName);
                    }
                };
            },
            'refresh': {
                name: Dictionary.actions.refresh,
                type: 'button',
                icon: 'refresh',
                action: function() {
                    context.eventBus.publish('actions:refresh');
                }
            }
        },

        setContext: function(ctx) {
            context = ctx;
        },

        /**
         * Returns the default actions.
         *
         * @method getDefaultActions
         * @return {Array<Object>} actions
         */
        getDefaultActions: function() {
            return [this.actions.create];
        },

        /**
         * Figures out the actions to show based on selected rows.
         *
         * @method getContextActions
         * @param {Integer} checkedRows
         * @param {Boolean} excludeDefaults
         * @return {Array<Object>} actions
         */
        getContextActions: function(checkedRows, excludeDefaults) {

            var sortedButtons = createEmptyButtonsObject();

//            if(!excludeDefaults) {
//                sortedButtons.createButton = this.actions.create;
//            }

            if(isAnyRowSelected(checkedRows)) {
                if(isTgNamedALLorNONEnotSelected(checkedRows)) {
                    sortedButtons.deleteButton = this.actions.delete(checkedRows, false);
                } else {
                    sortedButtons.deleteButton = this.actions.delete(checkedRows, true);
                }
            } else {
                if(!excludeDefaults) {
                    sortedButtons.createButton = this.actions.create;
                }
            }

            if(isExactlyOneRowSelected(checkedRows)) {
                if(isTgNamedALLorNONEnotSelected(checkedRows)) {
                    sortedButtons.displayButton = this.actions.display(checkedRows[0].name);
                    sortedButtons.editButton = this.actions.edit(checkedRows[0].name);
                }
            }

            addSeparatorsIfNeeded(sortedButtons);
//            sortedButtons.refreshButton = this.actions.refresh;

            return convertButtonsObjectToArray(sortedButtons);
        },

         /**
         * Figure out the context actions based on the number of rows selected.
         *
         * @method getActions
         * @param {Integer} checkedRowsNumber
         * @param {Boolean} excludeDefaults
         */
        getMenuActions: function(selectedRows, excludeDefaults) {
            var output = [];
            this.getContextActions(selectedRows, excludeDefaults).forEach(function(ar) {
                output.push(ar);
            });
            return output;
        }
    };

    function isDefaultTargetGroupNotSelected(checkedRows) {
        return !checkedRows.some(function(row) {
            return row.isDefault;
        });
    }

    function isTgNamedALLorNONEnotSelected(checkedRows) {
        return !checkedRows.some(function(row) {
            return (row.name === 'ALL' || row.name === 'NONE');
        });
    }

    function addSeparatorsIfNeeded(buttons) {
        if(buttons.createButton &&
            (buttons.editButton || buttons.deleteButton)) {
                buttons.firstSeparator = {type: 'separator'};
        }
        if(buttons.displayButton) {
            buttons.secondSeparator = {type: 'separator'};
        }
    }

    function isAnyRowSelected(checkedRows) {
        return (checkedRows && checkedRows.length > 0);
    }

    function isExactlyOneRowSelected(checkedRows) {
        return (checkedRows && checkedRows.length === 1);
    }

    function convertButtonsObjectToArray(buttons) {
        return Object.keys(buttons).filter(function(key) {
            if(buttons[key]) {
                return true;
            }
        }).map(function(key) {
            return buttons[key];
        });
    }

    function createEmptyButtonsObject() {
        return {
            createButton: undefined,
            firstSeparator: undefined,
            editButton: undefined,
            deleteButton: undefined,
            secondSeparator: undefined,
            displayButton: undefined,
            refreshButton: undefined
        };
    }

});
