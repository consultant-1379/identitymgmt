define([
    'usermgmtlib/model/RolePrivilegesCollection'
], function(RolePrivilegesCollection){
    'use strict';

    describe('RolePrivilegesCollection', function(){
        var sandbox, rolePrivilegesCollection;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            rolePrivilegesCollection = new RolePrivilegesCollection();
        });

        afterEach(function(){
            sandbox.restore();
        });

        it('RolePrivilegesCollection should be defined', function(){
            expect(RolePrivilegesCollection).not.to.be.undefined;
            expect(RolePrivilegesCollection).not.to.be.null;
        });

        describe('getAssigned()', function(){
            it('Should return array with assigned privileges', function(){
                var output = rolePrivilegesCollection.getAssigned();
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });
        
        describe('assignAllPrivileges()', function(){
            it('Should assign all privileges', function(){
                rolePrivilegesCollection.assignAllPrivileges();
            });
        });
        describe('unassignAllPrivileges()', function(){
            it('Should unassings all privileges', function(){
                rolePrivilegesCollection.unassignAllPrivileges();
            });
        });

    });
});