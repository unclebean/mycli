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
[serve-static](https://github.com/expressjs/serve-static), [express](https://github.com/strongloop/express) to provide static resouce http server.

	mycli http-server <path> <port> [--https=true]

## HTTP Proxy(for now doesn't support https)
[js-yaml](https://github.com/nodeca/js-yaml), [nedb](https://github.com/louischatriot/nedb) using yaml to provide proxy configuration and using nedb to record all response data.

	mycli http-proxy <configuration file path>
------------------------------------------------------
	please follow below structure to provide your yaml file:

  		server:
    		port: "2222"
    		type: "http"
    		proxyType: "HTTPS"
    		replay: true
  		target:
    		host: "www.daemonology.net"
    		port: 80
    		


[npm-image]: https://img.shields.io/npm/v/mycli.svg
[npm-url]: https://npmjs.org/package/mycli
[downloads-image]: https://img.shields.io/npm/dm/mycli.svg
[downloads-url]: https://npmjs.org/package/mycli