define([
    'usermgmtlib/widgets/AssignTGFlyout/AssignTGFlyoutView'
], function(View){
    'use strict';

    describe("AssignTGFlyoutView", function(){
        var sandbox, view, output;

        beforeEach(function(){
            view = new View();
            view.render();

            sandbox = sinon.sandbox.create();
            sandbox.spy(view.getElement(), "find");
        });
        afterEach(function(){ sandbox.restore(); });

        it('should be defined (module)', function(){
            expect(View).not.to.be.undefined;
            expect(View).not.to.be.null;
        });

        it('should be defined (instance)', function(){
            expect(view).not.to.be.undefined;
            expect(view).not.to.be.null;
        });

        describe('getTemplate()', function(){
            it('should return a defined template', function(){
                output = view.getTemplate();
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getStyle()', function(){
            it('should return a defined style', function(){
                output = view.getStyle();
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getInfoPopupContainer()', function(){
            beforeEach(function(){
                output = view.getInfoPopupContainer();
            });
            it('should return defined output', function(){
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

            it('should call find() exactly once', function(){
                expect(view.getElement().find.calledOnce).to.equal(true);
            });

            it('should retrieve the proper element from the HTML', function(){
                expect(view.getElement().find.getCall(0).args[0])
                    .to.equal(".eaUsermgmtlib-wAssignTGFlyout-infoPopupContainer");
            });
        });

        describe('getRoleNameContainer()', function(){
            beforeEach(function(){
                output = view.getRoleNameContainer();
            });
            it('should return defined output', function(){
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

            it('should call find() exactly once', function(){
                expect(view.getElement().find.calledOnce).to.equal(true);
            });

            it('should retrieve the proper element from the HTML', function(){
                expect(view.getElement().find.getCall(0).args[0])
                    .to.equal(".eaUsermgmtlib-wAssignTGFlyout-RoleName");
            });
        });

        describe('getApplyButton()', function(){
            beforeEach(function(){
                output = view.getApplyButton();
            });
            it('should return defined output', function(){
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

            it('should call find() exactly once', function(){
                expect(view.getElement().find.calledOnce).to.equal(true);
            });

            it('should retrieve the proper element from the HTML', function(){
                expect(view.getElement().find.getCall(0).args[0])
                    .to.equal(".eaUsermgmtlib-wAssignTGFlyout-ButtonApply");
            });
        });

        describe('getCancelButton()', function(){
            beforeEach(function(){
                output = view.getCancelButton();
            });
            it('should return defined output', function(){
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

            it('should call find() exactly once', function(){
                expect(view.getElement().find.calledOnce).to.equal(true);
            });

            it('should retrieve the proper element from the HTML', function(){
                expect(view.getElement().find.getCall(0).args[0])
                    .to.equal(".eaUsermgmtlib-wAssignTGFlyout-ButtonCancel");
            });
        });

        describe('getListContainer()', function(){
            beforeEach(function(){
                output = view.getListContainer();
            });
            it('should return defined output', function(){
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

            it('should call find() exactly once', function(){
                expect(view.getElement().find.calledOnce).to.equal(true);
            });

            it('should retrieve the proper element from the HTML', function(){
                expect(view.getElement().find.getCall(0).args[0])
                    .to.equal(".eaUsermgmtlib-wAssignTGFlyout-ListContainer");
            });
        });

        describe('getTgAllRadio()', function(){
            beforeEach(function(){
                output = view.getTgAllRadio();
            });
            it('should return defined output', function(){
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

            it('should call find() exactly once', function(){
                expect(view.getElement().find.calledOnce).to.equal(true);
            });

            it('should retrieve the proper element from the HTML', function(){
                expect(view.getElement().find.getCall(0).args[0])
                    .to.equal(".eaUsermgmtlib-wAssignTGFlyout-RadioButtonAssignAll");
            });
        });

        describe('getTgNoneRadio()', function(){
            beforeEach(function(){
                output = view.getTgNoneRadio();
            });
            it('should return defined output', function(){
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

            it('should call find() exactly once', function(){
                expect(view.getElement().find.calledOnce).to.equal(true);
            });

            it('should retrieve the proper element from the HTML', function(){
                expect(view.getElement().find.getCall(0).args[0])
                    .to.equal(".eaUsermgmtlib-wAssignTGFlyout-RadioButtonAssignNone");
            });
        });

        describe('getManualTgRadio()', function(){
            beforeEach(function(){
                output = view.getManualTgRadio();
            });
            it('should return defined output', function(){
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

            it('should call find() exactly once', function(){
                expect(view.getElement().find.calledOnce).to.equal(true);
            });

            it('should retrieve the proper element from the HTML', function(){
                expect(view.getElement().find.getCall(0).args[0])
                    .to.equal(".eaUsermgmtlib-wAssignTGFlyout-RadioButtonAssignManually");
            });
        });

        describe('getErrorMessageBox()', function(){
            beforeEach(function(){
                output = view.getErrorMessageBox();
            });
            it('should return defined output', function(){
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

            it('should call find() exactly once', function(){
                expect(view.getElement().find.calledOnce).to.equal(true);
            });

            it('should retrieve the proper element from the HTML', function(){
                expect(view.getElement().find.getCall(0).args[0])
                    .to.equal(".eaUsermgmtlib-wAssignTGFlyout-role-error-message");
            });
        });

        describe('getErrorBox()', function(){
            beforeEach(function(){
                output = view.getErrorBox();
            });
            it('should return defined output', function(){
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });

            it('should call find() exactly once', function(){
                expect(view.getElement().find.calledOnce).to.equal(true);
            });

            it('should retrieve the proper element from the HTML', function(){
                expect(view.getElement().find.getCall(0).args[0])
                    .to.equal(".eaUsermgmtlib-wAssignTGFlyout-role-error");
            });
        });

    });
});