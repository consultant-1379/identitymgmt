define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'uit!./checkListFilterPlugin.html',
    'identitymgmtlib/filters/FilterPlugin',
    'jscore/ext/privateStore'
], function(core, __, View, FilterPlugin, PrivateStore) {
    var _ = PrivateStore.create();

    //TODO: Implement behaviour of applyOnChange, applyOnEnter events later
    function parseToId(name) {
        return name.trim().replace(/ /g, '_');
    }
    return FilterPlugin.extend({

        init: function(options) {
            FilterPlugin.prototype.init.call(this, options);
            _(this).elements = options.elements;


            _(this).elements.forEach(function(element) {
                element.id = parseToId(element.value);
            });

            this.view = new View({
                elements: _(this).elements,
                addHeader: !options.useAccordion,
                title: options.title
            });
        },

        getData: function() {
            var result = {};
            result[this.name] = [];

            _(this).elements.forEach(function(element) {
                if (this.view.findById(element.id).getProperty("checked")) {
                    if (element.value instanceof Array) {
                        result[this.name] = result[this.name].concat(element.value);
                    } else {
                        result[this.name].push(element.value);
                    }
                }
            }.bind(this));
            if (result[this.name].length > 0) {
                return result;
            }
        },

        onViewReady: function() {
            if (this.disableInactive) {
                _addDisablingEvents.call(this);
            }

            if (this.defaultValue !== undefined) {
                _initDefaultValues.call(this);
            }
        },

        clear: function() {
            _(this).elements.forEach(function(element) {
                this.view.findById(element.id).setProperty('checked', false);
            }.bind(this));
        },

        updateValue: function(query) {
            if (query && query[this.name]) {
                this.clear();
                query[this.name].forEach(function(toSet) {
                    _(this).elements.some(function(element) {
                        if (element.id === parseToId(toSet)) {
                            this.view.findById(element.id).setProperty('checked', true);
                            return true;
                        }
                    }.bind(this));
                }.bind(this));
            } else {
                _initDefaultValues.call(this);
            }
        }
    });

    function _checkDefaults(element) {
        return this.defaultValue === undefined ?
            undefined : this.defaultValue.some(function(value) {
                return value === element.value;
            });
    }

    function _initDefaultValues() {
        _(this).elements.forEach(function(element) {
            if (_checkDefaults.call(this, element)) {
                this.view.findById(element.id).setProperty('checked', true);
                if (this.disableInactive) {
                    _toggleOthers.call(this, element);
                }
            }
        }.bind(this));
    }

    function _addDisablingEvents() {
        _(this).elements.forEach(function(element) {
            this.view.findById(element.id).addEventHandler('change', _toggleOthers.bind(this, element));
        }.bind(this));
    }

    function _toggleOthers(element) {
        var elementsToToggle = _(this).elements.filter(function(el) {
            return (el !== element);
        });

        elementsToToggle.forEach(function(el) {
            this.view.findById(el.id).setProperty('disabled',
                this.view.findById(element.id).getProperty('checked'));
        }.bind(this));

    }
});
