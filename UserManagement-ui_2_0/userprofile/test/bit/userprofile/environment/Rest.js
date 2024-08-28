define([
    './rest/Privileges',
    './rest/EditProfile',
    './rest/User',
    './rest/SaveUser',
    './rest/UserSettings'

], function(Privileges, EditProfile, User, SaveUser, UserSettings) {

    return {
        Default: [
            Privileges.Default,
            EditProfile.Default,
            User.Default,
            SaveUser.Default,
            UserSettings.Default
        ],
        RegularUser: [
            Privileges.RegularUser,
            EditProfile.RegularUser,
            User.RegularUser,
            SaveUser.RegularUser,
            UserSettings.RegularUser
        ],
        FederatedUser: [
            Privileges.FederatedUser,
            EditProfile.FederatedUser,
            User.FederatedUser,
            UserSettings.FederatedUser
        ],
        Privileges: Privileges,
        EditProfile: EditProfile,
        User: User,
        SaveUser: SaveUser,
        UserSettings: UserSettings
    };

});