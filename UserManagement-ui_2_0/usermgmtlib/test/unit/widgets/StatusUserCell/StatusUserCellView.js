define([
    'usermgmtlib/widgets/StatusUserCell/StatusUserCellView'
], function(StatusUserCellView){
    'use strict';

    describe('StatusUserCellView', function(){
        var sandbox, statusUserCellView, getElementFindStub, getElementMock;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            statusUserCellView = new StatusUserCellView();

            getElementFindStub = sandbox.stub();

            getElementMock = {
                find: getElementFindStub
            };
            sandbox.stub(statusUserCellView, 'getElement', function() {
                return getElementMock;
            });
        });
        afterEach(function(){
            sandbox.restore();
        })

        it('StatusUserCellView should be defined', function(){
            expect(StatusUserCellView).not.to.be.undefined;
            expect(StatusUserCellView).not.to.be.null;
        });

        describe('getTemplate()', function(){
            it('should return defined object', function(){
                var output = statusUserCellView.getTemplate();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getStyle()', function(){
            it('should return defined object', function(){
               var output = statusUserCellView.getTemplate();

               expect(output).not.to.be.undefined;
               expect(output).not.to.be.null;
            });
        });

        describe('getCaption()', function(){
            it('should call find method from getElement with proper parameter', function(){
                statusUserCellView.getCaption();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal('span');
            });
        });

        describe('getIcon()', function(){
            it('should call find method from getElement with proper parameter', function(){
                statusUserCellView.getIcon();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal('i');
            });
        });
    });
});