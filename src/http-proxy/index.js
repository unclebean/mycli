var http = require('http'),
    url = require('url'),
    querystring = require('querystring');
var colors = require('../utils/');

module.exports = {
  startup:function(proxyOptions){
      var self = this,
          _port = parseInt(proxyOptions.server.port) ? proxyOptions.server.port : 5555;
          _options = proxyOptions.target,
          _server = http.createServer(function(req, res){
            var _data = null, _temp = [], _url = req.url;
            if(req.method === 'POST'){
              req.on('data', function(data){
                _temp.push(data);
              });
              req.on('end', function(){
                _data = querystring.parse(_temp.join(''));
                self.performRequest(_options, _url, req.method, _data, function(responseStr){
                  res.write(responseStr);
                  res.end();
                });
              });
            }else if(req.method === 'GET'){
              _data = url.parse(req.url);
              self.performRequest(_options, _url, req.method, _data, function(responseStr){
                res.write(responseStr);
                res.end();
              });
            }
      });

      console.log(colors.info("proxy server is running on %d..."), _port);
      _server.listen(_port);
  },
  performRequest : function(options, endpoint, method, data, success) {
    var dataString = JSON.stringify(data);
    var headers = {};

    if (method == 'GET') {
      endpoint += '?' + querystring.stringify(data);
    } else {
      headers = {
        'Content-Type': 'text/html',
        'Content-Length': dataString.length
      };
    }
    options.path = endpoint;
    options.method = method;
    options.headers = headers;
    var req = http.request(options, function(res) {
      res.setEncoding('utf-8');

      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {
        success(responseString);
      });
    });
    req.write(dataString);
    req.end();
  }
};
