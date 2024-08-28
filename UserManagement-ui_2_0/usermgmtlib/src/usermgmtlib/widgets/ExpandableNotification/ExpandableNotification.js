define([
    'widgets/Notification'
], function(Notification) {
    'use strict';

    return Notification.extend({

        expand: function() {
            //Force the notification to fill its whole container
            this.view.getLabel().setStyle('float', 'none');
            this.getElement().find('.ebNotification-content').setStyle('display', 'block');
            this.getElement().find('.ebNotification-content').getParent().setStyle('display', 'block');

            //Add underline for links in notification
            this.view.getLabel().children().forEach(function(element) {
                element.setStyle('text-decoration', 'underline');
                element.removeAttribute('href');
            });
        },

        getLinks: function() {
            return this.view.getLabel().children();
        }
    });
});