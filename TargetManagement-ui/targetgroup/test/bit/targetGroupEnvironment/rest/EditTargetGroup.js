define([
    '../../lib/Rest'
], function(Rest) {

    var generateGetSuccess = function(_httpStatus) {

        var _data = {
            name: "mockName",
            description: "mockDescription",
            isDefault: "false"
        };

        return Rest({
            url: /\/oss\/idm\/targetgroupmanagement\/targetgroups\/\w+/i,
            httpStatus: _httpStatus,
            method: 'GET',
            data: _data
        });
    };

    var generatePutSuccess = function(_httpStatus) {

        var _data = {
            name: "mockName",
            description: "mockDescription",
            isDefault: "false"
        };

        return Rest({
            url: /\/oss\/idm\/targetgroupmanagement\/targetgroups\/\w+\/description/i,
            httpStatus: _httpStatus,
            method: 'PUT',
            data: _data
        });
    };

    var generatePutTargetSuccess = function(_httpStatus) {

        var _data =
            [{"targetGroup":"mockName","targets":["LTE01dg2ERBS00014","LTE01dg2ERBS00033","LTE01dg2ERBS00015","LTE01dg2ERBS00016","LTE01dg2ERBS00034","LTE01dg2ERBS00017","LTE01dg2ERBS00035","LTE01dg2ERBS00002","LTE01dg2ERBS00013"]}];
        return Rest({
            url: /\/oss\/idm\/targetgroupmanagement\/modifyassignment/i,
            httpStatus: _httpStatus,
            method: 'PUT',
            data: _data
        });
    };

    var generateGetFail = function(_httpStatus, _userMessage, _internalCode) {
        var _data = {
            userMessage: _userMessage,
            httpStatusCode: _httpStatus,
            developerMessage: "mockDeveloperMessage",
            time: "2016-03-02T11:09:46"
        };

        if (_internalCode !== undefined) {
            _data.internalErrorCode = _internalCode;
        }

        return Rest({

            url: /\/oss\/idm\/targetgroupmanagement\/targetgroups\/\w+/i,
            httpStatus: _httpStatus,
            method: 'GET',
            data: _data
        });
    };

    var generateTargetList = function(_httpStatus) {
        var _data = [{name: "LTE01ERBS00001", targetTypeName: "ERBS"},
                     {name: "LTE01dg2ERBS20002", targetTypeName: "RadioNode"}];

        return Rest({
            url: /\/oss\/idm\/targetmanagement\/targets\?targetgroups+/i,
            httpStatus: _httpStatus,
            method: 'GET',
            data: _data
        });
    };

    var generateCollection = function(_httpStatus) {
        var _data = {   "id":"52295",
                        "name":"pippo",
                        "owner": "administrator",
                        "sharing": "private",
                        "type": "LEAF",
                        "timeCreated": 1597659851011,
                        "timeUpdated": 1597659882013,
                        "isCustomTopology": null,
                        "userPermissions": {
                        "deletable": true,
                            "updateable": true
                        },
                        "contentsUpdatedTime": 1597659882012,
                        "contents":[
                            {"id":"281474977840451",
                                 "type": "MeContext",
                                 "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS00104",
                                 "namespace": "OSS_TOP",
                                 "name": "LTE09dg2ERBS00104",
                                 "attributes": {
                                    "neType": "RadioNode"
                                 }
                            },
                            {"id":"281474977841008",
                                 "type": "MeContext",
                                 "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS00105",
                                 "namespace": "OSS_TOP",
                                 "name": "LTE09dg2ERBS00105",
                                 "attributes": {
                                    "neType": "RadioNode"
                                 }
                            },
                            {"id":"281474977854671",
                                 "type": "MeContext",
                                 "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS00106",
                                 "namespace": "OSS_TOP",
                                 "name": "LTE09dg2ERBS00106",
                                 "attributes": {
                                    "neType": "RadioNode"
                                 }
                            },
                            {"id":"281474977855181",
                                 "type": "MeContext",
                                 "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS00107",
                                 "namespace": "OSS_TOP",
                                 "name": "LTE09dg2ERBS00107",
                                 "attributes": {
                                    "neType": "RadioNode"
                                 }
                            },

                            {"id":"281474977855339",
                                 "type": "MeContext",
                                 "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS00108",
                                 "namespace": "OSS_TOP",
                                 "name": "LTE09dg2ERBS00108",
                                 "attributes": {
                                    "neType": "RadioNode"
                                 }
                            },
                            {"id":"281474977872999",
                                 "type": "MeContext",
                                 "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS00109",
                                 "namespace": "OSS_TOP",
                                 "name": "LTE09dg2ERBS00109",
                                 "attributes": {
                                    "neType": "RadioNode"
                                 }
                            },
                            {"id":"281474977873278",
                                 "type": "MeContext",
                                 "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS00110",
                                 "namespace": "OSS_TOP",
                                 "name": "LTE09dg2ERBS00110",
                                 "attributes": {
                                    "neType": "RadioNode"
                                 }
                            },
                            {"id":"281474977873432",
                                 "type": "MeContext",
                                 "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS00111",
                                 "namespace": "OSS_TOP",
                                 "name": "LTE09dg2ERBS00111",
                                 "attributes": {
                                    "neType": "RadioNode"
                                 }
                            },
                            {"id":"281474990290747",
                                 "type": "MeContext",
                                 "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS00112",
                                 "namespace": "OSS_TOP",
                                 "name": "LTE09dg2ERBS00112",
                                 "attributes": {
                                    "neType": "RadioNode"
                                 }
                            },
                            {"id":"281474990290780",
                                 "type": "MeContext",
                                 "fdn": "SubNetwork=Europe,SubNetwork=Ireland,MeContext=LTE09dg2ERBS00113",
                                 "namespace": "OSS_TOP",
                                 "name": "LTE09dg2ERBS00113",
                                 "attributes": {
                                    "neType": "RadioNode"
                                 }
                            }
                            ]
                    };

        return Rest({
            url: /\/object-configuration\/collections\/v4\/52295/i,
            httpStatus: _httpStatus,
            method: 'GET',
            data: _data
        });
    };

    var generateRootAssociations = function(_httpStatus) {
        var _data = [{"name":"LTE01dg2ERBS00002",
                     "type":"NetworkElement",
                     "poId":281474977775952,
                     "id":"281474977775952",
                     "fdn":"NetworkElement=LTE01dg2ERBS00002",
                     "namespace":null,
                     "namespaceVersion":null,
                     "neType":null,
                     "attributes":null,
                     "networkDetails":null
                 },{"name":"LTE01dg2ERBS00013",
                    "type":"NetworkElement",
                    "poId":281474977775985,
                    "id":"281474977775985",
                    "fdn":"NetworkElement=LTE01dg2ERBS00013",
                    "namespace":null,
                    "namespaceVersion":null,
                    "neType":null,
                    "attributes":null,
                    "networkDetails":null
                 },{"name":"LTE04dg2ERBS00012",
                    "type":"NetworkElement",
                    "poId":281474977827225,
                    "id":"281474977827225",
                    "fdn":"NetworkElement=LTE04dg2ERBS00012",
                    "namespace":null,
                    "namespaceVersion":null,
                    "neType":null,
                    "attributes":null,
                    "networkDetails":null
                 },{"name":"LTE04dg2ERBS00011",
                    "type":"NetworkElement",
                    "poId":281474977819764,
                    "id":"281474977819764",
                    "fdn":"NetworkElement=LTE04dg2ERBS00011",
                    "namespace":null,
                    "namespaceVersion":null,
                    "neType":null,
                    "attributes":null,
                    "networkDetails":null
                 },{"name":"LTE06dg2ERBS00020",
                    "type":"NetworkElement",
                    "poId":281474977873806,
                    "id":"281474977873806",
                    "fdn":"NetworkElement=LTE06dg2ERBS00020",
                    "namespace":null,
                    "namespaceVersion":null,
                    "neType":null,
                    "attributes":null,
                    "networkDetails":null
                 },{"name":"LTE01dg2ERBS00016",
                    "type":"NetworkElement",
                    "poId":281474977776084,
                    "id":"281474977776084",
                    "fdn":"NetworkElement=LTE01dg2ERBS00016",
                    "namespace":null,
                    "namespaceVersion":null,
                    "neType":null,
                    "attributes":null,
                    "networkDetails":null
                 },{"name":"LTE01dg2ERBS00014",
                    "type":"NetworkElement",
                    "poId":281474977776018,
                    "id":"281474977776018",
                    "fdn":"NetworkElement=LTE01dg2ERBS00014",
                    "namespace":null,
                    "namespaceVersion":null,
                    "neType":null,
                    "attributes":null,
                    "networkDetails":null
                 },{"name":"LTE01dg2ERBS00015",
                    "type":"NetworkElement",
                    "poId":281474977776051,
                    "id":"281474977776051",
                    "fdn":"NetworkElement=LTE01dg2ERBS00015",
                    "namespace":null,
                    "namespaceVersion":null,
                    "neType":null,
                    "attributes":null,
                    "networkDetails":null
                 },{"name":"LTE01dg2ERBS00017",
                    "type":"NetworkElement",
                    "poId":281474977776117,
                    "id":"281474977776117",
                    "fdn":"NetworkElement=LTE01dg2ERBS00017",
                    "namespace":null,
                    "namespaceVersion":null,
                    "neType":null,
                    "attributes":null,
                    "networkDetails":null
                }];

        return Rest({
            url: /\/persistentObject\/rootAssociations/i,
            httpStatus: _httpStatus,
            method: 'POST',
            data: _data
        });
    };

    var generateSavedSearch = function(_httpStatus) {
        var _data = {"poId":"48649","name":"MySearch","searchQuery":"all nodes","attributes":{"lastUpdated":null,"searchQuery":"all nodes","name":"MySearch","timeCreated":null,"category":"Private","userId":"administrator"},"deletable":true,"update":true,"delete":true,"type":"SavedSearch"}
        return Rest({
            url: /\/topologyCollections\/savedSearches\/48649/i,
            httpStatus: _httpStatus,
            method: 'GET',
            data: _data
        });
    };

    var generateSavedSearchResult = function(_httpStatus) {
        var _data = {"poList":["281474977840451","281474977841008","281474977854671","281474977855181","281474977855339","281474977872999","281474977873278","281474977873432","281474990290747","281474990290780"],"attributes":["neType"],"attributeMappings":[{"moType":"MeContext","attributeNames":["neType"]}],"metadata":{"SORTABLE":true,"RESULT_SET_TOTAL_SIZE":10,"MAX_UI_CACHE_SIZE":100000,"INFO_MESSAGE":0}}
        return Rest({
            //Request URL:https://enmapache.athtem.eei.ericsson.se/managedObjects/query/?searchQuery=LTE05*&fullMo=false
            url: /\/managedObjects\/query\/\?searchQuery+/i,
            httpStatus: _httpStatus,
            method: 'GET',
            data: _data
        });
    };



    

    var generateObjectByPoID = function(_httpStatus) {
        var _data = [ {"moName":"LTE05ERBS00001","moType":"MeContext","poId":"281474977840451","mibRootName":"LTE05ERBS00001","parentRDN":"","fullMoType":"MeContext","attributes":{"neType":"ERBS"}},
                      {"moName":"LTE05ERBS00002","moType":"MeContext","poId":"281474977841008","mibRootName":"LTE05ERBS00002","parentRDN":"","fullMoType":"MeContext","attributes":{"neType":"ERBS"}},
                      {"moName":"LTE05ERBS00003","moType":"MeContext","poId":"281474977854671","mibRootName":"LTE05ERBS00003","parentRDN":"","fullMoType":"MeContext","attributes":{"neType":"ERBS"}},
                      {"moName":"LTE05ERBS00004","moType":"MeContext","poId":"281474977855181","mibRootName":"LTE05ERBS00004","parentRDN":"","fullMoType":"MeContext","attributes":{"neType":"ERBS"}},
                      {"moName":"LTE05ERBS00005","moType":"MeContext","poId":"281474977855339","mibRootName":"LTE05ERBS00005","parentRDN":"","fullMoType":"MeContext","attributes":{"neType":"ERBS"}},
                      {"moName":"LTE05ERBS00008","moType":"MeContext","poId":"281474977872999","mibRootName":"LTE05ERBS00008","parentRDN":"","fullMoType":"MeContext","attributes":{"neType":"ERBS"}},
                      {"moName":"LTE05ERBS00009","moType":"MeContext","poId":"281474977873278","mibRootName":"LTE05ERBS00009","parentRDN":"","fullMoType":"MeContext","attributes":{"neType":"ERBS"}},
                      {"moName":"LTE05ERBS00010","moType":"MeContext","poId":"281474977873432","mibRootName":"LTE05ERBS00010","parentRDN":"","fullMoType":"MeContext","attributes":{"neType":"ERBS"}},
                      {"moName":"LTE05ERBS00037","moType":"MeContext","poId":"281474990290747","mibRootName":"LTE05ERBS00037","parentRDN":"","fullMoType":"MeContext","attributes":{"neType":"ERBS"}},
                      {"moName":"LTE05ERBS00038","moType":"MeContext","poId":"281474990290780","mibRootName":"LTE05ERBS00038","parentRDN":"","fullMoType":"MeContext","attributes":{"neType":"ERBS"}}];        

        return Rest({
            //https://enmapache.athtem.eei.ericsson.se/managedObjects/getObjectsByPoIds/
            url: /\/managedObjects\/getPosbyPoIds/i,
            httpStatus: _httpStatus,
            method: 'POST',
            data: _data
        });
    };


    var generatePutFail = function(_httpStatus, _userMessage, _internalCode) {

        var _data = {
            userMessage: _userMessage,
            httpStatusCode: _httpStatus,
            developerMessage: "mockDeveloperMessage",
            time: "2016-03-02T11:09:46"
        };

        if (_internalCode !== undefined) {
            _data.internalErrorCode = _internalCode;
        }

        return Rest({
            url: /\/oss\/idm\/targetgroupmanagement\/targetgroups\/\w+\/description/i,
            httpStatus: _httpStatus,
            method: 'PUT',
            data: _data
        });
    };

    var internalCodeGetFailGenerator = function(_internalCode) {
        return generateGetFail(422, "UserMessage", _internalCode);
    };

    var internalPutCodeFailGenerator = function(_internalCode) {
        return generatePutFail(422, "UserMessage", _internalCode);
    };

    return {
        LoadTargetGroupSuccess: generateGetSuccess(200),
        LoadTargetGroupFail_unexpected_http_code: generateGetFail(777, "UserMessage"),
        LoadTargetGroupFail_no_internal_code: generateGetFail(422, "UserMessage"),
        LoadTargetGroupFail_internalCodeGenerator: internalCodeGetFailGenerator,

        EditTargetGroupDescriptionSuccess: generatePutSuccess(200),
        EditTargetGroupFail_unexpected_http_code: generatePutFail(777, "UserMessage"),
        EditTargetGroupFail_no_internal_code: generatePutFail(422, "UserMessage"),
        EditTargetGroupFail_internalCodeGenerator: internalPutCodeFailGenerator,
        generateTargetList: generateTargetList(200),
        generateCollection: generateCollection(200),
        generateRootAssociations: generateRootAssociations(200),
        generateSavedSearch: generateSavedSearch(),
        generateSavedSearchResult: generateSavedSearchResult(),
        generateObjectByPoID: generateObjectByPoID(),
        generatePutTargetSuccess: generatePutTargetSuccess()
    };
});
