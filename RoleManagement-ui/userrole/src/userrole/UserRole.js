/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 -----------------------------------------------------------------------------*/
define([
    'jscore/core',
    'container/api',
    './UserRoleView',
    'jscore/ext/locationController',
    'jscore/ext/net',
    'layouts/TopSection',
    'identitymgmtlib/Utils',
    'i18n!userrole/dictionary.json',
    'rolemgmtlib/model/RoleModel',
    'widgets/Notification',
    'rolemgmtlib/regions/RoleForm/RoleForm',
    'rolemgmtlib/regions/DisplayRole/DisplayRole',
    'identitymgmtlib/AccessControlService'
], function(core, container, View, LocationController, net, TopSection, Utils, Dictionary, RoleModel, Notification, RoleForm, DisplayRole, accessControlService) {


    return core.App.extend({
        View: View,

        topSection : null,
        roleModel: null,
        form: null,
        roleName: null,
        appAvailable: true,
        roleModelBeforeModification: {},


        onStart: function() {
            accessControlService.isAppAvailable("role_management", Utils.createAccessControlRegion.bind(this));

            // Location controller sets autoUrlDecode to false for GOTO query variable to work correctly.
            // Without the autoUrlDecode, the goto may break.

            this.lc = new LocationController({
                namespace: this.options.namespace,
                autoUrlDecode: false
            });

            this.lc.addLocationListener(this.onLocationChange.bind(this));
            this.lc.start();


            this.getEventBus().subscribe('comAliasRoleList:addComRoles', this.addRoles.bind(this));
            this.getEventBus().subscribe('displayRole:hideEditButton', this.hideEditButtonOnDisplayPage.bind(this));

            this.saved = false;
        },

        onResume: function() {
            accessControlService.isAppAvailable("role_management", Utils.createAccessControlRegion.bind(this));
            this.saved = false;
        },

        onLocationChange: function(hash) {
            this.onResume();
            var parsedUrl = Utils.parseHash(hash);

            this.goto = parsedUrl.query.goto || 'rolemanagement';

            this.action = null;
            this.roleName = null;


            //TODO: Move this if statement to Utils.js
            var splitedHash;

            if(hash.indexOf('/') >= 0) {
                splitedHash = hash.split('/');
                parsedUrl.hash = splitedHash[0];
            }

            if((parsedUrl.hash === 'create') || (parsedUrl.hash === '')) {
                this.action = 'create';
            } else if(parsedUrl.hash === 'edit') {
                this.action = 'edit';
                this.roleName = splitedHash[1];
            } else {
                this.action = 'display';
                this.roleName = parsedUrl.hash;
            }
            if (!this.roleName){
                this.roleModel = new RoleModel();
            } else {
                this.roleModel = new RoleModel({id: this.roleName});
            }
            this.roleModelBeforeModification = new RoleModel();

            this.contextActions = this.getDefaultActions();
            if(this.action !== 'display') {
                this.form = new RoleForm({
                    action: this.action,
                    hash: parsedUrl.hash,
                    model: this.roleModel,
                    roleModelBeforeModification: this.roleModelBeforeModification,
                    context: this.getContext()
                });
            } else {
                this.form = new DisplayRole({
                    action: this.action,
                    hash: parsedUrl.hash,
                    model: this.roleModel,
                    roleModelBeforeModification: this.roleModelBeforeModification,
                    context: this.getContext()
                });
                this.contextActions = this.getDisplayActions(true, function() {
                    window.location.hash = '#rolemanagement/userrole/edit/' + this.roleName;
                }.bind(this));
            }

            // Create and attach TopSection
            this.createTopSection(this.action);
            this.topSection.attachTo(this.getElement());
            this.topSection.setContent(this.form);
        },

        onBeforeLeave: function(e) {
            this.getEventBus().publish("model:update", true);

            var hasModelChanged = areModelsDifferent(this.roleModelBeforeModification, this.roleModel);

            if(this.appAvailable && hasModelChanged && !this.saved) {
                return Dictionary.confirmNav;
            }
        },

        getDisplayActions: function(isRoleEditable, actionFunction) {
            return [{name: Dictionary.edit, type: 'button', icon: 'edit', action: actionFunction, enabled: isRoleEditable }];
        },

        createTopSection: function(action) {
            if (this.topSection) {
                this.topSection.destroy();
            }

            var breadcrumbWithoutChildApps = Utils.removeChildAppsFromBreadcrumb(this.options.breadcrumb);

            this.topSection = new TopSection({
                title: Dictionary.headers[action],
                breadcrumb: breadcrumbWithoutChildApps,
                context: this.getContext(),
                defaultActions: this.contextActions
            });

            this.topSection.setContent(this.form);
        },

        getDefaultActions: function() {
            return [
                {name: Dictionary.save, type: 'button', color: 'darkBlue', action: this.saveAction.bind(this)},
                {name: Dictionary.cancel, type: 'button', action: this.triggerGoto.bind(this)}
            ];
        },

        triggerGoto: function() {
            this.lc.setLocation(this.goto);
        },

        addRoles: function(data) {
            this.roleModel.addRoles(data);
        },

        hideEditButtonOnDisplayPage: function() {
            this.getEventBus().publish("topsection:contextactions",
                [{name: Dictionary.edit, type: 'button', icon: 'edit', disabled: true, action: this.triggerGoto.bind(this)}]
            );
        },

        saveAction: function() {
            var notificationLabel;
            this.getEventBus().publish('model:update');

            if(this.roleModel.validate().valid) {
                if (this.roleModel.id) {
                    notificationLabel = Dictionary.roleUpdated;
                } else {
                    notificationLabel = Dictionary.roleCreated;
                }
                notificationLabel = this.roleModel.id ? Dictionary.roleUpdated : Dictionary.roleCreated;

                var saveResponse = this.roleModel.save({id: this.roleName},{
                    success: function(model, response, options) {
                        this.notification = new Notification({
                            label: notificationLabel,
                            color: 'green',
                            icon: 'tick',
                            showCloseButton: true,
                            showAsGlobalToast: true,
                            autoDismiss: true
                        });
                        this.saved = true;
                        this.lc.setLocation(this.goto);
                        if(this.action === 'edit') {
                            container.getEventBus().publish("userrole:roleupdated", this.roleModel.getName());
                        }
                    }.bind(this),

                    error: function(model, response, options) {
                        if((response.getResponseJSON().httpStatusCode).toString() === '422' ) {
                            if(this.form instanceof RoleForm) {
                                var result = {
                                    valid: false,
                                    name: {valid: false, errors: []},
                                    description: {valid: true, errors: []},
                                    type: {valid: true, errors: []},
                                    roles: {valid: true, errors: []}
                                };

                                var msg = Utils.getErrorMessage(response.getResponseJSON().httpStatusCode, response.getResponseJSON().internalErrorCode);
                                if (msg.internalErrorCodeMessage) {
                                    if (response.getResponseJSON().internalErrorCode === 'RIDM-7-5-33' || 
                                        response.getResponseJSON().internalErrorCode === 'UIDM-7-4-51') {
                                        this.notification = new Notification({
                                            label: msg.internalErrorCodeMessage,
                                            color: 'red',
                                            icon: 'error',
                                            showCloseButton: true,
                                            showAsGlobalToast: true,
                                            autoDismiss: false
                                            });
                                    } else {
                                        result.name.errors.push(msg.internalErrorCodeMessage);
                                        this.form.showErrors(result);
                                    }
                                } else {
                                    result.name.errors.push(Dictionary.roleName_must_be_unique);
                                    this.form.showErrors(result);
                                }
                            } else {
                                Utils.errorInfo(Dictionary.error, Dictionary.roleName_must_be_unique);
                            }
                        } else {
                           this.notification = new Notification({
                            label: dictionary.notifications.server_error,
                            color: 'red',
                            icon: 'error',
                            showCloseButton: true,
                            showAsGlobalToast: true,
                            autoDismiss: false
                            });
                            this.lc.setLocation(this.goto);
                        }
                    }.bind(this)
                });
            }
        }

    });

    function areModelsDifferent(roleModel1, roleModel2) {
        return roleModel1 && roleModel2 && (
            roleModel1.getStatus() !== roleModel2.getStatus() ||
            roleModel1.getName() !== roleModel2.getName() ||
            roleModel1.getDescription() !== roleModel2.getDescription());
    }
});
