define([
    'identitymgmtlib/filters/TextInputFilterPlugin',
    'identitymgmtlib/filters/FilterPlugin',
    'jscore/core'
],function (TextInputFilterPlugin, FilterPlugin, core) {
    'use strict';
    describe('TextInputFilterPlugin', function() {
        var textInputFilterPlugin, sandbox, mockInitParams;
        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            mockInitParams = {
                title: "TextInputFilterPlugin",
                name: "textInput",
                placeholder: "Placeholder"
            };
            textInputFilterPlugin = new TextInputFilterPlugin(mockInitParams);
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('should be defined', function () {
            expect(TextInputFilterPlugin).to.be.defined;
        });

        describe('Return value (getData())', function() {
            it('should return undefined if no text is set', function () {
                expect(textInputFilterPlugin.getData()).to.be.equal(undefined);
            });

            it('should return specified string when it is set', function () {
                setText('testText');

                expect(textInputFilterPlugin.getData()).to.be.deep.equal({
                    textInput: "testText"
                });
            });

            it('should return specified string when it is set', function () {
                setText('testText');

                expect(textInputFilterPlugin.getData()).to.be.deep.equal({
                    textInput: "testText"
                });
            });

            it('should return undefined when text is set and then removed', function () {
                setText('testText');
                setText('');

                expect(textInputFilterPlugin.getData()).to.be.equal(undefined);
            });
        });

        describe('Search and close icon', function() {
            it('should display search icon when textbox is empty', function () {
                expect(getSearchIcon().hasModifier('show', 'true')).to.be.equal(true);
                expect(getCloseIcon().hasModifier('show', 'true')).to.be.equal(false);
            });

            it('should change icon when text is entered', function () {
                setText('testText');
                getTextbox().trigger('input');

                expect(getSearchIcon().hasModifier('show', 'true')).to.be.equal(false);
                expect(getCloseIcon().hasModifier('show', 'true')).to.be.equal(true);
            });

            it('should restore search icon when text is entered and then removed', function () {
                setText('testText');
                getTextbox().trigger('input');

                setText('');
                getTextbox().trigger('input');

                expect(getSearchIcon().hasModifier('show', 'true')).to.be.equal(true);
                expect(getCloseIcon().hasModifier('show', 'true')).to.be.equal(false);
            });

            it('should reset text when reset icon is clicked', function() {
                setText('testText');
                getTextbox().trigger('input');

                getCloseIcon().trigger('click');

                expect(textInputFilterPlugin.getData()).to.be.equal(undefined);
            });
        });

        describe('Clearing input (clear())', function() {
            it('should return undefined if text is set and then clear is invoked', function() {
                setText('testText');
                textInputFilterPlugin.clear();

                expect(textInputFilterPlugin.getData()).to.be.equal(undefined);
            });
        });

        describe('Trigger "Apply" on textbox value change', function() {
            it('should trigger event on value change', function() {
                mockInitParams.applyOnChange = true;
                textInputFilterPlugin = new TextInputFilterPlugin(mockInitParams);
                sandbox.spy(textInputFilterPlugin, 'trigger');

                getTextbox().trigger('change');

                expect(textInputFilterPlugin.trigger.calledOnce).to.be.equal(true);
                expect(textInputFilterPlugin.trigger.getCall(0).args[0]).to.be.equal('plugin:apply');
            });
        });

        describe('Default value', function() {
            it('should return default value if set', function() {
                mockInitParams.defaultValue = "defaultValue";
                textInputFilterPlugin = new TextInputFilterPlugin(mockInitParams);

                expect(textInputFilterPlugin.getData()).to.be.deep.equal({
                    textInput: "defaultValue"
                });
            });
        });

        function getText() {
            getTextbox.call(this).getValue();
        }

        function setText(text) {
            getTextbox.call(this).setValue(text);
        }

        function getTextbox() {
            return textInputFilterPlugin.view.findById('textInput');
        }

        function getSearchIcon() {
            return textInputFilterPlugin.view.findById('textInput-searchIcon');
        }

        function getCloseIcon() {
            return textInputFilterPlugin.view.findById('textInput-closeIcon');
        }
    });
});