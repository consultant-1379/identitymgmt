define([
    'targetmanagement/widgets/FilterWidget/FilterWidget',
    'jscore/core',
    'identitymgmtlib/filters/TextInputFilterPlugin',
],function (FilterWidget, core, TextInputFilterPlugin) {
    'use strict';
    describe('FilterWidget', function() {
        var sandbox, filterWidget, pluginsStubs, filterTriggerSpy, defaultValuesMock, textInputFilterInitSpy;



        var EMPTY_OBJECT = {};


        beforeEach(function() {
            defaultValuesMock = {
                    name: "TestName"
                };

            sandbox = sinon.sandbox.create();

            pluginsStubs = preparePluginStubs();
            textInputFilterInitSpy = sandbox.spy(TextInputFilterPlugin.prototype, 'init');

            filterWidget = new FilterWidget({
                locationController: undefined,
                defaultValue: defaultValuesMock
            });

            filterTriggerSpy = sandbox.spy(filterWidget,'trigger');

        });

        afterEach(function () {
            sandbox.restore();
        });

        it('should be defined', function () {
            expect(FilterWidget).to.be.defined;
        });

        describe('init()', function() {
            it('should define default values for targetgroup name input plugin', function() {
                expect(textInputFilterInitSpy.args[0][0]['defaultValue']).to.equal(defaultValuesMock.name);
            });
        });

        describe('getData()', function() {
            it('should return empty object when no criteria is set', function() {
                expect(filterWidget.getData()).to.be.deep.equal(EMPTY_OBJECT);
            });

            it('should return filter object if one plugin returns value', function() {
                pluginsStubs.textInputFilter.getData.returns({name: "testText"});

                expect(filterWidget.getData()).to.be.deep.equal({
                    name: "testText"
                });
            });
        });

        describe('Clear button', function() {
            it('should call all filters clear function', function() {
                filterWidget.view.findById('clearButton').trigger('click');

                expectAllClearMethodsCalledAtLeastOnce();
            });

            it('should trigger "filter:clear" event', function() {
                filterWidget.view.findById('clearButton').trigger('click');
                expect(filterTriggerSpy.calledWith('filter:clear')).to.equal(true);
            })
        });

        describe('Apply button', function () {
            it('should call getData', function () {
                sandbox.spy(filterWidget, 'getData');

                filterWidget.view.findById('applyButton').trigger('click');

                expect(filterWidget.getData.calledOnce).to.be.equal(true);
            });

            it('should trigger "filter:apply" event', function() {
                filterWidget.view.findById('applyButton').trigger('click');

                expect(filterTriggerSpy.calledWith('filter:apply')).to.equal(true);
            });
        });

        function expectAllClearMethodsCalledAtLeastOnce() {
            Object.keys(pluginsStubs).forEach(function(stub) {
                expect(pluginsStubs[stub].clear.callCount).to.be.above(0);
            }.bind(this));
        }

        function preparePluginStubs() {
            var pluginsStubs = {};

            pluginsStubs.textInputFilter = {};
            pluginsStubs.textInputFilter.getData = sandbox.stub(TextInputFilterPlugin.prototype, 'getData');
            pluginsStubs.textInputFilter.clear = sandbox.stub(TextInputFilterPlugin.prototype, 'clear');
            return pluginsStubs;
        }
    });
});
