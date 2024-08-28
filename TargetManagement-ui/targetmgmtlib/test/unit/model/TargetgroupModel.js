define([
    'targetmgmtlib/model/TargetgroupModel',
    "i18n!targetmgmtlib/dictionary.json",
], function (TargetgroupModel, dictionary) {
    'use strict';

    describe('TargetgroupModel', function () {
        var sandbox, targetGroupModel;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            targetGroupModel = new TargetgroupModel({id: "mockId"});

            sandbox.spy(targetGroupModel, 'setAttribute');
            sandbox.spy(targetGroupModel, 'getAttribute');
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('TargetGroupModel should be defined', function () {
            expect(targetGroupModel).not.to.be.undefined;
        });

        describe('getId()', function() {
            it('should get proper id', function() {
                expect(targetGroupModel.getId()).to.equal("mockId");
            });
        });

        describe('getName()', function() {
            var mockName = "mockName";
            it('should get proper name', function() {
                targetGroupModel.setAttribute('name', mockName);
                expect(targetGroupModel.getName()).to.equal(mockName);
            });
        });

        describe('setName()', function() {
            var mockName = "mockName";
            it('should set proper name', function() {
                targetGroupModel.setName(mockName);
                expect(targetGroupModel.setAttribute.calledOnce).to.equal(true);
                expect(targetGroupModel.setAttribute.getCall(0).args[0]).to.equal('name');
                expect(targetGroupModel.setAttribute.getCall(0).args[1]).to.equal(mockName);
            });
        });

        describe('getDescription()', function() {
            var mockDescription = "mockDescription";
            it('should set proper description', function() {
                targetGroupModel.setAttribute('description', mockDescription);
                expect(targetGroupModel.getDescription()).to.equal(mockDescription);
            });
        });

        describe('setDescription()', function() {
            var mockDescription = "mockDescription";
            it('should set proper description', function() {
                targetGroupModel.setDescription(mockDescription);
                expect(targetGroupModel.setAttribute.calledOnce).to.equal(true);
                expect(targetGroupModel.setAttribute.getCall(0).args[0]).to.equal('description');
                expect(targetGroupModel.setAttribute.getCall(0).args[1]).to.equal(mockDescription);
            });
        });

        describe('validate()', function() {
            var result;

            function commonExpects() {
                expect(targetGroupModel.getAttribute.calledTwice).to.equal(true);
                expect(targetGroupModel.getAttribute.getCall(0).args[0]).to.equal('name');
                expect(targetGroupModel.getAttribute.getCall(1).args[0]).to.equal('description');
            }

            it('should return empty object when all is correct', function() {
                targetGroupModel.setAttribute('name', 'correctName');
                targetGroupModel.setAttribute('description', "correctDescription");

                result = targetGroupModel.validate();
                commonExpects();
                expect(result).to.deep.equal({});
            });

            it('should return error - name empty', function() {
                targetGroupModel.setAttribute('name', '');
                targetGroupModel.setAttribute('description', "correctDescription");

                result = targetGroupModel.validate();
                commonExpects();
                expect(result).to.deep.equal({name: dictionary.targetgroupModel.name_empty});
            });

            it('should return error - name contains forbidden chars', function() {
                targetGroupModel.setAttribute('name', 'wrong$$$Name');
                targetGroupModel.setAttribute('description', "correctDescription");

                result = targetGroupModel.validate();
                commonExpects();
                expect(result).to.deep.equal({name: dictionary.targetgroupModel.name_not_match_pattern});
            });


            it('should return error - first char incorrect', function() {
                targetGroupModel.setAttribute('name', '-wrongName');
                targetGroupModel.setAttribute('description', "correctDescription");

                result = targetGroupModel.validate();
                commonExpects();
                expect(result).to.deep.equal({name: dictionary.targetgroupModel.name_not_start_with_letter});
            });


            it('should return error - last char incorrect', function() {
                targetGroupModel.setAttribute('name', 'wrongName-');
                targetGroupModel.setAttribute('description', "correctDescription");

                result = targetGroupModel.validate();
                commonExpects();
                expect(result).to.deep.equal({name: dictionary.targetgroupModel.name_end_with_alphanumeric});
            });


            it('should return error - description empty', function() {
                targetGroupModel.setAttribute('name', 'correctName');
                targetGroupModel.setAttribute('description', '');

                result = targetGroupModel.validate();
                commonExpects();
                expect(result).to.deep.equal({description: dictionary.targetgroupModel.description_empty});
            });

            it('should return error - name and description empty', function() {
                targetGroupModel.setAttribute('name', '');
                targetGroupModel.setAttribute('description', '');

                result = targetGroupModel.validate();
                commonExpects();
                expect(result).to.deep.equal({
                    name: dictionary.targetgroupModel.name_empty,
                    description: dictionary.targetgroupModel.description_empty
                });
            });
        });
    });
});