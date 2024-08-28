/*******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************/
define([
    "jscore/ext/net",
    'identitymgmtlib/Utils',
    './Dictionary',
    'widgets/Notification',
    'widgets/Dialog',
    'identitymgmtlib/widgets/ResponsesSummaryDialog',
    'rolemgmtlib/model/RoleModel'

], function(net, Utils, Dictionary, Notification, Dialog, ResponsesSummaryDialog, RoleModel ) {

    var appurl = 'rolemanagement';
    // There's only one instance of ActionManager, so there's no harm
    // having these variables defined as closure variables.
    var context;
    var editAddressTemplate = appurl + '/userrole/edit/<name>';
    var editAddress;
    var eventBus;
    var deleteIds;
    var deleteName;
    var rolesToDelete = [];
    var roleSummaryRegion;
    var roleSummaryRegionVisible = false;


    // Define the different possible actions we can have.
    var actions = {
        'edit': function(roleName){
          return {
            name: Dictionary.actions.EditUserRole,
            type: 'button',
            icon: 'edit',
            action: function() {
              window.location.hash = appurl + '/userrole/edit/' + roleName;
            }
          };
        },
        'delete': {
            name: Dictionary.actions.DeleteUserRole,
            type: "button",
            icon: "delete",
            action: function() {
                deleteRolesConfirmationDialog();
            }
        },
        'compare': function(compareHash){
          return{
            name: Dictionary.actions.CompareRoles,
            type: 'button',
            action: function(){
              window.location.hash = appurl + '/compare/' + compareHash;
            }
          };
        },
        'secondSeparator': {type: 'separator'},
        'enable': {
            name: Dictionary.actions.Enable,
            type: "button",
            icon: "simpleGreenTick",
           action: function() {
                changeStatus("ENABLED");
            }
        },
        'disable': {
            name: Dictionary.actions.Disable,
            type: "button",
            icon: "close_red",
              action: function() {
                changeStatus("DISABLED");
            }
        },
        'nonassignable': {
            name: Dictionary.actions.Nonassignable,
            type: "button",
            action: function() {
                changeStatus("DISABLED_ASSIGNMENT");
            }
        }
    };
    function updatePromise(roleModel, element, status) {
      return new Promise(function(resolve, reject) {
        roleModel.fetch({
          success: function() {
            roleModel.setStatus(status);
            roleModel.save({id: element.name}, {
              success: resolve,
            });
          },
          error: reject
        });
      });
    }

    function changeStatus(status){
      var promises = [];
      rolesToDelete.forEach(function(element, index, array){
        roleModel = new RoleModel({id: element.name});
        promises.push(updatePromise(roleModel, element, status));
      });

      Promise.all(promises).then(function(){
        eventBus.publish('mainregion:refreshdata');
        switch(status){
          case "ENABLED":
            sentNotiffication(Dictionary.actionsResponses.StatusEnabled);
            break;
          case "DISABLED":
            sentNotiffication(Dictionary.actionsResponses.StatusDisabled);
            break;
          default:
            sentNotiffication(Dictionary.actionsResponses.StatusNonassignable);
            break;
        }
      });
    }

    function toggleRoleSummaryPanel() {
        if (roleSummaryRegionVisible) {
            eventBus.publish('layouts:closerightpanel');
        } else {
            eventBus.publish('layouts:showpanel', {
                header: Dictionary.roleSummary.title,
                content: roleSummaryRegion,
                side: 'right',
                value: 'summary'
            });
        }
    }


    function deleteRolesConfirmationDialog() {
        var deleteDialog = new Dialog({
            header: Dictionary.dialogues.deleteRolesHeader,
            content: Dictionary.dialogues.deleteRolesContent,
            buttons: [{
                caption: Dictionary.actions.DeleteUserRole,
                color: 'darkBlue',
                action: function() {
                    deleteDialog.hide();
                    deleteRolesAction();
                }.bind(this)
            }, {
                caption: Dictionary.dialogues.cancel,
                action: function() {
                    deleteDialog.hide();
                }.bind(this)
            }],
            type: 'warning',
            visible: true
        });
    }

    function deletedRolesSummaryResultDialog(statusArray, successCounter) {
        new ResponsesSummaryDialog({
          elementNameColumnHeader: Dictionary.roleMgmt.RoleNameHeader,
          data: statusArray,
          errorCodes: Dictionary.errorCodes,
          successCounter: successCounter,
          header: (successCounter === 0) ? Dictionary.actionsResponses.CannotDeletedRoles : Dictionary.actionsResponses.DeleteResults
        });
    }

    function sentNotiffication(notificationLabel) {
      if (this.notification) {
        this.notification.close();
      }

        this.notification = new Notification({
            label: notificationLabel,
            color: "green",
            icon: "tick",
            showCloseButton: true,
            showAsGlobalToast: true,
            autoDismiss: false
        });
    }

    function deleteRolesAction() {
        var responsesReceivedCounter = 0;
        var responsesReceivedSuccessCounter = 0; // Used to determine summary dialog type
        var responsesReceivedFailedCounter = 0; // Used to determine summary dialog type
        var deletedRolesStatus = []; //[0] Role, [1] Http response code
        var rolesToDeleteCount = rolesToDelete.length;

        //For now assumption is that every fail have its own http status,
        //so we need only to store response codes
        function successDeleteResponseHandlerProducer(roleName) {
            return function(data, xhr) {
                try {
                    var responseJSON = xhr.getResponseJSON();
                    deletedRolesStatus.push([roleName, responseJSON.httpStatusCode, responseJSON.internalErrorCode]);
                } catch (e) {
                    deletedRolesStatus.push([roleName, xhr.getStatus(), null]);
                }
                    responsesReceivedCounter++;
                    responsesReceivedSuccessCounter++;

                    checkResponses();
            };
        }

        function failDeleteResponseHandlerProducer(roleName) {
            return function(data, xhr) {
                var responseJSON = xhr.getResponseJSON();
                responsesReceivedCounter++;
                responsesReceivedFailedCounter++;
                deletedRolesStatus.push([roleName, responseJSON.httpStatusCode, responseJSON.internalErrorCode, responseJSON.errorData]);

                checkResponses();
            };
        }

        for (index = 0; index < rolesToDelete.length; index++) {

            var roleName = rolesToDelete[index].name;
            net.ajax({
                url: "/oss/idm/rolemanagement/roles/" + roleName,
                type: "DELETE",
                success: successDeleteResponseHandlerProducer(roleName),
                error: failDeleteResponseHandlerProducer(roleName)
            });
        }

        function checkResponses() {
            if (responsesReceivedCounter === rolesToDeleteCount) {

                // force to refresh data in table
                eventBus.publish('mainregion:refreshdata');

                if (rolesToDeleteCount === 1) {
                    if (responsesReceivedSuccessCounter === 0) {
                        // 1 role to delete, failure
                        deletedRolesSummaryResultDialog(deletedRolesStatus, responsesReceivedSuccessCounter);
                    } else {
                        // 1 role to delete, success
                        sentNotiffication(Dictionary.actionsResponses.RoleDeleted);
                    }
                } else {
                    if (responsesReceivedFailedCounter === 0) {
                        // many roles, all success
                        sentNotiffication(Utils.printf(Dictionary.actionsResponses.RolesDeleted2,rolesToDeleteCount));
                    } else {
                        // many roles, some failure
                        deletedRolesSummaryResultDialog(deletedRolesStatus, responsesReceivedSuccessCounter);
                    }
                }
            }
        }
    }

    return {
        //roleSummaryRegionVisible: null,

        /**
         * Event bus is used to publish refresh events.
         *
         * @method setEventBus
         * @param {EventBus} eventBus
         */
        setEventBus: function(theEventBus) {
            eventBus = theEventBus;

            eventBus.subscribe('layouts:rightpanel:beforechange', function(visible, regionValue) {
                if (regionValue === 'summary') {
                    roleSummaryRegionVisible = visible;
                } else {
                    if (visible) {
                        roleSummaryRegionVisible = false;
                    }
                }
            }.bind(this));
        },

        /**
         * Sets role summary region.
         *
         * @method setRoleSummaryRegion
         * @param {RoleSummary} region
         */
        setRoleSummaryRegion: function(region) {
            roleSummaryRegion = region;
        },

        /**
         * Returns the default actions.
         *
         * @method getDefaultActions
         * @return {Array<Object>} actions
         */
        getDefaultActions: function() {
            return [{
                    name: Dictionary.actions.CreateUserRole,
                    type: 'button',
                    color: 'darkBlue',
                    action: function() {
                        context.eventBus.publish('actions:create');
                    }
                }];
        },

        setContext: function(ctx) {
            context = ctx;
        },

        /**
         * Figures out the actions to show based on number of rows selected.
         *
         * @method getContextActions
         * @param {Integer} checkedRows
         * @return {Array<Object>} actions
         */
        getContextActions: function(checkedRows) {

            var output = [];
            var actionsSet;
            rolesToDelete = []; //here is generated a list of roles to delete
            var nonSystemRoles = false;
            var differentStatus = false;
            var comRole = false;
            var cppRole = false;

            //DELETE BUTTON
            //If one or more com role or com alias or cpp role is selected, delete button is disabled
            if (checkedRows && checkedRows.length >= 1) {
              nonSystemRoles = true;
              comRole = false;
              cppRole = false;
              checkedRows.forEach(function(row) {
                  var roleType = row.type.toLowerCase();
                  if (roleType === 'com' ) {
                      comRole = true;
                  }
                  if ( roleType === 'cpp' ) {
                      cppRole = true;
                  }
                  if (nonSystemRoles && !(roleType === 'com' || roleType === 'comalias' || roleType === 'custom' || roleType === 'cpp')) {
                      nonSystemRoles = false;
                      rolesToDelete = []; //In case somebody hack delete button
                  }
                  rolesToDelete.push(row);
              });
              //Set flag to determine if status of selected rows are different
              checkedRows.reduce(
                function(previousValue, currentValue, currentIndex) {
                  if(currentIndex !== 0 && (previousValue.status !== currentValue.status)){
                    differentStatus = true;
                  }
                  return currentValue;
              });

              actionsSet = actions.constructor();
              for(var attr in actions) {
                if (actions.hasOwnProperty(attr)) actionsSet[attr] = actions[attr];
              }
              if(checkedRows.length === 1) {
                actionsSet.edit = actions.edit(checkedRows[0].name);
                delete actionsSet.compare;
              }

              if(checkedRows.length === 2){
                delete actionsSet.edit;
                if (checkedRows[0].type.toLowerCase() === 'custom' && checkedRows[1].type.toLowerCase() === 'custom') {
                  actionsSet.compare = actions.compare(checkedRows[0].name + '&' + checkedRows[1].name);
                } 
                else {
                  delete actionsSet.compare;
                }
              }

              if(checkedRows.length >2){
                delete actionsSet.edit;
                delete actionsSet.compare;
              }

              if(!differentStatus){
                switch(checkedRows[0].status){
                  case "ENABLED":
                    delete actionsSet.enable;
                    break;
                  case "DISABLED":
                    delete actionsSet.disable;
                    break;
                  default:
                    delete actionsSet.nonassignable;
                    break;
                }
              }

              if(!nonSystemRoles){
                delete actionsSet.edit;
                delete actionsSet.delete;
                delete actionsSet.secondSeparator;
                delete actionsSet.enable;
                delete actionsSet.disable;
                delete actionsSet.nonassignable;
              } else if (comRole || cppRole) {
                delete actionsSet.disable;
              }
            } else {
              console.log("return this.getDefaultActions()");
              return this.getDefaultActions();
            }

            output =  Object.keys(actionsSet).map(function (key) {return actionsSet[key];});

            //console.log("output " + output);
            return output;
        },

        isRoleSummaryVisible: function() {
            return roleSummaryRegionVisible;
        }


    };

});
