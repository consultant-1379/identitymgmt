/*global define*/
define([
    'jscore/core',
    'widgets/Dialog',
    'i18n!identitymgmtlib/common.json'
], function(core, Dialog, i18n) {
    'use strict';

    return core.Region.extend({

        main: {
            label: '',
            contents: null
        },

        init: function() {

            this.locationControler = this.options.params.locationController;

            this.context = this.getContext();
            this.eventBus = this.getEventBus();
            this.main.contents = new Dialog({
                header: i18n.access_denied,
                content: i18n.no_access_rights_message,
                type: 'error',
                buttons: [{
                    caption: i18n.ok,
                    action: function() {
                        // redirect to default application - to launcher
                        this.locationControler.setLocation("");
                    }.bind(this)
                }]
            });
        }
    });
});