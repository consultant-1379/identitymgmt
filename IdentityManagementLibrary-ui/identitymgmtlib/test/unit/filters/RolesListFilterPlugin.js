define([
    'jscore/core',
    'identitymgmtlib/filters/RolesListFilterPlugin'
], function(core, RolesListFilterPlugin) {
    'use strict';

    describe('RolesListFilterPlugin', function() {
        var rolesListFilterPlugin, sandbox;

        beforeEach(function() {
            var options = {
                title: "mockTitle"
            }
            sandbox = sinon.sandbox.create();
            rolesListFilterPlugin = new RolesListFilterPlugin(options);



        });

        afterEach(function() {
            sandbox.restore();
        });

        it('RolesListFilterPlugin should be defined', function() {
            expect(RolesListFilterPlugin).not.to.be.undefined;
            expect(RolesListFilterPlugin).not.to.be.null;
        });
    });
});