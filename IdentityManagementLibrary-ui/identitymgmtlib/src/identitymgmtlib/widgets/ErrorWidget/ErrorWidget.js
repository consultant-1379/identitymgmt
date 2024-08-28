define([
    'jscore/core',
    './ErrorWidgetView'
], function(core, View) {

    return core.Widget.extend({
        view: null,

        init: function(options){
            this.options = options;
            this.view = new View();
        },

        onViewReady: function(){
            this.view.setHeader(this.options.header);
            this.view.setContent(this.options.content);
        }
    });

});