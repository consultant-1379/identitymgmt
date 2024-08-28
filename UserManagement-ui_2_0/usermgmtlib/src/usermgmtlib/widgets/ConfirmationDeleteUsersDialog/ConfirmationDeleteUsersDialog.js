define([
    'jscore/core',
    '../../Dictionary',
    'identitymgmtlib/widgets/ConfirmationSummaryDialog',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'identitymgmtlib/Utils'
], function(core, Dictionary, ConfirmationSummaryDialog, UserManagementService, responseHandler, Utils) {

    /*
     * Merge selected users with array logged in users
     */
    var mergeSelectedUserLoginUsers = function(selectedUsers, loggedUsers) {
        var loggedUsersArray = JSON.parse(loggedUsers).users;
        var selectedLoggedUsersArray = [];
        //create array users with assigned status (active or inactive)
        for (var i = 0; i < selectedUsers.length; i++) {
            var status, text;
            if (!Utils.getUserSessions(selectedUsers[i].username, loggedUsersArray)) {
                status = false;
                text = Dictionary.deleteUser.inactive;
            } else {
                status = true;
                text = Dictionary.deleteUser.active;
            }
            selectedLoggedUsersArray.push({
                key: selectedUsers[i].username,
                status: status,
                text: text
            });
        }

        return selectedLoggedUsersArray;

    };



    return core.Widget.extend({

        /**
         * Configuration Dialog for Delete User
         * @param selectedUsers
         */
        showConfirmationDeleteUsersDialog: function(selectedUsers) {
            //get logged in users
            return UserManagementService.checkUserSessions().then(function(loggedUsers) {

                    this.trigger('hideLoader');
                    var selectedLoggedUsers = mergeSelectedUserLoginUsers(selectedUsers, loggedUsers);
                    //open confirmation dialog
                    this.createConfirmationDeleteUsersDialog(selectedLoggedUsers);

                }.bind(this),
                function() {
                     this.trigger('hideLoader');
                    responseHandler.setNotificationError({ response: Dictionary.deleteUser.errorGetUsersSession });
                });
        },


        /**
         * Configuration Dialog for Delete User
         * @param elementsArray
         */
        createConfirmationDeleteUsersDialog: function(selectedLoggedUsers) {
            var confirmationSummaryDialog = this.getConfirmationSummaryDialog(selectedLoggedUsers);
            confirmationSummaryDialog.addEventHandler('dialog-confirmation', function(value, usersList) {

                var filteredUsersName;
                if (value === "cancel") {
                    return;
                } else {
                    // array of all selected username
                    filteredUsersName = usersList.map(function(user) {
                        return user.key;
                    });

                }
                //delete selected user(s)
                this.deleteUsers(filteredUsersName);

            }.bind(this));

        },

        /*
         * Get ConfirmationSummaryDialog object
         */
        getConfirmationSummaryDialog: function(selectedLoggedUsers) {
            return new ConfirmationSummaryDialog({
                elementNameColumnHeader: Dictionary.confirmationDeleteSummaryList.columnHeader,
                type: "warning",
                elementsArray: selectedLoggedUsers,
                header: Dictionary.deleteUser.deleteUsersConfirmationHeader,
                info: Dictionary.confirmationDeleteSummaryList.info,
                statuses: [Dictionary.deleteUser.inactive, Dictionary.deleteUser.active],
                actions: [{
                    caption: Dictionary.confirmationDeleteSummaryList.deleteAllUserCaption,
                    value: "delete-all"
                }, {
                    caption: Dictionary.confirmationDeleteSummaryList.deleteCancelCaption,
                    value: "cancel"
                }]
            });
        },


        /*
         * Delete users
         */
        deleteUsers: function(usernameList) {
            if (usernameList.length) {
                this.trigger('showLoader');
                var requests = usernameList.map(function(userName) {
                    return new Promise(function(resolve, reject) {
                        UserManagementService.requestDeleteUser(userName).then(resolve, resolve);
                    });
                });

                Promise.all(requests).then(function(responses) {

                    var successResponseNumber = responses.filter(function(response) {
                        return response.singleNotification && response.singleNotification.mode === "success";
                    }).length;

                    if (successResponseNumber === usernameList.length) {
                        if (successResponseNumber > 1) {
                            responseHandler.setNotificationSuccess({
                                response: Dictionary.deleteUser.multipleUsersDeleteSuccess,
                                values: [successResponseNumber]
                            });
                        } else {
                            responseHandler.setNotificationSuccess({
                                response: Dictionary.deleteUser.userDeleteSuccess
                            });
                        }
                        this.trigger('deletedUsers', true);
                    } else {
                        responseHandler.setNotificationError({
                            response: responses,
                            operation: "deleteUsers",
                            dialog: true
                        });
                        this.trigger('deletedUsers', false);
                    }
                }.bind(this));
            }

        }


    });

});
