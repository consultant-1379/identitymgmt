define([
    'usermgmtlib/widgets/ExpandableNotification'
], function(ExpandableNotification) {
    "use strict";

    describe('ExpandableNotification', function() {
        var sandbox, expandableNotification, options;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            options = {
                label: "label"
            };
            expandableNotification = new ExpandableNotification(options);
            sandbox.spy(expandableNotification.getElement().find('.ebNotification-content'), 'setStyle');
            sandbox.spy(expandableNotification.getElement().find('.ebNotification-content').getParent(), 'setStyle');
            sandbox.spy(expandableNotification.view.getLabel(), 'setStyle');
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('should be defined', function() {
            expect(ExpandableNotification).to.be.defined;
        });

        it('should be expanded', function() {
            expandableNotification.expand();

            expect(expandableNotification.getElement().find('.ebNotification-content').setStyle.getCall(0).args[1]).to.equal('block');
            expect(expandableNotification.getElement().find('.ebNotification-content').getParent().setStyle.getCall(0).args[1]).to.equal('block');
            expect(expandableNotification.view.getLabel().setStyle.getCall(0).args[1]).to.equal('none');
        });
    });
});