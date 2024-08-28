define([
    'jscore/core',
    'usersgroupedit/widgets/GroupEditWizard/stepSummary/StepSummary',
    'usermgmtlib/model/RolePrivilegesModel',
    'usermgmtlib/model/RolePrivilegesCollection',
    'usermgmtlib/DataHandler',
    'identitymgmtlib/Utils',
    'usersgroupedit/Dictionary'
], function(core, StepSummary, RolePrivilegesModel, RolePrivilegesCollection, DataHandler, Utils, Dictionary) {
    "use strict";

    describe('StepSummary', function() {
        var sandbox, stepSummary, model, modelStub, getWizardStub, elementStub, viewStub, functionStub;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');
            model = {
                finish:true,
                usersToUpdate:[{},{},{},{}],
                changedStatuses:[{},{}],
                changedDescription:[{}],
                changedRoles:[{},{},{},{},{}],
                adminToUpdate:[{},{}],
                usersToGroupEdit:[{username: 'MockUser1'},{username: 'MockUser2'},{username: 'MockUser3'},{username: 'MockUser4'}],
                usersWithNoPrivileges:[{username: 'MockUser1'}],
                privileges:{
                            getAssigned: function(){return [];}
                },
                assign:true,
                status:true,
                roles:true,
                dataHandler: new DataHandler()
            };
            modelStub = {
                get: function(key) {return model[key];},
                set: function(key,data) {model[key] = data;},
                setAttribute: function() {},
                getAttribute: function() {},
            };
            functionStub = {
                find: function(){return elementStub;}
            };
            getWizardStub = {
                resetRemainingSteps: function() {},
                setLabels: function() {},
                setStep: function() {},
                getElement: function() {
                    return functionStub;
                }
            };
            viewStub = {
                getElement: function(){
                    return functionStub;
                }
            };
            sandbox.spy(elementStub,'removeAttribute');
            sandbox.spy(elementStub,'setAttribute');
            sandbox.spy(functionStub,'find');

            sandbox.spy(modelStub,'get');
            sandbox.spy(modelStub,'set');
            sandbox.spy(modelStub,'setAttribute');
            sandbox.spy(modelStub,'getAttribute');
            sandbox.spy(viewStub,'getElement');

            stepSummary = new StepSummary(modelStub);

            sandbox.spy(getWizardStub,'resetRemainingSteps');
            sandbox.spy(getWizardStub,'setLabels');
            sandbox.spy(getWizardStub,'setStep');
            sandbox.spy(getWizardStub,'getElement');
            sandbox.stub(stepSummary,'getWizard', function(){return getWizardStub;});
            
            stepSummary.view = viewStub;

        });

        afterEach(function() {
            sandbox.restore();
        });

        it('StepSummary should be defined', function() {
            expect(StepSummary).not.to.be.undefined;
            expect(StepSummary).not.to.be.null;
        });

        describe('onViewReady()', function() {
            beforeEach(function() {
                sandbox.spy(stepSummary,'addEventHandler');
                sandbox.spy(stepSummary,'onChange');
                sandbox.spy(stepSummary,'resetModel');

                stepSummary.onViewReady();

            });

            it('Should add activate event handler on StepSummary ', function() {
                expect(stepSummary.addEventHandler.callCount).to.equal(1);
                expect(stepSummary.addEventHandler.getCall(0).args[0]).to.equal('activate');
            });

            it('When StepSummary has activated, should add labels to wizard and reset model', function(){
                var output = stepSummary.addEventHandler.getCall(0).args[1];
                output.call(stepSummary);
                expect(stepSummary.resetModel.callCount).to.equal(1);
                expect(stepSummary.getWizard.callCount).to.equal(2);
                expect(getWizardStub.setLabels.callCount).to.equal(1);
            });

            it('When StepSummary has activated, set step to wizard', function(){
                var output = stepSummary.addEventHandler.getCall(0).args[1];
                output.call(stepSummary);
                expect(stepSummary.getWizard.callCount).to.equal(2);
                expect(getWizardStub.setStep.callCount).to.equal(1);
                expect(getWizardStub.setStep.getCall(0).args[0]).to.equal(4);
            });

        });

        describe('resetModel()', function() {
            it('Should reset all attribute in model', function() {
                stepSummary.resetModel();
                expect(modelStub.set.callCount).to.equal(8);
            });
        });


        describe('onChange()', function() {
            beforeEach(function() {
               sandbox.stub(stepSummary,'setUsersToUpdate');
               sandbox.stub(stepSummary,'updateContent');
               sandbox.stub(stepSummary,'showButtons');

               stepSummary.onChange();

            });
            it('Should call setUsersToUpdate function', function() {
                expect(stepSummary.setUsersToUpdate.callCount).to.equal(1);
            });
            it('Should call updateContent function', function() {
                expect(stepSummary.updateContent.callCount).to.equal(1);
            });
            it('Should call showButtons function', function() {
                expect(stepSummary.showButtons.callCount).to.equal(1);
            });
            it('Should call resetRemainingSteps function', function() {
                expect(stepSummary.getWizard.callCount).to.equal(1);
                expect(getWizardStub.resetRemainingSteps.callCount).to.equal(1);
            });

        });

        describe('getSummaryElementsArray()', function() {

            it('Should create information about how many users will be updated', function() {
                 var output = stepSummary.getSummaryElementsArray();
                 expect(output[0]).to.deep.equal({message: Dictionary.summaryStep.usersUpdatedMsg, value: 4});
            });

            it('should create information about updated users status to enabled', function(){
                var output = stepSummary.getSummaryElementsArray();
                expect(output[1]).to.deep.equal({message: Dictionary.summaryStep.statusUpdatedMsgEnabled});
            });

            it('should create information about updated users status to disabled', function(){
                stepSummary.model.set('status', false);
                var output = stepSummary.getSummaryElementsArray();
                expect(output[1]).to.deep.equal({message: Dictionary.summaryStep.statusUpdatedMsgDisabled});

            });

            it('should create information about updated users description', function(){
                stepSummary.model.set('description', "Mock Change Description");
                var output = stepSummary.getSummaryElementsArray();
                expect(output[2]).to.deep.equal({message: Utils.printf(Dictionary.summaryStep.descriptionUpdatedMsg, "Mock Change Description")});
            });

            it('should create information about updated users assigned role', function(){
                var output = stepSummary.getSummaryElementsArray();
                expect(output[3]).to.deep.equal({message: Dictionary.summaryStep.assignedUpdatedMsgAssigned, value: 5});
            });

            it('should create information about updated security admin status', function(){
                var output = stepSummary.getSummaryElementsArray();
                expect(output[4]).to.deep.equal({message: Dictionary.summaryStep.adminUpdatedMsg, value: 2, icon: 'warningOrange'});
            });

            it('should create information about for which user cannot unassign all roles', function(){
                var output = stepSummary.getSummaryElementsArray();
                expect(output[5]).to.deep.equal({message: Dictionary.summaryStep.cannotUnassignAllRoles, value: 'MockUser1', icon: 'warningOrange'});
            });

            it('should create information about no user updated', function(){
                stepSummary.model.set('usersToUpdate', {});
                var output = stepSummary.getSummaryElementsArray();
                expect(output[5]).to.deep.equal({message: Dictionary.summaryStep.noUserUpdated, icon: 'warningOrange'});
            });

            it('should create information about no roles was selected to assign/unassign to users', function(){
                var output = stepSummary.getSummaryElementsArray();
                expect(output[6]).to.deep.equal({message: Dictionary.summaryStep.noRolesSelected, icon: 'warningOrange'});
            });

        });

        describe('setSummaryMessages()', function() {
            it('Should call clearSummaryElementWidgets and setMainMessage functions', function(){
                sandbox.stub(stepSummary,'clearSummaryElementWidgets');
                sandbox.stub(stepSummary,'setMainMessage');
                sandbox.stub(stepSummary,'getSummaryElementsArray');
                stepSummary.setSummaryMessages();
                expect(stepSummary.clearSummaryElementWidgets.callCount).to.equal(1);
                expect(stepSummary.setMainMessage.callCount).to.equal(1);
            });
        });

        describe('updateContent()', function() {
            it('Should call showContentHideLoader and setSummaryMessages functions', function() {
                sandbox.stub(stepSummary,'showContentHideLoader');
                sandbox.stub(stepSummary,'setSummaryMessages');
                stepSummary.updateContent();
                expect(stepSummary.showContentHideLoader.callCount).to.equal(1);
                expect(stepSummary.setSummaryMessages.callCount).to.equal(1);
            });
        });


        describe('isValid()', function() {
            it('Should return value of valid', function() {
                var output = stepSummary.isValid();
                expect(output).not.to.be.null;
            })
        });

        describe('setUserByRoles()', function() {
            beforeEach(function() {
               sandbox.stub(stepSummary,'setUsersEditedRoles');
               sandbox.stub(stepSummary,'checkUserContainsRole', function(){return true});

            });


            it('Should add a new Role and Target', function() {
                var privilegesToAssign = new RolePrivilegesModel( {  
                                                "assigned": true,
                                                "name": "role2",
                                                "tgs": ["TG1"]
                });

                var privileges = new RolePrivilegesCollection(privilegesToAssign);

                modelStub.set("assign", true);
                modelStub.set("privileges", privileges);

                var actualData = {  username: "userToTest",
                                    privileges: [{  role: "role1",
                                                    targetGroup: "TG1" 
                                                }] 
                                }
                stepSummary.setUserByRoles(actualData);
                expect( modelStub.get('usersToUpdate')[actualData.username].privileges.length).to.equal(1);
            });

            it('Should update taget of a Role from manually to ALL', function() {
                var privilegesToAssign = new RolePrivilegesModel( {  
                                                "assigned": true,
                                                "name": "role2",
                                                "tgs": ["ALL"]
                });
                privilegesToAssign.set("tgsChanged", true);
                var privileges = new RolePrivilegesCollection(privilegesToAssign);

                modelStub.set("assign", true);
                modelStub.set("privileges", privileges);
                modelStub.set("usersToUpdate", {});

                var actualData = {  username: "userToTest",
                                    privileges: [{  role: "role2",
                                                    targetGroup: "TG1" 
                                                }] 
                                }
                stepSummary.setUserByRoles(actualData);
                expect( modelStub.get('usersToUpdate')[actualData.username].privileges.length).to.equal(1);
                expect( modelStub.get('usersToUpdate')[actualData.username].privileges[0].targetGroup).to.deep.equal(['ALL']);

            });
        });



        describe('setUsersToUpdate()', function() {
            beforeEach(function(){
                sandbox.stub(stepSummary,'parseUsersToUpdate');
                sandbox.spy(stepSummary,'revalidate');
            });

            it('Should update status of step summary widget to enabled', function(){
                stepSummary.setUsersToUpdate();
                expect(stepSummary.status).to.equal('enabled');
            });

            it('Should update status of step summary widget to disabled', function() {
                model['status'] = false;
                stepSummary.setUsersToUpdate();
                expect(stepSummary.status).to.equal('disabled');
            });

            it('Should parse users to update', function() {
                stepSummary.setUsersToUpdate();
                expect(stepSummary.parseUsersToUpdate.callCount).to.equal(4);
            });

        });

        describe('showContentHideLoader()', function() {
            beforeEach(function() {
                stepSummary.showContentHideLoader();
            });
            it('Should find loader and hide it', function() {
                expect(viewStub.getElement.callCount).to.equal(2);
                expect(functionStub.find.callCount).to.equal(2);
                expect(elementStub.setAttribute.callCount).to.equal(2);
                expect(elementStub.setAttribute.getCall(0).args[0]).to.equal('style');
                expect(elementStub.setAttribute.getCall(0).args[1]).to.equal('display: none;');
            });
            it('Should find content and display it', function() {
                expect(viewStub.getElement.callCount).to.equal(2);
                expect(functionStub.find.callCount).to.equal(2);
                expect(elementStub.setAttribute.callCount).to.equal(2);
                expect(elementStub.setAttribute.getCall(1).args[0]).to.equal('style');
                expect(elementStub.setAttribute.getCall(1).args[1]).to.equal('display: block;');
            })
        });

        describe('getElStepSummaryList()', function() {
            it('Should find and return step summary list form view', function() {
                sandbox.stub(stepSummary,'getElement', function() {return functionStub;});
                var output = stepSummary.getElStepSummaryList();
                expect(output).not.to.be.null;
                expect(stepSummary.getElement.callCount).to.equal(1);
                expect(functionStub.find.callCount).to.equal(1);
            });
        });

        describe('showButtons()', function() {
            it('Should remove attribute style form proper element in view', function() {
                stepSummary.showButtons();
                expect(stepSummary.getWizard.callCount).to.equal(2);
                expect(getWizardStub.getElement.callCount).to.equal(2);
                expect(functionStub.find.callCount).to.equal(2);
                expect(elementStub.removeAttribute.callCount).to.equal(2);
            });
        });

    });
});

