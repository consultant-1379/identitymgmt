define([
    'layouts/WizardStep',
    'uit!./stepSummary.html',
    'jscore/ext/utils/base/underscore',
    '../../../Dictionary',
    'usermgmtlib/DataHandler',
    '../SummaryElement/summaryElement',
    'identitymgmtlib/Utils',
    'usermgmtlib/validators/passwordageing.validator',
    '../../../groupEditWizardUtils'
], function(WizardStep, View, _, Dictionary, DataHandler, SummaryElement, Utils, passwordAgeingValidator, WizardUtils) {

    function getObjectLength(onject) {
        return _.values(onject).length;
    }

    function getPrivilegesRoles(privileges){

        privileges = _.map(privileges, function(privilege) {
            return _.pick(privilege, "role");
        });

        return _.sortBy(privileges,"role");
    }

    return WizardStep.extend({

        title: Dictionary.summaryStep.title,

        view: function() {
            return new View({
                title: Dictionary.summaryStep.title
            });
        },

        fetchData: function() {

            this.model.setAttribute('dataHandler', new DataHandler({
                uniqueID: 'username'
            }));

            if (!this.data) {
                this.model.get('dataHandler')
                    .getData({ group: true })
                    .then(function(data) {
                        this.data = _.clone(data);
                        //this.onChange();
                    }.bind(this));
            }
        },


        init: function(model) {
            this.model = model;
            //WARNING: fetchData here could hang browser for a while
            this.fetchData();
        },

        onViewReady: function() {
            this.addEventHandler('activate', function() {
                this.resetModel();
                this.getWizard().setLabels({
                    next: Dictionary.detailsStep.apply,
                });
                if (!this.model.get('finish')) {
                    if (this.data) {
                        this.onChange();
                    }
                } else {
                    WizardUtils.goToApplyStep(this.getWizard());
                }
            }.bind(this));
        },

        resetModel: function() {
            this.model.set('changedStatuses', []);
            this.model.set('changedDescription', []);
            this.model.set('changedAuthMode', []);
            this.model.set('changedPwdAgeing', []);
            this.model.set('changedRoles', []);
            this.model.set('adminToUpdate', []);
            this.model.set('usersToUpdate', []);
            this.model.set('usersWithNoPrivileges', []);
        },

        onChange: function() {
            this.setUsersToUpdate();
            this.updateContent();
            this.showButtons();
            this.getWizard().resetRemainingSteps();
            this.revalidate();
        },

        clearSummaryElementWidgets: function() {
            if (this.summaryElementsWidget) {
                this.summaryElementsWidget.forEach(function(summaryElementWidget) {
                    summaryElementWidget.destroy();
                });
            }
            this.summaryElementsWidget = [];
        },

        getSummaryElementsArray: function() {
            var summaryElementsArray = [];
            //info user(s) will be updated
            if (getObjectLength(this.model.get('usersToUpdate'))) {
                summaryElementsArray.push({
                    message: Dictionary.summaryStep.usersUpdatedMsg,
                    value: getObjectLength(this.model.get('usersToUpdate'))
                });
            }

            //info user(s) status will be updated
            if (getObjectLength(this.model.get('changedStatuses'))) {
                var msg = this.model.get('status') ? Dictionary.summaryStep.statusUpdatedMsgEnabled : Dictionary.summaryStep.statusUpdatedMsgDisabled;
                summaryElementsArray.push({
                    message: msg
                });
            }

             //info user(s) description will be updated
             if (getObjectLength(this.model.get('changedDescription'))) {
                 var description = this.model.get('description');
                 summaryElementsArray.push({
                     message: Utils.printf(Dictionary.summaryStep.descriptionUpdatedMsg, description)
                 });
             }

             //info user(s) passwordAgeing will be updated
             if (getObjectLength(this.model.get('changedPwdAgeing'))) {

                 var pwdAgeJson = this.model.get('passwordAgeing');

                 var pwdAgeMessage = "";
                 if(!pwdAgeJson.customizedPasswordAgeingEnable) {
                    pwdAgeMessage = Dictionary.summaryStep.pwdAgeingGlobals;
                 } else {
                    if(!pwdAgeJson.passwordAgeingEnable) {
                       pwdAgeMessage = Dictionary.summaryStep.pwdAgeingCustomizedDisabled;
                    } else {
                       pwdAgeMessage = Utils.printf(Dictionary.summaryStep.pwdAgeingCustomizedEnabled, pwdAgeJson.pwdMaxAge, pwdAgeJson.pwdExpireWarning);
                    }
                 }
                 summaryElementsArray.push({
                    message: Utils.printf(Dictionary.summaryStep.pwdAgeingUpdatedMsg, pwdAgeMessage)
                 });
             }

             //info user(s) role will be assigned
             if (getObjectLength(this.model.get('changedRoles'))) {
                var msg1;
                if (this.model.get('assign') === true) {
                    msg1 = Dictionary.summaryStep.assignedUpdatedMsgAssigned;
                } else if (this.model.get('assign') === false) {
                    msg1 = Dictionary.summaryStep.assignedUpdatedMsgUnassigned;
                }
                summaryElementsArray.push({
                    message: msg1,
                    value: getObjectLength(this.model.get('changedRoles'))
                });
             }

             //info user(s) authentication mode will be update
             if (getObjectLength(this.model.get('changedAuthMode'))) {
                var msg2;
                if (this.model.get('authMode') === 'local') {
                    msg2 = Dictionary.summaryStep.authModeUpdatedMsgLocal;
                } else if (this.model.get('authMode') === 'remote') {
                    msg2 = Dictionary.summaryStep.authModeUpdatedMsgRemote;
                }
                summaryElementsArray.push({
                    message: msg2,
                    value: getObjectLength(this.model.get('changedAuthMode'))
                });
             }

            //info security admin status will be updated
            if (getObjectLength(this.model.get('adminToUpdate'))) {
                summaryElementsArray.push({
                    message: Dictionary.summaryStep.adminUpdatedMsg,
                    value: getObjectLength(this.model.get('adminToUpdate')),
                    icon: 'warningOrange'
                });
            }

            if ( getObjectLength(this.model.get('usersWithNoPrivileges'))) {
                _.values(this.model.get('usersWithNoPrivileges')).forEach(function(user) {
                    summaryElementsArray.push({
                        message: Dictionary.summaryStep.cannotUnassignAllRoles,
                        value: user.username,
                        icon: 'warningOrange'
                    });
                });

            }

            var secAdminRoleUnassignedCount = 0;

            for (var admin in this.model.get('adminToUpdate')) {
                if (this.model.get('adminToUpdate')[admin].secAdminRoleUnassigned) {
                    secAdminRoleUnassignedCount++;
                }
            }

            //info unassign secure_admin or administrator role
            if (secAdminRoleUnassignedCount) {

                if (getObjectLength(this.model.get('adminToUpdate'))) {
                    summaryElementsArray.push({
                        value: secAdminRoleUnassignedCount,
                        message: Dictionary.summaryStep.unassignAdminRole,
                        icon: 'warningOrange'
                    });
                }
            }

             if (!getObjectLength(this.model.get('usersToUpdate'))) {
                 summaryElementsArray.push({
                     message: Dictionary.summaryStep.noUserUpdated,
                     icon: 'warningOrange'
                 });
             }

            if (!getObjectLength(this.model.get('privileges').getAssigned() ) && this.model.get('assign') === true ) {

                 summaryElementsArray.push({
                     message: Dictionary.summaryStep.noRolesSelected,
                     icon: 'warningOrange'
                 });
             }

            if (!getObjectLength(this.model.get('privileges').getAssigned() ) && this.model.get('assign') === false ) {

                 summaryElementsArray.push({
                     message: Dictionary.summaryStep.unassignAllRoles,
                     icon: 'invalid'
                 });
                 this.valid = false;
             }

             //if selected eventually shows validation errors on password ageing
             if (this.model.get('passwordAgeing')) {

                 var errMsg = passwordAgeingValidator.validate(this.model.get('passwordAgeing'), true);

                 if( errMsg ) {
                     if(errMsg.messageAge) {
                        summaryElementsArray.push({
                            message: Utils.printf(Dictionary.summaryStep.invalidPwdAgeing, Dictionary.summaryStep.pwdMaxAge+": "+errMsg.messageAge+";"),
                            icon: 'error'
                        });
                     }
                     if(errMsg.messageExpire) {
                        summaryElementsArray.push({
                            message: Utils.printf(Dictionary.summaryStep.invalidPwdAgeing, Dictionary.summaryStep.pwdExpireWarning+": "+errMsg.messageExpire+";"),
                            icon: 'error'
                        });
                     }
                     this.valid = false;
                 }
             }

            return summaryElementsArray;
        },

        setMainMessage: function(summaryElementsArray) {
            summaryElementsArray.forEach(function(summaryElementsItem) {
                var summaryElement = new SummaryElement(summaryElementsItem);
                this.summaryElementsWidget.push(summaryElement);
                summaryElement.attachTo(this.getElStepSummaryList());
            }.bind(this));
        },

        setSummaryMessages: function() {
            this.clearSummaryElementWidgets();
            this.setMainMessage(this.getSummaryElementsArray());
        },

        updateContent: function() {
            this.showContentHideLoader();
            this.setSummaryMessages();
        },

        setUserByStatus: function(userData) {
            if (userData.status !== this.status && !this.model.get('usersToUpdate')[userData.username]) {

                if (!this.model.get('usersToUpdate')[userData.username]) {
                    this.model.get('usersToUpdate')[userData.username] = _.clone(userData);
                    this.model.get('usersToUpdate')[userData.username].privileges = [];
                }
                this.model.get('usersToUpdate')[userData.username].status = this.status;
                this.setUsersEditedStatuses(userData);
                this.setEditedSecurityAdmins(userData);
            }
        },

        checkUserContainsRole: function(userRoles, roleModel) {
            return userRoles.some(function(role) { return role.role === roleModel.get('name'); });
        },

        checkUserContainsRoleAndTargetToUnassign: function(userRoles, roleModel) {
            return userRoles.some(function(role) { 
                            return role.role === roleModel.get('name') && 
                                   roleModel.get('tgsToUnassign') !== undefined && 
                                   roleModel.get('tgsToUnassign').indexOf(role.targetGroup) !== -1;});
        },

        setUserByDescription: function(userData) {
            if (userData.description !== this.model.get('description')) {

                if (!this.model.get('usersToUpdate')[userData.username]) {
                    this.model.get('usersToUpdate')[userData.username] = _.clone(userData);
                    this.model.get('usersToUpdate')[userData.username].privileges = [];
                }
                this.model.get('usersToUpdate')[userData.username].description = this.model.get('description');
                this.setUsersEditedDescription(userData);
            }
        },

        setUserByAuthMode: function(userData) {
            if (userData.authMode !== this.model.get('authMode')) {

                if (!this.model.get('usersToUpdate')[userData.username]) {
                    this.model.get('usersToUpdate')[userData.username] = _.clone(userData);
                    this.model.get('usersToUpdate')[userData.username].privileges = [];
                }
                this.model.get('usersToUpdate')[userData.username].authMode = this.model.get('authMode');
                this.setUsersEditedAuthMode(userData);
            }
        },

        setUserByPwdAgeing: function(userData) {
            if(!this.isEqualPwdAgeing(userData.passwordAgeing, this.model.get('passwordAgeing')) && passwordAgeingValidator.validate(this.model.get('passwordAgeing'), true) === undefined) {
                if (!this.model.get('usersToUpdate')[userData.username]) {
                    this.model.get('usersToUpdate')[userData.username] = _.clone(userData);
                    this.model.get('usersToUpdate')[userData.username].privileges = [];
                }
                this.model.get('usersToUpdate')[userData.username].passwordAgeing = this.model.get('passwordAgeing');
                this.setUsersEditedPwdAgeing(userData);
            }
        },

        isEqualPwdAgeing: function(userPwdAgeing, modelPwdAgeing) {
            //check also for users with password ageing never defined
            if((userPwdAgeing === null || userPwdAgeing === undefined || userPwdAgeing.customizedPasswordAgeingEnable === undefined) && modelPwdAgeing.customizedPasswordAgeingEnable === false) {
                return true;
            }
            if(((userPwdAgeing === null || userPwdAgeing === undefined || userPwdAgeing.customizedPasswordAgeingEnable === undefined) && modelPwdAgeing.customizedPasswordAgeingEnable === true) ||
                    userPwdAgeing.customizedPasswordAgeingEnable !== modelPwdAgeing.customizedPasswordAgeingEnable) {
                return false;
            }
            //avoid to check further
            if(modelPwdAgeing.customizedPasswordAgeingEnable === false) {
                return true;
            }
            if(userPwdAgeing.passwordAgeingEnable !== modelPwdAgeing.passwordAgeingEnable) {
                return false;
            }
            //avoid to check further
            if(modelPwdAgeing.passwordAgeingEnable === false) {
                return true;
            }
            if(userPwdAgeing.pwdMaxAge !== modelPwdAgeing.pwdMaxAge || userPwdAgeing.pwdExpireWarning !== modelPwdAgeing.pwdExpireWarning) {
                return false;
            }
            return true;
        },

        isServiceRole: function(roleName) {
            var value = false;
            this.model.get('privileges').each( function(roleModel) {
                 if ( roleModel.get('name') === roleName && Utils.isServiceRole(roleModel) ) {
                    value = true;
                    return false;
                 }
            });
            return value;
        },


        getServiceRolesTgs: function( servicePrivileges, insertDefaultIfEmpty ) {
            var tgs = [];

            servicePrivileges.forEach( function(el) {
                tgs = _.union( tgs, el.tgs);
            });

            // I can have wrong configuration generated by REST.
            // In this case we fix incongruences
            if ( ( insertDefaultIfEmpty && tgs.length === 0 ) || tgs.indexOf('ALL') > -1  ) {
                 tgs = ['ALL'];
             } else if ( tgs.length > 1 ) {
                 var index = tgs.indexOf('NONE');
                 if ( index !== -1 ) {
                     tgs.splice(index, 1);
                 }
             }
             return tgs;
        },

        convertUserPrivilegesToModelData: function(privileges) {

            // convert privileges to object to get unique role names
            var objPrivileges = {};
            privileges.forEach(function(privilege) {
                 var roleName = privilege.role;
                 objPrivileges[roleName] = objPrivileges[roleName] || [];
                 objPrivileges[roleName].push(privilege.targetGroup);
             });

            // copy above privileges to array form object
            var privilegesArray = [];
            for (var privilege in objPrivileges) {
                 privilegesArray.push({
                     name: privilege,
                     tgs: objPrivileges[privilege],
                 });
             }
             return privilegesArray;
        },

        getTgsToAdd: function(newTgs, oldTgs) {
            var tgsToAdd = [];

            if ( newTgs.indexOf("ALL") > -1  ) { // ASSIGN ALL
                if ( oldTgs.indexOf("ALL") === -1 ) {
                    tgsToAdd = newTgs;
                }
            } else if ( newTgs.indexOf("NONE") > -1  ) { // ASSIGN NONE
                if ( oldTgs.indexOf("NONE") === -1 ) {
                    tgsToAdd = newTgs;
                }
            } else { // ASSIGN TGs
                if ( oldTgs.indexOf("ALL") > -1 ) {
                    // Do nothing
                } else if ( oldTgs.indexOf("NONE") > -1) {
                    tgsToAdd = newTgs;
                } else {
                    tgsToAdd = _.difference(newTgs,oldTgs);
                }
            }
            return tgsToAdd;
        },

        setUserByRolesAssign: function(userData) {
            var serviceTgsChanged = this.model.get('serviceTgsChanged') ? true : false;
            var servicePrivileges = this.convertUserPrivilegesToModelData( userData.privileges.filter( function (el) { return this.isServiceRole(el.role); }.bind(this)));
            var comPrivileges = this.convertUserPrivilegesToModelData( userData.privileges.filter( function (el) { return !this.isServiceRole(el.role); }.bind(this)));

            var servicePrivilegesAssigned = [];
            var comPrivilegesAssigned = [];
            this.model.get('privileges').each(function(roleModel) {
                if (roleModel.get('assigned') === true ) {
                    if ( Utils.isServiceRole(roleModel)) {
                        servicePrivilegesAssigned.push({"name" : roleModel.get("name"), "tgs" : roleModel.get("tgs")});
                    } else {
                        if ( roleModel.get("tgsChanged")) {
                            comPrivilegesAssigned.push({"name" :roleModel.get("name"),"tgs" : roleModel.get("tgs"), "tgsChanged" : roleModel.get("tgsChanged") });
                        } else {
                            comPrivilegesAssigned.push({"name" :roleModel.get("name"),"tgs" : roleModel.get("tgs") });
                        }
                    }
                }
            });

            comPrivilegesAssigned.forEach(function(newRole) {
                var tgsToAdd = [];

                var oldComPrivilege = comPrivileges.filter( function(oldRole) {
                    return newRole.name === oldRole.name;
                });

                if ( oldComPrivilege.length > 0  ) {
                    if ( newRole.tgsChanged) {
                        tgsToAdd = this.getTgsToAdd(newRole.tgs, oldComPrivilege[0].tgs);
                    }
                } else {
                    if ( newRole.tgsChanged) {
                        tgsToAdd = newRole.tgs;
                    } else {
                        tgsToAdd = ["NONE"];
                    }
                }

                if ( tgsToAdd.length > 0 ) {
                    this.addChangedRoles(userData, newRole.name, tgsToAdd );
                }
            }.bind(this));

            if ( serviceTgsChanged ) {
                var serviceTgs = this.model.get('tgs');
                if ( serviceTgs.length > 0 ) { // This should always be true (otherwise there is a bug)

                    // If the role was already present I don't update it now
                    servicePrivilegesAssigned.forEach(function(roleModel) {
                        var doNotChange = servicePrivileges.some( function(el) {
                            return roleModel.name === el.name ;
                        }.bind(this));

                        if ( !doNotChange ) {
                            var actualServiceTgs = this.getServiceRolesTgs(servicePrivileges, false);
                            var tgsToAdd;

                            if ( actualServiceTgs.length > 0 ) {
                                tgsToAdd = this.getTgsToAdd(serviceTgs, actualServiceTgs);
                                if ( tgsToAdd.length === 0 ) {
                                    tgsToAdd = actualServiceTgs;
                                } else {
                                    if ( tgsToAdd.indexOf("NONE") === -1 && tgsToAdd.indexOf("ALL") === -1 ) {
                                        tgsToAdd = _.union(tgsToAdd, actualServiceTgs);
                                    }
                                }
                            } else {
                                tgsToAdd = serviceTgs;
                            }

                            this.addChangedRoles(userData, roleModel.name, tgsToAdd );
                        }
                    }.bind(this));

                    // I update all existing roles with new TGS
                    servicePrivileges.forEach(function(oldRoles) {
                        var tgsToAdd = this.getTgsToAdd(serviceTgs, oldRoles.tgs);

                        if ( tgsToAdd.length > 0 ) {
                            this.addChangedRoles(userData, oldRoles.name, tgsToAdd );
                        }
                    }.bind(this));
                }

            } else {
                servicePrivilegesAssigned.forEach(function(roleModel) {
                    var doNotChange = servicePrivileges.some( function(el) {
                        return roleModel.name === el.name;
                    });

                    roleModel.tgs = this.getServiceRolesTgs(servicePrivileges, true);
                    if ( !doNotChange ) {
                        this.addChangedRoles(userData, roleModel.name, roleModel.tgs );
                    }
                }.bind(this));
            }
        },

        addChangedRoles: function(userData, roleName, roleTgs) {
            if (!this.model.get('usersToUpdate')[userData.username]) {
                this.model.get('usersToUpdate')[userData.username] = _.clone(userData);
                this.model.get('usersToUpdate')[userData.username].privileges = [];
            }

            roleTgs.forEach(function(tg) {
                this.model.get('usersToUpdate')[userData.username].privileges.push({
                    role: roleName,
                    targetGroup: (tg instanceof Array) ? tg : [tg]
                });

            }.bind(this));
            this.setUsersEditedRoles(userData);
        },

        setUserByRolesUnassign: function(userData) {
             this.model.get('privileges').each(function(roleModel) {
                    var userRoleUnassigned = (roleModel.get('assigned') === false) && this.checkUserContainsRole(userData.privileges, roleModel);
                    var userRoleTGUnassigned = roleModel.get('assigned') === true && this.checkUserContainsRoleAndTargetToUnassign(userData.privileges, roleModel);
                    if (userRoleUnassigned || userRoleTGUnassigned ) {
                        if (!this.model.get('usersToUpdate')[userData.username]) {
                            this.model.get('usersToUpdate')[userData.username] = _.clone(userData);
                            this.model.get('usersToUpdate')[userData.username].privileges = [];
                        }
                        var secAdminRoleUnassigned = 0;
                        if (userRoleUnassigned) {
                            this.model.get('usersToUpdate')[userData.username].privileges.push({
                                                            role: roleModel.get('name'),
                                                            targetGroup: null
                            });
                            secAdminRoleUnassigned = (roleModel.get('name') === "SECURITY_ADMIN");
                            this.setUsersEditedRoles(userData);
                            this.setEditedSecurityAdmins(userData, secAdminRoleUnassigned);
                            this.setUsersWithNoPrivileges(userData);
                        } else {

                            var tgsOfRoleModel = [];

                            secAdminRoleUnassigned = (roleModel.get('name') === "SECURITY_ADMIN");

                            // If the list is empty I set NONE
                            if (tgsOfRoleModel.length === 0) { tgsOfRoleModel.push('NONE'); }

                            // Put "RoleModel"
                            //roleModel.get('tgsToUnassign').forEach(function(tg) {
                                this.model.get('usersToUpdate')[userData.username].privileges.push({
                                    role: roleModel.get('name'),
                                    targetGroup: roleModel.get('tgsToUnassign')
                                });
                           // }.bind(this));

                            this.setUsersEditedRoles(userData);
                            this.setEditedSecurityAdmins(userData, secAdminRoleUnassigned);
                        }
                    }
             }.bind(this));

        },

        setUserByRoles: function(userData) {
            // var actualServiceRolesTgs = userData.privileges.map(  );

            if (this.model.get('assign') === true) {
                this.setUserByRolesAssign(userData);
            } else if (this.model.get('assign') === false) {
                this.setUserByRolesUnassign(userData);
            }
        },

        setEditedSecurityAdmins: function(userData) {
             if (this.model.get('adminToUpdate')[userData.username]) {
                 return;
             }

             //check how many security admin will updated status
             userData.privileges.forEach(function(privilege) {
                 if (privilege.role === "SECURITY_ADMIN") {
                     this.model.get('adminToUpdate')[userData.username] = userData;
                 }
             }.bind(this));
        },

        setUsersEditedRoles: function(userData) {

            if (this.model.get('changedRoles')[userData.username]) {
                return;
            }
            this.model.get('changedRoles')[userData.username] = _.clone(userData);
        },

        setUsersEditedStatuses: function(userData) {

            if (this.model.get('changedStatuses')[userData.username]) {
                return;
            }
            this.model.get('changedStatuses')[userData.username] = _.clone(userData);
        },

        setUsersEditedDescription: function(userData) {

            if (this.model.get('changedDescription')[userData.username]) {
                return;
            }
            this.model.get('changedDescription')[userData.username] = _.clone(userData);
        },

        setUsersEditedAuthMode: function(userData) {

            if (this.model.get('changedAuthMode')[userData.username]) {
                return;
            }
            this.model.get('changedAuthMode')[userData.username] = _.clone(userData);
        },

        setUsersEditedPwdAgeing: function(userData) {
            if (this.model.get('changedPwdAgeing')[userData.username]) {
                return;
            }
            this.model.get('changedPwdAgeing')[userData.username] = _.clone(userData);
        },

        parseUsersToUpdate: function(username) {
            this.data.some(function(userData) {
                if (userData.username === username) {
                    if (this.model.getAttribute('status') !== undefined) {
                        this.setUserByStatus(userData);
                    }

                    if (this.model.getAttribute('description') !== undefined) {
                        this.setUserByDescription(userData);
                    }

                    if(this.model.getAttribute('passwordAgeing') !== undefined) {
                        this.setUserByPwdAgeing(userData);
                    }

                    if(this.model.getAttribute('authMode') !== undefined) {
                        this.setUserByAuthMode(userData);
                    }

                    if (this.model.get('assign') !== undefined) {
                        this.setUserByRoles(userData);
                    }
                    return true;
                }
                return false;
            }.bind(this));

        },

        setUsersWithNoPrivileges: function(userData) {

            var usersToUpdatePrivileges = this.model.get('usersToUpdate')[userData.username].privileges;
            var userDataPrivileges = userData.privileges;

            if (usersToUpdatePrivileges.length === userDataPrivileges.length) {

                usersToUpdatePrivileges = getPrivilegesRoles(usersToUpdatePrivileges);
                userDataPrivileges = getPrivilegesRoles(userDataPrivileges);

                if( _(usersToUpdatePrivileges).isEqual(userDataPrivileges) ) {
                this.model.get('usersWithNoPrivileges')[userData.username] = userData;
                }
            }
        },

        setUsersToUpdate: function() {
            this.status = this.model.get('status') ? 'enabled' : 'disabled';
            var assignRole = this.model.getAttribute('assign');

            this.model.get('usersToGroupEdit').forEach(function(username) {
                this.parseUsersToUpdate(username);
            }.bind(this));

            //set valid in case no-user to update
            this.valid = getObjectLength(this.model.getAttribute('usersToUpdate'));
        },

        isValid: function() {
            return this.valid;
        },

        showContentHideLoader: function() {
            this.view.getElement().find('.eaUsersgroupedit-StepSummary-loader').setAttribute('style', 'display: none;');
            this.view.getElement().find('.eaUsersgroupedit-StepSummary-content').setAttribute('style', 'display: block;');
        },

        getElStepSummaryList: function() {
            return this.getElement().find('.eaUsersgroupedit-StepSummary-list');
        },

        showButtons: function() {
            this.getWizard().getElement().find(".ebWizard-footerCommandListItem").removeAttribute('style');
            this.getWizard().getElement().find(".ebWizard-footerBtnPrevious").removeAttribute('style');
        }

    });
});
