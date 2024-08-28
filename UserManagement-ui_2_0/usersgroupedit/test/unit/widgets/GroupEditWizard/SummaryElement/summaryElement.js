define([
    'jscore/core',
    'usersgroupedit/widgets/GroupEditWizard/SummaryElement/summaryElement'
], function(core, SummaryElement){
    "use strict";
    describe('SummaryElement', function() {
        var sandbox, options, summaryElement;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            options = {
                icon: 'MockIcon',
                message: 'MockMessage',
                value: 'MockValue'
            };
            summaryElement = new SummaryElement(options);
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('SummaryElement should be defined', function() {
            expect(SummaryElement).not.to.be.undefined;
            expect(SummaryElement).not.to.be.null;
        });

        it('Should initialize summary element with proper options', function() {
            expect(summaryElement.icon).to.equal('MockIcon');
            expect(summaryElement.message).to.equal('MockMessage');
            expect(summaryElement.value).to.equal('MockValue');
        });


    });

});