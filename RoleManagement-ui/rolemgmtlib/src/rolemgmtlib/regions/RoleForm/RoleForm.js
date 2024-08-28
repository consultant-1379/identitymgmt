define([
    'jscore/core',
    'container/api',
    'jscore/ext/binding',
    './RoleFormView',
    'widgets/SelectBox',
    'rolemgmtlib/regions/ComAliasRoleList/ComAliasRoleList',
    'rolemgmtlib/widgets/CustomRoleDetails/CustomRoleDetails',
    'widgets/Tooltip',
    'rolemgmtlib/model/RoleModel',
    'i18n!rolemgmtlib/dictionary.json'
], function(core, container, binding, View, SelectBox, ComRolesList, CustomRoleDetails, Tooltip, RoleModel, dictionary) {

    function showLoader() {
        container.getEventBus().publish('container:loader');
    }

    function hideLoader() {
        container.getEventBus().publish('container:loader-hide');
    }

    return core.Region.extend({

        View: View,

        comRolesList: null,

        typeItems : {
            'com':
            { name: dictionary.roleForm.com,
                value: 'com'
            },
            'comalias':
            { name: dictionary.roleForm.comalias,
                value: 'comalias'
            },
            'custom':
            { name: dictionary.roleForm.custom,
                value: 'custom'
            },
            'cpp':
            { name: dictionary.roleForm.cpp,
                value: 'cpp'
            }
        },

        onStart: function() {
            this.comRolesList = new ComRolesList({
                context : this.getContext(),
                action : this.options.action
            });
            this.customRoleDetails = new CustomRoleDetails({
                model: this.options.model,
                roles: this.options.model.getRoles(),
                policy: this.options.model.getPolicy(),
                action: this.options.action
            });
            this.getEventBus().subscribe('model:update',  this.updateModel.bind(this));
            this.getEventBus().subscribe('view:showErrors', this.showErrors.bind(this));
            this.selectBox.addEventHandler('change', function() {
                this.updateListsAndDetails(this.selectBox.getValue().value);
            }.bind(this));
        },

        onViewReady: function(){
            this.selectBox = new SelectBox({
                value: {
                    name: dictionary.roleForm.type_not_selected,
                    value: 'notSelected'
                },

                items: [this.typeItems.com, this.typeItems.comalias, this.typeItems.custom]
            });

            this.view.getTypeSelectionWrapper().prepend(this.selectBox.getElement());

            if (this.options.action !== 'create'){
                showLoader();
                this.options.model.fetch({
                    success: function() {
                        this.updateView();
                        this.options.roleModelBeforeModification.setAttributes( this.options.model.getAttributes());
                        hideLoader();
                    }.bind(this),
                    error: function() {
                        console.log('error while fetching model');
                        hideLoader();
                    }
                });
                this.selectBox.disable();
            } else {
                this.selectBox.enable();
            }

        },

        showErrors: function(result) {
            if (result.name.valid){
                this.view.setNameValid();
            } else {
                this.view.setNameInvalid(result.name.errors[0]);
            }

            if (result.description.valid){
                this.view.setDescriptionValid();
            } else {
                this.view.setDescriptionInvalid(result.description.errors[0]);
            }

            if (result.type.valid){
                if (result.roles.valid){
                    if(result.type === 'comalias'){
                        this.view.getErrorBox().removeModifier("displayed");
                    }
                    this.view.setTypeValid();
                } else {
                    this.view.getErrorBox().setModifier("displayed");
                    this.view.getErrorMessageBox().setText(result.roles.errors[0]);
                }
            } else {
                this.view.setTypeInvalid(result.type.errors[0]);
            }
        },

        validateFields: function(){
            this.showErrors(this.options.model.validate());
        },

        updateModel: function(preventValidation) {
            this.options.model.setName(this.view.getName());
            this.options.model.setDescription(this.view.getDescription());
            this.options.model.setStatus(this.view.getStatus());
            this.options.model.setType(this.selectBox.getValue().value);
            if(!preventValidation) {
                this.validateFields();
            }
        },

        updateView: function(){
            this.view.setName(this.options.model.getName());
            if(this.options.action === 'edit' && this.options.model.getType() === 'custom') {
                this.view.getNameElement().setAttribute('disabled', true);
            } else {
                this.view.getNameElement().setAttribute('enabled', true);

            }
            this.view.setDescription(this.options.model.getDescription());
            this.view.setStatus(this.options.model.getStatus());
            this.selectBox.setValue(this.typeItems[this.options.model.getType()]);
            this.updateListsAndDetails(this.options.model.getType());
            if (this.options.model.getType() === 'com' || this.options.model.getType() === 'cpp') {
                this.view.getDisabledRadioBox().setAttribute("disabled");
            }
        },

        updateListsAndDetails: function(value) {
            switch(value) {
                case 'com':
                case 'cpp':
                    this.hideComRoles();
                    this.hideCustomRoles();
                    break;

                case 'comalias':
                    this.showComRoles();
                    this.hideCustomRoles();
                    break;

                case 'custom':
                    this.hideComRoles();
                    this.showCustomRoles();
                    break;

                default:
                    this.hideComRoles();
                    this.hideCustomRoles();
            }
        },

        hideComRoles: function() {
            this.comRolesList.stop();
        },

        showComRoles: function() {
            this.comRolesList.start(this.view.getRolesListFormElement());
            if(this.options.action !== 'create') {
                this.getEventBus().publish('comrolesTable:selectRoles', this.options.model.attributes.roles);
            }
        },

        hideCustomRoles: function() {
            if (this.customRoleDetails) {
                this.customRoleDetails.detach();
            }
        },

        showCustomRoles: function() {
            if (this.customRoleDetails) {
                this.customRoleDetails.attachTo(this.view.getCustomRolesDetailsFormElement());
                if(this.options.action !== 'create') {
                    this.customRoleDetails.setItemsToSelect(this.options.model.attributes.roles, this.options.model.attributes.policy);
                    this.options.model.removeAttribute('roles');
                }
            }
        }

    });

});
