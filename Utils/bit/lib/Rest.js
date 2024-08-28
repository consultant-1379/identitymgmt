define(function () {

    var Rest = function (options) {

        var that = {};

        that.url = options.url;

        that.apply = function (server) {

            server.respondWith(
                options.method || 'GET',
                options.url,
                function (xhr) {
                    xhr.respond(
                        options.httpStatus || 200, {
                            'Content-Type': 'application/json'
                        },
                        JSON.stringify(options.data)
                    );
                    //console.log('[SERVER] respond to:', options.url);
                }
            );
        };

        return that;
    }

    return Rest;
});
