define([
    'jscore/core',
    'usermanagement/widgets/selectAllNotification/SelectAllNotification',
    'usermanagement/widgets/selectAllNotification/SelectAllNotificationView',
    'usermanagement/Dictionary'
],function(core,SelectAllNotification, View, Dictionary){
    'use strict';

    describe('SelectAllNotification', function(){
        var sandbox, selectAllNotification, viewStub, paginatedTableStub, addEventHandlerStub;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            addEventHandlerStub = {
                addEventHandler:function(){}
            };
            viewStub = {
                showUsersSelectedMsg:function(){},
                hideUsersSelectedMsg:function(){},
                getSelectAllOnAllPage:function(){return addEventHandlerStub;},
                setSelectAllOnAllPage:function(){},
                getSelectAllOnCurrentPage:function(){return addEventHandlerStub;},
                setSelectAllOnCurrentPage:function(){},
                getClearAll:function(){return addEventHandlerStub;},
                setClearAll:function(){},
                setSelectedRowsInfo:function(){}

            };
            paginatedTableStub={
                addEventHandler:function(){},
                checkAll:function(){},
                checkAllOnCurrentPage:function(){},
                clearAll:function(){},
                getPageRows:function(){return [{}];},
                getRows:function(){return [{}];},
                getCheckedRows:function(){return [{}];},
                getPageCheckedRows:function(){return [{}];}
            };
            selectAllNotification = new SelectAllNotification();
            sandbox.spy(addEventHandlerStub,'addEventHandler');

            sandbox.spy(paginatedTableStub,'addEventHandler');
            sandbox.spy(paginatedTableStub,'checkAll');
            sandbox.spy(paginatedTableStub,'checkAllOnCurrentPage');
            sandbox.spy(paginatedTableStub,'clearAll');
            sandbox.spy(paginatedTableStub,'getPageRows');
            sandbox.spy(paginatedTableStub,'getRows');
            sandbox.spy(paginatedTableStub,'getCheckedRows');
            sandbox.spy(paginatedTableStub,'getPageCheckedRows');



            sandbox.spy(viewStub,'showUsersSelectedMsg');
            sandbox.spy(viewStub,'hideUsersSelectedMsg');
            sandbox.spy(viewStub,'getSelectAllOnAllPage');
            sandbox.spy(viewStub,'setSelectAllOnAllPage');
            sandbox.spy(viewStub,'getSelectAllOnCurrentPage');
            sandbox.spy(viewStub,'setSelectAllOnCurrentPage');
            sandbox.spy(viewStub,'getClearAll');
            sandbox.spy(viewStub,'setClearAll');
            sandbox.spy(viewStub,'setSelectedRowsInfo');

            selectAllNotification.view = viewStub;
            selectAllNotification.paginatedTable = paginatedTableStub;


        });
        afterEach(function(){
            sandbox.restore();
        });

        it('SelectAllNotification should be defined', function(){
            expect(SelectAllNotification).not.to.be.undefined;
            expect(SelectAllNotification).not.to.be.null;
        });

        describe('onViewReady()', function(){

            it('1 user selected & 1 pagination page -> should call showUserSelectedMsg function', function(){
                selectAllNotification.selectedRows = 1;
                selectAllNotification.paginationTotalPages = 1;
                selectAllNotification.onViewReady();
                expect(selectAllNotification.view.showUsersSelectedMsg.calledOnce).to.equal(true);
            });
            it('0 user selected & 0 pagination page -> should call hideUserSelectedMsg function', function(){
                selectAllNotification.selectedRows = 0;
                selectAllNotification.paginationTotalPages = 0;
                selectAllNotification.onViewReady();
                expect(selectAllNotification.view.hideUsersSelectedMsg.calledOnce).to.equal(true);
            });
        });

        describe('configure()', function(){
            it('Should call addEventHandlers and defined paginatedTable', function(){
                sandbox.spy(selectAllNotification,'addEventHandlers');
                var options = {
                    paginatedTable: paginatedTableStub
                };
                selectAllNotification.configure(options);

                expect(selectAllNotification.addEventHandlers.callCount).to.equal(1);
            });
        });

        describe('addEventHandlers()', function(){
            beforeEach(function(){
                sandbox.stub(selectAllNotification,'update');
                sandbox.stub(selectAllNotification,'show');
                sandbox.stub(selectAllNotification,'hide');

                selectAllNotification.addEventHandlers();
            });
            it('Should setup paginated table notification to update widget', function(){
                expect(paginatedTableStub.addEventHandler.callCount).to.equal(4);
                expect(paginatedTableStub.addEventHandler.getCall(0).args[0]).to.equal('pageloaded');
                expect(paginatedTableStub.addEventHandler.getCall(1).args[0]).to.equal('checkheader');
                expect(paginatedTableStub.addEventHandler.getCall(2).args[0]).to.equal('checkend');
                expect(paginatedTableStub.addEventHandler.getCall(3).args[0]).to.equal('check');
            });

            it('Should add event handler for action select all checkboxes in table', function(){
                expect(viewStub.getSelectAllOnAllPage.calledOnce).to.equal(true);
                expect(addEventHandlerStub.addEventHandler.callCount).to.equal(3);
                expect(addEventHandlerStub.addEventHandler.getCall(0).args[0]).to.equal('click');

                var callback = addEventHandlerStub.addEventHandler.getCall(0).args[1];
                expect(callback).to.be.function;
                callback.call(selectAllNotification);

                expect(paginatedTableStub.checkAll.calledOnce).to.equal(true);
                expect(selectAllNotification.update.callCount).to.equal(1);
                expect(selectAllNotification.show.callCount).to.equal(1);
            });

            it('Should add event handler for action select all checkboxes on current page in table', function(){
                expect(viewStub.getSelectAllOnCurrentPage.calledOnce).to.equal(true);

                expect(addEventHandlerStub.addEventHandler.callCount).to.equal(3);
                expect(addEventHandlerStub.addEventHandler.getCall(1).args[0]).to.equal('click');

                var callback = addEventHandlerStub.addEventHandler.getCall(1).args[1];
                expect(callback).to.be.function;
                callback.call(selectAllNotification);

                expect(paginatedTableStub.checkAllOnCurrentPage.calledOnce).to.equal(true);
                expect(selectAllNotification.show.callCount).to.equal(1);
            });

            it('Should add event handler for action clear selected checkboxes in table', function(){
                expect(viewStub.getClearAll.calledOnce).to.equal(true);

                expect(addEventHandlerStub.addEventHandler.callCount).to.equal(3);
                expect(addEventHandlerStub.addEventHandler.getCall(2).args[0]).to.equal('click');

                 var callback = addEventHandlerStub.addEventHandler.getCall(2).args[1];
                expect(callback).to.be.function;
                callback.call(selectAllNotification);

                expect(paginatedTableStub.clearAll.calledOnce).to.equal(true);
                expect(selectAllNotification.hide.callCount).to.equal(1);

            });
        });

        describe('hide()', function(){
            it('Should hide user selected message', function(){
                selectAllNotification.hide();
                expect(selectAllNotification.view.hideUsersSelectedMsg.callCount).to.equal(1);
            });
        });

        describe('show()', function(){
            it('Should show user selected message', function(){
                selectAllNotification.show();
                expect(selectAllNotification.view.showUsersSelectedMsg.callCount).to.equal(1);
            });
        });

        describe('update()', function(){
            it('Should update pagination on table', function(){
                sandbox.spy(selectAllNotification,'setText');
                selectAllNotification.update();
                expect(paginatedTableStub.getPageRows.callCount).to.equal(1);
                expect(paginatedTableStub.getRows.callCount).to.equal(1);
                expect(paginatedTableStub.getCheckedRows.callCount).to.equal(1);
                expect(paginatedTableStub.getPageCheckedRows.callCount).to.equal(1);
                expect(selectAllNotification.setText.callCount).to.equal(1);
            });
        });

        describe('setText()', function(){
            it("Should display number of selected rows and should add link clear all", function(){
                selectAllNotification.setText(3,3,3,3);
                expect(viewStub.setSelectedRowsInfo.callCount).to.equal(1);
                expect(viewStub.setSelectedRowsInfo.getCall(0).args[0]).to.equal("All 3 Users are selected.");

                expect(viewStub.setSelectAllOnCurrentPage.callCount).to.equal(1);
                expect(viewStub.setSelectAllOnCurrentPage.calledWith('')).to.equal(true);
                expect(viewStub.setSelectAllOnAllPage.callCount).to.equal(1);
                expect(viewStub.setSelectAllOnAllPage.calledWith('')).to.equal(true);
                expect(viewStub.setClearAll.callCount).to.equal(1);
                expect(viewStub.setClearAll.calledWith(Dictionary.clearSelection)).to.equal(true);

            });
            it("Should add link select all on current page", function(){
                selectAllNotification.setText(3,3,3,2);

                expect(viewStub.setSelectAllOnCurrentPage.callCount).to.equal(1);
                expect(viewStub.setSelectAllOnCurrentPage.calledWith(Dictionary.selectOnCurrentPages)).to.equal(true);
                expect(viewStub.setSelectAllOnAllPage.callCount).to.equal(1);
                expect(viewStub.setSelectAllOnAllPage.calledWith('')).to.equal(true);
                expect(viewStub.setClearAll.callCount).to.equal(1);
                expect(viewStub.setClearAll.calledWith('')).to.equal(true);

            });
            it("Should add link select all on all pages", function(){
                selectAllNotification.setText(2,3,3,3);

                expect(viewStub.setSelectAllOnCurrentPage.callCount).to.equal(1);
                expect(viewStub.setSelectAllOnCurrentPage.calledWith('')).to.equal(true);
                expect(viewStub.setSelectAllOnAllPage.callCount).to.equal(1);
                expect(viewStub.setSelectAllOnAllPage.calledWith('Select all 2 on all pages.')).to.equal(true);
                expect(viewStub.setClearAll.callCount).to.equal(1);
                expect(viewStub.setClearAll.calledWith('')).to.equal(true);

            });
        });

    });

});