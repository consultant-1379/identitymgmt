define([
    'identitymgmtlib/filters/CheckListFilterPlugin',
    'jscore/core'
],function (CheckListFilterPlugin, core) {
    'use strict';
    describe('CheckListFilterPlugin', function() {
        var checkListFilterPlugin, sandbox;
        var checkListElements = [
            {
                title: 'firstCheckbox',
                value: "FIRST",
                status: false
            },
            {
                title: 'secondCheckbox',
                value: "SECOND",
                status: false
            }
        ];
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            checkListFilterPlugin = new CheckListFilterPlugin({
                expandOnStart: true,
                title: "CheckList",
                name: "checklist",
                disableInactive: false,
                defaultValue: undefined,
                elements: checkListElements
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('should be defined', function() {
            expect(CheckListFilterPlugin).to.be.defined;
        });

        it('should return undefined if nothing is checked', function () {
            expect(checkListFilterPlugin.getData()).to.be.equal(undefined);
        });

        it('should return selected checkbox', function() {
            setCheckboxState.call(this, 'FIRST', true);

            expect(checkListFilterPlugin.getData()).to.be.deep.equal({
                checklist: ["FIRST"]
            });
        });

        it('should return selected checkboxes', function () {
            setCheckboxState.call(this, 'FIRST', true);
            setCheckboxState.call(this, 'SECOND', true);

            expect(checkListFilterPlugin.getData()).to.be.deep.equal({
                checklist: ["FIRST", "SECOND"]
            });
        });

        it('should return selected checkbox when one of them is deselected', function () {
            setCheckboxState.call(this, 'FIRST', true);
            setCheckboxState.call(this, 'SECOND', true);

            setCheckboxState.call(this, 'FIRST', false);

            expect(checkListFilterPlugin.getData()).to.be.deep.equal({
                checklist: ["SECOND"]
            });
        });

        it('should return undefined if selection is cleared', function () {
            setCheckboxState.call(this, 'FIRST', true);
            setCheckboxState.call(this, 'SECOND', true);

            checkListFilterPlugin.clear();

            expect(checkListFilterPlugin.getData()).to.be.equal(undefined);
        });

        describe('Default values', function() {

            it('should select first checkbox', function() {
                checkListFilterPlugin = new CheckListFilterPlugin({
                    expandOnStart: true,
                    title: "CheckList",
                    name: "checklist",
                    disableInactive: false,
                    defaultValue: ["FIRST"],
                    elements: checkListElements
                });

                expect(checkListFilterPlugin.getData()).to.be.deep.equal({
                    checklist: ["FIRST"]
                });
            });

            it('should select defined checkboxes', function () {
                checkListFilterPlugin = new CheckListFilterPlugin({
                    expandOnStart: true,
                    title: "CheckList",
                    name: "checklist",
                    disableInactive: false,
                    defaultValue: ["FIRST", "SECOND"],
                    elements: checkListElements
                });

                expect(checkListFilterPlugin.getData()).to.be.deep.equal({
                    checklist: ["FIRST", "SECOND"]
                });
            });
        });

        describe('Disable inactive', function () {

            it('should be able to select only one checkbox', function () {
                checkListFilterPlugin = new CheckListFilterPlugin({
                    expandOnStart: true,
                    title: "CheckList",
                    name: "checklist",
                    disableInactive: true,
                    elements: checkListElements
                });

                setCheckboxState.call(this, 'FIRST', true);
                getCheckbox.call(this, 'FIRST').trigger('change');

                expect(getCheckbox.call(this, 'SECOND').getProperty('disabled')).to.be.equal(true);
            });
        });

        function setCheckboxState(checkboxName, isChecked) {
            getCheckbox.call(this, checkboxName).setProperty('checked', isChecked);
        }

        function getCheckbox(checkboxName) {
            return checkListFilterPlugin.view.findById(checkboxName);
        }
    });
});