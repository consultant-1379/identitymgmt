define([
    'usermgmtlib/model/RolePrivilegesModel'
], function(RolePrivilegesModel){
    'use strict';

    describe('RolePrivilegesModel', function(){
        var sandbox, rolePrivilegesModel;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            rolePrivilegesModel = new RolePrivilegesModel();
        });

        afterEach(function(){
            sandbox.restore();
        });

        it('RolePrivilegesModel should be defined', function(){
            expect(RolePrivilegesModel).not.to.be.undefined;
            expect(RolePrivilegesModel).not.to.be.null;
        });

        describe('init()', function(){
            beforeEach(function(){
                sandbox.stub(rolePrivilegesModel,'addEventHandler');
                sandbox.spy(rolePrivilegesModel,'set');
                sandbox.spy(rolePrivilegesModel,'get');
            });

            it('Should call addEventHandler with event change', function(){
                var output = rolePrivilegesModel.init();

                expect(rolePrivilegesModel.addEventHandler.callCount).to.equal(2);
                expect(rolePrivilegesModel.addEventHandler.getCall(0).args[0]).to.equal('change');
                expect(rolePrivilegesModel.addEventHandler.getCall(1).args[0]).to.equal('change:assigned');
                expect(rolePrivilegesModel.addEventHandler.getCall(1).args[1]).to.equal.function;

                expect(output).not.to.be.null;


            });
        });

        describe('reset()', function(){
            beforeEach(function(){
                sandbox.stub(rolePrivilegesModel,'set');
            });

            it('Should reset collection models defaults', function(){
                rolePrivilegesModel.reset();

                expect(rolePrivilegesModel.set.callCount).to.equal(1);
                expect(rolePrivilegesModel.set.getCall(0).args[0]).to.equal('assigned');
                expect(rolePrivilegesModel.set.getCall(0).args[1]).to.equal(undefined);
                
            });
        });
    });
});