define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./UserProfilePrivilegesWidget.html',
    'identitymgmtlib/mvp/binding',
    '../../Dictionary',
], function (core, PrivateStore, View, binding, Dictionary) {

    var _ = PrivateStore.create();
    var privilegesArray = [];

    return core.Widget.extend({
        init: function() {
            _(this).model = this.options.model;
        },

        view: function() {
            return new View({
                Dictionary: Dictionary,
                privilegesArray: _(this).model.get('privileges').map(
                function(privilege){
                    return privilege.get('name');
                })
            });
        },

        onViewReady: function() {
            binding.bind(_(this).model, this.view);
        }

    });

});