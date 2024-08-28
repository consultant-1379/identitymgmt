define([
    'jscore/core',
    'identitymgmtlib/filters/SelectBoxQueryRoleWidget/SelectBoxQueryRoleWidget'
], function(core, SelectBoxQueryRoleWidget) {
    'use strict';

    describe('SelectBoxQueryRoleWidget', function() {
        var selectBoxQueryRoleWidget, sandbox, viewStub, elementStub, setStyleStub;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');

            viewStub = {
                findById: function(){
                    return elementStub;
                }
            };
            setStyleStub = {
                setStyle : function() {}
            };
            var value = "MockValue";
            sandbox.spy(setStyleStub,'setStyle');
            sandbox.spy(elementStub,'addEventHandler');
            sandbox.spy(elementStub,'setValue');
            sandbox.stub(elementStub,'find', function() {return setStyleStub;});
            sandbox.stub(elementStub,'getValue', function(){return value;});
            sandbox.spy(viewStub,'findById');

            selectBoxQueryRoleWidget = new SelectBoxQueryRoleWidget();
            sandbox.stub(selectBoxQueryRoleWidget,'getElement', function(){ return elementStub});

            selectBoxQueryRoleWidget.view = viewStub;



        });

        afterEach(function() {
            sandbox.restore();
        });


        it('SelectBoxQueryRoleWidget should be defined', function() {
            expect(SelectBoxQueryRoleWidget).not.to.be.undefined;
            expect(SelectBoxQueryRoleWidget).not.to.be.null;
        });

        describe('onViewReady()', function() {
            beforeEach(function() {
                sandbox.spy(selectBoxQueryRoleWidget,'changeSelectBoxStyle');
                sandbox.spy(selectBoxQueryRoleWidget,'triggerChange');
            });
            it('Should change style selected box', function() {
                selectBoxQueryRoleWidget.onViewReady();
                expect(selectBoxQueryRoleWidget.changeSelectBoxStyle.callCount).to.equal(1);
            });

            it('Should add change event handler on select box with query role', function() {
                selectBoxQueryRoleWidget.onViewReady();
                expect(viewStub.findById.callCount).to.equal(2);
                expect(elementStub.addEventHandler.callCount).to.equal(1);
                expect(elementStub.addEventHandler.getCall(0).args[0]).to.equal('change');
            });

            it('Should call triggerChange function', function() {
                selectBoxQueryRoleWidget.onViewReady();
                expect(selectBoxQueryRoleWidget.triggerChange.callCount).to.equal(1);
            });

        });

        describe('triggerChange()', function() {
            beforeEach(function() {
                sandbox.spy(selectBoxQueryRoleWidget,'trigger');
                sandbox.spy(selectBoxQueryRoleWidget,'setTooltip');
            });

            it('Should call trigger for change value', function() {
                selectBoxQueryRoleWidget.triggerChange();
                expect(selectBoxQueryRoleWidget.trigger.callCount).to.equal(1);
                expect(selectBoxQueryRoleWidget.trigger.getCall(0).args[0]).to.equal('change');
                expect(selectBoxQueryRoleWidget.setTooltip.callCount).to.equal(1);
            });
        });

        describe('getValue()', function() {
            it('Should return value from view', function() {
                var output = selectBoxQueryRoleWidget.getValue();
                expect(output).not.to.be.null;
                expect(viewStub.findById.callCount).to.equal(1);
                expect(elementStub.getValue.callCount).to.equal(1);
            });
        });

        describe('setValue()', function() {
            beforeEach(function() {
                sandbox.spy(selectBoxQueryRoleWidget,'setTooltip');
            });
            it('Should set value to tooltip', function() {
                selectBoxQueryRoleWidget.setValue('MockValue');
                expect(selectBoxQueryRoleWidget.setTooltip.callCount).to.equal(1);
                expect(selectBoxQueryRoleWidget.setTooltip.calledWith('MockValue')).to.equal(true);
            });

            it('Should set value to view', function() {
               selectBoxQueryRoleWidget.setValue('MockValue');
               expect(viewStub.findById.callCount).to.equal(1);
               expect(elementStub.setValue.callCount).to.equal(1);
            });
        });



        describe('getSelectBoxHeader()', function() {
            it('Should return reference to button in widget', function() {
                var output = selectBoxQueryRoleWidget.getSelectBoxHeader();
                expect(output).not.to.be.null;
                expect(selectBoxQueryRoleWidget.getElement.callCount).to.equal(1);
                expect(elementStub.find.callCount).to.equal(1);
            });
        });

        describe('changeSelectBoxStyle()', function() {
            it('Should change style on selected box', function() {
                sandbox.stub(selectBoxQueryRoleWidget,'getSelectBoxHeader', function() {return elementStub;});
                selectBoxQueryRoleWidget.changeSelectBoxStyle();
                expect(selectBoxQueryRoleWidget.getElement.callCount).to.equal(1);
                expect(elementStub.find.callCount).to.equal(1);
                expect(selectBoxQueryRoleWidget.getSelectBoxHeader.callCount).to.equal(1);
            });

        });
    });
});