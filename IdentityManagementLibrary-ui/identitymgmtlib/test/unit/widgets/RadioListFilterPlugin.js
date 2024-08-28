define([
    'identitymgmtlib/widgets/RadioListFilterPlugin'
], function(RadioListFilterPlugin){
    "use strict";

    describe("RadioListFilterPlugin", function(){
        var radioListFilterPlugin, sandbox;
        var radioListElements = [
            {
                title: 'ALL',
                value: "all",
                status: false,
                group: 'status'
            },
            {
                title: 'ENABLED',
                value: "enabled",
                status: false,
                group: 'status'
            },
            {
                title: 'DISABLED',
                value: "disabled",
                status: false,
                group: 'status'
            }
        ];

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            radioListFilterPlugin = new RadioListFilterPlugin({
                expandOnStart: true,
                title: "Status",
                name: "status",
                disableInactive: false,
                defaultValue: undefined,
                elements: radioListElements
            });
        });
        afterEach(function(){
            sandbox.restore();
        });

        it("RadioListFilterPlugin should be defined", function(){
            expect(RadioListFilterPlugin).not.to.be.null;
            expect(RadioListFilterPlugin).not.to.be.undefined;
        });

        describe('getData()', function(){
            it('Should return undefined if nothing is checked', function () {
                expect(radioListFilterPlugin.getData()).to.be.equal(undefined);
            });
            it('Should return undefined if checked element have all value', function(){
                setRadioState.call(this, 'all', true);
                expect(radioListFilterPlugin.getData()).to.be.equal(undefined);
            });
            it('Should return selected radio button', function(){
                setRadioState.call(this, 'all', false);
                setRadioState.call(this, 'disabled', true);
                expect(radioListFilterPlugin.getData()).to.be.deep.equal({
                    status: ["disabled"]
                });
            });

        });

        describe('setCheckedDefault()', function() {

            it("Should find checked element and set property to checked", function(){
                radioListElements = [
                    {
                        title: 'ALL',
                        value: "all",
                        status: false,
                        group: 'status'
                    },
                    {
                        title: 'ENABLED',
                        value: "enabled",
                        status: false,
                        group: 'status'
                    },
                    {
                        title: 'DISABLED',
                        value: "disabled",
                        status: false,
                        group: 'status',
                        checked: true
                    }
                ];

                radioListFilterPlugin = new RadioListFilterPlugin({
                    expandOnStart: true,
                    title: "Status",
                    name: "status",
                    disableInactive: false,
                    defaultValue: undefined,
                    elements: radioListElements
                });

                radioListFilterPlugin.setCheckedDefault();
                expect(radioListFilterPlugin.getData()).to.be.deep.equal({
                    status: ["disabled"]
                });
                expect(getRadioState.call(this,'all')).to.equal(false);
                expect(getRadioState.call(this,'enabled')).to.equal(false);
                expect(getRadioState.call(this,'disabled')).to.equal(true);
            });
        });



        describe('onViewReady()', function(){

            it('Should select defined default value', function(){
                radioListElements = [
                    {
                        title: 'ALL',
                        value: "all",
                        status: false,
                        group: 'status'
                    },
                    {
                        title: 'ENABLED',
                        value: "enabled",
                        status: false,
                        group: 'status'
                    },
                    {
                        title: 'DISABLED',
                        value: "disabled",
                        status: false,
                        group: 'status'
                    }
                ];
                radioListFilterPlugin = new RadioListFilterPlugin({
                    expandOnStart: true,
                    title: "Status",
                    name: "status",
                    disableInactive: false,
                    defaultValue: ['enabled'],
                    elements: radioListElements
                });
                expect(radioListFilterPlugin.getData()).to.be.deep.equal({
                    status: ["enabled"]
                });
            });
            it('Should set checked property for checked element', function(){
                radioListElements = [
                    {
                        title: 'ALL',
                        value: "all",
                        status: false,
                        group: 'status',
                        checked: true
                    },
                    {
                        title: 'ENABLED',
                        value: "enabled",
                        status: false,
                        group: 'status'
                    },
                    {
                        title: 'DISABLED',
                        value: "disabled",
                        status: false,
                        group: 'status'
                    }
                ];

                radioListFilterPlugin = new RadioListFilterPlugin({
                    expandOnStart: true,
                    title: "Status",
                    name: "status",
                    disableInactive: false,
                    defaultValue: undefined,
                    elements: radioListElements
                });

                expect(getRadioState.call(this,'all')).to.equal(true);
                expect(getRadioState.call(this,'enabled')).to.equal(false);
                expect(getRadioState.call(this,'disabled')).to.equal(false);
            });
        });

        describe('clear()', function() {
            beforeEach(function(){
                sandbox.spy(radioListFilterPlugin,'setCheckedDefault');
            });
            it('Should call setCheckedDefault function', function(){
                radioListFilterPlugin.clear();
                expect(radioListFilterPlugin.setCheckedDefault.callCount).to.equal(1);
            });
        });

        function setRadioState(radioName, isChecked) {
            getRadio.call(this, radioName).setProperty('checked', isChecked);
        }
        function getRadioState(radioName) {
            return getRadio.call(this, radioName).getProperty('checked');
        }

        function getRadio(radioName) {
            return radioListFilterPlugin.view.findById(radioName);
        }
    });
});
