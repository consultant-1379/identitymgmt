define([
    'targetmanagement/ActionsManager',
    'i18n!targetmanagement/app.json'
], function (ActionsManager, Dictionary) {
    'use strict';

    describe('ActionsManager', function () {
        var sandbox, contextStub, eventBusStub;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            eventBusStub = {
                publish: sandbox.stub(),
                subscribe: sandbox.stub()
            }

            contextStub = {
                eventBus: eventBusStub
            }
        });

        it('Should be defined', function() {
            expect(ActionsManager).to.be.defined;
        });

        describe('actions properties', function() {
            beforeEach(function() {
                ActionsManager.setContext(contextStub);
            });

            it('should check create action properties', function() {
                var prop = ActionsManager.actions.create;
                expect(prop.name).to.equal(Dictionary.actions.createTargetGroup);
                expect(prop.type).to.equal('button');
                expect(prop.color).to.equal('darkBlue');
                expect(prop.action).to.be.function;
                prop.action.call(ActionsManager);
                expect(eventBusStub.publish.calledOnce).to.equal(true);
                expect(eventBusStub.publish.calledWith('actions:create')).to.equal(true);
            });

            it('should check delete action properties', function() {
                var prop = ActionsManager.actions.delete();
                expect(prop.name).to.equal(Dictionary.actions.deleteTargetGroup);
                expect(prop.type).to.equal('button');
                expect(prop.icon).to.equal('delete');
                expect(prop.action).to.be.function;
                prop.action.call(ActionsManager);
                expect(eventBusStub.publish.calledOnce).to.equal(true);
                expect(eventBusStub.publish.calledWith('actions:delete')).to.equal(true);
            });

            it('should check edit action properties', function() {
                var prop = ActionsManager.actions.edit();
                expect(prop.name).to.equal(Dictionary.actions.editTargetGroup);
                expect(prop.type).to.equal('button');
                expect(prop.icon).to.equal('edit');
                expect(prop.action).to.be.function;
                prop.action.call(ActionsManager);
                expect(eventBusStub.publish.calledOnce).to.equal(true);
                expect(eventBusStub.publish.calledWith('actions:edit')).to.equal(true);
            });

            it('should check display action properties', function() {
                var prop = ActionsManager.actions.display();
                expect(prop.name).to.equal(Dictionary.actions.viewTargetGroup);
                expect(prop.type).to.equal('button');
                expect(prop.action).to.be.function;
                prop.action.call(ActionsManager);
                expect(eventBusStub.publish.calledOnce).to.equal(true);
                expect(eventBusStub.publish.calledWith('actions:view')).to.equal(true);
            });
        });

        describe('getDefaultActions()', function() {
            it('Should return "Create" action', function() {
                expect(ActionsManager.getDefaultActions()).to.deep.equal([ActionsManager.actions.create]);
            });
        });

        describe('getContextActions()', function() {
            var separatorObject = {type: 'separator'};

            it('Should return proper actions if "checkedRows" is empty and excludeDefaults is false', function() {
                var contextActions = ActionsManager.getContextActions([], false);
                expect(contextActions[0].name).to.equal(ActionsManager.actions.create.name);
//                expect(contextActions[1].name).to.equal(ActionsManager.actions.refresh.name);
            });

            it('Should return proper actions if "checkedRows" is not empty and excludeDefaults is true', function() {
                var contextActions = ActionsManager.getContextActions([{}], true);
                expect(contextActions[0].name).to.equal(ActionsManager.actions.edit().name);
                expect(contextActions[1].name).to.equal(ActionsManager.actions.delete().name);
                expect(contextActions[2].type).to.equal(separatorObject.type);
                expect(contextActions[3].name).to.equal(ActionsManager.actions.display().name);
//                expect(contextActions[4].name).to.equal(ActionsManager.actions.refresh.name);
            });

            it('Should return proper actions if "checkedRows" is not empty, selected TG ALL and excludeDefaults is true', function() {
                var contextActions = ActionsManager.getContextActions([{name:'ALL'}], true);
                expect(contextActions[0].name).to.equal(ActionsManager.actions.delete().name);
//                expect(contextActions[1].name).to.equal(ActionsManager.actions.refresh.name);
                expect(contextActions.length).to.equal(1);
            });

            it('Should return proper actions list when checkedRows is empty and excludeDefaults is true', function() {
                expect(ActionsManager.getContextActions([], true)).to.deep.equal([]);
//                var contextActions = ActionsManager.getContextActions([], true);
//                expect(ActionsManager.getContextActions([], true).length).to.equal(1);
//                expect(contextActions[0].name).to.equal(ActionsManager.actions.refresh.name);
            });

            it('Should return proper actions list when checkedRows is not empty and excludeDefaults is false', function() {
                var contextActions = ActionsManager.getContextActions([{}], false);
                expect(contextActions[0].name).to.equal(ActionsManager.actions.edit().name);
                expect(contextActions[1].name).to.equal(ActionsManager.actions.delete().name);
                expect(contextActions[2].type).to.equal(separatorObject.type);
                expect(contextActions[3].name).to.equal(ActionsManager.actions.display().name);
//                expect(contextActions[4].name).to.equal(ActionsManager.actions.refresh.name);

            });

            it('should return proper actions list when checkedRows length is more than 1 and excludeDefaults is false', function() {
                var contextActions = ActionsManager.getContextActions([{}, {}], false);
                expect(contextActions[0].name).to.equal(ActionsManager.actions.delete().name);
//                expect(contextActions[1].name).to.equal(ActionsManager.actions.refresh.name);
            });
        });
    });
});
