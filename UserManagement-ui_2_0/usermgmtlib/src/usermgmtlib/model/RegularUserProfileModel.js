define([
    './UserProfileModel',
    'usermgmtlib/services/UserManagementService'
], function(UserProfileModel, service) {

    return UserProfileModel.extend({
        notSync: UserProfileModel.prototype.notSync.concat(['privileges', 'status', 'passwordResetFlag', 'authMode', 'passwordAgeing']),

        getPrivileges: function(username){
           return service.getActingUserPrivileges(username);
        }
    });
});
