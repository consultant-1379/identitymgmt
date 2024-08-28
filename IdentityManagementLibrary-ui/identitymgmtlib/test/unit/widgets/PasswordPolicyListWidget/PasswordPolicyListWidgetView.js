define([
    'jscore/core',
    'identitymgmtlib/widgets/PasswordPolicyValidationWidget/PasswordPolicyValidationWidgetView'
], function(core, PasswordPolicyValidationWidgetView) {
    'use strict';

    describe('PasswordPolicyValidationWidgetView', function() {
        it('should be defined', function() {
            expect(PasswordPolicyValidationWidget).not.to.be.undefined;
        });

        var sandbox,PasswordPolicyValidationWidgetview;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            // passwordPolicyValidationWidget = new PasswordPolicyValidationWidgetView();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getTemplate()', function() {
            it('should return defined object', function() {
                var output = PasswordPolicyValidationWidgetview.getTemplate();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

        describe('getStyle()', function() {
            it('should return defined object', function() {
                var output = PasswordPolicyValidationWidgetview.getStyle();

                expect(output).not.to.be.undefined;
                expect(output).not.to.be.null;
            });
        });

    });

});
