var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);
var expect = chai.expect,
    should = chai.should();

var http = require('http');
var https = require('https');
var HTTPProxy = require("../../src/http-proxy/");
var Datastore = require('nedb');

describe('HTTPProxy', function(){
  var _options = null, db;
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
    db = new Datastore({ filename: './proxyDB' });
    db.loadDatabase(function (err) {});

  });
  it('should create http server', function(){
    sinon.stub(http, 'createServer', function(){
      return {'listen':function(){}};
    });
    HTTPProxy.startup(_options);
    sinon.assert.calledOnce(http.createServer);
    http.createServer.restore();
  });
  it('should call db.update', function(){
    var spy = sinon.spy(db, 'update');
    HTTPProxy._insertOrUpdate("/mock", "{'test':'mock'}", {});
    spy.called;
  });
  describe('performRequest', function(){
    it('give "HTTPS" should call _createHTTPSRequest', function(){
      sinon.stub(HTTPProxy, '_createHTTPSRequest', function(){});
      HTTPProxy.performRequest("HTTPS", {}, 'endpoint', 'GET', {}, {}, null);
      sinon.assert.calledOnce(HTTPProxy._createHTTPSRequest);
      HTTPProxy._createHTTPSRequest.restore();
    });
    it('give "HTTP" should call _createHTTPRequest', function(){
      sinon.stub(HTTPProxy, '_createHTTPRequest', function(){});
      HTTPProxy.performRequest("HTTP", {}, 'endpoint', 'GET', {}, {}, null);
      sinon.assert.calledOnce(HTTPProxy._createHTTPRequest);
      HTTPProxy._createHTTPRequest.restore();
    });
  });
  it('should call http.request', function(){
    sinon.stub(http, 'request', function(args, callback){
      return {
        'write':function(){},
        'end':function(){}
      };
    });
    HTTPProxy._createHTTPRequest({}, "", null);
    sinon.assert.calledOnce(http.request);
    http.request.restore();
  });
  it('should call https.request', function(){
    sinon.stub(https, 'request', function(args, callback){
      return {
        'write':function(){},
        'end':function(){}
      };
    });
    HTTPProxy._createHTTPSRequest({}, "", null);
    sinon.assert.calledOnce(https.request);
    https.request.restore();
  });
});
