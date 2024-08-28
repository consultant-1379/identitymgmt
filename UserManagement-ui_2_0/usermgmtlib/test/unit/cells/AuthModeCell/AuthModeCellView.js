define([
    'usermgmtlib/cells/AuthModeCell/AuthModeCellView'
], function(AuthModeCellView){
    'use strict';

    describe('AuthModeCellView', function(){
        var sandbox, authModeCellView, getElementFindStub, getElementMock;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            authModeCellView = new AuthModeCellView();

            getElementFindStub = sandbox.stub();

            getElementMock = {
                find: getElementFindStub
            };
            sandbox.stub(authModeCellView, 'getElement', function() {
                return getElementMock;
            });
        });
        afterEach(function(){
            sandbox.restore();
        })

        it('AuthModeCellView should be defined', function(){
            expect(AuthModeCellView).not.to.be.undefined;
            expect(AuthModeCellView).not.to.be.null;
        });

        describe('getTemplate()', function(){
            it('should return defined object', function(){
                var output = authModeCellView.getTemplate();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getStyle()', function(){
            it('should return defined object', function(){
               var output = authModeCellView.getStyle();

               expect(output).not.to.be.undefined;
               expect(output).not.to.be.null;
            });
        });

        describe('getCaption()', function(){
            it('should call find method from getElement with proper parameter', function(){
                authModeCellView.getCaption();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal('span');
            });
        });
    });
});