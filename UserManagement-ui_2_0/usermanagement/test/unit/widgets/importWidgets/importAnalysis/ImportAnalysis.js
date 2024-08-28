define([
    'usermanagement/widgets/importWidgets/importAnalysis/ImportAnalysis'
], function(ImportAnalysis) {
    "use strict";

    describe('ImportAnalysis', function() {
        var sandbox, importAnalysis, options;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('should be defined', function() {
            expect(ImportAnalysis).to.be.defined;
        });

        it('should create analysis widget with three warnings', function() {
            options = {
                analysisResult: {
                    allUsers: 75,
                    toBeCreated: 25,
                    toBeUpdated: 50,
                    toBeModified: {
                        security_administrators: ["user1", "user2"],
                        administrators: ["user1", "user2"],
                        operators: ["user1", "user2"]
                    }
                }
            };
            importAnalysis = new ImportAnalysis(options);

            expect(importAnalysis.getViewLinks().length).to.be.equal(3);
            expect(importAnalysis.getElement().findAll('.eaUsermanagement-wImportAnalysis-listContainer').length).to.be.equal(2);
        });

        it('should create analysis widget with no warnings', function() {
            options = {
                analysisResult: {
                    allUsers: 75,
                    toBeCreated: 25,
                    toBeUpdated: 50
                }
            };
            importAnalysis = new ImportAnalysis(options);

            expect(importAnalysis.getViewLinks().length).to.be.equal(0);
            expect(importAnalysis.getElement().findAll('.eaUsermanagement-wImportAnalysis-listContainer').length).to.be.equal(1);
        });

        it('should open dialog with username list', function() {
            options = {
                analysisResult: {
                    allUsers: 75,
                    toBeCreated: 25,
                    toBeUpdated: 50,
                    toBeModified: {
                        security_administrators: ["user1", "user2"],
                        administrators: ["user1", "user2"],
                        operators: ["user1", "user2"]
                    }
                }
            };
            importAnalysis = new ImportAnalysis(options);
            sandbox.spy(importAnalysis, "showUsernameListDialog");

            importAnalysis.getViewLinks()[0].trigger('click');

            expect(importAnalysis.showUsernameListDialog.calledOnce).to.equal(true);
        });
    });
});