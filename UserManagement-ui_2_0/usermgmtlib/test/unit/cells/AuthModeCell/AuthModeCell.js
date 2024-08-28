/*global define, describe, it, expect */
define([
    'usermgmtlib/cells/AuthModeCell/AuthModeCell',
    'usermgmtlib/Dictionary'
], function(AuthModeCell, Dictionary) {
    'use strict';

    describe('AuthModeCell', function() {

        describe('init', function() {
            it('AuthModeCell should be defined', function() {
                expect(AuthModeCell).not.to.be.undefined;
            });
        });

        describe('setValue() local', function() {
            it('Should local cell', function() {
                var authModeCell = new AuthModeCell();
                authModeCell.setValue('local');

                expect(authModeCell.view.getCaption().getText()).to.equal(Dictionary.local);
            });
        });
        describe('setValue() remote', function() {
            it('Should remote cell', function() {
                var authModeCell = new AuthModeCell();
                authModeCell.setValue('remote');

                expect(authModeCell.view.getCaption().getText()).to.equal(Dictionary.remote);
            });
        });
        describe('setValue() federated', function() {
            it('Should federated cell', function() {
                var authModeCell = new AuthModeCell();
                authModeCell.setValue('federated');

                expect(authModeCell.view.getCaption().getText()).to.equal(Dictionary.federated);
            });
        });
    });
});