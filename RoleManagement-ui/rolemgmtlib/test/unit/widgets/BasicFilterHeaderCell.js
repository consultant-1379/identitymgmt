define([
    'jscore/core',
	'rolemgmtlib/widgets/BasicFilterHeaderCell/BasicFilterHeaderCell'
], function (core, BasicFilterHeaderCell) {
    'use strict';

    describe('BasicFilterHeaderCell', function () {

    	var basicFilterHeaderCell, sandbox;
    	
    	it('BasicFilterHeaderCell should be defined', function () {
            expect(BasicFilterHeaderCell).not.to.be.undefined;
        });

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            
        });
        
        afterEach(function(){
            sandbox.restore();
        });

        describe('onViewReady()', function () {
            beforeEach(function(){
            	basicFilterHeaderCell = new BasicFilterHeaderCell();
            });

            it('Attributes should be set with defaults', function () {
            	basicFilterHeaderCell.onViewReady();
                expect(basicFilterHeaderCell.input.getValue()).to.equal(new core.Element("input").getValue());
            });

        });        
        
    })
})