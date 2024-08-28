define([
    'test/bit/lib/Rest',
    'test/bit/usermanagement/usermanagementEnvironment/data/GetRolesDefaultData',
    'test/bit/usermanagement/usermanagementEnvironment/data/GetRolesProfileSummaryData'
], function(Rest, GetRolesDefaultData, GetRolesProfileSummaryData ) {

    var generate = function(_data) {

        return Rest({
            url: '/oss/idm/rolemanagement/roles',
            httpStatus: 200,
            method: 'GET',
            data: _data
        });
    };

    return {
        Default: generate(GetRolesDefaultData),
        ProfileSummary: generate(GetRolesProfileSummaryData)
    };
});