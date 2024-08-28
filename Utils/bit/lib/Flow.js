define(function() {

	function Flow(options) {
		if (options && options.steps) {
			this._steps = [];
			this.createFlow(options.steps);
		}
	}

	Flow.prototype.setSteps = function(steps) {
		this._steps = [];
		this.createFlow(steps);
		return this;
	};

	Flow.prototype.createFlow = function(steps) {

		var self = this;

		for (var i = 0; i < steps.length; i++) {

			var step = steps[i];

			if (step instanceof Function) {
				self._steps.push(step);
			} else if (step instanceof Array) {
				this.createFlow(step);
			} else {
				throw new Error('Wrong step type: ' + step);
			}
		}
	};

	Flow.prototype.run = function(done) {

		var self = this;

		// add done function on the end of current flow
		self._steps.push(done);

		// prepare first Promise
		var currenPromise = Promise.resolve();

		// prepare rest Promises
		for (var i = 0; i < self._steps.length; i++) {

			currenPromise = currenPromise.then(function(params) {

				return new Promise(function(resolve, reject) {

					var stepFunction = this;

					var _params = {
						resolve: resolve,
						reject: reject,
						params: params
					};

					var parmNames = stepFunction.toString().match(/^\s*function\s*.*?\s*\(\s*(.*?)\s*\)/mi)[1];
					parmNames = parmNames.split(/\s*,\s*/);

					var output;
					try {
						if (stepFunction.length === 0) {
							output = stepFunction();
							resolve(output);
						} else if (parmNames.indexOf('resolve') === -1 && parmNames.indexOf('reject') === -1) {
							output = stepFunction(_params[parmNames[0]], _params[parmNames[1]], _params[parmNames[2]]);
							resolve(output);
						} else {
							stepFunction(_params[parmNames[0]], _params[parmNames[1]], _params[parmNames[2]]);
						}
					} catch (e) {
						reject('Error in function: ' + stepFunction.name + '\n' + e);
					}

				}.bind(this)); // pass stepFunction further on this (and with this)

			}.bind(self._steps[i])); // pass current stepFunction function on this

		}

		// finally catch all errors
		currenPromise
			.catch(done);

		return currenPromise;
	};

	return Flow;
});