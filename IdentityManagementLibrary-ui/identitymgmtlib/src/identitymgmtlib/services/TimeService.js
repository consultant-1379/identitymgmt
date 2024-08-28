define([
    'jscore/core',
    'jscore/ext/net'
], function (core, net) {

    return {
        getServerTime: function() {
        	return new Promise(function(resolve, reject) {
	            net.ajax({
	                url: '/rest/system/time',
	                type: "GET",
	                dataType: "json",
	                success: resolve,
	                error: function(response, xhr){
	                    reject(xhr);
	                }
	            });
	        });
        }
    };
});