define([
    'jscore/ext/mvp',
    'jscore/ext/utils/base/underscore'
], function(mvp, _) {

    return mvp.Collection.extend({

        isValid: function(strict) {
            if (this.validate) {
                var results = this.validate(strict);
                // if result is instance of Promise then wait for resolve or reject
                // otherwise just call handleValiationResults 
                if (results instanceof Promise) {
                    return new Promise(function(resolve) {
                        results
                            .then(function(results) {
                                //handleValidationResults.call(this, results);
                                resolve(_.isEmpty(results));
                            }.bind(this));
                            // .catch(function() {
                            //     return resolve(false);
                            // }.bind(this));
                    }.bind(this));
                } else {
                    //handleValidationResults.call(this, results);
                    return _.isEmpty(results);
                }
            } else {
                return true;
            }
        },

        fetch: function(options) {
            return mvp.Collection.prototype.fetch.call(this, _.extend({}, options, {
                success: function() {
                    if (options && options.success) {
                        options.success(arguments);
                    }
                    this.trigger('fetched', 'success', this);
                }.bind(this),
                error: function() {
                    if (options && options.error) {
                        options.error(arguments);
                    }
                    this.trigger('fetched', 'error', this);
                }.bind(this)
            }));
        },

        toJSONwithModels: function () {
            var json_array = [];
            this.each(function(model) {
                var json_model = model.toJSON();
                json_model.model = model;
                json_array.push(json_model);
            });
            return json_array;
        }

    });
});