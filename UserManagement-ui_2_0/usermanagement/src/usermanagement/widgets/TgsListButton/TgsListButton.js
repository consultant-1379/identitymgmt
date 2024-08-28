define([
    'jscore/core',
    'container/api',
    'uit!./TgsListButton.html',
    'usermgmtlib/Dictionary',
    "widgets/Button",
    "../ListTgsFlyoutContent/ListTgsFlyoutContent",
    "identitymgmtlib/Utils"
], function(core, apiContainer, View, Dictionary,  Button, ListTgsFlyoutContent, Utils) {

    var areTgsNoneOrAll = function(tgs) {
        return tgs.indexOf("ALL") !== -1 || tgs.indexOf("NONE") !== -1;
    };

    return core.Widget.extend({
        buttonWidget: null,
        tgsTable: null,

        view: function() {
            return new View({data: this.options, Dictionary: Dictionary});
        },

        onViewReady: function() {
            this.createButtonWidget();
            this.addEventHandler();
        },

        createFlyoutContent: function() {
            var myTgs = [];
            this.options.tgs.forEach(function(el) {
                myTgs.push({tg: el});
            });
            this.flyoutContent  = new ListTgsFlyoutContent({
                columns: [{title: Dictionary.name, attribute: "tg"}],
                data: myTgs,
                args: {username: this.options.username, rolename: this.options.rolename, nodeRole: this.options.nodeRole}
            });
        },

        createButtonWidget: function() {
            this.buttonWidget = this.view.getElement().find('.eaUsermanagement-TgsListButton-button');
            if (areTgsNoneOrAll(this.options.tgs)) {
                this.buttonWidget.setModifier('hide','', "eaUsermanagement-TgsListButton-button");
            }
        },

        addEventHandler: function(){
            var header = (this.options.header)?Utils.printf(Dictionary.targetGroupPanel[this.options.header], this.options.tgs.length):Utils.printf(Dictionary.targetGroupPanel.service, this.options.tgs.length);
            this.buttonWidget.addEventHandler('click', function() {
                this.createFlyoutContent();
                apiContainer.getEventBus().publish("flyout:show", {
                    header: header,
                    content: this.flyoutContent,
                    width: "60vw"
                });
            }.bind(this));
        }

    });
});
