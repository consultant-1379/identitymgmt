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
    '../data/Roles'
], function(Roles) {

    var generate = function(roles) {

        return {
            apply: function(server) {

                server.respondWith(
                    'GET',
                    '/oss/idm/rolemanagement/roles',
                    function(xhr) {
                        xhr.respond(
                            200, {
                                'Content-Type': 'application/json'
                            },
                            JSON.stringify(roles)
                        );
                    }.bind(this)
                );
            }
        };
    };

    return {
        Default: generate(Roles)
    };
});
