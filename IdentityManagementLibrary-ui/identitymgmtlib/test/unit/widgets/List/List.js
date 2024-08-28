define([
    'jscore/core',
    'identitymgmtlib/widgets/List/List'
], function(core, List) {
    'use strict';

    describe('List', function() {
        it('should be defined', function() {
            expect(List).not.to.be.undefined;
        });

        var sandbox,list,emptyOptions,testOptions,testOptionsWithSorting;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            testOptions = {
                elements: [{name:'elem1'},{name:'elem3'},{name:'elem2'}]
            };

            testOptionsWithSorting = {
                sortFunction: function(a, b) {
                    return a.name.localeCompare(b.name);
                },
                elements: [{name:'elem1'},{name:'elem3'},{name:'elem2'}]
            };

        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('init()', function() {
            it('should correcly set internal variables', function() {
                list = new List(testOptions);

                expect(list.elements).to.equal(testOptions.elements);
                expect(list.elements.length).to.equal(3);
                expect(list.elements[0].name).to.equal('elem1');
                expect(list.elements[1].name).to.equal('elem3');
                expect(list.elements[2].name).to.equal('elem2');
                expect(list.view).not.to.be.undefined;
                expect(list.view).not.to.be.null;
            });

            it('should sort elements in case sorting function is set and then set internal variables', function() {
                list = new List(testOptionsWithSorting);

                expect(list.elements.length).to.equal(3);
                expect(list.elements[0].name).to.equal('elem1');
                expect(list.elements[1].name).to.equal('elem2');
                expect(list.elements[2].name).to.equal('elem3');
                expect(list.view).not.to.be.undefined;
                expect(list.view).not.to.be.null;
            });
        });

        describe('getElements()', function() {
            beforeEach(function() {
                list = new List(testOptions);
            });

            it('should return elements set in constructor', function() {
                var output = list.getElements();

                expect(output).to.equal(testOptions.elements);
            });
        });

    });

});
