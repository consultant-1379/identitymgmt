define([
    'jscore/core',
    "i18n!identitymgmtlib/common.json",
    'widgets/Dialog'
], function(core, Dictionary, Dialog) {

    return core.Widget.extend({

        init: function(options) {
            options = options || {};
            this.dialogWidget = new Dialog({
                header: options.header || Dictionary.access_denied,
                content: options.content || Dictionary.no_access_rights_message,
                type: options.type || 'error',
                buttons: options.buttons || [{
                    caption: Dictionary.ok,
                    action: function() {
                        // redirect to default application - to launcher
                        window.location.hash = "";
                        // this.locationControler.setLocation("");
                    }
                }]
            });
            this.show();
        },
        get: function() {
            return this.dialogWidget;
        },

        show: function() {

            //timeout due to bug in UI SDK, sometimes hide() is called inside SDK
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(function() {
                this.dialogWidget.show();
            }.bind(this), 50);
        },

        hide: function() {
            this.dialogWidget.hide();
        }
    });
});
