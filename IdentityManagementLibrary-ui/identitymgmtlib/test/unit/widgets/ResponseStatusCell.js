define([
    'identitymgmtlib/ResponseStatusCell'
], function (ResponseStatusCell) {

    describe('ResponseStatusCell', function () {
        describe('init()', function () {
            it('ResponseStatusCell should be defined', function () {
                expect(ResponseStatusCell).not.to.be.undefined;
            });
        });

        describe('setValue() success', function () {
            it('should display success cell', function () {
                var responseStatusCell = new ResponseStatusCell();
                const model = {
                    success: true,
                    message: "Some message"
                };
                responseStatusCell.setValue(model);

                expect(responseStatusCell.view.getStatusText().getText()).to.equal(model.message);
                expect(responseStatusCell.view.getStatusIcon().hasModifier('tick')).to.equal(true);
            });
        });

        describe('setValue() error', function () {
            it('should display error cell', function () {
                var responseStatusCell = new ResponseStatusCell();
                const model = {
                    success: false,
                    message: "Some message"
                };
                responseStatusCell.setValue(model);

                expect(responseStatusCell.view.getStatusText().getText()).to.equal(model.message);
                expect(responseStatusCell.view.getStatusIcon().hasModifier('error')).to.equal(true);
            });
        });
    });

});