define([
    'rolemgmtlib/model/RoleModel',
    'i18n!rolemgmtlib/dictionary.json'
], function (RoleModel, dictionary) {
    'use strict';

    describe('RoleModel', function () {

    	var sandbox, roleModel, mockContext;
    	
        it('RoleModel should be defined', function () {
            expect(RoleModel).not.to.be.undefined;
        });

        beforeEach(function(){
            sandbox = sinon.sandbox.create();
        	roleModel = new RoleModel();
        });
        
        afterEach(function(){
        	roleModel.delete;
            sandbox.restore();
        });
        
        describe('initWithDefaults()', function () {
            beforeEach(function(){
            	roleModel.initWithDefaults();
            });

            it('Attributes should be set with defaults', function () {
                expect(roleModel.getName()).to.equal('');
                expect(roleModel.getDescription()).to.equal('');
                expect(roleModel.getType()).to.equal('notselected');
                expect(roleModel.getStatus()).to.equal('ENABLED');
            });

        });
        
        describe('isNew()', function () {
            beforeEach(function(){
            	sandbox.spy(roleModel, 'isNew');
            	roleModel.isNew();
            });

            it('Should check if model already exists.', function () {
            	expect(roleModel.isNew.callCount).to.equal(1);
            	expect(roleModel.isNew()).to.equal(true);
            });
        });

        describe('validate()', function () {      	
            beforeEach(function(){          	
            	sandbox.spy(roleModel, 'validateName');
            	sandbox.stub(roleModel, 'validateDescription');
            	sandbox.stub(roleModel, 'validateType');
            	roleModel.validate();
            });

            it('Should check if model already exists.', function () {
                expect(roleModel.validateName.callCount).to.equal(1);
                expect(roleModel.validateDescription.callCount).to.equal(1);
                expect(roleModel.validateType.callCount).to.equal(1);            
            });
        });

        describe('validateName()', function () {
        	
        	var name;
        	
            beforeEach(function(){          	
            	sandbox.stub(roleModel, 'getName', function () {
            		return name;
            	});
            });

            it('Should check that name is valid.', function () {
            	name = "name";

                expect(roleModel.validateName().valid).to.equal(true);
                expect(roleModel.validateName().errors.length).to.equal(0);
            });

            it('Should check that name is invalid - empty name.', function () {
            	name = '';

                expect(roleModel.validateName().valid).to.equal(false);
                expect(roleModel.validateName().errors.length).to.equal(1);
                expect(roleModel.validateName().errors[0]).to.equal(dictionary.roleModel.name_empty);
                //expect(roleModel.validateName().errors[1]).to.equal(dictionary.roleModel.name_not_match_pattern); TODO: test for allowed characters;
            });

            it('Should check that name is invalid - forbidden character.', function () {
            	name = 'name?';

                expect(roleModel.validateName().valid).to.equal(false);
                expect(roleModel.validateName().errors.length).to.equal(2);
                expect(roleModel.validateName().errors[0]).to.equal(dictionary.roleModel.name_not_match_pattern);
                expect(roleModel.validateName().errors[1]).to.equal(dictionary.roleModel.name_end_with_alphanumeric);
            });
        });

        describe('validateDescription()', function () {
        	var description;
        	
            beforeEach(function(){          	
            	sandbox.stub(roleModel, 'getDescription', function () {
            		return description;
            	});
            });

            it('Should check that description is valid.', function () {
            	description = "description";

                expect(roleModel.validateDescription().valid).to.equal(true);
                expect(roleModel.validateDescription().errors.length).to.equal(0);
            });

            it('Should check that description is invalid - empty description.', function () {
            	description = '';

                expect(roleModel.validateDescription().valid).to.equal(false);
                expect(roleModel.validateDescription().errors.length).to.equal(1);
                expect(roleModel.validateDescription().errors[0]).to.equal(dictionary.roleModel.description_empty);
                //expect(roleModel.validateDescription().errors[1]).to.equal(dictionary.roleModel.description_not_match_pattern); TODO: What with allowed char for description
            });
/* TODO: check if they exist
            it('Should check that description is invalid - forbidden character.', function () {
            	description = 'description?';

                expect(roleModel.validateDescription().valid).to.equal(false);
                expect(roleModel.validateDescription().errors.length).to.equal(1);
                expect(roleModel.validateDescription().errors[0]).to.equal(dictionary.roleModel.description_not_match_pattern);
            });*/
        });

        describe('validateType()', function () {
        	
        	var type, validateType;
        	
            beforeEach(function(){          	
            	sandbox.stub(roleModel, 'getType', function () {
            		return type;
            	});
            });
            
            it('Should check that type is valid if type is com', function () {
            	type = "com";
            	
            	validateType = roleModel.validateType();
            	
                expect(validateType.valid).to.equal(true);
                expect(validateType.errors.length).to.equal(0);
            });

            it('Should check that type is valid if type is comalias', function () {
            	type = "comalias";
            	
            	validateType = roleModel.validateType(type);

                expect(validateType.valid).to.equal(true);
                expect(validateType.errors.length).to.equal(0);
            });

            it('Should check that type is invalid when method was called without argument.', function () {
            	type = '';

            	validateType = roleModel.validateType(type);
            	
                expect(validateType.valid).to.equal(false);
                expect(validateType.errors.length).to.equal(1);
                expect(validateType.errors[0]).to.equal(dictionary.roleModel.type_not_selected);
            });
        });
    });

});