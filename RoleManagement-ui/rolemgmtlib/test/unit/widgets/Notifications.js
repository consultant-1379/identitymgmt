define([
    'jscore/core',
    'widgets/Notification',
	'rolemgmtlib/widgets/Notifications/Notifications'
], function (core, NotificationWidget, Notifications) {
    'use strict';

    describe('Notifications', function () {

    	var notifications,
    		sandbox,
    		viewStub,
            widgetSpy,constructorSpy,
    		options, clearSpy;

    	it('Notifications should be defined', function () {
            expect(Notifications).not.to.be.undefined;
        });

        beforeEach(function(){
            sandbox = sinon.sandbox.create();

            notifications = new Notifications();
        });

        afterEach(function(){
            sandbox.restore();
            notifications.delete;
        });

        describe('onViewReady()', function () {

            it('Should set notificationHolder', function () {
            	viewStub = {
            			getNotificationHolder : function () {}
                };

            	notifications.view = viewStub;
            	sandbox.spy(notifications.view, 'getNotificationHolder');

            	notifications.onViewReady();
            	expect(notifications.view.getNotificationHolder.callCount).to.equal(1);
            });
        });    

        describe('show()', function () {

            beforeEach(function(){
                widgetSpy = sandbox.spy( NotificationWidget.prototype, 'attachTo');
            });

            it('should not attach to nottificationHolder when not recognised notiffication', function() {
                widgetSpy.reset();
                notifications.show("unexpecteedNotifficationName");
                expect(widgetSpy.notCalled).to.equal(true);
            });
            it('should attach to nottificationHolder when saveSuccess', function() {
                widgetSpy.reset();
                notifications.show("saveSuccess");
                expect(widgetSpy.calledOnce).to.equal(true);
            });
            it('should attach to nottificationHolder when saveError', function() {
                widgetSpy.reset();
                notifications.show("saveError");
                expect(widgetSpy.calledOnce).to.equal(true);
            });
            it('should attach to nottificationHolder when formHasErrors', function() {
                widgetSpy.reset();
                notifications.show("formHasErrors");
                expect(widgetSpy.calledOnce).to.equal(true);
            });
            it('should attach to nottificationHolder when serverError', function() {
                widgetSpy.reset();
                notifications.show("serverError");
                expect(widgetSpy.calledOnce).to.equal(true);
            });
        });  

        describe('clear()', function () {

            beforeEach(function() {
                clearSpy = sandbox.spy(notifications, 'clear');
            });

            it('no exceptions in clear function', function() {
                notifications.clear();
                expect(clearSpy.threw()).to.equal(false);
            });
        });  

    });
});