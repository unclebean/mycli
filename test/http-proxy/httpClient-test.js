var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);
var expect = chai.expect,
    should = chai.should();

var http = require('http');
var https = require('https');
var httpClient = require("../../src/http-proxy/httpClient");
var RequestModel = require("../../src/http-proxy/models/requestModel");
var Datastore = require('nedb');

describe('httpClient', function(){
  var db;
  beforeEach(function(){
    db = new Datastore({ filename: './proxyDB' });
    db.loadDatabase(function (err) {});
  });
  
  describe('performRequest', function(){
    it('give "HTTPS" should call _createHTTPSRequest', function(){
      sinon.stub(httpClient, '_createHTTPSRequest', function(){});
      var requestModel = new RequestModel("HTTPS", {}, 'endpoint', 'GET', {}, {});
      httpClient.performRequest(requestModel, null);
      sinon.assert.calledOnce(httpClient._createHTTPSRequest);
      httpClient._createHTTPSRequest.restore();
    });
    it('give "HTTP" should call _createHTTPRequest', function(){
      sinon.stub(httpClient, '_createHTTPRequest', function(){});
      var requestModel = new RequestModel("HTTP", {}, 'endpoint', 'GET', {}, {});
      httpClient.performRequest(requestModel, null);
      sinon.assert.calledOnce(httpClient._createHTTPRequest);
      httpClient._createHTTPRequest.restore();
    });
  });
  it('should call http.request', function(){
    sinon.stub(http, 'request', function(args, callback){
      return {
        'write':function(){},
        'end':function(){}
      };
    });
    httpClient._createHTTPRequest({}, "", null);
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
    httpClient._createHTTPSRequest({}, "", null);
    sinon.assert.calledOnce(https.request);
    https.request.restore();
  });
});
