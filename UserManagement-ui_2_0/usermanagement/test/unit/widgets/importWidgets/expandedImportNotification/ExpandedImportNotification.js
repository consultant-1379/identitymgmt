define([
    'usermanagement/widgets/importWidgets/expandedImportNotification/ExpandedImportNotification',
    'webpush/main'
], function(ExpandedImportNotification, webpush) {
    "use strict";

    describe('ExpandedImportNotification', function() {
        var sandbox, expandedImportNotification, options, webpushStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            ExpandedImportNotification.onViewReady = function(){};
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('should be defined', function() {
            expect(ExpandedImportNotification).to.be.defined;
        });
    });
});