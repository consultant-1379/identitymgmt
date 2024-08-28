define([
    'identitymgmtlib/widgets/ConfirmationSummaryDialog',
    'identitymgmtlib/ConfirmationSummaryList',
    'identitymgmtlib/Utils',
    'i18n!identitymgmtlib/common.json',
    'widgets/Dialog',
], function(ConfirmationSummaryDialog, ConfirmationSummaryList, Utils, CommonDictionary, Dialog) {
    'use strict';

    describe("ConfirmationSummaryDialog", function() {
        var dialogOptions, sandbox, confirmationSummaryDialog;
        it('ConfirmationSummaryDialog should be defined', function() {
            expect(ConfirmationSummaryDialog).not.to.be.undefined;
        });

        describe('init', function() {
            beforeEach(function() {
                sandbox = sinon.sandbox.create();
                sandbox.stub(Dialog.prototype, 'show'); //Prevent attaching dialog during unit tests in UI mode
                sandbox.stub(ConfirmationSummaryDialog.prototype, 'hide');
                sandbox.stub(ConfirmationSummaryDialog.prototype, 'trigger');
                sandbox.stub(ConfirmationSummaryList.prototype, 'init');

                dialogOptions = {
                    elementsArray: [],
                    header: "mockDialogHeader",
                    info: "mockDialogInfo",
                    statuses: ["mock1", "mock2"],
                    actions: [{
                        caption: "MockAction1",
                        value: "mockAction1"
                    }, {
                        caption: "MockAction2",
                        value: "mockAction2"
                    }]
                };
                confirmationSummaryDialog = new ConfirmationSummaryDialog(dialogOptions);
            });
            afterEach(function() {
                sandbox.restore();
            });

            it("should set visible", function() {
                expect(confirmationSummaryDialog.options.visible).to.equal(true);
            });

            it("should set options.buttons", function() {
                expect(confirmationSummaryDialog.options.buttons[0].caption).to.equal("MockAction1");
                confirmationSummaryDialog.options.buttons[0].action();
                expect(ConfirmationSummaryDialog.prototype.hide.callCount).to.equal(1);
                expect(ConfirmationSummaryDialog.prototype.trigger.callCount).to.equal(1);
            });

            it("should set options.statuses", function() {
                expect(confirmationSummaryDialog.options.statuses[0]).to.equal("mock1");
                expect(confirmationSummaryDialog.options.statuses[1]).to.equal("mock2");
            });

            it("should set options.header", function() {
                expect(confirmationSummaryDialog.options.header).to.equal("mockDialogHeader");
            });

            it("should set options.info", function() {
                expect(confirmationSummaryDialog.options.info).to.equal("mockDialogInfo");
            });

            it("should set options.content", function() {
                expect(confirmationSummaryDialog.options.content instanceof ConfirmationSummaryList).to.equal(true);

            });
        });
    });
});