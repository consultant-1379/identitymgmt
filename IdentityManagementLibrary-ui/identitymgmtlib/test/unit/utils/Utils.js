define([
    'identitymgmtlib/utils/Utils'
], function( Utils) {

    describe('Utils', function() {
        var sandbox;

        beforeEach(function() {
           sandbox = sinon.sandbox.create();

        });

        afterEach(function() {
           sandbox.restore();

        });

        describe('Check Role is service Role ', function() {
            it('Should return true for a Service Role', function() {

                var model ={
                    'type': 'system'
                };
                var modelStub = {
                     get: function(type){return model.type;},
                     getAttribute: function(str){return undefined;}
                };
                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'getAttribute');

                var resp = Utils.isServiceRole(modelStub);
                       
                expect(resp).not.to.be.undefined;
                expect(resp).to.equal(true); 
            });
            it('Should return true for a role with privileges', function() {

                var model ={
                    'type': 'system'
                };
                var modelStub = {
                     get: function(type){return model.type;},
                     getAttribute: function(str){return {'role':'myrole','targetgroup':'tg1'};}
                };
                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'getAttribute');

                var resp = Utils.isServiceRole(modelStub);
                       
                expect(resp).not.to.be.undefined;
                expect(resp).to.equal(true); 
            });     
            it('Should return false for a COMRole', function() {

                var model ={
                    'type': 'comrole'
                };
                var modelStub = {
                     get: function(type){return model.type;},
                     getAttribute: function(str){return undefined;}
                };
                sandbox.spy(modelStub,'get');
                sandbox.spy(modelStub,'getAttribute');

                var resp = Utils.isServiceRole(modelStub);

                expect(resp).not.to.be.undefined;
                expect(resp).to.equal(false);
            });
        });

        describe('ReplaceAll ', function() {
            it('Should replace all occurence', function() {
                var word = "paolaaaaeerraa**&&&6";
                var newWord = Utils.replaceALL(word, 'a', "$$$");
                expect(newWord).not.to.be.undefined;
                expect(newWord.includes('a')).to.equal(false);
            });
        });


        // describe('Check Assigned Target Group', function() {
        //     it('Should return true for a Service Role', function() {

        //         var model = {
        //             'type': 'system',
        //             'tgs': 'ALL'
        //         };
        //         var modelStub = {
        //              get: function(str){return model.str;}
        //              getAttribute: function(str){return undefined;}
        //         };
        //        sandbox.spy(modelStub,'get');
        //        sandbox.spy(modelStub,'getAttribute');

        //        var resp = Utils.getAssignedTgsValue(modelStub);
                       
        //        expect(resp).not.to.be.undefined;
        //        expect(resp).to.equal('ALL'); 
        //     });
              
        //     it('Should return true for a Service Role', function() {

        //         var model = {
        //             'type': 'system',
        //             'tgs': {'tg1' 'tg2'}
        //         };
        //         var modelStub = {
        //              get: function(str){return model.str;}
        //              getAttribute: function(str){return undefined;}
        //         };
        //        sandbox.spy(modelStub,'get');
        //        sandbox.spy(modelStub,'getAttribute');

        //        var resp = Utils.getAssignedTgsValue(modelStub);
                       
        //        expect(resp).not.to.be.undefined;
        //        expect(resp).to.equal(2); 
        //     });
              
        // });

    });
});
