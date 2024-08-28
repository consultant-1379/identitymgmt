define([
    'usermgmtlib/widgets/HidableDialog'
], function(HidableDialog) {
    "use strict";

    describe('HidableDialog', function() {
        var hidableDialog, options;

        it('should be defined', function() {
            expect(HidableDialog).to.be.defined;
        });

        it('should hide dialog', function() {
            options = {
                actions: [
                    {
                        caption: "OK"
                    }
                ]
            };
            hidableDialog = new HidableDialog(options);
            hidableDialog.show();

            hidableDialog.getElement().find('.ebBtn').trigger('click');

            expect(hidableDialog.isVisible()).to.be.equal(false);
        });
    });
});