define([
    'usermanagement/widgets/importWidgets/importProgressBar/ImportProgressBar'
], function(ImportProgressBar) {
    "use strict";

    describe('ImportProgressBar', function() {
        var sandbox, importProgressBar;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            importProgressBar = new ImportProgressBar();
            sandbox.spy(importProgressBar.view.getFill(), 'setStyle');
            sandbox.spy(importProgressBar.view.getProgressValue(), 'setText');
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('should be defined', function() {
            expect(ImportProgressBar).to.be.defined;
        });

        it('should be set correct value', function() {
            importProgressBar.setValue(5, 100);

            expect(importProgressBar.view.getFill().setStyle.getCall(0).args[1]).to.equal('5%');
            expect(importProgressBar.view.getProgressValue().setText.getCall(0).args[0]).to.equal('(5/100)');
        });
    });
});