define([
    'test/bit/usermanagement/usermanagementEnvironment/rest/TimeServer',
    'test/bit/usermanagement/usermanagementEnvironment/rest/Users',
    'test/bit/usermanagement/usermanagementEnvironment/rest/GetRoles',
    'test/bit/usermanagement/usermanagementEnvironment/rest/Sls',
    'test/bit/usermanagement/usermanagementEnvironment/rest/SSOUsers',
    'test/bit/usermanagement/usermanagementEnvironment/rest/Authorize',
    'test/bit/usermanagement/usermanagementEnvironment/rest/RevokeCertificate',
    'test/bit/usermanagement/usermanagementEnvironment/rest/PasswordAgeing',
    'test/bit/usermanagement/usermanagementEnvironment/rest/Privileges',
    'test/bit/usermanagement/usermanagementEnvironment/rest/UiAccessControl',
    'test/bit/usermanagement/usermanagementEnvironment/rest/Editprofile',
    'test/bit/usermanagement/usermanagementEnvironment/rest/EnforcedUserHardening',
    'test/bit/usermanagement/usermanagementEnvironment/rest/OdpProfiles'
], function(TimeServer, Users, GetRoles, Sls, SSOUsers, Authorize, RevokeCertificate, PasswordAgeing, Privileges, UiAccessControl, Editprofile, EnforcedUserHardening, OdpProfiles) {


    return {
        Default: [
            TimeServer.Default,
            Users.Default,
            GetRoles.Default,
            Sls.Default,
            Authorize.Default,
            RevokeCertificate.Default,
            PasswordAgeing.Default,
            SSOUsers.Default,
            UiAccessControl.Default,
            Editprofile.Default
        ],
        Filters: [
            TimeServer.Default,
            Users.UsersFilterTestData,
            GetRoles.Default,
            Privileges.Filter,
            Sls.Default,
            Authorize.Default,
            PasswordAgeing.Default,
            SSOUsers.Default,
            UiAccessControl.Default,
            Editprofile.Default
        ],
        DeleteUsers: [
            TimeServer.Default,
            Users.Default,
            GetRoles.Default,
            SSOUsers.Default,
            UiAccessControl.Default,
            Editprofile.Default
        ],
        NotAuthorize: [
            TimeServer.Default,
            Users.Default,
            GetRoles.Default,
            Sls.Default,
            Authorize.Failure,
            UiAccessControl.NotImplemented,
            Editprofile.Default
        ],
        ProfileSummary: [
            TimeServer.Default,
            Users.Default,
            GetRoles.ProfileSummary,
            Sls.Default,
            Authorize.Default,
            RevokeCertificate.Default,
            PasswordAgeing.Default,
            SSOUsers.Default,
            UiAccessControl.Default,
            Editprofile.Default,
            OdpProfiles.Default
        ],
        TimeServer: TimeServer,
        Users: Users,
        GetRoles: GetRoles,
        Sls: Sls,
        SSOUsers: SSOUsers,
        RevokeCertificate: RevokeCertificate,
        UiAccessControl: UiAccessControl,
        Editprofile: Editprofile,
        Privileges: Privileges,
        EnforcedUserHardening: EnforcedUserHardening,
        OdpProfiles: OdpProfiles

    };

});
