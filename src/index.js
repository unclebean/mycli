#!/usr/bin/env node
var pkg = require(__dirname+'/../package.json');
var parseArgs = require('minimist');
var WatchCP = require("./watch-cp/");
var HTTPServer = require("./http-server");
var HTTPProxy = require('./http-proxy');
var yaml = require('js-yaml');
var fs   = require('fs');
var colors = require('./utils/');


var _commander = ['watch-cp', 'http-server', 'http-proxy'];
var argv = parseArgs(process.argv.slice(2), opts={string:_commander, boolean:['https'], default:{port:5555, https:false}, alias:{help:'h', version:'v', extions:'e'}});

if(argv.help){
  console.log(colors.help("Welcome to use mycli %s."), pkg.version);
  console.log(colors.help("Usage:"));
  console.log(colors.help("watch-cp <source path> <destination path>"));
  console.log(colors.help("http-server <path | default will map to current execution directory> [port | default is 5555]"));
  console.log(colors.help("http-proxy <options yaml file path>"));
  console.log(colors.info("           please fellow below structure:"));
  console.log(colors.info("                 server:"));
  console.log(colors.info('                   port: "2222"'));
  console.log(colors.info('                   type: "http"'));
  console.log(colors.info('                 target:'));
  console.log(colors.info('                   host: "www.daemonology.net"'));
  console.log(colors.info('                   port: 80"'));
  process.exit(0);
}

if(argv.version){
  console.log(colors.help(pkg.version));
  process.exit(0);
}

process.on('SIGINT', function () {
  console.log(colors.warn('Got a sigint bye...'));
  process.exit(0);
});
function main(argv){
  if(argv._.indexOf(_commander[0]) > -1){
    //watch-cp
    try{
      var _src = argv._[1],
          _dest = argv._[2];
      WatchCP.monitor(_src, _dest);
    }catch(e){
      console.log(colors.error("please provide source path & destination path."));
    }
  }else if(argv._.indexOf(_commander[1]) > -1){
    //http-server
    var _port = argv.port,
        _extions = argv.extions,
        _cwd = process.cwd();
    if(argv._.length === 3){
      _port = argv._[2];
    }
    if(argv.https){
      HTTPServer.startHTTPS(argv._[1], parseInt(_port), _cwd+'/'+_extions);
    }else{
      HTTPServer.startHTTP(argv._[1], parseInt(_port), _cwd+'/'+_extions);
    }
  }else if(argv._.indexOf(_commander[2]) > -1){
    //http-proxy
    try{
      var _options = yaml.safeLoad(fs.readFileSync(argv._[1], 'utf8'));
      HTTPProxy.startup(_options);
    }catch(e){
      console.log(colors.error("Please follow readme to provide correct .yml file."));
    }
  }
}

main(argv);

module.exports = main;
