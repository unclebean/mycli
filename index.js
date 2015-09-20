#!/usr/bin/env node
var program = require('commander');
var WatchCP = require("./watch-cp/");

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
  .command('SimpleHTTPServer')
  .action(function(){
  	console.log("simple http server");
  });

program.parse(process.argv);

process.on('exit', function(code) {});
