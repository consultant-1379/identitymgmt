define([
    'usermanagement/widgets/importWidgets/analysisDialog/AnalysisDialog',
    'usermanagement/Dictionary',
    'identitymgmtlib/Utils'
], function(AnalysisDialog, Dictionary, Utils) {
    "use strict";

    describe('AnalysisDialog', function() {
        var analysisDialog, options;

        it('should be defined', function() {
            expect(AnalysisDialog).to.be.defined;
        });

        it('should create dialog with three buttons', function() {
            options = {
                importId: 1,
                analysisResult: {
                    toBeCreated: 25,
                    toBeUpdated: 50
                }
            };
            analysisDialog = new AnalysisDialog(options);

            expect(analysisDialog.getButtons().length).to.be.equal(3);
            expect(analysisDialog.getButtons()[0].options.caption).to.be.equal(Utils.printf(Dictionary.importAnalysis.importAllButton, 75));
            expect(analysisDialog.getButtons()[1].options.caption).to.be.equal(Utils.printf(Dictionary.importAnalysis.importNewButton, 25));
            expect(analysisDialog.getButtons()[2].options.caption).to.be.equal(Dictionary.importAnalysis.cancelButton);
        });

        it('should create dialog with two buttons', function() {
            options = {
                importId: 1,
                analysisResult: {
                    toBeCreated: 75,
                    toBeUpdated: 0
                }
            };
            analysisDialog = new AnalysisDialog(options);

            expect(analysisDialog.getButtons().length).to.be.equal(2);
            expect(analysisDialog.getButtons()[0].options.caption).to.be.equal(Utils.printf(Dictionary.importAnalysis.importAllButton, 75));
            expect(analysisDialog.getButtons()[1].options.caption).to.be.equal(Dictionary.importAnalysis.cancelButton);
        });

        it('should create dialog with one Cancel button', function() {
            analysisDialog = new AnalysisDialog();

            expect(analysisDialog.getButtons().length).to.be.equal(1);
            expect(analysisDialog.getButtons()[0].options.caption).to.be.equal(Dictionary.importAnalysis.cancelButton);
        });
    });
});