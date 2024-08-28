define([
    'jscore/core',
	'rolemgmtlib/widgets/ContainerWidget/ContainerWidget'
], function (core, ContainerWidget) {
    'use strict';

    describe('ContainerWidget', function () {

    	var containerWidget,
    		sandbox,
    		viewStub;

    	it('ContainerWidget should be defined', function () {
            expect(ContainerWidget).not.to.be.undefined;
        });

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            containerWidget = new ContainerWidget();
            
        	viewStub = {
        			getRoleFormWrapper : function () {},
        			getDetailsWrapper : function () {}
            	};

        	containerWidget.view = viewStub;

        	sandbox.spy(containerWidget.view, 'getRoleFormWrapper');
        	sandbox.spy(containerWidget.view, 'getDetailsWrapper');
        });

        afterEach(function(){
            sandbox.restore();
            containerWidget.delete;
        });

        describe('getRoleFormWrapper()', function () {

            it('Should return role form wrapper', function () {
            	containerWidget.getRoleFormWrapper();
            	expect(containerWidget.view.getRoleFormWrapper.callCount).to.equal(1);
            });
        });

        describe('getDetailsWrapper()', function () {

            it('Should return details wrapper', function () {
            	containerWidget.getDetailsWrapper();
            	expect(containerWidget.view.getDetailsWrapper.callCount).to.equal(1);
            });
        });   
        
    })
})