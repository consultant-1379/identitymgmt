define([
    'layouts/WizardStep',
    'uit!./stepApply.html',
    'jscore/ext/utils/base/underscore',
    '../../../Dictionary',
    '../ResultsTableWidget/ResultsTableWidget',
    'usermgmtlib/services/UserManagementService',
    'widgets/ProgressBar'
], function(WizardStep, View, _, Dictionary, ResultTableWidget, UserManagementService, ProgressBar) {

    function getObjectLength(onject) {
        return _.values(onject).length;
    }

    function createUserRoleTG(userdata, model) {

        var userRoleTG = [];
        userdata.privileges.forEach(function(privilege) {
            if(privilege.targetGroup !== null) {
                var privilegeTargetGroup = [];
                var action = model.get('assign') === true ? "ADD" : "REMOVE";
                privilege.targetGroup = privilege.targetGroup instanceof Array ? privilege.targetGroup : [privilege.targetGroup];
                privilege.targetGroup.forEach(function(tg) {
                    userRoleTG.push({
                        "action": action,
                        "targetGroup": tg,
                        "role": privilege.role
                    });
                }.bind(this));
            } else  {
                //unassigne role
                userRoleTG.push({
                    "action": "REMOVE",
                    "role": privilege.role
                });
            }
        }.bind(this));

        return userRoleTG;
    }

    function createUserDataRoleTG(model, userdata, userRoleTG) {

        return [{
                    "user": userdata.username,
                    "status": getObjectLength(model.get('changedStatuses')) ? userdata.status : null,
                    "description": getObjectLength(model.get('changedDescription')) ? userdata.description : null,
                    "authMode": getObjectLength(model.get('changedAuthMode')) ? userdata.authMode : null,
                    "passwordAgeing": getObjectLength(model.get('changedPwdAgeing')) ? userdata.passwordAgeing : null,
                    "privileges": userRoleTG
         }];
    }


    return WizardStep.extend({

        title: Dictionary.applyStep.title,

        view: function() {
            return new View({
                title: Dictionary.applyStep.header
            });
        },

        init: function(model) {
            this.model = model;
        },

        updateProgressBarValue: function() {
            this.finishedCount++;
            var totalUsersLength = getObjectLength(this.model.get('usersToUpdate'));
            this.progressBar.setValue(Math.floor((this.finishedCount / totalUsersLength) * 100));
        },

        onViewReady: function() {
            this.finishedCount = 0;
            this.allRequests = [];
            var allPromises = [];
            this.progressBar = new ProgressBar({
                color: 'paleBlue',
                value: 0
            });
            this.progressBar.attachTo(this.getElement().find('.eaUsersgroupedit-StepApply-progress'));

            this.addEventHandler('activate', function() {
                this.revalidate();
                if (!this.model.get('finish')) {
                    this.showButtons();

                    _.values(this.model.get('usersToUpdate')).forEach(function(userdata) {

                        var promise = new Promise(function(resolve) {
                            var userRoleTG = createUserRoleTG(userdata, this.model);
                            var userDataRoleTG = createUserDataRoleTG(this.model, userdata, userRoleTG);
                            var request = UserManagementService.modifyBatchUser(userDataRoleTG, userdata.username, resolve);
                            this.allRequests.push(request);
                        }.bind(this));
                        promise.then(this.updateProgressBarValue.bind(this));
                        allPromises.push(promise);

                    }.bind(this));

                    Promise.all(allPromises).then(function(responses) {
                        this.attachResultsTable(responses);

                        this.valid = true;
                        this.model.setAttribute('finish', true);
                        this.revalidate();
                        this.progressBar.detach();
                    }.bind(this));
                }

                this.handleRequestsAbort();

            }.bind(this));
        },

        attachResultsTable: function(responses) {

            if (this.resultTableWidget) {
                this.resultTableWidget.detach();
            }
            this.resultTableWidget = new ResultTableWidget({
                model: this.model,
                responses: responses
            });
            this.resultTableWidget.attach(this.getElement().find('.eaUsersgroupedit-StepApply-table'));
        },

        handleRequestsAbort: function() {
            this.getWizard().addEventHandler('pauseStep', function() {
                this.allRequests.forEach(function(request) {
                    if (request.getReadyState() === 1) {
                        request.abort();
                    }
                });

            }.bind(this));
        },

        isValid: function() {
            return this.valid;
        },

        showButtons: function() {
            this.getWizard().getElement().find(".ebWizard-footerBtnPrevious").setAttribute('style', 'display:none');
            this.getWizard().getElement().find(".ebWizard-footerCommandListItem").setAttribute('style', 'display:none');
        }

    });

});
