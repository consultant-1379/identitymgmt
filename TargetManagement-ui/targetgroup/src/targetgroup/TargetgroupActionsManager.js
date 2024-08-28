define([
    "i18n!targetgroup/app.json",
], function(Dictionary) {

    var context;
    var actions = {
        'save': {
            name: Dictionary.save,
            type: 'button',
            color: 'darkBlue',
            action: function() {
                context.eventBus.publish('tgActions:save');
            }
        },
        'cancel': {
            name: Dictionary.cancel,
            type: "button",
            action: function() {
                context.eventBus.publish('tgActions:cancel');
            }
        },
        'removeNode': function(targetsToDelete) {
            return {
                name: Dictionary.removeNode,
                type: "button",
                icon: "delete",
                action: function () {
                    context.eventBus.publish('tgActions:removeNode', targetsToDelete);
                }
            };
        },
        'edit': function(disable) {
            return {
                name: Dictionary.edit,
                type: 'button',
                disabled: disable,
                action: function() {
                    context.eventBus.publish('tgActions:edit');
                }
            };
        }
    };

    return {
        // Define the different possible actions we can have.

        setContext: function(ctx) {
            context = ctx;
        },

        getContext: function() {
            return context;
        },

        /**
         * Returns the default actions for View Target Group page.
         *
         * @method getDefaultActionsForView
         * @param {Boolean} shouldEditBeDisabled - if true returns disabled button
         * @return {Array<Object>} actions
         */
        getDefaultActionsForView: function(shouldEditBeDisabled) {
            return [actions.edit(shouldEditBeDisabled)];
        },

        /**
         * Returns the default actions for Edit Target Group page.
         *
         * @method getDefaultActionsForEdit
         * @return {Array<Object>} actions
         */
        getDefaultActionsForEdit: function() {
            return [actions.save, actions.cancel];
        },

        /**
         * Returns the default actions for Create Target Group page.
         *
         * @method getDefaultActionsForCreate
         * @return {Array<Object>} actions
         */
        getDefaultActionsForCreate: function() {
            return [actions.save, actions.cancel];
        },

        /**
         * Returns appropriate actions based on number of rows selected.
         *
         * @method getContextActions
         * @param {Integer} checkedRows
         * @param {Boolean} excludeDefaults - if true, exclude default buttons
         * @return {Array<Object>} actions
         */
        getContextActionsForEdit: function(checkedRows, excludeDefaults) {

            var output = [];

            if(!excludeDefaults) {
                output.push(actions.save);
                output.push(actions.cancel);
            }

            // "RemoveNode" button
            if(checkedRows && checkedRows.length > 0) {
                if(output.length > 0){
                    output.push({type: 'separator'});
                }
                output.push(actions.removeNode(checkedRows));
            }
            return output;
        }
    };

});
