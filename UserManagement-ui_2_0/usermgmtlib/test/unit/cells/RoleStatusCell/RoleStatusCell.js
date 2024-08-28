/*global define, describe, it, expect */
define([
    'usermgmtlib/cells/RoleStatusCell/RoleStatusCell'
], function(RoleStatusCell) {
    'use strict';

    describe('RoleStatusCell', function() {

        describe('init', function() {
            it('StatusCell should be defined', function() {
                expect(RoleStatusCell).not.to.be.undefined;
            });
        });

        describe('setValue() enabled', function() {
            it('Should enable cell', function() {
                var roleStatusCell = new RoleStatusCell();
                roleStatusCell.setValue('ENABLED');

                expect(roleStatusCell.view.getCaption().getText()).to.equal('Enabled');
            });
        });
        describe('setValue() disabled', function() {
            it('Should enable cell', function() {
                var roleStatusCell = new RoleStatusCell();
                roleStatusCell.setValue('DISABLED');

                expect(roleStatusCell.view.getCaption().getText()).to.equal('Disabled');
            });
        });
        describe('setValue() disabled_assignment', function() {
            it('Should enable cell', function() {
                var roleStatusCell = new RoleStatusCell();
                roleStatusCell.setValue('DISABLED_ASSIGNMENT');

                expect(roleStatusCell.view.getCaption().getText()).to.equal('Not Assignable');
            });
        });
    });

});