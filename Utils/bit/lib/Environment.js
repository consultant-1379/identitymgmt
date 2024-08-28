define([
    'jscore/core'
], function(core) {

    function Environment() {
        var self = this;

        self.RESTs = [];

        self.server = sinon.fakeServer.create();
        this.excludes = [];

    }

    Environment.extend = core.extend;

    Environment.prototype.restore = function() {

        var self = this;

        self.RESTs = [];
        this.excludes = [];

        self.server.xhr.filters = [];
        self.server.restore();

        return self;
    };

    Environment.prototype.apply = function() {

        var self = this;

        self.server.autoRespond = true;
        //self.server.autoRespondAfter = 50;
        self.server.respondImmediately = true;

        // Inverse RESTs array to have last added RESTs as most important from Sinon server point of view
        // Apply RESTs
        for (var i = self.RESTs.length; i--;) {
            self.RESTs[i].apply(self.server);
        }
        self.server.xhr.useFilters = true;
        self.server.xhr.addFilter(function(method, url) {
                //whenever the this returns true the request will not faked
                for (var i = this.excludes.length; i--;) {
                    if (url.match(this.excludes[i])) {
                        return false;
                    }
                }
                return true;
        }.bind(this));

        return self;
    };

    Environment.prototype.setup = function(environment) {
        var self = this;
        if (environment === undefined) {
            throw new Error('Environment should be defined');
        }
        self.environment = environment;
        this.excludes.push('')
        return self;
    };

    Environment.prototype.setREST = function(rest) {
        var self = this;
        self.createREST(rest);
        return self;
    };

    Environment.prototype.createREST = function(rest) {
        var self = this;
        if (rest.apply && rest.apply instanceof Function) {
            this.excludes.push(rest.url);
            self.RESTs.push(rest);
        } else if (rest instanceof Array) {
            for (var i = 0; i < rest.length; i++) {
                self.createREST(rest[i]);
                this.excludes.push(rest[i].url);
            }
        } else {
            throw new Error('Wrong rest type: ' + rest);
        }
    };

    return Environment;
});
