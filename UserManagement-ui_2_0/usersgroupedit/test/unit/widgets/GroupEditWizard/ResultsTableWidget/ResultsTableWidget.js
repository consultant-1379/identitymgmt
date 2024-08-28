define([
    'jscore/core',
    'usersgroupedit/widgets/GroupEditWizard/ResultsTableWidget/ResultsTableWidget',
    'tablelib/Table',
    'i18n!/usersgroupedit/app.json',
    'identitymgmtlib/Utils'
], function(core, ResultsTableWidget, Table, Dictionary, Utils){
    "use strict";

    describe('ResultsTableWidget', function() {
        var sandbox, resultsTableWidget, elementStub, functionStub;
        beforeEach(function() {
            var userData = {
                userToUpdate: [
                    {
                       username:"MockUserName1",
                       name:"MockName1",
                       surname:"MockSurname1"
                    },{
                       username:"MockUserName2",
                       name:"MockName2",
                       surname:"MockSurname2"
                    },{
                       username:"MockUserName3",
                       name:"MockName3",
                       surname:"MockSurname3"
            }]};
            var options ={
                model: {
                    get: function(key){return userData[key]},
                },
                responses: [{
                    success:true,
                    rowValue: 2,
                    xhr: "mock"
                }]
            };
            sandbox = sinon.sandbox.create();

            sandbox.spy(Table.prototype,'init');
            sandbox.spy(Table.prototype,'addEventHandler');
            sandbox.spy(Table.prototype,'attachTo');

            sandbox.stub(ResultsTableWidget.prototype,'parseDataForTable', function(){return [{
                    userData: userData.userToUpdate[0],
                    success:true,
                    xhr:"mock"
            },{
                userData: userData.userToUpdate[1],
                success:true,
                xhr:"mock"
            },{
                userData: userData.userToUpdate[2],
                success:true,
                xhr:"mock"
            }]});

            sandbox.spy(options.model,'get');
            resultsTableWidget = new ResultsTableWidget(options);

            elementStub = new core.Element('div');

            functionStub = {
               find: function(){return elementStub;}
            };

            sandbox.spy(functionStub,'find');
            sandbox.spy(elementStub,'setText');
            sandbox.stub(resultsTableWidget,'addTableEventHandlers');
            sandbox.stub(resultsTableWidget,'getElement', function(){return functionStub;});


        });

        afterEach(function() {
            sandbox.restore();
        });

        it('ResultsTableWidget should be defined', function() {
            expect(ResultsTableWidget).not.to.be.null;
            expect(ResultsTableWidget).not.to.be.undefined;
        });

         describe('setupTable()', function() {
             it('Should initialize table and add event handlers to this', function() {
                 resultsTableWidget.setupTable();
                 expect(resultsTableWidget.addTableEventHandlers.callCount).to.equal(1);
             });
         });


        describe('onViewReady()', function() {
           
            it('Should prepare view and add sort event handler to Table', function(){
                expect(Table.prototype.addEventHandler.callCount).to.equal(1);
                expect(Table.prototype.addEventHandler.getCall(0).args[0]).to.equal('sort');
                var output = Table.prototype.addEventHandler.getCall(0).args[1];
                expect(output).not.to.be.null;

            });
            it('Should attach table to view', function() {
                expect(Table.prototype.attachTo.callCount).to.equal(1);
            });

        });


        describe('setTopResultsBarNumbers()', function() {
            var total, resultSuccessCount;
            beforeEach(function() {
                total = 5;
                resultSuccessCount = 4;
                resultsTableWidget.setTopResultsBarNumbers(total, resultSuccessCount);
            });
            it('Should find proper elements and set Text there', function() {
                expect(resultsTableWidget.getElement.callCount).to.equal(3);
                expect(functionStub.find.callCount).to.equal(3);
                expect(elementStub.setText.callCount).to.equal(3);
            });

            it('Should set text on view with information about how many total result was', function() {
                expect(elementStub.setText.getCall(0).args[0]).to.equal(Utils.printf(Dictionary.applyStep.total, total ));
            });
            it('Should set text on view with information about how many success result was', function() {
                expect(elementStub.setText.getCall(1).args[0]).to.equal(Utils.printf(Dictionary.applyStep.successful,resultSuccessCount));
            });
            it('Should set text on view with information about how many failed result was', function() {
                expect(elementStub.setText.getCall(2).args[0]).to.equal(Utils.printf(Dictionary.applyStep.failed , (total - resultSuccessCount)) );
            });
        });
    });
});