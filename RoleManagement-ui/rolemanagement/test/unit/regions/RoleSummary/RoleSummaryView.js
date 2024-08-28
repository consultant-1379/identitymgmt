define([
    'jscore/core',
    'rolemanagement/regions/RoleSummary/RoleSummaryView'
], function(core, RoleSummaryView) {
    'use strict';

    describe('RoleSummaryView', function() {
        it('should be defined', function() {
            expect(RoleSummaryView).not.to.be.undefined;
        });

        var sandbox,roleSummaryView,getElementMock,getElementFindStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            roleSummaryView = new RoleSummaryView();

            getElementFindStub = sandbox.stub();
 
            getElementMock = {
                find: getElementFindStub 
            };
            sandbox.stub(roleSummaryView, 'getElement', function() {
                return getElementMock;
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getTemplate()', function() {
            it('should return defined object', function() {
                var output = roleSummaryView.getTemplate();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getStyle()', function() {
            it('should return defined object', function() {
                var output = roleSummaryView.getStyle();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });


        describe('getRoleNameContainer()', function() {
            it('should call find method from getElement with proper parameter', function() {
                roleSummaryView.getRoleNameContainer();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal('.eaRolemanagement-RoleSummary-Name');
            });
        });

        describe('getRoleDescriptionContainer()', function() {
            it('should call find method from getElement with proper parameter', function() {
                roleSummaryView.getRoleDescriptionContainer();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal('.eaRolemanagement-RoleSummary-Description');
            });
        });

        describe('getRoleTypeContainer()', function() {
            it('should call find method from getElement with proper parameter', function() {
                roleSummaryView.getRoleTypeContainer();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal('.eaRolemanagement-RoleSummary-Type');
            });
        });

        describe('getRoleStatusContainer()', function() {
            it('should call find method from getElement with proper parameter', function() {
                roleSummaryView.getRoleStatusContainer();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal('.eaRolemanagement-RoleSummary-Status');
            });
        });


        describe('getRoleSummaryContent()', function() {
            it('should call find method from getElement with proper parameter', function() {
                roleSummaryView.getRoleSummaryContent();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal('.eaRolemanagement-RoleSummary-Content');
            });
        });


        describe('getRoleSummaryStatusIcon()', function() {
            it('should call find method from getElement with proper parameter', function() {
                roleSummaryView.getRoleSummaryStatusIcon();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal('.eaRolemanagement-RoleSummary-StatusIcon');
            });
        });

        describe('getRolesListContainer()', function() {
            it('should call find method from getElement with proper parameter', function() {
                roleSummaryView.getRolesListContainer();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal('.eaRolemanagement-RoleSummary-RolesList');
            });
        });

        describe('getCapabilitiesContainer()', function() {
            it('should call find method from getElement with proper parameter', function() {
                roleSummaryView.getCapabilitiesContainer();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal('.eaRolemanagement-RoleSummary-Capabilities');
            });
        });

        describe('getCapabilitiesInfo()', function() {
            it('should call find method from getElement with proper parameter', function() {
                roleSummaryView.getCapabilitiesInfo();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal('.eaRolemanagement-RoleSummary-Capabilities-Info');
            });
        });

    });


});
