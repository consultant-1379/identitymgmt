define([
    'jscore/core',
    '../../Dictionary',
    'uit!./mainregion.html',
], function(core, Dictionary, View) {

    return core.Region.extend({

        view: function() {
            return new View({
                passOptions: {
                    model: this.options.model
                }
            });
        }
    });

});