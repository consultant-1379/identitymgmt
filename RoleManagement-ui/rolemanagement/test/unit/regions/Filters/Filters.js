/*******************************************************************************
  * COPYRIGHT Ericsson 2016
  *
  * The copyright to the computer program(s) herein is the property of
  * Ericsson Inc. The programs may be used and/or copied only with written
  * permission from Ericsson Inc. or in accordance with the terms and
  * conditions stipulated in the agreement/contract under which the
  * program(s) have been supplied.
*******************************************************************************/

define([
    'jscore/core',
    'rolemanagement/regions/Filters/Filters',
    'identitymgmtlib/widgets/CheckList',
    'widgets/Accordion',
    'rolemanagement/Dictionary'
], function(core, Filters, CheckList, Accordion, Dictionary) {
    'use strict';

    describe('Filters', function() {
        it('should be defined', function() {
            expect(Filters).not.to.be.undefined;
        });

        var sandbox, filters, eventBusStub, mockContext;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            filters = new Filters();

            eventBusStub = new core.EventBus();

            mockContext = new core.AppContext();
            mockContext.eventBus = eventBusStub;

            sandbox.stub(filters, 'getContext', function() {
                return mockContext;
            });

            sandbox.stub(filters, 'getEventBus', function() {
                return eventBusStub;
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('internationalize', function() {
            it('it should internationalize filter type', function () {
                expect(filters.roleTypesChecklist.elements[4].title).to.equal(Dictionary.typeCell.RoleTypeCpp);
            });
        });


        describe('setFilterValue', function() {
            it('it should add value to filter form', function () {
                filters.setFilterValues({name:"testRoleName", type:["com","custom"], status:["ENABLED"]});
                expect(filters.getFilterCriteria().name).to.equal("testRoleName");
                expect(filters.getFilterCriteria().type[1]).to.equal("custom");
                expect(filters.getFilterCriteria().status[0]).to.equal("ENABLED");
            });
        });

        describe('setListOfRoles()', function() {
            var accordionAttachToStub, checklistSpy, accordionSpy;
            beforeEach(function() {
                accordionAttachToStub = sandbox.stub(Accordion.prototype, 'attachTo');
                checklistSpy = sandbox.spy(CheckList.prototype, 'init');
                accordionSpy = sandbox.spy(Accordion.prototype, 'init');

                filters.setListOfRoles();
            });

            it('should create two checklists', function() {
                expect(checklistSpy.calledTwice).to.equal(true);
                expect(filters.roleStatusChecklist instanceof CheckList).to.equal(true);
                expect(filters.roleTypesChecklist instanceof CheckList).to.equal(true);
            });

            it('should create two accordions', function() {
                expect(accordionSpy.calledTwice).to.equal(true);
                expect(accordionAttachToStub.calledTwice);
                expect(accordionAttachToStub.getCall(0).args[0]).to.be.equal(filters.view.getRoleStatusListContainer());
                expect(accordionAttachToStub.getCall(1).args[0]).to.be.equal(filters.view.getRoleTypeListContainer());
            });
        });

        describe('addEventHandlers()', function() {
            var subscribeStub, handleClickApplyStub, handleClickClearStub, handleApplyingFiltersOnEnterStub;
            beforeEach(function() {
                subscribeStub = sandbox.stub(eventBusStub, 'subscribe');
                handleClickApplyStub = sandbox.stub(filters, 'handleClickApplyFilter');
                handleClickClearStub = sandbox.stub(filters, 'handleClickClearFilter');
                handleApplyingFiltersOnEnterStub = sandbox.stub(filters, 'handleApplyingFiltersOnEnter');

                filters.addEventHandlers();
            });

            it('should subscribe to event and handle clicks', function() {
                expect(subscribeStub.calledOnce).to.equal(true);
                expect(subscribeStub.getCall(0).args[0]).to.equal('filters:updatevalues');
                expect(handleClickApplyStub.calledOnce).to.equal(true);
                expect(handleClickClearStub.calledOnce).to.equal(true);
                expect(handleApplyingFiltersOnEnterStub.calledOnce).to.equal(true);
            });
        });

        describe('handleClickApplyFilter()', function() {
            var publishStub, getFilterCriteriaStub, mockView, addEventHandlerStub, mockCriteria;
            beforeEach(function() {
                mockCriteria = "mockCriteria";
                getFilterCriteriaStub = sandbox.stub(filters, 'getFilterCriteria');
                getFilterCriteriaStub.returns(mockCriteria);
                publishStub = sandbox.stub(eventBusStub, 'publish');
                addEventHandlerStub = sandbox.stub();
                mockView = {
                    getFilterApplyButtonContainer: function() {
                        return {
                            addEventHandler: addEventHandlerStub
                        };
                    }
                };
                filters.view = mockView;

                filters.handleClickApplyFilter();
            });

            it('should add event handler', function() {
                expect(addEventHandlerStub.calledOnce).to.equal(true);
                expect(addEventHandlerStub.getCall(0).args[0]).to.equal('click');
            });

            it('should publish event on handler trigger', function() {
                var callback = addEventHandlerStub.getCall(0).args[1];
                expect(callback).to.be.function;
                callback.call(filters);
                expect(getFilterCriteriaStub.calledOnce).to.equal(true);
                expect(publishStub.calledOnce).to.equal(true);
                expect(publishStub.getCall(0).args[0]).to.equal("mainregion:filter");
                expect(publishStub.getCall(0).args[1]).to.equal(mockCriteria);
            });
        });

        describe('handleApplyingFiltersOnEnter()', function() {
            var publishStub, getFilterCriteriaStub, mockView, addEventHandlerStub, mockCriteria;
            beforeEach(function() {
                mockCriteria = "mockCriteria";
                getFilterCriteriaStub = sandbox.stub(filters, 'getFilterCriteria');
                getFilterCriteriaStub.returns(mockCriteria);
                publishStub = sandbox.stub(eventBusStub, 'publish');
                addEventHandlerStub = sandbox.stub();
                mockView = {
                    getFilterSearchInput: function() {
                        return {
                            addEventHandler: addEventHandlerStub
                        };
                    }
                };
                filters.view = mockView;

                filters.handleApplyingFiltersOnEnter();
            });

            it('should add event handler', function() {
                expect(addEventHandlerStub.calledOnce).to.equal(true);
                expect(addEventHandlerStub.getCall(0).args[0]).to.equal('keydown');
            });

            it('should publish event on handler trigger', function() {
                var callback = addEventHandlerStub.getCall(0).args[1];
                expect(callback).to.be.function;
                var fakeEvent = {
                    originalEvent: {
                        code: 'Enter'
                    }
                };
                callback.call(filters, fakeEvent);
                expect(getFilterCriteriaStub.calledOnce).to.equal(true);
                expect(publishStub.calledOnce).to.equal(true);
                expect(publishStub.getCall(0).args[0]).to.equal("mainregion:filter");
                expect(publishStub.getCall(0).args[1]).to.equal(mockCriteria);
            });
        });

        describe('handleClickClearFilter()', function() {
            var publishStub, addEventHandlerStub, mockView, addEventHandlerStub;
            var clearRoleNameStub, roleStatusChecklistClearStub, roleTypesChecklistClearStub;
            beforeEach(function() {
                publishStub = sandbox.stub(eventBusStub, 'publish');
                addEventHandlerStub = sandbox.stub();

                mockView = {
                    getFilterClearButtonContainer: function() {
                        return {
                            addEventHandler: addEventHandlerStub
                        };
                    }
                };
                filters.view = mockView;

                roleStatusChecklistClearStub = sandbox.stub();
                roleTypesChecklistClearStub = sandbox.stub();
                clearRoleNameStub = sandbox.stub(filters, 'clearRoleName');

                filters.roleStatusChecklist = { clearElements: roleStatusChecklistClearStub };
                filters.roleTypesChecklist = { clearElements: roleTypesChecklistClearStub };

                filters.handleClickClearFilter();
            });

            it('should add event handler', function() {
                expect(addEventHandlerStub.calledOnce).to.equal(true);
                expect(addEventHandlerStub.getCall(0).args[0]).to.equal('click');
            });

            it('should clear filter elements and publish events', function() {
                var callback = addEventHandlerStub.getCall(0).args[1];
                expect(callback).to.be.function;
                callback.call(filters);
                expect(clearRoleNameStub.calledOnce).to.equal(true);
                expect(roleStatusChecklistClearStub.calledOnce).to.equal(true);
                expect(roleTypesChecklistClearStub.calledOnce).to.equal(true);
                expect(publishStub.calledOnce).to.equal(true);
                expect(publishStub.getCall(0).args[0]).to.equal('mainregion:resetfilter');
            });
        });

        describe('clearRoleName()', function() {
            var mockView, setValueStub;
            beforeEach(function() {
                setValueStub = sandbox.stub();
                mockView = {
                    getFilterSearchInput: function() {
                        return {
                            setValue: setValueStub
                        };
                    }
                };
                filters.view = mockView;
                filters.clearRoleName();
            });

            it('should set empty string to filter search input element', function() {
                expect(setValueStub.calledOnce).to.equal(true);
                expect(setValueStub.getCall(0).args[0]).to.equal('');
            });
        });

        describe('getFilterCriteria()', function() {
            var mockView, roleStatusChecklistCheckedStub, mockSelectedTypes;
            var roleTypesChecklistCheckedStub, getValueStub, mockSelectedStatuses;
            beforeEach(function() {
                mockSelectedTypes = ["com", "system"];
                mockSelectedStatuses = ["ENABLED"];
                getValueStub = sandbox.stub();
                mockView = {
                    getFilterSearchInput: function() {
                        return {
                            getValue: getValueStub
                        };
                    }
                };
                filters.view = mockView;

                roleStatusChecklistCheckedStub = sandbox.stub();
                roleTypesChecklistCheckedStub = sandbox.stub();

                filters.roleStatusChecklist = { getCheckedElements: roleStatusChecklistCheckedStub };
                filters.roleTypesChecklist = { getCheckedElements: roleTypesChecklistCheckedStub };
            });

            function commonExpects() {
                expect(getValueStub.calledOnce).to.equal(true);
                expect(roleStatusChecklistCheckedStub.calledOnce).to.equal(true);
                expect(roleStatusChecklistCheckedStub.getCall(0).args[0]).to.equal('value');
                expect(roleTypesChecklistCheckedStub.calledOnce).to.equal(true);
                expect(roleTypesChecklistCheckedStub.getCall(0).args[0]).to.equal('value');
            };

            it('should return filter when filtering only by role name', function() {
                getValueStub.returns("mockName");
                roleStatusChecklistCheckedStub.returns([]);
                roleTypesChecklistCheckedStub.returns([]);

                var result = filters.getFilterCriteria();

                commonExpects();

                expect(result.name).to.equal('mockName');
                expect(result.status).to.be.undefined;
                expect(result.type).to.be.undefined;
            });

            it('should return filter when filtering by type = [com, system]', function() {
                getValueStub.returns("");
                roleStatusChecklistCheckedStub.returns([]);
                roleTypesChecklistCheckedStub.returns(mockSelectedTypes);

                var result = filters.getFilterCriteria();

                commonExpects();

                expect(result.name).to.be.undefined;
                mockSelectedTypes.push('application');
                expect(result.status).to.be.undefined;
                expect(result.type).to.deep.equal(mockSelectedTypes);
            });

            it('should return filter when filtering by status = [ENABLED]', function() {
                getValueStub.returns("");
                roleStatusChecklistCheckedStub.returns(mockSelectedStatuses);
                roleTypesChecklistCheckedStub.returns([]);

                var result = filters.getFilterCriteria();

                commonExpects();

                expect(result.name).to.be.undefined;
                expect(result.status).to.deep.equal(mockSelectedStatuses);
                expect(result.type).to.be.undefined;
            });

            it('should return filter when filtering by all fields', function() {
                getValueStub.returns("mockName");
                roleStatusChecklistCheckedStub.returns(mockSelectedStatuses);
                roleTypesChecklistCheckedStub.returns(["comalias"]);

                var result = filters.getFilterCriteria();

                commonExpects();

                expect(result.name).to.equal('mockName');
                expect(result.status).to.deep.equal(mockSelectedStatuses);
                expect(result.type).to.deep.equal(["comalias"]);
            });
        });
    });


});
