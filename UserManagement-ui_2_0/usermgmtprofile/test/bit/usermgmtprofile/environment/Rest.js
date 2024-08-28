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
    './rest/User',
    './rest/PasswordValidation',
    './rest/ValidationRules',
    './rest/Privileges',
    './rest/Roles',
    './rest/Authorize',
    './rest/PasswordAgeing',
    './rest/EnforcedUserHardening'
], function(User, PasswordValidation, ValidationRules, Privileges, Roles, Authorize, PasswordAgeing, EnforcedUserHardening) {

    return {
        Default: [
            User.UserToSave,
            User.Default,
            PasswordValidation.Default,
            ValidationRules.Default,
            Roles.Default,
            Privileges.Default,
            Privileges.Roles,
            Authorize.Default
        ],
        Error48usersForCpp: [
            User.UserToSaveError48UsersForCpp,
            User.Default1,
            PasswordValidation.Default,
            ValidationRules.Default,
            Roles.Default,
            Privileges.Default,
            Privileges.Roles,
            Authorize.Default
        ],
        Error48TgAll: [
            User.UserToSaveError48TgAll,
            User.Default1,
            PasswordValidation.Default,
            ValidationRules.Default,
            Roles.Default,
            Privileges.Default,
            Privileges.Roles,
            Authorize.Default
        ],
        Error10TP: [
            User.UserToSaveError10TP,
            User.Default1,
            PasswordValidation.Default,
            ValidationRules.Default,
            Roles.Default,
            Privileges.Default,
            Privileges.Roles,
            Authorize.Default
        ],
        NotAuthorize: [
            User.UserToSave,
            User.Default,
            PasswordValidation.Default,
            ValidationRules.Default,
            Roles.Default,
            Privileges.Default,
            Privileges.Roles,
            User.UserEdit,
            Authorize.Failure
        ],
        EditUser: [
            User.Default,///oss\/idm\/usermanagement\/users\/administrator => DefaultUser
            Privileges.Roles,///oss/idm/rolemanagement/roles => AllRoles
            PasswordValidation.Default,
            ValidationRules.Default,
            User.UserEdit,///\/oss\/idm\/usermanagement\/users\/administrator => Genericuser
            Privileges.Default,///oss/idm/usermanagement/users/administrator/privileges => ADMINISTRATOR:ALL, SECURITY_ADMIN:ALL, CM-Advanced:TG1
            Roles.Default,///oss/idm/rolemanagement/roles => ADMINISTRATOR:ENABLE, Autoprovisioning_Operator:ENABLED, CM-Advanced:ENABLED
            Authorize.Default,
            PasswordAgeing.Default
        ],
        EditUserHardening: [
            User.Default,///oss\/idm\/usermanagement\/users\/administrator => DefaultUser
            Privileges.Roles,///oss/idm/rolemanagement/roles => AllRoles
            PasswordValidation.Default,
            ValidationRules.Default,
            User.UserEditPACustom,///\/oss\/idm\/usermanagement\/users\/administrator => Genericuser
            Privileges.Default,///oss/idm/usermanagement/users/administrator/privileges => ADMINISTRATOR:ALL, SECURITY_ADMIN:ALL, CM-Advanced:TG1
            Roles.Default,///oss/idm/rolemanagement/roles => ADMINISTRATOR:ENABLE, Autoprovisioning_Operator:ENABLED, CM-Advanced:ENABLED
            Authorize.Default,
            PasswordAgeing.EnforcedUserPassword
        ],
        DuplicateUser: [
            User.Default,  ///oss\/idm\/usermanagement\/users\/administrator => DefaultUser
            Privileges.Roles, ///oss/idm/rolemanagement/roles => AllRoles
            Privileges.Default,///oss/idm/usermanagement/users/administrator/privileges => ADMINISTRATOR:ALL, SECURITY_ADMIN:ALL
            Authorize.Default
        ],
        DuplicateUserWithAuthMode: [
            User.UserToDuplicate,
            PasswordValidation.Default,
            ValidationRules.Default,
            Roles.Default,
            Privileges.UserToDuplicate,
            Privileges.Roles,
            Authorize.Default
        ],
        User: User,
        PasswordValidation: PasswordValidation,
        ValidationRules: ValidationRules,
        NewPoliciesPlus: ValidationRules.OnePlus,
        NewPoliciesMinus: ValidationRules.OneMinus,
        NewPoliciesPlusResult: PasswordValidation.NewPoliciesPlusResult,
        NewPoliciesMinusResult: PasswordValidation.NewPoliciesMinusResult,
        EnforcedUserHardening: EnforcedUserHardening
    };

});
