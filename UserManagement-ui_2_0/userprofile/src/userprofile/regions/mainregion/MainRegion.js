define([
    'jscore/core',
    'uit!./mainregion.html',
    '../../Dictionary'
], function(core, View, Dictionary){

    return core.Region.extend({

        view: function() {
            return new View({
                Dictionary: Dictionary,
                view: this.options.type === 'view',
                edit: this.options.type === 'edit',
                userProfileOptions: {
                    model: this.options.model,
                    federated: this.options.federatedUserView
                },
                userPrivilegesOptions: {
                    model: this.options.model
                }
            });
        }
    });

});