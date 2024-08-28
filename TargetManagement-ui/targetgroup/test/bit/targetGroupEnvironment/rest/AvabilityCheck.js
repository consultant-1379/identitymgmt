define([
    '../../lib/Rest',
    '../data/DefaultAvabilityCheck'
], function(Rest, DefaultAvabilityCheck) {

    var generate = function(data) {
        return Rest({
            data: data,
            url: '/rest/apps'
        });
    };

    return {
        Default: generate(DefaultAvabilityCheck)
    };
});