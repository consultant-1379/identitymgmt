define([
    'usersgroupedit/groupEditWizardUtils',
], function (GroupEditWizardUtils) {
    'use strict';

        describe('groupEditWizardUtils', function() {
            var sandbox, wizardStub, headerStub, modelStubNotChanged, modelStubChanged;

            beforeEach(function() {
                sandbox = sinon.sandbox.create();

                modelStubNotChanged = {
                     isChangedModel: function() {return false},
                };

                modelStubChanged = {
                     isChangedModel: function() {return true},
                };

                headerStub = {
                    setEnabled: function(){}
                };

                wizardStub ={
                    _steps: [ {header: headerStub }, {header: headerStub }, {header: headerStub }, {header: headerStub }, {header: headerStub }],
                    setStep: function(){}
                };


                sandbox.spy(headerStub,'setEnabled');
                sandbox.spy(wizardStub,'setStep');
            });

            afterEach(function() {
               sandbox.restore();

            });

            describe('enableStep', function() {
                it('Should enable header', function() {
                    GroupEditWizardUtils.enableStep(wizardStub, 0, true);
                    expect(headerStub.setEnabled.callCount).to.equal(1);
                });
            });

            describe('enableAuthenticationStep', function() {
                it('Should enable Authentication Step', function() {
                    GroupEditWizardUtils.enableAuthenticationStep(wizardStub);
                    expect(headerStub.setEnabled.callCount).to.equal(1);
                });
            });

            describe('enableSummaryStep', function() {
                it('Should not enable Summary Step', function() {
                    headerStub.setEnabled.reset();
                    GroupEditWizardUtils.enableSummaryStep(wizardStub, modelStubNotChanged);
                    expect(headerStub.setEnabled.getCall(0).args[0]).to.equal(false);
                });

                it('Should enable Summary Step', function() {
                    headerStub.setEnabled.reset();
                    GroupEditWizardUtils.enableSummaryStep(wizardStub, modelStubChanged);
                    expect(headerStub.setEnabled.getCall(0).args[0]).to.equal(true);
                });
            });

            describe('goToApplyStep', function() {
                it('Should go to Apply Step', function() {
                    GroupEditWizardUtils.goToApplyStep(wizardStub);
                    expect(wizardStub.setStep.callCount).to.equal(1);
                });
            });

        });

});
