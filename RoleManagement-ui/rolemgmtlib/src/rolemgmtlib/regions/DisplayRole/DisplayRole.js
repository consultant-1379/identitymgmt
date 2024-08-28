define([
        'jscore/core',
        'jscore/ext/binding',
        './DisplayRoleView',
        'rolemgmtlib/regions/ComAliasRoleList/ComAliasRoleList',
        'rolemgmtlib/widgets/CustomRoleDetails/CustomRoleDetails',
        'i18n!rolemgmtlib/dictionary.json'
], function(core, binding, View, ComRolesList, CustomRoleDetails, dictionary) {

    return core.Region.extend({

        View: View,

        comRolesList: null,

        typeItems : {
            "com": { name: dictionary.roleForm.com },
            "comalias": { name: dictionary.roleForm.comalias },
            "system": { name: dictionary.roleForm.system },
            "application": { name: dictionary.roleForm.system },
            "cpp": { name: dictionary.roleForm.cpp },
            "custom": { name: dictionary.roleForm.custom }
        },

        statusItems: {
            "ENABLED": { name: dictionary.roleForm.role_status_enabled },
            "DISABLED": { name: dictionary.roleForm.role_status_disabled },
            "DISABLED_ASSIGNMENT": { name: dictionary.roleForm.role_status_disabledassignment },
        },

        onViewReady: function(){
            this.options.model.fetch({
                success: function(model) {
                    this.updateView();
                    this.options.roleModelBeforeModification.setAttributes( this.options.model.getAttributes());
                }.bind(this),
                error: function() {
                    console.log("error while fetching model");
                }
            });
        },

        updateView: function(){
            this.view.setName(this.options.model.getName());
            this.view.setDescription(this.options.model.getDescription());
            this.view.setStatus(this.statusItems[this.options.model.getStatus()].name);
            this.view.setType(this.typeItems[this.options.model.getType()].name);
            if(this.options.model.getType() === 'comalias') {
                this.showComRoles();
            } else if(this.options.model.getType() === 'custom') {
                this.showCustomRoles();
            }

            if(this.options.model.getType() === 'application' || this.options.model.getType() === 'system') {
                this.getEventBus().publish("displayRole:hideEditButton");
            }
        },

        showComRoles: function() {
            this.comRolesList = new ComRolesList({
                    context : this.getContext(),
                    action : this.options.action
            });
            this.comRolesList.start(this.view.getRolesListFormElement());
            if(this.options.action !== 'create') {
                this.getEventBus().publish("comrolesTable:selectRoles", this.options.model.attributes.roles);
            }
        },

        showCustomRoles: function() {
            this.customRoleDetails = new CustomRoleDetails({
                action: this.options.action,
                roles: this.options.model.attributes.roles,
                policy: this.options.model.attributes.policy
            });
            this.customRoleDetails.attachTo(this.view.getCustomRoleDetailfFormElement());
        }
    });
});
