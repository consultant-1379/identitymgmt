define([
    'usermanagement/regions/mainregion/MainRegionView'
], function(MainRegionView){
    'use strict';

    describe('MainRegionView', function(){
        var sandbox, mainRegionView, getElementFindStub, getElementMock;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            mainRegionView = new MainRegionView();

            getElementFindStub = sandbox.stub();

            getElementMock = {
                find: getElementFindStub
            };
            sandbox.stub(mainRegionView, 'getElement', function() {
                return getElementMock;
            });


        });

        afterEach(function(){
            sandbox.restore();
        });

        it('MainRegionView should be defined', function(){
            expect(MainRegionView).not.to.be.undefined;
            expect(MainRegionView).not.to.be.null;
        });

        describe('getTemplate()', function(){
            it('Should return defined object', function(){
                var output = mainRegionView.getTemplate();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;

            });
        });

        describe('getSummary()', function(){
            it('should call find method from getElement with proper parameter', function(){
                mainRegionView.getSummary();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal('.summary');
            });
        });

        describe('getTable()', function(){
            it('should call find method from getElement with proper parameter', function(){
                mainRegionView.getTable();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal('.table');

            });
        });
    });
});