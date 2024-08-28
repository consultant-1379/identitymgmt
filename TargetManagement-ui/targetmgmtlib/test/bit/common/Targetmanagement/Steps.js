define([
    'jscore/core',
    'test/bit/lib/Browser',
    './Model'
], function(core, Browser, Model) {

    var goToCreateTargetGroup = function() {
        return function goToCreateTargetGroup() {
            window.location.hash = 'targetmanagement/targetgroup/create';
        };
    };

    var clickDialogDeleteButton = function() {
            Model.clickDialogDeleteButton();
    };

    return {
       goToCreateTargetGroup: goToCreateTargetGroup,
       clickDialogDeleteButton: clickDialogDeleteButton
    };

});