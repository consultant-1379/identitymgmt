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
    '../../lib/Rest',
    '../data/GetRolesDefaultData',
    '../data/GetRolesFilterData',
    '../data/GetRolesSummaryPanel',
    '../data/GetTestCOMRoleAlias',
    '../data/GetTestCustomRole',
    '../data/GetRolesActionBar',
    '../data/GetRoles150Data',
    '../data/GetRolesSortData'
], function(Rest, GetRolesDefaultData, GetRolesFilterData, GetRolesSummaryPanel, GetTestCOMRoleAlias, GetTestCustomRole, GetRolesActionBar, GetRoles150Data, GetRolesSortData) {

    var generate = function(_data) {

        return Rest({
            url: '/oss/idm/rolemanagement/roles',
            httpStatus: 200,
            method: 'GET',
            data: _data
        });
    };

    var generateTestCOMRoleAlias = function(_data) {

        return Rest({
            url: '/oss/idm/rolemanagement/roles/TestCOMRoleAlias',
            httpStatus: 200,
            method: 'GET',
            data: _data
        });
    };

    var generateTestCustomRole = function(_data) {

        return Rest({
            url: '/oss/idm/rolemanagement/roles/TestCustomRole',
            httpStatus: 200,
            method: 'GET',
            data: _data
        });
    };

    var generateGetDisabledNonassignableRole = function () {
        var data ={
            "type": "comalias",
            "name": "TestCOMRoleAlias1",
            "description": "Testing COM role alias",
            "status": "ENABLED",
            "roles": [{
                "type": "com",
                "name": "SystemSecurityAdministrator",
                "description": "Provides full control over the fragment of a Managed Element model related to Security Management",
                "status": "ENABLED"
          }]
        };
        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/TestCOMRoleAlias1/,
            httpStatus: 200,
            method: 'GET',
            data: data
        });
    };

    var generatePutDisabledNonassignableRole = function () {

        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/TestCOMRoleAlias1/,
            httpStatus: 200,
            method: 'PUT',
            data: {}
        });
    };

    var generateGetEnabledNonassignableRole = function () {
        var data ={
            "type": "comalias",
            "name": "TestCOMRoleAlias2",
            "description": "Testing COM role alias",
            "status": "DISABLED",
            "roles": [{
                "type": "com",
                "name": "SystemSecurityAdministrator",
                "description": "Provides full control over the fragment of a Managed Element model related to Security Management",
                "status": "ENABLED"
            }]
        };
        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/TestCOMRoleAlias2/,
            httpStatus: 200,
            method: 'GET',
            data: data
        });
    };

    var generatePutEnabledNonassignableRole = function () {

        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/TestCOMRoleAlias2/,
            httpStatus: 200,
            method: 'PUT',
            data: {}
        });
    };

    var generateGetEnabledDisabledRole = function () {
        var data ={
            "type": "comalias",
            "name": "TestCOMRoleAlias3",
            "description": "Testing COM role alias",
            "status": "DISABLED_ASSIGNMENT",
            "roles": [{
                "type": "com",
                "name": "SystemSecurityAdministrator",
                "description": "Provides full control over the fragment of a Managed Element model related to Security Management",
                "status": "ENABLED"
            }]
        };
        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/TestCOMRoleAlias3/,
            httpStatus: 200,
            method: 'GET',
            data: data
        });
    };

    var generatePutEnabledDisabledRole = function () {

        return Rest({
            url: /oss\/idm\/rolemanagement\/roles\/TestCOMRoleAlias3/,
            httpStatus: 200,
            method: 'PUT',
            data: {}
        });
    };

    return {
        Default: generate(GetRolesDefaultData),
        SortData: generate(GetRolesSortData),
        FilterData: generate(GetRolesFilterData),
        SummaryPanelData: generate(GetRolesSummaryPanel),
        SummaryPanelDataTestCOMRoleAlias: generateTestCOMRoleAlias(GetTestCOMRoleAlias),
        SummaryPanelDataTestCustomRole: generateTestCustomRole(GetTestCustomRole),
        ActionBarData: generate(GetRolesActionBar),
        Roles150: generate(GetRoles150Data),
        GetEnabledNonassignableRole: generateGetEnabledNonassignableRole(),
        PutEnabledNonassignableRole: generatePutEnabledNonassignableRole(),
        GetDisabledNonassignableRole: generateGetDisabledNonassignableRole(),
        PutDisabledNonassignableRole: generatePutDisabledNonassignableRole(),
        GetEnabledDisabledRole: generateGetEnabledDisabledRole(),
        PutEnabledDisabledRole: generatePutEnabledDisabledRole()

    };


});

