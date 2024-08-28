define([
    'jscore/core',
    'uit!./radioListFilterPlugin.html',
    'identitymgmtlib/filters/FilterPlugin',
    'jscore/ext/privateStore'
], function(core, View, FilterPlugin, PrivateStore) {
    var _ = PrivateStore.create();

    //TODO: Implement behaviour of applyOnChange, applyOnEnter events later


    function _initDefaultValues() {
        this.view.findById(_(this).elements[0].id).setProperty('checked', true);
    }


    return FilterPlugin.extend({

        init: function(options) {
            FilterPlugin.prototype.init.call(this, options);
            _(this).elements = options.elements;

            _(this).elements.some(function(element) {
                if (!element.group) {
                    throw 'Element of radio list has not set group. Set the group! Element: "' + options.title + '"';
                }
            });

            _(this).elements.forEach(function(element) {
                element.id = element.value.trim().replace(/ /g, '_');
            });

            this.view = new View({
                elements: _(this).elements,
                addHeader: !options.useAccordion,
                title: options.title
            });
        },

        updateValue: function(query) {
            if (query && query[this.name]) {
                _(this).elements.forEach(function(element) {
                    if (element.id === query[this.name][0] && !this.view.findById(element.id).getProperty("checked")) {
                        this.view.findById(element.id).setProperty('checked', true);
                        return true;
                    }
                }.bind(this));
            } else {
                _initDefaultValues.call(this);
            }
        },

        setCheckedDefault: function() {
            _(this).elements.some(function(element) {
                if (element.checked) {
                    this.view.findById(element.id).setProperty("checked", true);
                } else {
                    this.view.findById(element.id).setProperty("checked", false);
                }
            }.bind(this));
        },

        getData: function() {
            var result = {};
            result[this.name] = [];

            _(this).elements.forEach(function(element) {
                if (this.view.findById(element.id).getProperty("checked")) {
                    if (element.value !== 'all') {
                        if (element.value instanceof Array) {
                            result[this.name] = result[this.name].concat(element.value);
                        } else {
                            result[this.name].push(element.value);
                        }
                    }
                }
            }.bind(this));
            if (result[this.name].length > 0) {
                return result;
            }
        },

        onViewReady: function() {
            if (_(this).elements.some(function(element) {
                    return element.checked;
                })) {
                this.setCheckedDefault();
            }
        },

        clear: function() {
            this.setCheckedDefault();
        }
    });
});
