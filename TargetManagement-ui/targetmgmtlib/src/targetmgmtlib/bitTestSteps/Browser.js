define([
    'jscore/core'
], function(core) {

    var INTERVAL = 100;

    function waitFor(conditionFunction, timeout, timeoutMessage) {

        return new Promise(function(done, reject) {

            var hInterval = setInterval(function() {

                var output = conditionFunction();
                if (output) {
                    clearInterval(hInterval);
                    hInterval = false;
                    done(output);
                }

            }, INTERVAL);

            setTimeout(function() {
                if (hInterval) {
                    clearInterval(hInterval);
                    throw new Error(timeoutMessage || 'Timeout exceeded.');
                    // reject({
                    //     fileName: (new Error).fileName,
                    //     lineNumber: (new Error).lineNumber,
                    //     message: timeoutMessage || 'Timeout exceeded.'
                    // });
                }
            }, timeout);
        });
    }

    var Browser = {

        //Can return null, meaning we can construct isVisible-like methods
        getElement: function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                if (element.length) {
                    element = element[0];
                }
                if (!element.getNative) {
                    element = core.Element.wrap(element);
                }
                return element;
            } else {
                return null;
            }
        },

        //Same as getElement but throw meaningfull error info instead returning null
        getElementSafe: function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                if (element.length) {
                    element = element[0];
                }
                if (!element.getNative) {
                    element = core.Element.wrap(element);
                }
                return element;
            } else {
                throw new Error('Cannot find element with selector: ' + selector);
            }
        },

        getElements: function(selector) {
            var elements = document.querySelectorAll(selector);
            elements = Array.prototype.slice.call(elements, 0);
            if (elements) {
                return elements.map(function(element) {
                    return core.Element.wrap(element);
                });
            } else {
                //throw new Error('Cannot find element with selector: ' + selector);
                return null;
            }
        },

        waitForElement: function(element, timeout) {
            return waitFor(function() {
                    return Browser.getElement(element);
                },
                timeout,
                'Element ' + element + ' not found'
            );
        },

        waitForElementWithValue: function(element, value, timeout) {
            return waitFor(function() {
                    var el = Browser.getElement(element);
                    if (el && el.getText() === value.toString()) {
                        return el;
                    } else {
                        return false;
                    }
                },
                timeout,
                'Element ' + element + ' with value ' + value + ' not found'
            );
        },

        waitForIndexedElementWithValue: function(element, index, value, timeout) {
            return waitFor(function() {
                    var el = Browser.getElements(element);
                    if (el[index] && el[index].getText() === value) {
                        return el[index];
                    }
                    else {
                        return false;
                    }
                },
                timeout,
                'Element ' + element + ' with value ' + value + ' not found'
            );
        },

        waitForElementWithAttributeValue: function(element, attribute, value, timeout) {
            return waitFor(function() {
                    var el = Browser.getElement(element);
                    if (el && el.getAttribute(attribute) === value.toString()) {
                        return el;
                    } else {
                        return false;
                    }
                },
                timeout,
                'Element ' + element + ' with attribute ' + attribute + ' value ' + value + ' not found'
            );
        },

        goto: function(url) {
            throw new Error('Should be implemented');
        },

        gotoHash: function(hash) {
            if (hash)
                window.location.hash = '#' + hash;
            else
                window.location.hash = '';
        },

        back: function() {
            throw new Error('Should be implemented');
        },

        forward: function() {
            throw new Error('Should be implemented');
        }
    };

    return Browser;

});
