define([
    'jscore/core',
    'jscore/ext/net'
], function (core, net) {

    return {

        getValidationRules: function() {
        	return new Promise(function(resolve, reject) {
	            net.ajax({
	                url: "/oss/idm/usermanagement/users/validationrules/password",
	                type: "GET",
	                dataType: "json",
	                success: resolve,
	                error: function(error){
	                    console.log("Get password policies error!");
	                    console.log(error);
	                    reject(error);
	                }
	            });
	        });
        },

        getValidationRulesWithPwdAgeing: function() {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: "/oss/idm/config/passwordsettings/enmuser/passwordageing",
                    type: "GET",
                    dataType: "json",
                    success: resolve,
                    error: function(error, xhr){
                        reject(xhr);
                    }
                });
            });
        },

        validate: function(data) {
        	return new Promise(function(resolve, reject) {
	    		net.ajax({
                    url: "/oss/idm/usermanagement/users/validate/password",
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    data: data,
                    success: resolve,
                    error: function(error){
                        console.log("Post password validation error!");
                        console.log(error);
                        reject(error);
                    }
                });
	    	});
        }
    };
});

        