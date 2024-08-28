define([
    'jscore/core',
    'jscore/ext/net',
    'identitymgmtlib/widgets/PasswordPolicyListWidget/PasswordPolicyListWidget'
], function(core, net, PasswordPolicyListWidget) {
    'use strict';

    describe('PasswordPolicyListWidget', function() {

        var passwordPolicyListWidget,
            dictionary,
            sandbox;

        it("PasswordPolicyListWidget shoud be defined", function() {
            expect(PasswordPolicyListWidget).not.to.be.undefined;
        });

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            passwordPolicyListWidget = new PasswordPolicyListWidget({
                // dictionary: dictionary,
            });
        });

        afterEach(function() {
            sandbox.restore();
            passwordPolicyListWidget.delete;
        });


		describe("UpdatePolicy", function(){
				it("validateInput Policy", function(){
					expect(true).to.equal(passwordPolicyListWidget.updatePolicy("minimumLength", true));
					expect(false).to.equal(passwordPolicyListWidget.updatePolicy("minimumLowerCase", false));
					expect(false).to.equal(passwordPolicyListWidget.updatePolicy("minimumLength", false));
				});
			});
	});
})

