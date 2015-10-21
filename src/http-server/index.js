//var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')
var express = require('express')

module.exports = {
  start:function(path, port){
    path = !path || path.length===0 ? __dirname : path;
    port = Number.isInteger(port) ? port : 5555;

    var app = express();
    app.use(serveStatic(path, {'index': ['default.html', 'default.htm']}));
    app.listen(port);
  }
};
