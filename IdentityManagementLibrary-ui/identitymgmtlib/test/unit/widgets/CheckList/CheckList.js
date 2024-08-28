define([
    'identitymgmtlib/widgets/CheckList/CheckList',
    'jscore/core'
],function (CheckList, core) {
    'use strict';
    describe('CheckList', function () {
        var sandbox, checkList, testOption, testOptionWithSorting;
        it('Should be defined', function(){
            expect(CheckList).not.be.undefined;
        });

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            testOption ={
                elements: [
                    {name: "elem1", status: true, value: "elem1"},
                    {name: "elem4", status: false, value: "elem4"},
                    {name: "elem2", status: true, value: "elem2"},
                    {name: "elem5", status: false, value: "elem5"},
                    {name: "elem3", status: true, value: "elem3"}
                ]
            };
            testOptionWithSorting ={
                sortFunction: function(a, b) {
                    return a.name.localeCompare(b.name);
                },
                 elements: [
                    {name: "elem1", status: true, value: "elem1"},
                    {name: "elem4", status: false, value: "elem4"},
                    {name: "elem2", status: true, value: "elem2"},
                    {name: "elem5", status: false, value: "elem5"},
                    {name: "elem3", status: true, value: "elem3"}
                ]
            };
        });

        afterEach(function(){
            sandbox.restore();
        });

        describe('init()', function(){
            it("Should correctly set elements", function(){
                var expectedOption = testOption;
                checkList = new CheckList(testOption);
                expect(checkList.elements).to.equal(expectedOption.elements);
                expect(checkList.elements.length).to.equal(expectedOption.elements.length);
                for(var i=0; i<expectedOption.length; ++i){
                    expect(checkList.elements[i].name).to.equal(expectedOption.elements[i].name);
                    expect(checkList.elements[i].status).to.equal(expectedOption.elements[i].status);
                    expect(checkList.elements[i].value).to.equal(expectedOption.elements[i].value);
                }
                expect(checkList.view).not.be.undefined;
                expect(checkList.view).not.be.null;
            });
            it("Should sort elements correctly if sort function is avalible", function(){
                var expectedOption = {
                    elements: [
                        {name: "elem1", status: true, value: "elem1"},
                        {name: "elem2", status: true, value: "elem2"},
                        {name: "elem3", status: true, value: "elem3"},
                        {name: "elem4", status: false, value: "elem4"},
                        {name: "elem5", status: false, value: "elem5"}
                    ]
                };
                checkList = new CheckList(testOptionWithSorting);
                expect(checkList.elements.length).to.equal(expectedOption.elements.length);
                for(var i=0; i<expectedOption.length; ++i){
                    expect(checkList.elements[i].name).to.equal(expectedOption.elements[i].name);
                    expect(checkList.elements[i].status).to.equal(expectedOption.elements[i].status);
                    expect(checkList.elements[i].value).to.equal(expectedOption.elements[i].value);
                }
                expect(checkList.view).not.be.undefined;
                expect(checkList.view).not.be.null;
            });

        });
        describe('updateElements()', function(){
            var viewStub, checkboxForElementStub;
            beforeEach(function(){
                checkList = new CheckList(testOption);

                checkboxForElementStub = {
                    setProperty: function () {
                    }
                };
                viewStub = {
                    getCheckboxForElement : function(){
                        return checkboxForElementStub;
                    }
                };

                checkList.view = viewStub;

                sandbox.spy(viewStub, 'getCheckboxForElement');
                sandbox.spy(checkboxForElementStub, 'setProperty');

            });
            it("Should update checked property for elements ", function(){
                checkList.updateElements();
                expect(viewStub.getCheckboxForElement.callCount).to.equal(3);
                expect(checkboxForElementStub.setProperty.callCount).to.equal(3);
                expect(checkboxForElementStub.setProperty.getCall(0).calledWith('checked', true)).to.equal(true);
                expect(checkboxForElementStub.setProperty.getCall(1).calledWith('checked', true)).to.equal(true);
                expect(checkboxForElementStub.setProperty.getCall(2).calledWith('checked', true)).to.equal(true);


            });

        });
        describe('clearElements()', function(){
            var viewStub, checkboxForElementStub;
            beforeEach(function(){
                checkList = new CheckList(testOption);

                checkboxForElementStub = {
                    setProperty: function () {
                    }
                };
                viewStub = {
                    getCheckboxForElement : function(){
                        return checkboxForElementStub;
                    }
                };

                checkList.view = viewStub;

                sandbox.spy(viewStub, 'getCheckboxForElement');
                sandbox.spy(checkboxForElementStub, 'setProperty');
            });
            it("Should clear all unchecked elements ", function(){
                checkList.clearElements();
                expect(viewStub.getCheckboxForElement.callCount).to.equal(2);
                expect(checkboxForElementStub.setProperty.callCount).to.equal(2);
                expect(checkboxForElementStub.setProperty.getCall(0).calledWith('checked', false)).to.equal(true);
                expect(checkboxForElementStub.setProperty.getCall(1).calledWith('checked', false)).to.equal(true);
            });
        });

        describe('getCheckedElements()', function(){
            var viewStub, checkboxForElementStub, viewStub2, checkboxForElementStub2;

            beforeEach(function(){
                checkList = new CheckList(testOption);

                checkboxForElementStub = {
                    getProperty: function () {
                        return true;
                    }
                };
                viewStub = {
                    getCheckboxForElement : function(){
                        return checkboxForElementStub;
                    }
                };
                viewStub2 = {
                    getCheckboxForElement : function(){
                        return checkboxForElementStub2;
                    }
                };
                checkboxForElementStub2 = {
                    getProperty: function () {
                        return false;
                    }
                };

                sandbox.spy(viewStub, 'getCheckboxForElement');
                sandbox.spy(checkboxForElementStub, 'getProperty');

                sandbox.spy(viewStub2, 'getCheckboxForElement');
                sandbox.spy(checkboxForElementStub2, 'getProperty');


            });
            it("Should return all checked elements", function(){
                checkList.view = viewStub;

                var checkedElement = checkList.getCheckedElements('name');
                expect(viewStub.getCheckboxForElement.callCount).to.equal(5);
                expect(checkboxForElementStub.getProperty.callCount).to.equal(5);


                expect(checkedElement).not.be.undefined;
                expect(checkedElement).not.be.null;
                expect(checkedElement.length).to.equal(5);
                for(var i=0; i<5; ++i){
                    expect(checkboxForElementStub.getProperty.getCall(i).calledWith('checked')).to.equal(true);
                    expect(checkedElement[i]).to.equal(testOption.elements[i].name);
                }

            });
            it("Shouldn't return any elements in case unchecked property", function(){
                checkList.view = viewStub2;
                var checkedElement = checkList.getCheckedElements('name');

                expect(viewStub2.getCheckboxForElement.callCount).to.equal(5);
                expect(checkboxForElementStub2.getProperty.callCount).to.equal(5);
                expect(checkedElement.length).to.equal(0);

            });

        });

    });
});