define([
    'identitymgmtlib/widgets/CheckList/CheckListView',
    'jscore/core'
],function (CheckListView, core){

   'use strict';
   describe('CheckListView', function () {
       var sandbox, checkListView, getElementStub, getElementMock;

        it('Should be defined', function(){
           expect(CheckListView).not.be.undefined;
        });
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            checkListView = new CheckListView();
        });
        afterEach(function(){
            sandbox.restore();
        });

        describe("getTemplate()", function(){
            it("should return defined object", function(){
                var templateTest = checkListView.getTemplate();
                expect(templateTest).not.be.undefined;
                expect(templateTest).not.be.null;
            });
        });
        describe("getStyle()", function(){
            it("should return defined object", function(){
                var styleTest = checkListView.getStyle();
                expect(styleTest).not.be.undefined;
                expect(styleTest).not.be.null;
            });
        });
        describe("getCheckboxForElement()", function(){
            it("should call find method form getElement with correct parameter", function(){

                var expectedClassName = ".elIdentitymgmtlib-checklist-listItem-value1-input";

                var  element = {value: 'value1'};

                getElementStub = sandbox.stub().returns(expectedClassName);
                getElementMock ={
                    find: getElementStub
                };
                sandbox.stub(checkListView, 'getElement',function(){
                    return getElementMock;
                });
                sandbox.spy(checkListView, "getCheckboxForElement");

                expect(getElementStub.callCount).to.equal(0);
                expect(checkListView.getCheckboxForElement(element)).to.equal(expectedClassName);
                expect(getElementStub.callCount).to.equal(1);
                expect(getElementStub.getCall(0).args[0]).to.equal(expectedClassName);

            });
        });

    });


});