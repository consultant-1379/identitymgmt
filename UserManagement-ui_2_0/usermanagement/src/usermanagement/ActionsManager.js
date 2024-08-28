define([
    'jscore/ext/net',
    './Dictionary',
    'identitymgmtlib/Utils'
], function(net, Dictionary, Utils) {

    /**
     * Simple manager class for actions, rather than mixing them up
     * with the region and the app class. This class determines what
     * actions to show based on the number of rows that have been
     * selected.
     */

    // Static variables
    var eventBus;
    var federatedView = false;
    var enforcedUserHardening = false;
    var isImportButtonEnabled = false;

    // Declare all of the possible actions.
    var actions = {
        'create': {
            name: Dictionary.createUserProfile,
            type: 'button',
            color: 'blue',
            action: function() {
                eventBus.publish('action:create');
            }
        },

        'editProfile': {
            name: Dictionary.editProfile,
            type: 'button',
            icon: 'edit',
            action: function() {
                eventBus.publish('action:editProfile');
            }
        },


        'changePasswordByAdmin': {
            name: Dictionary.editPassword,
            type: 'button',
            action: function() {
                eventBus.publish('action:changePasswordByAdmin');
            }
        },


        'duplicate': {
            name: Dictionary.duplicate,
            type: 'button',
            icon: 'duplicate',
            action: function() {
                eventBus.publish('action:duplicateProfile');
            }
        },


        'delete': {
            name: Dictionary.delete,
            type: 'button',
            icon: 'delete',
            action: function() {
                eventBus.publish('action:deleteUsers');
            }
        },

        'forcePasswordChange': {
            name: Dictionary.forcePasswordChange,
            type: 'button',
            action: function() {
                eventBus.publish('action:forcePasswordChange', 'true');
            }
        },

        'disablePasswordChange': {
            name: Dictionary.disablePasswordChange,
            type: 'button',
            action: function() {
                eventBus.publish('action:forcePasswordChange', 'false');
            }
        },

        'enableUser': {
            name: Dictionary.enableUser,
            type: 'button',
            action: function() {
                eventBus.publish('action:enableDisableUser', 'enabled' );
            }.bind(this)
        },

        'disableUser': {
            name: Dictionary.disableUser,
            type: 'button',
            action: function() {
                eventBus.publish('action:enableDisableUser', 'disabled') ;
            }.bind(this)
        },

        'terminateSessions': {
            name: Dictionary.terminateSessions,
            type: 'button',
            action: function() {
                eventBus.publish('action:terminateSessions');
            }
        },

        'revokeCertificate': {
            name: Dictionary.revokeCertificate,
            type: 'button',
            action: function() {
                eventBus.publish('action:revokeCertificate');
            },
            disabled: true
        },

        'editPassword': {
            name: Dictionary.editPassword,
            type: 'button',
            action: function() {}
        },
//        'viewSummary': {
//            name: Dictionary.viewSummary,
//            type: 'button',
//            action: function() {
//                eventBus.publish('action:viewSummary');
//            }
//        },
        'import': {
            name: Dictionary.importUsers,
            type: 'button',
            icon: 'import',
            action: function() {
                eventBus.publish('action:importUsers');
            },
            disabled: !isImportButtonEnabled
        },
        'export': {
            name: Dictionary.exportProfiles,
            type: 'button',
            icon: 'export',
            action: function() {
                eventBus.publish('action:export');
            }
        }
    };

    return {

        /**
         * Event bus is used to publish refresh events.
         *
         * @method setEventBus
         * @param {EventBus} eventBus
         */
        setEventBus: function(theEventBus) {
            eventBus = theEventBus;
        },

        /**
         * Set Federated View .
         *
         * @method setFederatedView
         * @param {boolean} federatedView
         */
        setFederatedView: function(theFederatedView) {
            federatedView = theFederatedView;
        },

        /**
         * Set Enforced User Hardening.
         *
         * @method setEnforcedUserHardening
         * @param {boolean} enforcedUserHardening
         */
        setEnforcedUserHardening: function(theEnforcedUserHardening) {
            enforcedUserHardening = theEnforcedUserHardening;
        },

        /**
         * Enable Import Button.
         *
         * @method enableImportButton
         */
        enableImportButton: function() {
            isImportButtonEnabled = true;
            if ( actions.import !== undefined ) {
                actions.import.disabled = false;
            }
        },

        /**
         * Get the default actions.
         *
         * @method getDefaultActions
         * @return {Array<Object>} actions
         */
        getDefaultActions: function() {
            if (  federatedView ) {
                return [];
            } else {
                return [[actions.create],  [actions.import]];
            }
        },

        /**
         * Figure out the context actions based on the number of rows selected.
         *
         * @method getActions
         * @param {Integer} checkedRowsNumber
         * @param {Boolean} excludeDefaults
         */
        getActions: function(selectedRows, excludeDefaults) {
            var output = [];
            var checkedRowsNumber = 0;

            actions.delete.disabled = false;
            if ( selectedRows !== undefined ) {
                var containsAdministrator = false;

                checkedRowsNumber = selectedRows.length;
                if (checkedRowsNumber >= 1) {
                    containsAdministrator = selectedRows.some(
                        function checkAdministrator(user) {
                            return user.username === "administrator";
                        }
                    );

                    if ( containsAdministrator ) {
                        actions.delete.disabled = true;
                    }
                }
            }


            // Defaults should be excluded if these actions are being used
            // for the context menu
            if (  federatedView ) {
            } else {
                if (checkedRowsNumber === 1 && !excludeDefaults) {
                    output.push([actions.create], [actions.import]);
                    //output.push(actions.editProfile);
                }
            }

            // Duplicate and Edit can only be shown if only one item is selected.
            if (checkedRowsNumber >= 1) {
                var containsFederated = selectedRows.some(
                    function checkFederated(user) {
                        if ( user.options && user.options.model ) {
                            return user.options.model.authMode ==='federated';
                        } else {
                            return user.authMode ==='federated';
                        }
                    });

                this.setForcedPasswordChange(selectedRows);
                this.setEnableDisableUser(selectedRows);

                if (checkedRowsNumber === 1) {
                    //set disabled revoke certificate
                    this.setRevokeCertificate(selectedRows);
                    if ( containsFederated ) {
                        output.push([actions.changePasswordByAdmin], [actions.terminateSessions, actions.revokeCertificate]);
                    } else if (actions.forcePasswordArray.length === 0) {
                        output.push([actions.editProfile, actions.changePasswordByAdmin, actions.duplicate, actions.delete], [actions.terminateSessions, actions.revokeCertificate],  actions.enableDisableUserArray, [actions.export]);
                    } else {
                        output.push([actions.editProfile, actions.changePasswordByAdmin, actions.duplicate, actions.delete], [actions.terminateSessions, actions.revokeCertificate], actions.enableDisableUserArray, actions.forcePasswordArray, [actions.export]);
                    }
                } else {
                    if ( containsFederated ) {
                        output.push([actions.terminateSessions]);
                    } else if (actions.forcePasswordArray.length === 0) {
                        output.push([actions.editProfile, actions.delete], [actions.terminateSessions], actions.enableDisableUserArray, [actions.export]);
                    } else {
                        output.push([actions.editProfile, actions.delete], [actions.terminateSessions], actions.enableDisableUserArray, actions.forcePasswordArray, [actions.export]);
                    }
                }

            }

            if (  federatedView ) {

            } else {
                if (!output.length) {
                    output.push([actions.create], [actions.import]);
                }
            }
            return output;
        },

        /**
         * Figure out the context actions based on the number of rows selected.
         *
         * @method getActions
         * @param {Integer} checkedRowsNumber
         * @param {Boolean} excludeDefaults
         */
        getMenuActions: function(selectedRowsMenuActions, excludeDefaults) {
            var output = [];
            var selectedRows = [];
            if ( selectedRowsMenuActions !== undefined ) {
                selectedRowsMenuActions.forEach(function(el) {
                    selectedRows.push(el.options.model);
                });
            }
            this.getActions(selectedRows, excludeDefaults).forEach(function(ar) {
                ar.forEach( function(el) {
                    output.push(el);
                });
                output.push({type: 'separator'});
            });
            output.pop(); // remove last separator
            return output;
        },

        /**
         * Add Force/disable Password Changeaccording with selected items
         *
         * @method setForcedPasswordChange
         * @param {User} selectedRows
         */
        setForcedPasswordChange: function(selectedRows) {
            var countTrue = 0;

            selectedRows.forEach(function(row) {
                if ( row.passwordResetFlag === true ) {
                    countTrue += 1;
                }
            }.bind(this));

            if ( countTrue === selectedRows.length ) {
              if (enforcedUserHardening === false ) {
                actions.forcePasswordArray = [actions.disablePasswordChange];
              } else {
                actions.forcePasswordArray = [];
              }
            } else if ( countTrue === 0 || enforcedUserHardening === true) {
                actions.forcePasswordArray = [actions.forcePasswordChange];
            } else {
                actions.forcePasswordArray = [actions.forcePasswordChange, actions.disablePasswordChange];
            }
        },

        /**
         * Add Enable/disable User according with selected items
         *
         * @method setEnableDisableUser
         * @param {User} selectedRows
         */
        setEnableDisableUser: function(selectedRows) {
            var countTrue = 0;

            selectedRows.forEach(function(row) {
                if ( row.status === "enabled" ) {
                    countTrue += 1;
                }
            }.bind(this));

            if ( countTrue === selectedRows.length ) {
                actions.enableDisableUserArray = [actions.disableUser];
            } else if ( countTrue === 0 ) {
                actions.enableDisableUserArray = [actions.enableUser];
            } else {
                actions.enableDisableUserArray = [actions.enableUser, actions.disableUser];
            }
        },

        /**
         * Set disabled value of revokeCertificate in actions array
         *
         * @method setRevokeCertificate
         * @param {User} selectedRows
         */
        setRevokeCertificate: function(selectedRows, excludeDefaults) {
            actions.revokeCertificate.disabled = (selectedRows[0].credentialStatus !== "ACTIVE");
        }
    };

});
