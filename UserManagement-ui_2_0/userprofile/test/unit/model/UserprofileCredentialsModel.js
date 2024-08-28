define([
    'userprofile/model/UserprofileCredentialsModel',
    'userprofile/Dictionary',
    'jscore/ext/utils/base/underscore'
], function(UserprofileCredentialsModel, Dictionary, _){
    "use strict";

    describe('UserprofileCredentialsModel', function(){
        var sandbox, credentialModel;


        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            credentialModel = new UserprofileCredentialsModel();
        });

        afterEach(function(){
            sandbox.restore();
        });

        it('Model should be defined', function(){
            expect(UserprofileCredentialsModel).not.to.be.undefined;
            expect(UserprofileCredentialsModel).not.to.be.null;

        });

        describe('validate()', function(){
            it('Should return message for empty PKI entity One Time password', function(done){

                var callbackResolve = sinon.spy();
                var server = sinon.fakeServer.create();

                var outputPromise = credentialModel.validate(true, true);
                var verify = outputPromise.then(callbackResolve);

                server.respond();

                expect(outputPromise).not.to.be.undefined;
                expect(outputPromise).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(args.PKIEntityPassword.message).to.equal( Dictionary.credentialsForm.validator.empty_PKIEntity_password);
                    done();
                }).catch(done);
            });

            it('Should validate password for PKCS12 credentials format', function(done){

                sandbox.stub(_,'isEmpty', function(){return false;});
                sandbox.stub(credentialModel,'getPrevious');

                credentialModel.set('credentialsFormat', 'PKCS12');

                credentialModel.set('PKIEntityPassword', 'TestPassw0rd');

                credentialModel.set("newPassword","passw0rd123ASD");


                var callbackResolve = sinon.spy();
                var server = sinon.fakeServer.create();

                var outputPromise = credentialModel.validate(true, true);
                var verify = outputPromise.then(callbackResolve);

                server.respond();

                expect(outputPromise).not.to.be.undefined;
                expect(outputPromise).not.to.be.null;

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];

                    console.log('args', args);
                    done();
                }).catch(done);
            });

            it('Should resolve validate password for XML credentials format', function(done){
                sandbox.stub(_,'isEmpty', function(){return false;});
                credentialModel.set('credentialsFormat', 'XML');

                credentialModel.set('PKIEntityPassword', 'TestPassw0rd');

                var callbackResolve = sinon.spy();
                var server = sinon.fakeServer.create();

                var outputPromise = credentialModel.validate(true, true);
                var verify = outputPromise.then(callbackResolve);

                server.respond();

                expect(outputPromise).not.to.be.undefined;
                expect(outputPromise).not.to.be.null;

                var expected = {};

                verify.then(function() {
                    var args = callbackResolve.getCall(0).args[0];
                    expect(JSON.stringify(args)).to.equal('{}');
                    done();
                }).catch(done);
            });
        });

    });

});