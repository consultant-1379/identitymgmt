define([
    'jscore/core',
    'identitymgmtlib/ParamsLocationController'
], function(core, ParamsLocationController) {

    describe("ParamsLocationController", function() {
        var sandbox, paramsLocationController;
        var setLocationSpy, addLocationListenerSpy, getLocationSpy, eventBusUnsubscribeSpy, eventBusSubscribeSpy, eventBusPublishSpy;
        var fakeNamespace;

        var testParameters = {
                testParam1: 42,
                testParam2: "StringParameter",
                testParam3: false
            };

        var dummyFunction = function() {};

        var testParametersInURL = "?testParam1=42&testParam2=StringParameter&testParam3=false";

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            addLocationListenerSpy = sandbox.spy(ParamsLocationController.prototype, 'addLocationListener');

            eventBusSubscribeSpy = sandbox.spy(core.EventBus.prototype, "subscribe");
            eventBusUnsubscribeSpy = sandbox.spy(core.EventBus.prototype, "unsubscribe");
            eventBusPublishSpy = sandbox.spy(core.EventBus.prototype, "publish");

            fakeNamespace = "fakeNamespace"

            //Without app listeners don't trigger on URL location change
            core.App.prototype.start(document.body);
            window.location.hash = fakeNamespace;
            paramsLocationController = new ParamsLocationController({
                namespace: fakeNamespace
            });

            paramsLocationController.start();

            setLocationSpy = sandbox.spy(paramsLocationController, 'setLocation');
            getLocationSpy = sandbox.spy(paramsLocationController, 'getLocation');

        });

        afterEach(function() {
            core.App.prototype.stop();
            sandbox.restore();
        });

        it('should be defined' , function() {
            expect(paramsLocationController).to.be.defined;
        });

        it('should subscribe for location change event', function() {
            expect(paramsLocationController.addLocationListener.callCount).to.equal(1);
        });

        describe('addParameterListener()', function() {

            it('should add parameter listener', function() {
                paramsLocationController.addParameterListener("tmpParameter", dummyFunction);
                expect(eventBusSubscribeSpy.callCount).to.equal(1);
            });

            it('should not publish event on new not subscribed parameters in URL', function() {
                window.location.hash = window.location.hash + "?newparameter=2";
                expect(eventBusPublishSpy.callCount).to.equal(0);
            });

            it('should publish event on adding subscribed parameter in URL', function(done) {
                paramsLocationController.addParameterListener("exampleParameter", dummyFunction);
                window.location.hash = fakeNamespace + "?exampleParameter=4";
                setTimeout(function () {
                    expect(eventBusPublishSpy.callCount).to.equal(1);
                    done();
                }, 0); //SetTimeout move except to end of browser event queue, so location listeners code will be called first.
            });

            it('should publish event after changing previously added parameter', function (done) {
                paramsLocationController.addParameterListener("exampleParameter", dummyFunction);
                window.location.hash = fakeNamespace + "?exampleParameter=5";
                setTimeout(function () {
                    window.location.hash = fakeNamespace + "?exampleParameter=NewValue";
                    setTimeout(function () {
                        window.location.hash = fakeNamespace + "?exampleParameter=NewValue3";
                        setTimeout(function () {
                            window.location.hash = fakeNamespace + "?exampleParameter=NewValue5";
                            setTimeout(function () {
                                window.location.hash = fakeNamespace + "?exampleParameter=NewValue7";
                                setTimeout(function () {
                                    expect(eventBusPublishSpy.callCount).to.equal(5);
                                    done();
                                }, 0);
                            }, 0);
                        }, 0);
                    }, 0);
                }, 0); //SetTimeout move code to end of browser event queue, so location listeners code will be called first.
            });

            it('should publish event after changing previously added parameter', function(done) {
                paramsLocationController.addParameterListener("exampleParameter", dummyFunction);
                window.location.hash = fakeNamespace + "?exampleParameter=5";
                setTimeout(function () {
                    window.location.hash = fakeNamespace + "?exampleParameter=NewValue";
                    setTimeout(function (){
                        expect(eventBusPublishSpy.callCount).to.equal(2);
                        done();
                    }, 0);
                }, 0); //SetTimeout move code to end of browser event queue, so location listeners code will be called first.
            });

            it('should publish event once if user try change parameter twice', function(done) {
                paramsLocationController.addParameterListener("exampleParameter", dummyFunction);
                window.location.hash = fakeNamespace + "?exampleParameter=5";
                setTimeout(function () {
                    window.location.hash = fakeNamespace + "?exampleParameter=5";
                    setTimeout(function (){
                        expect(eventBusPublishSpy.callCount).to.equal(1);
                        done();
                    }, 0);
                }, 0); //SetTimeout move code to end of browser event queue, so location listeners code will be called first.
            });

            it('should publish event 3 times if user try change parameter back after update', function(done) {
                paramsLocationController.addParameterListener("exampleParameter", dummyFunction);
                paramsLocationController.addParameterListener("newParameter", dummyFunction);
                window.location.hash = fakeNamespace + "?exampleParameter=5";
                setTimeout(function () {
                    window.location.hash = fakeNamespace + "?exampleParameter=NewValue";
                    setTimeout(function (){
                        window.location.hash = fakeNamespace + "?exampleParameter=5";
                        setTimeout(function (){
                            expect(eventBusPublishSpy.callCount).to.equal(3);
                            done();
                        }, 0);
                    }, 0);
                }, 0); //SetTimeout move code to end of browser event queue, so location listeners code will be called first.
            });

            it('should publish event twice on adding two different subscribed parameters in URL', function(done) {
                paramsLocationController.addParameterListener("exampleParameter", dummyFunction);
                paramsLocationController.addParameterListener("secondParameter", dummyFunction);
                window.location.hash = fakeNamespace + "?exampleParameter=4&secondParameter=5";
                setTimeout(function () {
                    expect(eventBusPublishSpy.callCount).to.equal(2);
                    done();
                }, 0); //SetTimeout move except to end of browser event queue, so location listeners code will be called first.
            });

            describe('Changing one of two diffrent subsrcibed parameters in URL', function() {
                var mockFunction = sinon.spy();
                beforeEach(function() {
                    paramsLocationController.addParameterListener("exampleParameter", dummyFunction);
                    paramsLocationController.addParameterListener("secondParameter", mockFunction);
                    window.location.hash = fakeNamespace + "?exampleParameter=4&secondParameter=5";
                });

                it('should publish event once after changing one from two different subscribed parameters in URL', function(done) {
                    setTimeout(function () {
                        window.location.hash = fakeNamespace + "?exampleParameter=4&secondParameter=6";
                        setTimeout(function () {
                            expect(eventBusPublishSpy.callCount).to.equal(3);
                            done();
                        }, 0);
                    }, 0); //SetTimeout move except to end of browser event queue, so location listeners code will be called first.
                });

                it('should execute correct function after changing one from two different subscribed parameters in URL', function(done) {
                    setTimeout(function () {
                        window.location.hash = fakeNamespace + "?exampleParameter=5&secondParameter=6";
                        setTimeout(function () {
                            expect(mockFunction.calledWith(5)).to.equal(true);
                            done();
                        }, 0);
                    }, 0); //SetTimeout move except to end of browser event queue, so location listeners code will be called first.
                });
            });
        });

        describe('getParameter()', function() {

            beforeEach(function() {
                window.location.hash = fakeNamespace + testParametersInURL;
            });

            it('should return only one argument value', function() {
                Object.keys(testParameters).forEach(function(key) {
                    expect(paramsLocationController.getParameter(key)).to.equal(testParameters[key]);
                });
            });
        });

        describe('getParametrs()', function() {

            beforeEach(function() {
                window.location.hash = fakeNamespace + testParametersInURL;
            });

            it('should return all parameters', function() {
                expect(paramsLocationController.getParameters()).to.deep.equal(testParameters);
            });
        });

        describe('bug tests', function() {
            it('should test bug - just object', function() {
                window.location.hash = fakeNamespace + "?objParam=" + JSON.stringify({key: "value"});
                expect(paramsLocationController.getParameter("objParam")).to.be.deep.equal({key: "value"});
            });

            it('should test bug - int param and object', function () {
                window.location.hash = fakeNamespace + "?intParam=0&objParam=" + JSON.stringify({key: "value"});
                expect(paramsLocationController.getParameter("objParam")).to.be.deep.equal({key: "value"});
                expect(paramsLocationController.getParameter("intParam")).to.be.equal(0);
            });

            it('should test bug - int param and object', function () {
                window.location.hash = fakeNamespace + "?intParam=undefined";
                expect(paramsLocationController.getParameter("intParam")).to.be.equal('undefined');
            });

            it('should test bug - int param and object, multichanges', function () {
                for(var i = -3; i < 3; ++i) {
                    window.location.hash = fakeNamespace + "?intParam=" + i + "&objParam=" + JSON.stringify({intval: i});
                    expect(paramsLocationController.getParameter("objParam")).to.be.deep.equal({intval: i});
                    expect(paramsLocationController.getParameter("intParam")).to.be.equal(i);
                }
            });

            it('should test bug - int param and object, multichanges', function () {
                for (var i = 0; i < 10; ++i) {
                    paramsLocationController.setParameter("objParam", {intval: i}, false);
                    paramsLocationController.setParameter("intParam", i, false);
                    expect(paramsLocationController.getParameter("objParam")).to.be.deep.equal({intval: i});
                    expect(paramsLocationController.getParameter("intParam")).to.be.equal(i);
                }
            });

            it('should trigger events after adding object to hash', function(done){
                paramsLocationController.addParameterListener("objParameter", dummyFunction);
                window.location.hash = fakeNamespace + "?objParameter=" + JSON.stringify({int: 1});
                setTimeout(function () {
                    window.location.hash = fakeNamespace + "?objParameter=" + JSON.stringify({int: 2});
                    setTimeout(function (){
                        window.location.hash = fakeNamespace + "?objParameter=" + JSON.stringify({int: 3});
                        setTimeout(function (){
                            expect(eventBusPublishSpy.callCount).to.equal(3);
                            done();
                        }, 0);
                    }, 0);
                }, 0); //SetTimeout move code to end of browser event queue, so location listeners code will be called first.
            });

            it('should trigger events after adding object to hash and with set', function(done){
                paramsLocationController.addParameterListener("objParameter", dummyFunction);
                paramsLocationController.setParameter("objParam", {int: 1}, false);
                var locationWithSetObject = window.location.hash;
                setTimeout(function () {
                    window.location.hash = locationWithSetObject + "&objParameter=" + JSON.stringify({int: 2});
                    setTimeout(function (){
                        window.location.hash = locationWithSetObject + "&objParameter=" + JSON.stringify({int: 3});
                        setTimeout(function (){
                            expect(eventBusPublishSpy.callCount).to.equal(3);
                            done();
                        }, 0);
                    }, 0);
                }, 0); //SetTimeout move code to end of browser event queue, so location listeners code will be called first.
            });

            it('should trigger events after adding object to hash after set with prevent event', function(done){
                paramsLocationController.addParameterListener("objParameter", dummyFunction);
                paramsLocationController.setParameter("objParam", {int: 1}, true);
                var locationWithSetObject = window.location.hash;
                setTimeout(function () {
                    window.location.hash = locationWithSetObject + "&objParameter=" + JSON.stringify({int: 2});
                    setTimeout(function (){
                        window.location.hash = locationWithSetObject + "&objParameter=" + JSON.stringify({int: 3});
                        setTimeout(function (){
                            expect(eventBusPublishSpy.callCount).to.equal(2);
                            done();
                        }, 0);
                    }, 0);
                }, 0); //SetTimeout move code to end of browser event queue, so location listeners code will be called first.
            });

        });

        describe('setParameter()', function () {
            it('should change save parameter', function() {
                paramsLocationController.setParameter("exampleParameter", 42);
                expect(paramsLocationController.getParameters().exampleParameter).to.equal(42);
            });

            it('should call "setLocation" once', function() {
                paramsLocationController.setParameter("exampleParameter", 42);
                expect(setLocationSpy.callCount).to.be.equal(1);
            });

            it('should not call locationListeners if "preventEvent" parameter is set', function() {
                paramsLocationController.addParameterListener("exampleParameter", dummyFunction);
                paramsLocationController.setParameter("exampleParameter", 42, true);
                expect(eventBusPublishSpy.callCount).to.equal(0);
            });

            it('should call locationListener if parameter changed', function() {
                paramsLocationController.setParameter("exampleParameter", 42);
                expect(eventBusPublishSpy.callCount).to.equal(1);
            });

            it('should call locationListener multiple times after each parameter change', function() {
                var egzampleValues = [45, 52, 42, 7, 9];
                var tmpCallCount;
                egzampleValues.forEach(function(value) {
                    tmpCallCount = eventBusPublishSpy.callCount;
                    paramsLocationController.setParameter("exampleParameter", value);
                    expect(eventBusPublishSpy.callCount-tmpCallCount).to.equal(1);
                });
            });
        });

        describe('removeParameter()', function() {
            beforeEach(function() {
                Object.keys(testParameters).forEach(function(key) {
                    paramsLocationController.setParameter(key, testParameters[key]);
                });
            });
            it('should remove parameter', function() {
                Object.keys(testParameters).forEach(function(key) {
                    paramsLocationController.removeParameter(key);
                    expect(paramsLocationController.getParameter(key)).to.be.undefined;
                });
            });
        });

        describe('removeParameterListener()', function() {
            var mockFunction;
            it('should remove parameter listener', function() {
                paramsLocationController.removeParameterListener("tmpParameter", mockFunction);
                expect(eventBusUnsubscribeSpy.callCount).to.equal(1);
            });
        });
    });
});