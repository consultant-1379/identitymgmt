define([
    'jscore/core',
    './ContainerWidgetView'
], function(core, View) {

    return core.Widget.extend({
        View: View,

        getRoleFormWrapper: function(){
            return this.view.getRoleFormWrapper();
        },

        getDetailsWrapper: function(){
            return this.view.getDetailsWrapper();
        }
    });

});