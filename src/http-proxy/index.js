var https = require('https'),
    http = require('http'),
    url = require('url'),
    querystring = require('querystring');
var Datastore = require('nedb'),
    db = new Datastore({ filename: './proxyDB' });
    db.loadDatabase(function (err) {});
var colors = require('../utils/');

module.exports = {
  startup:function(proxyOptions){
      var self = this,
          _port = parseInt(proxyOptions.server.port) ? proxyOptions.server.port : 5555;
          _options = proxyOptions.target,
          _proxyType = proxyOptions.server.proxyType,
          _server = http.createServer(function(req, res){
            var _data = null, _temp = [], _url = req.url;
            if(proxyOptions.server.replay){
              db.findOne({"key":new Buffer(_url).toString('base64')}, function(err, record){
                if(record){
                  res.headers = record.responseHeaders;
                  res.write(record.responseData);
                  res.end();
                  return true;
                }
              });
            }
            if(req.method === 'POST'){
              req.on('data', function(data){
                _temp.push(data);
              });
              req.on('end', function(){
                _data = querystring.parse(_temp.join(''));
                self.performRequest(_proxyType, _options, _url, req.method, req.headers, _data, function(responseStr, headers){
                  self._insertOrUpdate(_url, responseStr, headers);
                  res.headers = headers;
                  res.write(responseStr);
                  res.end();
                });
              });
            }else if(req.method === 'GET'){
              _data = url.parse(req.url);
              self.performRequest(_proxyType, _options, _url, req.method, req.headers, _data, function(responseStr, headers){
                self._insertOrUpdate(_url, responseStr, headers);
                res.headers = headers;
                res.write(responseStr);
                res.end();
              });
            }
      });

      console.log(colors.info("proxy server is running on %d..."), _port);
      _server.listen(_port);
  },
  performRequest : function(proxyType, options, endpoint, method, requestHeaders ,data, success) {
    var self = this,
        dataString = JSON.stringify(data),
        req = null,
        headers = {};

    if (method == 'POST') {
      headers = {
        'Content-Type': 'text/html',
        'Content-Length': dataString.length
      };
    }
    options.path = endpoint;
    options.method = method;
    options.headers = headers;
    if("HTTPS" === proxyType){
      req = self._createHTTPSRequest(options, success);
    }else{
      req = self._createHTTPRequest(options, success);
    }
    req.headers = requestHeaders;
    if (method == 'POST') {
      req.write(dataString);
    }else{
      req.write('');
    }
    req.end();
  },
  _createHTTPRequest : function(options, callback){
    return http.request(options, function(res) {
      res.setEncoding('utf-8');

      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {
        callback(responseString, res.headers);
      });
    });
  },
  _createHTTPSRequest : function(options, callback){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    options.agent = new https.Agent(options);
    return https.request(options, function(res) {
      res.setEncoding('utf-8');

      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {
        callback(responseString, res.headers);
      });
    });
  },
  _insertOrUpdate:function(requestURL, responseStr, responseHeaders){
    var _key = new Buffer(requestURL).toString('base64');
    db.findOne({"key": _key }, function (err, record) {
      if(record){
        db.update({"key": _key}, {"url": requestURL, "responseData":responseStr, "responseHeaders":responseHeaders}, {}, function (err, numReplaced) {});
      }else{
        db.insert({"key": _key, "url": requestURL, "responseData":responseStr, "responseHeaders":responseHeaders}, function (err, newDoc) {});
      }
    });
  }
};
