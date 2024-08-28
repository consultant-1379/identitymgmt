define([
    'jscore/core',
    'rolemgmtlib/widgets/CustomRoleDetails/CustomRoleDetails',
    'i18n!rolemgmtlib/dictionary.json',
    'identitymgmtlib/RoleMgmtTable',
    'widgets/Tabs',
    'identitymgmtlib/RoleMgmtTable',
    'rolemgmtlib/model/RoleModel',
    'tablelib/plugins/Selection'
], function (core, CustomRoleDetails, Dictionary, RoleMgmtTable, Tabs, Table, RoleModel, Selection) {

    describe('CustomRoleDetails', function() {
        it('CustomRoleDetails should be defined', function() {
            expect(CustomRoleDetails).not.to.be.undefined;
        });

        var sandbox, customRoleDetails, viewStub;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            customRoleDetails = new CustomRoleDetails();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('init()', function() {
            var mockOptions, stubOnViewReady;
            beforeEach(function() {
                mockOptions = {
                    roles: "mockRoles",
                    policy: "mockPolicy"
                };
                stubOnViewReady = sandbox.stub(CustomRoleDetails.prototype, 'onViewReady');
            });

            it('should set field based on options - display action', function() {
                mockOptions.action = 'display';
                customRoleDetails = new CustomRoleDetails(mockOptions);
                expect(customRoleDetails.roles).to.equal("mockRoles");
                expect(customRoleDetails.policy).to.equal("mockPolicy");
                expect(customRoleDetails.isEditable).to.equal(false);
            });

            it('should set field based on options - no action set', function() {
                customRoleDetails = new CustomRoleDetails(mockOptions);
                expect(customRoleDetails.roles).to.equal("mockRoles");
                expect(customRoleDetails.policy).to.equal("mockPolicy");
                expect(customRoleDetails.isEditable).to.equal(true);
            });
        });

        describe('onViewReady()', function() {
            var createRolesListStub, createCapabilitiesListStub, tabsAttachToStub,
            rolesListStub, capabilitiesListStub, createTaskProfilesListStub, taskProfilesStub;
            beforeEach(function() {
                createRolesListStub = sandbox.stub(CustomRoleDetails.prototype, 'createRolesList');
                createCapabilitiesListStub = sandbox.stub(CustomRoleDetails.prototype, 'createCapabilitiesList');
                createTaskProfilesListStub = sandbox.stub(CustomRoleDetails.prototype, 'createTaskProfilesList');
                rolesListStub = { destroy: sandbox.stub() };
                capabilitiesListStub = { destroy: sandbox.stub() };
                taskProfilesStub = { destroy: sandbox.stub()};
                tabsAttachToStub = sandbox.stub(Tabs.prototype, 'attachTo');
            });

            it('should create tables, tabs and attach widget - lists does not exists', function() {
                customRoleDetails.rolesList.delete;
                customRoleDetails.capabilitiesList.delete;
                customRoleDetails.taskProfilesList.delete;
                customRoleDetails.onViewReady();
                expect(rolesListStub.destroy.callCount).to.equal(0);
                expect(capabilitiesListStub.destroy.callCount).to.equal(0);
                expect(taskProfilesStub.destroy.callCount).to.equal(0);

                expect(createCapabilitiesListStub.calledOnce).to.equal(true);
                expect(createRolesListStub.calledOnce).to.equal(true);
                expect(createTaskProfilesListStub.calledOnce).to.equal(true);

                expect(tabsAttachToStub.calledOnce).to.equal(true);
            });

            it('should create tables, tabs and attach widget - lists exists', function() {
                customRoleDetails.rolesList = rolesListStub;
                customRoleDetails.capabilitiesList = capabilitiesListStub;
                customRoleDetails.taskProfilesList = taskProfilesStub;

                customRoleDetails.onViewReady();
                expect(rolesListStub.destroy.calledOnce).to.equal(true);
                expect(capabilitiesListStub.destroy.calledOnce).to.equal(true);
                expect(taskProfilesStub.destroy.calledOnce).to.equal(true);

                expect(createCapabilitiesListStub.calledOnce).to.equal(true);
                expect(createRolesListStub.calledOnce).to.equal(true);
                expect(createTaskProfilesListStub.calledOnce).to.equal(true);

                expect(tabsAttachToStub.calledOnce).to.equal(true);
            });
        });

        describe('createRolesList()', function() {
            var tableOptions, getTableStub, addEventHandlerStub, addHandlerStub,
            preselectRolesStub, pageloadEditHandler;
            beforeEach(function() {
                customRoleDetails.isEditable = false;
                addHandlerStub = sandbox.stub();
                getTableStub = sandbox.stub(RoleMgmtTable.prototype, 'getTable').returns({
                    addEventHandler: addHandlerStub
                });
                addEventHandlerStub = sandbox.stub(RoleMgmtTable.prototype, 'addEventHandler');
                tableOptions = customRoleDetails.rolesList.options;
            });

            var commonRolesListExpects = function() {
                expect(tableOptions.title).to.equal('Roles');
                expect(tableOptions.url).to.equal('/oss/idm/rolemanagement/roles');
                expect(tableOptions.fetchErrorHeader).to.equal(Dictionary.customRoleDetails.fetch_roles_error_header);
                expect(tableOptions.fetchErrorContent).to.equal(Dictionary.customRoleDetails.fetch_roles_error_content);
                expect(tableOptions.plugins.length).to.equal(5);
                expect(tableOptions.defaultFilter).to.be.function;
                expect(tableOptions.columns[0].title).to.equal(Dictionary.customRoleDetails.roles_name);
                expect(tableOptions.columns[1].title).to.equal(Dictionary.customRoleDetails.roles_type);
                expect(tableOptions.columns[2].title).to.equal(Dictionary.customRoleDetails.roles_description);

                expect(getTableStub.calledOnce).to.equal(true);
                expect(addHandlerStub.calledOnce).to.equal(true);
                expect(addHandlerStub.getCall(0).args[0]).to.equal("rowselectend");
                expect(addEventHandlerStub.getCall(0).args[0]).to.equal("pageload");
                pageloadEditHandler = addEventHandlerStub.getCall(0).args[1];
            };

            it('should create table when action', function() {
                customRoleDetails.options.action = "create";
                customRoleDetails.createRolesList();
                commonRolesListExpects();
                expect(addEventHandlerStub.calledOnce).to.equal(true);
            });
        });

        describe('createTaskProfilesList()', function() {
            var tableOptions, getTableStub, addEventHandlerStub, addHandlerStub,
            preselectRolesStub, pageloadEditHandler;
            beforeEach(function() {
                customRoleDetails.isEditable = false;
                addHandlerStub = sandbox.stub();
                getTableStub = sandbox.stub(RoleMgmtTable.prototype, 'getTable').returns({
                    addEventHandler: addHandlerStub
                });
                addEventHandlerStub = sandbox.stub(RoleMgmtTable.prototype, 'addEventHandler');
                tableOptions = customRoleDetails.taskProfilesList.options;
            });

            var commonTaskProfilesListExpects = function() {
                expect(tableOptions.title).to.equal(Dictionary.customRoleDetails.task_profile_role_tab_title);
                expect(tableOptions.url).to.equal('/oss/idm/rolemanagement/roles');
                expect(tableOptions.fetchErrorHeader).to.equal(Dictionary.customRoleDetails.fetch_roles_error_header);
                expect(tableOptions.fetchErrorContent).to.equal(Dictionary.customRoleDetails.fetch_roles_error_content);
                expect(tableOptions.plugins.length).to.equal(5);
                expect(tableOptions.defaultFilter).to.be.function;
                expect(tableOptions.columns[0].title).to.equal(Dictionary.customRoleDetails.roles_name);
                expect(tableOptions.columns[1].title).to.equal(Dictionary.customRoleDetails.roles_type);
                expect(tableOptions.columns[2].title).to.equal(Dictionary.customRoleDetails.roles_description);

                expect(getTableStub.calledOnce).to.equal(true);
                expect(addHandlerStub.calledOnce).to.equal(true);
                expect(addHandlerStub.getCall(0).args[0]).to.equal("rowselectend");
                expect(addEventHandlerStub.getCall(0).args[0]).to.equal("pageload");
                pageloadEditHandler = addEventHandlerStub.getCall(0).args[1];
            };

            it('should create table when action', function() {
                customRoleDetails.options.action = "create";
                customRoleDetails.createTaskProfilesList();
                commonTaskProfilesListExpects();
                expect(addEventHandlerStub.calledOnce).to.equal(true);
            });
        });

        describe('createCapabilitiesList', function() {
            var tableOptions, getTableStub, addEventHandlerStub, addHandlerStub;
            beforeEach(function() {
                customRoleDetails.isEditable = false;
                addHandlerStub = sandbox.stub();
                getTableStub = sandbox.stub(RoleMgmtTable.prototype, 'getTable').returns({
                    addEventHandler: addHandlerStub
                });
                addEventHandlerStub = sandbox.stub(RoleMgmtTable.prototype, 'addEventHandler');
                tableOptions = customRoleDetails.capabilitiesList.options;
            });

            var commonCapabilitiesListExpects = function() {
                expect(tableOptions.title).to.equal('Capabilities');
                expect(tableOptions.url).to.equal('/oss/idm/rolemanagement/usecases');
                expect(tableOptions.fetchErrorHeader).to.equal(Dictionary.customRoleDetails.fetch_capabilities_error_header);
                expect(tableOptions.fetchErrorContent).to.equal(Dictionary.customRoleDetails.fetch_capabilities_error_content);
                expect(tableOptions.plugins.length).to.equal(5);
                expect(tableOptions.columns[0].title).to.equal(Dictionary.customRoleDetails.capabilities_application);
                expect(tableOptions.columns[1].title).to.equal(Dictionary.customRoleDetails.capabilities_resource);
                expect(tableOptions.columns[2].title).to.equal(Dictionary.customRoleDetails.capabilities_operation);
                expect(tableOptions.columns[3].title).to.equal(Dictionary.customRoleDetails.capabilities_description);

                expect(getTableStub.calledOnce).to.equal(true);
                expect(addHandlerStub.calledOnce).to.equal(true);
                expect(addHandlerStub.getCall(0).args[0]).to.equal("rowselectend");
            };

            it('should set table options', function() {
                customRoleDetails.options.action = 'create';
                customRoleDetails.createCapabilitiesList();
                commonCapabilitiesListExpects();
            });
        });

        describe('getRolesNames()', function() {
            var realOutput, expectedOutput;
            beforeEach(function() {
                customRoleDetails.roles = [
                    {
                        name: "mockRole1",
                        other: "someValue1"
                    },
                    {
                        name: "mockRole2",
                        other: "someValue1"
                    }
                ];
                expectedOutput = ["mockRole1", "mockRole2"];
                realOutput = customRoleDetails.getRolesNames(customRoleDetails.roles);
            });

            it('should return only roles names', function() {
                expect(realOutput).to.deep.equal(expectedOutput);
            });
        });

        describe('removeRolesNotInModel()', function() {
            var getRolesNamesStub, rolesInModel,
            mockRoles, rolesInModelNames;
            beforeEach(function() {
                mockRoles = [
                    {
                        name: "mockRole1",
                        type: "com",
                        description: "mockDesc"
                    },
                    {
                        name: "mockRole2",
                        type: "cpp",
                        description: "mockDesc"
                    },
                    {
                        name: "mockRole3",
                        type: "com",
                        description: "mockDesc"
                    }
                ];
                rolesInModel = [mockRoles[0], mockRoles[2]];
                rolesInModelNames = [mockRoles[0].name, mockRoles[2].name];
                getRolesNamesStub = sandbox.stub(CustomRoleDetails.prototype, 'getRolesNames').returns(rolesInModelNames);
                customRoleDetails.rolesList.setData(mockRoles);
                customRoleDetails.removeRolesNotInModel();
            });

            it('should filter roles and leave only these in model', function() {
                expect(customRoleDetails.rolesList.getTable().getData()).to.deep.equal(rolesInModel);
            });
        });

        describe('removeCapabilitiesNotInModel()', function() {
            var mockRows, mockPolicies, getTableDataStub, setTableDataStub, updateCounterStub;
            beforeEach(function() {
                mockRows = [
                    {
                        resource: "mockResource1",
                        action: "mockAction1"
                    },
                    {
                        resource: "mockResource2",
                        action: "mockAction2_1"
                    },
                    {
                        resource: "mockResource2",
                        action: "mockAction2_2"
                    },
                    {
                        resource: "mockResource3",
                        action: "mockAction3"
                    }
                ];
                mockPolicies = {
                    mockResource1: ["mockAction1"],
                    mockResource2: ["mockAction2_2"]
                };
                getTableDataStub = sandbox.stub().returns(mockRows);
                setTableDataStub = sandbox.stub();
                updateCounterStub = sandbox.stub();
                customRoleDetails.capabilitiesList = new RoleMgmtTable();
                customRoleDetails.capabilitiesList.setData(mockRows);
                customRoleDetails.policy = mockPolicies;
                customRoleDetails.removeCapabilitiesNotInModel();
            });

            it('should filter capabilities to leave only this in model', function() {
                expect(customRoleDetails.capabilitiesList.getTable().getData()).to.deep.equal([mockRows[0], mockRows[2]]);
            });
        });

        describe('updateRolesList()', function() {
            var mockRoles, mockRows, mockTaskProfiles, getSelectedRowsDataStub;
            beforeEach(function() {
                mockRoles = [
                    {
                        name: "mockRole1",
                        other: "someValue1"
                    }
                ];
                mockTaskProfiles = [
                    {
                        name: "mockTask1",
                        other: "someValue1"
                    },
                    {
                        name: "mockTask2",
                        other: "someValue1"
                    }
                ];
                mockRows = [
                    { getData: sandbox.stub().returns({name: "mockRole01"}) },
                    { getData: sandbox.stub().returns({name: "mockRole02"}) }
                ];

                getSelectedRowsDataStub = sandbox.stub(Table.prototype, 'getSelectedRowsData').returns(mockTaskProfiles)

                customRoleDetails.roles = mockRoles;
                customRoleDetails.model = new RoleModel();
                customRoleDetails.updateRolesList(mockRows);
            });

            it('should update roles variable with role names from rows', function() {
                expect(mockRows[0].getData.callCount).to.equal(2);
                expect(mockRows[1].getData.callCount).to.equal(2);
                expect(customRoleDetails.roles).to.deep.equal(["mockRole01", "mockRole02", "mockTask1", "mockTask2"]);
            });
        });

        describe('updateTaskProfilesList()', function() {
            var mockRoles, mockRows, mockTaskProfiles, getSelectedRowsDataStub;
            beforeEach(function() {
                mockRoles = [
                    {
                        name: "mockRole1",
                        other: "someValue1"
                    }
                ];
                mockTaskProfiles = [
                    {
                        name: "mockRole1",
                        other: "someValue1"
                    },
                    {
                        name: "mockRole2",
                        other: "someValue1"
                    }
                ];
                mockRows = [
                    { getData: sandbox.stub().returns({name: "mockTask01"}) },
                    { getData: sandbox.stub().returns({name: "mockTask02"}) }
                ];

                getSelectedRowsDataStub = sandbox.stub(Table.prototype, 'getSelectedRowsData').returns(mockTaskProfiles)

                customRoleDetails.roles = mockRoles;
                customRoleDetails.model = new RoleModel();
                customRoleDetails.updateTaskProfilesList(mockRows);
            });

            it('should update roles variable with role names from rows', function() {
                expect(mockRows[0].getData.callCount).to.equal(2);
                expect(mockRows[1].getData.callCount).to.equal(2);
                expect(customRoleDetails.roles).to.deep.equal(["mockTask01", "mockTask02", "mockRole1", "mockRole2"]);
            });
        });

        describe('updateCapabilitiesList()', function() {
            var mockPolicy, mockRows, expectedPolicy;
            beforeEach(function() {
                mockPolicy = {
                    "mockResource1": ["mockAction01"]
                };
                mockRows = [
                    { resource: "mockResource01", action: "mockAction1_1"},
                    {resource: "mockResource02", action: "mockAction2_1"},
                    {resource: "mockResource02", action: "mockAction2_2"}
                ];
                expectedPolicy = {
                    mockResource01: ["mockAction1_1"],
                    mockResource02: ["mockAction2_1", "mockAction2_2"]
                };
                customRoleDetails.policy = mockPolicy;
                sandbox.stub(customRoleDetails.capabilitiesList, 'getSelectedRowsData').returns(mockRows);
                customRoleDetails.updateCapabilitiesList();
            });

            it('should update roles variable with role names from rows', function() {
                expect(customRoleDetails.policy).to.deep.equal(expectedPolicy);
            });
        });

        describe('setItemsToSelect', function() {
            var mockRoles, mockPolicy, expectedCpp, expectedCom;
            beforeEach(function() {
                mockPolicy = {
                    resource: ["action"]
                };
                 mockRoles = [
                     {
                         name: "mockRole1",
                         type: "com",
                         description: "mockDesc"
                      },
                      {
                          name: "mockRole2",
                          type: "cpp",
                          description: "mockDesc"
                      },
                      {
                          name: "mockRole3",
                          type: "com",
                          description: "mockDesc"
                      }
                                ];
                 expectedCpp = [
                      {
                          name: "mockRole2",
                          type: "cpp",
                          description: "mockDesc"
                      }
                               ];
                 expectedCom = [
                       {
                           name: "mockRole1",
                           type: "com",
                           description: "mockDesc"
                       },
                       {
                           name: "mockRole3",
                           type: "com",
                           description: "mockDesc"
                       }
                                ];
                sandbox.stub(customRoleDetails.rolesList, 'selectRows');
                sandbox.stub(customRoleDetails.taskProfilesList, 'selectRows');
                sandbox.stub(customRoleDetails.capabilitiesList, 'selectRows');
                customRoleDetails.model = new RoleModel();
                customRoleDetails.setItemsToSelect(mockRoles, mockPolicy);
            });

            it('should set flag and call preselect functions', function() {
                expect(customRoleDetails.roles).to.equal(mockRoles);
                expect(customRoleDetails.policy).to.equal(mockPolicy);
                expect(customRoleDetails.rolesList.selectRows.callCount).to.equal(1);
                expect(customRoleDetails.capabilitiesList.selectRows.callCount).to.equal(1);
                expect(customRoleDetails.taskProfilesList.selectRows.callCount).to.equal(1);
                expect(customRoleDetails.rolesList.selectRows.getCall(0).args[0]).to.deep.equal(expectedCom);
                expect(customRoleDetails.taskProfilesList.selectRows.getCall(0).args[0]).to.deep.equal(expectedCpp);
                expect(customRoleDetails.capabilitiesList.selectRows.getCall(0).args[0]).to.deep.equal([{resource: "resource", action: "action"}]);
            });
        });
    });
});
