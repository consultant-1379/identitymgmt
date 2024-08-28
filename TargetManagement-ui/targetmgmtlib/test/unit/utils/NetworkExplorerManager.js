define([
    'jscore/core',
    "i18n!targetmgmtlib/dictionary.json",
    'targetmgmtlib/NetworkExplorerManager'
], function (core, dictionary, NetworkExplorerManager) {
    'use strict';

    describe('NetworkExplorerManager', function () {
        var sandbox, mockConfig;
        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            mockConfig = {
                success: sandbox.stub(),
                error: sandbox.stub()
            }
        });
        //Prepare fake server for
        //    collections: [1001, 1002, 1003, 1004]
        //    savedsearches: [2001, 2002, 2003, 2004]

        it('should be defined', function() {
            expect(NetworkExplorerManager).to.be.defined;
        });

        describe('reloadTargets()', function (){
            describe('config type is set to "collections"', function() {
                //Set collection type for mockConfig
                mockConfig.type = 'collections';

                it('should reload multiple ids', function(){
                    //Set proper type
                    mockConfig.data = "[1001, 1002, 1003]";
                    
                    //Do stuff
                    expect()

                });

                it('should reload single id', function() {

                });
                it('should call success callback', function () {

                });
                it('should call error callback', function () {

                });
            });
            describe('config type is set to "savedsearch"', function () {
                it('should reload multiple ids', function () {

                });
                it('should reload single id', function () {

                });
                it('should call success callback', function () {

                });
                it('should call error callback', function () {

                });
            });
        });
    });
});
