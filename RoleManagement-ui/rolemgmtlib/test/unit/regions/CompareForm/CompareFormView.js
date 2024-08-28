define([
    'jscore/core',
    'rolemgmtlib/regions/CompareForm/CompareFormView'
], function(core, CompareFormView) {
    'use strict';

    describe('CompareFormView', function() {
        it('should be defined', function() {
            expect(CompareFormView).not.to.be.undefined;
        });

        var sandbox, compareFormView, getElementMock, getElementFindStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            compareFormView = new CompareFormView();


        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getTemplate()', function() {
            it('should return defined object', function() {
                var output = compareFormView.getTemplate();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getStyle()', function() {
            it('should return defined object', function() {
                var output = compareFormView.getStyle();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });


        describe('getRoleNameElement()', function() {
            it('should call find method from getElement with proper parameter', function() {

                var className = '.eaRolemgmtlib-roleCompare-roleName1';

                getElementFindStub = sandbox.stub().returns(className);

                getElementMock = {
                    find: getElementFindStub
                };

                sandbox.stub(compareFormView, 'getElement', function() {
                    return getElementMock;
                });

                sandbox.spy(compareFormView, 'getRoleNameElement');

                expect(getElementFindStub.callCount).to.equal(0);
                expect(compareFormView.getRoleNameElement(1)).to.equal(className);
                expect(getElementFindStub.callCount).to.equal(1);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal(className);
            });
        });

        describe('getStatusFormElement()', function() {
            it('should call find method from getElement with proper parameter', function() {

                var className = '.eaRolemgmtlib-roleCompare-table-status1';

                getElementFindStub = sandbox.stub().returns(className);

                getElementMock = {
                    find: getElementFindStub
                };

                sandbox.stub(compareFormView, 'getElement', function() {
                    return getElementMock;
                });

                sandbox.spy(compareFormView, 'getStatusFormElement');

                expect(getElementFindStub.callCount).to.equal(0);
                expect(compareFormView.getStatusFormElement(1)).to.equal(className);
                expect(getElementFindStub.callCount).to.equal(1);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal(className);
            });
        });

        describe('getDescriptionFormElement()', function() {
            it('should call find method from getElement with proper parameter', function() {
                var className = '.eaRolemgmtlib-roleCompare-table-description1';

                getElementFindStub = sandbox.stub().returns(className);

                getElementMock = {
                    find: getElementFindStub
                };

                sandbox.stub(compareFormView, 'getElement', function() {
                    return getElementMock;
                });

                sandbox.spy(compareFormView, 'getDescriptionFormElement');

                expect(getElementFindStub.callCount).to.equal(0);
                expect(compareFormView.getDescriptionFormElement(1)).to.equal(className);
                expect(getElementFindStub.callCount).to.equal(1);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal(className);
            });
        });

        describe('getActionFormElement()', function() {
            it('should call find method from getElement with proper parameter', function() {
                var className = '.eaRolemgmtlib-roleCompare-table-actions1';

                getElementFindStub = sandbox.stub().returns(className);

                getElementMock = {
                    find: getElementFindStub
                };

                sandbox.stub(compareFormView, 'getElement', function() {
                    return getElementMock;
                });

                sandbox.spy(compareFormView, 'getActionFormElement');

                expect(getElementFindStub.callCount).to.equal(0);
                expect(compareFormView.getActionFormElement(1)).to.equal(className);
                expect(getElementFindStub.callCount).to.equal(1);
                expect(getElementFindStub.getCall(0).args[0]).to.be.equal(className);
            });
        });
    });
});