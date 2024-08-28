define([
    'identitymgmtlib/ConfirmationStatusCell',
], function(ConfirmationStatusCell){
    'use strict';

    describe("ConfirmationStatusCell", function(){
        it('ConfirmationStatusCell should be defined', function(){
            expect(ConfirmationStatusCell).not.to.be.undefined;
        });

        describe("setValue()", function(){
            var confirmationStatusCell = new ConfirmationStatusCell();
            it("should display message", function(){
                var message = "mockMessage";
                confirmationStatusCell.setValue(message);
                expect(confirmationStatusCell.view.getStatusText().getText()).to.equal(message);
            });
        });
    });
});