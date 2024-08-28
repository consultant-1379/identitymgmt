/*global define, describe, it, expect */
define([
    'usermgmtlib/widgets/StatusUserCell/StatusUserCell'
], function(StatusUserCell) {
    'use strict';

    describe('StatusUserCell', function() {

        describe('init', function() {
            it('StatusCell should be defined', function() {
                expect(StatusUserCell).not.to.be.undefined;
            });
        });
    });

});