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
    'identitymgmtlib/mvp/Model',
    'identitymgmtlib/Utils'
], function(Model, Utils) {

    return Model.extend({

        idAttribute: 'name',

        init: function() {

            var model = Model.prototype.init.apply(this, arguments);

            // Add tgs when first time assigned is set
            this.addEventHandler('change:assigned', function(model, value) {
                if (value && (!this.get('tgs') ))  {
                    var defaultTargetGroup = (Utils.isServiceRole(model)) ? 'ALL' : 'NONE';
                    this.set('tgs', [defaultTargetGroup]);
                }
            });

            return model;
        },

        reset: function() {
            // set colection models defaults
            this.set('assigned', undefined);
        }
    });
});
