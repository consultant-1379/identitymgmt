define([
    'jscore/core',
	'identitymgmtlib/widgets/ErrorWidget/ErrorWidget'
], function (core, ErrorWidget) {
    'use strict';

    describe('ErrorWidget', function () {

    	var errorWidget,
    		sandbox,
    		viewStub,
    		options;

    	it('ErrorWidget should be defined', function () {
            expect(ErrorWidget).not.to.be.undefined;
        });

        beforeEach(function(){
            sandbox = sinon.sandbox.create();

            options = {
            		header: "header",
            		content: "content"
            };

            errorWidget = new ErrorWidget(options);
        });

        afterEach(function(){
            sandbox.restore();
            errorWidget.delete;
        });

        describe('init()', function () {

            it('Should initialize', function () {

            	errorWidget.init(options);
            	expect(errorWidget.options).to.equal(options);
            	expect(errorWidget.view).not.to.be.undefined;
            });
        });

        describe('onViewReady()', function () {

            it('Should set content and heared', function () {
            	viewStub = {
            			setContent : function () {},
            			setHeader : function () {}
                };

            	errorWidget.view = viewStub;

            	sandbox.spy(errorWidget.view, 'setContent');
            	sandbox.spy(errorWidget.view, 'setHeader');
            	errorWidget.onViewReady();
            	expect(errorWidget.view.setContent.callCount).to.equal(1);
            });
        });

    })
})
