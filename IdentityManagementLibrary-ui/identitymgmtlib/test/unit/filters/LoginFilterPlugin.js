define([
    'identitymgmtlib/filters/LoginFilterPlugin',
    "i18n!identitymgmtlib/common.json",
    'jscore/core'
], function(LoginFilterPlugin, Dictionary, core) {
    'use strict';
    describe('LoginFilterPlugin', function() {
        var sandbox, loginFilterPlugin;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            loginFilterPlugin = new LoginFilterPlugin({
                expandOnStart: true,
                title: Dictionary.filters.login.title,
                name: "lastLogin",
                defaultValue: undefined,
                group: 'login'
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('should be defined', function() {
            expect(LoginFilterPlugin).to.be.defined;
            expect(LoginFilterPlugin).not.to.be.null;
        });

        it('should return undefined if nothing is checked', function() {
            expect(loginFilterPlugin.getData()).to.be.equal(undefined);
        });

        it('should return NEVER_LOGGED_IN field when it is checked', function() {
            setCheckboxState.call(this, 'neverLoggedIn', true);

            expect(loginFilterPlugin.getData()).to.be.deep.equal({
                lastLogin: ["NEVER_LOGGED_IN"]
            });
        });
// TODO: uncomment when LOGIN_WITHIN functionality added
//        it('should return LOGIN_WITHIN with specified value', function() {
//            setCheckboxState.call(this, 'loggedWithinCheckBox', true);
//            setViewElementText.call(this, 'loggedWithinDayInput', 44);
//
//            expect(loginFilterPlugin.getData()).to.be.deep.equal({
//                login: [{LOGGED_WITHIN: 44}]
//            });
//        });

        it('should return object with filter criteria', function() {
            setCheckboxState.call(this, 'neverLoggedIn', true);
//            setCheckboxState.call(this, 'loggedWithinCheckBox', true);
//            setViewElementText.call(this, 'loggedWithinDayInput', 44);

            expect(loginFilterPlugin.getData()).to.be.deep.equal({
                lastLogin: ["NEVER_LOGGED_IN"]
            });
        });

        it('should return undefined when filters are set and then cleared', function() {
            setCheckboxState.call(this, 'allOption', true);
//            setCheckboxState.call(this, 'loggedWithinCheckBox', true);
//            setViewElementText.call(this, 'loggedWithinDayInput', 44);
            loginFilterPlugin.clear();

            expect(loginFilterPlugin.getData()).to.be.equal(undefined);
        });

//        it('should return undefined when non-numeric value is set as logged within time', function () {
//            setCheckboxState.call(this, 'loggedWithinCheckBox', true);
//            setViewElementText.call(this, 'loggedWithinDayInput', "textValue");
//
//            expect(loginFilterPlugin.getData()).to.be.equal(undefined);
//        });
//
//        it('should return undefined when logged within value is set and checkbox is unchecked', function () {
//            setViewElementText.call(this, 'loggedWithinDayInput', "textValue");
//
//            expect(loginFilterPlugin.getData()).to.be.equal(undefined);
//        });

        describe('Default values', function() {
            it('should set never logged to checked', function() {
                loginFilterPlugin = new LoginFilterPlugin({
                    expandOnStart: true,
                    title: Dictionary.filters.login.title,
                    name: "lastLogin",
                    defaultValue: ["NEVER_LOGGED_IN"],
                    group: 'login'
                });

                expect(loginFilterPlugin.getData()).to.be.deep.equal({
                    lastLogin: ["NEVER_LOGGED_IN"]
                });
            });

//            it('should set logged within value to specified value and check', function () {
//                loginFilterPlugin = new LoginFilterPlugin({
//                    expandOnStart: true,
//                    title: "Login",
//                    name: "lastLogin",
//                    defaultValue: [{LOGGED_WITHIN: 44}]
//                });
//
//                expect(loginFilterPlugin.getData()).to.be.deep.equal({
//                    login: [{LOGGED_WITHIN: 44}]
//                });
//            });
//
//            it('should set never logged in and logged within value to specified value and check', function () {
//                loginFilterPlugin = new LoginFilterPlugin({
//                    expandOnStart: true,
//                    title: "Login",
//                    name: "login",
//                    defaultValue: ["NEVER_LOGGED_IN", {LOGGED_WITHIN: 44}]
//                });
//
//                expect(loginFilterPlugin.getData()).to.be.deep.equal({
//                    login: ["NEVER_LOGGED_IN", {LOGGED_WITHIN: 44}]
//                });
//            });
        });

//        describe('Logged within field validation', function() {
//            it('should not modify correct value', function() {
//                setViewElementText.call(this, 'loggedWithinDayInput', 44);
//                getViewElement('loggedWithinDayInput').trigger('input');
//                expect(getViewElementText('loggedWithinDayInput')).to.be.equal('44');
//            });
//
//            it('should allow only text values', function () {
//                setViewElementText.call(this, 'loggedWithinDayInput', 'textValue');
//                getViewElement('loggedWithinDayInput').trigger('input');
//                expect(getViewElementText('loggedWithinDayInput')).to.be.equal('0');
//            });
//
//            it('should allow values in range 0-365', function () {
//                setViewElementText.call(this, 'loggedWithinDayInput', 999);
//                getViewElement('loggedWithinDayInput').trigger('input');
//                expect(getViewElementText('loggedWithinDayInput')).to.be.equal('365');
//            });
//
//            it('should limit input to 3 characters', function () {
//                setViewElementText.call(this, 'loggedWithinDayInput', 1234);
//                getViewElement('loggedWithinDayInput').trigger('input');
//                expect(getViewElementText('loggedWithinDayInput')).to.be.equal('123');
//            });
//        });

        function setCheckboxState(elementId, isChecked) {
            getViewElement.call(this, elementId).setProperty('checked', isChecked);
        }

        function setViewElementText(elementId, text) {
            getViewElement.call(this, elementId).setValue(text);
        }

        function getViewElementText(elementId) {
            return getViewElement.call(this, elementId).getValue();
        }

        function getViewElement(elementId) {
            return loginFilterPlugin.view.findById(elementId);
        }
    });
});
