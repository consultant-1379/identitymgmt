define([
    'usermanagement/widgets/selectAllNotification/SelectAllNotificationView'
], function(SelectAllNotificationView){
    'use strict';

    describe('SelectAllNotificationView', function(){
        var sandbox, selectAllNotificationView, getElementFindStub, getElementMock;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            selectAllNotificationView = new SelectAllNotificationView();

            getElementFindStub = sandbox.stub();

            getElementMock = {
                find: getElementFindStub
            };
            sandbox.stub(selectAllNotificationView, 'getElement', function() {
                return getElementMock;
            });


        });
        afterEach(function(){
            sandbox.restore();
        })

        it('SelectAllNotificationView should be defined', function(){
            expect(SelectAllNotificationView).not.to.be.undefined;
        });

        describe('getTemplate()', function(){
            it('should return defined template', function(){
                var output = selectAllNotificationView.getTemplate();
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getStyle()',function(){
            it('should return defined object', function(){
                var output = selectAllNotificationView.getStyle();
                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getSelectedUsersMessage()', function(){
            it('should call find method from getElement with proper parameter', function(){
                selectAllNotificationView.getSelectedUsersMessage();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal(".eaUsermanagement-wSelectedUsersMessage-innerWrapper");
            });
        });

        describe('showUsersSelectedMsg()', function(){
            beforeEach(function(){
                sandbox.stub(selectAllNotificationView,'setModifier');
                sandbox.stub(selectAllNotificationView,'getSelectedUsersMessage');
            });

            it('should show users selected message', function(){
                selectAllNotificationView.showUsersSelectedMsg();

                expect(selectAllNotificationView.setModifier.calledOnce).to.equal(true);
                expect(selectAllNotificationView.setModifier.getCall(0).args[2]).to.equal('true');
                expect(selectAllNotificationView.getSelectedUsersMessage.calledOnce).to.equal(true);
            });

        });

        describe('hideUsersSelectedMsg()', function(){
            beforeEach(function(){
               sandbox.stub(selectAllNotificationView,'setModifier');
               sandbox.stub(selectAllNotificationView,'getSelectedUsersMessage');
            });

            it('should hide users selected message', function(){
                selectAllNotificationView.hideUsersSelectedMsg();

                expect(selectAllNotificationView.setModifier.calledOnce).to.equal(true);
                expect(selectAllNotificationView.setModifier.getCall(0).args[2]).to.equal('false');
                expect(selectAllNotificationView.getSelectedUsersMessage.calledOnce).to.equal(true);
            });
        });

        describe('getSelectedRowsInfo()', function(){
            it('should call find method form getElement with proper parameter', function(){
                selectAllNotificationView.getSelectedRowsInfo();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal(".eaUsermanagement-wSelectedUsersMessage-content-selectedRowsInfo");
            });
        });

        describe('getSelectAllOnCurrentPage()', function(){
            it('should call find method from getElement with proper parameter', function(){
                selectAllNotificationView.getSelectAllOnCurrentPage();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal(".eaUsermanagement-wSelectedUsersMessage-content-selectAllOnCurrentPage");
            });
        });

        describe('getSelectAllOnAllPage()', function(){
            it('should call find method from getElement with proper parameter', function(){
                selectAllNotificationView.getSelectAllOnAllPage();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal(".eaUsermanagement-wSelectedUsersMessage-content-selectAllOnAllPage");
            });
        });

        describe('getClearAll()', function(){
            it('should call find method from getElement with proper parameter', function(){
                selectAllNotificationView.getClearAll();

                expect(getElementFindStub.calledOnce).to.equal(true);
                expect(getElementFindStub.getCall(0).args[0]).to.equal(".eaUsermanagement-wSelectedUsersMessage-content-clearAll");
            });
        });

    });
});