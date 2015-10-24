//var finalhandler = require('finalhandler')
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var serveStatic = require('serve-static');
var privateKey  = fs.readFileSync(__dirname + '/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

module.exports = {
  startHTTP:function(path, port){
    path = !path || path.length===0 ? __dirname : path;
    port = Number.isInteger(port) ? port : 5555;

    var app = express();
    app.use(serveStatic(path, {'index': ['default.html', 'index.html']}));
    var httpServer = http.createServer(app);
    httpServer.listen(port);
  },
  startHTTPS:function(path, port){
    path = !path || path.length===0 ? __dirname : path;
    port = Number.isInteger(port) ? port : 5555;

    var app = express();
    app.use(serveStatic(path, {'index': ['default.html', 'index.html']}));
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(port);
  }
};
