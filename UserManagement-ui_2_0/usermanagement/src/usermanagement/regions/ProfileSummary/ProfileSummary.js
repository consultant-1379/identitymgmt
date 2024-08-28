define([
    'jscore/core',
    'uit!./ProfileSummary.html',
    'jscore/ext/privateStore',
    'container/api',
    '../../Dictionary',
    'usermgmtlib/model/UserProfileModel',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    '../../widgets/ProfileSummaryRoles/ProfileSummaryRoles',
    '../../widgets/ProfileSummaryOdpProfiles/ProfileSummaryOdpProfiles',
    'usermgmtlib/services/UserManagementService',
    'identitymgmtlib/Utils'
], function(core, View, PrivateStore, container, Dictionary, UserProfileModel, responseHandler, ProfileSummaryRoles, ProfileSummaryOdpProfiles, UserManagementService, Utils) {

    var _ = PrivateStore.create();

    var sessions;

    function showLoader() {
        container.getEventBus().publish('container:loader');
    }

    function hideLoader() {
        container.getEventBus().publish('container:loader-hide');
    }

    function updateSessionsDetails(sessions) {
        if ( _(this).isFederated ) {
            this.view.getElement().find('.eaUsermanagement-ProfileSummary-editlink').setStyle("display", "none");
        } else {
            this.view.getElement().find('.eaUsermanagement-ProfileSummary-editlink').removeStyle("display");
        }

        this.view.getElement().find('.eaUsermanagement-ProfileSummary-sessions-loader').setModifier('hide');
        this.view.getElement().find('.eaUsermanagement-ProfileSummary-sessions-instances').setText("");
        if (sessions) {
            this.view.getElement().find('.eaUsermanagement-ProfileSummary-sessions-instances').setText(Dictionary.instances);

            this.view.getElement().find('.eaUsermanagement-ProfileSummary-sessions-value').setText(Utils.getUserSessions(_(this).username, sessions));
        } else {
            this.view.getElement().find('.eaUsermanagement-ProfileSummary-sessions-value').setText('error');
        }
    }

    function createProfileSummaryOdpProfiles(odpProfiles) {
        if (_(this).profileSummaryOdpProfiles) {
            _(this).profileSummaryOdpProfiles.destroy();
        }
        if (odpProfiles.length > 0) {
           _(this).profileSummaryOdpProfiles = new ProfileSummaryOdpProfiles({
              userOdpProfiles: _(this).userOdpProfiles,
              odpProfiles: odpProfiles,
              userName: _(this).username
          });
          this.view.getElement().find('.eaUsermanagement-ProfileSummary-odpProfilesContainer-loader').setModifier('hide');
          _(this).profileSummaryOdpProfiles.attachTo(this.view.getElement().find('.eaUsermanagement-ProfileSummary-odpProfilesContainer'));
        } else {
          this.view.getElement().find('.eaUsermanagement-ProfileSummary-odpProfilesContainer-loader').setModifier('hide');
        }
    }


    function createProfileSummaryRoles(privileges, roles) {
        if (_(this).profileSummaryRoles) {
            _(this).profileSummaryRoles.destroy();
        }

        _(this).profileSummaryRoles = new ProfileSummaryRoles({
            privileges: privileges,
            roles: roles,
            userName: _(this).username
        });
        this.view.getElement().find('.eaUsermanagement-ProfileSummary-rolesContainer-loader').setModifier('hide');
        _(this).profileSummaryRoles.attachTo(this.view.getElement().find('.eaUsermanagement-ProfileSummary-rolesContainer'));
    }

    return core.Region.extend({

        view: function() {
            return new View({
                username: _(this).username,
                Dictionary: Dictionary
            });
        },

        init: function(options) {
            _(this).username = options.username || undefined;
            _(this).isFederated = options.federated || undefined;
            _(this).sessions = options.sessions;
            _(this).userOdpProfiles = options.odpProfiles;
        },

        addEventHandlers: function() {
            //if new sessions values has came update number - hide loader show value number
            this.getEventBus().subscribe('profilesummary:sessions-update', function(sessions) {
                updateSessionsDetails.call(this, sessions);
            }.bind(this));

            //if terminate session button pressed replace number of sessions by loader
            this.getEventBus().subscribe('profilesummary:terminatesessions', function(sessions) {
                this.view.getElement().find('.eaUsermanagement-ProfileSummary-sessions-value').setText("");
                this.view.getElement().find('.eaUsermanagement-ProfileSummary-sessions-instances').setText("");
                this.view.getElement().find('.eaUsermanagement-ProfileSummary-sessions-loader').removeModifier('hide');
            }.bind(this));

            this.getEventBus().subscribe('profilesummary:roles-' + _(this).username, function() {
                this.updatePrivileges();
            }.bind(this));

            this.getEventBus().subscribe('profilesummary:odpProfiles-' + _(this).username, function() {
                this.updateOdpProfiles();
            }.bind(this));

            if (_(this).sessions || _(this).sessions === null) {
                this.getEventBus().publish('profilesummary:sessions-update', _(this).sessions);
            }

        },

        onStart: function() {
            if (_(this).username) {
                this.addEventHandlers();

                this.view.getElement().find('.eaUsermanagement-ProfileSummary-terminatSessions-button').addEventHandler('click', function() {
                    showLoader();
                    UserManagementService.setTerminateSessions(_(this).username)
                        .then(function() {
                                hideLoader();
                                responseHandler.setNotificationSuccess({ response: "success_terminate_sessions" });
                                //event responsible for get new sessions values - it is handled in MainRegion.js
                                this.getEventBus().publish('profilesummary:terminatesessions');
                            }.bind(this),
                            function(response) {
                                hideLoader();
                                responseHandler.setNotification({ response: response });
                            });
                }.bind(this));

                this.updateOdpProfiles();
                this.updatePrivileges();
            }
        },

        updateOdpProfiles: function() {
            UserManagementService.getOdpProfiles().then(function(odpProfiles) {
                    createProfileSummaryOdpProfiles.call(this, odpProfiles);
            }.bind(this), function(response) {
                this.view.getElement().find('.eaUsermanagement-ProfileSummary-odpProfilesContainer-loader').setModifier('hide');
                responseHandler.setNotification({ response: response });
            }.bind(this));
        },
        updatePrivileges: function() {
            UserManagementService.getRoles().then(function(roles) {
                UserManagementService.getUserPrivileges(_(this).username).then(function(privileges) {
                    createProfileSummaryRoles.call(this, privileges, roles);
                }.bind(this));
            }.bind(this), function(response) {
                this.view.getElement().find('.eaUsermanagement-ProfileSummary-rolesContainer-loader').setModifier('hide');
                responseHandler.setNotification({ response: response });
            }.bind(this));
        }
    });

});
