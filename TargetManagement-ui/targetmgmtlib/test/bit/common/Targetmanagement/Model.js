define([
    'test/bit/lib/Browser'
], function(Browser) {

    var selector = {
        button: '.ebBtn',
        dialog: '.ebDialog',
        deleteButton: '.ebBtn_color_darkBlue'
        //TODO: Filters bit tests
    };

    var clickDialogDeleteButton = function() {
        var button = Browser.getElement(selector.dialog);
        button = button.find(selector.button);
        button.trigger('click');
    }

    return {
        clickDialogDeleteButton: clickDialogDeleteButton
    };
});