define([
    'jscore/core',
    'jscore/ext/net',
    'rolemanagement/regions/RoleSummary/RoleSummary',
    'identitymgmtlib/widgets/List',
    'widgets/Accordion',
    'rolemanagement/Dictionary',
    'identitymgmtlib/Utils'
], function(core, net, RoleSummary, List, Accordion, Dictionary, utils) {
    'use strict';

    describe('RoleSummary', function() {
        it('should be defined', function() {
            expect(RoleSummary).not.to.be.undefined;
        });

        var sandbox, roleSummary, eventBusStub, mockContext;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            eventBusStub = new core.EventBus();

            mockContext = new core.AppContext();
            mockContext.eventBus = eventBusStub;

            roleSummary = new RoleSummary({
                context: mockContext
            });

            sandbox.stub(roleSummary, 'getContext', function() {
                return mockContext;
            });

            sandbox.stub(roleSummary, 'getEventBus', function() {
                return eventBusStub;
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onViewReady()', function() {
            var initAccordionStub, addEventHandlersStub;
            beforeEach(function() {
                initAccordionStub = sandbox.stub(roleSummary, 'initAccordion');
                addEventHandlersStub = sandbox.stub(roleSummary, 'addEventHandlers');

                roleSummary.onViewReady();
            });

            it('should call initAccordion and addEventHandlers in onViewReady function', function() {
                expect(initAccordionStub.calledOnce).to.equal(true);
                expect(addEventHandlersStub.calledOnce).to.equal(true);
            });
        });

        describe('addEventHandlers()', function() {
            var subscribeStub;
            beforeEach(function() {
                subscribeStub = sandbox.stub(eventBusStub, 'subscribe');

                roleSummary.addEventHandlers();
            });

            it('should call eventBus.subscribe in addEventHandlers function', function() {
                expect(subscribeStub.calledOnce).to.equal(true);
                expect(subscribeStub.getCall(0).args[0]).to.be.equal('rolemgmt:checkedRows');
            });
        });


        describe('updateView()', function() {
            var accordionSetTitleStub, loadDetailsStub, 
                mockView,roleNameContainerSetTextStub,roleDescriptionContainerSetTextStub,
                roleTypeContainerSetTextStub,roleStatusContainerSetTextStub,
                roleSummaryContentSetModifierStub,roleSummaryContentRemoveModifierStub,
                capabilitiesContainterSetModifierStub,capabilitiesContainterRemoveModifierStub,
                rolesListContainerSetModifierStub,rolesListContainerRemoveModifierStub,
                roleSummaryStatusIconSetModifierStub,roleSummaryStatusIconRemoveModifierStub,
                roleSummarySetRolesDetailsLinkStub,roleDetailsLinkWrapperSetModifierStub,
                roleDetailsLinkWrapperRemoveModifierStub;

            beforeEach(function() {
                accordionSetTitleStub = sandbox.stub(roleSummary.accordionRoles, 'setTitle');
                loadDetailsStub = sandbox.stub(roleSummary, 'loadDetails');

                roleNameContainerSetTextStub = sandbox.stub();
                roleDescriptionContainerSetTextStub = sandbox.stub();
                roleTypeContainerSetTextStub = sandbox.stub();
                roleStatusContainerSetTextStub = sandbox.stub();
                roleSummaryContentSetModifierStub = sandbox.stub();
                roleSummaryContentRemoveModifierStub = sandbox.stub();
                capabilitiesContainterSetModifierStub = sandbox.stub();
                capabilitiesContainterRemoveModifierStub = sandbox.stub();
                rolesListContainerSetModifierStub = sandbox.stub();
                rolesListContainerRemoveModifierStub = sandbox.stub();
                roleSummaryStatusIconSetModifierStub = sandbox.stub();
                roleSummaryStatusIconRemoveModifierStub = sandbox.stub();
                roleSummarySetRolesDetailsLinkStub = sandbox.stub();
                roleDetailsLinkWrapperSetModifierStub = sandbox.stub();
                roleDetailsLinkWrapperRemoveModifierStub = sandbox.stub();

                mockView = { 
                    getRoleNameContainer: function() { 
                        return {
                            setText: roleNameContainerSetTextStub
                        }; 
                    },
                    getRoleDescriptionContainer: function() { 
                        return {
                            setText: roleDescriptionContainerSetTextStub
                        }; 
                    },
                    getRoleTypeContainer: function() { 
                        return {
                            setText: roleTypeContainerSetTextStub
                        }; 
                    },
                    getRoleStatusContainer: function() { 
                        return {
                            setText: roleStatusContainerSetTextStub
                        }; 
                    },
                    getRoleSummaryContent: function() { 
                        return {
                            setModifier: roleSummaryContentSetModifierStub,
                            removeModifier: roleSummaryContentRemoveModifierStub
                        }; 
                    },
                    getCapabilitiesContainer: function() { 
                        return {
                            setModifier: capabilitiesContainterSetModifierStub,
                            removeModifier: capabilitiesContainterRemoveModifierStub
                        }; 
                    },
                    getRolesListContainer: function() {
                        return {
                            setModifier: rolesListContainerSetModifierStub,
                            removeModifier: rolesListContainerRemoveModifierStub
                        }; 
                    },
                    getRoleSummaryStatusIcon: function() {
                        return {
                            setModifier: roleSummaryStatusIconSetModifierStub,
                            removeModifier: roleSummaryStatusIconRemoveModifierStub
                        }; 
                    },
                    getRoleDetailsLinkWrapper: function() {
                        return {
                            setModifier: roleDetailsLinkWrapperSetModifierStub,
                            removeModifier: roleDetailsLinkWrapperRemoveModifierStub
                        }; 
                    },

                    setRoleDetailLink: roleSummarySetRolesDetailsLinkStub
                };
                roleSummary.view = mockView;

            });

            it('should update view correctly in case no role is selected', function() {
                roleSummary.selectedRole = null;

                roleSummary.updateView();

                expect(roleNameContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleNameContainerSetTextStub.getCall(0).args[0]).to.equal(Dictionary.roleSummary.noRoleSelected);
                expect(roleDescriptionContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleDescriptionContainerSetTextStub.getCall(0).args[0]).to.be.empty;
                expect(roleTypeContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleTypeContainerSetTextStub.getCall(0).args[0]).to.be.empty;
                expect(roleStatusContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleStatusContainerSetTextStub.getCall(0).args[0]).to.be.empty;
                expect(roleSummaryContentSetModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryContentSetModifierStub.getCall(0).args[0]).to.be.equal('hide');
            });

            it('should update view correctly in case ENM system role is selected', function() {
                roleSummary.selectedRole = {
                    type: 'system',
                    name: 'ADMINISTRATOR',
                    description: 'ADMINISTRATOR_Description'
                }

                roleSummary.updateView();

                expect(roleNameContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleNameContainerSetTextStub.getCall(0).args[0]).to.equal('ADMINISTRATOR');
                expect(roleDescriptionContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleDescriptionContainerSetTextStub.getCall(0).args[0]).to.equal('ADMINISTRATOR_Description');
                expect(roleTypeContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleTypeContainerSetTextStub.getCall(0).args[0]).to.equal(Dictionary.roleSummary.enmSystemRole);
                expect(capabilitiesContainterSetModifierStub.calledOnce).to.equal(true);
                expect(capabilitiesContainterSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(rolesListContainerSetModifierStub.calledOnce).to.equal(true);
                expect(rolesListContainerSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummaryContentRemoveModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryContentRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
                expect(roleSummarySetRolesDetailsLinkStub.getCall(0).args[0]).to.equal("#rolemanagement/userrole/ADMINISTRATOR");
                expect(roleDetailsLinkWrapperSetModifierStub.callCount).to.equal(1);
                expect(roleDetailsLinkWrapperSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleDetailsLinkWrapperRemoveModifierStub.callCount).to.equal(0);
            });

            it('should update view correctly in case ENM application role is selected', function() {
                roleSummary.selectedRole = {
                    type: 'application',
                    name: 'FM_Operator',
                    description: 'FM_Operator_Description'
                }

                roleSummary.updateView();

                expect(roleNameContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleNameContainerSetTextStub.getCall(0).args[0]).to.equal('FM_Operator');
                expect(roleDescriptionContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleDescriptionContainerSetTextStub.getCall(0).args[0]).to.equal('FM_Operator_Description');
                expect(roleTypeContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleTypeContainerSetTextStub.getCall(0).args[0]).to.equal(Dictionary.roleSummary.enmSystemRole);
                expect(capabilitiesContainterSetModifierStub.calledOnce).to.equal(true);
                expect(capabilitiesContainterSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(rolesListContainerSetModifierStub.calledOnce).to.equal(true);
                expect(rolesListContainerSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummaryContentRemoveModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryContentRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
                expect(roleSummarySetRolesDetailsLinkStub.getCall(0).args[0]).to.equal("#rolemanagement/userrole/FM_Operator");
                expect(roleDetailsLinkWrapperSetModifierStub.callCount).to.equal(1);
                expect(roleDetailsLinkWrapperSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleDetailsLinkWrapperRemoveModifierStub.callCount).to.equal(0);
            });

            it('should update view correctly in case Custom Role is selected', function() {
                roleSummary.selectedRole = {
                    type: 'custom',
                    name: 'CustomRole1',
                    description: 'CustomRole1_Description'
                }

                roleSummary.updateView();

                expect(roleNameContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleNameContainerSetTextStub.getCall(0).args[0]).to.equal('CustomRole1');
                expect(roleDescriptionContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleDescriptionContainerSetTextStub.getCall(0).args[0]).to.equal('CustomRole1_Description');
                expect(roleTypeContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleTypeContainerSetTextStub.getCall(0).args[0]).to.equal(Dictionary.roleSummary.customRole);
                expect(capabilitiesContainterRemoveModifierStub.calledOnce).to.equal(true);
                expect(capabilitiesContainterRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(accordionSetTitleStub.calledOnce).to.equal(true);
                expect(accordionSetTitleStub.getCall(0).args[0]).to.be.equal(Dictionary.roleSummary.roles);
                expect(rolesListContainerRemoveModifierStub.calledOnce).to.equal(true);
                expect(rolesListContainerRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(loadDetailsStub.calledOnce).to.equal(true);
                expect(roleSummaryContentRemoveModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryContentRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
                expect(roleSummarySetRolesDetailsLinkStub.getCall(0).args[0]).to.equal("#rolemanagement/userrole/CustomRole1");
                expect(roleDetailsLinkWrapperSetModifierStub.callCount).to.equal(0);
                expect(roleDetailsLinkWrapperRemoveModifierStub.callCount).to.equal(1);
                expect(roleDetailsLinkWrapperRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
            });

            it('should update view correctly in case COM Role is selected', function() {
                roleSummary.selectedRole = {
                    type: 'com',
                    name: 'COMRole1',
                    description: 'COMRole1_Description'
                }

                roleSummary.updateView();

                expect(roleNameContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleNameContainerSetTextStub.getCall(0).args[0]).to.equal('COMRole1');
                expect(roleDescriptionContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleDescriptionContainerSetTextStub.getCall(0).args[0]).to.equal('COMRole1_Description');
                expect(roleTypeContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleTypeContainerSetTextStub.getCall(0).args[0]).to.equal(Dictionary.roleSummary.comRole);
                expect(capabilitiesContainterSetModifierStub.calledOnce).to.equal(true);
                expect(capabilitiesContainterSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(rolesListContainerSetModifierStub.calledOnce).to.equal(true);
                expect(rolesListContainerSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummaryContentRemoveModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryContentRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
                expect(roleSummarySetRolesDetailsLinkStub.getCall(0).args[0]).to.equal("#rolemanagement/userrole/COMRole1");
                expect(roleDetailsLinkWrapperSetModifierStub.callCount).to.equal(1);
                expect(roleDetailsLinkWrapperSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleDetailsLinkWrapperRemoveModifierStub.callCount).to.equal(0);
                expect(roleDetailsLinkWrapperSetModifierStub.callCount).to.equal(1);
                expect(roleDetailsLinkWrapperSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleDetailsLinkWrapperRemoveModifierStub.callCount).to.equal(0);
            });

            it('should update view correctly in case CPP Role is selected', function() {
                roleSummary.selectedRole = {
                    type: 'cpp',
                    name: 'CPPRole1',
                    description: 'CPPRole1_Description'
                }

                roleSummary.updateView();

                expect(roleNameContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleNameContainerSetTextStub.getCall(0).args[0]).to.equal('CPPRole1');
                expect(roleDescriptionContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleDescriptionContainerSetTextStub.getCall(0).args[0]).to.equal('CPPRole1_Description');
                expect(roleTypeContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleTypeContainerSetTextStub.getCall(0).args[0]).to.equal(Dictionary.roleSummary.cppRole);
                expect(capabilitiesContainterSetModifierStub.calledOnce).to.equal(true);
                expect(capabilitiesContainterSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(rolesListContainerSetModifierStub.calledOnce).to.equal(true);
                expect(rolesListContainerSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummaryContentRemoveModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryContentRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
                expect(roleSummarySetRolesDetailsLinkStub.getCall(0).args[0]).to.equal("#rolemanagement/userrole/CPPRole1");
                expect(roleDetailsLinkWrapperSetModifierStub.callCount).to.equal(1);
                expect(roleDetailsLinkWrapperSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleDetailsLinkWrapperRemoveModifierStub.callCount).to.equal(0);
                expect(roleDetailsLinkWrapperSetModifierStub.callCount).to.equal(1);
                expect(roleDetailsLinkWrapperSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleDetailsLinkWrapperRemoveModifierStub.callCount).to.equal(0);
            });

            it('should update view correctly in case COM Role Alias is selected', function() {
                roleSummary.selectedRole = {
                    type: 'comalias',
                    name: 'COMRoleAlias1',
                    description: 'COMRoleAlias1_Description'
                }

                roleSummary.updateView();

                expect(roleNameContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleNameContainerSetTextStub.getCall(0).args[0]).to.equal('COMRoleAlias1');
                expect(roleDescriptionContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleDescriptionContainerSetTextStub.getCall(0).args[0]).to.equal('COMRoleAlias1_Description');
                expect(roleTypeContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleTypeContainerSetTextStub.getCall(0).args[0]).to.equal(Dictionary.roleSummary.comRoleAlias);
                expect(capabilitiesContainterSetModifierStub.calledOnce).to.equal(true);
                expect(capabilitiesContainterSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(accordionSetTitleStub.calledOnce).to.equal(true);
                expect(accordionSetTitleStub.getCall(0).args[0]).to.be.equal(Dictionary.roleSummary.comRoles)
                expect(rolesListContainerRemoveModifierStub.calledOnce).to.equal(true);
                expect(rolesListContainerRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(loadDetailsStub.calledOnce).to.equal(true);
                expect(roleSummaryContentRemoveModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryContentRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
                expect(roleSummarySetRolesDetailsLinkStub.getCall(0).args[0]).to.equal("#rolemanagement/userrole/COMRoleAlias1");
                expect(roleDetailsLinkWrapperSetModifierStub.callCount).to.equal(0);
                expect(roleDetailsLinkWrapperRemoveModifierStub.callCount).to.equal(1);
                expect(roleDetailsLinkWrapperRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
            });

            it('should update view correctly in case role with unknown type is selected', function() {
                roleSummary.selectedRole = {
                    type: 'UNKNOWN',
                    name: 'Unknown1',
                    description: 'Unknown1_Description'
                }

                roleSummary.updateView();

                expect(roleNameContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleNameContainerSetTextStub.getCall(0).args[0]).to.equal('Unknown1');
                expect(roleDescriptionContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleDescriptionContainerSetTextStub.getCall(0).args[0]).to.equal('Unknown1_Description');
                expect(roleTypeContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleTypeContainerSetTextStub.getCall(0).args[0]).to.be.empty;
                expect(capabilitiesContainterSetModifierStub.calledOnce).to.equal(true);
                expect(capabilitiesContainterSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(rolesListContainerSetModifierStub.calledOnce).to.equal(true);
                expect(rolesListContainerSetModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummaryContentRemoveModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryContentRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
                expect(roleSummarySetRolesDetailsLinkStub.getCall(0).args[0]).to.equal("#rolemanagement/userrole/Unknown1");
                expect(roleDetailsLinkWrapperSetModifierStub.callCount).to.equal(0);
                expect(roleDetailsLinkWrapperRemoveModifierStub.callCount).to.equal(1);
                expect(roleDetailsLinkWrapperRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
            });


            it('should update view correctly in case role with status ENABLED is selected', function() {
                roleSummary.selectedRole = {
                    status: 'ENABLED',
                    description: 'mockDescription'
                }

                roleSummary.updateView();

                expect(roleStatusContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleStatusContainerSetTextStub.getCall(0).args[0]).to.equal(Dictionary.roleSummary.enabled);
                expect(roleSummaryStatusIconSetModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryStatusIconSetModifierStub.getCall(0).args[0]).to.equal('Green');
                expect(roleSummaryStatusIconRemoveModifierStub.calledTwice).to.equal(true);
                expect(roleSummaryStatusIconRemoveModifierStub.getCall(0).args[0]).to.equal('None');
                expect(roleSummaryStatusIconRemoveModifierStub.getCall(1).args[0]).to.equal('Red');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
            });

            it('should update view correctly in case role with status DISABLED is selected', function() {
                roleSummary.selectedRole = {
                    status: 'DISABLED',
                    description: 'mockDescription'
                }

                roleSummary.updateView();

                expect(roleStatusContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleStatusContainerSetTextStub.getCall(0).args[0]).to.equal(Dictionary.roleSummary.disabled);
                expect(roleSummaryStatusIconSetModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryStatusIconSetModifierStub.getCall(0).args[0]).to.equal('Red');
                expect(roleSummaryStatusIconRemoveModifierStub.calledTwice).to.equal(true);
                expect(roleSummaryStatusIconRemoveModifierStub.getCall(0).args[0]).to.equal('None');
                expect(roleSummaryStatusIconRemoveModifierStub.getCall(1).args[0]).to.equal('Green');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
            });


            it('should update view correctly in case role with status DISABLED_ASSIGNMENT is selected', function() {
                roleSummary.selectedRole = {
                    status: 'DISABLED_ASSIGNMENT',
                    description: 'mockDescription'
                }

                roleSummary.updateView();

                expect(roleStatusContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleStatusContainerSetTextStub.getCall(0).args[0]).to.equal(Dictionary.roleSummary.nonassignable);
                expect(roleSummaryStatusIconSetModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryStatusIconSetModifierStub.getCall(0).args[0]).to.equal('None');
                expect(roleSummaryStatusIconRemoveModifierStub.calledTwice).to.equal(true);
                expect(roleSummaryStatusIconRemoveModifierStub.getCall(0).args[0]).to.equal('Red');
                expect(roleSummaryStatusIconRemoveModifierStub.getCall(1).args[0]).to.equal('Green');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
            });


            it('should update view correctly in case role with unknown status is selected', function() {
                roleSummary.selectedRole = {
                    status: 'UNKNOWN',
                    description: 'mockDescription'
                }

                roleSummary.updateView();

                expect(roleStatusContainerSetTextStub.calledOnce).to.equal(true);
                expect(roleStatusContainerSetTextStub.getCall(0).args[0]).to.be.empty;
                expect(roleSummaryStatusIconSetModifierStub.calledOnce).to.equal(true);
                expect(roleSummaryStatusIconSetModifierStub.getCall(0).args[0]).to.equal('None');
                expect(roleSummaryStatusIconRemoveModifierStub.calledTwice).to.equal(true);
                expect(roleSummaryStatusIconRemoveModifierStub.getCall(0).args[0]).to.equal('Red');
                expect(roleSummaryStatusIconRemoveModifierStub.getCall(1).args[0]).to.equal('Green');
                expect(roleSummarySetRolesDetailsLinkStub.calledOnce).to.equal(true);
            });

        });

        describe('initAccordion()', function() {
            var accordionAttachToStub,rolesListContainerStub,mockView,accordionSpy,listSpy;

            beforeEach(function() {
                listSpy = sandbox.spy(List.prototype, 'init');

                accordionSpy = sandbox.spy(Accordion.prototype, 'init');
                accordionAttachToStub = sandbox.stub(Accordion.prototype, 'attachTo');

                rolesListContainerStub = sandbox.stub();

                mockView = { 
                    getRolesListContainer: function() {
                        return rolesListContainerStub; 
                    },
                };
                roleSummary.view = mockView;
            });

            it('should init accordion properly', function() {
                roleSummary.rolesList = null;
                roleSummary.accordionRoles = null;

                roleSummary.initAccordion();

                expect(roleSummary.rolesList).not.to.be.undefined;
                expect(roleSummary.rolesList).not.to.be.null;
                expect(roleSummary.accordionRoles).not.to.be.undefined;
                expect(roleSummary.accordionRoles).not.to.be.null;
 
                expect(listSpy.calledOnce).to.equal(true);

                expect(accordionSpy.calledOnce).to.equal(true);
                expect(accordionAttachToStub.calledOnce).to.equal(true);
                expect(accordionAttachToStub.getCall(0).args[0]).to.equal(rolesListContainerStub);
            });

        });


        describe('loadDetails()', function() {
            var accordionSetContentStub,netAjaxSpy,listSpy,rolesListMock1,rolesListMock2,mockView,
                successLoadDetailsStub,failLoadDetailsStub,capabilitiesInfoSetModifierStub,
                capabilitiesInfoRemoveModifierStub,server,headers,response;

            beforeEach(function() {
                accordionSetContentStub = sandbox.stub(roleSummary.accordionRoles, 'setContent');

                netAjaxSpy = sandbox.spy(net,'ajax'); 

                listSpy = sandbox.spy(List.prototype, 'init');
                
                successLoadDetailsStub = sandbox.stub(roleSummary, 'successLoadDetails');
                failLoadDetailsStub = sandbox.stub(roleSummary, 'failLoadDetails');

                capabilitiesInfoSetModifierStub = sandbox.stub();
                capabilitiesInfoRemoveModifierStub = sandbox.stub();
                

                mockView = { 
                    getCapabilitiesInfo: function() { 
                        return {
                            setModifier: capabilitiesInfoSetModifierStub,
                            removeModifier: capabilitiesInfoRemoveModifierStub
                        }; 
                    }
                };

                roleSummary.view = mockView;

                rolesListMock1 = { 
                    getElements: function() {
                        return []; 
                    },
                };

                rolesListMock2 = { 
                    getElements: function() {
                        return ['a','b']; 
                    },
                };


                roleSummary.selectedRole = {
                    type: 'com',
                    name: 'COMRole1',
                    description: 'COMRole1_Description'
                };

                headers = { "Content-Type": "application/json" };

                server = sandbox.useFakeServer(); 
               
                response = {
                   "type":"system",
                   "name":"ADMINISTRATOR",
                   "description":"This is the ENM ADMINISTRATOR Default Role",
                   "status":"ENABLED"
                };

            });

            it('should leave empty roles list in the view and load role details properly in case successful response is received', function() {
                server.respondWith(/\/oss\/idm\/rolemanagement\/roles/,[200, headers, JSON.stringify(response)]); 
                roleSummary.roleDetail = null;
                roleSummary.rolesList = rolesListMock1;

                roleSummary.loadDetails();

                expect(roleSummary.rolesList).to.equal(rolesListMock1); //roles list not reloaded
                expect(listSpy.callCount).to.equal(0);
                expect(accordionSetContentStub.callCount).to.equal(0);
                expect(capabilitiesInfoSetModifierStub.calledOnce).to.equal(true);
                expect(capabilitiesInfoSetModifierStub.getCall(0).args[0]).to.equal('hide');

                expect(netAjaxSpy.calledOnce).to.equal(true);
                var netAjaxRequest = netAjaxSpy.getCall(0).args[0];

                expect(netAjaxRequest.url).to.equal('/oss/idm/rolemanagement/roles/COMRole1');
                expect(netAjaxRequest.type).to.equal('GET');
                expect(netAjaxRequest.dataType).to.equal('json');
 
                server.respond(); 

                expect(successLoadDetailsStub.calledOnce).to.equal(true);
                expect(failLoadDetailsStub.callCount).to.equal(0);
                expect(roleSummary.roleDetail.type).to.equal(response.type);
                expect(roleSummary.roleDetail.name).to.equal(response.name);
                expect(roleSummary.roleDetail.description).to.equal(response.description);
                expect(roleSummary.roleDetail.status).to.equal(response.status);
            });


            it('should clear roles list in the view and clear role details in case error response is received', function() {
                server.respondWith(/\/oss\/idm\/rolemanagement\/roles/,[404, headers, JSON.stringify(response)]); 
                roleSummary.roleDetail = response; //set initial not null value
                roleSummary.rolesList = rolesListMock2;

                roleSummary.loadDetails();

                expect(roleSummary.rolesList).to.not.equal(rolesListMock2); //roles list reloaded
                expect(listSpy.callCount).to.equal(1);
                expect(accordionSetContentStub.callCount).to.equal(1);
                expect(capabilitiesInfoSetModifierStub.calledOnce).to.equal(true);
                expect(capabilitiesInfoSetModifierStub.getCall(0).args[0]).to.equal('hide');

                expect(netAjaxSpy.calledOnce).to.equal(true);
                var netAjaxRequest = netAjaxSpy.getCall(0).args[0];

                expect(netAjaxRequest.url).to.equal('/oss/idm/rolemanagement/roles/COMRole1');
                expect(netAjaxRequest.type).to.equal('GET');
                expect(netAjaxRequest.dataType).to.equal('json');
 
                server.respond(); 

                expect(failLoadDetailsStub.calledOnce).to.equal(true);
                expect(successLoadDetailsStub.callCount).to.equal(0);
                expect(roleSummary.roleDetail).to.equal.null;
            });

        });


        describe('successLoadDetails()', function() {
            var accordionSetContentStub,listSpy,mockView,
                capabilitiesInfoSetTextStub,capabilitiesInfoRemoveModifierStub;

            beforeEach(function() {
                accordionSetContentStub = sandbox.stub(roleSummary.accordionRoles, 'setContent');

                listSpy = sandbox.spy(List.prototype, 'init');

                capabilitiesInfoSetTextStub = sandbox.stub();
                capabilitiesInfoRemoveModifierStub = sandbox.stub();

                mockView = { 
                    getCapabilitiesInfo: function() { 
                        return {
                            setText: capabilitiesInfoSetTextStub,
                            removeModifier: capabilitiesInfoRemoveModifierStub
                        }; 
                    }
                };

                roleSummary.view = mockView;

                roleSummary.roleDetail = {
                   type:"custom",
                   name:"CustomRole1",
                   description:"This is Custom Role",
                   status:"ENABLED",
                   roles:[{name:'role1'},{name:'role2'},{name:'role3'}],
                   policy:{policy1:['read','write'],policy2:['read'],policy3:['write','load']}
                };
            });

            it('should update view properly after role details are successfully loaded', function() {
                roleSummary.rolesList = null;

                roleSummary.successLoadDetails();

                expect(roleSummary.rolesList).not.to.be.undefined;
                expect(roleSummary.rolesList).not.to.be.null;
                expect(listSpy.calledOnce).to.equal(true);
                expect(accordionSetContentStub.calledOnce).to.equal(true);
                expect(accordionSetContentStub.getCall(0).args[0]).to.equal(roleSummary.rolesList);
                expect(capabilitiesInfoSetTextStub.calledOnce).to.equal(true);
                expect(capabilitiesInfoSetTextStub.getCall(0).args[0]).to.equal(utils.printf(Dictionary.roleSummary.capabilitiesInfo, 5));
                expect(capabilitiesInfoRemoveModifierStub.calledOnce).to.equal(true);
                expect(capabilitiesInfoRemoveModifierStub.getCall(0).args[0]).to.equal('hide');
            });

        });


        describe('failLoadDetails()', function() {
            var capabilitiesInfoSetTextStub,capabilitiesInfoRemoveModifierStub,capabilitiesInfoSetModifierStub,
                listSpy,accordionSetContentStub,mockView;


            beforeEach(function() {
                capabilitiesInfoSetTextStub = sandbox.stub();
                capabilitiesInfoRemoveModifierStub = sandbox.stub();
                capabilitiesInfoSetModifierStub = sandbox.stub();

                mockView = { 
                    getCapabilitiesInfo: function() { 
                        return {
                            setText: capabilitiesInfoSetTextStub,
                            removeModifier: capabilitiesInfoRemoveModifierStub,
                            setModifier: capabilitiesInfoSetModifierStub
                        }; 
                    }
                };

                roleSummary.view = mockView;
                listSpy = sandbox.spy(List.prototype, 'init');
                accordionSetContentStub = sandbox.stub(roleSummary.accordionRoles, 'setContent');
            });

            it('should not update view if role details are not successfully loaded', function() {
                roleSummary.failLoadDetails();

                expect(capabilitiesInfoSetTextStub.callCount).to.equal(0);
                expect(capabilitiesInfoRemoveModifierStub.callCount).to.equal(0);
                expect(capabilitiesInfoSetModifierStub.callCount).to.equal(0);
                expect(listSpy.callCount).to.equal(0);
                expect(accordionSetContentStub.callCount).to.equal(0);
            });

        });


    });


});
