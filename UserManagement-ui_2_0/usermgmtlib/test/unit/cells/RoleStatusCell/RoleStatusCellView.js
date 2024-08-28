define([
    'usermgmtlib/cells/RoleStatusCell/RoleStatusCellView'
], function(RoleStatusCellView){
    'use strict';

    describe('RoleStatusCellView', function(){
        var sandbox, roleStatusCellView, getElementFindStub, getElementMock;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            roleStatusCellView = new RoleStatusCellView();

            getElementFindStub = sandbox.stub();

            getElementMock = {
                find: getElementFindStub
            };
            sandbox.stub(roleStatusCellView, 'getElement', function() {
                return getElementMock;
            });
        });
        afterEach(function(){
            sandbox.restore();
        })

        it('RoleStatusCellView should be defined', function(){
            expect(RoleStatusCellView).not.to.be.undefined;
            expect(RoleStatusCellView).not.to.be.null;
        });

        describe('getTemplate()', function(){
            it('should return defined object', function(){
                var output = roleStatusCellView.getTemplate();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getStyle()', function(){
            it('should return defined object', function(){
               var output = roleStatusCellView.getStyle();

               expect(output).not.to.be.undefined;
               expect(output).not.to.be.null;
            });
        });

        describe('getCaption()', function(){
            it('should call find method from getElement with proper parameter', function(){
                roleStatusCellView.getCaption();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal('span');
            });
        });
        
    });
});