define([
    'jscore/core',
    './CheckListView'
], function(core, View) {

    return core.Widget.extend({

        init: function(options) {

            // Sort elements if sortFunction is available
            if (this.options.sortFunction) {
                this.elements = options.elements.sort(this.options.sortFunction);
            } else {
                this.elements = options.elements;
            }

            this.view = new View(this.options);
        },

        onViewReady: function() {
            this.updateElements();
        },

        updateElements: function() {
            // Set checked property for elements
            this.elements.forEach(function(element) {
                if (element.status) {
                    this.view.getCheckboxForElement(element).setProperty('checked', true);
                }
            }.bind(this));
        },

        selectElement: function(elementValue) {
            this.elements.forEach(function(element) {
                if (element.value === elementValue) {
                    this.view.getCheckboxForElement(element).setProperty('checked', true);
                }
            }.bind(this));
        },

        clearElements: function() {
            // Clears all checked checkboxes
            this.elements.forEach(function(element) {
                if (!element.status) {
                    this.view.getCheckboxForElement(element).setProperty('checked', false);
                }
            }.bind(this));
        },

        getCheckedElements: function(key) {
            return this.elements.filter(function(element) {
                    return this.view.getCheckboxForElement(element).getProperty('checked');
                }.bind(this))
                .map(function(element) {
                    return element[key];
                });
        }

    });
});