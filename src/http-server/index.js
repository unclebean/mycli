//var finalhandler = require('finalhandler')
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var serveStatic = require('serve-static');
var privateKey  = fs.readFileSync(__dirname + '/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var colors = require('../utils/');

module.exports = {
  startHTTP:function(path, port, extions){
    path = !path || path.length===0 ? __dirname : path;
    port = isNaN(port) ? 5555 : port;

    var app = express();
    app.use(serveStatic(path, {'index': ['default.html', 'index.html']}));
    this._mountExtions(app, extions);
    var httpServer = http.createServer(app);
    console.log(colors.info("http server is running on: http://127.0.0.1:%d/"), port);
    httpServer.listen(port);
  },
  startHTTPS:function(path, port, extions){
    path = !path || path.length===0 ? __dirname : path;
    port = isNaN(port) ? 5555 : port;

    var app = express();
    app.use(serveStatic(path, {'index': ['default.html', 'index.html']}));
    this._mountExtions(app, extions);
    var httpsServer = https.createServer(credentials, app);
    console.log(colors.info("https server is running on: https://127.0.0.1:%d/"), port);
    httpsServer.listen(port);
  },
  _mountExtions:function(app, extions){
    try{
      if(extions.length===0){
        return true;
      }
      var _ext = require(extions);
      for(var api in _ext){
        if(_ext[api].type === "post"){
          app.post(api, _ext[api].fn);
        }else{
          app.get(api, _ext[api].fn);
        }
      }
      console.log(colors.info("Extions api mount success!"));
    }catch(e){
      console.log(colors.error(e));
    }
  }
};
