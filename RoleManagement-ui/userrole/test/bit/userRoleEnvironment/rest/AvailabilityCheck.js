/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 -----------------------------------------------------------------------------*/
define([
    '../../lib/Rest',
    '../data/DefaultAvailabilityCheck'
], function(Rest, DefaultAvailabilityCheck) {

    var generate = function(data) {
        return Rest({
            data: data,
            url: '/rest/apps'
        });
    };

    return {
        Default: generate(DefaultAvailabilityCheck)
    };
});