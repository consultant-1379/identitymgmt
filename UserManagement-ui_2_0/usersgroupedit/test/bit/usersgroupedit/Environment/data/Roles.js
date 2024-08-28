/*******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************/

define(function() {
   'use strict';

   return [{
       "type": "system",
       "name": "ADMINISTRATOR",
       "description": "Permits unrestricted access to all ENM applications and commands",
       "status": "ENABLED"
   }, {
       "type": "application",
       "name": "system_enabled_1",
       "description": "Authorizzed for actions an an operator in the Auto Provisioning Service",
       "status": "ENABLED"
   }, {
       "type": "application",
       "name": "system_enabled_2",
       "description": "Authorizzed for actions an an operator in the Auto Provisioning Service",
       "status": "ENABLED"
   }, {
       "type": "application",
       "name": "application_enabled_1",
       "description": "Authorizzed for actions an an operator in the Auto Provisioning Service",
       "status": "ENABLED"
   }, {
       "type": "system",
       "name": "SECURITY_ADMIN",
       "description": "Authorizzed for actions an an operator in the Auto Provisioning Service",
       "status": "ENABLED"
   }, {
       "type": "com",
       "name": "NODE_SECURITY_ADMIN",
       "description": "Authorizzed for actions an an operator in the Auto Provisioning Service",
       "status": "ENABLED"
   }];
});