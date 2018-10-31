# Nodejs CLI TOOLS
[![Build Status](https://travis-ci.org/unclebean/mycli.svg?branch=master)](https://travis-ci.org/unclebean/mycli)
[![Coverage Status](https://coveralls.io/repos/unclebean/mycli/badge.svg?branch=master&service=github)](https://coveralls.io/github/unclebean/mycli?branch=master)
[![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
## watch & copy command:

[fs-extra](https://github.com/jprichardson/node-fs-extra), [async](https://github.com/caolan/async)
	to create a simple file and directory monitor & synchronize tool.

	mycli watch-cp <source> <destination>

## SimpleHTTPServer(like python one)
[serve-static](https://github.com/expressjs/serve-static), [express](https://github.com/strongloop/express) to provide static resouce http server, we create add extions feature. Please fellow below guide to provide extions js file.

	mycli http-server <path> <port> [--https=true] [-e extionsService.js]
---------------------------------------------------------
##### Extions definition:
| Type     | Description | 
|----------|:-----------:|
| proxy    |  1.3.0 new feature, integrate [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)  | 
| get      |  handle GET request in extion for special api or mock api  |
| post     |  handle POST request in extion for special api or mock api |

---------------------------------------------------------
##### Extions e.g: 
```
   // For proxy api extion:
	var ext = {
	    "/crservices":{
	        proxyURL:'http://staging.cross-v.me',
	        changeOrigin: true,
	        type:"proxy"
	    }
	};
	
	module.exports = ext;
```
```
   // For GET request extion:
	var ext = {
  		"/test/:name":{
    		fn:function(request, response){
      			response.send(request.params.name+' Hello World!');
    		},
    		type:"get"
  		}
	};

	module.exports = ext;
```

## HTTP Proxy
[js-yaml](https://github.com/nodeca/js-yaml), [nedb](https://github.com/louischatriot/nedb) using yaml to provide proxy configuration and using nedb to record all response data.

	mycli http-proxy <configuration file path>
------------------------------------------------------
	We can through "http://127.0.0.1:[8888]/proxyDB" to manage proxy cache data.
------------------------------------------------------
	please follow below structure to provide your yaml file:

  		---
  			server:
    			port: 8888
    			proxyType: "HTTP"             # if want to proxy HTTPS please change to HTTPS
    			replay: false				   # if want to reuse local store response, change to true
  			target:
    			host: "query.yahooapis.com"
    			port: 80
    			#key: "./privateKey.pem"      # follow nodejs api doc to provide key for HTTPS
    			#cert: "./certificate.pem"    # follow nodejs api doc to provide cert for HTTPS
    			#passphrase: "password"       # a string of passphrase for the private key

Release description
--------------------------------
1.4.1 - bug fix, (1)resolve http-proxy target server disconnect the proccess crash issue. (2)fixed recording error status response issue. (3) fixed PUT, DELETE issue.

1.4.0 - add proxy API whitelist feature

1.3.1 - minor bug fix

1.3.0 - add proxy extions in http-server 

1.2.1 - add proxy datatbase manage page - http://127.0.0.1:[port]/proxyDB


[npm-image]: https://img.shields.io/npm/v/mycli.svg
[npm-url]: https://npmjs.org/package/mycli
[downloads-image]: https://img.shields.io/npm/dm/mycli.svg
[downloads-url]: https://npmjs.org/package/mycli
