define([
    'jscore/core',
    'identitymgmtlib/widgets/List/ListView'
], function(core, ListView) {
    'use strict';

    describe('ListView', function() {
        it('should be defined', function() {
            expect(ListView).not.to.be.undefined;
        });

        var sandbox,listView;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            listView = new ListView();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getTemplate()', function() {
            it('should return defined object', function() {
                var output = listView.getTemplate();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getStyle()', function() {
            it('should return defined object', function() {
                var output = listView.getStyle();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

    });

});
