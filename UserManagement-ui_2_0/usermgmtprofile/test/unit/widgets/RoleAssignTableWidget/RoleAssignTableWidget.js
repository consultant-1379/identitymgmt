define([
    'jscore/core',
    'usermgmtprofile/widgets/RoleAssignTableWidget/RoleAssignTableWidget'
], function(core, RoleAssignTableWidget){
    'use strict';

    describe('RoleAssignTableWidget', function(){
        var sandbox, roleAssignTableWidget, options, viewStub, elementStub, functionStub;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');
            functionStub = {
                removeModifier: function(){}
            };
            options = {
                collection: [
                    {
                        "user": "user1",
                        "targetGroup": "targetGroup2",
                        "role": "role3"
                    },
                    {
                        "user": "user1",
                        "targetGroup": "targetGroup25",
                        "role": "role13"
                    },
                    {
                        "user": "user1",
                        "targetGroup": "targetGroup6",
                        "role": "role8"
                    }
                ]
            };

            viewStub ={
                getElement: function(){return elementStub;}
            };


//            roleAssignTableWidget = new RoleAssignTableWidget(options);
//            roleAssignTableWidget.rolePrivilegesCollection = options.collection;
//            sandbox.spy(roleAssignTableWidget.rolePrivilegesCollection,'addEventHandler');
        });
        afterEach(function(){
            sandbox.restore();
        });
        it('RoleAssignTableWidget should be defined', function(){
            expect(RoleAssignTableWidget).not.to.be.undefined;
        });


    });
});