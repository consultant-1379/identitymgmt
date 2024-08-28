define([
    'jscore/core',
    'jscore/ext/mvp',
    'usersgroupedit/widgets/GroupEditWizard/RoleAssignTableWidget/RoleAssignTableWidget',
    'i18n!identitymgmtlib/common.json'
], function(core, mvp, RoleAssignTableWidget, IdentityDictionary){
    'use strict';

    describe('RoleAssignTableWidget', function(){
        var sandbox, roleAssignTableWidget, options, viewStub, elementStub, functionStub,findStub, modelStub;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            elementStub = new core.Element('div');
            findStub = {
                find: function(){ return elementStub;}
            };
            functionStub = {
                setContent: function(){}
            };
            modelStub = {
                    "user": "user1",
                    "privileges": new mvp.Collection([{"role":"role3","tgs":["targetGroup2"]}, {"role":"role13","tgs":["targetGroup25"]}, {"role":"role8","tgs":["targetGroup6"]}]),
                    "tgs": ["targetGroup2"]
            };

            options = {
                model: {
                    get: function(key) {return modelStub[key];},
                    fetch: function() {},
                    addEventHandler: function() {},
                    set: function(key, value) {modelStub[key] = value},

                }
            };


            viewStub ={
                getElement: function(){return elementStub;},
                findById: function() {return functionStub;}
            };


            sandbox.spy(options.model,'get');
            sandbox.spy(options.model,'fetch');
            sandbox.spy(options.model,'addEventHandler');
            sandbox.spy(options.model,'set');

            sandbox.stub(functionStub,'setContent');

            sandbox.spy(viewStub,'getElement');
            sandbox.spy(viewStub,'findById');

            roleAssignTableWidget = new RoleAssignTableWidget(options);
            roleAssignTableWidget.view = viewStub;
            sandbox.stub(elementStub,'setModifier');
            sandbox.stub(elementStub,'removeModifier');
            sandbox.stub(elementStub,'setAttribute');
            sandbox.stub(elementStub,'setText');


            sandbox.stub(findStub,'find',function(){return elementStub;});
            sandbox.stub(roleAssignTableWidget,'getElement', function(){return findStub;});

        });

        afterEach(function(){
            sandbox.restore();
        });

        it('RoleAssignTableWidget should be defined', function(){
            expect(RoleAssignTableWidget).not.to.be.undefined;
            expect(RoleAssignTableWidget).not.to.be.null;
        });


        describe('tableLinksEventHandler()', function() {
            var funStub;
            beforeEach(function() {
                funStub ={
                    addEventHandler: function(){}
                };
                sandbox.spy(funStub, 'addEventHandler');
                sandbox.stub(roleAssignTableWidget,'getSelectAllRolesLink', function(){return funStub;});
                sandbox.stub(roleAssignTableWidget,'getSelectNoneRolesLink', function(){return funStub;});
                roleAssignTableWidget.tableLinksEventHandler();
            });

            it('Should add click event handler to  select all roles link and select none roles link', function() {
                expect(roleAssignTableWidget.getSelectAllRolesLink.callCount).to.equal(1);
                expect(roleAssignTableWidget.getSelectNoneRolesLink.callCount).to.equal(1);
                expect(funStub.addEventHandler.callCount).to.equal(2);
                expect(funStub.addEventHandler.getCall(0).args[0]).to.equal('click');
                expect(funStub.addEventHandler.getCall(1).args[0]).to.equal('click');
                var output = funStub.addEventHandler.getCall(0).args[1];
                expect(output).to.be.function;
                output = funStub.addEventHandler.getCall(0).args[2];
                expect(output).to.be.function;
            });
        });

        describe('tableSearchEventHandler()', function() {
            var funStub;
            beforeEach(function() {
                funStub ={
                    addEventHandler: function(){}
                };
                sandbox.spy(funStub, 'addEventHandler');
                sandbox.stub(roleAssignTableWidget,'getSearchInput', function(){return funStub;});
                roleAssignTableWidget.tableSearchEventHandler();
            });

            it('Should add input event handler to search input', function() {
                expect(roleAssignTableWidget.getSearchInput.callCount).to.equal(1);
                expect(funStub.addEventHandler.callCount).to.equal(1);
                expect(funStub.addEventHandler.getCall(0).args[0]).to.equal('input');
                var output = funStub.addEventHandler.getCall(0).args[1];
                expect(output).to.be.function;
            });
        });

        describe('tableSortEventHandler()', function() {
            var table;
            beforeEach(function() {
                table = {
                    addEventHandler: function(){}
                };
                sandbox.spy(table,'addEventHandler');
                roleAssignTableWidget.table = table;
            });

            it('Should add sort event handler to table', function() {
                roleAssignTableWidget.tableSortEventHandler();
                expect(table.addEventHandler.callCount).to.equal(1);
                expect(table.addEventHandler.getCall(0).args[0]).to.equal('sort');

                var output =  table.addEventHandler.getCall(0).args[1];
                expect(output).to.be.function;
            });
        });

        describe('showLoader()', function() {
            it('Should set modifier show in element on view', function() {
                roleAssignTableWidget.showLoader();
                expect(roleAssignTableWidget.getElement.callCount).to.equal(1);
                expect(findStub.find.callCount).to.equal(1);
                expect(findStub.find.getCall(0).args[0]).to.equal('.eaUsersgroupedit-wRoleAssignTableWidget-loader-overlay');
            });
        });
        describe('hideLoader()', function() {
            it('Should remove modifier show in element on view', function() {
                roleAssignTableWidget.hideLoader();
                expect(roleAssignTableWidget.getElement.callCount).to.equal(1);
                expect(findStub.find.callCount).to.equal(1);
                expect(findStub.find.getCall(0).args[0]).to.equal('.eaUsersgroupedit-wRoleAssignTableWidget-loader-overlay');
            });
        });
        describe('enableSearchInput()', function() {
            it('Should remove attribute disabled in element on view', function() {
                roleAssignTableWidget.enableSearchInput();
                expect(roleAssignTableWidget.getElement.callCount).to.equal(1);
                expect(findStub.find.callCount).to.equal(1);
                expect(findStub.find.getCall(0).args[0]).to.equal('.eaUsersgroupedit-wRoleAssignTableWidget-filter-search');
            });
        });
        describe('disableSearchInput()', function() {
            it('Should set attribute disabled in element on view', function() {
                roleAssignTableWidget.disableSearchInput();
                expect(roleAssignTableWidget.getElement.callCount).to.equal(1);
                expect(findStub.find.callCount).to.equal(1);
                expect(findStub.find.getCall(0).args[0]).to.equal('.eaUsersgroupedit-wRoleAssignTableWidget-filter-search');
            });
        });
        describe('getSelectAllRolesLink()', function() {
            it('Should find and return element from view', function() {
                roleAssignTableWidget.getSelectAllRolesLink();
                expect(roleAssignTableWidget.getElement.callCount).to.equal(1);
                expect(findStub.find.callCount).to.equal(1);
                expect(findStub.find.getCall(0).args[0]).to.equal('.eaUsersgroupedit-wRoleAssignTableWidget-filter-assign-roles-link-all');
            });
        });
        describe('getSelectNoneRolesLink()', function() {
            it('Should find and return element from view', function() {
                 var output = roleAssignTableWidget.getSelectNoneRolesLink();
                 expect(output).not.to.be.null;
                 expect(output).not.to.be.undefined;
                 expect(roleAssignTableWidget.getElement.callCount).to.equal(1);
                 expect(findStub.find.callCount).to.equal(1);
                 expect(findStub.find.getCall(0).args[0]).to.equal('.eaUsersgroupedit-wRoleAssignTableWidget-filter-assign-roles-link-none');
            });
        });
        describe('getSearchInput()', function() {
            it('Should find and return element from view', function() {
                 var output = roleAssignTableWidget.getSearchInput();
                 expect(output).not.to.be.null;
                 expect(output).not.to.be.undefined;
                 expect(roleAssignTableWidget.getElement.callCount).to.equal(1);
                 expect(findStub.find.callCount).to.equal(1);
                 expect(findStub.find.getCall(0).args[0]).to.equal('.eaUsersgroupedit-wRoleAssignTableWidget-filter-search');
            });
        });
        describe('getRoleTitle()', function() {
            it('Should find and return element from view', function() {
                var output = roleAssignTableWidget.getRoleTitle();
                expect(output).not.to.be.null;
                expect(output).not.to.be.undefined;
                expect(roleAssignTableWidget.getElement.callCount).to.equal(1);
                expect(findStub.find.callCount).to.equal(1);
                expect(findStub.find.getCall(0).args[0]).to.equal('.eaUsersgroupedit-wRoleAssignTableWidget-title');
            });
        });
        describe('hideCreateRole()', function() {
            it('Should set modifier hide in element on view', function() {
                roleAssignTableWidget.hideCreateRole();
                expect(roleAssignTableWidget.getElement.callCount).to.equal(1);
                expect(findStub.find.callCount).to.equal(1);
                expect(findStub.find.getCall(0).args[0]).to.equal('.eaUsersgroupedit-wRoleAssignTableWidget-createRole');
            });
        });
        describe('showCreateRole()', function() {
            it('Should remove modifier hide in element on view', function() {
                roleAssignTableWidget.showCreateRole();
                expect(roleAssignTableWidget.getElement.callCount).to.equal(1);
                expect(findStub.find.callCount).to.equal(1);
                expect(findStub.find.getCall(0).args[0]).to.equal('.eaUsersgroupedit-wRoleAssignTableWidget-createRole');
            });
        });

        describe('updateView()', function() {
            beforeEach(function() {
                sandbox.spy(roleAssignTableWidget,'showCreateRole');
                sandbox.spy(roleAssignTableWidget,'hideCreateRole');
                sandbox.stub(roleAssignTableWidget,'getRoleTitle', function(){return elementStub});
            });

            it('Should show create role, when assign is true', function() {
                roleAssignTableWidget.updateView(true);
                expect(viewStub.findById.callCount).to.equal(1);
                expect(roleAssignTableWidget.showCreateRole.callCount).to.equal(1);
            });
            it('Should role title and info popup widget when assign is true', function() {                
                roleAssignTableWidget.updateView(true);
                expect(roleAssignTableWidget.getRoleTitle.callCount).to.equal(1);
                expect(elementStub.setText.callCount).to.equal(3);
                expect(elementStub.setText.getCall(0).args[0]).to.equal(IdentityDictionary.roleTable.title);
                expect(functionStub.setContent.callCount).to.equal(1);
                expect(functionStub.setContent.getCall(0).args[0]).to.equal(IdentityDictionary.roleTable.infoPopup);
            });
            it('Should hide create role, when assign is false', function() {
                roleAssignTableWidget.updateView(false);
                expect(roleAssignTableWidget.hideCreateRole.callCount).to.equal(1);
            });
            it('Should set proper text to filter assign role,role title and info popup widget when assign is false', function() {
                roleAssignTableWidget.updateView(false);
                expect(roleAssignTableWidget.getRoleTitle.callCount).to.equal(1);
                expect(elementStub.setText.callCount).to.equal(3);
                expect(elementStub.setText.getCall(0).args[0]).to.equal(IdentityDictionary.roleTable.titleToUnassign);
                expect(functionStub.setContent.callCount).to.equal(1);
                expect(functionStub.setContent.getCall(0).args[0]).to.equal(IdentityDictionary.roleTable.infoPopupUnassign);
            });
        });


    });
});