# Nodejs CLI TOOLS
[![Build Status](https://travis-ci.org/unclebean/mycli.svg?branch=master)](https://travis-ci.org/unclebean/mycli)
## watch & copy command:

[commander](https://github.com/tj/commander), [fs-extra](https://github.com/jprichardson/node-fs-extra), [chokidar](https://github.com/paulmillr/chokidar)
	to create a simple file and directory monitor & synchronize tool.

	mycli watch-cp <source> <destination>

## SimpleHTTPServer(like python one)
[serve-static](https://github.com/expressjs/serve-static), [express](https://github.com/strongloop/express) to provide static resouce http server.

	mycli http-server <path> <port> [--https=true]

## HTTP Proxy(for now doesn't support https)
[js-yaml](https://github.com/nodeca/js-yaml) using yaml to provide proxy configuration.

	mycli http-proxy <configuration file path>
------------------------------------------------------
	please follow below structure to provide your yaml file:

  		server:
    		port: "2222"
    		type: "http"
  		target:
    		host: "www.daemonology.net"
    		port: 80
