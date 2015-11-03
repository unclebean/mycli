var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);
var expect = chai.expect,
    should = chai.should();

var http = require('http');
var https = require('https');
var HTTPProxy = require("../../src/http-proxy/");

describe('HTTPProxy', function(){
  var _options = null;
  beforeEach(function(){
    _options = {
      "server":{
        "port":8888,
        "proxyType":"HTTP",
        "replay":true
      },
      "target":{
        "host":"query.yahooapis.com",
        "port":80
      }
    };
  });
  it('should create http server', function(){
    sinon.stub(http, 'createServer', function(){
      return {'listen':function(){}};
    });
    HTTPProxy.startup(_options);
    sinon.assert.calledOnce(http.createServer);
    http.createServer.restore();
  });
});
