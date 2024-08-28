define([
    'jscore/core',
    'uit!./summaryElement.html',
    'usersgroupedit/Dictionary',
    'identitymgmtlib/Utils'
], function(core, View, Dictionary, Utils) {

    return core.Widget.extend({

        init: function(options) {
            //dialogInfo
            options = options || {};
            this.icon = options.icon || 'dialogInfo';
            this.message = options.message;
            this.value = options.value;
            this.view = new View({
                message: Utils.printf(this.message, this.value),
                icon: this.icon
            });
        },
        onViewReady: function() {}
    });

});
