#!/usr/bin/env node
var program = require('commander');
var WatchCP = require("./watch-cp/");
var HTTPServer = require("./http-server");
var HTTPProxy = require('./http-proxy');
var yaml = require('js-yaml');
var fs   = require('fs');

program
  .version('0.0.1')
  .description('watch file change and synchronize to destinations')
  .command('watch-cp <source> [destinations...]')
  .action(function (source, destinations) {
        WatchCP.monitor(source, destinations);
   });

program
  .version('0.0.1')
  .description('simple http server')
  .command('SimpleHTTPServer <path> <port>')
  .action(function(path, port){
    HTTPServer.startHTTPS(path, Number.parseInt(port));
  });

program
    .version('0.0.1')
    .description('simple proxy http server')
    .command('http-proxy <optionsPath>')
    .action(function(optionsPath){
      try{
        var _options = yaml.safeLoad(fs.readFileSync(optionsPath, 'utf8'));
        HTTPProxy.startup(_options);
      }catch(e){
        console.log("Please follow readme to provide correct .yml file.");
      }
    });

program.parse(process.argv);

process.on('exit', function(code) {});
