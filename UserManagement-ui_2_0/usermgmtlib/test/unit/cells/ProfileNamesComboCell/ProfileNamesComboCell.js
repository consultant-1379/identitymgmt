define([
    'jscore/core',
    'usermgmtlib/cells/ProfileNamesComboCell/ProfileNamesComboCell',
    'widgets/SelectBox',
], function(core, ProfileNamesComboCell, SelectBox){
    'use strict';

    describe('ProfileNamesComboCell', function(){
        var sandbox, elementStub, getElementStub, viewStub, getTableStub;
        var profileNamesComboCell, buttonWidgetSpy;

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');

            getElementStub = {
                find: function(){ return elementStub;},
                setAttribute:function(){}
            };

            viewStub = {
                getElement: function() { return getElementStub;}
            };

            getTableStub = {
                trigger:function(){}
            };

            buttonWidgetSpy = sandbox.spy(SelectBox.prototype, 'init');

            profileNamesComboCell = new ProfileNamesComboCell();
            profileNamesComboCell.view = viewStub;


            ProfileNamesComboCell.odpWidget = SelectBox.prototype;
            sandbox.spy(ProfileNamesComboCell.odpWidget,'addEventHandler');
            sandbox.spy(ProfileNamesComboCell.odpWidget,'attachTo');

            sandbox.spy(viewStub,'getElement');
            sandbox.spy(getElementStub,'find');
            sandbox.spy(elementStub,'addEventHandler');
        });
        afterEach(function(){
            sandbox.restore();
        });

        it('ProfileNamesComboCell should be defined', function(){
            expect(ProfileNamesComboCell).not.to.be.undefined;
        });

        describe('setValue()', function(){
            var model;
            
             it('Should update combo list', function(){
                model = {name: 'MockItemName1', items: [{name: 'MockItemName1', description: 'MockItemDescription1'},
                                                        {name: 'MockItemName2', description: 'MockItemDescription2'}]};

                profileNamesComboCell.setValue(model);
                expect(viewStub.getElement.callCount).to.equal(1);
                expect(getElementStub.find.callCount).to.equal(1);
                expect(ProfileNamesComboCell.odpWidget.addEventHandler.getCall(0).args[0]).to.equal('change');
            });
        });

        describe('triggerChange()', function(){
            var model;

             it('Should update model', function(){
                model = {name: 'MockItemName1', items: [{name: 'MockItemName1', description: 'MockItemDescription1'},
                                                        {name: 'MockItemName2', description: 'MockItemDescription2'}]};
                profileNamesComboCell.setValue(model);

                profileNamesComboCell.triggerChange();
            });
        });
    });
});