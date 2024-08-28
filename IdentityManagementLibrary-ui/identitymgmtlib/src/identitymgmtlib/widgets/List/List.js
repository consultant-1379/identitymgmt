define([
    'jscore/core',
    './ListView'
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
        
        getElements: function() {
            return this.elements;
        }

    });
});
