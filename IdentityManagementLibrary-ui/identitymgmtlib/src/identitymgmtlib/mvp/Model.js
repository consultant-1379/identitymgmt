define([
    'jscore/ext/mvp',
    'jscore/ext/privateStore',
    'jscore/ext/utils/base/underscore',
    'jscore/ext/net'
], function(mvp, PrivateStore, _, net) {

    var __ = PrivateStore.create();

    var doSave = function(options) {
        net.ajax({
            url: this.url + (this.getSaveMode() === "create" ? "" : "/" + this.get(this.idAttribute)),
            type: this.getSaveMode() === "create" ? 'POST' : 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(this.toJSON()),
            success: function(data, xhr) {
                if (options.success) {
                    options.success(data, xhr);
                }
            },
            error: function(msg, xhr) {
                if (options.error) {
                    options.error(msg, xhr, false);
                }
            }
        });
    };

    var removeUndefinedFields = function(obj) {
        Object.keys(obj).forEach(function(key) {
            if (typeof obj[key] === 'undefined') {
                delete obj[key];
            }
        });
    };

    var triggerInvalidFieldEventsIfNeeded = function() {
        for (var attribute in __(this).currentValidateResults) {
            // trigger only was not previusly anounced with invalid event
            // or validation has been changed
            if (!(attribute in __(this).previousValidateResults) || !_.isEqual(__(this).currentValidateResults[attribute], __(this).previousValidateResults[attribute])) {
                this.trigger('invalid:' + attribute, __(this).currentValidateResults[attribute]);
            }
        }
    };

    var triggerValidFieldEventsIfNeeded = function(results) {
        // trigger 'valid' validation event for attribute if needed
        for (var attribute in __(this).previousValidateResults) {
            // trigger only when was not previusly anounced with valid event
            if (!(attribute in __(this).currentValidateResults)) {
                this.trigger('valid:' + attribute);
            }
        }
    };

    var triggerValidationEventsIfNeeded = function() {
        if (!_.isEqual(__(this).previousValidateResults, __(this).currentValidateResults) || this.forceValidEvents) {
            if (_.isEmpty(__(this).currentValidateResults)) {
                // if validate results are empty then trigger valid
                this.trigger('valid');
            } else {
                // otherwise trigger invalid
                this.trigger('invalid', __(this).currentValidateResults);
            }
        }
    };

    var handleValidationResults = function(results) {

        // remove undefined fields
        removeUndefinedFields.call(this, results);

        // store current validation results
        __(this).currentValidateResults = results;

        // trigger 'invalid' validation event for attribute if needed
        triggerInvalidFieldEventsIfNeeded.call(this);

        // trigger 'valid' validation event for attribute if needed
        triggerValidFieldEventsIfNeeded.call(this);

        // trigger general validation event if needed
        triggerValidationEventsIfNeeded.call(this);

        // update previous valiation results according to current results
        __(this).previousValidateResults = __(this).currentValidateResults;
    };

    var applyDefaults = function(attributes) {
        if (this.defaults) {
            var attrs = _.defaults(_.extend({}, this.defaults, attributes || {}), this.defaults);
            this.set(attrs);
        }
    };

    var subscribeForChangesToValidateModel = function() {
        // run validation when model changed
        this.addEventHandler('change', function() {
            if (this.validate) {
                var results = this.validate();
                // if result is instance of Promise then wait for resolve or reject
                // otherwise just call handleValiationResults
                //if (results instanceof Promise) {
                if (results.then && results.catch) {
                    results
                        .then(handleValidationResults.bind(this));
                    // .catch(handleValidationResults.bind(this));
                } else {
                    handleValidationResults.call(this, results);
                }
            }
        }.bind(this));
    };

    // TODO: do not check everytime in setAttribute if Promise or not
    // - promise handler
    // - regular handler

    return mvp.Model.extend({

        clear: function() {
            __(this).previousValidateResults = {};
            __(this).currentValidateResults = {};
            __(this).touched = {};
            __(this).editable = {};
            __(this).strictMode = false;
            __(this).previous = {};
        },

        init: function(attributes, options) {

            //clear model
            this.clear();

            // apply defaults if available
            applyDefaults.call(this, attributes);

            // subscribe for model changes to run validation
            subscribeForChangesToValidateModel.call(this);

            return mvp.Model.prototype.init.apply(this, arguments);
        },

        setAttribute: function(attr) {
            __(this).previous[attr] = _.clone(this.attributes[attr]);
            return mvp.Model.prototype.setAttribute.apply(this, arguments);
        },

        set: function(attr) {
            __(this).previous[attr] = _.clone(this.attributes[attr]);
            return mvp.Model.prototype.set.apply(this, arguments);
        },

        shouldBeValidated: function(attribute) {
            return ((this.isTouched(attribute) || this.isStrictMode()) && this.isEditable(attribute));
        },

        isStrictMode: function() {
            return __(this).strictMode;
        },

        setTouched: function(attribute) {
            __(this).touched[attribute] = true;
        },

        isTouched: function(attribute) {
            return attribute in __(this).touched;
        },

        isModified: function() {
            return !_.isEmpty(__(this).touched);
        },

        isEditable: function(attribute) {
            return attribute in __(this).editable;
        },

        setEditable: function(attribute) {
            __(this).editable[attribute] = true;
        },

        getPrevious: function(attribute) {
            return __(this).previous[attribute];
        },

        setSaveMode: function(mode) {
            __(this).saveMode = mode;
        },

        getSaveMode: function(mode) {
            return __(this).saveMode || "create";
        },


        save: function(attr, options) {
            __(this).strictMode = true;
            var valid = this.isValid(__(this).strictMode, true);
            //if (valid instanceof Promise) {
            if (valid.then && valid.catch) {
                valid.then(function(result) {
                    if (result) {
                        doSave.call(this, options);
                    } else {
                        // call same error when not valid
                        if (options.error) {
                            // TODO: put as arg validation results if failed
                            options.error(this, null, true);
                        }
                    }
                }.bind(this));
            } else {
                if (valid) {
                    doSave.call(this, options);
                } else {
                    // call same error when not valid
                    if (options.error) {
                        // TODO: put as arg validation results if failed
                        options.error(this, null, true);
                    }
                }
            }
        },

        isValid: function(strict, saveButton) {
            if (this.validate) {
                var results = this.validate(strict, saveButton);
                // if result is instance of Promise then wait for resolve or reject
                // otherwise just call handleValiationResults
                //if (results instanceof Promise) {
                if (results.then && results.catch) {
                    return new Promise(function(resolve) {
                        results
                            .then(function(results) {
                                handleValidationResults.call(this, results);
                                resolve(_.isEmpty(results));
                            }.bind(this));
                        // .catch(function() {
                        //     return resolve(false);
                        // }.bind(this));
                    }.bind(this));
                } else {
                    handleValidationResults.call(this, results);
                    return _.isEmpty(results);
                }
            } else {
                return true;
            }
        },

        toJSON: function() {
            var obj = mvp.Model.prototype.toJSON.call(this);
            if (this.notSync) {
                this.notSync.forEach(function(attributeNotSync) {
                    delete obj[attributeNotSync];
                });
            }
            return obj;
        },

        fetch: function(options) {
            // if fetch was used then set save mode to 'update'
            this.setSaveMode("update");
            return mvp.Model.prototype.fetch.call(this, _.extend({}, options, {
                success: function() {
                    if (options && options.success) {
                        var result = options.success(arguments);
                        if (result.then && result.catch) {
                            result.then(
                                function() {
                                    this.trigger('fetched', 'success', this);
                                }.bind(this));
                        } else {
                            this.trigger('fetched', 'success', this);
                        }
                    }

                }.bind(this),
                error: function() {
                    if (options && options.error) {
                        options.error(arguments);
                    }
                    this.trigger('fetched', 'error', this);
                }.bind(this)
            }));
        }
    });
});
