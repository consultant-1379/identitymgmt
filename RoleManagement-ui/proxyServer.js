var request = require('request');

var fs =   require("fs");

/*
process.argv.forEach(function (val, index, array) {
    if (val == '--proxy_protocol' && array[index+1] && array[index+1].indexOf('-') !== 0) {
        proxy_protocol = array[index+1];
    }
    if (val == '--proxy_host' && array[index+1] && array[index+1].indexOf('-') !== 0) {
        proxy_host = array[index+1];
    }
    if (val == '--proxy_port' && array[index+1] && array[index+1].indexOf('-') !== 0) {
        proxy_port = array[index+1];
    }
    if (val == '--proxy_user' && array[index+1] && array[index+1].indexOf('-') !== 0) {
        proxy_user = array[index+1];
    }
});
*/

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//Do the mappings here
module.exports = function (app) {

    var cookie;
    var cookieJar = request.jar();
    var cookieString;

    var mappings = require('./proxyMappings.json');
//http://atrcxb2920-1.athtem.eei.ericsson.se/#topologybrowser?poid=281474976739767
    var proxy_protocol= 'https';
//var proxy_host = 'localhost';
    var proxy_host = "enmapache.athtem.eei.ericsson.se";// "apache.vts.com";//
    var proxy_port = '443';
    var proxy_user = 'cdt';
    var username = "administrator";//
    var userpassword = "TestPassw0rd";//

    console.log("Posting to :" + proxy_protocol + '://' + proxy_host + '/login' );
    //Need to block until complete
    var block =true;
    request({
            method: "POST",
            uri :  'https://' + proxy_host + '/login',
           // strictSSL: false,
            //followAllRedirects : true,
            headers : {
                "Connection": "keep-alive",
                "X-Tor-UserId": "frank",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Content-Type": "application/x-www-form-urlencoded",
                "Host": proxy_host,
                "Referer":	'https://' + proxy_host + "/login/?goto=" + 'https://' + proxy_host,
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:25.0) Gecko/20100101 Firefox/25.0"

            },

            //TODO Fix this
            body : "IDToken1="+username+"&IDToken2="+userpassword+"&goto=" + proxy_host+"&gotoOnFail=" +proxy_host+ "%2Flogin%2F%3Fgoto%3D" +proxy_host+ "%26login%3Dfail%26user%3Duser",
            jar : cookie
        },

        //callback function
        function(err, httpResponse, body){
            if (err) {
                console.log("httpResponse: " + httpResponse);
                return console.error('Login Error:', err);
            }
            console.log('Login Successful:', JSON.stringify(httpResponse.headers));

            //var fullCookieString =  JSON.stringify(httpResponse.headers['set-cookie']);
            var cookieArray = httpResponse.headers['set-cookie'];
           // cookieString = fullCookieString.match(/amlbcookie=[^;]+;/)[0] + " Domain=.ericsson.se; Path=/ " + fullCookieString.match(/iPlanetDirectoryPro=[^;]+/)[0] + "; Domain=.ericsson.se; Path=/ ";
            //cookieString = fullCookieString;
           // cookie = request.cookie(cookieString);
           cookieArray.forEach(function(e){
               var cook =  request.cookie(e);
               cookieJar.setCookie(cook, proxy_protocol + '://' + proxy_host + ':' + proxy_port +"/");
           });
        }

    );

    mappings.forEach(function (mapping) {
        app.use(mapping.source, function (req, res) {

            var url = proxy_protocol + '://' + proxy_host + ':' + proxy_port +
                (mapping.dest ? mapping.dest : mapping.source) + req.url;
            console.log("CALLING URL: " + url);
            console.log(JSON.stringify(req.body));
            req.on('error', function(e) {
                console.log('problem with request: ' + e.message);
            });
            try{
                if (req.method === 'PUT') {
                    req.pipe(request.put({
                            url: url,
                            auth: {
                                'user': username,
                                pass: userpassword
                            },
                            json: req.body,
                            headers: {
                                Accept:"application/json, text/javascript, */*; q=0.01",
                                "Accept-Encoding":	"gzip, deflate",
                                "Accept-Language":	"en-gb,en;q=0.5",
                                "Host":	proxy_host,
                                "Referer":	'https://' + proxy_host,
                                "X-Requested-With":	"XMLHttpRequest",
                                "X-Tor-UserId" :"frank"
                            },
                            jar : cookieJar

                        }
                        ,function(error, response, body){
                            if(error !==null){
                                console.log("Error: " + error);
                                return null;
                            }
                            console.log("Repone headers: " + JSON.stringify(response.headers));
                            console.log("Response: " +body);
                        }
                    ),{end: false}).pipe(res);
                    console.log("Trying to PUT in server : " + url);
                    req.on('end', function() {

                        console.log("end");
                    });
                }
                else if (req.method === 'POST') {
                    req.pipe(request.post({
                            url: url,
                            auth: {
                                'user': username,
                                pass: userpassword
                            },
                            body: JSON.stringify(req.body),
                            headers: function(){
                                var headers = {
                                    Accept:"application/json, text/javascript, */*; q=0.01",
                                    "Accept-Encoding":	"gzip, deflate",
                                    "Accept-Language":	"en-gb,en;q=0.5",
                                    "Host": proxy_host,
                                    "Referer":	'https://' + proxy_host,
                                    "X-Requested-With":	"XMLHttpRequest",
                                    "X-Tor-UserId" :"frank"
                                };

                                //Forward updtae password headers
                                if(req.headers['x-openidm-username'] !== undefined){

                                    headers['X-OpenIDM-Username'] = req.headers['x-openidm-username']?req.headers['x-openidm-username']: "";
                                    headers['X-OpenIDM-New-Password'] = req.headers['X-OpenIDM-New-Password'.toLowerCase()]?req.headers['X-OpenIDM-New-Password'.toLowerCase()]: "";
                                    headers['X-OpenIDM-Reauth-Password'] = req.headers['X-OpenIDM-Reauth-Password'.toLowerCase()]?req.headers['X-OpenIDM-Reauth-Password'.toLowerCase()]: "";


                                }
                                console.log("Headers in POST REQUEST : " + JSON.stringify(headers));
                                return headers;

                            }(),
                            jar : cookieJar

                        }
                        ,function(error, response, body){
                            if(error !==null){
                                console.log("Error: " + error);
                                return null;
                            }
                            console.log("Repone headers: " + JSON.stringify(response.headers));
                            console.log("Response: " +response.body);
                        }
                    ),{end: false}).pipe(res);
                    console.log("Trying to POST to server : " + url);
                    req.on('end', function() {
                        console.log("end");
                    });
                }else {

                   // console.log("Cookie string : " + cookie);
                    //cookieJar.setCookie(cookie, proxy_protocol + '://' + proxy_host + ':' + proxy_port +"/");
                    req.pipe(request({
                            url: function(){
                                console.log("URL: " + url);
                                if(url.indexOf("/editprofile/")>= 0){
                                    console.log("Trimming url".toUpperCase());
                                    return url.slice(0,url.length-1);
                                }
                                else{
                                    return url;
                                }
                            }(),

                            headers: function(){
                                var headers =
                                {
                                        Accept:"application/json, text/javascript, */*; q=0.01",
                                        "Accept-Encoding":	"gzip, deflate",
                                        "Accept-Language":	"en-gb,en;q=0.5",
                                        "Host": proxy_host,
                                        "Referer":	'https://' + proxy_host,
                                        "X-Requested-With":	"XMLHttpRequest",
                                        "X-Tor-UserId" :"frank"
                                };
                                console.log("Username headers: " +  JSON.stringify(req.headers));
                                if(req.headers['x-usernames'] !== undefined){

                                    headers['X-Usernames'] = req.headers['x-usernames']?req.headers['x-usernames']: "";
                                }
                                if(req.headers["X-OpenIDM-Username".toLowerCase()] !== undefined){

                                    headers['X-OpenIDM-Username'] = req.headers["X-OpenIDM-Username".toLowerCase()]?req.headers["X-OpenIDM-Username".toLowerCase()]: "";
                                    headers["X-OpenIDM-Reauth-Password"] = req.headers["X-OpenIDM-Reauth-Password".toLowerCase()]?req.headers["X-OpenIDM-Reauth-Password".toLowerCase()]: "";
                                }
                                console.log("Headers in GET REQUEST : " + JSON.stringify(headers));
                                return headers;
                            }(),
                            jar : cookieJar

                        }
                        ,
                        function(error, response, body){
                           if(error !==null){
                               console.log("Error: " + error);
                               return null;
                           }
                            console.log("Repone headers: " + JSON.stringify(response.headers));
                           console.log("Response: " +body);
                        }
                    )).pipe(res);
                    console.log("Trying GET from server : " + url);
                }
            }catch(e){
                console.log("Exception: "+e + " , Calling url: " + url);
            }
        });
    });


};
