define([
    'jscore/core',
    'uit!./loginFilterPlugin.html',
    'jscore/ext/privateStore',
    "i18n!identitymgmtlib/common.json",
    'identitymgmtlib/filters/FilterPlugin'
], function(core, View, PrivateStore, Dictionary, FilterPlugin) {

    var _ = PrivateStore.create();

    return FilterPlugin.extend({

        init: function(options) {
            FilterPlugin.prototype.init.call(this, options);

            if (!options.group) {
                throw 'Element of radio list has not set group. Set the group! Element: "' + options.title + '"';
            }

            this.view = new View({
                title: options.title,
                addHeader: !options.useAccordion,
                group: options.group,
                Dictionary: Dictionary.filters
            });
        },

        onStart: function() {

        },

        updateValue: function(query) {
            if (query && query[this.name]) {
                if (typeof query[this.name][0] === 'string') {
                    if (query[this.name][0] === 'NEVER_LOGGED_IN') {
                        _(this).neverLoggedInCheckbox.setProperty('checked', true);
                        _(this).loggedWithinDayInput.setValue(0);
                    } else if (query[this.name][0] === 'ALL') {
                        this.setAllOption();
                        _(this).loggedWithinDayInput.setValue(0);
                    }
                } else {
                    if (query[this.name][0].LOGGED_WITHIN !== undefined) {
                        _(this).loggedWithinCheckbox.setProperty('checked', true);
                        _(this).loggedWithinDayInput.setValue(query[this.name][0].LOGGED_WITHIN);
                    } else {
                        this.setAllOption();
                        _(this).loggedWithinDayInput.setValue(0);
                    }
                }
            } else {
                this.setAllOption();
                _(this).loggedWithinDayInput.setValue(0);
            }
        },
        onViewReady: function() {
            _(this).neverLoggedInCheckbox = this.view.findById('neverLoggedIn');
            _(this).loggedWithinCheckbox = this.view.findById('loggedWithin');
            _(this).loggedWithinDayInput = this.view.findById('loggedWithinDayInput');
            _(this).allOption = this.view.findById('allOption');

            _initWithDefaults.call(this);
            _(this).loggedWithinDayInput.addEventHandler('input', dynamicInputValidation.bind(this));
        },

        getData: function() {
            var result = {};
            result[this.name] = [];

            if (_(this).neverLoggedInCheckbox.getProperty('checked')) {
                result[this.name].push("NEVER_LOGGED_IN");
            }

            var daysInput = _(this).loggedWithinDayInput.getValue();
            if (_(this).loggedWithinCheckbox.getProperty('checked')) {
                result[this.name].push({
                    LOGGED_WITHIN: parseInt(daysInput, 10)
                });
            }

            if (result[this.name] && result[this.name].length > 0) {
                return result;
            }
        },

        clear: function() {
            this.setAllOption();
            _(this).loggedWithinDayInput.setValue(0);
        },

        setAllOption: function() {
            _(this).neverLoggedInCheckbox.setProperty('checked', false);
            _(this).loggedWithinCheckbox.setProperty('checked', false);
            _(this).allOption.setProperty('checked', true);
        }
    });

    function _initWithDefaults() {
        if (this.defaultValue) {
            _(this).neverLoggedInCheckbox.setProperty('checked',
                this.defaultValue.some(function(value) {
                    return value === "NEVER_LOGGED_IN";
                }));

            this.defaultValue.forEach(function(value) {
                if (value.LOGGED_WITHIN !== undefined) {
                    _(this).loggedWithinCheckbox.setProperty('checked', true);
                    _(this).loggedWithinDayInput.setValue(value.LOGGED_WITHIN);
                } else {
                    _(this).loggedWithinDayInput.setValue(0);
                }
            }.bind(this));
        } else {
            this.setAllOption();
            _(this).loggedWithinDayInput.setValue(0);
        }
    }

    function dynamicInputValidation() {
        var input = _(this).loggedWithinDayInput.getValue();
        var inputValueAsNumber, isNumber;
        if (input === "") {
            inputValueAsNumber = "";
            isNumber = false;
        } else {
            inputValueAsNumber = parseNumericInput(input);
            isNumber = !isNaN(inputValueAsNumber);
        }

        if (!isNumber) {
            if (inputValueAsNumber !== "") {
                inputValueAsNumber = 0;
            }
        } else {
            inputValueAsNumber = trimInputToOneYearRange(inputValueAsNumber);
        }
        _(this).loggedWithinDayInput.setValue(inputValueAsNumber);
    }

    function parseNumericInput(input) {
        var result = input.match(/^(\d)+/);
        if (result !== null && result.length > 0) {
            return result[0];
        } else {
            return NaN;
        }
    }

    function trimInputToOneYearRange(inputValueAsNumber) {
        if (inputValueAsNumber.length > 3) {
            inputValueAsNumber = inputValueAsNumber.slice(0, 3);
        }
        if (inputValueAsNumber > 365) {
            inputValueAsNumber = 365;
        }
        if (inputValueAsNumber < 0) {
            inputValueAsNumber = 0;
        }
        return inputValueAsNumber;
    }
});
