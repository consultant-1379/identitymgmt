define([
    'usermanagement/widgets/filterWidget/FilterWidget',
    'jscore/core',
    'identitymgmtlib/filters/LoginFilterPlugin',
    'identitymgmtlib/filters/CheckListFilterPlugin',
    'identitymgmtlib/filters/RadioListFilterPlugin',
    'identitymgmtlib/filters/TextInputFilterPlugin',
    'identitymgmtlib/filters/RolesListFilterPlugin'
], function(FilterWidget, core, LoginFilterPlugin, CheckListFilterPlugin, RadioListFilterPlugin, TextInputFilterPlugin, RolesListFilterPlugin) {
    'use strict';
    describe('FilterWidget', function() {
        var sandbox, filterWidget, pluginsStubs;

        var EMPTY_OBJECT = {};

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            pluginsStubs = preparePluginStubs();
            filterWidget = new FilterWidget({
                locationController: undefined
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('should be defined', function() {
            expect(FilterWidget).to.be.defined;
        });

        describe('getData()', function() {
            it('should return empty object when no criteria is set', function() {
                expect(filterWidget.getData()).to.be.deep.equal(EMPTY_OBJECT);
            });

            it('should return filter object if one plugin returns value', function() {
                pluginsStubs.textInputFilter.getData.returns({ username: "testUsername", name: "testName", surname: "testSurName", description: "testDescription" });
                expect(filterWidget.getData()).to.be.deep.equal(
                    {username: "testUsername", name: "testName", surname: "testSurName", description: "testDescription"}
                );
            });

            it('should return filter object if many plugins returns value', function() {
                pluginsStubs.textInputFilter.getData.returns({ username: "testUsername", name: "testName", surname: "testSurName", description: "testDescription" });
                pluginsStubs.rolesFilter.getData.returns({roles: ["testRole1", "testRole2"]});

                expect(filterWidget.getData()).to.be.deep.equal(
                    {username: "testUsername", name: "testName", surname: "testSurName", description: "testDescription", roles: ["testRole1", "testRole2"]}
                );
            });
        });

        describe('Clear button', function() {
            it('should call all filters clear function', function() {
                filterWidget.view.findById('clearButton').trigger('click');

                expectAllClearMethodsCalledAtLeastOnce();
            });
        });

        describe('Apply button', function() {
            it('should call getData', function() {
                sandbox.stub(filterWidget, 'getData');

                filterWidget.view.findById('applyButton').trigger('click');

                expect(filterWidget.getData.calledOnce).to.be.equal(true);
            });
        });

        function expectAllClearMethodsCalledAtLeastOnce() {
            Object.keys(pluginsStubs).forEach(function(stub) {
                expect(pluginsStubs[stub].clear.callCount).to.be.above(0);
            }.bind(this));
        }

        function preparePluginStubs() {
            var pluginsStubs = {};

            pluginsStubs.loginFilter = {};
            pluginsStubs.loginFilter.getData = sandbox.stub(LoginFilterPlugin.prototype, 'getData');
            pluginsStubs.loginFilter.clear = sandbox.stub(LoginFilterPlugin.prototype, 'clear');

            pluginsStubs.checkListFilter = {};
            pluginsStubs.checkListFilter.getData = sandbox.stub(CheckListFilterPlugin.prototype, 'getData');
            pluginsStubs.checkListFilter.clear = sandbox.stub(CheckListFilterPlugin.prototype, 'clear');

            pluginsStubs.radioListFilter = {};
            pluginsStubs.radioListFilter.getData = sandbox.stub(RadioListFilterPlugin.prototype, 'getData');
            pluginsStubs.radioListFilter.clear = sandbox.stub(RadioListFilterPlugin.prototype, 'clear');

            pluginsStubs.textInputFilter = {};
            pluginsStubs.textInputFilter.getData = sandbox.stub(TextInputFilterPlugin.prototype, 'getData');
            pluginsStubs.textInputFilter.clear = sandbox.stub(TextInputFilterPlugin.prototype, 'clear');

            pluginsStubs.rolesFilter = {};
            pluginsStubs.rolesFilter.getData = sandbox.stub(RolesListFilterPlugin.prototype, 'getData');
            pluginsStubs.rolesFilter.clear = sandbox.stub(RolesListFilterPlugin.prototype, 'clear');

            return pluginsStubs;
        }
    });
});
