define([
    'jscore/core',
    'usermgmtlib/cells/RoleNameCell/RoleNameCell',
    'widgets/InfoPopup',
], function(core, RoleNameCall,InfoPopup){
    describe('RoleNameCell', function(){
        var sandbox, roleNameCell, viewStub, getElementStub, infoPopup, elementStub, getRowStub, getDataStub, model, modelStub;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();

            roleNameCell = new RoleNameCall();

            elementStub = new core.Element();

            getElementStub = {
                setAttribute: function(){},
                find: function(){return elementStub;}
            };
            viewStub = {
                getElement: function(){return getElementStub;},

            };
            infoPopup = sandbox.spy(InfoPopup.prototype,'init');
            sandbox.spy(viewStub,'getElement');
            sandbox.spy(getElementStub,'setAttribute');
            sandbox.spy(getElementStub,'find');
            sandbox.spy(elementStub,'setText');
            sandbox.spy(elementStub,'setAttribute');
            roleNameCell.view = viewStub;
        });
        afterEach(function(){
            sandbox.restore();
        });
        it('RoleNameCell should be defined', function(){
            expect(RoleNameCall).not.to.be.undefined;
            expect(RoleNameCall).not.to.be.null;
        });

        describe('setValue()', function(){
            var modelStub, model, rowData;
            
            it('should edit link to all roles', function(){
                model = {
                    'name': 'MockName',
                    'type':'com'
                };
                modelStub = {
                    get: function(str){return model[str];},
                };
                sandbox.spy(modelStub, 'get');
                rowData = {
                    model : modelStub,
                    getData: function(){}
                }
                getRowStub = sandbox.stub(roleNameCell,'getRow', function(){return rowData});
                getDataStub = sandbox.stub(rowData,'getData', function(){return rowData});
                roleNameCell.setValue('MockName');

                expect(viewStub.getElement.callCount).to.equal(4);
                expect(getElementStub.find.callCount).to.equal(3);
                expect(elementStub.setText.callCount).to.equal(2);
                expect(elementStub.setAttribute.callCount).to.equal(1);
                expect(elementStub.setAttribute.getCall(0).args[0]).to.equal('href');
                expect(elementStub.setAttribute.getCall(0).args[1]).to.equal('#rolemanagement/userrole/edit/MockName');
            });
        });


    });
});