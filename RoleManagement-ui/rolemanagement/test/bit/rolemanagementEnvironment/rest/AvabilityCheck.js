define([
    '../../lib/Rest',
    '../data/AvabilityCheckDefaultData'
], function(Rest, AvabilityCheckDefaultData) {

    var generate = function(data) {
        return Rest({
            data: data,
            url: '/rest/apps'
        });
    };

    return {
        Default: generate(AvabilityCheckDefaultData)
    };
});